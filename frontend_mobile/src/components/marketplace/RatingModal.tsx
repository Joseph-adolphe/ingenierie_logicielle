import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface RatingModalProps {
    providerId: number;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function RatingModal({ providerId, isOpen, onClose, onSuccess }: RatingModalProps) {
    const [rating, setRating] = useState(0); // 0 to 5
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleSubmit = async () => {
        if (rating === 0) return;

        setIsSubmitting(true);
        try {
            const res = await api.post(`/prestataires/${providerId}/reviews`, {
                note: rating,
                comment: comment
            });
            if (res.data.status) {
                onSuccess();
                onClose();
                setRating(0);
                setComment("");
            }
        } catch (error) {
            console.error("Error submitting review", error);
            // alert("Erreur lors de l'envoi de l'avis");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-950">
                <DialogTitle className="text-center text-xl font-bold bg">Noter ce prestataire</DialogTitle>
                <div className="flex flex-col items-center gap-4 py-4">
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                className="transition-transform hover:scale-110 focus:outline-none"
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    className={`w-8 h-8 ${star <= (hoveredRating || rating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 font-medium">
                        {rating > 0 ? `Vous donnez ${rating} étoile${rating > 1 ? 's' : ''}` : 'Sélectionnez une note'}
                    </p>

                    <textarea
                        className="w-full min-h-[100px] p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none bg-gray-50"
                        placeholder="Racontez votre expérience (optionnel)..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    <div className="flex gap-3 w-full mt-2">
                        <Button variant="outline" className="flex-1" onClick={onClose} disabled={isSubmitting}>
                            Annuler
                        </Button>
                        <Button
                            className="flex-1 bg-primary hover:bg-orange-700"
                            onClick={handleSubmit}
                            disabled={rating === 0 || isSubmitting}
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Envoyer
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
