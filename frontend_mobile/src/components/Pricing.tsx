import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 px-6 bg-white">
      <h3 className="text-3xl font-bold text-center mb-12">Abonnement</h3>

      <div className="container mx-auto grid md:grid-cols-3 gap-10">

        <Card>
          <CardHeader>
            <CardTitle>Basic</CardTitle>
          </CardHeader>
          <CardContent>
            <p>5 000 FCFA / mois</p>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li>✔ 10 demandes</li>
              <li>✔ Profil prestataire</li>
            </ul>
            <Button className="mt-4 w-full">Choisir</Button>
          </CardContent>
        </Card>

        <Card className="border-indigo-600 border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-indigo-600">Pro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-indigo-600 font-bold">10 000 FCFA / mois</p>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li>✔ Illimité</li>
              <li>✔ Stats avancées</li>
            </ul>
            <Button className="mt-4 w-full bg-indigo-600 text-white">Choisir</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Entreprise</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Sur mesure</p>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li>✔ Support dédié</li>
              <li>✔ Solutions personnalisées</li>
            </ul>
            <Button className="mt-4 w-full">Contact</Button>
          </CardContent>
        </Card>

      </div>
    </section>
  );
};

export default Pricing;
