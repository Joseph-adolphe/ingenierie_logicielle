import { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import PostCard from '@/components/marketplace/PostCard';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function ProviderPosts() {
    const { user } = useAuth();
    const [myPosts, setMyPosts] = useState<any[]>([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [provider, setProvider] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // 1. Get Provider Info to have the ID
            try {
                const providerRes = await api.get('/prestataire');
                if (providerRes.data && providerRes.data.id) {
                    setProvider(providerRes.data);
                }
            } catch (err) {
                console.log("User is not a provider yet or error");
            }

            // 2. Fetch Posts
            const postsRes = await api.get('/my/posts');
            setMyPosts(postsRes.data.posts || []);

        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            // Limit to e.g. 5 images if needed, for now just append
            setSelectedImages(prev => [...prev, ...files]);
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostContent.trim() || !provider) return;

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('contenu', newPostContent);
            if (selectedImages.length > 0) {
                selectedImages.forEach(file => {
                    formData.append('images[]', file);
                });
            }

            await api.post(`/prestataire/${provider.id}/posts`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Reset form
            setNewPostContent('');
            setSelectedImages([]);
            if (fileInputRef.current) fileInputRef.current.value = '';

            // Refresh posts
            const postsRes = await api.get('/my/posts');
            setMyPosts(postsRes.data.posts || []);

        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsSubmitting(false);
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
            <div className="flex justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h1 className="text-3xl font-bold text-gray-900">Mes Publications</h1>

            {provider ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                        <ImageIcon className="w-5 h-5 mr-2 text-orange-600" /> Créer un nouveau post
                    </h2>
                    <form onSubmit={handlePostSubmit} className="space-y-4">
                        <Textarea
                            placeholder="Partagez vos réalisations ou actualités..."
                            className="resize-none h-24 bg-gray-50 border-gray-200 focus:bg-white transition"
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                        />

                        {selectedImages.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedImages.map((file, idx) => (
                                    <div key={idx} className="relative inline-block">
                                        <div className="text-sm bg-orange-50 text-orange-700 px-3 py-1 rounded-full flex items-center gap-2">
                                            <span className="truncate max-w-[150px]">{file.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="hover:text-orange-900"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handleImageSelect}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="text-gray-600"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <ImageIcon className="w-4 h-4 mr-2" /> Ajouter des photos
                            </Button>
                            <Button
                                type="submit"
                                disabled={!newPostContent.trim() || isSubmitting}
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Publier'}
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg">
                    Vous devez compléter votre profil prestataire avant de pouvoir publier.
                </div>
            )}

            <div className="space-y-6">
                {myPosts.length > 0 ? (
                    myPosts.map(post => {
                        // Construire l'URL de stockage dynamique
                        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
                        const storageUrl = apiUrl.replace('/api', '/storage');

                        // Mapper les images
                        const images = post.images && post.images.length > 0
                            ? post.images.map((img: any) => `${storageUrl}/${img.image_path.replace(/\\/g, '/')}`)
                            : undefined;

                        const mappedProps = {
                            id: post.id,
                            author: `${user?.surname} ${user?.name}`,
                            avatar: `${user?.name?.charAt(0)}${user?.surname?.charAt(0)}`,
                            role: 'Prestataire',
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
                    <div className="text-center py-12 text-gray-500">
                        Aucune publication pour le moment.
                    </div>
                )}
            </div>
        </div>
    );
}
