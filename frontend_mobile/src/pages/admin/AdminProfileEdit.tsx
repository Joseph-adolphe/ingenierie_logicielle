import React, { useState, useEffect } from 'react';
import { ChevronRight, User, Loader2, Camera, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema, updatePasswordSchema, type UpdateProfileFormData, type UpdatePasswordFormData } from '@/lib/validators';
import { countries } from '@/lib/countries';
import { getCitiesByCountryCode } from '@/lib/cities';
import api from '@/lib/api';

export default function AdminProfileEdit() {
    const navigate = useNavigate();
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [isLoadingPassword, setIsLoadingPassword] = useState(false);
    const [errorProfile, setErrorProfile] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [successProfile, setSuccessProfile] = useState(false);
    const [successPassword, setSuccessPassword] = useState(false);
    const [user, setUser] = useState<any>(null);

    // Form pour le profil
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: errorsProfile },
        watch: watchProfile,
        setValue: setValueProfile,
        reset: resetProfile
    } = useForm<UpdateProfileFormData>({
        resolver: zodResolver(updateProfileSchema),
    });

    // Form pour le mot de passe
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: errorsPassword },
        reset: resetPassword,
    } = useForm<UpdatePasswordFormData>({
        resolver: zodResolver(updatePasswordSchema),
    });

    // Fetch user data on mount
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/user');
            const userData = res.data;
            setUser(userData);
            resetProfile({
                name: userData.name || '',
                surname: userData.surname || '',
                email: userData.email || '',
                phone: userData.phone || '',
                city: userData.city || '',
                country: userData.country || '',
                birthday: userData.birthday || '',
            });
        } catch (error) {
            console.error("Error fetching profile", error);
            setErrorProfile("Impossible de charger le profil");
        }
    };

    // Surveiller le pays sélectionné pour afficher l'indicatif
    const selectedCountryName = watchProfile("country");
    const selectedCountry = countries.find(c => c.name === selectedCountryName);

    // Obtenir les villes disponibles pour le pays sélectionné
    const availableCities = selectedCountry ? getCitiesByCountryCode(selectedCountry.code) : [];

    // Gérer le changement de numéro de téléphone avec préfixe automatique
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;

        if (!selectedCountry) {
            setValueProfile("phone", input);
            return;
        }

        const dialCode = selectedCountry.dialCode;
        const digitsOnly = input.replace(/\D/g, '');

        if (digitsOnly.length === 0) {
            setValueProfile("phone", dialCode + " ");
            return;
        }

        const dialCodeDigits = dialCode.replace(/\D/g, '');
        let phoneDigits = digitsOnly;

        if (digitsOnly.startsWith(dialCodeDigits)) {
            phoneDigits = digitsOnly.slice(dialCodeDigits.length);
        }

        phoneDigits = phoneDigits.slice(0, selectedCountry.phoneLength);

        let formattedPhone = phoneDigits;
        // Simple formatting logic based on length
        if (selectedCountry.code === "FR" && phoneDigits.length > 0) {
            formattedPhone = phoneDigits.replace(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5').trim();
        } else if (selectedCountry.code === "CM" && phoneDigits.length > 0) {
            formattedPhone = phoneDigits.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4').trim();
        }
        // Add more specific formatting if needed, otherwise fallback to simple display

        setValueProfile("phone", `${dialCode} ${formattedPhone}`.trim());
    };

    // Mettre à jour le téléphone quand le pays change
    useEffect(() => {
        if (selectedCountry) {
            const currentPhone = watchProfile("phone");
            if (currentPhone && !currentPhone.startsWith(selectedCountry.dialCode)) {
                const digitsOnly = currentPhone.replace(/\D/g, '');
                setValueProfile("phone", `${selectedCountry.dialCode} ${digitsOnly.slice(0, selectedCountry.phoneLength)}`);
            }
        }
    }, [selectedCountry, watchProfile, setValueProfile]);


    const onSubmitProfile = async (data: UpdateProfileFormData) => {
        setErrorProfile("");
        setSuccessProfile(false);
        setIsLoadingProfile(true);

        try {
            if (!user?.id) throw new Error("User ID not found");

            await api.put(`/profile/${user.id}`, data);

            // Update local user state
            setUser({ ...user, ...data });

            setSuccessProfile(true);
            setTimeout(() => setSuccessProfile(false), 3000);
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
            setTimeout(() => setSuccessPassword(false), 3000);
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
                    onClick={() => navigate('/admin/profile')}
                    className="mb-6 text-orange-600 hover:text-orange-700 flex items-center transition font-medium"
                >
                    <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Retour au profil
                </button>

                {/* Header avec Avatar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="bg-linear-to-r from-orange-600 to-orange-500 h-32"></div>
                    <div className="px-8 pb-6">
                        <div className="relative -mt-16 mb-4">
                            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-orange-600 text-4xl font-bold border-4 border-white shadow-lg relative group uppercase">
                                {user?.name?.charAt(0) || 'A'}
                                <div className="absolute inset-0 bg-black/5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-default">
                                    <Camera className="w-8 h-8 text-white/80" />
                                </div>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Modifier mon profil</h1>
                        <p className="text-gray-500">Mettez à jour vos informations personnelles et de sécurité</p>
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
                                Modifiez vos informations de profil administrateur
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {errorProfile && (
                                <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-lg text-sm mb-4">
                                    <span className="font-medium">{errorProfile}</span>
                                </div>
                            )}

                            {successProfile && (
                                <div className="bg-green-50 border border-green-300 text-green-700 p-3 rounded-lg text-sm mb-4">
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
                                            placeholder="Prénom"
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
                                            placeholder="Nom"
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
                                            placeholder="Email"
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
                                                value={watchProfile("phone") || ""}
                                                placeholder={selectedCountry ? `${selectedCountry.dialCode} ${'X'.repeat(selectedCountry.phoneLength)}` : "+237 XXXXXXXXX"}
                                                className={`bg-gray-50 border-gray-300 h-10 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-0 transition duration-150 ${errorsProfile.phone ? 'border-red-500 ring-red-500' : ''}`}
                                            />
                                        </div>
                                        {errorsProfile.phone && <p className="text-red-600 text-xs mt-1">{errorsProfile.phone.message}</p>}
                                    </div>

                                    {/* Date de naissance */}
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium text-gray-700">Date de naissance</label>
                                        <Input
                                            type="date"
                                            {...registerProfile("birthday")}
                                            className="bg-gray-50 border-gray-300 h-10 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-0 transition duration-150"
                                        />
                                    </div>
                                </div>

                                <CardFooter className="px-0 pt-4 justify-end gap-3">
                                    <Button
                                        type="button"
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                        onClick={() => navigate('/admin/profile')}
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
                                <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-lg text-sm mb-4">
                                    <span className="font-medium">{errorPassword}</span>
                                </div>
                            )}
                            {successPassword && (
                                <div className="bg-green-50 border border-green-300 text-green-700 p-3 rounded-lg text-sm mb-4">
                                    <span className="font-medium">✓ Mot de passe mis à jour !</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Mot de passe actuel</label>
                                    <Input
                                        type="password"
                                        {...registerPassword("currentPassword")}
                                        className={`bg-gray-50 border-gray-300 h-10 focus-visible:ring-2 focus-visible:ring-orange-500 transition ${errorsPassword.currentPassword ? 'border-red-500' : ''}`}
                                    />
                                    {errorsPassword.currentPassword && <p className="text-red-600 text-xs mt-1">{errorsPassword.currentPassword.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                                    <Input
                                        type="password"
                                        {...registerPassword("newPassword")}
                                        className={`bg-gray-50 border-gray-300 h-10 focus-visible:ring-2 focus-visible:ring-orange-500 transition ${errorsPassword.newPassword ? 'border-red-500' : ''}`}
                                    />
                                    {errorsPassword.newPassword && <p className="text-red-600 text-xs mt-1">{errorsPassword.newPassword.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Confirmer le nouveau mot de passe</label>
                                    <Input
                                        type="password"
                                        {...registerPassword("confirmPassword")}
                                        className={`bg-gray-50 border-gray-300 h-10 focus-visible:ring-2 focus-visible:ring-orange-500 transition ${errorsPassword.confirmPassword ? 'border-red-500' : ''}`}
                                    />
                                    {errorsPassword.confirmPassword && <p className="text-red-600 text-xs mt-1">{errorsPassword.confirmPassword.message}</p>}
                                </div>

                                <div className='flex justify-end pt-2'>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="text-white bg-red-600 hover:bg-red-700 mr-4"
                                        onClick={() => resetPassword()}
                                        disabled={isLoadingPassword}
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="text-white bg-orange-600 hover:bg-orange-700"
                                        disabled={isLoadingPassword}
                                    >
                                        {isLoadingPassword ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Mise à jour...
                                            </>
                                        ) : (
                                            'Mettre à jour le mot de passe'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
