import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReviewUser {
    id: number;
    name: string;
    surname: string;
    avatar?: string;
}

export interface Review {
    id: number;
    user_id: number;
    note: number;
    comment: string;
    created_at: string;
    user: ReviewUser;
}

interface ReviewListProps {
    reviews: Review[];
    isLoading?: boolean;
}

export default function ReviewList({ reviews, isLoading = false }: ReviewListProps) {
    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[1, 2].map(i => (
                    <div key={i} className="flex gap-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-xl border border-gray-100">
                Aucun avis pour le moment. Soyez le premier à donner votre avis !
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                    <Avatar className="w-10 h-10 border border-gray-100">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {review.user?.name?.charAt(0) || '?'}{review.user?.surname?.charAt(0) || '?'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <div>
                                <h4 className="font-semibold text-gray-900 text-sm">
                                    {review.user?.surname || 'Utilisateur'} {review.user?.name || 'Inconnu'}
                                </h4>
                                <div className="flex items-center gap-1 mt-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-3 h-3 ${star <= review.note ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <span className="text-xs text-gray-400">
                                {formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: fr })}
                            </span>
                        </div>
                        {review.comment && (
                            <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                                {review.comment}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
