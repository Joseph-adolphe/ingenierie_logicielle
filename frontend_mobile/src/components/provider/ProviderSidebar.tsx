import { LayoutDashboard, Briefcase, FileText, User, LogOut, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import logosite from '@/assets/logosite.png';

interface ProviderSidebarProps {
    activeView: string;
}

export default function ProviderSidebar({ activeView }: ProviderSidebarProps) {
    const { logout } = useAuth();
    const menuItems = [
        { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
        { id: 'posts', label: 'Mes Publications', icon: FileText },
        { id: 'requests', label: 'Demandes', icon: Briefcase },
        { id: 'messages', label: 'Messages', icon: MessageSquare },
        { id: 'profile', label: 'Mon Profil', icon: User },
    ];

    return (
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 bottom-0 z-50">
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
                    const isActive = activeView === item.id;

                    return (
                        <Link
                            key={item.id}
                            to={`/provider/${item.id === 'dashboard' ? 'dashboard' : item.id}`}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-orange-50 text-orange-600 font-medium'
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
        </aside>
    );
}
