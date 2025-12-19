import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Pricing() {
    const plans = [
        {
            name: "Starter",
            price: "Gratuit",
            description: "Pour découvrir la plateforme",
            features: [
                "Recherche de prestataires illimitée",
                "Accès aux profils vérifiés",
                "Messagerie directe",
                "Support par email"
            ],
            cta: "Commencer gratuitement",
            popular: false
        },
        {
            name: "Pro",
            price: "2000 FCFA",
            period: "/mois",
            description: "Pour les professionnels actifs",
            features: [
                "Jusqu'à 20 devis par mois",
                "Badge 'Vérifié' sur le profil",
                "Remontée en tête de liste",
                "Support prioritaire 7j/7",
                "Statistiques de visites"
            ],
            cta: "Essayer Pro",
            popular: true
        },
        {
            name: "Business",
            price: "15000 FCFA",
            period: "/mois",
            description: "Pour les agences et équipes",
            features: [
                "Devis illimités",
                "Multi-comptes collaborateurs",
                "API d'intégration",
                "Account Manager dédié",
                "Publicité ciblée incluse"
            ],
            cta: "Contacter les ventes",
            popular: false
        }
    ];

    return (
        <section className="py-24 bg-gray-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                        Des tarifs simples et transparents
                    </h2>
                    <p className="text-xl text-gray-600">
                        Choisissez l'offre qui correspond le mieux à vos besoins, sans frais cachés.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`rounded-2xl p-8 transition-all duration-300 ${plan.popular
                                ? 'bg-white shadow-lg  scale-105 relative hover:shadow-[0_10px_25px_rgba(255,140,0,0.5)]'
                                : 'bg-white shadow-lg border border-gray-100 hover:shadow-[0_10px_25px_rgba(255,140,0,0.5)]'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-400 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg shadow-orange-500/30">
                                    Le plus populaire
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-orange-600' : 'text-gray-900'}`}>
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline mb-4">
                                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                                    {plan.period && <span className="text-gray-500 ml-1">{plan.period}</span>}
                                </div>
                                <p className="text-gray-500">{plan.description}</p>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start">
                                        <Check className={`w-5 h-5 mr-3 shrink-0 ${plan.popular ? 'text-primary' : 'text-green-500'}`} />
                                        <span className="text-gray-600 font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link to="/login">
                                <Button
                                    className={`w-full h-12 rounded-xl text-lg font-bold shadow-lg transition-all ${plan.popular
                                        ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/25'
                                        : 'bg-gray-900 hover:bg-gray-800 text-white shadow-gray-900/10'
                                        }`}
                                >
                                    {plan.cta}
                                </Button>
                            </Link>

                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
