<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Domaine;
use Illuminate\Http\Request;

class DomaineController extends Controller
{
    public function index()
    {
        return Domaine::withCount('prestataires')->paginate(12);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom_domaine' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $domaine = Domaine::create($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Domaine créé',
            'domaine' => $domaine
        ], 201);
    }

    public function show($id)
    {
        $domaine = Domaine::findOrFail($id);
        return $domaine;
    }

    public function update(Request $request, $id)
    {
        $domaine = Domaine::findOrFail($id);
        if (!$domaine) {
            return response()->json(['message' => 'Domaine non trouvé'], 404);
        }

        $request->validate([
            'nom_domaine' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $domaine->nom_domaine = $request->nom_domaine;
        $domaine->description = $request->description;
        $domaine->save();

        return response()->json(['message' => 'Domaine mis a jour avec succes', 'domaine' => $domaine]);
    }

    public function destroy($id)
    {
        $domaine = Domaine::findOrFail($id);
        $domaine->delete();

        return response()->json([
            'status' => true,
            'message' => 'Domaine supprimé'
        ]);
    }
}
