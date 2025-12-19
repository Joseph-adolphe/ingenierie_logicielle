import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Calendar, Award } from 'lucide-react';
import api from '@/lib/api';

export default function AdminProfile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/user');
            setProfile(res.data);
        } catch (error) {
            console.error("Error fetching profile", error);
        }
    };

    if (!profile) return <div className="p-8 text-center text-gray-500">Chargement...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="bg-linear-to-r from-orange-600 to-orange-500 h-32"></div>
                <div className="px-8 pb-6">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                        <div className="flex items-end gap-6">
                            <div className="relative -mt-16">
                                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-orange-600 border-4 border-white shadow-lg uppercase">
                                    {profile.name ? profile.name.charAt(0) : 'A'}
                                </div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
                            </div>
                            <div className="mb-4">
                                <h1 className="text-3xl font-bold text-gray-900">{profile.name} {profile.surname}</h1>
                                <p className="text-gray-500 flex items-center gap-2 mt-1">
                                    <Shield className="w-4 h-4 text-orange-500" />
                                    Administrateur Système
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0 md:mb-4">
                            <Button
                                onClick={() => navigate('/admin/profile/edit')}
                                className="bg-orange-600 hover:bg-orange-700 text-white w-full md:w-auto"
                            >
                                Modifier le profil
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Info Column */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                                <User className="w-5 h-5 text-orange-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Informations personnelles</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Email</p>
                                    <p className="text-gray-900 font-medium">{profile.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Membre depuis</p>
                                    <p className="text-gray-900 font-medium">
                                        {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Column */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                                <Award className="w-5 h-5 text-orange-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Compte</h2>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Rôle</p>
                                <p className="text-gray-900 font-medium capitalize">{profile.role || 'Admin'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Statut</p>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                    Actif
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
