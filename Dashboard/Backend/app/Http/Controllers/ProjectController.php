<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class ProjectController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string|max:255',
            'description' => 'required|string',
            'is_active' => 'required|boolean',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $project = Project::create($validated);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $project->addMedia($image)->toMediaCollection('projects');
            }
        }

        return response()->json([
            'message' => 'Project created successfully',
            'media' => $project->getMedia('projects')
        ]);
    }

    public function index(Request $request)
    {

        $odataFilter = $request->input('$filter');
        $isOdataRequest = !empty($odataFilter);
        $query = Project::query();
        if ($isOdataRequest) {
            if (str_contains($odataFilter, 'is_active eq true')) {
                $query->where('is_active', true);
            } elseif (str_contains($odataFilter, 'is_active eq false')) {
                $query->where('is_active', false);
            }
        } else {
            if ($request->has('is_active')) {
                $isActive = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN);
                $query->where('is_active', $isActive);
            }
        }
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                    ->orWhere('subtitle', 'like', "%{$searchTerm}%")
                    ->orWhere('description', 'like', "%{$searchTerm}%");
            });
        }
        if ($request->has('per_page')) {
            $projects = $query->paginate($request->input('per_page'));
        } else {
            $projects = $query->get();
        }

        $formattedProjects = $projects->map(function ($project) {
            return $this->formatProjectResponse($project);
        });

        return response()->json($formattedProjects);
    }

    public function show($id)
    {
        $project = Project::findOrFail($id);
        return response()->json($this->formatProjectResponse($project));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
            'is_active' => 'boolean'
        ]);

        $project = Project::findOrFail($id);

        $project->update([
            'title' => $request->title,
            'subtitle' => $request->subtitle,
            'description' => $request->description,
            'is_active' => $request->is_active ?? $project->is_active,
        ]);

        if ($request->hasFile('image')) {
            // Clear the old media and add the new one
            $project->clearMediaCollection('images');
            $project->addMediaFromRequest('image')
                ->toMediaCollection('images');
        }

        return response()->json($this->formatProjectResponse($project));
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);

        // The media will be automatically deleted by Spatie Media Library
        $project->delete();

        return response()->json(null, 204);
    }

    /**
     * Format the project response with media information
     *
     * @param Project $project
     * @return array
     */
    public function formatProjectResponse(Project $project): array
    {
        $media = $project->getMedia('images')->first();

        return [
            'id' => $project->id,
            'title' => $project->title,
            'subtitle' => $project->subtitle,
            'description' => $project->description,
            'is_active' => $project->is_active,
            'created_at' => $project->created_at,
            'updated_at' => $project->updated_at,
            'media' => $media ? [
                [
                    'id' => $media->id,
                    'name' => $media->name,
                    'file_name' => $media->file_name,
                    'mime_type' => $media->mime_type,
                    'size' => $media->size,
                    'original_url' => $media->getUrl(),
                ]
            ] : [],
        ];
    }
}
