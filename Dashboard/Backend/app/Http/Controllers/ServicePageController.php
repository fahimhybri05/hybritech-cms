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
            ]);
    
            // Create the service page (without image yet)
            $servicePage = ServicePageDetails::create([
                'title' => $request->title,
                'description' => $request->description,
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
    
    // Get all service pages
    public function index()
    {
        $servicePages = ServicePageDetails::all();
        $formattedServicePages = $servicePages->map(function ($servicePage) {
            return $this->formatServicePageResponse($servicePage);
        });
        return response()->json($formattedServicePages);
    }

    // Get a specific service page
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
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048'
        ]);

        $servicePage = ServicePageDetails::findOrFail($id);

        $servicePage->update([
            'title' => $request->title,
            'description' => $request->description,
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
public function count()
{
    $count = ServicePageDetails::count();
    return response()->json([
        dd($response),
        'count' => $count
    ]);
}
}