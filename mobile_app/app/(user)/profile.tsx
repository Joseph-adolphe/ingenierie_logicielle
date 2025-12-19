import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import api from '../../src/services/api';

export default function ProfileScreen() {
    const { user, logout, refreshUser } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        surname: user?.surname || '',
        phone: user?.phone || '',
        city: user?.city || '',
    });

    const handleLogout = () => {
        Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Déconnexion', style: 'destructive', onPress: async () => { await logout(); router.replace('/'); } },
        ]);
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await api.put(`/profile/${user?.id}`, formData);
            await refreshUser();
            setIsEditing(false);
            Alert.alert('Succès', 'Profil mis à jour');
        } catch (e) { Alert.alert('Erreur', 'Impossible de mettre à jour le profil'); }
        finally { setIsLoading(false); }
    };

    const handleBecomeProvider = () => {
        router.push('/(user)/become-provider');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}><Text style={styles.avatarText}>{user?.name?.charAt(0)}{user?.surname?.charAt(0)}</Text></View>
                <Text style={styles.name}>{user?.surname} {user?.name}</Text>
                <Text style={styles.email}>{user?.email}</Text>
                <View style={styles.roleBadge}><Text style={styles.roleText}>{user?.role === 'prestataire' ? 'Prestataire' : 'Client'}</Text></View>
            </View>

            {isEditing ? (
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Prénom</Text>
                        <TextInput style={styles.input} value={formData.name} onChangeText={(v) => setFormData({ ...formData, name: v })} />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nom</Text>
                        <TextInput style={styles.input} value={formData.surname} onChangeText={(v) => setFormData({ ...formData, surname: v })} />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Téléphone</Text>
                        <TextInput style={styles.input} value={formData.phone} onChangeText={(v) => setFormData({ ...formData, phone: v })} keyboardType="phone-pad" />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Ville</Text>
                        <TextInput style={styles.input} value={formData.city} onChangeText={(v) => setFormData({ ...formData, city: v })} />
                    </View>
                    <View style={styles.btnRow}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsEditing(false)}><Text style={styles.cancelText}>Annuler</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isLoading}>
                            {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveText}>Enregistrer</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={styles.menu}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => setIsEditing(true)}>
                        <Ionicons name="person-outline" size={22} color="#F97316" />
                        <Text style={styles.menuText}>Modifier le profil</Text>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                    {user?.role === 'prestataire' && (
                        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(provider)')}>
                            <Ionicons name="briefcase-outline" size={22} color="#F97316" />
                            <Text style={styles.menuText}>Espace Prestataire</Text>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                    {user?.role === 'client' && (
                        <TouchableOpacity style={styles.menuItem} onPress={handleBecomeProvider}>
                            <Ionicons name="add-circle-outline" size={22} color="#10B981" />
                            <Text style={styles.menuText}>Devenir Prestataire</Text>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Info', 'FAQ et aide à venir')}>
                        <Ionicons name="help-circle-outline" size={22} color="#F97316" />
                        <Text style={styles.menuText}>Aide</Text>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                        <Text style={[styles.menuText, styles.logoutText]}>Déconnexion</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: { alignItems: 'center', paddingVertical: 32, backgroundColor: '#FFF', marginBottom: 16 },
    avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#F97316', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    avatarText: { color: '#FFF', fontSize: 32, fontWeight: '600' },
    name: { fontSize: 24, fontWeight: '700', color: '#1F2937' },
    email: { fontSize: 14, color: '#6B7280', marginTop: 4 },
    roleBadge: { backgroundColor: '#FFF7ED', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 12 },
    roleText: { color: '#F97316', fontSize: 14, fontWeight: '500' },
    menu: { backgroundColor: '#FFF', marginHorizontal: 16, borderRadius: 16, overflow: 'hidden' },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    menuText: { flex: 1, marginLeft: 12, fontSize: 16, color: '#1F2937' },
    logoutItem: { borderBottomWidth: 0 },
    logoutText: { color: '#EF4444' },
    form: { backgroundColor: '#FFF', margin: 16, borderRadius: 16, padding: 20 },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 6 },
    input: { backgroundColor: '#F9FAFB', borderRadius: 10, padding: 14, fontSize: 16, borderWidth: 1, borderColor: '#E5E7EB' },
    btnRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
    cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
    cancelText: { fontSize: 16, color: '#6B7280' },
    saveBtn: { flex: 1, paddingVertical: 14, borderRadius: 10, backgroundColor: '#F97316', alignItems: 'center' },
    saveText: { fontSize: 16, color: '#FFF', fontWeight: '600' },
});
