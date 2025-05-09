<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Project extends Model implements HasMedia
{
    use InteractsWithMedia;
    
    protected $fillable = ['title', 'subtitle', 'description', 'media'];
    
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('image');
    }
}
