<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class ServicePageDetails extends Model implements HasMedia
{
    use InteractsWithMedia;
    
    protected $fillable = ['title', 'description'];
    
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('images')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/jpg', 'image/png', 'image/gif']);
    }
}
