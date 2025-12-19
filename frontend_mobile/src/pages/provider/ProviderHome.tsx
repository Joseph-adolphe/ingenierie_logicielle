import { useState, useEffect } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import PostCard from '@/components/marketplace/PostCard';
import ReviewList from '@/components/marketplace/ReviewList';

export default function ProviderHome() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [provider, setProvider] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingPosts, setIsLoadingPosts] = useState(false);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);

    useEffect(() => {
        if (user) {
            fetchInitialData();
        }
    }, [user]);

    const fetchInitialData = async () => {
        setIsLoading(true);
        try {
            // 1. Get Provider Info
            const providerRes = await api.get('/prestataire');
            let providerData = null;
            if (providerRes.data) {
                providerData = providerRes.data.prestataire || providerRes.data;
                setProvider(providerRes.data);
            }

            // 2. Fetch Posts & Reviews if provider exists
            if (providerData && providerData.id) {
                // Posts (Global Feed)
                setIsLoadingPosts(true);
                api.get('/posts')
                    .then(res => setPosts(res.data.posts || []))
                    .catch(e => console.error("Error posts", e))
                    .finally(() => setIsLoadingPosts(false));

                // Reviews
                setIsLoadingReviews(true);
                api.get(`/prestataires/${providerData.id}/reviews`)
                    .then(res => setReviews(res.data.reviews || []))
                    .catch(e => console.error("Error reviews", e))
                    .finally(() => setIsLoadingReviews(false));
            }
        } catch (error) {
            console.error('Error fetching provider home data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            </div>
        );
    }

    if (!provider) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl shadow-sm border border-orange-100">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <Star className="w-8 h-8 text-orange-600" />
                </div>
                <h2 className="text-xl font-bold mb-2">Devenir Prestataire</h2>
                <p className="text-gray-500 mb-6 max-w-md">Commencez à proposer vos services et développez votre clientèle dès aujourd'hui.</p>
                <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => window.location.reload()}>
                    Actualiser
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header Stats - Keeping the user's header design (removed from here as it was in the diff previously but maybe user kept it?) 
                Actually, the user's previous diff REMOVED the header stats block. 
                I will follow the user's lead and valid structure.
            */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: My Posts (replacing Pending Requests) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span>Fil d'actualité</span>
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {isLoadingPosts ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
                            </div>
                        ) : posts.length > 0 ? (
                            posts.map(post => {
                                // Dynamic Helper URL logic
                                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
                                const storageUrl = apiUrl.replace('/api', '/storage');

                                const images = post.images && post.images.length > 0
                                    ? post.images.map((img: any) => `${storageUrl}/${img.image_path.replace(/\\/g, '/')}`)
                                    : undefined;

                                const mappedProps = {
                                    id: post.id,
                                    author: post.user ? `${post.user.surname} ${post.user.name}` : 'Utilisateur',
                                    avatar: post.user ? `${post.user.name?.charAt(0)}${post.user.surname?.charAt(0)}` : 'U',
                                    role: post.user?.role === 'prestataire' ? 'Prestataire' : 'Utilisateur',
                                    content: post.contenu || post.titre || '',
                                    images: images,
                                    initialLikes: post.likes_count || 0,
                                    commentsCount: post.comments_count || 0,
                                    comments: [],
                                    timeAgo: getTimeAgo(post.created_at)
                                };
                                return <PostCard key={post.id} {...mappedProps} />;
                            })
                        ) : (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                                <p className="text-gray-500 mb-4">Aucune publication récente.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Reviews */}
                <div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Avis Clients</h2>
                            <div className="flex items-center gap-1 text-sm bg-orange-50 text-orange-700 px-2 py-1 rounded-lg">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span className="font-bold">{provider.note_moyenne || '0.0'}</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <ReviewList reviews={reviews.slice(0, 5)} isLoading={isLoadingReviews} />
                        </div>

                        {reviews.length > 0 && (
                            <Button variant="link" className="w-full mt-4 text-orange-600 hover:text-orange-700" onClick={() => navigate('/provider/profile')}>
                                Voir tous les avis
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
