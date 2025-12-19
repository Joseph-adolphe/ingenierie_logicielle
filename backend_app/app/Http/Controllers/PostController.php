<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\PostLike;
use App\Models\PostImage;
use App\Models\PostReport;
use App\Models\Prestataire;
use Illuminate\Http\Request;

class PostController extends Controller
{
    //
    public function store(Request $request, $id)
    {
        $prestataire = Prestataire::find($id);

        if (!$prestataire) {
            return response()->json(['message' => 'Prestataire non trouvé'], 404);
        }

        // Vérifie que l'utilisateur connecté est bien le propriétaire
        if ($request->user()->id !== $prestataire->user_id) {
            return response()->json([
                'status' => false,
                'message' => 'Vous n\'êtes pas autorisé à publier sur ce compte'
            ], 403);
        }

        // Validation
        $validated = $request->validate([
            'titre' => 'nullable|string',
            'contenu' => 'nullable|string',
            'images' => 'nullable',
            'images.*' => 'file'
        ]);

        // Création du post
        $post = Post::create([
            'prestataire_id' => $prestataire->id,
            'titre' => $validated['titre'] ?? null,
            'contenu' => $validated['contenu'] ?? null,
        ]);

        // Sauvegarde des images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $img) {
                $path = $img->store('posts', 'public');

                PostImage::create([
                    'post_id' => $post->id,
                    'image_path' => $path,
                ]);
            }
        }

        return response()->json([
            'status' => true,
            'message' => 'Post créé avec succès',
            'post' => $post->load('images')
        ]);
    }

    //voir les posts d'un prestataire
    public function index(Request $request, $id)
    {
        $prestataire = Prestataire::find($id);

        if (!$prestataire) {
            return response()->json(['message' => 'Prestataire non trouvé'], 404);
        }

        $posts = Post::where('prestataire_id', $prestataire->id)
                    ->with('images')
                    ->withCount(['likes', 'comments'])
                    ->get();
        
        // Add is_liked
        $user = $request->user('sanctum');
        if ($user) {
            $posts->each(function ($post) use ($user) {
                $post->is_liked = $post->isLikedBy($user);
            });
        }

        return response()->json([
            'status' => true,
            'posts' => $posts
        ]);
    }

    //voir un post
    public function show($id)
    {
        $post = Post::with('images')->withCount(['likes', 'comments'])->find($id);

        if (!$post) {
            return response()->json(['message' => 'Post non trouvé'], 404);
        }

        return response()->json([
            'status' => true,
            'post' => $post
        ]);
    }


    //voir tous les posts (feed global)
    public function allPosts(Request $request)
    {
        $posts = Post::with(['images', 'prestataire.user'])
                    ->withCount(['likes', 'comments'])
                    ->latest()
                    ->get();
        
        // Ajouter un attribut is_liked pour l'utilisateur courant s'il est authentifié
        $user = $request->user('sanctum');
        if ($user) {
            $posts->each(function ($post) use ($user) {
                $post->is_liked = $post->isLikedBy($user);
            });
        }

        return response()->json([
            'status' => true,
            'posts' => $posts
        ]);
    }

    //recherher un post
    public function search(Request $request)
    {
        // Vérification du paramètre "query"
        $request->validate([
            'query' => 'required|string|min:2'
        ]);

        $query = $request->input('query');

        // Recherche dans titre ET contenu
        $posts = Post::where(function ($q) use ($query) {
                $q->where('titre', 'like', "%{$query}%")
                ->orWhere('contenu', 'like', "%{$query}%");
            })
            ->with('images') // Charger relation images
            ->withCount(['likes', 'comments'])
            ->get();

        return response()->json([
            'status' => true,
            'count' => $posts->count(),
            'results' => $posts
        ]);
    }

    //voir mes posts (prestataire connecté)
    public function myPosts(Request $request)
    {
        $prestataire = Prestataire::where('user_id', $request->user()->id)->first();
        if (!$prestataire) {
            return response()->json(['message' => 'Vous n\'êtes pas un prestataire'], 404);
        }
        $posts = Post::where('prestataire_id', $prestataire->id)
                    ->with('images')
                    ->withCount(['likes', 'comments'])
                    ->latest()
                    ->get();
        
        return response()->json([
            'status' => true,
            'posts' => $posts
        ]);;
    }

    //supprimer mon post
    public function destroy(Request $request, $id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json(['message' => 'Post non trouvé'], 404);
        }

        $prestataire = Prestataire::where('user_id', $request->user()->id)->first();
        if (!$prestataire || $post->prestataire_id !== $prestataire->id) {
            return response()->json([
                'status' => false,
                'message' => 'Vous n\'êtes pas autorisé à supprimer ce post'
            ], 403);
        }

        // Suppression des images associées
        foreach ($post->images as $image) {
            // Supprimer le fichier physique si nécessaire
            // Storage::disk('public')->delete($image->image_path);
            $image->delete();
        }

        // Suppression du post
        $post->delete();

        return response()->json([
            'status' => true,
            'message' => 'Post supprimé avec succès'
        ]);
    }

    //liker et unliker un post
    public function toggleLike(Request $request, $id)
    {
        $user = $request->user();
        $post = Post::find($id);

        if (!$post) {
            return response()->json(['message' => 'Post introuvable'], 404);
        }

        // Vérifier si déjà liké
        $liked = $post->likes()->where('user_id', $user->id)->first();

        if ($liked) {
            // Delike
            $liked->delete();

            return response()->json([
                'status' => true,
                'action' => 'disliked',
                'message' => 'Like retiré',
                'likes_count' => $post->likes()->count()
            ]);
        }

        // Like
        PostLike::create([
            'user_id' => $user->id,
            'post_id' => $post->id
        ]);

        return response()->json([
            'status' => true,
            'action' => 'liked',
            'message' => 'Post liké',
            'likes_count' => $post->likes()->count()
        ]);
    }

    //signaler un post
    public function reportPost(Request $request, $id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json(['message' => 'Post non trouvé'], 404);
        }

        $validated = $request->validate([
            'raison' => 'nullable|string|max:255'
        ]);

        // Empêcher qu'un utilisateur signale le même post plusieurs fois
        $exists = PostReport::where('post_id', $post->id)
                            ->where('user_id', $request->user()->id)
                            ->first();

        if ($exists) {
            return response()->json([
                'status' => false,
                'message' => 'Vous avez déjà signalé ce post'
            ], 409);
        }

        // Création du signalement
        PostReport::create([
            'post_id' => $post->id,
            'user_id' => $request->user()->id,
            'raison' => $validated['raison'] ?? null
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Post signalé avec succès'
        ]);
    }

}
