import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logosite from "@/assets/logosite.png";
import { Button } from "@/components/ui/button";

export default function LandingNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white  py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Link to="/" className="flex items-center space-x-2">
                            <img src={logosite} alt="ServiceLocal Logo" className="w-10 h-10 object-contain" />
                            <span className={`text-2xl font-bold transition-colors ${isScrolled ? 'text-orange-600' : 'text-gray-900'}`}>
                                helpix
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">Services</a>
                        <a href="#" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">Comment ça marche</a>
                        <a href="#" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">Avis</a>
                        <div className="flex items-center space-x-4 ml-4">
                            <Link to="/login">
                                <Button variant="ghost" className=" border border-orange-600 text-orange-600  hover:bg-orange-600 hover:text-white">
                                    Se connecter
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-lg shadow-orange-500/30">
                                    S'inscrire
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden text-gray-700"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-4 px-4 flex flex-col space-y-4">
                    <a href="#" className="block text-gray-700 font-medium p-2 hover:bg-gray-50 rounded-lg">Services</a>
                    <a href="#" className="block text-gray-700 font-medium p-2 hover:bg-gray-50 rounded-lg">Comment ça marche</a>
                    <a href="#" className="block text-gray-700 font-medium p-2 hover:bg-gray-50 rounded-lg">Avis</a>
                    <div className="pt-2 flex flex-col space-y-2">
                        <Link to="/login">
                            <Button variant="outline" className="w-full justify-center">Se connecter</Button>
                        </Link>
                        <Link to="/register">
                            <Button className="w-full justify-center bg-orange-600">S'inscrire</Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
