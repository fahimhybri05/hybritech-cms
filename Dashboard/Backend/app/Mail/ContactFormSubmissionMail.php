<?php

namespace App\Mail;

use App\Models\ContactUsForm;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class ContactFormSubmissionMail extends Mailable
{
    use Queueable, SerializesModels;

    public $contactUsForm;
  
      public function __construct(ContactUsForm $contactUsForm)
      {
              $this->contactUsForm = $contactUsForm;
      }
  
      public function build()
      {
          return $this
              ->from(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'))
              ->subject($this->contactUsForm->subject)
              ->view('emails.contact_form');
              
      } 
}
