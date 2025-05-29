<?php

namespace App\Http\Controllers;

use App\Models\EmailList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\InterviewMail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class EmailListsController extends Controller
{
       public function store(Request $request)
    {
        try {
            $emailList = EmailList::create([
                'application_id' => $request->application_id,
                'name' => $request->name,
                'email' => $request->email,
                'designation' => $request->designation,
                'address' => $request->address,
                'interview_date' => Carbon::parse($request->interview_date)->format('Y-m-d H:i:s'),
            ]);
    
            Mail::to(env('MAIL_TO', 'default@example.com'))
                ->send(new InterviewMail($emailList));

            DB::commit();

            return response()->json([
                'message' => 'email sent successfully!',
                'data' => $emailList,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Something went wrong.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
