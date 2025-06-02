<?php
namespace App\Mail;
use App\Models\EmailList;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class InterviewMail extends Mailable
{
    use Queueable, SerializesModels;

    public $emailList;
  
      public function __construct(EmailList $emailList)
      {
              $this->emailList = $emailList;
      }
  
      public function build()
      {
          return $this
              ->from(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'))
              ->subject('Interview Scheduled for ' . $this->emailList->designation)
              ->view('emails.interviewemail');
              
      }
}
