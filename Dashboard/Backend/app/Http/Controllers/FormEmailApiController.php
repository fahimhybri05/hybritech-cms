<?php

namespace App\Http\Controllers;

use App\Models\CommonForm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\FormSubmissionMail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class FormEmailApiController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'is_active' => 'required|boolean',
                'full_name' => 'required|string|max:255',
                'project_name' => 'required|string|max:255',
                'project_type' => 'required|string|max:255',
                'description' => 'required|string',
                'email' => 'required|email|max:255',
                'project_budget' => 'required|string|max:10',
            ]);

            DB::beginTransaction();
            $commonForm = CommonForm::create([
                'is_active' => $validated['is_active'],
                'full_name' => $validated['full_name'],
                'project_name' => $validated['project_name'],
                'project_type' => $validated['project_type'],
                'description' => $validated['description'],
                'email' => $validated['email'],
                'project_budget' => $validated['project_budget'],
            ]);
            Mail::to(env('MAIL_TO', 'default@example.com'))
                ->send(new FormSubmissionMail($commonForm));

            DB::commit();

            return response()->json([
                'message' => 'Form submitted successfully!',
                'data' => $commonForm,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to submit form',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}
