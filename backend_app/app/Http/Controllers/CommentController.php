<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    //inserer un commentaire
    public function store(Request $request, $postId)
    {
        $validated = $request->validate([
            'contenu' => 'required|string',
        ]);

        $post = Post::find($postId);

        if (!$post) {
            return response()->json(['message' => 'Post introuvable'], 404);
        }

        $comment = Comment::create([
            'post_id' => $postId,
            'user_id' => $request->user()->id,
            'contenu' => $validated['contenu'],
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Commentaire ajouté',
            'comment' => $comment->load('user')
        ]);
    }

    //répondre à un commentaire
    public function reply(Request $request, $commentId)
    {
        $validated = $request->validate([
            'contenu' => 'required|string',
        ]);

        $comment = Comment::find($commentId);

        if (!$comment) {
            return response()->json(['message' => 'Commentaire introuvable'], 404);
        }

        // Le parent_id doit toujours être le commentaire de niveau supérieur pour simplifier (optionnel, mais bon pour 1 niveau d'imbrication)
        // Ici le code actuel autorise l'imbrication infinie si on répond à une réponse. 
        // Si on veut limiter à 1 niveau (comme souvent), on peut vérifier si $comment->parent_id est null.
        // Pour l'instant on garde la logique existante.

        $reply = Comment::create([
            'post_id' => $comment->post_id,
            'user_id' => $request->user()->id,
            'parent_id' => $commentId,
            'contenu' => $validated['contenu'],
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Réponse ajoutée',
            'reply' => $reply->load('user')
        ]);
    }

    //lister les commentaires d'un post
    public function listComments($postId)
    {
        $post = Post::find($postId);

        if (!$post) {
            return response()->json(['message' => 'Post introuvable'], 404);
        }

        $comments = Comment::where('post_id', $postId)
            ->whereNull('parent_id')
            ->with(['user', 'replies.user']) // Charger l'auteur du com et les réponses avec leurs auteurs
            ->latest() // Plus récents en premier
            ->get();

        return response()->json([
            'status' => true,
            'comments' => $comments
        ]);
    }

}
