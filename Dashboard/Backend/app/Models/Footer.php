<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Footer extends Model
{
    use HasFactory;

    protected $fillable = [
        'icon',
        'name',
        'link',
        'is_active',
    ];
    protected $casts = [
        'is_active' => 'boolean',
    ];
}
