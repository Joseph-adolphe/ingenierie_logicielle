import React, { useState, useEffect } from 'react';
import { ChevronRight, User, Loader2, Camera, Lock, Briefcase, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema, updatePasswordSchema, providerBioSchema, type UpdateProfileFormData, type UpdatePasswordFormData, type ProviderBioFormData } from '@/lib/validators';
import { countries } from '@/lib/countries';
import { getCitiesByCountryCode } from '@/lib/cities';
import api from '@/lib/api';
import { Textarea } from '@/components/ui/textarea';

interface Domaine {
    id: number;
    nom_domaine: string;
    description?: string;
}

interface DomaineSelection {
    id: string;
    niveau_expertise: string;
    isExisting?: boolean; // Pour différencier les domaines existants des nouveaux
    prestataire_domaine_id?: number; // ID de la relation prestataire_domaine pour suppression
}

const niveauxExpertise = [
    { value: 'debutant', label: 'Débutant' },
    { value: 'intermediaire', label: 'Intermédiaire' },
    { value: 'avance', label: 'Avancé' },
    { value: 'expert', label: 'Expert' },
];

export default function ProviderProfileEdit() {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [isLoadingPassword, setIsLoadingPassword] = useState(false);
    const [isLoadingDomaines, setIsLoadingDomaines] = useState(true);
    const [isLoadingUserDomaines, setIsLoadingUserDomaines] = useState(true);
    const [isLoadingBio, setIsLoadingBio] = useState(false);
    const [isSavingDomaines, setIsSavingDomaines] = useState(false);
    const [errorProfile, setErrorProfile] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [errorBio, setErrorBio] = useState("");
    const [errorDomaines, setErrorDomaines] = useState("");
    const [successProfile, setSuccessProfile] = useState(false);
    const [successPassword, setSuccessPassword] = useState(false);
    const [successBio, setSuccessBio] = useState(false);
    const [successDomaines, setSuccessDomaines] = useState(false);
    const [providerId, setProviderId] = useState<number | null>(null);

    // Image Upload State
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
    const [errorAvatar, setErrorAvatar] = useState("");
    const [successAvatar, setSuccessAvatar] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Gestion des domaines
    const [domaines, setDomaines] = useState<Domaine[]>([]);
    const [selectedDomaines, setSelectedDomaines] = useState<DomaineSelection[]>([]);

    // Form pour le profil
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: errorsProfile },
        watch: watchProfile,
        setValue: setValueProfile,
    } = useForm<UpdateProfileFormData>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: user?.name || '',
            surname: user?.surname || '',
            email: user?.email || '',
            phone: user?.phone || '',
            city: user?.city || '',
            country: user?.country || '',
            birthday: user?.birthday || '',
        },
    });

    // Form pour la bio
    const {
        register: registerBio,
        handleSubmit: handleSubmitBio,
        formState: { errors: errorsBio },
        reset: resetBio,
    } = useForm<ProviderBioFormData>({
        resolver: zodResolver(providerBioSchema),
        defaultValues: {
            description: '',
            disponibilite: '',
            tarif_horaire: '',
            experience_years: ''
        }
    });

    // Surveiller le pays sélectionné pour afficher l'indicatif
    const selectedCountryName = watchProfile("country");
    const selectedCountry = countries.find(c => c.name === selectedCountryName);

    // Obtenir les villes disponibles pour le pays sélectionné
    const availableCities = selectedCountry ? getCitiesByCountryCode(selectedCountry.code) : [];

    // Charger les domaines disponibles, les domaines du prestataire et les détails du prestataire
    useEffect(() => {
        fetchDomaines();
        if (user?.id) {
            fetchUserDomaines();
            fetchProviderDetails();
        }
    }, [user?.id]);

    const fetchDomaines = async () => {
        setIsLoadingDomaines(true);
        try {
            const response = await api.get('/domain');
            // Gestion robuste de la réponse API
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
            setErrorDomaines('Impossible de charger les domaines');
        } finally {
            setIsLoadingDomaines(false);
        }
    };

    const fetchUserDomaines = async () => {
        setIsLoadingUserDomaines(true);
        try {
            if (!user?.id) return;
            // Charger les domaines du prestataire depuis l'API
            const response = await api.get(`/prestataire/${user.id}/domaines`);
            const userDomaines = response.data.domaines || [];

            // Convertir les domaines existants au format DomaineSelection
            // Le backend retourne la relation belongsToMany qui inclut les champs pivot
            const formattedDomaines = userDomaines.map((d: any) => ({
                id: d.id?.toString(), // L'ID du domaine directement
                niveau_expertise: d.pivot?.niveau_expertise || '', // Niveau d'expertise dans la table pivot
                isExisting: true,
                prestataire_domaine_id: d.id // Pas strictement nécessaire avec la logique de sync, mais on garde pour cohérence
            }));

            setSelectedDomaines(formattedDomaines.length > 0 ? formattedDomaines : [{ id: '', niveau_expertise: '' }]);
        } catch (err: any) {
            console.error('Erreur lors du chargement des domaines du prestataire:', err);
            setSelectedDomaines([{ id: '', niveau_expertise: '' }]);
        } finally {
            setIsLoadingUserDomaines(false);
        }
    };

    const fetchProviderDetails = async () => {
        if (!user?.id) return;
        setIsLoadingBio(true);
        try {
            // Utiliser le nouvel endpoint pour chercher par user_id
            const response = await api.get(`/prestataires/user/${user.id}`);
            const providerData = response.data.prestataire || response.data;

            if (providerData) {
                setProviderId(providerData.id);
                resetBio({
                    description: providerData.description || providerData.bio || '',
                    experience_years: providerData.experience_years?.toString() || '',
                    tarif_horaire: providerData.tarif_horaire?.toString() || '',
                    disponibilite: providerData.disponibilite || '',
                });
            }
        } catch (err: any) {
            console.error('Erreur lors du chargement des détails du prestataire:', err);
            // On ne met pas d'erreur fatale ici, car l'utilisateur peut ne pas encore avoir de profil prestataire complet
        } finally {
            setIsLoadingBio(false);
        }
    };

    // Handle Image Selection
    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setErrorAvatar(""); // Reset error when new image selected
        }
    };

    const handleUpdateAvatar = async () => {
        if (!imageFile || !user?.id) return;

        setIsUpdatingAvatar(true);
        setErrorAvatar("");
        setSuccessAvatar(false);

        try {
            const formData = new FormData();
            formData.append('profile_picture', imageFile);
            // Laravel handles PUT with files via _method field in a POST request or special configuration
            // However, many APIs prefer POST for file uploads even for updates, or using multipart/form-data
            // Since UserController.php:updateProfile accepts profile_picture, we use that.

            const response = await api.post(`/profile/${user.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                params: {
                    _method: 'PUT' // Common Laravel pattern for PUT with files
                }
            });

            updateUser(response.data.user);
            setSuccessAvatar(true);
            setImageFile(null);
            setTimeout(() => setSuccessAvatar(false), 3000);
        } catch (err: any) {
            console.error("Error uploading avatar:", err);
            setErrorAvatar(err.response?.data?.message || "Échec de l'upload de la photo");
        } finally {
            setIsUpdatingAvatar(false);
        }
    };

    // Added onSubmitBio handler
    const onSubmitBio = async (data: ProviderBioFormData) => {
        setErrorBio('');
        setSuccessBio(false);
        setIsLoadingBio(true);
        if (!providerId) {
            // Ensure providerId is fetched
            await fetchProviderDetails();
        }
        try {
            await api.put(`/prestataire/${providerId}`, data);
            setSuccessBio(true);
            setTimeout(() => setSuccessBio(false), 3000);
        } catch (err: any) {
            console.error('Erreur lors de la mise à jour de la bio:', err);
            setErrorBio(err.response?.data?.message || 'Échec de la mise à jour de la bio');
        } finally {
            setIsLoadingBio(false);
        }
    };

    // Added onSubmitDomaines handler
    const onSubmitDomaines = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setErrorDomaines('');
        setSuccessDomaines(false);
        setIsSavingDomaines(true);
        if (!providerId) {
            await fetchProviderDetails();
        }

        // Filter out empty domains
        const validDomaines = selectedDomaines.filter(d => d.id && d.niveau_expertise);

        const payload = validDomaines.map(d => ({
            id: d.id, // Changed from domaine_id to id to match controller validation
            niveau_expertise: d.niveau_expertise,
        }));

        try {
            await api.put(`/prestataire/${providerId}/domaines`, { domaines: payload });
            setSuccessDomaines(true);
            setTimeout(() => setSuccessDomaines(false), 3000);

            // Refresh domains to ensure sync
            fetchUserDomaines();
        } catch (err: any) {
            console.error('Erreur lors de la sauvegarde des domaines:', err);
            setErrorDomaines(err.response?.data?.message || 'Échec de la sauvegarde des domaines');
        } finally {
            setIsSavingDomaines(false);
        }
    };

    const handleAddDomaine = () => {
        setSelectedDomaines(prev => [...prev, { id: '', niveau_expertise: '' }]);
    };

    const handleRemoveDomaine = (index: number) => {
        // Just remove from local state. The 'sync' in save will handle DB deletion.
        setSelectedDomaines(prev => prev.filter((_, i) => i !== index));
    };

    const handleDomaineChange = (index: number, field: 'id' | 'niveau_expertise', value: string) => {
        setSelectedDomaines(prev => {
            const updated = [...prev];
            updated[index][field] = value;
            return updated;
        });
    };

    // Gérer le changement de numéro de téléphone avec préfixe automatique
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;

        if (!selectedCountry) {
            setValueProfile("phone", input);
            return;
        }

        const dialCode = selectedCountry.dialCode;

        // Extraire uniquement les chiffres
        const digitsOnly = input.replace(/\D/g, '');

        // Si l'utilisateur efface tout, on garde juste l'indicatif
        if (digitsOnly.length === 0) {
            setValueProfile("phone", dialCode + " ");
            return;
        }

        // Enlever les chiffres de l'indicatif si présents
        const dialCodeDigits = dialCode.replace(/\D/g, '');
        let phoneDigits = digitsOnly;

        if (digitsOnly.startsWith(dialCodeDigits)) {
            phoneDigits = digitsOnly.slice(dialCodeDigits.length);
        }

        // Limiter au nombre de chiffres autorisés
        phoneDigits = phoneDigits.slice(0, selectedCountry.phoneLength);

        // Formater le numéro selon le pays
        let formattedPhone = phoneDigits;
        if (selectedCountry.code === "CM" && phoneDigits.length > 0) {
            formattedPhone = phoneDigits.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4').trim();
        } else if (selectedCountry.code === "FR" && phoneDigits.length > 0) {
            formattedPhone = phoneDigits.replace(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5').trim();
        } else if ((selectedCountry.code === "US" || selectedCountry.code === "CA") && phoneDigits.length > 0) {
            if (phoneDigits.length <= 3) {
                formattedPhone = phoneDigits;
            } else if (phoneDigits.length <= 6) {
                formattedPhone = `(${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3)}`;
            } else {
                formattedPhone = `(${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6, 10)}`;
            }
        }

        setValueProfile("phone", `${dialCode} ${formattedPhone}`.trim());
    };

    // Mettre à jour le téléphone quand le pays change
    React.useEffect(() => {
        if (selectedCountry) {
            const currentPhone = watchProfile("phone");
            if (currentPhone && !currentPhone.startsWith(selectedCountry.dialCode)) {
                const digitsOnly = currentPhone.replace(/\D/g, '');
                if (digitsOnly.length > 0) {
                    setValueProfile("phone", `${selectedCountry.dialCode} ${digitsOnly.slice(0, selectedCountry.phoneLength)}`);
                } else {
                    setValueProfile("phone", selectedCountry.dialCode + " ");
                }
            }
        }
    }, [selectedCountry, watchProfile, setValueProfile]);

    // Form pour le mot de passe
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: errorsPassword },
        reset: resetPassword,
    } = useForm<UpdatePasswordFormData>({
        resolver: zodResolver(updatePasswordSchema),
    });

    const onSubmitProfile = async (data: UpdateProfileFormData) => {
        setErrorProfile("");
        setSuccessProfile(false);
        setIsLoadingProfile(true);

        try {
            if (!user?.id) {
                throw new Error("User ID not found");
            }
            const response = await api.put(`/profile/${user.id}`, data);
            updateUser(response.data.user);
            setSuccessProfile(true);
            setTimeout(() => {
                setSuccessProfile(false);
            }, 3000);
        } catch (err: any) {
            console.error("Update profile error:", err);
            setErrorProfile(err.response?.data?.message || "Échec de la mise à jour. Veuillez réessayer.");
        } finally {
            setIsLoadingProfile(false);
        }
    };

    const onSubmitPassword = async (data: UpdatePasswordFormData) => {
        setErrorPassword("");
        setSuccessPassword(false);
        setIsLoadingPassword(true);

        try {
            await api.put(`/change-password`, {
                old_password: data.currentPassword,
                new_password: data.newPassword,
                new_password_confirmation: data.confirmPassword,
            });
            setSuccessPassword(true);
            resetPassword();
            setTimeout(() => {
                setSuccessPassword(false);
            }, 3000);
        } catch (err: any) {
            console.error("Update password error:", err);
            setErrorPassword(err.response?.data?.message || "Échec de la mise à jour du mot de passe. Veuillez réessayer.");
        } finally {
            setIsLoadingPassword(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto p-4 animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={() => navigate('/provider/profile')}
                    className="mb-6 text-orange-600 hover:text-orange-700 flex items-center transition font-medium"
                >
                    <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Retour au profil
                </button>

                {/* Header avec Avatar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="bg-linear-to-r from-orange-600 to-orange-500 h-32"></div>
                    <div className="px-8 pb-6">
                        <div className="relative -mt-16 mb-4">
                            <div className="w-32 h-32 bg-linear-to-br from-orange-600 to-orange-400 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg relative group overflow-hidden">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : user?.profile_picture ? (
                                    <img
                                        src={`${import.meta.env.VITE_API_URL?.replace('/api', '/storage') || 'http://localhost:8000/storage'}/${user.profile_picture.replace(/\\/g, '/')}`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span>{user?.name?.charAt(0)}{user?.surname?.charAt(0)}</span>
                                )}

                                <button
                                    type="button"
                                    onClick={handleImageClick}
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    <Camera className="w-8 h-8 text-white" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">Modifier mon profil</h1>
                                <p className="text-gray-500 mb-4">Mettez à jour vos informations personnelles et votre photo</p>

                                {imageFile && (
                                    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2">
                                        <Button
                                            onClick={handleUpdateAvatar}
                                            disabled={isUpdatingAvatar}
                                            className="bg-orange-600 hover:bg-orange-700 text-white h-9 px-4"
                                        >
                                            {isUpdatingAvatar ? (
                                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            ) : (
                                                <Camera className="w-4 h-4 mr-2" />
                                            )}
                                            Sauvegarder la photo
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                setImageFile(null);
                                                setImagePreview(null);
                                            }}
                                            disabled={isUpdatingAvatar}
                                            className="text-gray-500 hover:text-red-600 h-9"
                                        >
                                            Annuler
                                        </Button>
                                    </div>
                                )}

                                {successAvatar && (
                                    <p className="text-green-600 text-sm font-medium mt-2 animate-in fade-in">
                                        ✓ Photo de profil mise à jour !
                                    </p>
                                )}
                                {errorAvatar && (
                                    <p className="text-red-500 text-sm font-medium mt-2 animate-in fade-in">
                                        {errorAvatar}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* CARD: Informations Personnelles */}
                    <Card className="bg-white border-0 shadow-md">
                        <CardHeader className="border-b border-gray-100">
                            <CardTitle className="flex items-center text-xl text-gray-900">
                                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mr-3">
                                    <User className="w-5 h-5 text-orange-600" />
                                </div>
                                Informations personnelles
                            </CardTitle>
                            <CardDescription className="text-gray-600 ml-13">
                                Modifiez vos informations de profil
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {errorProfile && (
                                <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-lg text-sm mb-4 transition-all duration-300 animate-in fade-in">
                                    <span className="font-medium">{errorProfile}</span>
                                </div>
                            )}

                            {successProfile && (
                                <div className="bg-green-50 border border-green-300 text-green-700 p-3 rounded-lg text-sm mb-4 transition-all duration-300 animate-in fade-in">
                                    <span className="font-medium">✓ Profil mis à jour avec succès !</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Prénom */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Prénom <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            {...registerProfile("surname")}
                                            placeholder="Jean"
                                            className={`bg-gray-50 border-gray-300 h-10 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-0 transition duration-150 ${errorsProfile.surname ? 'border-red-500 ring-red-500' : ''}`}
                                        />
                                        {errorsProfile.surname && <p className="text-red-600 text-xs mt-1">{errorsProfile.surname.message}</p>}
                                    </div>

                                    {/* Nom */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Nom <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            {...registerProfile("name")}
                                            placeholder="Dupont"
                                            className={`bg-gray-50 border-gray-300 h-10 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-0 transition duration-150 ${errorsProfile.name ? 'border-red-500 ring-red-500' : ''}`}
                                        />
                                        {errorsProfile.name && <p className="text-red-600 text-xs mt-1">{errorsProfile.name.message}</p>}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            type="email"
                                            {...registerProfile("email")}
                                            placeholder="nom@exemple.com"
                                            className={`bg-gray-50 border-gray-300 h-10 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-0 transition duration-150 ${errorsProfile.email ? 'border-red-500 ring-red-500' : ''}`}
                                        />
                                        {errorsProfile.email && <p className="text-red-600 text-xs mt-1">{errorsProfile.email.message}</p>}
                                    </div>

                                    {/* Pays */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Pays</label>
                                        <Select
                                            {...registerProfile("country")}
                                            className="bg-gray-50 border-gray-300 h-10 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-0 transition duration-150"
                                        >
                                            <option value="">Sélectionnez un pays</option>
                                            {countries.map((country) => (
                                                <option key={country.code} value={country.name}>
                                                    {country.flag} {country.name} ({country.dialCode})
                                                </option>
                                            ))}
                                        </Select>
                                    </div>

                                    {/* Ville */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Ville</label>
                                        <Select
                                            {...registerProfile("city")}
                                            disabled={!selectedCountry || availableCities.length === 0}
                                            className="bg-gray-50 border-gray-300 h-10 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-0 transition duration-150"
                                        >
                                            <option value="">
                                                {!selectedCountry ? "Sélectionnez d'abord un pays" : availableCities.length === 0 ? "Aucune ville disponible" : "Sélectionnez une ville"}
                                            </option>
                                            {availableCities.map((city) => (
                                                <option key={city.name} value={city.name}>
                                                    {city.name}
                                                </option>
                                            ))}
                                        </Select>
                                    </div>

                                    {/* Téléphone */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Téléphone <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Input
                                                type="tel"
                                                {...registerProfile("phone", {
                                                    onChange: handlePhoneChange
                                                })}
                                                value={watchProfile("phone")}
                                                placeholder={selectedCountry ? `${selectedCountry.dialCode} ${'X'.repeat(selectedCountry.phoneLength)}` : "+237 XXXXXXXXX"}
                                                className={`bg-gray-50 border-gray-300 h-10 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-0 transition duration-150 ${errorsProfile.phone ? 'border-red-500 ring-red-500' : ''}`}
                                            />
                                        </div>
                                        {selectedCountry && (
                                            <p className="text-xs text-gray-500">
                                                Format: {selectedCountry.flag} {selectedCountry.dialCode} XXX XX XX XX • Max: {selectedCountry.phoneLength} chiffres
                                            </p>
                                        )}
                                        {errorsProfile.phone && <p className="text-red-600 text-xs mt-1">{errorsProfile.phone.message}</p>}
                                    </div>

                                    {/* Date de naissance */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Date de naissance</label>
                                        <Input
                                            type="date"
                                            {...registerProfile("birthday")}
                                            className="bg-gray-50 border-gray-300 h-10 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-0 transition duration-150"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Quartier <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            {...registerProfile("name")}
                                            placeholder="Entrer le nom de votre quartier"
                                            className={`bg-gray-50 border-gray-300 h-10 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-0 transition duration-150 ${errorsProfile.name ? 'border-red-500 ring-red-500' : ''}`}
                                        />
                                        {errorsProfile.name && <p className="text-red-600 text-xs mt-1">{errorsProfile.name.message}</p>}
                                    </div>
                                </div>

                                <CardFooter className="px-0 pt-4 justify-end gap-3">
                                    <Button
                                        type="button"
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                        onClick={() => navigate('/provider/profile')}
                                        disabled={isLoadingProfile}
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isLoadingProfile}
                                        className="bg-orange-600 hover:bg-orange-700 text-white"
                                    >
                                        {isLoadingProfile ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Enregistrement...
                                            </>
                                        ) : (
                                            'Enregistrer les modifications'
                                        )}
                                    </Button>
                                </CardFooter>
                            </form>
                        </CardContent>
                    </Card>

                    {/* CARD: Description */}
                    <Card className="bg-white border-0 shadow-md">
                        <CardHeader className="border-b border-gray-100">
                            <CardTitle className="flex items-center text-xl text-gray-900">
                                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mr-3">
                                    <Briefcase className="w-5 h-5 text-orange-600" />
                                </div>
                                Biography
                            </CardTitle>
                            <CardDescription className="text-gray-600 ml-13">
                                Modifier votre biiography et parlé plus de vous
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {errorBio && (
                                <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-lg text-sm mb-4 transition-all duration-300 animate-in fade-in">
                                    <span className="font-medium">{errorBio}</span>
                                </div>
                            )}
                            {successBio && (
                                <div className="bg-green-50 border border-green-300 text-green-700 p-3 rounded-lg text-sm mb-4 transition-all duration-300 animate-in fade-in">
                                    <span className="font-medium">✓ Bio mise à jour avec succès !</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmitBio(onSubmitBio)} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Biography</label>
                                    <Textarea
                                        {...registerBio('description')}
                                        placeholder="Décrivez vos compétences, votre expérience et les services que vous proposez..."
                                        className="h-24 bg-gray-50 border-gray-300 focus-visible:ring-2 focus-visible:ring-orange-500"
                                        required
                                    />
                                    {errorsBio.description && <p className="text-red-600 text-xs mt-1">{errorsBio.description.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Disponibilité</label>
                                        <Input
                                            {...registerBio('disponibilite')}
                                            placeholder="Ex: Lundi - Vendredi, 8h-17h"
                                            className="bg-gray-50 border-gray-300 focus-visible:ring-2 focus-visible:ring-orange-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Tarif Horaire (FCFA)</label>
                                        <Input
                                            {...registerBio('tarif_horaire')}
                                            placeholder="Ex: 5000"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="bg-gray-50 border-gray-300 focus-visible:ring-2 focus-visible:ring-orange-500"
                                        />
                                    </div>
                                </div>

                                <div className='flex justify-end'>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="text-white bg-red-600 hover:bg-red-500 mr-4"
                                        onClick={() => resetBio()}
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="outline"
                                        size="sm"
                                        className="text-white bg-orange-600 hover:bg-orange-500"
                                        disabled={isLoadingBio}
                                    >
                                        {isLoadingBio ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Enregistrement...
                                            </>
                                        ) : (
                                            'Sauvegarder'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* CARD: Domaines d'expertise */}
                    <Card className="bg-white border-0 shadow-md">
                        <CardHeader className="border-b border-gray-100">
                            <CardTitle className="flex items-center text-xl text-gray-900">
                                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mr-3">
                                    <Briefcase className="w-5 h-5 text-orange-600" />
                                </div>
                                Domaines d'expertise
                            </CardTitle>
                            <CardDescription className="text-gray-600 ml-13">
                                Gérez vos domaines de compétence et niveaux d'expertise
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {errorDomaines && (
                                <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-lg text-sm mb-4 transition-all duration-300 animate-in fade-in">
                                    <span className="font-medium">{errorDomaines}</span>
                                </div>
                            )}
                            {successDomaines && (
                                <div className="bg-green-50 border border-green-300 text-green-700 p-3 rounded-lg text-sm mb-4 transition-all duration-300 animate-in fade-in">
                                    <span className="font-medium">✓ Domaines mis à jour avec succès !</span>
                                </div>
                            )}

                            <form onSubmit={onSubmitDomaines} className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700">Mes domaines</label>
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

                                {(isLoadingDomaines || isLoadingUserDomaines) ? (
                                    <div className="flex items-center justify-center p-8">
                                        <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
                                        <span className="ml-2 text-gray-600">Chargement des domaines...</span>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {selectedDomaines.map((domaine, index) => {
                                            // Filter out domains that are already selected in OTHER rows
                                            const availableLocalDomaines = domaines.filter(d =>
                                                // Keep if it's the currently selected value for this row
                                                d.id.toString() === domaine.id.toString() ||
                                                // Or if it's NOT selected in any other row
                                                !selectedDomaines.some((sd, i) => i !== index && sd.id.toString() === d.id.toString())
                                            );

                                            return (
                                                <div key={index} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {/* Sélection du domaine */}
                                                        <Select
                                                            value={domaine.id}
                                                            onChange={(e) => handleDomaineChange(index, 'id', e.target.value)}
                                                            className="bg-white border-gray-300 text-sm"
                                                        >
                                                            <option value="">Sélectionnez un domaine</option>
                                                            {availableLocalDomaines.map((d) => (
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
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRemoveDomaine(index)}
                                                        className="text-red-600 hover:bg-red-50 shrink-0"
                                                        title={domaine.isExisting ? "Supprimer ce domaine" : "Retirer"}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}

                                <div className='flex justify-end'>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="text-white bg-red-600 hover:bg-red-500 mr-4"
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="outline"
                                        size="sm"
                                        className="text-white bg-orange-600 hover:bg-orange-500"
                                        disabled={isSavingDomaines}
                                    >
                                        {isSavingDomaines ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Enregistrement...
                                            </>
                                        ) : (
                                            'Sauvegarder'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* CARD: Modifier le Mot de Passe */}
                    <Card className="bg-white border-0 shadow-md">
                        <CardHeader className="border-b border-gray-100">
                            <CardTitle className="flex items-center text-xl text-gray-900">
                                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mr-3">
                                    <Lock className="w-5 h-5 text-orange-600" />
                                </div>
                                Modifier le mot de passe
                            </CardTitle>
                            <CardDescription className="text-gray-600 ml-13">
                                Changez votre mot de passe pour sécuriser votre compte
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {errorPassword && (
                                <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-lg text-sm mb-4 transition-all duration-300 animate-in fade-in">
                                    <span className="font-medium">{errorPassword}</span>
                                </div>
                            )}

                            {successPassword && (
                                <div className="bg-green-50 border border-green-300 text-green-700 p-3 rounded-lg text-sm mb-4 transition-all duration-300 animate-in fade-in">
                                    <span className="font-medium">✓ Mot de passe mis à jour avec succès !</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
                                <div className="grid md:grid-cols-1 gap-4 max-w-md">
                                    {/* Mot de passe actuel */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Mot de passe actuel <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            type="password"
                                            {...registerPassword("currentPassword")}
                                            placeholder="••••••••"
                                            className={`bg-gray-50 border-gray-300 h-10 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-0 transition duration-150 ${errorsPassword.currentPassword ? 'border-red-500 ring-red-500' : ''}`}
                                        />
                                        {errorsPassword.currentPassword && <p className="text-red-600 text-xs mt-1">{errorsPassword.currentPassword.message}</p>}
                                    </div>

                                    {/* Nouveau mot de passe */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Nouveau mot de passe <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            type="password"
                                            {...registerPassword("newPassword")}
                                            placeholder="••••••••"
                                            className={`bg-gray-50 border-gray-300 h-10 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-0 transition duration-150 ${errorsPassword.newPassword ? 'border-red-500 ring-red-500' : ''}`}
                                        />
                                        {errorsPassword.newPassword && <p className="text-red-600 text-xs mt-1">{errorsPassword.newPassword.message}</p>}
                                    </div>

                                    {/* Confirmer le mot de passe */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Confirmer le mot de passe <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            type="password"
                                            {...registerPassword("confirmPassword")}
                                            placeholder="••••••••"
                                            className={`bg-gray-50 border-gray-300 h-10 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-0 transition duration-150 ${errorsPassword.confirmPassword ? 'border-red-500 ring-red-500' : ''}`}
                                        />
                                        {errorsPassword.confirmPassword && <p className="text-red-600 text-xs mt-1">{errorsPassword.confirmPassword.message}</p>}
                                    </div>
                                </div>

                                <CardFooter className="px-0 pt-4 justify-end">
                                    <Button
                                        type="submit"
                                        disabled={isLoadingPassword}
                                        className="bg-orange-600 hover:bg-orange-700 text-white"
                                    >
                                        {isLoadingPassword ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Mise à jour...
                                            </>
                                        ) : (
                                            'Changer le mot de passe'
                                        )}
                                    </Button>
                                </CardFooter>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>

    );
}
