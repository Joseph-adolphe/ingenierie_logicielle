<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    //
    protected $table = 'reviews';

    protected $fillable = [
        'user_id',
        'prestataire_id',
        'note',
        'comment',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function prestataire()
    {
        return $this->belongsTo(Prestataire::class);
    }
}
