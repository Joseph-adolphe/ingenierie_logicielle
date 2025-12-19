import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Star, Briefcase, MapPin, CheckCircle, Loader2, MessageSquare, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PostCard from '@/components/marketplace/PostCard';
import RatingModal from '@/components/marketplace/RatingModal';
import ReviewList, { type Review } from '@/components/marketplace/ReviewList';
import api from '@/lib/api';

interface Domaine {
    id: number;
    nom_domaine: string;
}

interface ProviderUser {
    id: number;
    name: string;
    surname: string;
    city: string;
    country: string;
    avatar?: string;
}

interface Provider {
    id: number;
    user_id: number;
    description: string;
    tarif_horaire: number;
    user: ProviderUser;
    domaines: Domaine[];
    rating?: number;
    reviews_count?: number;
    jobs_count?: number;
}

export default function ProviderPublicProfile() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [provider, setProvider] = useState<Provider | null>(null);
    const [providerPosts, setProviderPosts] = useState<any[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            fetchProviderDetails(parseInt(id));
        }
    }, [id]);

    const fetchProviderDetails = async (userId: number) => {
        setIsLoading(true);
        try {
            // Fetch provider details using user_id - the API finds the prestataire linked to this user
            const res = await api.get(`/prestataires/user/${userId}`);
            if (res.data) {
                const providerData = res.data.prestataire || res.data;
                setProvider(providerData);

                // Fetch posts using prestataire_id
                if (providerData.id) {
                    fetchPosts(providerData.id);
                    fetchReviews(providerData.id);
                }
            }
        } catch (error) {
            console.error("Error fetching provider details", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPosts = async (providerId: number) => {
        try {
            const postsRes = await api.get(`/prestataire/${providerId}/posts`);
            if (postsRes.data.status) {
                setProviderPosts(postsRes.data.posts);
            }
        } catch (error) {
            console.error("Error fetching posts", error);
        }
    };

    const fetchReviews = async (providerId: number) => {
        setIsLoadingReviews(true);
        try {
            const res = await api.get(`/prestataires/${providerId}/reviews`);
            if (res.data.status) {
                setReviews(res.data.reviews);
            }
        } catch (error) {
            console.error("Error fetching reviews", error);
        } finally {
            setIsLoadingReviews(false);
        }
    };

    const handleRatingSuccess = () => {
        if (provider) {
            fetchReviews(provider.id);
            // Optionally re-fetch provider details to update average rating if backend calculates it
        }
    };

    const handleContact = async () => {
        if (!provider) return;
        try {
            const res = await api.post(`/conversations/start/${provider.user.id}`);
            if (res.data.status) {
                navigate('/user/messages', { state: { conversationId: res.data.conversation.id } });
            }
        } catch (error) {
            console.error("Error starting conversation", error);
            alert("Erreur lors de la création de la conversation");
        }
    };

    const handleBook = (name: string) => {
        alert(`Fonctionnalité de réservation pour ${name} à venir !`);
    };

    const getInitials = (user: ProviderUser) => {
        return `${user.name?.charAt(0) || ''}${user.surname?.charAt(0) || ''}`.toUpperCase();
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
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!provider) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-semibold text-gray-900">Prestataire non trouvé</h2>
                <p className="text-gray-500 mt-2">Ce profil n'existe pas ou a été supprimé.</p>
                <Button onClick={() => navigate('/user/home')} className="mt-4">
                    Retour à l'accueil
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 min-h-screen">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-500 hover:text-primary transition mb-4 group"
            >
                <ChevronRight className="w-5 h-5 rotate-180 mr-1 group-hover:-translate-x-1 transition-transform" />
                Retour
            </button>

            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-48 bg-orange-600 relative">
                    <div className="absolute inset-0 bg-black/10"></div>
                </div>
                <div className="px-8 pb-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start -mt-16 relative z-10">
                        <div className="w-32 h-32 bg-white rounded-full p-1 shadow-xl shrink-0">
                            <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-3xl font-bold text-gray-600 bg-linear-to-br from-gray-100 to-gray-200">
                                {getInitials(provider.user)}
                            </div>
                        </div>
                        <div className="flex-1 w-full pt-16 md:pt-16">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        {provider.user.surname} {provider.user.name}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-2 mb-4">
                                        {provider.domaines?.map(d => (
                                            <span key={d.id} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20">
                                                {d.nom_domaine}
                                            </span>
                                        ))}
                                        <div className="flex items-center text-yellow-500 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100 font-bold">
                                            <Star className="w-4 h-4 fill-current mr-1" />
                                            {provider.rating ? provider.rating.toFixed(1) : "New"}
                                            {provider.reviews_count ? <span className="text-gray-400 text-xs ml-1">({provider.reviews_count})</span> : null}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-500 text-sm">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {provider.user.city || "Localisation inconnue"}
                                        </div>
                                        {provider.tarif_horaire && (
                                            <div className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-semibold">
                                                {provider.tarif_horaire}€ /h
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4">
                                    <Button size="lg" variant="outline" className="border-primary/20 text-primary hover:bg-primary/10" onClick={() => setIsRatingModalOpen(true)}>
                                        <Star className="w-4 h-4 mr-2" />
                                        Noter
                                    </Button>
                                    <Button size="lg" variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50" onClick={handleContact}>
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Contacter
                                    </Button>
                                    <Button size="lg" className="bg-primary hover:bg-orange-700 shadow-lg" onClick={() => handleBook(provider.user.name)}>
                                        Réserver
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mt-8">
                        <div className="md:col-span-2 space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-primary" /> À propos
                                </h3>
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {provider.description || "Aucune description fournie."}
                                </div>
                            </div>

                            {/* REVIEWS SECTION */}
                            <div id="reviews">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <Star className="w-5 h-5 text-primary" /> Avis clients ({reviews.length})
                                    </h3>
                                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/5" onClick={() => setIsRatingModalOpen(true)}>
                                        <PenLine className="w-4 h-4 mr-2" />
                                        Écrire un avis
                                    </Button>
                                </div>
                                <ReviewList reviews={reviews} isLoading={isLoadingReviews} />
                            </div>

                            {/* POSTS SECTION */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Publications ({providerPosts.length})</h3>

                                {providerPosts.length > 0 ? (
                                    <div className="space-y-6">
                                        {providerPosts.map(post => {
                                            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
                                            const storageUrl = apiUrl.replace('/api', '/storage');
                                            const images = post.images?.map((img: any) =>
                                                `${storageUrl}/${img.image_path.replace(/\\/g, '/')}`
                                            );

                                            return (
                                                <PostCard
                                                    key={post.id}
                                                    id={post.id}
                                                    author={`${provider.user.surname} ${provider.user.name}`}
                                                    avatar={getInitials(provider.user)}
                                                    role="Prestataire"
                                                    content={post.contenu || post.titre || ''}
                                                    images={images}
                                                    initialLikes={post.likes_count || 0}
                                                    initialIsLiked={post.is_liked}
                                                    commentsCount={post.comments_count || 0}
                                                    comments={[]}
                                                    timeAgo={getTimeAgo(post.created_at)}
                                                    user_id={provider.id} // Fixed prop name from prestataire_id
                                                />
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500">
                                        Ce prestataire n'a pas encore publié de contenu.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 sticky top-4">
                                <h3 className="font-bold text-gray-900 mb-4">Informations</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <MapPin className="w-5 h-5 text-gray-400" />
                                        <span>{provider.user.city || provider.user.country || "Non renseigné"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Briefcase className="w-5 h-5 text-gray-400" />
                                        <span>{provider.jobs_count || 0} travaux réalisés</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span>Identité vérifiée</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rating Modal */}
            {provider && (
                <RatingModal
                    providerId={provider.id}
                    isOpen={isRatingModalOpen}
                    onClose={() => setIsRatingModalOpen(false)}
                    onSuccess={handleRatingSuccess}
                />
            )}
        </div>
    );
}
