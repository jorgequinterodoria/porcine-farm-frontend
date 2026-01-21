import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { SuperAdminDashboard } from './SuperAdminDashboard';
import { FarmDashboard } from './FarmDashboard';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  if (user?.role === 'super_admin') {
    return <SuperAdminDashboard />;
  }

  return <FarmDashboard />;
};
