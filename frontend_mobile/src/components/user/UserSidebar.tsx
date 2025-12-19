import { Search, Calendar, User, LogOut, MessageSquare, House, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import logosite from '@/assets/logosite.png';

interface UserSidebarProps {
    activeTab: string;
    className?: string;
}

export default function UserSidebar({ activeTab, className }: UserSidebarProps) {
    const menuItems = [
        { id: 'dashboard', label: 'Accueil', icon: House },
        { id: 'explorer', label: 'Explorer', icon: Search },
        { id: 'bookings', label: 'Mes Réservations', icon: Calendar },
        { id: 'messages', label: 'Messages', icon: MessageSquare },
        { id: 'profile', label: 'Mon Profil', icon: User },
    ];

    const { user, logout } = useAuth();

    return (
        <aside className={cn("hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 bottom-0 z-50", className)}>
            <div className="p-6 flex items-center space-x-2 border-b border-gray-100">
                <div className="w-8 h-8rounded-lg flex items-center justify-center">
                    <img src={logosite} alt="ServiceLocal Logo" className="w-10 h-10 object-contain" />
                </div>
                <span className="text-xl font-bold text-orange-600">Helpix</span>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    // Check if activeTab matches item.id (logic passed from parent)
                    const isActive = activeTab === item.id;

                    return (
                        <Link
                            key={item.id}
                            to={`/user/${item.id === 'dashboard' ? 'dashboard' : item.id}`}
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

                {user?.role === 'prestataire' && (
                    <Link
                        to="/provider"
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-green-600 hover:bg-green-50 transition-colors mt-4 border border-green-100"
                    >
                        <Briefcase className="w-5 h-5" />
                        <span className="font-medium">Espace Prestataire</span>
                    </Link>
                )}
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
