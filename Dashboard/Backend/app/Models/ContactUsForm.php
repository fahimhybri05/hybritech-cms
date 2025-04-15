<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactUsForm extends Model
{
    use HasFactory;

    protected $fillable = [
        'is_read',
        'full_name',
        'number',
        'email',
        'description',
    ];
    protected $casts = [
        'is_read' => 'boolean',
    ];
}