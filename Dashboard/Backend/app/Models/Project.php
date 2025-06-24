<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Project extends Model implements HasMedia
{
    use InteractsWithMedia;
    
    protected $fillable = ['is_active', 'title', 'subtitle', 'description', 'media'];
    protected $casts = [
        'is_active' => 'boolean',
    ];
    
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('projects');
    }
}
