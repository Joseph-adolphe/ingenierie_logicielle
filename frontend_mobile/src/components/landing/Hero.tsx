import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import heroBg from "@/assets/hero.jpg";
import { Link } from "react-router-dom";

export default function Hero() {
    return (
        <div
            className="relative overflow-hidden pt-24 pb-24 md:pt-32 md:pb-32 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroBg})` }}
        >
            {/* Dark Overlay for text readability */}
            <div className="absolute inset-0 bg-black/60 z-0" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="animate-fade-in-up">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
                        Trouvez le bon expert <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-orange-200">
                            pour chaque besoin
                        </span>
                    </h1>
                    <p className="mt-4 text-xl text-gray-200 max-w-2xl mx-auto mb-10">
                        La plateforme de confiance qui connecte les particuliers aux meilleurs professionnels locaux.
                        Simple, rapide et sécurisé.
                    </p>

                    {/* Search Box */}
                    <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-white/20 flex flex-col md:flex-row gap-2">
                        <div className="flex-1 flex items-center bg-white/90 rounded-xl px-4 py-3 border border-white/10 focus-within:border-primary transition-colors">
                            <Search className="w-5 h-5 text-gray-500 mr-3" />
                            <input
                                type="text"
                                placeholder="Quel service recherchez-vous ?"
                                className="bg-transparent border-none outline-none w-full text-gray-900 placeholder-gray-500"
                            />
                        </div>
                        <div className="flex-1 flex items-center bg-white/90 rounded-xl px-4 py-3 border border-white/10 focus-within:border-primary transition-colors">
                            <MapPin className="w-5 h-5 text-gray-500 mr-3" />
                            <input
                                type="text"
                                placeholder="Code postal ou ville"
                                className="bg-transparent border-none outline-none w-full text-gray-900 placeholder-gray-500"
                            />
                        </div>
                        <Link to="/login">
                            <Button size="lg" className="h-full py-4 px-8 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow-lg shadow-orange-600/20">
                                Rechercher
                            </Button>
                        </Link>

                    </div>

                    <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-300 font-medium">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            +5000 Pros vérifiés
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            Devis gratuits
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-400" />
                            Support 7j/7
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
