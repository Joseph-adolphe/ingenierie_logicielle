import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer id="footer" className="py-16 px-6 bg-gray-900 text-white">

      <div className="container mx-auto grid md:grid-cols-2 gap-10">

        <div>
          <h3 className="text-2xl font-bold mb-4">Contactez-nous</h3>

          <form className="space-y-4">
            <Input placeholder="Nom" className="bg-gray-800 text-white" />
            <Input type="email" placeholder="Email" className="bg-gray-800 text-white" />
            <Textarea placeholder="Message" className="bg-gray-800 text-white h-32" />

            <Button className="w-full bg-indigo-600">Envoyer</Button>
          </form>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">ServiceLink</h3>
          <p className="text-gray-400">Votre plateforme d’accès aux services.</p>
          <p className="mt-4 text-gray-500 text-sm">© 2025 ServiceLink • Tous droits réservés</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
