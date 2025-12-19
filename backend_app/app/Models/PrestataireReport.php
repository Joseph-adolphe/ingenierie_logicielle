<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrestataireReport extends Model
{
    //
    protected $table = 'prestataire_reports';
    
    protected $fillable = [
        'prestataire_id',
        'user_id',
        'raison',
    ];
    public function prestataire()
    {
        return $this->belongsTo(Prestataire::class);
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
