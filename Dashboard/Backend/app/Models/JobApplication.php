<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    protected $fillable = [
        'is_active',
        'designation',
        'experience',
        'full_name',
        'email',
        'number',
        'attachment',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}