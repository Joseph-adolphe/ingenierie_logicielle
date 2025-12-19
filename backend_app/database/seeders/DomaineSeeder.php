<?php

namespace Database\Seeders;

use App\Models\Domaine;
use Illuminate\Database\Seeder;

class DomaineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $domaines = [
            'Plomberie', 
            'Électricité', 
            'Nettoyage', 
            'Jardinage', 
            'Mécanique', 
            'Coiffure', 
            'Maquillage', 
            'Cuisine',
            'Informatique',
            'Peinture',
            'Menuiserie',
            'Serrurerie'
        ];

        foreach ($domaines as $nom) {
            Domaine::firstOrCreate(
                ['nom_domaine' => $nom],
                ['description' => "Services de $nom"]
            );
        }
    }
}
