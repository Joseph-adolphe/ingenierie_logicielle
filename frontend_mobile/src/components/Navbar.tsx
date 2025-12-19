import { useState } from "react";
import { Menu, X } from "lucide-react";
import logosite from "@/assets/logosite.png";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full  bg-white backdrop-blur-md fixed top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={logosite} alt="ServiceLocal Logo" className="w-16 h-16 object-contain" />
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Service<span className="text-neutral-500">Local</span>
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          <a href="#hero" className="text-neutral-700 hover:text-neutral-900 transition">Accueil</a>
          <a href="#services" className="text-neutral-700 hover:text-neutral-900 transition">Services</a>
          <a href="#about" className="text-neutral-700 hover:text-neutral-900 transition">About</a>
          <a href="#pricing" className="text-neutral-700 hover:text-neutral-900 transition">Abonnement</a>

          <Button className="rounded-full bg-neutral-900 text-white hover:bg-neutral-800">
            Se connecter
          </Button>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-neutral-900"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-neutral-50 border-t px-6 py-4 space-y-4">
          <a href="#hero" className="block text-neutral-700">Accueil</a>
          <a href="#services" className="block text-neutral-700">Services</a>
          <a href="#about" className="block text-neutral-700">About</a>
          <a href="#pricing" className="block text-neutral-700">Abonnement</a>

          <Button className="w-full rounded-full bg-neutral-900 text-white hover:bg-neutral-800">
            Se connecter
          </Button>
        </div>
      )}
    </header>
  );
}
