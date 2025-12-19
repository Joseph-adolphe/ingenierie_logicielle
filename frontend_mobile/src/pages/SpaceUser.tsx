import { useState } from 'react';
import { Briefcase, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserSidebar from '@/components/user/UserSidebar';
import BecomeProviderModal from '@/components/modals/BecomeProviderModal';
import { Outlet, useLocation } from 'react-router-dom';

export default function DashboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [becomeProviderOpen, setBecomeProviderOpen] = useState(false);
  const location = useLocation();

  // Determine active tab based on URL for Sidebar highlighting
  // /user/home -> dashboard, /user/explorer -> explorer, etc.
  const getActiveTab = (path: string) => {
    if (path.includes('/explorer')) return 'explorer';
    if (path.includes('/bookings')) return 'bookings';
    if (path.includes('/messages')) return 'messages';
    if (path.includes('/profile')) return 'profile';
    return 'dashboard';
  };

  const activeTab = getActiveTab(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <UserSidebar activeTab={activeTab} />

      {/* Sidebar - Mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-64 h-full bg-white shadow-xl" onClick={e => e.stopPropagation()}>
            <UserSidebar activeTab={activeTab} className="flex static h-full w-full" />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen relative">
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

        {/* BECOME PROVIDER MODAL */}
        <BecomeProviderModal
          isOpen={becomeProviderOpen}
          onClose={() => setBecomeProviderOpen(false)}
        />

        <Outlet context={{ setBecomeProviderOpen }} />
      </div>
    </div>
  );
}