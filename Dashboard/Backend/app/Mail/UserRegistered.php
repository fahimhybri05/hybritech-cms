<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserRegistered extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $password;

    public function __construct(User $user, $password)
    {
        $this->user = $user;
        $this->password = $password;
    }

    public function build()
    {
        return $this->subject('Welcome to Our Application!')
                    ->view('emails.user_registered')
                    ->with([
                        'name' => $this->user->name,
                        'email' => $this->user->email,
                        'position' => $this->user->position,
                        'image_url' => $this->user->image_url,
                        'password' => $this->password,
                    ]);
    }
}