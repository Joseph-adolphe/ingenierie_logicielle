<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Conversation;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    //demarer une conversation entre deux utilisateurs
    public function startConversation(Request $request, $otherUserId)
    {
        $userId = $request->user()->id;

        $conversation = Conversation::firstOrCreate([
            'user1_id' => min($userId, $otherUserId),
            'user2_id' => max($userId, $otherUserId),
        ]);

        return response()->json([
            'status' => true,
            'conversation' => $conversation
        ]);
    }

    //lister les conversations d'un utilisateur
    public function myConversations(Request $request)
    {
        $userId = $request->user()->id;

        $conversations = Conversation::where('user1_id', $userId)
            ->orWhere('user2_id', $userId)
            ->with(['messages', 'user1', 'user2'])
            ->get();

        return response()->json([
            'status' => true,
            'conversations' => $conversations
        ]);
    }

}
