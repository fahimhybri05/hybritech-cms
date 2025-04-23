<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\JobApplicationSubmittedMail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class JobApplicationAPIController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'is_active' => 'required|boolean',
                'designation' => 'required|string|max:255',
                'experience' => 'required|string|max:255',
                'full_name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'number' => 'required|string|regex:/^([0-9\s\-\+\(\)]*)$/|min:10',
                'attachment' => 'required|file|max:10240',
            ]);

            DB::beginTransaction();
            $filePath = $request->file('attachment')->store('attachments', 'public');
            $jobApplication = JobApplication::create([
                'is_active' => $validated['is_active'],
                'designation' => $validated['designation'],
                'experience' => $validated['experience'],
                'full_name' => $validated['full_name'],
                'email' => $validated['email'],
                'number' => $validated['number'],
                'attachment' => $filePath,
            ]);
            Mail::to(env('JOB_APPLICATION_RECIPIENT', 'default@example.com'))
                ->send(new JobApplicationSubmittedMail($jobApplication));

            DB::commit();

            return response()->json([
                'message' => 'Job application submitted successfully!',
                'data' => $jobApplication,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            if (isset($filePath)) {
                Storage::disk('public')->delete($filePath);
            }
            Log::error('Job application submission failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to submit job application',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function index(Request $request)
    {
        try {
            $odataFilter = $request->input('$filter');
            $isOdataRequest = !empty($odataFilter);

            $query = JobApplication::query();
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
            if ($request->has('$orderby')) {
                $orderBy = explode(' ', $request->input('$orderby'));
                $query->orderBy($orderBy[0], $orderBy[1] ?? 'asc');
            } elseif ($request->has('sort_by')) {
                $query->orderBy(
                    $request->input('sort_by'),
                    $request->input('sort_dir', 'asc')
                );
            }
            if ($request->has('search') && !empty($request->input('search'))) {
                $searchTerm = $request->input('search');
                $query->where(function($q) use ($searchTerm) {
                    $q->where('full_name', 'like', "%{$searchTerm}%")
                      ->orWhere('email', 'like', "%{$searchTerm}%")
                      ->orWhere('designation', 'like', "%{$searchTerm}%")
                      ->orWhere('experience', 'like', "%{$searchTerm}%")
                      ->orWhere('number', 'like', "%{$searchTerm}%");
                });
            }
            if ($isOdataRequest) {
                $top = $request->input('$top', 20);
                $skip = $request->input('$skip', 0);
                $query->skip($skip)->take($top);
                $results = $query->get();
                
                return response()->json([
                    '@odata.context' => $request->url(),
                    'value' => $results,
                    '@odata.count' => $query->count()
                ]);
            } else {
                $perPage = $request->input('per_page', 20);
                $results = $query->paginate($perPage);
                
                return response()->json($results);
            }

        } catch (\Exception $e) {
            Log::error('Failed to retrieve job applications: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve job applications',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $jobApplication = JobApplication::findOrFail($id);

            return response()->json([
                'data' => [
                    'id' => $jobApplication->id,
                    'is_active' => $jobApplication->is_active,
                    'designation' => $jobApplication->designation,
                    'experience' => $jobApplication->experience,
                    'full_name' => $jobApplication->full_name,
                    'email' => $jobApplication->email,
                    'number' => $jobApplication->number,
                    'attachment_url' => Storage::disk('public')->url($jobApplication->attachment),
                    'created_at' => $jobApplication->created_at,
                    'updated_at' => $jobApplication->updated_at,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to retrieve job application: ' . $e->getMessage());
            return response()->json([
                'message' => 'Job application not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function downloadAttachment($id)
    {
        try {
            $jobApplication = JobApplication::findOrFail($id);

            if (!Storage::disk('public')->exists($jobApplication->attachment)) {
                return response()->json(['message' => 'Attachment not found'], 404);
            }

            return Storage::disk('public')->download($jobApplication->attachment);
        } catch (\Exception $e) {
            Log::error('Failed to download attachment: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to download attachment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $jobApplication = JobApplication::findOrFail($id);
            Storage::disk('public')->delete($jobApplication->attachment);
            $jobApplication->delete();

            return response()->json([
                'message' => 'Job application deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to delete job application: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete job application',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $jobApplication = JobApplication::findOrFail($id);

            $validated = $request->validate([
                'is_active' => 'sometimes|boolean',
                'designation' => 'sometimes|string|max:255',
                'experience' => 'sometimes|string|max:255',
                'full_name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|max:255',
                'number' => 'sometimes|string|regex:/^([0-9\s\-\+\(\)]*)$/|min:10',
                'attachment' => 'sometimes|file|max:10240',
            ]);

            DB::beginTransaction();

            $filePath = null;
            if ($request->hasFile('attachment')) {
                // Delete the old attachment if it exists
                if ($jobApplication->attachment) {
                    Storage::disk('public')->delete($jobApplication->attachment);
                }
                // Store the new attachment
                $filePath = $request->file('attachment')->store('attachments', 'public');
                $validated['attachment'] = $filePath;
            }

            $jobApplication->update($validated);

            DB::commit();

            return response()->json([
                'message' => 'Job application updated successfully!',
                'data' => [
                    'id' => $jobApplication->id,
                    'is_active' => $jobApplication->is_active,
                    'designation' => $jobApplication->designation,
                    'experience' => $jobApplication->experience,
                    'full_name' => $jobApplication->full_name,
                    'email' => $jobApplication->email,
                    'number' => $jobApplication->number,
                    'attachment_url' => $jobApplication->attachment ? Storage::disk('public')->url($jobApplication->attachment) : null,
                    'created_at' => $jobApplication->created_at,
                    'updated_at' => $jobApplication->updated_at,
                ],
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            if (isset($filePath)) {
                Storage::disk('public')->delete($filePath);
            }
            Log::error('Failed to update job application: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update job application',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}