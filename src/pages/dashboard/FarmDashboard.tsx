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
      color: 'text-blue-400'
    },
    { 
      name: 'Lotes Activos', 
      value: batches?.length || 0, 
      change: '+2', 
      trend: 'up', 
      icon: Layers,
      color: 'text-indigo-400'
    },
    { 
      name: 'Alertas Sanitarias', 
      value: '2', 
      change: '-1', 
      trend: 'down', 
      icon: AlertCircle,
      color: 'text-amber-400'
    },
    { 
      name: 'Ganancia Diaria Prom.', 
      value: '840g', 
      change: '+5g', 
      trend: 'up', 
      icon: Activity,
      color: 'text-green-400'
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Resumen de la Granja</h1>
        <p className="text-slate-400 mt-1">Métricas de rendimiento en tiempo real</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="glass p-6 rounded-2xl group hover:border-blue-500/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${
                stat.trend === 'up' ? 'text-green-400' : 'text-amber-400'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-slate-400 text-sm font-medium">{stat.name}</p>
              <p className="text-3xl font-bold mt-1 text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-2xl h-[400px] flex flex-col border border-white/10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white">Rendimiento de Crecimiento</h3>
            <select className="input w-32 h-9 py-0 text-sm">
              <option>Últimos 7 días</option>
              <option>Últimos 30 días</option>
            </select>
          </div>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl text-slate-500">
            El gráfico de análisis de crecimiento se integrará aquí
          </div>
        </div>

        <div className="glass p-8 rounded-2xl h-[400px] flex flex-col border border-white/10">
          <h3 className="text-xl font-bold mb-6 text-white">Actividad Reciente</h3>
          <div className="space-y-6 flex-1 overflow-y-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Lote B-104 movido a Corral #12</p>
                  <p className="text-xs text-slate-400 mt-1">Hace 2 horas • Por Admin</p>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-ghost w-full mt-6 border border-white/10">
            Ver Toda la Actividad
          </button>
        </div>
      </div>
    </div>
  );
};
