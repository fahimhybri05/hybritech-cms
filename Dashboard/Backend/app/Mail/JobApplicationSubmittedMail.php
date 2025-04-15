<?php

namespace App\Mail;

use App\Models\JobApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class JobApplicationSubmittedMail extends Mailable
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
            ->subject('New Job Application Submitted')
            ->view('emails.job_application_submitted')
            ->attachFromStorageDisk('public', $this->jobApplication->attachment, basename($this->jobApplication->attachment));
    }
}