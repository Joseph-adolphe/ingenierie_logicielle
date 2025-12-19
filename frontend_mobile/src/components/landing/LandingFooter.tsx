import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import logosite from "@/assets/logosite.png";

export default function LandingFooter() {
    return (
        <footer className="bg-gray-900 text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <img src={logosite} alt="Helpix Logo" className="w-10 h-10 object-contain" />
                            <span className="text-2xl text-orange-600 font-bold">Helpix</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            La plateforme de référence pour tous vos besoins de services à domicile. Qualité, confiance et rapidité garanties.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-600 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-400 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-700 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Services</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Plomberie</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Électricité</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Ménage</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Jardinage</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Entreprise</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#" className="hover:text-orange-500 transition-colors">À propos</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Carrières</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Légal</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Conditions Générales</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Politique de confidentialité</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Cookies</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Mentions légales</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Helpix. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
}
