import { Star } from "lucide-react";
import img1 from "@/assets/img1.jpg";
import img2 from "@/assets/img2.jfif";
import img3 from "@/assets/img3.jpg";
import img4 from "@/assets/img4.jfif";

export default function Testimonials() {
    const reviews = [
        {
            name: "Sophie Martin",
            role: "Particulier",
            content: "J'ai trouvé un plombier en moins de 10 minutes. Service impeccable et très professionnel. Je recommande vivement !",
            rating: 5,
            avatar: img1
        },
        {
            name: "Thomas Dubois",
            role: "Propriétaire",
            content: "L'application est super fluide. Les prestataires sont vérifiés, ce qui est très rassurant pour des travaux à domicile.",
            rating: 5,
            avatar: img2
        },
        {
            name: "Marie Bernard",
            role: "Particulier",
            content: "Excellent pour le ménage. La personne est arrivée à l'heure et a fait un travail fantastique. Merci Helpix !",
            rating: 4,
            avatar: img3
        },
        {
            name: "Marie Bernard",
            role: "Particulier",
            content: "La plus part des applications qui font dans ces services que j'ai eu a utilisé nùont toujours deçus, mais avec Helpix je me sent à laise",
            rating: 4,
            avatar: img4
        }
    ];

    return (
        <section className="py-24 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
                    Ce que disent nos utilisateurs
                </h2>

                <div className="grid md:grid-cols-4 gap-8">
                    {reviews.map((review, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-2xl p-8 relative">
                            <div className="flex gap-1 mb-4 text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300 fill-gray-300'}`} />
                                ))}
                            </div>
                            <p className="text-gray-600 mb-6 italic">"{review.content}"</p>
                            <div className="flex items-center gap-4">
                                <img
                                    src={review.avatar}
                                    alt={review.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">{review.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
