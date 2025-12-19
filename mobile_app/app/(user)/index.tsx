import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api, { getImageUrl } from '../../src/services/api';
import { Post, Domaine, Prestataire } from '../../src/types';

export default function UserHomeScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [posts, setPosts] = useState<Post[]>([]);
    const [domains, setDomains] = useState<Domaine[]>([]);
    const [providers, setProviders] = useState<Prestataire[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const results = await Promise.allSettled([
                api.get('/posts'),
                api.get('/domain'),
                api.get('/prestataires'),
            ]);

            // Posts
            if (results[0].status === 'fulfilled') {
                const postsRes = results[0].value;
                setPosts(postsRes.data.posts || postsRes.data || []);
            } else {
                console.error('Erreur posts:', results[0].reason);
            }

            // Domains
            if (results[1].status === 'fulfilled') {
                const domainsRes = results[1].value;
                const domainsData = domainsRes.data.domaines || domainsRes.data.data || domainsRes.data || [];
                setDomains(Array.isArray(domainsData) ? domainsData.slice(0, 6) : []);
            } else {
                console.error('Erreur domaines:', results[1].reason);
            }

            // Providers
            if (results[2].status === 'fulfilled') {
                const providersRes = results[2].value;
                const providersData = providersRes.data.prestataires || providersRes.data.data || providersRes.data || [];
                setProviders(Array.isArray(providersData) ? providersData.slice(0, 4) : []);
            } else {
                console.error('Erreur prestataires:', results[2].reason);
            }
        } catch (error) {
            console.error('Erreur chargement données:', error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/(user)/explorer?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleLike = async (postId: number) => {
        try {
            await api.post(`/posts/${postId}/like`);
            setPosts(posts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        is_liked: !post.is_liked,
                        likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1,
                    };
                }
                return post;
            }));
        } catch (error) {
            console.error('Erreur like:', error);
        }
    };



    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F97316" />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#F97316']} />
            }
        >
            {/* Barre de recherche */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#9CA3AF" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Rechercher un prestataire, un service..."
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />
            </View>

            {/* Domaines populaires */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="trending-up" size={20} color="#F97316" />
                    <Text style={styles.sectionTitle}>Domaines populaires</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                    {domains.map((domain) => (
                        <TouchableOpacity
                            key={domain.id}
                            style={styles.domainCard}
                            onPress={() => router.push(`/(user)/explorer?domain=${domain.id}`)}
                        >
                            <View style={styles.domainIcon}>
                                <Text style={styles.domainIconText}>{domain.nom_domaine?.charAt(0) || '?'}</Text>
                            </View>
                            <Text style={styles.domainName} numberOfLines={1}>{domain.nom_domaine}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Prestataires recommandés */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="star" size={20} color="#F97316" />
                    <Text style={styles.sectionTitle}>Prestataires recommandés</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                    {providers.map((provider) => (
                        <TouchableOpacity
                            key={provider.id}
                            style={styles.providerCard}
                            onPress={() => router.push(`/(user)/explorer?provider=${provider.id}`)}
                        >
                            <View style={styles.providerAvatar}>
                                <Text style={styles.providerAvatarText}>
                                    {provider.user?.name?.charAt(0) || '?'}{provider.user?.surname?.charAt(0) || ''}
                                </Text>
                            </View>
                            <Text style={styles.providerName} numberOfLines={1}>
                                {provider.user?.surname} {provider.user?.name}
                            </Text>
                            <Text style={styles.providerBio} numberOfLines={2}>
                                {provider.bio || 'Prestataire professionnel'}
                            </Text>
                            <View style={styles.providerRating}>
                                <Ionicons name="star" size={14} color="#FBBF24" />
                                <Text style={styles.ratingText}>4.8</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Fil d'actualité */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="newspaper" size={20} color="#F97316" />
                    <Text style={styles.sectionTitle}>Actualités</Text>
                </View>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <View key={post.id} style={styles.postCard}>
                            {/* Header du post */}
                            <View style={styles.postHeader}>
                                <View style={styles.postAvatar}>
                                    <Text style={styles.postAvatarText}>
                                        {post.prestataire?.user?.name?.charAt(0) || '?'}
                                    </Text>
                                </View>
                                <View style={styles.postAuthorInfo}>
                                    <Text style={styles.postAuthorName}>
                                        {post.prestataire?.user?.surname} {post.prestataire?.user?.name}
                                    </Text>
                                    <Text style={styles.postDate}>
                                        {new Date(post.created_at).toLocaleDateString('fr-FR')}
                                    </Text>
                                </View>
                            </View>

                            {/* Contenu */}
                            <Text style={styles.postContent}>{post.contenu || post.titre}</Text>

                            {/* Images */}
                            {post.images && post.images.length > 0 && (
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.postImagesContainer}>
                                    {post.images.map((img, idx) => (
                                        <Image
                                            key={idx}
                                            source={{ uri: getImageUrl(img.image_path) }}
                                            style={styles.postImage}
                                            resizeMode="cover"
                                        />
                                    ))}
                                </ScrollView>
                            )}

                            {/* Actions */}
                            <View style={styles.postActions}>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => handleLike(post.id)}
                                >
                                    <Ionicons
                                        name={post.is_liked ? "heart" : "heart-outline"}
                                        size={22}
                                        color={post.is_liked ? "#EF4444" : "#6B7280"}
                                    />
                                    <Text style={[styles.actionText, post.is_liked && styles.likedText]}>
                                        {post.likes_count}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Ionicons name="chatbubble-outline" size={22} color="#6B7280" />
                                    <Text style={styles.actionText}>{post.comments_count}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Ionicons name="share-outline" size={22} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="newspaper-outline" size={48} color="#D1D5DB" />
                        <Text style={styles.emptyStateText}>Aucune publication pour le moment</Text>
                    </View>
                )}
            </View>
        </ScrollView>
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
        backgroundColor: '#F9FAFB',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        margin: 16,
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
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginLeft: 8,
    },
    horizontalScroll: {
        paddingLeft: 16,
    },
    domainCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginRight: 12,
        width: 120,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    domainIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#FFF7ED',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    domainIconText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#F97316',
    },
    domainName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
        textAlign: 'center',
    },
    providerCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginRight: 12,
        width: 160,
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
        marginBottom: 12,
    },
    providerAvatarText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
    },
    providerName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    providerBio: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 8,
    },
    providerRating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        marginLeft: 4,
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
    },
    postCard: {
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    postAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F97316',
        justifyContent: 'center',
        alignItems: 'center',
    },
    postAvatarText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    postAuthorInfo: {
        marginLeft: 12,
        flex: 1,
    },
    postAuthorName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
    postDate: {
        fontSize: 13,
        color: '#9CA3AF',
        marginTop: 2,
    },
    postContent: {
        fontSize: 15,
        color: '#374151',
        lineHeight: 22,
        marginBottom: 12,
    },
    postImagesContainer: {
        marginBottom: 12,
    },
    postImage: {
        width: 200,
        height: 150,
        borderRadius: 12,
        marginRight: 8,
    },
    postActions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },
    actionText: {
        marginLeft: 6,
        fontSize: 14,
        color: '#6B7280',
    },
    likedText: {
        color: '#EF4444',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
        marginHorizontal: 16,
        backgroundColor: '#FFF',
        borderRadius: 16,
    },
    emptyStateText: {
        marginTop: 12,
        fontSize: 16,
        color: '#9CA3AF',
    },
});
