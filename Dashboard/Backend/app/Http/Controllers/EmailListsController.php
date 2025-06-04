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
                 $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'designation' => 'required|string',
                'address' => 'required|string',
                'interview_date' => 'required|date_format:Y-m-d H:i:s',
            ]);

            DB::beginTransaction();
            $emailList = EmailList::create([
                'application_id' => $request->application_id,
                'name' => $request->name,
                'email' => $request->email,
                'designation' => $request->designation,
                'address' => $request->address,
                'interview_date' => Carbon::parse($request->interview_date)->format('Y-m-d H:i:s'),
            ]);
    
       $emaildata = Mail::to(env('MAIL_TO', $emailList->email))
                ->send(new InterviewMail($emailList));
        
           if($emaildata){
                DB::table('job_applications')
                    ->where('id', $emailList->application_id)
                    ->update(['is_email_sent' => 1]);

                     DB::table('email_list')
                    ->where('id', $emailList->id)
                    ->update(['is_email_sent' => 1]);
           }     

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
   public function emailedSentCandidateList(Request $request)
{
    try {
        $odataFilter = $request->input('$filter');
        $isOdataRequest = !empty($odataFilter);

        $query = EmailList::where('is_email_sent', true);

        if ($request->has('is_active')) {
            $isActive = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN);
            $query->where('is_active', $isActive);
        }

        if ($request->has('search') && !empty($request->input('search'))) {
            $searchTerm = $request->input('search');
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('email', 'like', "%{$searchTerm}%")
                  ->orWhere('designation', 'like', "%{$searchTerm}%")
                  ->orWhere('address', 'like', "%{$searchTerm}%");
            });
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

        if ($isOdataRequest) {
            $top = $request->input('$top', 20);
            $skip = $request->input('$skip', 0);
            $results = $query->skip($skip)->take($top)->get();
            
            return response()->json([
                '@odata.context' => $request->url(),
                'value' => $results,
                '@odata.count' => $query->count()
            ]);
        } 
        else {
            $perPage = $request->input('per_page', 20);
            $results = $query->paginate($perPage);
            
            return response()->json($results);
        }

    } catch (\Exception $e) {
        Log::error('Failed to retrieve email list: ' . $e->getMessage());
        return response()->json([
            'message' => 'Failed to retrieve email list',
            'error' => $e->getMessage()
        ], 500);
    }
}
        public function destroy($id)
    {
        try {
            $emailList = EmailList::findOrFail($id);
            $emailList->delete();

            return response()->json([
                'message' => 'Email deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to delete email: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete email',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
