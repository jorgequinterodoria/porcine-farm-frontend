import React from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  Settings, 
  LogOut, 
  ChevronRight,
  Building2,
  Stethoscope,
  CircleDollarSign,
  ClipboardList,
  CalendarDays
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Animals', path: '/animals', icon: Layers },
    { name: 'Batches', path: '/batches', icon: Layers },
    { name: 'Infrastructure', path: '/infrastructure', icon: Building2 },
    { name: 'Sanity', path: '/health', icon: Stethoscope },
    { name: 'Reproduction', path: '/reproduction', icon: CalendarDays },
    { name: 'Financials', path: '/financial', icon: CircleDollarSign },
    { name: 'Operations', path: '/operations', icon: ClipboardList },
  ];

  if (user?.role === 'super_admin') {
    navItems.push({ name: 'Tenants', path: '/tenants', icon: Settings });
  }

  return (
    <div className="flex min-h-screen bg-bg-main text-text-main gradient-bg">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-border flex flex-col fixed h-full z-20">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <LayoutDashboard className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">PorciFarm</h2>
              <p className="text-xs text-text-dim">{tenant?.name || 'System'}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group",
                    isActive 
                      ? "bg-primary text-white" 
                      : "text-text-dim hover:bg-white/5 hover:text-text-main"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-text-dim group-hover:text-text-main")} />
                  <span className="font-medium">{item.name}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-border">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-bold capitalize">
              {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email}
              </p>
              <p className="text-xs text-text-dim truncate lowercase">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-text-dim hover:text-error hover:bg-error/5 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto page-transition">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
