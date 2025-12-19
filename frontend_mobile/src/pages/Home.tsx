import LandingNavbar from "@/components/landing/LandingNavbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import AppShowcase from "@/components/landing/AppShowcase";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import LandingFooter from "@/components/landing/LandingFooter";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-orange-100 selection:text-orange-900">
      <LandingNavbar />
      <main>
        <Hero />
        <Features />
        <AppShowcase />
        <Testimonials />
        <Pricing />

        {/* Call to Action for Professionals */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <svg width="400" height="400" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold  mb-6">
              Vous êtes un professionnel ?
            </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto">
              Rejoignez plus de 5000 prestataires qui développent leur activité grâce à Helpix.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <button className="px-8 py-4 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition shadow-lg cursor-pointer">
                  Devenir Prestataire
                </button>
              </Link>

              <Link to="/login">
                <button className="px-8 py-4 bg-transparent border-2 border-orange-600 text-orange-600 rounded-xl font-bold text-lg hover:bg-orange-600 hover:text-white transition cursor-pointer">
                  En savoir plus
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}