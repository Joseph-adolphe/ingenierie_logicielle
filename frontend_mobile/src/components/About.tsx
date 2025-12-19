import { Separator } from "@/components/ui/separator";

const About = () => {
  return (
    <section id="about" className="py-20 px-6 bg-gray-100">
      <div className="container mx-auto grid md:grid-cols-2 gap-10 items-center">

        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978"
          alt="team"
          className="rounded-2xl shadow-lg"
        />

        <div>
          <h3 className="text-3xl font-bold mb-4">À propos de nous</h3>
          <Separator className="mb-4" />
          <p className="text-gray-600 leading-relaxed">
            ServiceLink connecte clients et prestataires de services locaux.
            Notre mission : rendre l’accès aux services plus simple, rapide et sécurisé.
          </p>
        </div>

      </div>
    </section>
  );
};

export default About;
