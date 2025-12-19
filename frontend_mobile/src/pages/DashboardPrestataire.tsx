import { useState } from 'react';
import { Menu, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProviderSidebar from '@/components/provider/ProviderSidebar';
import { Outlet, useLocation } from 'react-router-dom';

export default function ProviderDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const getActiveView = (path: string) => {
    if (path.includes('/posts')) return 'posts';
    if (path.includes('/requests')) return 'requests';
    if (path.includes('/messages')) return 'messages';
    if (path.includes('/profile')) return 'profile';
    return 'dashboard';
  };

  const activeView = getActiveView(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <ProviderSidebar activeView={activeView} />

      {/* Sidebar - Mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-64 h-full bg-white shadow-xl" onClick={e => e.stopPropagation()}>
            <ProviderSidebar activeView={activeView} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-blue-600">Helpix</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </Button>
        </div>

        <Outlet />
      </div>
    </div>
  );
}