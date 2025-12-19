<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    //
    protected $table = 'posts';

    protected $fillable = [
        'prestataire_id',
        'titre',
        'contenu',
    ];

    public function prestataire()
    {
        return $this->belongsTo(Prestataire::class);
    }

    public function images()
    {
        return $this->hasMany(PostImage::class);
    }

    public function likes()
    {
        return $this->hasMany(PostLike::class);
    }

    public function isLikedBy(User $user)
    {
        return $this->likes()->where('user_id', $user->id)->exists();
    }

    public function comments()
    {
        return $this->hasMany(Comment::class)->whereNull('parent_id');
    }
}
