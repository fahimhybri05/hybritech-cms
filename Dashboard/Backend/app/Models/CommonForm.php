<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommonForm extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'project_name',
        'email',
        'project_type',
        'project_budget',
        'description',
    ];
}
