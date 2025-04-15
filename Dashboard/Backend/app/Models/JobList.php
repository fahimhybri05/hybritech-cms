<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobList extends Model
{
    protected $fillable = [
        'title',
        'header_description',
        'job_description',
        'is_active',
    ];
    protected $casts = [
        'is_active' => 'boolean',
    ];
}
