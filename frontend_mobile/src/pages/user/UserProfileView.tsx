import { ChevronRight, User, Briefcase, MapPin, Phone, Mail, Calendar, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useOutletContext } from 'react-router-dom';

interface UserProfileContext {
    setBecomeProviderOpen: (open: boolean) => void;
}

export default function UserProfileView() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { setBecomeProviderOpen } = useOutletContext<UserProfileContext>();

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto p-4 animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={() => navigate('/user/home')}
                    className="mb-6 text-orange-600 hover:text-orange-700 flex items-center transition font-medium"
                >
                    <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Retour à l'accueil
                </button>

                {/* Header avec Avatar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="bg-linear-to-r from-orange-600 to-orange-500 h-24 sm:h-32"></div>
                    <div className="px-4 sm:px-8 pb-6">
                        {/* Avatar et boutons - Layout responsive */}
                        <div className="relative -mt-12 sm:-mt-16 mb-4">
                            {/* Avatar */}
                            <div className="flex justify-center sm:justify-start mb-4 sm:mb-0">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-linear-to-br from-orange-600 to-orange-400 rounded-full flex items-center justify-center text-white text-2xl sm:text-4xl font-bold border-4 border-white shadow-lg overflow-hidden">
                                    {user?.profile_picture ? (
                                        <img
                                            src={`${import.meta.env.VITE_API_URL?.replace('/api', '/storage') || 'http://localhost:8000/storage'}/${user.profile_picture.replace(/\\/g, '/')}`}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span>{user?.name?.charAt(0)}{user?.surname?.charAt(0)}</span>
                                    )}
                                </div>
                            </div>

                            {/* Boutons - Stack sur mobile, horizontal sur desktop */}
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:absolute sm:right-0 sm:bottom-0">
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-auto border-orange-600 text-orange-600 hover:bg-orange-50 text-sm sm:text-base"
                                    onClick={() => navigate('/user/profile/edit')}
                                >
                                    <span className="sm:hidden">Modifier</span>
                                    <span className="hidden sm:inline">Modifier le profil</span>
                                </Button>
                                {user?.role === 'prestataire' ? (
                                    <Button
                                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 shadow-md transition-transform hover:scale-105 text-sm sm:text-base"
                                        onClick={() => navigate('/provider')}
                                    >
                                        Espace Prestataire
                                    </Button>
                                ) : (
                                    <Button
                                        className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 shadow-md transition-transform hover:scale-105 text-sm sm:text-base"
                                        onClick={() => setBecomeProviderOpen(true)}
                                    >
                                        Devenir Prestataire
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Nom et titre */}
                        <div className="text-center sm:text-left mt-4">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                {user?.surname} {user?.name}
                            </h1>
                            <p className="text-gray-500 text-sm sm:text-base">Profil utilisateur</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Card: Informations personnelles */}
                    <Card className="bg-white border-0 shadow-md">
                        <CardHeader className="border-b border-gray-100 px-4 sm:px-6">
                            <CardTitle className="flex items-center text-lg sm:text-xl text-gray-900">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-50 flex items-center justify-center mr-2 sm:mr-3">
                                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                                </div>
                                <span className="text-base sm:text-xl">Informations personnelles</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                {/* Prénom */}
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-500 uppercase">Prénom</p>
                                    <p className="text-base text-gray-900 font-medium">
                                        {user?.surname || '—'}
                                    </p>
                                </div>

                                {/* Nom */}
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-500 uppercase">Nom</p>
                                    <p className="text-base text-gray-900 font-medium">
                                        {user?.name || '—'}
                                    </p>
                                </div>

                                {/* Email */}
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-500 uppercase flex items-center">
                                        <Mail className="w-3 h-3 mr-1" /> Email
                                    </p>
                                    <p className="text-base text-gray-900">
                                        {user?.email || '—'}
                                    </p>
                                </div>

                                {/* Pays */}
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-500 uppercase flex items-center">
                                        <Globe className="w-3 h-3 mr-1" /> Pays
                                    </p>
                                    <p className="text-base text-gray-900">
                                        {user?.country || '—'}
                                    </p>
                                </div>

                                {/* Ville */}
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-500 uppercase flex items-center">
                                        <MapPin className="w-3 h-3 mr-1" /> Ville
                                    </p>
                                    <p className="text-base text-gray-900">
                                        {user?.city || '—'}
                                    </p>
                                </div>

                                {/* Téléphone */}
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-500 uppercase flex items-center">
                                        <Phone className="w-3 h-3 mr-1" /> Téléphone
                                    </p>
                                    <p className="text-base text-gray-900">
                                        {user?.phone || '—'}
                                    </p>
                                </div>

                                {/* Date de naissance */}
                                <div className="space-y-1 md:col-span-2">
                                    <p className="text-xs font-medium text-gray-500 uppercase flex items-center">
                                        <Calendar className="w-3 h-3 mr-1" /> Date de naissance
                                    </p>
                                    <p className="text-base text-gray-900">
                                        {user?.birthday ? new Date(user.birthday).toLocaleDateString('fr-FR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : '—'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card: Activité */}
                    <Card className="bg-white border-0 shadow-md">
                        <CardHeader className="border-b border-gray-100 px-4 sm:px-6">
                            <CardTitle className="flex items-center text-lg sm:text-xl text-gray-900">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-50 flex items-center justify-center mr-2 sm:mr-3">
                                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                                </div>
                                <span className="text-base sm:text-xl">Activité sur la plateforme</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="p-4 bg-orange-50 rounded-lg">
                                    <p className="text-xs font-medium text-gray-600 mb-1">Rôle</p>
                                    <p className="text-lg font-bold text-orange-600 capitalize">
                                        {user?.role || 'Client'}
                                    </p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <p className="text-xs font-medium text-gray-600 mb-1">Statut du compte</p>
                                    <p className="text-lg font-bold text-green-600">
                                        Actif
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
