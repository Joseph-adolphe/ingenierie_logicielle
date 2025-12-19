import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import api from '../../src/services/api';
import { Domaine } from '../../src/types';

export default function BecomeProviderScreen() {
    const router = useRouter();
    const { user, refreshUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [domains, setDomains] = useState<Domaine[]>([]);
    const [selectedDomains, setSelectedDomains] = useState<{ id: number; niveau_expertise: string }[]>([]);

    const [formData, setFormData] = useState({
        description: '',
        tarif_horaire: '',
        disponibilite: 'Lundi - Vendredi',
    });

    useEffect(() => {
        fetchDomains();
    }, []);

    const fetchDomains = async () => {
        try {
            const res = await api.get('/domain');
            const data = res.data.domaines || res.data.data || res.data || [];
            setDomains(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Erreur domaines:', error);
        }
    };

    const toggleDomain = (id: number) => {
        const index = selectedDomains.findIndex(d => d.id === id);
        if (index > -1) {
            setSelectedDomains(selectedDomains.filter(d => d.id !== id));
        } else {
            setSelectedDomains([...selectedDomains, { id, niveau_expertise: 'Débutant' }]);
        }
    };

    const handleLevelChange = (id: number, level: string) => {
        setSelectedDomains(selectedDomains.map(d =>
            d.id === id ? { ...d, niveau_expertise: level } : d
        ));
    };

    const handleSubmit = async () => {
        if (!formData.description.trim()) {
            Alert.alert('Erreur', 'La description est obligatoire');
            return;
        }

        if (selectedDomains.length === 0) {
            Alert.alert('Erreur', 'Veuillez sélectionner au moins un domaine');
            return;
        }

        try {
            setIsLoading(true);
            const payload = {
                ...formData,
                tarif_horaire: formData.tarif_horaire ? parseFloat(formData.tarif_horaire) : null,
                domaines: selectedDomains,
            };

            const res = await api.post(`/prestataire/create/${user?.id}`, payload);

            if (res.data.status) {
                await refreshUser();
                Alert.alert('Félicitations', 'Vous êtes maintenant prestataire !', [
                    {
                        text: 'Aller à mon espace',
                        onPress: () => router.replace('/(provider)')
                    }
                ]);
            }
        } catch (error: any) {
            console.error('Erreur création prestataire:', error);
            const msg = error.response?.data?.message || 'Une erreur est survenue';
            Alert.alert('Erreur', msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.title}>Devenir Prestataire</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Description professionnelle *</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Parlez-nous de vos services et de votre expérience..."
                    multiline
                    numberOfLines={4}
                    value={formData.description}
                    onChangeText={(v) => setFormData({ ...formData, description: v })}
                />
            </View>

            <View style={styles.row}>
                <View style={[styles.section, { flex: 1 }]}>
                    <Text style={styles.label}>Tarif horaire (FCFA)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: 5000"
                        keyboardType="numeric"
                        value={formData.tarif_horaire}
                        onChangeText={(v) => setFormData({ ...formData, tarif_horaire: v })}
                    />
                </View>
                <View style={[styles.section, { flex: 1, marginLeft: 12 }]}>
                    <Text style={styles.label}>Disponibilité</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Lun - Ven"
                        value={formData.disponibilite}
                        onChangeText={(v) => setFormData({ ...formData, disponibilite: v })}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Domaines d'expertise *</Text>
                <View style={styles.domainsGrid}>
                    {domains.map((domaine) => {
                        const isSelected = selectedDomains.some(d => d.id === domaine.id);
                        return (
                            <TouchableOpacity
                                key={domaine.id}
                                style={[styles.domainChip, isSelected && styles.domainChipActive]}
                                onPress={() => toggleDomain(domaine.id)}
                            >
                                <Text style={[styles.domainText, isSelected && styles.domainTextActive]}>
                                    {domaine.nom_domaine}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {selectedDomains.map((sel) => {
                const domaineObj = domains.find(d => d.id === sel.id);
                if (!domaineObj) return null;
                return (
                    <View key={sel.id} style={styles.levelSection}>
                        <Text style={styles.levelLabel}>Niveau pour {domaineObj.nom_domaine}</Text>
                        <View style={styles.levelRow}>
                            {['Débutant', 'Intermédiaire', 'Expert'].map((lvl) => (
                                <TouchableOpacity
                                    key={lvl}
                                    style={[styles.levelBtn, sel.niveau_expertise === lvl && styles.levelBtnActive]}
                                    onPress={() => handleLevelChange(sel.id, lvl)}
                                >
                                    <Text style={[styles.levelBtnText, sel.niveau_expertise === lvl && styles.levelBtnTextActive]}>
                                        {lvl}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                );
            })}

            <TouchableOpacity
                style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <Text style={styles.submitBtnText}>Confirmer mon inscription</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    content: { padding: 20, paddingBottom: 40 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, marginTop: 10 },
    backButton: { marginRight: 16 },
    title: { fontSize: 22, fontWeight: '700', color: '#1F2937' },
    section: { marginBottom: 20 },
    row: { flexDirection: 'row', marginBottom: 20 },
    label: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 },
    input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 14, fontSize: 16, color: '#1F2937' },
    textArea: { height: 100, textAlignVertical: 'top' },
    domainsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    domainChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB' },
    domainChipActive: { backgroundColor: '#F97316', borderColor: '#F97316' },
    domainText: { fontSize: 14, color: '#6B7280' },
    domainTextActive: { color: '#FFF', fontWeight: '600' },
    levelSection: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6' },
    levelLabel: { fontSize: 14, fontWeight: '500', color: '#6B7280', marginBottom: 10 },
    levelRow: { flexDirection: 'row', gap: 8 },
    levelBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
    levelBtnActive: { backgroundColor: '#FFF7ED', borderColor: '#F97316' },
    levelBtnText: { fontSize: 13, color: '#6B7280' },
    levelBtnTextActive: { color: '#F97316', fontWeight: '600' },
    submitBtn: { backgroundColor: '#F97316', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    submitBtnDisabled: { opacity: 0.7 },
    submitBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
});
