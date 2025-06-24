<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Illuminate\Validation\ValidationException;

class TeamController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'designation' => 'nullable|string|max:255',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'is_active' => 'boolean'
            ]);

            $team = Team::create([
                'name' => $request->name,
                'designation' => $request->designation,
                'is_active' => $request->is_active ?? false,
            ]);

            if ($request->hasFile('image')) {
                $team->addMediaFromRequest('image')->toMediaCollection('images');
            }
            return response()->json([
                'message' => 'Project created successfully.'
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation Error.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Something went wrong.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index(Request $request)
    {
        $query = Team::query();
        if ($request->has('is_active')) {
            $isActive = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN);
            $query->where('is_active', $isActive);
        }
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                    ->orWhere('designation', 'like', "%{$searchTerm}%");
            });
        }
        if ($request->has('per_page')) {
            $teams = $query->paginate($request->input('per_page'));
        } else {
            $teams = $query->get();
        }

        $formattedProjects = $teams->map(function ($team) {
            return $this->formatProjectResponse($team);
        });
        return response()->json($formattedProjects);
    }

    public function show($id)
    {
        $team = Team::findOrFail($id);
        return response()->json($this->formatProjectResponse($team));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'designation' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
            'is_active' => 'boolean'
        ]);

        $team = Team::findOrFail($id);

        $team->update([
            'name' => $request->name,
            'designation' => $request->designation,
            'is_active' => $request->is_active ?? $team->is_active,
        ]);

        if ($request->hasFile('image')) {
            $team->clearMediaCollection('images');
            $team->addMediaFromRequest('image')
                ->toMediaCollection('images');
        }
        return response()->json($this->formatProjectResponse($team));
    }

    public function destroy($id)
    {
        $team = Team::findOrFail($id);
        $team->delete();
        return response()->json(null, 204);
    }

    /**
     * Format the project response with media information
     *
     * @param Team $team
     * @return array
     */
    public function formatProjectResponse(Team $team): array
    {
        $media = $team->getMedia('images')->first();

        return [
            'id' => $team->id,
            'name' => $team->name,
            'designation' => $team->designation,
            'is_active' => $team->is_active,
            'created_at' => $team->created_at,
            'updated_at' => $team->updated_at,
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
