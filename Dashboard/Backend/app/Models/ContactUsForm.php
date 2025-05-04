<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactUsForm extends Model
{
    use HasFactory;

    protected $fillable = [
        'is_active',
        'full_name',
        'subject',
        'number',
        'email',
        'description',
    ];
    protected $casts = [
        'is_active' => 'boolean',
    ];
}