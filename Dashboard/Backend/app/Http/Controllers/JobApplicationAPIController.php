<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\JobApplicationSubmittedMail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class JobApplicationAPIController extends Controller
{
    /**
     * Store a new job application with file and send email.
     */
    public function store(Request $request)
    {
        try {
            // Validate incoming request
            $validated = $request->validate([
                'is_active' => 'required|boolean',
                'designation' => 'required|string|max:255',
                'experience' => 'required|string|max:255',
                'full_name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'number' => 'required|string|regex:/^([0-9\s\-\+\(\)]*)$/|min:10',
                'attachment' => 'required|file|max:10240', // Any file, max 10MB
            ]);

            DB::beginTransaction();

            // Store the file
            $filePath = $request->file('attachment')->store('attachments', 'public');

            // Create job application
            $jobApplication = JobApplication::create([
                'is_active' => $validated['is_active'],
                'designation' => $validated['designation'],
                'experience' => $validated['experience'],
                'full_name' => $validated['full_name'],
                'email' => $validated['email'],
                'number' => $validated['number'],
                'attachment' => $filePath,
            ]);

            // Send email with attachment
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
            \Log::error('Job application submission failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to submit job application',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Retrieve all job applications with pagination.
     */
    public function index()
    {
        try {
            $jobApplications = JobApplication::paginate(10)->through(function ($jobApplication) {
                return [
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
                ];
            });

            return response()->json($jobApplications);
        } catch (\Exception $e) {
            \Log::error('Failed to retrieve job applications: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to retrieve job applications'], 500);
        }
    }

    /**
     * Retrieve a specific job application.
     */
    public function show($id)
    {
        try {
            $jobApplication = JobApplication::find($id);

            if (!$jobApplication) {
                return response()->json(['message' => 'Job application not found'], 404);
            }

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
            \Log::error('Failed to retrieve job application: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to retrieve job application'], 500);
        }
    }

    /**
     * Download the attachment of a specific job application.
     */
    public function downloadAttachment($id)
    {
        try {
            $jobApplication = JobApplication::find($id);

            if (!$jobApplication) {
                return response()->json(['message' => 'Job application not found'], 404);
            }

            if (!Storage::disk('public')->exists($jobApplication->attachment)) {
                return response()->json(['message' => 'Attachment not found'], 404);
            }

            return Storage::disk('public')->download($jobApplication->attachment);
        } catch (\Exception $e) {
            \Log::error('Failed to download attachment: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to download attachment'], 500);
        }
    }

    /**
     * Delete a specific job application.
     */
    public function destroy($id)
    {
        try {
            $jobApplication = JobApplication::find($id);

            if (!$jobApplication) {
                return response()->json(['message' => 'Job application not found'], 404);
            }

            // Delete the file
            Storage::disk('public')->delete($jobApplication->attachment);

            // Delete the record
            $jobApplication->delete();

            return response()->json(['message' => 'Job application deleted successfully'], 200);
        } catch (\Exception $e) {
            \Log::error('Failed to delete job application: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to delete job application'], 500);
        }
    }
}