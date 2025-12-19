<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Domaine extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom_domaine',
        'description'
    ];

    public function prestataires()
    {
        return $this->belongsToMany(Prestataire::class, 'domaine_prestataire')
            ->withPivot('niveau_expertise')   // ★ important
            ->withTimestamps();
    }

}
