import { Star, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProviderProps {
    id: number;
    name: string;
    avatar: string;
    profession: string;
    rating: number;
    reviews: number;
    location: string;
    jobsCompleted: number;
    onBook: () => void;
}

export default function ProviderCard({ name, avatar, profession, rating, reviews, location, jobsCompleted, onBook }: ProviderProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 transition hover:shadow-md">
            <div className="shrink-0">
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-primary to-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-orange-200">
                    {avatar}
                </div>
            </div>

            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{name}</h3>
                        <p className="text-primary font-medium">{profession}</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center text-yellow-500 font-bold">
                            <Star className="w-4 h-4 fill-current mr-1" />
                            {rating}
                        </div>
                        <p className="text-xs text-gray-500">{reviews} avis</p>
                    </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {location}
                    </div>
                    <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1 text-gray-400" />
                        {jobsCompleted} jobs réalisés
                    </div>
                </div>

                <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                    Expert qualifié avec plus de 5 ans d'expérience. Disponible pour tous vos travaux et réparations. Travail soigné et garanti.
                </p>
            </div>

            <div className="flex items-center md:flex-col justify-center gap-2 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-6">
                <Button onClick={onBook} className="w-full bg-primary hover:bg-orange-700">
                    Réserver
                </Button>
                <Button variant="outline" className="w-full">
                    Voir profil
                </Button>
            </div>
        </div>
    );
}
