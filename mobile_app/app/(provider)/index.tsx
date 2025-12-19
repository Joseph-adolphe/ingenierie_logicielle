import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../../src/services/api';
import { useAuth } from '../../src/context/AuthContext';

export default function ProviderDashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const [stats, setStats] = useState({ completedJobs: 0, rating: 4.8, responseRate: 95, postsCount: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [provider, setProvider] = useState<any>(null);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/prestataire');
            if (res.data.prestataire || res.data) {
                const p = res.data.prestataire || res.data;
                setProvider(p);
                const postsRes = await api.get('/my/posts');
                const posts = postsRes.data.posts || postsRes.data || [];
                setStats({ ...stats, postsCount: posts.length });
            }
        } catch (e) { console.error(e); } finally { setIsLoading(false); setRefreshing(false); }
    };

    if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" color="#F97316" /></View>;

    return (
        <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} colors={['#F97316']} />}>
            <View style={styles.headerCard}>
                <View style={styles.headerBg} />
                <Text style={styles.greeting}>Bonjour, {user?.name} ! 👋</Text>
                <Text style={styles.subtitle}>Voici vos statistiques du jour</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statBox}><Text style={styles.statValue}>{stats.postsCount}</Text><Text style={styles.statLabel}>Publications</Text></View>
                    <View style={styles.statBox}><Text style={styles.statValue}>{stats.rating}</Text><Text style={styles.statLabel}>Note</Text></View>
                    <View style={styles.statBox}><Text style={styles.statValue}>{stats.responseRate}%</Text><Text style={styles.statLabel}>Réponse</Text></View>
                    <View style={styles.statBox}><Text style={styles.statValue}>{provider?.domaines?.length || 0}</Text><Text style={styles.statLabel}>Domaines</Text></View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Actions rapides</Text>
                <View style={styles.actionsGrid}>
                    <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(provider)/posts')}>
                        <View style={[styles.actionIcon, { backgroundColor: '#FFF7ED' }]}><Ionicons name="add-circle" size={28} color="#F97316" /></View>
                        <Text style={styles.actionText}>Nouveau Post</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(provider)/messages')}>
                        <View style={[styles.actionIcon, { backgroundColor: '#EEF2FF' }]}><Ionicons name="chatbubbles" size={28} color="#6366F1" /></View>
                        <Text style={styles.actionText}>Messages</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(provider)/profile')}>
                        <View style={[styles.actionIcon, { backgroundColor: '#ECFDF5' }]}><Ionicons name="settings" size={28} color="#10B981" /></View>
                        <Text style={styles.actionText}>Paramètres</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Vos domaines</Text>
                <View style={styles.domainesWrap}>
                    {provider?.domaines?.map((d: any) => (
                        <View key={d.id} style={styles.domainBadge}><Text style={styles.domainText}>{d.nom_domaine}</Text></View>
                    )) || <Text style={styles.noData}>Aucun domaine configuré</Text>}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    headerCard: { backgroundColor: '#F97316', padding: 24, paddingTop: 20, paddingBottom: 32, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, marginBottom: 24 },
    headerBg: { position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.1)' },
    greeting: { fontSize: 24, fontWeight: '700', color: '#FFF', marginBottom: 4 },
    subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 20 },
    statsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    statBox: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 12, alignItems: 'center', flex: 1, marginHorizontal: 4 },
    statValue: { fontSize: 22, fontWeight: '700', color: '#FFF' },
    statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
    section: { paddingHorizontal: 16, marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 12 },
    actionsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    actionCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, alignItems: 'center', flex: 1, marginHorizontal: 4, borderWidth: 1, borderColor: '#F3F4F6' },
    actionIcon: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    actionText: { fontSize: 12, fontWeight: '500', color: '#374151', textAlign: 'center' },
    domainesWrap: { flexDirection: 'row', flexWrap: 'wrap' },
    domainBadge: { backgroundColor: '#FFF7ED', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, marginBottom: 8 },
    domainText: { color: '#F97316', fontSize: 14, fontWeight: '500' },
    noData: { color: '#9CA3AF', fontSize: 14 },
});
