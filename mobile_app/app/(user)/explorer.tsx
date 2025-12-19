import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../../src/services/api';
import { Prestataire, Domaine } from '../../src/types';

const CAMEROON_CITIES = [
    'Toutes', 'Yaoundé', 'Douala', 'Garoua', 'Bamenda', 'Bafoussam',
    'Maroua', 'Ngaoundéré', 'Bertoua', 'Buea', 'Kumba', 'Dschang'
];

export default function ExplorerScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [searchQuery, setSearchQuery] = useState((params.search as string) || '');
    const [selectedDomain, setSelectedDomain] = useState<number | null>(
        params.domain ? parseInt(params.domain as string) : null
    );
    const [selectedCity, setSelectedCity] = useState<string>('Toutes');
    const [providers, setProviders] = useState<Prestataire[]>([]);
    const [domains, setDomains] = useState<Domaine[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProvider, setSelectedProvider] = useState<Prestataire | null>(null);

    useEffect(() => {
        fetchDomains();
        fetchProviders();
    }, []);

    useEffect(() => {
        if (params.provider) {
            fetchProviderDetail(parseInt(params.provider as string));
        }
    }, [params.provider]);

    const fetchDomains = async () => {
        try {
            const res = await api.get('/domain');
            const data = res.data.domaines || res.data.data || res.data || [];
            setDomains(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Erreur domaines:', error);
        }
    };

    const fetchProviders = async () => {
        try {
            setIsLoading(true);
            const searchParams: any = {};
            if (searchQuery) searchParams.name = searchQuery;
            if (selectedDomain) searchParams.domaine_id = selectedDomain;
            if (selectedCity && selectedCity !== 'Toutes') searchParams.city = selectedCity;

            const res = await api.get('/prestataires/search', { params: searchParams });
            const data = res.data.prestataires || res.data.data || res.data || [];

            setProviders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Erreur prestataires:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProviderDetail = async (id: number) => {
        try {
            const res = await api.get(`/prestataire/${id}`);
            setSelectedProvider(res.data.prestataire || res.data);
        } catch (error) {
            console.error('Erreur détail prestataire:', error);
        }
    };

    const handleSearch = () => {
        fetchProviders();
    };

    const handleDomainFilter = (domainId: number) => {
        setSelectedDomain(selectedDomain === domainId ? null : domainId);
    };

    const handleCityFilter = (city: string) => {
        setSelectedCity(city);
    };

    useEffect(() => {
        fetchProviders();
    }, [selectedDomain, selectedCity]);

    const handleContact = async (providerId: number) => {
        try {
            const provider = providers.find(p => p.id === providerId) || selectedProvider;
            if (provider?.user_id) {
                const res = await api.post(`/conversations/start/${provider.user_id}`);
                if (res.data.conversation) {
                    router.push('/(user)/messages');
                }
            }
        } catch (error) {
            console.error('Erreur contact:', error);
        }
    };

    if (selectedProvider) {
        return (
            <ScrollView style={styles.container}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setSelectedProvider(null)}
                >
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                    <Text style={styles.backText}>Retour</Text>
                </TouchableOpacity>

                <View style={styles.profileCard}>
                    <View style={styles.profileHeader}>
                        <View style={styles.profileAvatar}>
                            <Text style={styles.profileAvatarText}>
                                {selectedProvider.user?.name?.charAt(0) || '?'}
                                {selectedProvider.user?.surname?.charAt(0) || ''}
                            </Text>
                        </View>
                        <Text style={styles.profileName}>
                            {selectedProvider.user?.surname} {selectedProvider.user?.name}
                        </Text>
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={18} color="#FBBF24" />
                            <Text style={styles.ratingText}>4.8</Text>
                            <Text style={styles.reviewCount}>(24 avis)</Text>
                        </View>
                    </View>

                    <Text style={styles.bioTitle}>À propos</Text>
                    <Text style={styles.bio}>
                        {selectedProvider.bio || 'Prestataire professionnel disponible pour vos projets.'}
                    </Text>

                    <Text style={styles.bioTitle}>Domaines d'expertise</Text>
                    <View style={styles.domainesContainer}>
                        {selectedProvider.domaines?.map((d) => (
                            <View key={d.id} style={styles.domaineBadge}>
                                <Text style={styles.domaineBadgeText}>{d.nom_domaine}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.contactButton}
                            onPress={() => handleContact(selectedProvider.id)}
                        >
                            <Ionicons name="chatbubble" size={20} color="#FFF" />
                            <Text style={styles.contactButtonText}>Contacter</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bookButton}>
                            <Ionicons name="calendar" size={20} color="#F97316" />
                            <Text style={styles.bookButtonText}>Réserver</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        );
    }

    return (
        <View style={styles.container}>
            {/* Barre de recherche */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#9CA3AF" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Rechercher un prestataire..."
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />
            </View>

            {/* Filtres par ville */}
            <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Ville</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filtersContainer}
                    contentContainerStyle={styles.filtersContent}
                >
                    {CAMEROON_CITIES.map((city) => (
                        <TouchableOpacity
                            key={city}
                            style={[
                                styles.filterChip,
                                selectedCity === city && styles.filterChipActive
                            ]}
                            onPress={() => handleCityFilter(city)}
                        >
                            <Text style={[
                                styles.filterChipText,
                                selectedCity === city && styles.filterChipTextActive
                            ]}>
                                {city}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Filtres par domaine */}
            <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Domaine</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filtersContainer}
                    contentContainerStyle={styles.filtersContent}
                >
                    {domains.map((domain) => (
                        <TouchableOpacity
                            key={domain.id}
                            style={[
                                styles.filterChip,
                                selectedDomain === domain.id && styles.filterChipActive
                            ]}
                            onPress={() => handleDomainFilter(domain.id)}
                        >
                            <Text style={[
                                styles.filterChipText,
                                selectedDomain === domain.id && styles.filterChipTextActive
                            ]}>
                                {domain.nom_domaine}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Liste des prestataires */}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#F97316" />
                </View>
            ) : (
                <FlatList
                    data={providers}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.providerCard}
                            onPress={() => setSelectedProvider(item)}
                        >
                            <View style={styles.providerAvatar}>
                                <Text style={styles.providerAvatarText}>
                                    {item.user?.name?.charAt(0) || '?'}
                                    {item.user?.surname?.charAt(0) || ''}
                                </Text>
                            </View>
                            <View style={styles.providerInfo}>
                                <Text style={styles.providerName}>
                                    {item.user?.surname} {item.user?.name}
                                </Text>
                                <Text style={styles.providerBio} numberOfLines={2}>
                                    {item.bio || 'Prestataire professionnel'}
                                </Text>
                                <View style={styles.providerDomaines}>
                                    {item.domaines?.slice(0, 2).map((d) => (
                                        <Text key={d.id} style={styles.domainTag}>{d.nom_domaine}</Text>
                                    ))}
                                </View>
                            </View>
                            <View style={styles.providerRating}>
                                <Ionicons name="star" size={14} color="#FBBF24" />
                                <Text style={styles.ratingValue}>4.8</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="search-outline" size={48} color="#D1D5DB" />
                            <Text style={styles.emptyStateText}>Aucun prestataire trouvé</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        margin: 16,
        marginBottom: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#1F2937',
    },
    filterSection: {
        marginBottom: 8,
    },
    filterTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginLeft: 16,
        marginBottom: 4,
    },
    filtersContainer: {
        maxHeight: 60,
        marginBottom: 8,
    },
    filtersContent: {
        paddingHorizontal: 16,
        paddingVertical: 4,
        alignItems: 'center',
    },
    filterChip: {
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterChipActive: {
        backgroundColor: '#F97316',
        borderColor: '#F97316',
    },
    filterChipText: {
        fontSize: 14,
        color: '#6B7280',
    },
    filterChipTextActive: {
        color: '#FFF',
        fontWeight: '500',
    },
    listContainer: {
        padding: 16,
    },
    providerCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    providerAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F97316',
        justifyContent: 'center',
        alignItems: 'center',
    },
    providerAvatarText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
    },
    providerInfo: {
        flex: 1,
        marginLeft: 12,
    },
    providerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    providerBio: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 6,
    },
    providerDomaines: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    domainTag: {
        fontSize: 12,
        color: '#F97316',
        backgroundColor: '#FFF7ED',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 4,
    },
    providerRating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingValue: {
        marginLeft: 4,
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
    },
    emptyStateText: {
        marginTop: 12,
        fontSize: 16,
        color: '#9CA3AF',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    backText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#1F2937',
    },
    profileCard: {
        backgroundColor: '#FFF',
        margin: 16,
        marginTop: 0,
        borderRadius: 20,
        padding: 24,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    profileAvatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#F97316',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    profileAvatarText: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: '600',
    },
    profileName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        marginLeft: 4,
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    reviewCount: {
        marginLeft: 4,
        fontSize: 14,
        color: '#6B7280',
    },
    bioTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 8,
    },
    bio: {
        fontSize: 15,
        color: '#4B5563',
        lineHeight: 22,
        marginBottom: 20,
    },
    domainesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 24,
    },
    domaineBadge: {
        backgroundColor: '#FFF7ED',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: 8,
        marginBottom: 8,
    },
    domaineBadgeText: {
        color: '#F97316',
        fontSize: 14,
        fontWeight: '500',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    contactButton: {
        flex: 1,
        backgroundColor: '#F97316',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
    },
    contactButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    bookButton: {
        flex: 1,
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#F97316',
    },
    bookButtonText: {
        color: '#F97316',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});
