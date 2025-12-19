import { useState, useEffect } from 'react';
import { Briefcase, X, Loader2, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface Domaine {
    id: number;
    nom_domaine: string;
    description?: string;
}

interface DomaineSelection {
    id: string;
    niveau_expertise: string;
}

interface BecomeProviderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const niveauxExpertise = [
    { value: 'debutant', label: 'Débutant' },
    { value: 'intermediaire', label: 'Intermédiaire' },
    { value: 'avance', label: 'Avancé' },
    { value: 'expert', label: 'Expert' },
];

export default function BecomeProviderModal({ isOpen, onClose }: BecomeProviderModalProps) {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDomaines, setIsLoadingDomaines] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [domaines, setDomaines] = useState<Domaine[]>([]);
    const [selectedDomaines, setSelectedDomaines] = useState<DomaineSelection[]>([
        { id: '', niveau_expertise: '' }
    ]);

    const [formData, setFormData] = useState({
        description: '',
        disponibilite: '',
        tarif_horaire: '',
        order: '',
    });

    // Charger les domaines depuis la BD
    useEffect(() => {
        if (isOpen) {
            fetchDomaines();
        }
    }, [isOpen]);

    const fetchDomaines = async () => {
        setIsLoadingDomaines(true);
        try {
            const response = await api.get('/domain');
            // Gestion robuste de la réponse API pour éviter le crash .map
            let domainesData = [];
            if (Array.isArray(response.data)) {
                domainesData = response.data;
            } else if (response.data.domaines && Array.isArray(response.data.domaines)) {
                domainesData = response.data.domaines;
            } else if (response.data.data && Array.isArray(response.data.data)) {
                domainesData = response.data.data;
            }
            setDomaines(domainesData);
        } catch (err: any) {
            console.error('Erreur lors du chargement des domaines:', err);
            setError('Impossible de charger les domaines');
        } finally {
            setIsLoadingDomaines(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddDomaine = () => {
        setSelectedDomaines(prev => [...prev, { id: '', niveau_expertise: '' }]);
    };

    const handleRemoveDomaine = (index: number) => {
        setSelectedDomaines(prev => prev.filter((_, i) => i !== index));
    };

    const handleDomaineChange = (index: number, field: 'id' | 'niveau_expertise', value: string) => {
        setSelectedDomaines(prev => {
            const updated = [...prev];
            updated[index][field] = value;
            return updated;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.id) {
            setError('Utilisateur non connecté');
            return;
        }

        // Validation
        if (!formData.description.trim()) {
            setError('La description est obligatoire');
            return;
        }

        // Filtrer les domaines valides (id et niveau_expertise remplis)
        const domainesValides = selectedDomaines
            .filter(d => d.id && d.niveau_expertise)
            .map(d => ({
                id: parseInt(d.id),
                niveau_expertise: d.niveau_expertise
            }));

        setError('');
        setSuccess(false);
        setIsLoading(true);

        try {
            const payload = {
                description: formData.description,
                disponibilite: formData.disponibilite || null,
                tarif_horaire: formData.tarif_horaire ? parseFloat(formData.tarif_horaire) : null,
                order: formData.order || null,
                domaines: domainesValides.length > 0 ? domainesValides : null,
            };

            const response = await api.post(`/prestataire/create/${user.id}`, payload);

            if (response.data.status) {
                setSuccess(true);

                // Récupérer le profil mis à jour (le rôle a changé sur le serveur)
                try {
                    const profileRes = await api.get('/profile');
                    if (profileRes.data.status && profileRes.data.user) {
                        updateUser(profileRes.data.user);
                    } else if (profileRes.data.id) {
                        updateUser(profileRes.data);
                    }
                } catch (profileErr) {
                    console.error('Erreur rafraîchissement profil:', profileErr);
                }

                // Fermer le modal et rediriger après 1.5 secondes
                setTimeout(() => {
                    onClose();
                    // Réinitialiser le formulaire
                    setFormData({
                        description: '',
                        disponibilite: '',
                        tarif_horaire: '',
                        order: '',
                    });
                    setSelectedDomaines([{ id: '', niveau_expertise: '' }]);
                    setSuccess(false);

                    // Redirection vers l'espace prestataire
                    navigate('/provider');
                }, 1500);
            } else {
                setError(response.data.message || 'Une erreur est survenue');
            }
        } catch (err: any) {
            console.error('Erreur lors de la création du compte prestataire:', err);
            setError(err.response?.data?.message || 'Échec de la création du compte prestataire');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl z-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        <X className="w-5 h-5" />
                    </Button>
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                            <Briefcase className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Devenir Prestataire</h2>
                            <p className="text-gray-600">Rejoignez notre réseau et proposez vos services.</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Messages d'erreur et succès */}
                    {error && (
                        <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-lg text-sm animate-in fade-in">
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-300 text-green-700 p-3 rounded-lg text-sm animate-in fade-in">
                            <span className="font-medium">✓ Compte prestataire créé avec succès !</span>
                        </div>
                    )}

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Description / Bio <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Décrivez vos compétences, votre expérience et les services que vous proposez..."
                            className="h-24 bg-gray-50 border-gray-300 focus-visible:ring-2 focus-visible:ring-orange-500"
                            required
                        />
                    </div>

                    {/* Disponibilité et Tarif */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Disponibilité</label>
                            <Input
                                name="disponibilite"
                                value={formData.disponibilite}
                                onChange={handleInputChange}
                                placeholder="Ex: Lundi - Vendredi, 8h-17h"
                                className="bg-gray-50 border-gray-300 focus-visible:ring-2 focus-visible:ring-orange-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Tarif Horaire (FCFA)</label>
                            <Input
                                name="tarif_horaire"
                                value={formData.tarif_horaire}
                                onChange={handleInputChange}
                                placeholder="Ex: 5000"
                                type="number"
                                min="0"
                                step="0.01"
                                className="bg-gray-50 border-gray-300 focus-visible:ring-2 focus-visible:ring-orange-500"
                            />
                        </div>
                    </div>

                    {/* Ordre / Priorité */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Ordre d'affichage</label>
                        <Input
                            name="order"
                            value={formData.order}
                            onChange={handleInputChange}
                            placeholder="Optionnel: priorité d'affichage"
                            className="bg-gray-50 border-gray-300 focus-visible:ring-2 focus-visible:ring-orange-500"
                        />
                    </div>

                    {/* Domaines d'expertise */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">Domaines d'expertise</label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddDomaine}
                                className="text-orange-600 border-orange-600 hover:bg-orange-50"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Ajouter
                            </Button>
                        </div>

                        {isLoadingDomaines ? (
                            <div className="flex items-center justify-center p-8">
                                <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {selectedDomaines.map((domaine, index) => (
                                    <div key={index} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {/* Sélection du domaine */}
                                            <Select
                                                value={domaine.id}
                                                onChange={(e) => handleDomaineChange(index, 'id', e.target.value)}
                                                className="bg-white border-gray-300 text-sm"
                                            >
                                                <option value="">Sélectionnez un domaine</option>
                                                {domaines.map((d) => (
                                                    <option key={d.id} value={d.id}>
                                                        {d.nom_domaine}
                                                    </option>
                                                ))}
                                            </Select>

                                            {/* Niveau d'expertise */}
                                            <Select
                                                value={domaine.niveau_expertise}
                                                onChange={(e) => handleDomaineChange(index, 'niveau_expertise', e.target.value)}
                                                className="bg-white border-gray-300 text-sm"
                                                disabled={!domaine.id}
                                            >
                                                <option value="">Niveau d'expertise</option>
                                                {niveauxExpertise.map((niveau) => (
                                                    <option key={niveau.value} value={niveau.value}>
                                                        {niveau.label}
                                                    </option>
                                                ))}
                                            </Select>
                                        </div>

                                        {/* Bouton supprimer */}
                                        {selectedDomaines.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveDomaine(index)}
                                                className="text-red-600 hover:bg-red-50 shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bouton de soumission */}
                    <div className="pt-4 border-t border-gray-100">
                        <Button
                            type="submit"
                            disabled={isLoading || isLoadingDomaines}
                            className="w-full bg-orange-600 hover:bg-orange-700 py-6 text-lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Création en cours...
                                </>
                            ) : (
                                'Envoyer ma candidature'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
