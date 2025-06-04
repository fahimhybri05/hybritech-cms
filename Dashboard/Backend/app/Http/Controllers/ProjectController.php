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
        $odataFilter = $request->input('$filter');
        $isOdataRequest = !empty($odataFilter);
        $query = Project::query()->with('media'); // Eager load media

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

        // Handle pagination response
        return response()->json($request->has('per_page') ? $projects->setCollection($formattedProjects) : $formattedProjects);
    }

    public function show($id)
    {
        $project = Project::with('media')->findOrFail($id); // Fix: Fetch single project by ID
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
            'delete_images.*' => 'sometimes|numeric'
        ]);

        $project = Project::findOrFail($id);
        $project->update($validated);

        // Delete requested images
        if ($request->has('delete_images')) {
            Media::whereIn('id', $request->delete_images)
                ->where('model_id', $project->id)
                ->where('model_type', Project::class)
                ->where('collection_name', 'projects')
                ->delete();
        }

        // Add new images
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
        $project->delete(); // Media is automatically deleted by Spatie MediaLibrary

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
        $media = $project->getMedia('projects'); // Use 'projects' and get all media

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