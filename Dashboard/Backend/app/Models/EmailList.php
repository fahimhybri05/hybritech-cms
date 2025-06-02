<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailList extends Model
{
     protected $fillable = [
        'application_id',
        'name',
        'email',
        'designation',
        'address',
        'interview_date',
    ];
    protected $table = 'email_list';
}
