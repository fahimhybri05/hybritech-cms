<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebPages extends Model
{
        protected $fillable = [
        'title',
        'is_active',
    ];
    protected $casts = [
        'is_active' => 'boolean',
    ];
}
