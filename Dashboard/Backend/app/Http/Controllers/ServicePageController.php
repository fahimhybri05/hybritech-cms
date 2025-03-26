<?php

namespace App\Http\Controllers;

use App\Models\ServicePageDetails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ServicePageController extends Controller
{
    // Store a new service page (picture with title and description)
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048'
        ]);

        $imagePath = $request->file('image')->store('images', 'public');

        $servicePage = ServicePageDetails::create([
            'title' => $request->title,
            'description' => $request->description,
            'image_path' => $imagePath,
        ]);

        return response()->json($servicePage, 201);
    }

    // Get all service pages
    public function index()
    {
        $servicePages = ServicePageDetails::all();
        return response()->json($servicePages);
    }

    // Get a specific service page
    public function show($id)
    {
        $servicePage = ServicePageDetails::findOrFail($id);
        return response()->json($servicePage);
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

        if ($request->hasFile('image')) {
            // Delete the old image if there's a new one
            Storage::delete('public/' . $servicePage->image_path);
            $imagePath = $request->file('image')->store('images', 'public');
            $servicePage->image_path = $imagePath;
        }

        $servicePage->update([
            'title' => $request->title,
            'description' => $request->description,
        ]);

        return response()->json($servicePage);
    }

    // You might also want to add a delete method
    public function destroy($id)
    {
        $servicePage = ServicePageDetails::findOrFail($id);
        
        // Delete the associated image
        Storage::delete('public/' . $servicePage->image_path);
        
        $servicePage->delete();
        
        return response()->json(null, 204);
    }
}