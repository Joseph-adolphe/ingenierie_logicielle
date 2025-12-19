import { Wrench, Zap, Home, Droplets, Paintbrush, Truck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Features() {
    const categories = [
        { name: 'Plomberie', icon: Droplets, color: 'text-cyan-500', bg: 'bg-cyan-50' },
        { name: 'Électricité', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
        { name: 'Ménage', icon: Home, color: 'text-pink-500', bg: 'bg-pink-50' },
        { name: 'Jardinage', icon: Wrench, color: 'text-green-500', bg: 'bg-green-50' },
        { name: 'Peinture', icon: Paintbrush, color: 'text-purple-500', bg: 'bg-purple-50' },
        { name: 'Déménagement', icon: Truck, color: 'text-orange-500', bg: 'bg-orange-50' },
    ];

    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Domaines Populaires</h2>
                        <p className="mt-2 text-gray-600">Explorez nos services les plus demandés</p>
                    </div>
                    <Link to="/login" className="hidden md:flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                        Voir tout <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {categories.map((cat, idx) => (
                        <div
                            key={idx}
                            className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:-translate-y-1 cursor-pointer"
                        >
                            <div className={`w-12 h-12 rounded-xl ${cat.bg} ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <cat.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                                {cat.name}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
