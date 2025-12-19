import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Message {
    id: number;
    conversation_id: number;
    sender_id: number;
    content: string;
    is_read: boolean;
    created_at: string;
}

interface Conversation {
    id: number;
    user1_id: number;
    user2_id: number;
    created_at: string;
    updated_at: string;
    user1: { id: number, name: string, surname: string, avatar?: string };
    user2: { id: number, name: string, surname: string, avatar?: string };
    messages?: Message[];
}

export default function UserMessages() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoadingConversations, setIsLoadingConversations] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const location = useLocation();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial Fetch: Conversations
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await api.get('/conversations');
                if (res.data.status) {
                    setConversations(res.data.conversations);

                    // Check URL state for conversation to select
                    if (location.state && location.state.conversationId) {
                        setSelectedConversationId(location.state.conversationId);
                    }
                }
            } catch (error) {
                console.error("Error fetching conversations", error);
            } finally {
                setIsLoadingConversations(false);
            }
        };

        if (user) {
            fetchConversations();
        }
    }, [user, location.state]);

    // Fetch Messages when conversation selected
    useEffect(() => {
        if (!selectedConversationId) return;

        const fetchMessages = async () => {
            setIsLoadingMessages(true);
            try {
                const res = await api.get(`/conversations/${selectedConversationId}/messages`);
                if (res.data.status) {
                    setMessages(res.data.messages);
                }
            } catch (error) {
                console.error("Error fetching messages", error);
            } finally {
                setIsLoadingMessages(false);
            }
        };

        fetchMessages();

        // Mark as read potentially
        // api.post(`/conversations/${selectedConversationId}/mark-as-read`);

    }, [selectedConversationId]);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversationId) return;

        setIsSending(true);
        try {
            const res = await api.post(`/conversations/${selectedConversationId}/messages`, {
                message: newMessage
            });

            if (res.data.status) {
                setMessages([...messages, res.data.message]);
                setNewMessage("");
            }
        } catch (error) {
            console.error("Error sending message", error);
        } finally {
            setIsSending(false);
        }
    };

    const getOtherUser = (conv: Conversation) => {
        if (!user) return conv.user1;
        return conv.user1_id === user.id ? conv.user2 : conv.user1;
    };

    const getLastMessage = (conv: Conversation) => {
        if (conv.messages && conv.messages.length > 0) {
            // Assuming messages are ordered or we take the last one
            // The backend might not be returning sorted messages in the conversation list view,
            // normally you'd want the 'latest_message' appended or eager loaded sorted.
            // For now, let's assume the backend 'messages' relation returns all messages
            // which might be heavy. Ideally, standard practice is to eager load only the last message.
            // We'll just take the last one in the array if it exists.
            return conv.messages[conv.messages.length - 1];
        }
        return null;
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Conversations List */}
            <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col ${selectedConversationId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="font-bold text-lg text-gray-900">Messages</h2>
                </div>
                <div className="overflow-y-auto flex-1">
                    {isLoadingConversations ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            Aucune conversation.
                        </div>
                    ) : (
                        conversations.map(conv => {
                            const otherUser = getOtherUser(conv);
                            const lastMsg = getLastMessage(conv);
                            const isSelected = selectedConversationId === conv.id;

                            return (
                                <div
                                    key={conv.id}
                                    onClick={() => setSelectedConversationId(conv.id)}
                                    className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition flex gap-3 ${isSelected ? 'bg-blue-50/50 border-l-4 border-l-blue-600' : ''}`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center shrink-0 text-gray-600 font-bold border border-gray-200">
                                        {otherUser.name.charAt(0)}{otherUser.surname.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className={`font-semibold text-sm truncate ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                                                {otherUser.surname} {otherUser.name}
                                            </h3>
                                            {lastMsg && (
                                                <span className="text-[10px] text-gray-400 shrink-0">
                                                    {formatDistanceToNow(new Date(lastMsg.created_at), { addSuffix: false, locale: fr })}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 truncate">
                                            {lastMsg ? lastMsg.content : <span className="italic">Nouvelle conversation</span>}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Chat Window */}
            {selectedConversationId ? (
                <div className="flex-1 flex flex-col bg-gray-50/30 w-full">
                    {/* Header - Mobile Back Button included */}
                    <div className="p-3 border-b border-gray-100 bg-white flex items-center gap-3 shadow-xs z-10">
                        <button
                            className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900"
                            onClick={() => setSelectedConversationId(null)}
                        >
                            ←
                        </button>
                        {(() => {
                            const activeConv = conversations.find(c => c.id === selectedConversationId);
                            if (!activeConv) return null;
                            const otherUser = getOtherUser(activeConv);
                            return (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                        {otherUser.name.charAt(0)}{otherUser.surname.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">{otherUser.surname} {otherUser.name}</h3>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {isLoadingMessages ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 text-sm">
                                Début de la conversation.
                            </div>
                        ) : (
                            messages.map(msg => {
                                const isMe = msg.sender_id === user?.id;
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${isMe
                                                ? 'bg-blue-600 text-white rounded-br-none'
                                                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                            }`}>
                                            <p>{msg.content}</p>
                                            <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-gray-100">
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Écrivez votre message..."
                                className="flex-1 bg-gray-50 border-gray-200 focus:bg-white"
                                disabled={isSending}
                            />
                            <Button type="submit" size="icon" disabled={!newMessage.trim() || isSending} className="bg-blue-600 hover:bg-blue-700 shrink-0">
                                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </Button>
                        </form>
                    </div>
                </div>
            ) : (
                // Empty State
                <div className="hidden md:flex flex-1 flex-col bg-gray-50/50 items-center justify-center text-gray-400">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <MessageSquare className="w-10 h-10 opacity-20" />
                    </div>
                    <p className="font-medium">Sélectionnez une conversation</p>
                    <p className="text-sm mt-1">pour commencer à discuter</p>
                </div>
            )}
        </div>
    );
}
