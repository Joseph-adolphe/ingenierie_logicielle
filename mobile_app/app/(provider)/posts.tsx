import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Image, TextInput, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import api, { getImageUrl } from '../../src/services/api';
import { Post } from '../../src/types';

export default function PostsScreen() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newContent, setNewContent] = useState('');
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [isPosting, setIsPosting] = useState(false);
    const [providerId, setProviderId] = useState<number | null>(null);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const provRes = await api.get('/prestataire');
            const p = provRes.data.prestataire || provRes.data;
            setProviderId(p.id);
            const res = await api.get('/my/posts');
            setPosts(res.data.posts || res.data || []);
        } catch (e) { console.error(e); } finally { setIsLoading(false); }
    };

    const pickImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8,
        });
        if (!result.canceled) {
            setSelectedImages(result.assets.map(a => a.uri));
        }
    };

    const createPost = async () => {
        if (!newContent.trim() || !providerId) return;
        setIsPosting(true);
        try {
            const formData = new FormData();
            formData.append('contenu', newContent);
            selectedImages.forEach((uri, i) => {
                const filename = uri.split('/').pop() || `image${i}.jpg`;
                formData.append('images[]', { uri, name: filename, type: 'image/jpeg' } as any);
            });
            await api.post(`/prestataire/${providerId}/posts`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setShowModal(false);
            setNewContent('');
            setSelectedImages([]);
            fetchData();
        } catch (e) { Alert.alert('Erreur', 'Impossible de créer le post'); }
        finally { setIsPosting(false); }
    };

    const deletePost = (id: number) => {
        Alert.alert('Supprimer', 'Voulez-vous supprimer cette publication ?', [
            { text: 'Annuler', style: 'cancel' },
            {
                text: 'Supprimer', style: 'destructive', onPress: async () => {
                    try { await api.delete(`/my/posts/${id}`); fetchData(); } catch (e) { Alert.alert('Erreur', 'Impossible de supprimer'); }
                }
            },
        ]);
    };



    if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" color="#F97316" /></View>;

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
                <Ionicons name="add" size={24} color="#FFF" />
                <Text style={styles.addBtnText}>Nouvelle publication</Text>
            </TouchableOpacity>

            <FlatList data={posts} keyExtractor={(item) => item.id.toString()} contentContainerStyle={{ padding: 16 }}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardDate}>{new Date(item.created_at).toLocaleDateString('fr-FR')}</Text>
                            <TouchableOpacity onPress={() => deletePost(item.id)}><Ionicons name="trash-outline" size={20} color="#EF4444" /></TouchableOpacity>
                        </View>
                        <Text style={styles.cardContent}>{item.contenu}</Text>
                        {item.images && item.images.length > 0 && (
                            <View style={styles.imagesRow}>
                                {item.images.slice(0, 3).map((img, i) => (
                                    <Image key={i} source={{ uri: getImageUrl(img.image_path) }} style={styles.cardImage} />
                                ))}
                            </View>
                        )}
                        <View style={styles.cardStats}>
                            <View style={styles.stat}><Ionicons name="heart" size={16} color="#EF4444" /><Text style={styles.statText}>{item.likes_count}</Text></View>
                            <View style={styles.stat}><Ionicons name="chatbubble" size={16} color="#6B7280" /><Text style={styles.statText}>{item.comments_count}</Text></View>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<View style={styles.empty}><Ionicons name="images-outline" size={64} color="#D1D5DB" /><Text style={styles.emptyText}>Aucune publication</Text></View>}
            />

            <Modal visible={showModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Nouveau post</Text>
                            <TouchableOpacity onPress={() => setShowModal(false)}><Ionicons name="close" size={24} color="#6B7280" /></TouchableOpacity>
                        </View>
                        <TextInput style={styles.textArea} placeholder="Qu'avez-vous à partager ?" multiline value={newContent} onChangeText={setNewContent} />
                        <TouchableOpacity style={styles.imageBtn} onPress={pickImages}>
                            <Ionicons name="images" size={20} color="#F97316" /><Text style={styles.imageBtnText}>Ajouter des images ({selectedImages.length})</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.postBtn, (!newContent.trim() || isPosting) && styles.postBtnDisabled]} onPress={createPost} disabled={!newContent.trim() || isPosting}>
                            {isPosting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.postBtnText}>Publier</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    addBtn: { flexDirection: 'row', backgroundColor: '#F97316', margin: 16, padding: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    addBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600', marginLeft: 8 },
    card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    cardDate: { fontSize: 12, color: '#9CA3AF' },
    cardContent: { fontSize: 15, color: '#374151', lineHeight: 22, marginBottom: 12 },
    imagesRow: { flexDirection: 'row', marginBottom: 12 },
    cardImage: { width: 80, height: 80, borderRadius: 8, marginRight: 8 },
    cardStats: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12 },
    stat: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
    statText: { marginLeft: 4, color: '#6B7280', fontSize: 14 },
    empty: { alignItems: 'center', paddingVertical: 48 },
    emptyText: { marginTop: 12, color: '#9CA3AF', fontSize: 16 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    modalTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
    textArea: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, minHeight: 120, fontSize: 16, textAlignVertical: 'top', borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 16 },
    imageBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
    imageBtnText: { marginLeft: 8, color: '#F97316', fontSize: 14 },
    postBtn: { backgroundColor: '#F97316', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 12 },
    postBtnDisabled: { opacity: 0.5 },
    postBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
