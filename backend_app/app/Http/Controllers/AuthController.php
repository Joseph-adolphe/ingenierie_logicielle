<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    //fonction d'inscription
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'birthday' => 'nullable|date',
            'password' => 'required|string|min:6',
            'role' => 'required|in:client,prestataire',
            'profile_picture' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        return response()->json([
            'message' => 'Utilisateur créé avec succès',
            'user' => $user
        ], 201);
    }

    //fonction de connexion
    public function login(Request $request){
        //logique de connexion
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        //recuperer les informations de l'utilisateur
        $user = User::where('email', $request->email)->first();

        //verifier si l'email existe
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Email incorrect'
            ], 401);
        }

        // Vérification du mot de passe
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Mot de passe incorrect'
            ], 401);
        }

        $user->tokens()->delete();

        // Générer un token sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        // Retourner la réponse
        return response()->json([
            'status' => true,
            'message' => 'Connexion réussie',
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer'
        ], 200);

    }

    //fonction de profil
    public function profile(Request $request){
        //si c'est un pestataire
        $user = $request->user(); // Utilisateur connecté

        // Charger les relations si l'utilisateur est prestataire
        if ($user->prestataire) {
            $user->load([
                'prestataire.domaines' => function ($query) {
                    $query->select('domaines.id', 'nom_domaine')
                        ->withPivot('niveau_expertise'); // charge niveau_experience
                }
            ]);
        }

        return response()->json([
            'status' => true,
            'user' => $user
        ]);
    }

    //fonction de deconnexion
    public function logout(Request $request){
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie'
        ], 200);
    }
}
