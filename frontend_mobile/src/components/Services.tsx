import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Services = () => {
  return (
    <section id="services" className="py-20 px-6 bg-white">
      <h3 className="text-3xl font-bold text-center mb-12">Nos Services</h3>

      <div className="container mx-auto grid md:grid-cols-3 gap-10">

        <Card>
          <CardHeader>
            <CardTitle>Trouver un service</CardTitle>
          </CardHeader>
          <CardContent>
            Découvrez des prestataires qualifiés près de chez vous.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publier une offre</CardTitle>
          </CardHeader>
          <CardContent>
            Proposez vos services et recevez des clients.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Système de notes</CardTitle>
          </CardHeader>
          <CardContent>
            Notez les prestataires et consultez les avis.
          </CardContent>
        </Card>

      </div>
    </section>
  );
};

export default Services;
