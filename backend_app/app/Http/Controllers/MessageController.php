<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Conversation;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    //Envoyer un message dans une conversation
    public function sendMessage(Request $request, $conversationId)
    {
        $conversation = Conversation::findOrFail($conversationId);

        $message = Message::create([
            'conversation_id' => $conversationId,
            'sender_id' => $request->user()->id,
            'content' => $request->message,
        ]);

        return response()->json([
            'status' => true,
            'message' => $message
        ]);
    }

    //reccuperer les messages d'une conversation
    public function getMessages($conversationId)
    {
        $messages = Message::where('conversation_id', $conversationId)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'status' => true,
            'messages' => $messages
        ]);
    }

    //marquer un message comme lu
    public function markAsRead(Request $request, $conversationId)
    {
        Message::where('conversation_id', $conversationId)
            ->where('sender_id', '!=', $request->user()->id)
            ->update(['is_read' => true]);

        return response()->json(['status' => true]);
    }
}
