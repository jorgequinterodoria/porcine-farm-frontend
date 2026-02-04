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
    <div className="space-y-8">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Granjas del Sistema</h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona accesos y suscripciones de tus clientes.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary shadow-lg shadow-indigo-500/20 gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Granja
        </button>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 animate-pulse h-48 shadow-sm" />
          ))
        ) : tenants?.map((tenant) => (
          <div 
            key={tenant.id} 
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                <Globe className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${
                  tenant.isActive 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {tenant.isActive ? 'Activo' : 'Inactivo'}
                </span>
                <button className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {tenant.name}
            </h3>
            <p className="text-gray-500 text-sm mt-1 font-mono bg-gray-50 inline-block px-2 py-0.5 rounded">
              {tenant.subdomain}.porcifarm.com
            </p>
            
            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <Users className="w-4 h-4 text-gray-400" />
                {tenant.maxUsers} Usuarios
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium capitalize">
                <LayoutDashboard className="w-4 h-4 text-gray-400" />
                Plan {tenant.subscriptionPlan}
              </div>
            </div>

            <div className="absolute -right-6 -bottom-6 text-gray-50 opacity-[0.4] group-hover:opacity-[0.6] transition-opacity pointer-events-none group-hover:text-indigo-50">
              <Globe className="w-32 h-32 transform rotate-12" />
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

      {}
      {createdCredentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md p-8 rounded-2xl relative shadow-2xl border border-gray-100 animate-scaleIn">
            <button 
              onClick={() => setCreatedCredentials(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 border border-green-100 text-green-600 shadow-sm">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">¡Granja Creada con Éxito!</h3>
              <p className="text-gray-500 mt-2 text-sm max-w-xs mx-auto">
                Copia estas credenciales ahora. Por seguridad, la contraseña no se volverá a mostrar.
              </p>
            </div>

            <div className="space-y-5 bg-gray-50 p-5 rounded-xl border border-gray-200">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Administrador</label>
                <div className="flex items-center justify-between group bg-white p-2.5 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
                  <code className="text-sm font-mono text-gray-900">{createdCredentials.email}</code>
                  <button 
                    onClick={() => copyToClipboard(createdCredentials.email)}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                    title="Copiar Email"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contraseña Temporal</label>
                <div className="flex items-center justify-between group bg-white p-3 rounded-lg border border-gray-200 hover:border-green-300 transition-colors shadow-sm">
                  <code className="text-lg font-mono text-green-700 font-bold tracking-wide">{createdCredentials.password}</code>
                  <button 
                    onClick={() => copyToClipboard(createdCredentials.password)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-all"
                    title="Copiar Contraseña"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setCreatedCredentials(null)}
              className="btn btn-primary w-full mt-8 py-3 text-base shadow-lg shadow-indigo-500/20"
            >
              Entendido, finalizar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};