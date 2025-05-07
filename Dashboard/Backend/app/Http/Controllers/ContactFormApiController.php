<?php

namespace App\Http\Controllers;

use App\Models\ContactUsForm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\FormSubmissionMail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use App\Mail\ContactFormSubmissionMail;

class ContactFormApiController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'is_active' => 'required|boolean',
                'full_name' => 'required|string|max:255',
                'subject' => 'required|string|max:255',
                'description' => 'required|string',
                'email' => 'required|email|max:255',
                'number' => 'required|string|min:10',
            ]);

            DB::beginTransaction();
            $contactUsForm = ContactUsForm::create([
                'is_active' => $validated['is_active'],
                'full_name' => $validated['full_name'],
                'subject' => $validated['subject'],
                'description' => $validated['description'],
                'email' => $validated['email'],
                'number' => $validated['number'],
            ]);
            Mail::to(env('MAIL_TO', 'default@example.com'))
                ->send(new ContactFormSubmissionMail($contactUsForm));

            DB::commit();

            return response()->json([
                'message' => 'Form submitted successfully!',
                'data' => $contactUsForm,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to submit form',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
