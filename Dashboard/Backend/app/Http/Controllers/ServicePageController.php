<?php

namespace App\Http\Controllers;

use App\Models\ServicePageDetails;
use Illuminate\Http\Request;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class ServicePageController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Validate the input fields
            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                 'is_active' => 'boolean'
            ]);
    
            // Create the service page (without image yet)
            $servicePage = ServicePageDetails::create([
                'title' => $request->title,
                'description' => $request->description,
                'is_active' => $request->is_active ?? false,
            ]);
    
            // Check if image exists and upload it to media collection
            if ($request->hasFile('image')) {
                $servicePage->addMediaFromRequest('image')->toMediaCollection('images');

            }
    
            // Return response
            return response()->json([
                'message' => 'Service Page created successfully.'
            ], 201);
    
        } catch (\Illuminate\Validation\ValidationException $e) {
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
   
               $odataFilter = $request->input('$filter');
            $isOdataRequest = !empty($odataFilter);
             $query = ServicePageDetails::query();
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
        $query->where(function($q) use ($searchTerm) {
            $q->where('title', 'like', "%{$searchTerm}%")
              ->orWhere('description', 'like', "%{$searchTerm}%");
        });
    }
    if ($request->has('per_page')) {
        $servicePages = $query->paginate($request->input('per_page'));
    } else {
        $servicePages = $query->get();
    }
    
    $formattedServicePages = $servicePages->map(function ($servicePage) {
        return $this->formatServicePageResponse($servicePage);
    });
    
    return response()->json($formattedServicePages);
}
    public function show($id)
    {
        $servicePage = ServicePageDetails::findOrFail($id);
        return response()->json($this->formatServicePageResponse($servicePage));
    }

    // Update a service page
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
            'is_active' => 'boolean'
        ]);
                  
        $servicePage = ServicePageDetails::findOrFail($id);
    
        $servicePage->update([
            'title' => $request->title,
            'description' => $request->description,
                 'is_active' => $request->is_active ?? $servicePage->is_active,
        ]);

        if ($request->hasFile('image')) {
            // Clear the old media and add the new one
            $servicePage->clearMediaCollection('images');
            $servicePage->addMediaFromRequest('image')
                ->toMediaCollection('images');
        }

        return response()->json($this->formatServicePageResponse($servicePage));
    }

    // You might also want to add a delete method
    public function destroy($id)
    {
        $servicePage = ServicePageDetails::findOrFail($id);
        
        // The media will be automatically deleted by Spatie Media Library
        $servicePage->delete();
        
        return response()->json(null, 204);
    }
    
    /**
     * Format the service page response with media information
     *
     * @param ServicePageDetails $servicePage
     * @return array
     */
    public function formatServicePageResponse(ServicePageDetails $servicePage): array
    {
        $media = $servicePage->getMedia('images')->first();
        
        return [
            'id' => $servicePage->id,
            'title' => $servicePage->title,
            'description' => $servicePage->description,
            'is_active' => $servicePage->is_active,
            'created_at' => $servicePage->created_at,
            'updated_at' => $servicePage->updated_at,
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