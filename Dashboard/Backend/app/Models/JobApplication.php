<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    protected $fillable = [
        'is_active',
        'is_selected',
        'isemail_sent',
        'designation',
        'experience',
        'full_name',
        'email',
        'number',
        'attachment',
        'selected_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
         'is_selected' => 'boolean',
        'isemail_sent' => 'boolean',
        'selected_at' => 'datetime',
    ];
}