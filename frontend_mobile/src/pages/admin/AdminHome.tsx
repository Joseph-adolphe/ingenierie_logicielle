import { useState, useEffect } from 'react';
import { Users, Briefcase, AlertTriangle, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

export default function AdminHome() {
    const { users } = useOutletContext<any>();
    const navigate = useNavigate();

    // Recent users logic
    const recentUsers = users ? [...users].sort((a: any, b: any) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()).slice(0, 5) : [];

    // Local state for stats
    const [stats, setStats] = useState({
        totalUsers: 0,
        newUsersToday: 0,
        totalProviders: 0,
        newProvidersToday: 0,
        reportedUsers: 0,
        totalPosts: 0
    });
    const [userData, setUserData] = useState<any[]>([]);


    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            console.log("Fetching /admin/stats...");
            const res = await api.get('/admin/stats');
            const d = res.data;
            console.log("Stats received:", d);

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
            // Combine User, Provider & Post stats
            const chartData = months.map((m, i) => ({ name: m, clients: 0, prestataires: 0, postes: 0, monthIndex: i + 1 }));

            // Users
            if (d.monthly_stats && d.monthly_stats.users) {
                d.monthly_stats.users.forEach((item: any) => {
                    const idx = item.month - 1;
                    if (chartData[idx]) chartData[idx].clients = item.total;
                });
            }

            // Providers
            if (d.monthly_stats && d.monthly_stats.prestataires) {
                d.monthly_stats.prestataires.forEach((item: any) => {
                    const idx = item.month - 1;
                    if (chartData[idx]) chartData[idx].prestataires = item.total;
                });
            }

            // Posts
            if (d.monthly_stats && d.monthly_stats.posts) {
                d.monthly_stats.posts.forEach((item: any) => {
                    const idx = item.month - 1;
                    if (chartData[idx]) chartData[idx].postes = item.total;
                });
            }

            setUserData(chartData);

        } catch (error) {
            console.error("Error fetching admin stats in AdminHome:", error);
        }
    };

    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
                <p className="text-gray-500">Bienvenue sur votre espace d'administration.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm">Total Utilisateurs</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers}</h3>
                            <p className="text-green-600 text-xs mt-1">+{stats.newUsersToday} aujourd'hui</p>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm">Prestataires</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalProviders}</h3>
                            <p className="text-green-600 text-xs mt-1">+{stats.newProvidersToday} aujourd'hui</p>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <Briefcase className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm">Signalements</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.reportedUsers}</h3>
                            <p className="text-orange-600 text-xs mt-1">À traiter</p>
                        </div>
                        <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm">Total Postes</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalPosts}</h3>
                            <p className="text-blue-600 text-xs mt-1">Actifs</p>
                        </div>
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <Activity className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Charts Area */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Aperçu des Activités</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={userData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="clients" stroke="#3B82F6" strokeWidth={2} dot={false} name="Clients" />
                                <Line type="monotone" dataKey="prestataires" stroke="#10B981" strokeWidth={2} dot={false} name="Prestataires" />
                                <Line type="monotone" dataKey="postes" stroke="#8B5CF6" strokeWidth={2} dot={false} name="Postes" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Actions & Small Stats */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Actions Rapides</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => navigate('/admin/users')} className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors">
                                <Users className="w-5 h-5" />
                                <span className="text-xs font-semibold">Utilisateurs</span>
                            </button>
                            <button onClick={() => navigate('/admin/providers')} className="p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors">
                                <Briefcase className="w-5 h-5" />
                                <span className="text-xs font-semibold">Prestataires</span>
                            </button>
                            <button onClick={() => navigate('/admin/reported')} className="p-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors">
                                <AlertTriangle className="w-5 h-5" />
                                <span className="text-xs font-semibold">Signalements</span>
                            </button>
                            <button onClick={() => navigate('/admin/settings')} className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors">
                                <Activity className="w-5 h-5" />
                                <span className="text-xs font-semibold">Paramètres</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Inscriptions Récentes</h3>
                    <Button variant="ghost" size="sm" className='hover:text-orange-600' onClick={() => navigate('/admin/users')}>Voir tout</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-gray-900">Utilisateur</th>
                                <th className="px-6 py-3 font-semibold text-gray-900">Type</th>
                                <th className="px-6 py-3 font-semibold text-gray-900">Date</th>
                                <th className="px-6 py-3 font-semibold text-gray-900">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentUsers.map((user: any) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-3 font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.type === 'Prestataire' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {user.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-gray-500">{user.joinDate}</td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {recentUsers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Aucune inscription récente</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
