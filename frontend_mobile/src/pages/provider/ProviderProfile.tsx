import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Star, Award, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface Domaine {
    id: number;
    nom_domaine: string;
    pivot: {
        niveau_expertise: string;
    };
}

interface Post {
    id: number;
    titre: string;
    contenu: string;
    created_at: string;
    images?: {
        id: number;
        image_path: string;
    }[];
}

export default function ProviderProfile() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // States
    const [domaines, setDomaines] = useState<Domaine[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [provider, setProvider] = useState<any>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // Create Post States
    const [isCreatingPost, setIsCreatingPost] = useState(false);
    const [newPost, setNewPost] = useState<{ titre: string; contenu: string; images: File[] }>({
        titre: '',
        contenu: '',
        images: []
    });
    const [isSubmittingPost, setIsSubmittingPost] = useState(false);

    useEffect(() => {
        if (user?.id) {
            fetchData();
        }
    }, [user?.id]);

    const fetchData = async () => {
        setIsLoadingData(true);
        try {
            // 1. Fetch provider details (needed for ID)
            try {
                const providerRes = await api.get('/prestataire');
                // The endpoint normally returns the object directly
                if (providerRes.data && providerRes.data.id) {
                    setProvider(providerRes.data);
                }
            } catch (err) {
                // Not a provider or error
                console.log('User is not a provider or error fetching provider details');
            }

            // 2. Fetch specific domains
            try {
                const domainRes = await api.get(`/prestataire/${user?.id}/domaines`);
                setDomaines(domainRes.data.domaines || []);
            } catch (e) { console.error('Error fetching domains', e); }

            // 3. Fetch Posts
            try {
                const postsRes = await api.get('/my/posts');
                setPosts(postsRes.data.posts || []);
            } catch (e) {
                setPosts([]);
            }

        } catch (error) {
            console.error('Global error loading data:', error);
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!provider?.id) return;

        setIsSubmittingPost(true);
        try {
            const formData = new FormData();
            formData.append('titre', newPost.titre);
            formData.append('contenu', newPost.contenu);
            if (newPost.images.length > 0) {
                newPost.images.forEach(file => {
                    formData.append('images[]', file);
                });
            }

            await api.post(`/prestataire/${provider.id}/posts`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Reset and refresh
            setIsCreatingPost(false);
            setNewPost({ titre: '', contenu: '', images: [] });

            // Refresh posts
            const postsRes = await api.get('/my/posts');
            setPosts(postsRes.data.posts || []);

        } catch (err: any) {
            console.error('Erreur création post:', err);
            alert(err.response?.data?.message || 'Erreur lors de la publication');
        } finally {
            setIsSubmittingPost(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setNewPost(prev => ({ ...prev, images: [...prev.images, ...files] }));
        }
    };

    const removeImage = (index: number) => {
        setNewPost(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500">Chargement...</p>
            </div>
        );
    }

    const getNiveauStars = (niveau: string) => {
        const levels: { [key: string]: number } = {
            'debutant': 1,
            'intermediaire': 2,
            'avance': 3,
            'expert': 4
        };
        const count = levels[niveau.toLowerCase()] || 0;
        return Array(4).fill(0).map((_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < count ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
            />
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50 relative">
            {/* Creates a simple Modal manually using fixed positioning */}
            {isCreatingPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-lg text-gray-900">Nouvelle Publication</h3>
                            <button
                                type="button"
                                onClick={() => setIsCreatingPost(false)}
                                className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition"
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleCreatePost} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"
                                    value={newPost.titre}
                                    onChange={e => setNewPost(prev => ({ ...prev, titre: e.target.value }))}
                                    placeholder="Donnez un titre à votre publication..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition resize-none"
                                    value={newPost.contenu}
                                    onChange={e => setNewPost(prev => ({ ...prev, contenu: e.target.value }))}
                                    placeholder="Partagez vos réalisations, offres ou actualités..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Images (optionnel)</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 hover:border-orange-300 transition cursor-pointer relative group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="flex flex-col items-center text-gray-400 group-hover:text-orange-500 transition">
                                        <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <p className="text-sm font-medium">Cliquez pour ajouter des photos</p>
                                        <p className="text-xs mt-1">JPG, PNG jusqu'à 5MB</p>
                                    </div>
                                </div>
                                {newPost.images.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {newPost.images.map((img, idx) => (
                                            <div key={idx} className="relative inline-block">
                                                <div className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-full flex items-center gap-1">
                                                    <span className="truncate max-w-[100px]">{img.name}</span>
                                                    <button type="button" onClick={() => removeImage(idx)} className="hover:text-red-500">×</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setIsCreatingPost(false)}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                                    disabled={isSubmittingPost}
                                >
                                    {isSubmittingPost ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            Publication...
                                        </>
                                    ) : 'Publier'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto p-4 animate-in fade-in zoom-in-95 duration-200">
                {/* Header avec Avatar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="bg-linear-to-r from-orange-600 to-orange-500 h-32"></div>
                    <div className="px-8 pb-6">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                            <div className="flex items-end gap-6">
                                <div className="relative -mt-16">
                                    <div className="w-32 h-32 bg-linear-to-br from-orange-600 to-orange-400 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                                        {user.name?.charAt(0)}{user.surname?.charAt(0)}
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
                                </div>
                                <div className="mb-4">
                                    <h1 className="text-3xl font-bold text-gray-900">{user.surname} {user.name}</h1>
                                    <p className="text-gray-500 flex items-center gap-2 mt-1">
                                        <Briefcase className="w-4 h-4" />
                                        Prestataire Professionnel - {provider ? 'Compte Vérifié' : 'Compte Standard'}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 md:mb-4">
                                <Button
                                    onClick={() => navigate('/provider/profile/edit')}
                                    className="bg-orange-600 hover:bg-orange-700 text-white w-full md:w-auto"
                                >
                                    Modifier le profil
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Colonne Gauche - Informations */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Informations Personnelles */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                                    <User className="w-5 h-5 text-orange-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Informations personnelles</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Email</p>
                                        <p className="text-gray-900 font-medium">{user.email}</p>
                                    </div>
                                </div>
                                {user.phone && (
                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Téléphone</p>
                                            <p className="text-gray-900 font-medium">{user.phone}</p>
                                        </div>
                                    </div>
                                )}
                                {(user.city || user.country) && (
                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Localisation</p>
                                            <p className="text-gray-900 font-medium">
                                                {user.city && user.country ? `${user.city}, ${user.country}` : user.city || user.country}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {user.birthday && (
                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Date de naissance</p>
                                            <p className="text-gray-900 font-medium">
                                                {new Date(user.birthday).toLocaleDateString('fr-FR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Domaines d'Expertise */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                                    <Award className="w-5 h-5 text-orange-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Domaines d'expertise</h2>
                            </div>
                            <div className="space-y-3">
                                {isLoadingData ? (
                                    <div className="flex justify-center p-4">
                                        <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
                                    </div>
                                ) : domaines.length > 0 ? (
                                    domaines.map((domaine) => (
                                        <div key={domaine.id} className="p-4 bg-linear-to-r from-orange-50 to-indigo-50 rounded-lg border border-orange-100">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{domaine.nom_domaine}</h3>
                                                    <p className="text-sm text-gray-600 capitalize">Niveau: {domaine.pivot.niveau_expertise}</p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {getNiveauStars(domaine.pivot.niveau_expertise)}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-gray-500 mb-2">Aucun domaine d'expertise renseigné</p>
                                        <Button
                                            variant="outline"
                                            onClick={() => navigate('/provider/profile/edit')}
                                            className="text-orange-600 border-orange-600 hover:bg-orange-50"
                                        >
                                            Ajouter mes domaines
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mes Publications / Posts */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                                        <Briefcase className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">Mes Publications</h2>
                                </div>
                                {provider && (
                                    <Button size="sm" onClick={() => setIsCreatingPost(true)} className="bg-orange-600 text-white hover:bg-orange-700">
                                        + Ajouter
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-4">
                                {isLoadingData ? (
                                    <div className="flex justify-center p-4">
                                        <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
                                    </div>
                                ) : posts.length > 0 ? (
                                    posts.map((post) => (
                                        <div key={post.id} className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50 flex flex-col hover:shadow-md transition duration-200">
                                            {post.images && post.images.length > 0 && (
                                                <div className={`w-full h-48 bg-gray-100 shrink-0 ${post.images.length > 1 ? 'overflow-x-auto flex snap-x' : ''}`}>
                                                    {post.images.map((img, idx) => (
                                                        <img
                                                            key={img.id}
                                                            src={`${(import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '/storage')}/${img.image_path.replace(/\\/g, '/')}`}
                                                            alt={`Post ${idx + 1}`}
                                                            className={`h-full object-cover ${post.images!.length > 1 ? 'w-4/5 snap-center border-r' : 'w-full'}`}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                            <div className="p-4 flex-1">
                                                <h3 className="font-bold text-gray-900 mb-2 text-lg">{post.titre}</h3>
                                                <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">{post.contenu}</p>
                                                <div className="flex items-center justify-between text-xs text-gray-400 border-t pt-3">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(post.created_at).toLocaleDateString('fr-FR')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                        <p className="text-gray-500 mb-2">Vous n'avez pas encore publié de contenu.</p>
                                        {!provider ? (
                                            <p className="text-xs text-orange-500">Devenez prestataire pour publier.</p>
                                        ) : (
                                            <Button variant="link" onClick={() => setIsCreatingPost(true)} className="text-orange-600">
                                                Créer mon premier post
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Colonne Droite - Statistiques */}
                    <div className="space-y-6">
                        {/* Statistiques */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Statistiques</h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-orange-50 rounded-lg text-center">
                                    <div className="text-3xl font-bold text-orange-600">{posts.length}</div>
                                    <div className="text-sm text-orange-600/80 font-medium">Publications</div>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg text-center">
                                    <div className="text-3xl font-bold text-green-600">0.0</div>
                                    <div className="text-sm text-green-600/80 font-medium">Note Moyenne</div>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-lg text-center">
                                    <div className="text-3xl font-bold text-purple-600">0</div>
                                    <div className="text-sm text-purple-600/80 font-medium">Avis Reçus</div>
                                </div>
                            </div>
                        </div>

                        {/* Informations du Compte */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Compte</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Rôle</p>
                                    <p className="text-gray-900 font-medium capitalize">{user.role}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Membre depuis</p>
                                    <p className="text-gray-900 font-medium">
                                        {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', {
                                            year: 'numeric',
                                            month: 'long'
                                        }) : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Statut</p>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                        Actif
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
