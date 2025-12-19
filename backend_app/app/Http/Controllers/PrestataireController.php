<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Prestataire;
use Illuminate\Http\Request;
use App\Models\PrestataireReport;

class PrestataireController extends Controller
{
    //Liste de tous les prestataires
    public function index()
    {
        //
        $prestataires = Prestataire::with(['user', 'domaines'])->get();
        return response()->json($prestataires);
    }

    //voir mon profil prestataire
    public function showMyProfile(Request $request)
    {
        $user = $request->user();
        $prestataire = $user->prestataire;
        return response()->json($prestataire);
    }

   public function create(Request $request, $id)
    {
        // Vérifier que l'utilisateur existe
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Utilisateur introuvable'
            ], 404);
        }

        // Validation
        $validated = $request->validate([
            'description' => 'required|string',
            'disponibilite' => 'nullable|string',
            'tarif_horaire' => 'nullable|numeric',
            'order' => 'nullable|string',

            // domaines = liste d'objets
            'domaines' => 'nullable|array',
            'domaines.*.id' => 'required|exists:domaines,id',
            'domaines.*.niveau_expertise' => 'required|string',
        ]);

        // Vérifier si déjà prestataire
        if ($user->prestataire) {
            return response()->json([
                'status' => false,
                'message' => 'Cet utilisateur a déjà un compte prestataire'
            ], 400);
        }

        // Création du prestataire
        $prestataire = Prestataire::create([
            'user_id' => $id,
            'description' => $validated['description'],
            'disponibilite' => $validated['disponibilite'] ?? null,
            'tarif_horaire' => $validated['tarif_horaire'] ?? null,
            'order' => $validated['order'] ?? null,
        ]);

        //changer le role de l'utilisateur
        $user->role = 'prestataire';
        $user->save();

        // --- Gestion des domaines + niveau d'expérience ---
        if (!empty($validated['domaines'])) {

            $syncData = [];

            foreach ($validated['domaines'] as $domaine) {
                $syncData[$domaine['id']] = [
                    'niveau_expertise' => $domaine['niveau_expertise']
                ];
            }

            // sync avec pivot
            $prestataire->domaines()->sync($syncData);
        }

        return response()->json([
            'status' => true,
            'message' => 'Compte prestataire créé avec succès',
            'prestataire' => $prestataire->load('domaines')
        ], 201);
    }

    //voir details d'un prestataire
    public function show($id)
    {
        $prestataire = Prestataire::with('user', 'domaines')->find($id);
        if (!$prestataire) {
            return response()->json(['message' => 'Prestataire non trouvé'], 404);
        }
        return response()->json($prestataire);
    }

    // voir details d'un prestataire par user_id
    public function showByUserId($userId)
    {
        $prestataire = Prestataire::with('user', 'domaines')->where('user_id', $userId)->first();
        if (!$prestataire) {
            return response()->json(['message' => 'Prestataire non trouvé'], 404);
        }
        return response()->json(['status' => true, 'prestataire' => $prestataire]);
    }

    //modifier les domaines d'un prestataire
    public function updateDomaines(Request $request, $id)
    {
        $prestataire = Prestataire::find($id);

        if (!$prestataire) {
            return response()->json(['message' => 'Prestataire non trouvé'], 404);
        }

        if ($request->user()->id !== $prestataire->user_id) {
            return response()->json([
                'status' => false,
                'message' => 'Vous n\'êtes pas autorisé à modifier ce compte prestataire'
            ], 403);
        }

        // Validation des données
        $validated = $request->validate([
            'domaines' => 'required|array',
            'domaines.*.id' => 'required|exists:domaines,id',
            'domaines.*.niveau_expertise' => 'required|string',
        ]);

        // Préparation des données pour la table pivot
        $syncData = [];
        foreach ($validated['domaines'] as $domaine) {
            $syncData[$domaine['id']] = [
                'niveau_expertise' => $domaine['niveau_expertise']
            ];
        }

        // Mise à jour des domaines du prestataire
        $prestataire->domaines()->sync($syncData);
        $prestataire->order = null; // Réinitialiser l'ordre
        $prestataire->save();

        return response()->json([
            'status' => true,
            'message' => 'Domaines mis à jour avec succès',
            'prestataire' => $prestataire->load('domaines')
        ]);
    }

    //Ajouter un domaine
    public function addDomaine(Request $request, $id)
    {
        $prestataire = Prestataire::find($id);

        if (!$prestataire) {
            return response()->json(['message' => 'Prestataire non trouvé'], 404);
        }

        if ($request->user()->id !== $prestataire->user_id) {
            return response()->json([
                'status' => false,
                'message' => 'Vous n\'êtes pas autorisé à modifier ce compte prestataire'
            ], 403);
        }

        // Validation des données
        $validated = $request->validate([
            'domaine_id' => 'required|exists:domaines,id',
            'niveau_expertise' => 'required|string',
        ]);

        // Ajout du domaine avec niveau d'expertise
        $prestataire->domaines()->attach($validated['domaine_id'], [
            'niveau_expertise' => $validated['niveau_expertise']
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Domaine ajouté avec succès',
            'prestataire' => $prestataire->load('domaines')
        ]);
    }

    //Supprimer un domaine
    public function removeDomaine(Request $request, $id)
    {
        $prestataire = Prestataire::find($id);
        if (!$prestataire) {
            return response()->json(['message' => 'Prestataire non trouvé'], 404);
        }

        if ($request->user()->id !== $prestataire->user_id) {
            return response()->json([
                'status' => false,
                'message' => 'Vous n\'êtes pas autorisé à modifier ce compte prestataire'
            ], 403);
        }

        // Validation des données
        $validated = $request->validate([
            'domaine_id' => 'required|exists:domaines,id',
        ]);
        // Suppression du domaine
        $prestataire->domaines()->detach($validated['domaine_id']);
        return response()->json([
            'status' => true,
            'message' => 'Domaine supprimé avec succès',
            'prestataire' => $prestataire->load('domaines')
        ]);
    }

    //modifier les informations du prestataire
    public function update(Request $request, $id)
    {
        $prestataire = Prestataire::find($id);
        if (!$prestataire) {
            return response()->json(['message' => 'Prestataire non trouvé'], 404);
        }
        if ($request->user()->id !== $prestataire->user_id) {
            return response()->json([
                'status' => false,
                'message' => 'Vous n\'êtes pas autorisé à modifier ce compte prestataire'
            ], 403);
        }
        // Validation des données
        $validated = $request->validate([
            'description' => 'sometimes|required|string',
            'disponibilite' => 'sometimes|nullable|string',
            'tarif_horaire' => 'sometimes|nullable|numeric',
            'order' => 'sometimes|nullable|string',
        ]);
        // Mise à jour des informations
        $prestataire->update($validated);
        return response()->json([
            'status' => true,
            'message' => 'Informations du prestataire mises à jour avec succès',
            'prestataire' => $prestataire
        ]);;
    }

    //signaler un prestataire
    public function reportPrestataire(Request $request, $id)
    {
        $prestataire = Prestataire::find($id);

        if (!$prestataire) {
            return response()->json(['message' => 'Prestataire non trouvé'], 404);
        }

        $validated = $request->validate([
            'raison' => 'nullable|string|max:255'
        ]);

        // Empêcher plusieurs signalements par le même utilisateur
        $exists = PrestataireReport::where('prestataire_id', $prestataire->id)
                                ->where('user_id', $request->user()->id)
                                ->first();

        if ($exists) {
            return response()->json([
                'status' => false,
                'message' => 'Vous avez déjà signalé ce prestataire'
            ], 409);
        }

        // Enregistrement du signalement
        PrestataireReport::create([
            'prestataire_id' => $prestataire->id,
            'user_id' => $request->user()->id,
            'raison' => $validated['raison'] ?? null,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Prestataire signalé avec succès'
        ]);
    }

    public function search(Request $request)
    {
        $query = Prestataire::query()->with(['domaines', 'user']);

        if ($request->has('name')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->name . '%');
            });
        }

        if ($request->has('domaine_id')) {
            $query->whereHas('domaines', function ($q) use ($request) {
                $q->where('domaine_id', $request->domaine_id);
            });
        }

        if ($request->has('city')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('city', 'like', '%' . $request->city . '%');
            });
        }

        if ($request->has('niveau')) {
            $query->whereHas('domaines', function ($q) use ($request) {
                $q->where('niveau_expertise', $request->niveau);
            });
        }

        if ($request->has('max_tarif')) {
            $query->where('tarif_horaire', '<=', $request->max_tarif);
        }

        $results = $query->get();

        return response()->json([
            'status' => true,
            'prestataires' => $results
        ]);
    }

    //afficher les domaines du prestataire
    public function getDomaines($id)
    {

        $prestataire = Prestataire::where('user_id', $id)->first();
        if (!$prestataire) {
            return response()->json(['message' => 'Prestataire non trouvé'], 404);
        }
        return response()->json([
            'status' => true,
            'message' => 'Domaines du prestataire',
            'domaines' => $prestataire->domaines
        ]);
    }

}
