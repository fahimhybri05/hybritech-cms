<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\HasMedia;

class Team extends Model implements HasMedia
{
    use InteractsWithMedia {
        media as protected trait_media;
    }

    protected $guarded = [];
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('image');
    }
}
