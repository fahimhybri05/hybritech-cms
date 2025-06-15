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
            'project' => $this->formatProjectResponse($project->load('media'))
        ]);
    }

    public function index(Request $request)
    {
        $query = Project::query()->with('media');
        
        if ($request->has('is_active')) {
            $isActive = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN);
            $query->where('is_active', $isActive);
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

        return response()->json($request->has('per_page') ? $projects->setCollection($formattedProjects) : $formattedProjects);
    }

    public function show($id)
    {
        $project = Project::with('media')->findOrFail($id);
        return response()->json($this->formatProjectResponse($project));
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string|max:255',
            'description' => 'required|string',
            'is_active' => 'required|boolean',
            'images.*' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            'remove_existing_images.*' => 'sometimes|numeric'
        ]);

        $project = Project::findOrFail($id);
        $project->update($validated);

        if ($request->has('remove_existing_images')) {
            Media::whereIn('id', $request->remove_existing_images)
                ->where('model_id', operator: $project->id)
                ->where('model_type', Project::class)
                ->where('collection_name', 'projects')
                ->delete();
        }

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $project->addMedia($image)->toMediaCollection('projects');
            }
        }

        return response()->json([
            'message' => 'Project updated successfully',
            'project' => $this->formatProjectResponse($project->load('media'))
        ]);
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();
        return response()->json(null, 204);
    }

    /**
     * Format the project response with media information
     *
     * @param Project $project
     * @return array
     */
    protected function formatProjectResponse(Project $project): array
    {
        $media = $project->getMedia('projects');
        return [
            'id' => $project->id,
            'title' => $project->title,
            'subtitle' => $project->subtitle,
            'description' => $project->description,
            'is_active' => $project->is_active,
            'created_at' => $project->created_at,
            'updated_at' => $project->updated_at,
            'media' => $media->map(function ($media) {
                return [
                    'id' => $media->id,
                    'name' => $media->name,
                    'file_name' => $media->file_name,
                    'mime_type' => $media->mime_type,
                    'size' => $media->size,
                    'original_url' => $media->getUrl(),
                    'thumbnail_url' => $media->hasGeneratedConversion('thumb') ? $media->getUrl('thumb') : null
                ];
            })->toArray()
        ];
    }
}
