<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Prestataire;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    //
    // Lister les avis d'un prestataire
    public function index($prestataire_id)
    {
        $reviews = Review::where('prestataire_id', $prestataire_id)
            ->with('user:id,name,surname,avatar') // Eager load user details
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'reviews' => $reviews
        ]);
    }

    // Créer une note + commentaire
    public function store(Request $request, $prestataire_id)
    {
        $prestataire = Prestataire::find($prestataire_id);

        if (!$prestataire) {
            return response()->json(['message' => 'Prestataire introuvable'], 404);
        }

        // Validation
        $validated = $request->validate([
            'note' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string'
        ]);

        // Vérifier qu'un user ne note pas deux fois
        $existing = Review::where('user_id', $request->user()->id)
            ->where('prestataire_id', $prestataire_id)
            ->first();

        if ($existing) {
            return response()->json([
                'status' => false,
                'message' => 'Vous avez déjà laissé une note à ce prestataire.'
            ], 409);
        }

        // Création de la review
        $review = Review::create([
            'user_id' => $request->user()->id,
            'prestataire_id' => $prestataire_id,
            'note' => $validated['note'],
            'comment' => $validated['comment'] ?? null
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Avis enregistré avec succès',
            'review' => $review
        ]);
    }

    // Modifier sa note
    public function update(Request $request, $id)
    {
        $review = Review::find($id);

        if (!$review) {
            return response()->json(['message' => 'Avis introuvable'], 404);
        }

        // Vérifier propriétaire
        if ($review->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $validated = $request->validate([
            'note' => 'sometimes|integer|min:1|max:5',
            'comment' => 'sometimes|nullable|string'
        ]);

        $review->update($validated);

        return response()->json([
            'status' => true,
            'message' => 'Avis modifié',
            'review' => $review
        ]);
    }

    // Supprimer
    public function destroy(Request $request, $id)
    {
        $review = Review::find($id);

        if (!$review) {
            return response()->json(['message' => 'Avis introuvable'], 404);
        }

        // Vérifier propriétaire
        if ($review->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $review->delete();

        return response()->json([
            'status' => true,
            'message' => 'Avis supprimé',
        ]);
    }
}
