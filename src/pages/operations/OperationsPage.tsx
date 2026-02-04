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
  Bell,
  Filter
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
    <div className="space-y-8">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Centro de Operaciones</h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona tareas diarias, alertas y notificaciones del equipo.</p>
        </div>
        <button className="btn btn-primary shadow-lg shadow-indigo-500/20 gap-2">
          <Plus className="w-4 h-4" />
          Crear Tarea
        </button>
      </div>

      {}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg w-full md:w-fit">
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'tasks' 
              ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Tareas Activas
        </button>
        <button 
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'notifications' 
              ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Notificaciones
        </button>
      </div>

      {activeTab === 'tasks' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {}
            <div className="lg:col-span-2 space-y-4">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Buscar tareas pendientes..." 
                            className="input pl-9 h-10" 
                        />
                    </div>
                    <button className="h-10 w-10 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-3">
                    {isLoadingTasks ? (
                        [...Array(3)].map((_, i) => <div key={i} className="bg-white border border-gray-200 h-20 animate-pulse rounded-xl"></div>)
                    ) : tasks?.length === 0 ? (
                        <div className="bg-white border border-gray-200 border-dashed p-12 text-center rounded-xl">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ClipboardList className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">¡Todo al día!</h3>
                            <p className="text-gray-500 mt-1 text-sm">No tienes tareas pendientes asignadas para hoy.</p>
                        </div>
                    ) : (
                        tasks?.map(task => (
                            <div 
                                key={task.id} 
                                className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between group hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    {}
                                    <div className={`w-1.5 h-10 rounded-full ${
                                        task.priority === 'urgent' ? 'bg-rose-500' : 
                                        task.priority === 'high' ? 'bg-amber-500' : 'bg-blue-500'
                                    }`} />
                                    <div>
                                        <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                            <span className="flex items-center gap-1 capitalize bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                                                <Clock className="w-3 h-3" />
                                                {new Date(task.dueDate).toLocaleDateString()}
                                            </span>
                                            <span className={`flex items-center gap-1 capitalize font-medium ${
                                                task.priority === 'urgent' ? 'text-rose-600' : 
                                                task.priority === 'high' ? 'text-amber-600' : 'text-blue-600'
                                            }`}>
                                                <AlertCircle className="w-3 h-3" />
                                                {task.priority}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all bg-gray-50">
                                        Completar
                                    </button>
                                    <button className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {}
            <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold mb-6 flex items-center gap-2 text-gray-900">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        Progreso del Turno
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Completado</span>
                            <span className="font-bold text-gray-900">64%</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[64%] rounded-full transition-all" />
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Has completado <strong>4 de 6</strong> tareas principales asignadas. ¡Vas por buen camino!
                        </p>
                    </div>
                </div>
            </div>
        </div>
      ) : (
        
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between px-2">
                 <h3 className="font-bold flex items-center gap-2 text-gray-900 text-lg">
                    <Bell className="w-5 h-5 text-indigo-600" />
                    Últimas Alertas
                </h3>
                <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                    Marcar todo como leído
                </button>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-all cursor-pointer group">
                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex-shrink-0 flex items-center justify-center text-indigo-600 border border-indigo-100 group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                Alerta de Inventario: Maíz Bajo Stock
                            </p>
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-gray-500">
                                    El inventario del silo principal ha bajado del 15%.
                                </p>
                                <p className="text-xs text-gray-400 font-medium">Hace 2h</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};