import React, { useState } from 'react';
// import { FaUser, FaInfoCircle, FaClock, FaMoneyBill } from 'react-icons/fa';

interface PrestataireForm {
  user_id: string;
  categorie: string;
  autres_competences: string;
  description: string;
  disponibilite: string;
  tarif_horaire: string;
}

const CreatePrestataire: React.FC = () => {
  const [formData, setFormData] = useState<PrestataireForm>({
    user_id: '',
    categorie: '',
    autres_competences: '',
    description: '',
    disponibilite: '',
    tarif_horaire: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Données prestataire:', formData);
    // Ici tu feras ton appel API pour envoyer les données au backend
  };

  return (
    <div className="w-full max-w-3xl mx-auto min-h-screen bg-white p-6 rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Créer un Prestataire</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Catégorie */}
        <div className="flex flex-col text-black">
          <label htmlFor="categorie" className="mb-1 font-semibold text-blue-700">Catégorie</label>
          <input
            type="text"
            name="categorie"
            id="categorie"
            value={formData.categorie}
            onChange={handleChange}
            className="border border-blue-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Catégorie du prestataire"
            required
          />
        </div>

        {/* Autres compétences */}
        <div className="flex flex-col text-black">
          <label htmlFor="autres_competences" className="mb-1 font-semibold text-blue-700">Autres compétences</label>
          <input
            type="text"
            name="autres_competences"
            id="autres_competences"
            value={formData.autres_competences}
            onChange={handleChange}
            className="border border-blue-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Autres compétences (optionnel)"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col text-black">
          <label htmlFor="description" className="mb-1 font-semibold text-blue-700">Description</label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="border border-blue-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Description du prestataire"
          />
        </div>

        {/* Disponibilité */}
        <div className="flex flex-col text-black">
          <label htmlFor="disponibilite" className="mb-1 font-semibold text-blue-700">Disponibilité</label>
          <input
            type="text"
            name="disponibilite"
            id="disponibilite"
            value={formData.disponibilite}
            onChange={handleChange}
            className="border border-blue-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ex: Lundi-Vendredi 9h-18h"
          />
        </div>

        {/* Tarif horaire */}
        <div className="flex flex-col text-black">
          <label htmlFor="tarif_horaire" className="mb-1 font-semibold text-blue-700">Tarif horaire</label>
          <input
            type="number"
            name="tarif_horaire"
            id="tarif_horaire"
            value={formData.tarif_horaire}
            onChange={handleChange}
            className="border border-blue-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ex: 5000"
            min="0"
          />
        </div>

        {/* Bouton */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Créer Prestataire
        </button>
      </form>
    </div>
  );
};

export default CreatePrestataire;
