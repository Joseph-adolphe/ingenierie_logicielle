<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        User::updateOrCreate(
            ['email' => 'admin@gmail.com'], // Vérifie si existe déjà
            [
                'name' => 'Super',
                'surname' => 'Admin',
                'phone' => '677667766',
                'city' => 'Yaoundé',
                'country' => 'Cameroon',
                'birthday' => '2000-01-01',
                'role' => 'admin',
                'profile_picture' => null,
                'password' => Hash::make('password123'), // Change plus tard
            ]
        );
    }
}
