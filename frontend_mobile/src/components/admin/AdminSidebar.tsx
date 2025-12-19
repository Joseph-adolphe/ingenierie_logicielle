import { LayoutDashboard, Users, Briefcase, AlertTriangle, List, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import logosite from '@/assets/logosite.png';

interface AdminSidebarProps {
    activeTab: string;
}

export default function AdminSidebar({ activeTab }: AdminSidebarProps) {
    const { logout } = useAuth();

    const menuItems = [
        { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
        { id: 'users', label: 'Utilisateurs', icon: Users },
        { id: 'providers', label: 'Prestataires', icon: Briefcase },
        { id: 'reported', label: 'Signalements', icon: AlertTriangle },
        { id: 'domains', label: 'Domaines', icon: List },
        { id: 'profile', label: 'Mon Profil', icon: User },
    ];

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
            <div className="p-6 flex items-center space-x-2 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <img src={logosite} alt="ServiceLocal Logo" className="w-10 h-10 object-contain" />
                </div>
                <span className="text-xl font-bold text-orange-600">Helpix</span>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    // Helper to check active state
                    const isActive = activeTab === item.id;

                    return (
                        <Link
                            key={item.id}
                            to={`/admin/${item.id === 'dashboard' ? 'dashboard' : item.id}`}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'border border-orange-600 text-orange-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Déconnexion</span>
                </button>
            </div>
        </div>
    );
}
