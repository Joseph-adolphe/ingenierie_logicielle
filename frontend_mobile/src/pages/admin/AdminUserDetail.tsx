import { Trash2, Ban, ChevronRight, User, Mail, MapPin, Phone, Calendar, Briefcase, Globe, BarChart3, Star, ImageIcon, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface AdminUserDetailProps {
    selectedUser: any;
    setSelectedUser: (user: any | null) => void;
    handleDeleteUser: (id: number) => void;
    handleBlockUser: (id: number) => void;
}

export default function AdminUserDetail({ selectedUser, setSelectedUser, handleDeleteUser, handleBlockUser }: AdminUserDetailProps) {
    if (!selectedUser) return null;

    const isProvider = selectedUser.type === 'Prestataire';

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <button
                    onClick={() => setSelectedUser(null)}
                    className="mb-6 hover:text-orange-700 flex items-center transition font-medium"
                >
                    <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Retour à la liste
                </button>

                {/* Header avec Avatar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="bg-linear-to-r from-orange-600 to-orange-500 h-32 relative">
                        {/* Admin Badge */}
                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium border border-white/30">
                            Vue Administrateur
                        </div>
                    </div>

                    <div className="px-8 pb-6">
                        <div className="relative -mt-16 mb-6 flex flex-col sm:flex-row items-end justify-between gap-4">
                            <div className="flex items-end gap-6">
                                <div className="relative">
                                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-orange-600 text-4xl font-bold border-4 border-white shadow-lg uppercase">
                                        {selectedUser.name.charAt(0)}
                                    </div>
                                    <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white ${selectedUser.status === 'Actif' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                </div>
                                <div className="mb-2">
                                    <h1 className="text-3xl font-bold text-gray-900">{selectedUser.name}</h1>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${isProvider ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                                            {isProvider ? <Briefcase className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                            {selectedUser.type}
                                        </span>
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedUser.status === 'Actif' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                            {selectedUser.status === 'Actif' ? <ShieldCheck className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                                            {selectedUser.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions Admin */}
                            <div className="flex gap-2 w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    className="flex-1 sm:flex-none text-red-600 hover:bg-red-50 border-red-200"
                                    onClick={() => handleDeleteUser(selectedUser.id)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                                </Button>
                                <Button
                                    className={`flex-1 sm:flex-none text-white ${selectedUser.status === 'Bloqué' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                                    onClick={() => handleBlockUser(selectedUser.id)}
                                >
                                    <Ban className="w-4 h-4 mr-2" />
                                    {selectedUser.status === 'Bloqué' ? 'Débloquer' : 'Bloquer'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Colonne Gauche - Infos */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Card: Informations personnelles */}
                        <Card className="bg-white shadow-sm border border-gray-100">
                            <CardHeader className="border-b border-gray-100 px-6">
                                <CardTitle className="flex items-center text-lg text-gray-900">
                                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mr-3">
                                        <User className="w-5 h-5 text-orange-600" />
                                    </div>
                                    Informations personnelles
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 px-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</p>
                                        <p className="text-sm font-medium text-gray-900 truncate" title={selectedUser.email}>{selectedUser.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Téléphone</p>
                                        <p className="text-sm font-medium text-gray-900">{selectedUser.phone || "Non renseigné"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Localisation</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {selectedUser.city && selectedUser.country ? `${selectedUser.city}, ${selectedUser.country}` : (selectedUser.city || selectedUser.country || 'Non renseigné')}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Date d'inscription</p>
                                        <p className="text-sm font-medium text-gray-900">{selectedUser.joinDate}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> ID</p>
                                        <p className="text-sm font-medium text-gray-900">#{selectedUser.id}</p>
                                    </div>
                                </div>

                                {selectedUser.bio && (
                                    <div className="mt-6 pt-6 border-t border-gray-50">
                                        <p className="text-xs font-medium text-gray-500 uppercase mb-2">Biographie</p>
                                        <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                                            "{selectedUser.bio}"
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Activity / Posts (Provider Only) */}
                        {isProvider && (
                            <Card className="bg-white shadow-sm border border-gray-100">
                                <CardHeader className="border-b border-gray-100 px-6">
                                    <CardTitle className="flex items-center text-lg text-gray-900">
                                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mr-3">
                                            <ImageIcon className="w-5 h-5 text-orange-600" />
                                        </div>
                                        Publications récentes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 px-6">
                                    {selectedUser.posts && selectedUser.posts.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {selectedUser.posts.slice(0, 6).map((post: any) => (
                                                <div key={post.id} className="group relative rounded-lg overflow-hidden border border-gray-100 shadow-sm aspect-square bg-gray-100">
                                                    <img
                                                        src={post.image || '/placeholder-image.jpg'}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=No+Image';
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                                        <p className="text-white text-xs font-medium truncate w-full">{post.title}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                            <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            <p className="text-sm">Aucune publication trouvée.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Colonne Droite - Stats */}
                    <div className="space-y-6">
                        <Card className="bg-white shadow-sm border border-gray-100">
                            <CardHeader className="border-b border-gray-100 px-6">
                                <CardTitle className="flex items-center text-lg text-gray-900">
                                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mr-3">
                                        <BarChart3 className="w-5 h-5 text-orange-600" />
                                    </div>
                                    Statistiques
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 px-6 space-y-4">
                                {isProvider ? (
                                    <>
                                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                                            <p className="text-xs font-medium text-orange-600/80 mb-1 uppercase">Note Moyenne</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-bold text-orange-700">{selectedUser.rating || 0}</span>
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-4 h-4 ${i < Math.round(selectedUser.rating || 0) ? 'fill-current' : 'text-gray-300'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                            <p className="text-xs font-medium text-blue-600/80 mb-1 uppercase">Services Réalisés</p>
                                            <p className="text-2xl font-bold text-blue-700">{selectedUser.services || 0}</p>
                                        </div>
                                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                                            <p className="text-xs font-medium text-purple-600/80 mb-1 uppercase">Publications</p>
                                            <p className="text-2xl font-bold text-purple-700">{selectedUser.posts?.length || 0}</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                            <p className="text-xs font-medium text-blue-600/80 mb-1 uppercase">Demandes envoyées</p>
                                            <p className="text-2xl font-bold text-blue-700">{selectedUser.services || 0}</p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
