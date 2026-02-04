import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { AnimalListPage } from './pages/animals/AnimalListPage';
import { BatchListPage } from './pages/animals/BatchListPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { TenantListPage } from './pages/tenants/TenantListPage';
import { InfrastructurePage } from './pages/infrastructure/InfrastructurePage';
import { HealthPage } from './pages/health/HealthPage';
import { ReproductionPage } from './pages/reproduction/ReproductionPage';
import { FeedingPage } from './pages/feeding/FeedingPage';
import { FinancialPage } from './pages/financial/FinancialPage';
import { OperationsPage } from './pages/operations/OperationsPage';
import { EmployeeListPage } from './pages/admin/EmployeeListPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { useAuthStore } from './store/useAuthStore';
import './index.css';

const queryClient = new QueryClient();


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  if (!token) return <Navigate to="/login" />;
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<DashboardPage />} />
            
            <Route path="animals" element={<AnimalListPage />} />

            <Route path="batches" element={<BatchListPage />} />
            <Route path="infrastructure" element={<InfrastructurePage />} />
            <Route path="health" element={<HealthPage />} />
            <Route path="reproduction" element={<ReproductionPage />} />
            <Route path="feeding" element={<FeedingPage />} />
            <Route path="financial" element={<FinancialPage />} />
            <Route path="operations" element={<OperationsPage />} />
            <Route path="team" element={<EmployeeListPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="tenants" element={<TenantListPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
