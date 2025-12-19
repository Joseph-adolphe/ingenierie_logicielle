<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Prestataire;
use App\Models\Domaine;

class UserProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Regular Users (Clients)
        $clients = [
            ['name' => 'Foka', 'surname' => 'Evariste', 'city' => 'Yaoundé'],
            ['name' => 'Ngo', 'surname' => 'Marie', 'city' => 'Douala'],
            ['name' => 'Talla', 'surname' => 'Jean', 'city' => 'Bafoussam'],
            ['name' => 'Abena', 'surname' => 'Therese', 'city' => 'Yaoundé'],
            ['name' => 'Eto\'o', 'surname' => 'Samuel', 'city' => 'Douala'],
            ['name' => 'Bello', 'surname' => 'Hamadou', 'city' => 'Garoua'],
            ['name' => 'Ndikum', 'surname' => 'Peter', 'city' => 'Bamenda'],
            ['name' => 'Efoko', 'surname' => 'Rose', 'city' => 'Bertoua'],
            ['name' => 'Lambo', 'surname' => 'Simon', 'city' => 'Edéa'],
            ['name' => 'Kenfack', 'surname' => 'Luc', 'city' => 'Bafoussam'],
        ];

        foreach ($clients as $c) {
            User::create([
                'name' => $c['name'],
                'surname' => $c['surname'],
                'email' => strtolower($c['name'] . '.' . $c['surname']) . "@email.com",
                'password' => Hash::make('password123'),
                'role' => 'client',
                'country' => 'Cameroun',
                'city' => $c['city'],
                'is_active' => true,
            ]);
        }

        // 2. Create Prestataires (Users + Prestataire profile)
        $providers = [
            ['name' => 'Kamga', 'surname' => 'Maurice', 'city' => 'Douala', 'domaine' => 'Plomberie', 'desc' => 'Plombier expert à Douala, disponible pour urgences.'],
            ['name' => 'Biya', 'surname' => 'Chantal', 'city' => 'Yaoundé', 'domaine' => 'Coiffure', 'desc' => 'Salon de coiffure mobile haute gamme.'],
            ['name' => 'Atangana', 'surname' => 'Paul', 'city' => 'Yaoundé', 'domaine' => 'Électricité', 'desc' => 'Électricien certifié avec 15 ans d\'expérience.'],
            ['name' => 'Muna', 'surname' => 'Akere', 'city' => 'Bamenda', 'domaine' => 'Nettoyage', 'desc' => 'Services de nettoyage industriel et résidentiel.'],
            ['name' => 'Zambo', 'surname' => 'Anguissa', 'city' => 'Garoua', 'domaine' => 'Mécanique', 'desc' => 'Spécialiste moteurs diesel et entretien auto.'],
        ];

        foreach ($providers as $p) {
            $user = User::create([
                'name' => $p['name'],
                'surname' => $p['surname'],
                'email' => strtolower($p['name'] . '.' . $p['surname']) . ".pro@email.com",
                'password' => Hash::make('password123'),
                'role' => 'client',
                'country' => 'Cameroun',
                'city' => $p['city'],
                'is_active' => true,
            ]);

            $prestataire = Prestataire::create([
                'user_id' => $user->id,
                'description' => $p['desc'],
                'tarif_horaire' => rand(3000, 15000),
                'disponibilite' => 'Lundi - Samedi, 8h - 18h',
            ]);

            // Attach domain
            $domaine = Domaine::where('nom_domaine', $p['domaine'])->first();
            if ($domaine) {
                $prestataire->domaines()->attach($domaine->id, ['niveau_expertise' => 'Expert']);
            }
        }
    }
}
