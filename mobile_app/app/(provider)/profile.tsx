import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import api from '../../src/services/api';

export default function ProviderProfileScreen() {
    const { user, logout, refreshUser } = useAuth();
    const router = useRouter();
    const [provider, setProvider] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [bio, setBio] = useState('');

    useEffect(() => { fetchProvider(); }, []);

    const fetchProvider = async () => {
        try {
            const res = await api.get('/prestataire');
            const p = res.data.prestataire || res.data;
            setProvider(p);
            setBio(p.bio || '');
        } catch (e) { console.error(e); } finally { setIsLoading(false); }
    };

    const handleSaveBio = async () => {
        try {
            await api.put(`/prestataire/${provider.id}`, { bio });
            setIsEditing(false);
            fetchProvider();
            Alert.alert('Succès', 'Bio mise à jour');
        } catch (e) { Alert.alert('Erreur', 'Impossible de mettre à jour'); }
    };

    const handleLogout = () => {
        Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Déconnexion', style: 'destructive', onPress: async () => { await logout(); router.replace('/'); } },
        ]);
    };

    if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" color="#F97316" /></View>;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}><Text style={styles.avatarText}>{user?.name?.charAt(0)}{user?.surname?.charAt(0)}</Text></View>
                <Text style={styles.name}>{user?.surname} {user?.name}</Text>
                <Text style={styles.email}>{user?.email}</Text>
                <View style={styles.badge}><Ionicons name="briefcase" size={14} color="#F97316" /><Text style={styles.badgeText}>Prestataire</Text></View>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Bio</Text>
                    <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                        <Ionicons name={isEditing ? "close" : "create-outline"} size={20} color="#F97316" />
                    </TouchableOpacity>
                </View>
                {isEditing ? (
                    <View>
                        <TextInput style={styles.textArea} value={bio} onChangeText={setBio} multiline placeholder="Décrivez-vous..." />
                        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveBio}><Text style={styles.saveBtnText}>Enregistrer</Text></TouchableOpacity>
                    </View>
                ) : (
                    <Text style={styles.bioText}>{provider?.bio || 'Aucune bio définie'}</Text>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Domaines d'expertise</Text>
                <View style={styles.domainesWrap}>
                    {provider?.domaines?.map((d: any) => (
                        <View key={d.id} style={styles.domainBadge}><Text style={styles.domainText}>{d.nom_domaine}</Text></View>
                    )) || <Text style={styles.noData}>Aucun domaine</Text>}
                </View>
            </View>

            <View style={styles.menu}>
                <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(user)')}>
                    <Ionicons name="person-outline" size={22} color="#F97316" />
                    <Text style={styles.menuText}>Espace Utilisateur</Text>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                    <Text style={[styles.menuText, styles.logoutText]}>Déconnexion</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { alignItems: 'center', paddingVertical: 32, backgroundColor: '#FFF', marginBottom: 16 },
    avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#F97316', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    avatarText: { color: '#FFF', fontSize: 32, fontWeight: '600' },
    name: { fontSize: 24, fontWeight: '700', color: '#1F2937' },
    email: { fontSize: 14, color: '#6B7280', marginTop: 4 },
    badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF7ED', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 12 },
    badgeText: { color: '#F97316', fontSize: 14, fontWeight: '500', marginLeft: 4 },
    section: { backgroundColor: '#FFF', marginHorizontal: 16, borderRadius: 16, padding: 20, marginBottom: 16 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
    bioText: { fontSize: 15, color: '#4B5563', lineHeight: 22 },
    textArea: { backgroundColor: '#F9FAFB', borderRadius: 10, padding: 14, fontSize: 15, minHeight: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: '#E5E7EB' },
    saveBtn: { backgroundColor: '#F97316', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 12 },
    saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    domainesWrap: { flexDirection: 'row', flexWrap: 'wrap' },
    domainBadge: { backgroundColor: '#FFF7ED', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, marginBottom: 8 },
    domainText: { color: '#F97316', fontSize: 14, fontWeight: '500' },
    noData: { color: '#9CA3AF', fontSize: 14 },
    menu: { backgroundColor: '#FFF', marginHorizontal: 16, borderRadius: 16, overflow: 'hidden', marginBottom: 32 },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    menuText: { flex: 1, marginLeft: 12, fontSize: 16, color: '#1F2937' },
    logoutItem: { borderBottomWidth: 0 },
    logoutText: { color: '#EF4444' },
});
