import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, Users, Layers, Activity } from 'lucide-react';
import api from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

interface TenantSummary {
    id: string;
    name: string;
    subdomain: string;
    subscriptionPlan: string;
    isActive: boolean;
    _count: {
        users: number;
        animals: number;
    };
}

export const SuperAdminDashboard: React.FC = () => {
    const navigate = useNavigate();

    const { data: stats, isLoading } = useQuery({
        queryKey: ['globalStats'],
        queryFn: async () => {
            const response = await api.get('/tenants/stats/global');
            return response.data.data;
        }
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const summary = stats?.summary || { totalTenants: 0, activeTenants: 0, totalUsers: 0, totalAnimals: 0 };
    const tenants: TenantSummary[] = stats?.tenants || [];

    const kpiCards = [
        { 
            name: 'Total Granjas', 
            value: summary.totalTenants, 
            icon: Building2, 
            color: 'text-blue-600', 
            bg: 'bg-blue-50', 
            border: 'border-blue-100' 
        },
        { 
            name: 'Granjas Activas', 
            value: summary.activeTenants, 
            icon: Activity, 
            color: 'text-emerald-600', 
            bg: 'bg-emerald-50', 
            border: 'border-emerald-100' 
        },
        { 
            name: 'Total Usuarios', 
            value: summary.totalUsers, 
            icon: Users, 
            color: 'text-indigo-600', 
            bg: 'bg-indigo-50', 
            border: 'border-indigo-100' 
        },
        { 
            name: 'Total Animales', 
            value: summary.totalAnimals, 
            icon: Layers, 
            color: 'text-amber-600', 
            bg: 'bg-amber-50', 
            border: 'border-amber-100' 
        },
    ];

    return (
        <div className="space-y-8">
            {}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Panel Global</h1>
                    <p className="text-gray-500 text-sm mt-1">Visión general de la plataforma SaaS y métricas globales.</p>
                </div>
                <button 
                    onClick={() => navigate('/tenants')} 
                    className="btn btn-primary shadow-lg shadow-indigo-500/20"
                >
                    Gestionar Inquilinos
                </button>
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiCards.map((stat) => (
                    <div 
                        key={stat.name} 
                        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group"
                    >
                        <div className="flex items-start justify-between">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} ${stat.border} border`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-gray-500 text-sm font-medium">{stat.name}</p>
                            <p className="text-3xl font-bold mt-1 text-gray-900 tabular-nums">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Comparación de Granjas</h3>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                <th className="py-4 pl-6 font-medium">Nombre de Granja</th>
                                <th className="py-4 font-medium">Subdominio</th>
                                <th className="py-4 font-medium">Plan</th>
                                <th className="py-4 font-medium">Usuarios</th>
                                <th className="py-4 font-medium">Animales</th>
                                <th className="py-4 font-medium">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {tenants.map((tenant: TenantSummary) => (
                                <tr key={tenant.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="py-4 pl-6 font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                        {tenant.name}
                                    </td>
                                    <td className="py-4">
                                        <span className="text-sm text-gray-500 font-mono bg-gray-50 px-2 py-0.5 rounded">
                                            {tenant.subdomain}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 capitalize">
                                            {tenant.subscriptionPlan}
                                        </span>
                                    </td>
                                    <td className="py-4 text-sm text-gray-600 font-medium tabular-nums">
                                        {tenant._count.users}
                                    </td>
                                    <td className="py-4 text-sm text-gray-600 font-medium tabular-nums">
                                        {tenant._count.animals}
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${
                                                tenant.isActive ? 'bg-emerald-500' : 'bg-red-500'
                                            }`} />
                                            <span className={`text-sm font-medium ${
                                                tenant.isActive ? 'text-emerald-700' : 'text-red-700'
                                            }`}>
                                                {tenant.isActive ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};