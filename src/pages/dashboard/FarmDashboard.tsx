import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Rows, 
  Layers, 
  Activity, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import api from '../../api/axiosInstance';

export const FarmDashboard: React.FC = () => {
  const { data: animals } = useQuery({
    queryKey: ['animals'],
    queryFn: async () => {
      const response = await api.get('/animals');
      return response.data.data;
    }
  });

  const { data: batches } = useQuery({
    queryKey: ['batches'],
    queryFn: async () => {
      const response = await api.get('/batches');
      return response.data.data;
    }
  });

  const stats = [
    { 
      name: 'Total de Animales', 
      value: animals?.length || 0, 
      change: '+12%', 
      trend: 'up', 
      icon: Rows,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100'
    },
    { 
      name: 'Lotes Activos', 
      value: batches?.length || 0, 
      change: '+2', 
      trend: 'up', 
      icon: Layers,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-100'
    },
    { 
      name: 'Alertas Sanitarias', 
      value: '2', 
      change: '-1', 
      trend: 'down', 
      icon: AlertCircle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100'
    },
    { 
      name: 'Ganancia Diaria Prom.', 
      value: '840g', 
      change: '+5g', 
      trend: 'up', 
      icon: Activity,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Resumen de la Granja</h1>
        <p className="text-gray-500 mt-1 text-sm">Métricas de rendimiento y actividad en tiempo real.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div 
            key={stat.name} 
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} ${stat.border} border`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border ${
                stat.trend === 'up' 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                  : 'bg-amber-50 text-amber-600 border-amber-100'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-500 text-sm font-medium">{stat.name}</p>
              <p className="text-3xl font-bold mt-1 text-gray-900 tabular-nums">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Growth Performance Chart (Placeholder) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Rendimiento de Crecimiento</h3>
            <select className="input h-9 py-0 text-sm w-40 bg-gray-50 border-gray-200">
              <option>Últimos 7 días</option>
              <option>Últimos 30 días</option>
            </select>
          </div>
          <div className="flex-1 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
            El gráfico de análisis de crecimiento se integrará aquí
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-[400px]">
          <h3 className="text-lg font-bold mb-6 text-gray-900">Actividad Reciente</h3>
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="relative mt-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-50 group-hover:ring-indigo-100 transition-all" />
                    {i !== 3 && <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-full bg-gray-100 -mb-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                    Lote B-104 movido a Corral #12
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Hace 2 horas • Por <span className="font-medium text-gray-700">Admin</span></p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-gray-900 rounded-lg border border-gray-200 transition-colors">
            Ver Toda la Actividad
          </button>
        </div>
      </div>
    </div>
  );
};