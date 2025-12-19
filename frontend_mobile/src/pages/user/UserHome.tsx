import { useEffect, useState } from 'react';
import PostCard from '@/components/marketplace/PostCard';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, Search, Star, TrendingUp, Users } from 'lucide-react';
import api from '@/lib/api';

export default function UserHome() {
    useAuth();
    const navigate = useNavigate();
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [topDomains, setTopDomains] = useState<any[]>([]);
    const [providers, setProviders] = useState<any[]>([]);
    const [loadingDomains, setLoadingDomains] = useState(true);
    const [loadingProviders, setLoadingProviders] = useState(true);


    useEffect(() => {
        fetchPosts();
        fetchTopDomains();
        fetchProviders();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await api.get('/posts');
            if (res.data.status) {
                setPosts(res.data.posts);
            }
        } catch (error) {
            console.error("Error fetching posts", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTopDomains = async () => {
        try {
            const res = await api.get('/domain');
            console.log('Domaines response:', res.data);

            // L'API peut retourner soit { status: true, domaines: [...] } soit directement [...]
            let domainsArray = [];

            if (Array.isArray(res.data)) {
                // Si c'est directement un array
                domainsArray = res.data;
            } else if (res.data.domaines && Array.isArray(res.data.domaines)) {
                // Si c'est dans un objet avec la clé 'domaines'
                domainsArray = res.data.domaines;
            } else if (res.data.data && Array.isArray(res.data.data)) {
                // Si c'est dans un objet avec la clé 'data'
                domainsArray = res.data.data;
            }

            setTopDomains(domainsArray.slice(0, 6));
        } catch (error) {
            console.error("Error fetching domains", error);
        } finally {
            setLoadingDomains(false);
        }
    };

    const fetchProviders = async () => {
        try {
            const res = await api.get('/prestataires');
            console.log('Prestataires response:', res.data);

            // L'API peut retourner soit { status: true, prestataires: [...] } soit directement [...]
            let providersArray = [];

            if (Array.isArray(res.data)) {
                // Si c'est directement un array
                providersArray = res.data;
                console.log('Providers set (direct array):', res.data.length, 'prestataires');
            } else if (res.data.prestataires && Array.isArray(res.data.prestataires)) {
                // Si c'est dans un objet avec la clé 'prestataires'
                providersArray = res.data.prestataires;
                console.log('Providers set (prestataires key):', res.data.prestataires.length, 'prestataires');
            } else if (res.data.data && Array.isArray(res.data.data)) {
                // Si c'est dans un objet avec la clé 'data'
                providersArray = res.data.data;
                console.log('Providers set (data key):', res.data.data.length, 'prestataires');
            }

            setProviders(providersArray);
            console.log('Final providers state:', providersArray.length);
        } catch (error) {
            console.error("Error fetching providers", error);
        } finally {
            setLoadingProviders(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/user/explorer?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            {/* Barre de recherche sans cadre */}
            <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un prestataire, un service..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
                />
            </form>

            {/* Domaines populaires */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Domaines populaires</h2>
                </div>

                {loadingDomains ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                    </div>
                ) : topDomains.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {topDomains.map((domain) => (
                            <button
                                key={domain.id}
                                onClick={() => navigate(`/user/explorer?domain=${domain.id}`)}
                                className="bg-white rounded-xl p-4 border border-gray-100 hover:border-orange-300 hover:shadow-md transition-all text-left group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                                        <span className="text-xl">{domain.nom_domaine?.charAt(0) || '?'}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 truncate">{domain.nom_domaine}</h3>
                                        <p className="text-xs text-gray-500">Voir les prestataires</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                        <p className="text-gray-500">Aucun domaine disponible</p>
                    </div>
                )}
            </div>

            {/* Prestataires recommandés */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-orange-600 fill-orange-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Prestataires recommandés</h2>
                </div>

                {loadingProviders ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                    </div>
                ) : providers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {providers.slice(0, 6).map((provider) => (
                            <button
                                key={provider.id}
                                onClick={() => navigate(`/user/provider/${provider.user?.id}`)}
                                className="bg-white rounded-xl p-4 border border-gray-100 hover:border-orange-300 hover:shadow-md transition-all text-left"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold shrink-0">
                                        {provider.user?.name?.charAt(0) || '?'}{provider.user?.surname?.charAt(0) || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 truncate">
                                            {provider.user?.surname} {provider.user?.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 truncate">{provider.bio || 'Prestataire professionnel'}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            <span className="text-sm font-medium text-gray-700">4.8</span>
                                            <span className="text-xs text-gray-400 ml-1">• {provider.domaines?.length || 0} domaines</span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                        <p className="text-gray-500">Aucun prestataire disponible</p>
                    </div>
                )}
            </div>

            {/* Publications récentes */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-orange-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Actualités</h2>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {posts.length > 0 ? posts.map((post, index) => {
                            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
                            const storageUrl = apiUrl.replace('/api', '/storage');

                            const images = post.images?.map((img: any) =>
                                `${storageUrl}/${img.image_path.replace(/\\/g, '/')}`
                            );

                            return (
                                <div key={post.id}>
                                    <PostCard
                                        id={post.id}
                                        author={`${post.prestataire?.user?.surname} ${post.prestataire?.user?.name}`}
                                        avatar={`${post.prestataire?.user?.name?.charAt(0)}${post.prestataire?.user?.surname?.charAt(0)}`}
                                        role="Prestataire"
                                        content={post.contenu || post.titre || ''}
                                        images={images}
                                        initialLikes={post.likes_count || 0}
                                        initialIsLiked={post.is_liked}
                                        commentsCount={post.comments_count || 0}
                                        comments={[]}
                                        timeAgo={getTimeAgo(post.created_at)}
                                        user_id={post.prestataire?.user?.id}
                                    />

                                </div>
                            );
                        }) : (
                            <div className="text-center py-12 bg-gray-50 rounded-xl">
                                <p className="text-gray-500 mb-4">Aucune publication pour le moment</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
