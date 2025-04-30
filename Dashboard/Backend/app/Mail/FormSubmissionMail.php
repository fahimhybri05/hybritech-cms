<?php

namespace App\Mail;

use App\Models\CommonForm;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class FormSubmissionMail extends Mailable
{
    use Queueable, SerializesModels;

  public $commonForm;

    public function __construct(CommonForm $commonForm)
    {
            $this->commonForm = $commonForm;
    }

    public function build()
    {
        return $this
            ->from(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'))
            ->subject('New Project Idea Submitted')
            ->view('emails.form_data');
            
    } 
}
