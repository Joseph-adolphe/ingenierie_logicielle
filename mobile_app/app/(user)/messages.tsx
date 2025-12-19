import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../src/services/api';
import { useAuth } from '../../src/context/AuthContext';
import { Conversation, Message } from '../../src/types';

export default function MessagesScreen() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => { fetchConversations(); }, []);
    useEffect(() => { if (selectedConv) fetchMessages(selectedConv.id); }, [selectedConv]);

    const fetchConversations = async () => {
        try {
            const res = await api.get('/conversations');
            setConversations(res.data.conversations || res.data || []);
        } catch (e) { console.error(e); } finally { setIsLoading(false); }
    };

    const fetchMessages = async (id: number) => {
        try {
            const res = await api.get(`/conversations/${id}/messages`);
            setMessages(res.data.messages || res.data || []);
            await api.post(`/conversations/${id}/mark-as-read`);
        } catch (e) { console.error(e); }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedConv) return;
        try {
            const res = await api.post(`/conversations/${selectedConv.id}/messages`, { contenu: newMessage });
            if (res.data.message) { setMessages([...messages, res.data.message]); setNewMessage(''); }
        } catch (e) { console.error(e); }
    };

    const getOtherUser = (c: Conversation) => c.user1_id === user?.id ? c.user2 : c.user1;

    if (selectedConv) {
        const other = getOtherUser(selectedConv);
        return (
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
                <View style={styles.chatHeader}>
                    <TouchableOpacity onPress={() => setSelectedConv(null)}><Ionicons name="arrow-back" size={24} color="#1F2937" /></TouchableOpacity>
                    <View style={styles.avatar}><Text style={styles.avatarText}>{other?.name?.charAt(0)}</Text></View>
                    <Text style={styles.headerName}>{other?.surname} {other?.name}</Text>
                </View>
                <FlatList ref={flatListRef} data={messages} keyExtractor={(i) => i.id.toString()} contentContainerStyle={{ padding: 16 }}
                    renderItem={({ item }) => (
                        <View style={[styles.msgWrap, item.sender_id === user?.id ? styles.sent : styles.received]}>
                            <View style={[styles.bubble, item.sender_id === user?.id ? styles.bubbleSent : styles.bubbleRcv]}>
                                <Text style={item.sender_id === user?.id ? styles.textSent : styles.textRcv}>{item.contenu}</Text>
                            </View>
                        </View>
                    )}
                />
                <View style={styles.inputBox}>
                    <TextInput style={styles.input} placeholder="Message..." value={newMessage} onChangeText={setNewMessage} multiline />
                    <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}><Ionicons name="send" size={20} color="#FFF" /></TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        );
    }

    if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" color="#F97316" /></View>;

    return (
        <FlatList data={conversations} keyExtractor={(i) => i.id.toString()} contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => {
                const other = getOtherUser(item);
                return (
                    <TouchableOpacity style={styles.convItem} onPress={() => setSelectedConv(item)}>
                        <View style={styles.avatar}><Text style={styles.avatarText}>{other?.name?.charAt(0)}</Text></View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.convName}>{other?.surname} {other?.name}</Text>
                            <Text style={styles.lastMsg} numberOfLines={1}>{item.last_message?.contenu || 'Aucun message'}</Text>
                        </View>
                    </TouchableOpacity>
                );
            }}
            ListEmptyComponent={<View style={styles.center}><Ionicons name="chatbubbles-outline" size={64} color="#D1D5DB" /><Text>Aucune conversation</Text></View>}
        />
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    chatHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F97316', justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
    avatarText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    headerName: { marginLeft: 12, fontSize: 16, fontWeight: '600', color: '#1F2937' },
    msgWrap: { marginBottom: 12, maxWidth: '80%' },
    sent: { alignSelf: 'flex-end' },
    received: { alignSelf: 'flex-start' },
    bubble: { padding: 12, borderRadius: 16 },
    bubbleSent: { backgroundColor: '#F97316', borderBottomRightRadius: 4 },
    bubbleRcv: { backgroundColor: '#FFF', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#E5E7EB' },
    textSent: { color: '#FFF', fontSize: 15 },
    textRcv: { color: '#1F2937', fontSize: 15 },
    inputBox: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: '#FFF', padding: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
    input: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, maxHeight: 100, fontSize: 15 },
    sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F97316', justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
    convItem: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
    convName: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
    lastMsg: { fontSize: 14, color: '#6B7280', marginTop: 2 },
});
