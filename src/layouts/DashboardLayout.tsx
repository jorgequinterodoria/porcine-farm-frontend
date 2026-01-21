import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  LogOut, 
  ChevronRight,
  Building2,
  Stethoscope,
  CircleDollarSign,
  ClipboardList,
  CalendarDays,
  Menu,
  X
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DashboardLayout: React.FC = () => {
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
    { name: 'Animales', path: '/animals', icon: Layers },
    { name: 'Lotes', path: '/batches', icon: Layers },
    { name: 'Infraestructura', path: '/infrastructure', icon: Building2 },
    { name: 'Sanidad', path: '/health', icon: Stethoscope },
    { name: 'Reproducción', path: '/reproduction', icon: CalendarDays },
    { name: 'Finanzas', path: '/financial', icon: CircleDollarSign },
    { name: 'Operaciones', path: '/operations', icon: ClipboardList },
  ];

  const navItems = user?.role === 'super_admin' ? superAdminNavItems : farmAdminNavItems;

  if (user?.role === 'super_admin' && !navItems.some(i => i.name === 'Granjas')) {
      // Safety check, though logic above covers it
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 glass z-30 flex items-center justify-between px-4 border-b border-white/10 bg-slate-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center backdrop-blur-md border border-blue-400/20">
            <LayoutDashboard className="text-blue-400 w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-white">PorciFarm</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 glass border-r border-white/5 flex flex-col transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0 bg-slate-900/95 md:bg-slate-900/80",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <LayoutDashboard className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight text-white tracking-tight">PorciFarm</h2>
              <p className="text-xs text-slate-400 font-medium">{tenant?.name || 'System'}</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                    isActive 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold" 
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300")} />
                  <span className="relative z-10">{item.name}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto text-white/80" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/5">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold capitalize text-slate-300 shadow-sm">
              {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate text-slate-200">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email}
              </p>
              <p className="text-xs text-slate-500 truncate lowercase font-medium">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-500/20 font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span className="">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 transition-all duration-300">
        <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-7xl mx-auto animate-fadeIn">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
