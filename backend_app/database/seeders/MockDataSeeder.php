<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Prestataire;
use App\Models\Post;
use App\Models\PostLike;
use App\Models\Comment;
use App\Models\Domaine;

class MockDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Domains if not exist
        $domaines = ['Plomberie', 'Électricité', 'Nettoyage', 'Jardinage', 'Mécanique', 'Coiffure', 'Maquillage', 'Cuisine'];
        foreach ($domaines as $nom) {
            Domaine::firstOrCreate(
                ['nom_domaine' => $nom],
                ['description' => "Services de $nom"]
            );
        }

        // 2. Create Regular Users
        // Assuming factories exist, if not we fall back to create
        for ($i = 0; $i < 20; $i++) {
            User::create([
                'name' => 'User ' . $i,
                'surname' => 'Test',
                'email' => "user{$i}@example.com",
                'password' => Hash::make('password'),
                'role' => 'client',
                'created_at' => now()->subDays(rand(1, 60)), // Spread over 2 months
            ]);
        }

        // 3. Create Prestataires (Users + Prestataire profile)
        for ($i = 0; $i < 10; $i++) {
            $user = User::create([
                'name' => 'Prestataire ' . $i,
                'surname' => 'Pro',
                'email' => "provider{$i}@example.com",
                'password' => Hash::make('password'),
                'role' => 'client', // logic in controller might set role, but here we just create
                'created_at' => now()->subDays(rand(1, 60)),
            ]);

            $prestataire = Prestataire::create([
                'user_id' => $user->id,
                'description' => 'Un prestataire professionnel expérimenté.',
                'tarif_horaire' => rand(5000, 20000),
                'disponibilite' => 'Lundi - Samedi, 8h - 18h',
                'created_at' => $user->created_at,
            ]);
            
            // Attach random domains
            $domaineIds = Domaine::inRandomOrder()->take(rand(1, 3))->pluck('id');
            $prestataire->domaines()->attach($domaineIds, ['niveau_expertise' => 'Avancé']);

            // Create Posts for this provider
            for ($j = 0; $j < rand(1, 5); $j++) {
                Post::create([
                    'prestataire_id' => $prestataire->id,
                    'titre' => "Projet réalisé #{$j}",
                    'contenu' => "Voici une description de mon travail réalisé pour un client.",
                    'created_at' => now()->subDays(rand(1, 30)),
                ]);
            }
        }
    }
}
