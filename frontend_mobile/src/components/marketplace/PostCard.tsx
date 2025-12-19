import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send, Loader2, Flag, AlertTriangle, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface User {
    id: number;
    name: string;
    surname: string;
    avatar?: string;
}

interface Comment {
    id: number;
    user_id: number;
    post_id: number;
    content?: string; // Backend sometimes returns 'contenu' map it manually or align
    contenu: string;
    created_at: string;
    user: User;
    replies?: Comment[];
}

interface PostProps {
    id: number;
    author: string;
    avatar: string;
    role: string;
    content: string;
    images?: string[];
    initialLikes: number;
    initialIsLiked?: boolean;
    commentsCount: number;
    comments: any[]; // We fetch them, so initial might be empty or count
    timeAgo: string;
    user_id?: number; // ID de l'utilisateur (prestataire) pour la navigation vers le profil
}

export default function PostCard({ id, author, avatar, role, content, images, initialLikes, initialIsLiked = false, commentsCount, timeAgo, user_id }: PostProps) {
    const navigate = useNavigate();
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(initialIsLiked);

    // Comments state
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [commentsLoaded, setCommentsLoaded] = useState(false);
    const [currentCommentsCount, setCurrentCommentsCount] = useState(commentsCount);

    // Inputs
    const [newComment, setNewComment] = useState("");
    const [replyContent, setReplyContent] = useState("");
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Report & Options State
    const [showOptions, setShowOptions] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [isReporting, setIsReporting] = useState(false);

    // Lightbox State
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);

    const MAX_CONTENT_LENGTH = 180;
    const shouldTruncate = content.length > MAX_CONTENT_LENGTH;
    const displayContent = shouldTruncate && !isExpanded ? content.slice(0, MAX_CONTENT_LENGTH) + "..." : content;

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (images) {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (images) {
            setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
        }
    };

    const handleLike = async () => {
        // Optimistic update
        const previousLikes = likes;
        const previousIsLiked = isLiked;

        setLikes(prev => isLiked ? prev - 1 : prev + 1);
        setIsLiked(!isLiked);

        try {
            await api.post(`/posts/${id}/like`);
        } catch (error) {
            // Revert on error
            setLikes(previousLikes);
            setIsLiked(previousIsLiked);
            console.error("Error liking post", error);
        }
    };

    const toggleComments = async () => {
        if (!showComments) {
            setShowComments(true);
            if (!commentsLoaded) {
                fetchComments();
            }
        } else {
            setShowComments(false);
        }
    };

    const fetchComments = async () => {
        setIsLoadingComments(true);
        try {
            const res = await api.get(`/posts/${id}/comments`);
            if (res.data.status) {
                setComments(res.data.comments);
                setCommentsLoaded(true);
            }
        } catch (error) {
            console.error("Error fetching comments", error);
        } finally {
            setIsLoadingComments(false);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await api.post(`/posts/${id}/comments`, {
                contenu: newComment
            });

            if (res.data.status) {
                // Add new comment to top
                setComments([res.data.comment, ...comments]);
                setNewComment("");
                setCurrentCommentsCount(prev => prev + 1);
            }
        } catch (error) {
            console.error("Error posting comment", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReplySubmit = async (parentId: number) => {
        if (!replyContent.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await api.post(`/comments/${parentId}/reply`, {
                contenu: replyContent
            });

            if (res.data.status) {
                // Find parent and add reply
                setComments(prevComments => prevComments.map(comment => {
                    if (comment.id === parentId) {
                        return {
                            ...comment,
                            replies: [...(comment.replies || []), res.data.reply]
                        };
                    }
                    return comment;
                }));
                setReplyingTo(null);
                setReplyContent("");
                // Optionally increment total count if you track replies in total count
            }
        } catch (error) {
            console.error("Error replying", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReportSubmit = async () => {
        setIsReporting(true);
        try {
            const res = await api.post(`/posts/${id}/report`, {
                raison: reportReason
            });
            if (res.data.status) {
                setShowReportModal(false);
                setReportReason("");
                // You could use a toast here
                alert("Post signalé avec succès");
            }
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                alert("Vous avez déjà signalé ce post");
                setShowReportModal(false);
            } else {
                console.error("Error reporting post", error);
                alert("Une erreur est survenue lors du signalement");
            }
        } finally {
            setIsReporting(false);
        }
    };

    const formatCommentDate = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: fr });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 relative">
            <div className="p-4 flex justify-between items-start">
                <div className="flex gap-3">
                    <button
                        onClick={() => user_id && navigate(`/user/provider/${user_id}`)}
                        className={`w-10 h-10 rounded-full bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold shrink-0 uppercase ${user_id ? 'cursor-pointer hover:ring-2 hover:ring-orange-300 transition' : ''}`}
                    >
                        {avatar}
                    </button>
                    <div>
                        <button
                            onClick={() => user_id && navigate(`/user/provider/${user_id}`)}
                            className={`font-semibold text-gray-900 ${user_id ? 'hover:text-orange-600 hover:underline cursor-pointer transition' : ''}`}
                        >
                            {author}
                        </button>
                        <p className="text-xs text-gray-500">{role} • {timeAgo}</p>
                    </div>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowOptions(!showOptions)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
                    >
                        <MoreHorizontal className="w-5 h-5" />
                    </button>

                    {/* Options Menu */}
                    {showOptions && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10 py-1 animate-in fade-in slide-in-from-top-2">
                            <button
                                onClick={() => {
                                    setShowOptions(false);
                                    setShowReportModal(true);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <Flag className="w-4 h-4" />
                                Signaler le post
                            </button>
                        </div>
                    )}

                    {/* Backdrop for options menu to close on click outside */}
                    {showOptions && (
                        <div className="fixed inset-0 z-0" onClick={() => setShowOptions(false)}></div>
                    )}
                </div>
            </div>

            <div className="px-4 pb-2">
                <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                    {displayContent}
                </p>
                {shouldTruncate && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-orange-600 hover:text-orange-700 text-sm font-semibold mt-1 transition-colors"
                    >
                        {isExpanded ? "Voir moins" : "Voir plus"}
                    </button>
                )}
            </div>

            {images && images.length > 0 && (
                <div className="mt-3 px-4">
                    <div className={`grid gap-1 overflow-hidden rounded-xl border border-gray-100 ${images.length === 1 ? 'grid-cols-1' :
                        images.length === 2 ? 'grid-cols-2' :
                            images.length === 3 ? 'grid-cols-2 md:grid-cols-3' :
                                'grid-cols-2'
                        }`}>
                        {images.slice(0, 4).map((img, idx) => {
                            // Grid spans handling
                            let spanClass = "";
                            if (images.length === 3 && idx === 0) spanClass = "row-span-2 h-full";

                            return (
                                <div
                                    key={idx}
                                    onClick={() => openLightbox(idx)}
                                    className={`relative cursor-pointer group overflow-hidden bg-gray-100 ${spanClass} ${images.length === 1 ? 'h-96' : 'h-64'}`}
                                >
                                    <img
                                        src={img}
                                        alt={`Post ${idx + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {/* Overlay for +N images */}
                                    {images.length > 4 && idx === 3 && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm transition-colors group-hover:bg-black/40">
                                            <span className="text-white text-3xl font-bold">+{images.length - 3}</span>
                                        </div>
                                    )}
                                    {/* Hover overlay hint */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <Maximize2 className="text-white w-8 h-8 drop-shadow-lg transform scale-75 group-hover:scale-100 transition-transform" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="p-4 border-t border-gray-50">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1 text-sm text-gray-500">
                        <span className="font-semibold text-gray-900">{likes}</span> J'aime
                    </div>
                    <div className="flex gap-4 text-sm text-gray-500">
                        <button onClick={toggleComments} className="hover:underline">
                            {currentCommentsCount} commentaire{currentCommentsCount > 1 ? 's' : ''}
                        </button>
                        <span>0 partages</span>
                    </div>
                </div>

                <div className="flex justify-between border-t border-gray-100 pt-2">
                    <Button
                        variant="ghost"
                        className={`flex-1 gap-2 ${isLiked ? 'text-red-500 hover:text-red-600 hover:bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}
                        onClick={handleLike}
                    >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                        J'aime
                    </Button>
                    <Button
                        variant="ghost"
                        className="flex-1 gap-2 text-gray-600 hover:bg-gray-50"
                        onClick={toggleComments}
                    >
                        <MessageCircle className="w-5 h-5" />
                        Commenter
                    </Button>
                    <Button variant="ghost" className="flex-1 gap-2 text-gray-600 hover:bg-gray-50">
                        <Share2 className="w-5 h-5" />
                        Partager
                    </Button>
                </div>

                {showComments && (
                    <div className="mt-4 space-y-4 pt-4 border-t border-gray-100 animate-in slide-in-from-top-2">
                        {/* New Comment Input */}
                        <form onSubmit={handleCommentSubmit} className="flex gap-3 mb-6">
                            <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-orange-100 text-orange-600 text-xs">MOI</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex gap-2">
                                <Input
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Écrivez un commentaire..."
                                    className="flex-1 bg-gray-50 border-gray-200 focus:bg-white transition"
                                    disabled={isSubmitting}
                                />
                                <Button type="submit" size="icon" disabled={!newComment.trim() || isSubmitting} className="shrink-0 bg-orange-600 hover:bg-orange-700">
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                </Button>
                            </div>
                        </form>

                        {/* Comments List */}
                        {isLoadingComments ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                            </div>
                        ) : comments.length > 0 ? (
                            <div className="space-y-6">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="group">
                                        <div className="flex gap-3">
                                            <Avatar className="w-8 h-8 mt-1">
                                                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-bold">
                                                    {comment.user.name.charAt(0)}{comment.user.surname.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="bg-gray-50 p-3 rounded-2xl rounded-tl-none">
                                                    <div className="flex justify-between items-baseline mb-1">
                                                        <span className="font-semibold text-sm text-gray-900">
                                                            {comment.user.surname} {comment.user.name}
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            {formatCommentDate(comment.created_at)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-700 leading-relaxed">{comment.contenu}</p>
                                                </div>

                                                <div className="flex items-center gap-4 mt-1 ml-2">
                                                    <button
                                                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                                        className="text-xs font-medium text-gray-500 hover:text-orange-600 transition"
                                                    >
                                                        Répondre
                                                    </button>
                                                </div>

                                                {/* Reply Input */}
                                                {replyingTo === comment.id && (
                                                    <div className="flex gap-2 mt-3 ml-2 animate-in fade-in slide-in-from-top-1">
                                                        <div className="w-6 border-l-2 border-gray-200 rounded-bl-lg mb-4"></div>
                                                        <div className="flex-1 flex gap-2">
                                                            <Input
                                                                value={replyContent}
                                                                onChange={(e) => setReplyContent(e.target.value)}
                                                                placeholder="Votre réponse..."
                                                                className="h-9 text-sm"
                                                                autoFocus
                                                            />
                                                            <Button size="sm" onClick={() => handleReplySubmit(comment.id)} disabled={isSubmitting}>
                                                                <Send className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Replies List */}
                                                {comment.replies && comment.replies.length > 0 && (
                                                    <div className="mt-3 space-y-3 pl-4 border-l-2 border-gray-100 ml-4">
                                                        {comment.replies.map(reply => (
                                                            <div key={reply.id} className="flex gap-3">
                                                                <Avatar className="w-6 h-6 mt-1">
                                                                    <AvatarFallback className="bg-purple-100 text-purple-700 text-[10px] font-bold">
                                                                        {reply.user.name.charAt(0)}{reply.user.surname.charAt(0)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex-1">
                                                                    <div className="bg-gray-50 p-2.5 rounded-xl rounded-tl-none">
                                                                        <div className="flex justify-between items-baseline mb-0.5">
                                                                            <span className="font-semibold text-xs text-gray-900">
                                                                                {reply.user.surname} {reply.user.name}
                                                                            </span>
                                                                            <span className="text-[10px] text-gray-400">
                                                                                {formatCommentDate(reply.created_at)}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-sm text-gray-700">{reply.contenu}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400 text-sm italic">
                                Soyez le premier à commenter !
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-red-600 font-semibold">
                                <AlertTriangle className="w-5 h-5" />
                                Signaler la publication
                            </div>
                            <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <p className="text-sm text-gray-600">
                                Aidez-nous à comprendre le problème. Pourquoi voulez-vous signaler cette publication ?
                            </p>
                            <textarea
                                value={reportReason}
                                onChange={(e) => setReportReason(e.target.value)}
                                placeholder="Indiquez la raison (spam, contenu inapproprié, etc.)"
                                className="w-full h-32 p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none resize-none bg-gray-50"
                            />
                            <div className="flex gap-3 justify-end pt-2">
                                <Button variant="ghost" onClick={() => setShowReportModal(false)}>
                                    Annuler
                                </Button>
                                <Button
                                    onClick={handleReportSubmit}
                                    disabled={!reportReason.trim() || isReporting}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    {isReporting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Envoyer le signalement'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Lightbox Dialog using Radix UI Dialog (shadcn) */}
            <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
                <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-transparent border-none shadow-none flex flex-col items-center justify-center outline-none">
                    {/* Accessibility Title for Screen Readers */}
                    <DialogTitle className="sr-only">Visualisation de l'image</DialogTitle>

                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Close button positioned top-right of the viewport */}
                        <button
                            onClick={() => setLightboxOpen(false)}
                            className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition backdrop-blur-md"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Navigation Buttons */}
                        {images && images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 z-50 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition backdrop-blur-md hidden md:flex"
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 z-50 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition backdrop-blur-md hidden md:flex"
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            </>
                        )}

                        {/* Image Display */}
                        {images && (
                            <div className="relative max-h-full max-w-full overflow-hidden rounded-lg shadow-2xl animate-in zoom-in-95 duration-200">
                                <img
                                    src={images[currentImageIndex]}
                                    alt={`Fullscreen ${currentImageIndex + 1}`}
                                    className="max-h-[85vh] max-w-[95vw] object-contain"
                                />
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-1 rounded-full text-white text-sm backdrop-blur-md">
                                    {currentImageIndex + 1} / {images.length}
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
