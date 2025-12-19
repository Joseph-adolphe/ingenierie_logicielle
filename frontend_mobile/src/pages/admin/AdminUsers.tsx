import { Eye, Ban, Trash2, Search, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function AdminUsers() {
    const navigate = useNavigate();
    const { handleDeleteUser } = useOutletContext<any>();


    // Local state for pagination and filtering
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [userFilter, setUserFilter] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, [page, searchTerm, userFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            let url = `/admin/users?page=${page}`;

            if (userFilter === 'clients') url += '&type=client';
            if (userFilter === 'providers') url += '&type=prestataire';
            if (searchTerm) url += `&search=${searchTerm}`;

            const res = await api.get(url);

            const mappedUsers = res.data.data.map((u: any) => ({
                id: u.id,
                name: u.name + (u.surname ? ' ' + u.surname : ''),
                email: u.email,
                type: u.prestataire ? 'Prestataire' : 'Client',
                status: u.is_active ? 'Actif' : 'Bloqué',
            }));

            setUsers(mappedUsers);
            setTotalPages(res.data.last_page);
        } catch (error) {
            console.error("Error fetching users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId: number, currentStatus: string) => {
        try {
            const newStatus = currentStatus === 'Actif' ? false : true;
            await api.put(`/admin/user/${userId}/status`, { is_active: newStatus });

            setUsers(users.map(u =>
                u.id === userId
                    ? { ...u, status: currentStatus === 'Actif' ? 'Bloqué' : 'Actif' }
                    : u
            ));

            toast.success(`Utilisateur ${currentStatus === 'Actif' ? 'bloqué' : 'débloqué'} avec succès.`);

        } catch (error) {
            console.error("Error toggling user status", error);
            toast.error("Impossible de modifier le statut de l'utilisateur.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold">Gestion des Utilisateurs</h2>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Rechercher..."
                            className="pl-9 w-full"
                            value={searchTerm}
                            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                        />
                    </div>
                    <select
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={userFilter}
                        onChange={e => { setUserFilter(e.target.value); setPage(1); }}
                    >
                        <option value="all">Tous</option>
                        <option value="clients">Clients</option>
                        <option value="providers">Prestataires</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900">Utilisateur</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Type</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Statut</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user: any) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{user.name}</p>
                                                <p className="text-gray-500 text-xs">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.type === 'Prestataire' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {user.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600" onClick={() => navigate(`/admin/user/${user.id}`)}>
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={`h-8 w-8 ${user.status === 'Actif' ? 'text-red-600' : 'text-green-600'}`}
                                                onClick={() => handleToggleStatus(user.id, user.status)}
                                                title={user.status === 'Actif' ? "Bloquer" : "Débloquer"}
                                            >
                                                {user.status === 'Actif' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600" onClick={() => handleDeleteUser(user.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center p-4 border-t border-gray-100">
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
        </div>
    );
}

