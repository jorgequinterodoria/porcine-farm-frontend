import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Users, Globe, MoreVertical, LayoutDashboard, Copy, CheckCircle, X } from 'lucide-react';
import api from '../../api/axiosInstance';
import { TenantForm } from '../../components/tenants/TenantForm';
import type { Tenant, TenantFormData } from '../../types/tenant.types';

export const TenantListPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{email: string, password: string} | null>(null);
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
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      setIsFormOpen(false);
      // Capture credentials from response
      if (response.data.data.password) {
        setCreatedCredentials({
          email: variables.adminEmail,
          password: response.data.data.password
        });
      }
    }
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">System Tenants</h1>
          <p className="text-slate-400 mt-1">Manage farms and global administrative access</p>
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
          <div key={tenant.id} className="glass p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                <Globe className="text-blue-400 w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${
                  tenant.isActive 
                    ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  {tenant.isActive ? 'Active' : 'Inactive'}
                </span>
                <button className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-white">{tenant.name}</h3>
            <p className="text-slate-400 text-sm mt-1">{tenant.subdomain}.porcifarm.com</p>
            
            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Users className="w-4 h-4" />
                {tenant.maxUsers} Users
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium capitalize">
                <LayoutDashboard className="w-4 h-4" />
                {tenant.subscriptionPlan}
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
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

      {/* Credentials Modal */}
      {createdCredentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="glass w-full max-w-md p-6 rounded-2xl relative animate-scaleIn border border-green-500/20">
            <button 
              onClick={() => setCreatedCredentials(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Farm Created!</h3>
              <p className="text-slate-400 mt-2 text-sm">
                Please copy these credentials safely. The password will not be shown again.
              </p>
            </div>

            <div className="space-y-4 bg-slate-950/50 p-4 rounded-xl border border-white/5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Admin Email</label>
                <div className="flex items-center justify-between group">
                  <code className="text-sm font-mono text-white">{createdCredentials.email}</code>
                  <button 
                    onClick={() => copyToClipboard(createdCredentials.email)}
                    className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Copiar Correo Electrónico"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="h-px bg-white/5" />

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Contraseña Temporal</label>
                <div className="flex items-center justify-between group bg-slate-900/50 p-3 rounded-lg border border-white/5">
                  <code className="text-lg font-mono text-green-400 font-bold tracking-wide">{createdCredentials.password}</code>
                  <button 
                    onClick={() => copyToClipboard(createdCredentials.password)}
                    className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all"
                    title="Copy Password"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setCreatedCredentials(null)}
              className="btn btn-primary w-full mt-6"
            >
              Hecho
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
