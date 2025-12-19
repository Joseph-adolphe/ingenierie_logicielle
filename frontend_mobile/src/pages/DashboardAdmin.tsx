import { useState, useEffect } from 'react';
import { Menu, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Outlet, useLocation } from 'react-router-dom';
import api from '@/lib/api';

export default function DashboardAdmin() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const getActiveTab = (path: string) => {
    if (path.includes('/users')) return 'users';
    if (path.includes('/providers')) return 'providers';
    if (path.includes('/reported')) return 'reported';
    if (path.includes('/domains')) return 'domains';
    if (path.includes('/settings')) return 'settings';
    if (path.includes('/profile')) return 'profile';
    return 'dashboard';
  };

  const activeTab = getActiveTab(location.pathname);

  // Stats Data
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    totalProviders: 0,
    newProvidersToday: 0,
    reportedUsers: 0,
    totalPosts: 0
  });

  const [userData, setUserData] = useState<any[]>([]);
  const [postData, setPostData] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      const d = res.data;
      setStats({
        totalUsers: d.users_count,
        newUsersToday: d.new_users_today,
        totalProviders: d.prestataires_count,
        newProvidersToday: d.new_prestataires_today,
        reportedUsers: d.reports_count,
        totalPosts: d.posts_count
      });

      // Process Charts Data
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

      // Combine User & Provider stats
      // Initialize with 0s
      const chartData1 = months.map((m, i) => ({ name: m, clients: 0, prestataires: 0, monthIndex: i + 1 }));

      d.monthly_stats.users.forEach((item: any) => {
        const idx = item.month - 1;
        if (chartData1[idx]) chartData1[idx].clients = item.total;
      });
      d.monthly_stats.prestataires.forEach((item: any) => {
        const idx = item.month - 1;
        if (chartData1[idx]) chartData1[idx].prestataires = item.total;
      });
      setUserData(chartData1);

      // Post stats
      const chartData2 = months.map((m, i) => ({ name: m, postes: 0, monthIndex: i + 1 }));
      d.monthly_stats.posts.forEach((item: any) => {
        const idx = item.month - 1;
        if (chartData2[idx]) chartData2[idx].postes = item.total;
      });
      setPostData(chartData2);


    } catch (e) {
      console.error("Error fetching stats:", e);
    }
  };

  // Users Data
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      // API is now paginated, so users are in res.data.data
      const rawUsers = res.data.data || [];

      const mappedUsers = rawUsers.map((u: any) => ({
        id: u.id,
        name: u.name + (u.surname ? ' ' + u.surname : ''),
        email: u.email,
        type: u.prestataire ? 'Prestataire' : 'Client',
        status: u.is_active ? 'Actif' : 'Bloqué',
        joinDate: new Date(u.created_at).toLocaleDateString(),
        services: u.prestataire ? 0 : 0, // Placeholder
        rating: u.prestataire ? 0 : 0, // Placeholder
        bio: u.description || (u.prestataire ? u.prestataire.description : '') || 'Aucune description',
        phone: u.phone,
        posts: []
      }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const providerList = users.filter(u => u.type === 'Prestataire');
  const reportedList = users.filter(u => u.status === 'Signalé'); // Note: 'Signalé' might not be a status in backend explicitly yet, strictly active/blocked based on boolean

  const handleBlockUser = async (id: number) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    // Toggle logic: if Actif -> Block (active=false), if Bloqué -> Unblock (active=true)
    const newStatusIsActive = user.status !== 'Actif'; // If currently Actif(true), we want false. If Blocked(false), we want true.
    // Wait... user.status is 'Actif' or 'Bloqué'.
    // If 'Actif', newStatus = false.
    // If 'Bloqué', newStatus = true.

    const isActivePayload = user.status !== 'Actif';

    try {
      await api.put(`/admin/user/${id}/status`, { is_active: isActivePayload });

      setUsers(users.map(u => {
        if (u.id === id) {
          return { ...u, status: newStatusIsActive ? 'Actif' : 'Bloqué' };
        }
        return u;
      }));

      if (selectedUser && selectedUser.id === id) {
        setSelectedUser((prev: any) => ({ ...prev, status: newStatusIsActive ? 'Actif' : 'Bloqué' }));
      }

    } catch (e) {
      console.error("Error blocking user", e);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (confirm('Supprimer cet utilisateur définitivement ?')) {
      try {
        await api.delete(`/admin/user/${id}`);
        setUsers(users.filter(u => u.id !== id));
        if (selectedUser && selectedUser.id === id) {
          setSelectedUser(null);
        }
      } catch (error) {
        console.error("Error deleting user", error);
      }
    }
  };

  const handleResolveUser = (id: number) => {
    // This was for 'Signalé' status which was optimistic.
    // Since we only have Active/Blocked, we can interpret Resolve as Unblock or just Ignore?
    // Let's map it to Unblock (Activate)
    handleBlockUser(id);
  };


  // Settings State
  const [settings, setSettings] = useState({
    enableRegistrations: true,
    autoValidate: false,
    maintenanceMode: false
  });

  // Profile State
  const [adminProfile, setAdminProfile] = useState({
    name: "Admin Principal",
    email: "admin@helpix.cm",
    role: "Super Admin"
  });

  const contextValue = {
    stats, userData, postData,
    users, setUsers,
    searchTerm, setSearchTerm,
    userFilter, setUserFilter,
    selectedUser, setSelectedUser,
    providerList, reportedList,
    handleBlockUser, handleDeleteUser, handleResolveUser,
    settings, setSettings,
    adminProfile, setAdminProfile
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
        <AdminSidebar activeTab={activeTab} />
      </aside>

      {/* Sidebar - Mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-64 h-full bg-white shadow-xl" onClick={e => e.stopPropagation()}>
            <AdminSidebar activeTab={activeTab} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen relative">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-blue-600">Admin</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </Button>
        </div>

        <Outlet context={contextValue} />
      </div>
    </div>
  );
}