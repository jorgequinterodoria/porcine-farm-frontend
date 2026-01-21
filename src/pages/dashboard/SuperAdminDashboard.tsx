import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, Users, Layers, Activity } from 'lucide-react';
import api from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const summary = stats?.summary || { totalTenants: 0, activeTenants: 0, totalUsers: 0, totalAnimals: 0 };
    const tenants = stats?.tenants || [];

    const kpiCards = [
        { name: 'Total Farms', value: summary.totalTenants, icon: Building2, color: 'text-blue-400' },
        { name: 'Active Farms', value: summary.activeTenants, icon: Activity, color: 'text-green-400' },
        { name: 'Total Users', value: summary.totalUsers, icon: Users, color: 'text-indigo-400' },
        { name: 'Total Animals', value: summary.totalAnimals, icon: Layers, color: 'text-amber-400' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Global Dashboard</h1>
                    <p className="text-slate-400 mt-1">SaaS Platform Overview</p>
                </div>
                <button onClick={() => navigate('/tenants')} className="btn btn-primary">
                    Manage Tenants
                </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiCards.map((stat) => (
                    <div key={stat.name} className="glass p-6 rounded-2xl group hover:border-blue-500/50 transition-colors">
                        <div className="flex items-start justify-between">
                            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-slate-400 text-sm font-medium">{stat.name}</p>
                            <p className="text-3xl font-bold mt-1 text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Comparison Table */}
            <div className="glass p-8 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold mb-6 text-white">Farm Comparison</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-slate-400 text-sm">
                                <th className="pb-4 pl-4 font-medium">Farm Name</th>
                                <th className="pb-4 font-medium">Subdomain</th>
                                <th className="pb-4 font-medium">Plan</th>
                                <th className="pb-4 font-medium">Users</th>
                                <th className="pb-4 font-medium">Animals</th>
                                <th className="pb-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {tenants.map((tenant: any) => (
                                <tr key={tenant.id} className="text-slate-300 hover:bg-white/5 transition-colors">
                                    <td className="py-4 pl-4 font-medium text-white">{tenant.name}</td>
                                    <td className="py-4 text-slate-400">{tenant.subdomain}</td>
                                    <td className="py-4">
                                        <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 capitalize text-xs font-medium">
                                            {tenant.subscriptionPlan}
                                        </span>
                                    </td>
                                    <td className="py-4">{tenant._count.users}</td>
                                    <td className="py-4">{tenant._count.animals}</td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${tenant.isActive ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'bg-red-400'}`} />
                                            <span className={tenant.isActive ? 'text-green-400' : 'text-red-400'}>
                                                {tenant.isActive ? 'Active' : 'Inactive'}
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
