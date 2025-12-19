<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prestataire extends Model
{
    //
    protected $table = 'prestataires';

    protected $fillable = [
        'user_id',
        'description',
        'disponibilite',
        'tarif_horaire',
        'order',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function domaines()
    {
        return $this->belongsToMany(Domaine::class, 'domaine_prestataire')
                    ->withPivot('niveau_expertise')
                    ->withTimestamps();
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    // Moyenne automatique des notes
    public function getRatingAttribute()
    {
        return round($this->reviews()->avg('note'), 1);
    }
}
