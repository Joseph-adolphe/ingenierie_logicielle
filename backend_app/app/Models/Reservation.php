<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'prestataire_id',
        'reservation_date',
        'description',
        'status',
        'location',
    ];

    protected $casts = [
        'reservation_date' => 'datetime',
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
