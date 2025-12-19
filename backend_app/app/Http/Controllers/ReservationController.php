<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Prestataire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ReservationController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'prestataire_id' => 'required|exists:prestataires,id',
            'reservation_date' => 'required|date|after:now',
            'description' => 'required|string',
            'location' => 'required|string',
        ]);

        $reservation = Reservation::create([
            'user_id' => Auth::id(),
            'prestataire_id' => $request->prestataire_id,
            'reservation_date' => $request->reservation_date,
            'description' => $request->description,
            'location' => $request->location,
            'status' => 'pending',
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Réservation envoyée avec succès',
            'reservation' => $reservation
        ], 201);
    }

    /**
     * Display a listing of the resource for the authenticated user (Client).
     */
    public function myReservations()
    {
        $userId = Auth::id();
        $reservations = Reservation::where('user_id', $userId)
            ->with(['prestataire.user', 'prestataire.domaines']) // Load provider details
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'reservations' => $reservations
        ]);
    }

    /**
     * Display a listing of the resource for the authenticated provider.
     */
    public function providerReservations()
    {
        $user = Auth::user();
        if (!$user->is_prestataire) {
            return response()->json(['status' => false, 'message' => 'Non autorisé'], 403);
        }

        // Get the provider profile associated with the user
        $prestataire = Prestataire::where('user_id', $user->id)->first();

        if (!$prestataire) {
            return response()->json(['status' => false, 'message' => 'Profil prestataire introuvable'], 404);
        }

        $reservations = Reservation::where('prestataire_id', $prestataire->id)
            ->with('user') // Load client details
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'reservations' => $reservations
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:accepted,refused,cancelled,completed',
        ]);

        $reservation = Reservation::findOrFail($id);
        $user = Auth::user();

        // Check authorization:
        // Provider can accept/refuse/complete
        // Client can cancel

        $prestataire = Prestataire::find($reservation->prestataire_id);
        $isProvider = $prestataire && $prestataire->user_id === $user->id;
        $isClient = $reservation->user_id === $user->id;

        if ($request->status === 'cancelled') {
            if (!$isClient && !$isProvider) {
                return response()->json(['status' => false, 'message' => 'Non autorisé'], 403);
            }
        } elseif (in_array($request->status, ['accepted', 'refused', 'completed'])) {
            if (!$isProvider) {
                return response()->json(['status' => false, 'message' => 'Seul le prestataire peut effectuer cette action'], 403);
            }
        }

        $reservation->update(['status' => $request->status]);

        return response()->json([
            'status' => true,
            'message' => 'Statut mis à jour',
            'reservation' => $reservation
        ]);
    }
}
