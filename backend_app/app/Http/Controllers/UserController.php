<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('prestataire.domaines');

        // Filter by type
        if ($request->has('type')) {
            if ($request->type === 'prestataire') {
                $query->whereHas('prestataire');
            } elseif ($request->type === 'client') {
                $query->whereDoesntHave('prestataire');
            }
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('surname', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhereHas('prestataire.domaines', function($q) use ($search) {
                      $q->where('nom_domaine', 'like', "%{$search}%");
                  });
            });
        }

        $perPage = $request->input('per_page', 10);
        $users = $query->latest()->paginate($perPage);
        
        return response()->json($users);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé avec succès']);
    }

    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }
        return response()->json($user);
    }

    public function updateStatus(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $user->is_active = $request->is_active;
        $user->save();

        return response()->json(['message' => 'Statut de l\'utilisateur mis à jour avec succès', 'user' => $user]);
    }

    public function updateProfile(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'surname' => 'sometimes|required|string|max:255',
            'phone' => 'sometimes|required|string|max:20',
            'city' => 'sometimes|nullable|string|max:100',
            'country' => 'sometimes|nullable|string|max:100',
            'birthday' => 'sometimes|nullable|date',
            'locality' => 'sometimes|nullable|string',
            'profile_picture' => 'sometimes|nullable|image|max:2048', // 2MB Max
        ]);

        $data = $request->except('profile_picture');

        // Handle File Upload
        if ($request->hasFile('profile_picture')) {
            // Delete old image if exists and not default (logic to be added if needed, for now just overwrite)
            
            $file = $request->file('profile_picture');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('profile_pictures', $filename, 'public'); // Stores in storage/app/public/profile_pictures
            
            $data['profile_picture'] = $path;
        }

        $user->update($data);
        return response()->json(['message' => 'Utilisateur mis à jour avec succès', 'user' => $user]);
    }

    //modifier le mot de passe
    public function updatePassword(Request $request)
    {

        $request->validate([
            'old_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json(['message' => 'Ancien mot de passe incorrect'], 400);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Statut de l\'utilisateur mis à jour avec succès']);
    }

}


