import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminUserDetail from './AdminUserDetail';
import api from '@/lib/api';

export default function AdminUserDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchUser();
        }
    }, [id]);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/admin/user/${id}`);
            // The endpoint returns the raw user object (possibly with 'prestataire' relation eagerly loaded if updated, but maybe not for show() yet)
            // Let's assume standard response and map it.
            // We might need to fetch provider details if it is a provider to get ratings/posts? 
            // The previous 'AdminUserDetail' expected a mapped object.

            const rawUser = res.data;
            const mappedUser = {
                id: rawUser.id,
                name: `${rawUser.name} ${rawUser.surname || ''}`,
                email: rawUser.email,
                phone: rawUser.phone,
                type: rawUser.role === 'prestataire' || rawUser.prestataire ? 'Prestataire' : 'Client',
                status: rawUser.is_active ? 'Actif' : 'Bloqué',
                joinDate: new Date(rawUser.created_at).toLocaleDateString(),
                bio: rawUser.description || (rawUser.prestataire?.description) || '',
                rating: 0, // Need to fetch from somewhere if not in user object
                services: 0,
                posts: [] // Need to fetch
            };

            setUser(mappedUser);
        } catch (error) {
            console.error("Error fetching user details", error);
            alert("Erreur lors du chargement de l'utilisateur");
            navigate('/admin/users');
        } finally {
            setLoading(false);
        }
    };

    const handleBlockUser = async (userId: number) => {
        if (!user) return;
        try {
            const newStatus = user.status !== 'Actif'; // Toggle
            await api.put(`/admin/user/${userId}/status`, { is_active: newStatus });
            setUser({ ...user, status: newStatus ? 'Actif' : 'Bloqué' });
        } catch (error) {
            console.error("Error blocking user", error);
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            try {
                await api.delete(`/admin/user/${userId}`);
                navigate(-1); // Go back
            } catch (error) {
                console.error("Error deleting user", error);
            }
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Chargement...</div>;
    }

    if (!user) {
        return <div className="p-8 text-center text-red-500">Utilisateur non trouvé.</div>;
    }

    return (
        <AdminUserDetail
            selectedUser={user}
            setSelectedUser={() => navigate(-1)} // Use setSelectedUser to navigate back as a hack/shim for now, since component calls it "Retour"
            handleDeleteUser={handleDeleteUser}
            handleBlockUser={handleBlockUser}
        />
    );
}
