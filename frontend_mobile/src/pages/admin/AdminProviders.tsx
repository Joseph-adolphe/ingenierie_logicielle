import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function AdminProviders() {
    const navigate = useNavigate();
    const [providers, setProviders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchProviders();
        }, 500); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [page, searchTerm]);

    const fetchProviders = async () => {
        setLoading(true);
        try {
            // Reusing the same endpoint but forcing type=prestataire
            let url = `/admin/users?type=prestataire&page=${page}`;
            if (searchTerm) {
                url += `&search=${encodeURIComponent(searchTerm)}`;
            }
            const res = await api.get(url);

            // Map the user data to looks like provider objects if needed, 
            // OR checks if the API returns mixed structure.
            // UserController returns User objects with 'prestataire' relation.
            // AdminProviders expects objects that have { user: ... }. 
            // But wait, the previous code expected `providers` array where each item IS a Provider model (with user relation).
            // My UserController returns Users (with prestataire relation).

            // Let's adapt:
            const mappedProviders = res.data.data.map((u: any) => ({
                id: u.prestataire?.id || u.id, // Use provider ID if available
                user: u, // The user object itself
                domaines: u.prestataire?.domaines || []
            }));

            setProviders(mappedProviders);
            setTotalPages(res.data.last_page);
        } catch (error) {
            console.error("Error fetching providers", error);
        } finally {
            setLoading(false);
        }
    };

    // Since providers are users, we update the USER status.
    const handleBlockUser = async (providerId: number) => {
        // Provider object structure usually provider.user.id
        const provider = providers.find(p => p.id === providerId);
        if (!provider || !provider.user) return;

        try {
            const newStatus = !provider.user.is_active;
            await api.put(`/admin/user/${provider.user.id}/status`, { is_active: newStatus });

            // Update local state
            setProviders(prev => prev.map(p =>
                p.id === providerId
                    ? { ...p, user: { ...p.user, is_active: newStatus } }
                    : p
            ));
            toast.success(`Prestataire ${newStatus ? 'débloqué' : 'bloqué'} avec succès`);
        } catch (error) {
            console.error("Error blocking provider", error);
            toast.error("Erreur lors de la modification du statut");
        }
    };


    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6">
                <h2 className="text-xl font-bold mb-2">Gestion des Prestataires</h2>
                <p className="text-gray-500 text-sm">Validations, statistiques et gestion des comptes professionnels.</p>
            </div>



            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Rechercher par nom, email ou domaine..."
                        className="pl-9 w-full"
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {providers.map((provider: any) => (
                    <div key={provider.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-3">
                                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold">
                                    {(provider.user?.name || '?').charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{provider.user?.name} {provider.user?.surname}</h3>
                                    <p className="text-xs text-gray-500">{provider.user?.email}</p>
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] rounded font-medium">
                                        {provider.domaines?.length || 0} Domaines
                                    </span>
                                </div>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${provider.user?.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        </div>

                        <div className="flex gap-2 mt-6">
                            <Button variant="outline" className="flex-1 text-xs hover:bg-red-50 hover:text-red-500" onClick={() => handleBlockUser(provider.id)}>
                                {provider.user?.is_active ? 'Bloquer' : 'Débloquer'}
                            </Button>
                            <Button variant="default" className="flex-1 text-xs text-white bg-orange-600 hover:bg-orange-700" onClick={() => navigate(`/admin/user/${provider.user?.id}`)}>
                                Détails
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center p-4">
                <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                >
                    Précédent
                </Button>
                <span className="text-sm text-gray-500">Page {page} sur {totalPages}</span>
                <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || loading}
                >
                    Suivant
                </Button>
            </div>
        </div>
    );
}
