import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Users, Globe, MoreVertical, LayoutDashboard } from 'lucide-react';
import api from '../../api/axiosInstance';
import { TenantForm } from '../../components/tenants/TenantForm';
import type { Tenant, TenantFormData } from '../../types/tenant.types';

export const TenantListPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: tenants, isLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const response = await api.get('/tenants');
      return response.data.data as Tenant[];
    }
  });

  const createTenant = useMutation({
    mutationFn: (data: TenantFormData) => api.post('/tenants', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      setIsFormOpen(false);
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Tenants</h1>
          <p className="text-text-dim mt-1">Manage farms and global administrative access</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary gap-2"
        >
          <Plus className="w-4 h-4" />
          New Farm
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="glass h-48 animate-pulse rounded-2xl" />
          ))
        ) : tenants?.map((tenant) => (
          <div key={tenant.id} className="glass p-6 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Globe className="text-primary w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                  tenant.isActive ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                }`}>
                  {tenant.isActive ? 'Active' : 'Inactive'}
                </span>
                <button className="text-text-dim hover:text-text-main p-1.5 rounded-lg hover:bg-white/5">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <h3 className="text-xl font-bold">{tenant.name}</h3>
            <p className="text-text-dim text-sm mt-1">{tenant.subdomain}.porcifarm.com</p>
            
            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-1.5 text-xs text-text-dim font-medium">
                <Users className="w-4 h-4" />
                {tenant.maxUsers} Users
              </div>
              <div className="flex items-center gap-1.5 text-xs text-text-dim font-medium">
                <LayoutDashboard className="w-4 h-4" />
                {tenant.subscriptionPlan}
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <Globe className="w-32 h-32" />
            </div>
          </div>
        ))}
      </div>

      <TenantForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={(data) => createTenant.mutate(data)}
        isLoading={createTenant.isPending}
      />
    </div>
  );
};
