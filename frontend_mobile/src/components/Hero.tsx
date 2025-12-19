import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section id="hero" className="pt-32 pb-20 bg-blue-200 px-6 rounded-b-3xl">
      <div className="container mx-auto grid md:grid-cols-2 gap-10 items-center">

        <div className="pl-4">
          <h3 className="text-2xl md:text-4xl font-bold leading-tight">
            Bienvenue sur Helpix, votre passerelle vers des solutions rapides, fiables et accessibles en un clic.
          </h3>

          <p className="mt-4 text-gray-600 text-sm">
            Des services proches de vous : coiffure, plomberie, nettoyage, électricité…
          </p>
          <p className="mt-4 text-gray-600 text-sm">
            Des services proches de vous : coiffure, plomberie, nettoyage, électricité…
          </p>

          <Button className="rounded-full bg-neutral-900 text-white hover:bg-neutral-800 mt-6">
            Découvrir l'application
          </Button>
        </div>

        <img
          src="https://images.unsplash.com/photo-1581090700227-1e37b190418e"
          alt="app preview"
          className="rounded-2xl shadow-lg"
        />
      </div>
    </section>
  );
};

export default Hero;
