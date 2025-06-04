<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory,HasApiTokens,HasRoles;

    protected $fillable = [
        'name', 'email', 'password', 'position','image_url'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];
}
