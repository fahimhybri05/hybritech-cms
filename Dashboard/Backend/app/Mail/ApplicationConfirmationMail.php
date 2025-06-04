<?php

namespace App\Mail;

use App\Models\JobApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class ApplicationConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $jobApplication;

    public function __construct(JobApplication $jobApplication)
    {
        $this->jobApplication = $jobApplication;
    }


 public function build()
      {
          return $this
                   ->from(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'))
              ->subject('Thanks for your application')
              ->view('emails.applicant_confirmation');
              
      }
}