import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  Bell
} from 'lucide-react';
import api from '../../api/axiosInstance';
import type { Task } from '../../types/management.types';

export const OperationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'notifications'>('tasks');

  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await api.get('/operations/tasks');
      return response.data.data as Task[];
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Operaciones</h1>
          <p className="text-slate-400 mt-1">Gestiona tareas de la granja, alertas y notificaciones</p>
        </div>
        <button className="btn btn-primary gap-2">
          <Plus className="w-4 h-4" />
          Crear Tarea
        </button>
      </div>

       <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'tasks' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          Tareas Activas
        </button>
        <button 
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'notifications' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          Notificaciones
        </button>
      </div>

      {activeTab === 'tasks' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" placeholder="Buscar tareas..." className="input pl-10 h-11" />
                </div>

                <div className="space-y-3">
                    {isLoadingTasks ? (
                        [...Array(3)].map((_, i) => <div key={i} className="glass h-20 animate-pulse rounded-2xl"></div>)
                    ) : tasks?.length === 0 ? (
                        <div className="glass p-12 text-center rounded-3xl">
                            <ClipboardList className="w-16 h-16 mx-auto mb-4 text-slate-400/20" />
                            <h3 className="text-xl font-bold text-white">¡Espacio de trabajo limpio!</h3>
                            <p className="text-slate-400 mt-1">No tienes tareas pendientes para hoy.</p>
                        </div>
                    ) : (
                        tasks?.map(task => (
                            <div key={task.id} className="glass p-4 rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-10 rounded-full ${
                                        task.priority === 'urgent' ? 'bg-red-500' : 
                                        task.priority === 'high' ? 'bg-amber-500' : 'bg-blue-500'
                                    }`} />
                                    <div>
                                        <h4 className="font-bold text-white">{task.title}</h4>
                                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                                            <span className="flex items-center gap-1 capitalize">
                                                <Clock className="w-3 h-3" />
                                                Vence: {new Date(task.dueDate).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1 capitalize">
                                                <AlertCircle className="w-3 h-3" />
                                                Prioridad: {task.priority}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="btn btn-outline text-[10px] h-8 min-h-0 py-1">Completar</button>
                                    <button className="text-slate-400 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <div className="glass p-6 rounded-2xl">
                    <h3 className="font-bold mb-4 flex items-center gap-2 text-white">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        Progreso de Hoy
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400 text-xs font-bold uppercase">Tasa de Finalización</span>
                            <span className="font-bold text-white">64%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-green-400 w-[64%] shadow-[0_0_10px_rgba(74,222,128,0.3)] transition-all" />
                        </div>
                        <p className="text-[10px] text-slate-400">4 de 6 tareas principales completadas en este turno.</p>
                    </div>
                </div>
            </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-between px-2">
                 <h3 className="font-bold flex items-center gap-2 text-white">
                    <Bell className="w-5 h-5 text-blue-400" />
                    Últimas Alertas
                </h3>
                <button className="text-xs text-blue-400 hover:underline">Marcar todo como leído</button>
            </div>
            {[...Array(4)].map((_, i) => (
                <div key={i} className="glass p-4 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-all cursor-pointer">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Alerta de Inventario: Maíz Bajo Stock</p>
                        <p className="text-xs text-slate-400 uppercase mt-0.5">Hace 2 horas</p>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};
