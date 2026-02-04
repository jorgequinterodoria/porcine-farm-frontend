import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  PiggyBank,
  Wheat,
  VenusAndMars,
  Layers,
  LogOut,
  Building2,
  Stethoscope,
  CircleDollarSign,
  ClipboardList,
  Menu,
  X,
  Users
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { SyncStatus } from '../components/ui/SyncStatus';
import { useSyncInit } from '../hooks/useSync';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DashboardLayout: React.FC = () => {
  useSyncInit();
  const { user, tenant, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const superAdminNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Granjas', path: '/tenants', icon: Building2 },
  ];

  const farmAdminNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Animales', path: '/animals', icon: PiggyBank },
    { name: 'Lotes', path: '/batches', icon: Layers },
    { name: 'Alimentación', path: '/feeding', icon: Wheat },
    { name: 'Infraestructura', path: '/infrastructure', icon: Building2, allowedRoles: ['admin', 'farm_admin', 'owner', 'super_admin'] },
    { name: 'Sanidad', path: '/health', icon: Stethoscope, allowedRoles: ['admin', 'farm_admin', 'owner', 'super_admin'] },
    { name: 'Reproducción', path: '/reproduction', icon: VenusAndMars, allowedRoles: ['admin', 'farm_admin', 'owner', 'super_admin'] },
    {
      name: 'Finanzas',
      path: '/financial',
      icon: CircleDollarSign,
      allowedRoles: ['admin', 'farm_admin', 'owner', 'super_admin']
    },
    { name: 'Operaciones', path: '/operations', icon: ClipboardList, allowedRoles: ['admin', 'farm_admin', 'owner', 'super_admin'] },
    {
      name: 'Equipo',
      path: '/team',
      icon: Users,
      allowedRoles: ['admin', 'farm_admin', 'owner', 'super_admin']
    },
  ];

  const getNavItems = () => {
    if (user?.role === 'super_admin') return superAdminNavItems;

    return farmAdminNavItems.filter(item => {
      if (!item.allowedRoles) return true;
      return item.allowedRoles.includes(user?.role || '');
    });
  };

  const navItems = getNavItems();

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* --- MOBILE HEADER (Solo visible en móviles) --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white z-30 flex items-center justify-between px-4 border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-200">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="font-bold text-lg text-gray-900">PorciFarm</span>
        </div>
        <div className="flex items-center gap-2">
            <SyncStatus />
            <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
        </div>
      </div>

      {/* --- MOBILE OVERLAY --- */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out md:sticky md:top-0 md:h-screen md:translate-x-0 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>

        {/* Logo Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <LayoutDashboard className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight text-gray-900 tracking-tight">PorciFarm</h2>
              <p className="text-xs text-gray-500 font-medium truncate max-w-[140px]">
                {tenant?.name || 'Gestión Porcina'}
              </p>
            </div>
          </div>
          <SyncStatus />
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                    isActive
                      ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"
                    )}
                  />
                  <span>{item.name}</span>

                  {isActive && (
                    <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Section (Footer) */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <Link
            to="/profile"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-indigo-200 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-700 border border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate group-hover:text-indigo-700 transition-colors">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Usuario'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.role || 'Admin'}</p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-lg transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 min-w-0 transition-all duration-300">
        <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-[1600px] mx-auto animate-fadeIn">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
