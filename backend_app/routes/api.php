<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\DomaineController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\AdminStatsController;
use App\Http\Controllers\PrestataireController;
use App\Http\Controllers\ConversationController;

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

//Routes protégées - uniquement accessibles aux utilisateurs authentifiés
Route::middleware(['auth:sanctum', 'status'])->group(function () {

    //Route de l'administrateur
    Route::middleware('admin')->group(function () {

        //routes des domaines

        // lister tous les domaines
        Route::get('admin/domain', [DomaineController::class, 'index']);
        // créer un domaine
        Route::post('admin/domain', [DomaineController::class, 'store']);
        // voir un domaine
        Route::get('admin/domain/{id}', [DomaineController::class, 'show']);
        // modifier un domaine
        Route::put('admin/domain/{id}', [DomaineController::class, 'update']);
        // supprimer un domaine
        Route::delete('admin/domain/{id}', [DomaineController::class, 'destroy']);

        //Gestion des utilisateurs

        // Lister tous les utilisateurs
        Route::get('admin/users', [UserController::class, 'index']);
        // Voir un utilisateur
        Route::get('admin/user/{id}', [UserController::class, 'show']);
        // Activer/Désactiver un utilisateur
        Route::put('admin/user/{id}/status', [UserController::class, 'updateStatus']);
        Route::delete('admin/user/{id}', [UserController::class, 'destroy']);

        //Modifier les domaines d'un prestataire
        Route::put('admin/prestataire/{id}/domaines', [PrestataireController::class, 'updateDomaines']);

        //statistiques
        Route::get('/admin/stats', [AdminStatsController::class, 'index']);

        // Signalements
        Route::get('/admin/reports', [\App\Http\Controllers\ReportController::class, 'index']);
        Route::delete('/admin/reports/{type}/{id}', [\App\Http\Controllers\ReportController::class, 'destroy']);
    });

    Route::get('/domain', [DomaineController::class, 'index']);
    //afficher les domaines du prestataires
    Route::get('/prestataire/{id}/domaines', [PrestataireController::class, 'getDomaines']);

    //modifier son mot de passe
    Route::put('/change-password', [UserController::class, 'updatePassword']);
    //voir le profil
    Route::get('/profile', [AuthController::class, 'profile']);
    //mettre a jour le profil
    Route::put('/profile/{id}', [UserController::class, 'updateProfile']);
    //voir la liste des prestataires
    Route::get('/prestataires', [PrestataireController::class, 'index']);
    //creer un compte prestataire
    Route::post('/prestataire/create/{id}', [PrestataireController::class, 'create']);
    //voir un prestataire
    Route::get('/prestataire/{id}', [PrestataireController::class, 'show']);
    //voir mon profil prestataire
    Route::get('/prestataire', [PrestataireController::class, 'showMyProfile']);
    //modifier le profil du prestataire
    Route::put('/prestataire/{id}', [PrestataireController::class, 'update']);
    //modifier les domaines du prestataire (Bulk Update)
    Route::put('/prestataire/{id}/domaines', [PrestataireController::class, 'updateDomaines']);
    //supprimer un domaine du prestataire
    Route::delete('/prestataire/{id}/domaine', [PrestataireController::class, 'removeDomaine']);
    //ajouter un domaine au prestataire
    Route::post('/prestataire/{id}/domaine', [PrestataireController::class, 'addDomaine']);
    //signaler un prestataire
    Route::post('/prestataire/{id}/report', [PrestataireController::class, 'reportPrestataire']);
    //rehercher des prestataires
    Route::get('/prestataires/search', [PrestataireController::class, 'search']);
    //voir un prestataire par user_id
    Route::get('/prestataires/user/{userId}', [PrestataireController::class, 'showByUserId']);

    //Gestion des posts

    //voir le fil d'actualité (tous les posts)
    Route::get('/posts', [PostController::class, 'allPosts']);

    //creer un post
    Route::post('/prestataire/{id}/posts', [PostController::class, 'store']);
    //voir les posts d'un prestataire
    Route::get('/prestataire/{id}/posts', [PostController::class, 'index']);
    //voir les details d'un post
    Route::get('/posts/{id}', [PostController::class, 'show']);
    //rechercher des posts
    Route::get('/posts/search', [PostController::class, 'search']);
    //voir mes posts
    Route::get('/my/posts', [PostController::class, 'myPosts']);
    //supprimer mon post
    Route::delete('/my/posts/{id}', [PostController::class, 'destroy']);
    //liker et unliker un post
    Route::post('/posts/{id}/like', [PostController::class, 'toggleLike']);
    //signaler un post
    Route::post('/posts/{id}/report', [PostController::class, 'reportPost']);

    //Gestion des commentaires

    //ajouter un commentaire à un post
    Route::post('/posts/{postId}/comments', [CommentController::class, 'store']);
    //répondre à un commentaire
    Route::post('/comments/{commentId}/reply', [CommentController::class, 'reply']);
    //lister les commentaires d'un post
    Route::get('/posts/{postId}/comments', [CommentController::class, 'listComments']);

    //Gestion des reviews

    //ajouter une review à un prestataire
    Route::post('/prestataires/{prestataire_id}/reviews', [ReviewController::class, 'store']);
    //lister les reviews d'un prestataire
    Route::get('/prestataires/{prestataire_id}/reviews', [ReviewController::class, 'index']);
    //modifier sa review
    Route::put('/reviews/{id}', [ReviewController::class, 'update']);
    //supprimer sa review
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

    //Gestion des conversations

    //demarer une conversation entre deux utilisateurs
    Route::post('/conversations/start/{otherUserId}', [ConversationController::class, 'startConversation']);
    //lister les conversations d'un utilisateur
    Route::get('/conversations', [ConversationController::class, 'myConversations']);

    //Gestion des messages

    //Envoyer un message dans une conversation
    Route::post('/conversations/{conversationId}/messages', [MessageController::class, 'sendMessage']);
    //reccuperer les messages d'une conversation
    Route::get('/conversations/{conversationId}/messages', [MessageController::class, 'getMessages']);
    //marquer un message comme lu
    Route::post('/conversations/{conversationId}/mark-as-read', [MessageController::class, 'markAsRead']);


});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
