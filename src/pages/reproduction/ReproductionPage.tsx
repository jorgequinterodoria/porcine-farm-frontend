import React, { useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
import { 
  Plus, 
  Heart,
  Baby,
  CalendarDays,
  ClipboardCheck,
  MoreVertical
} from 'lucide-react';
// import api from '../../api/axiosInstance';
// import type { BreedingService } from '../../types/farm.types';

export const ReproductionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'breeding' | 'pregnancy' | 'farrowing'>('breeding');

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Ciclo Reproductivo</h1>
          <p className="text-slate-400 mt-1">Gestiona eventos de cría, gestación y partos</p>
        </div>
        <button className="btn btn-primary gap-2">
          <Plus className="w-4 h-4" />
          Agregar Evento
        </button>
      </div>

      <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('breeding')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'breeding' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          Celos y Montas
        </button>
        <button 
          onClick={() => setActiveTab('pregnancy')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'pregnancy' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          Gestación
        </button>
        <button 
          onClick={() => setActiveTab('farrowing')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'farrowing' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          Partos
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'breeding' ? (
          // Breeding View
          [...Array(3)].map((_, i) => (
             <div key={i} className="glass p-6 rounded-2xl hover:bg-white/5 transition-all group">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center text-red-500">
                        <Heart className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Servicio Natural #88</h3>
                        <p className="text-slate-400 text-sm">ID Animal: P-203</p>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Fecha</span>
                        <span className="font-medium text-white">21/01/2024</span>
                    </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Técnico</span>
                        <span className="font-medium text-white">Juan Pérez</span>
                    </div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-white/5 text-slate-400 rounded">En Progreso</span>
                    <button className="text-blue-400 hover:underline text-sm font-bold">Detalles</button>
                </div>
             </div>
          ))
        ) : activeTab === 'pregnancy' ? (
          // Pregnancy View
          <div className="col-span-full glass p-12 text-center rounded-3xl">
             <ClipboardCheck className="w-16 h-16 mx-auto mb-4 text-slate-400/20" />
             <h3 className="text-xl font-bold text-white">No hay gestaciones activas</h3>
             <p className="text-slate-400 mt-1">Las gestaciones confirmadas aparecerán aquí después de la confirmación del servicio.</p>
          </div>
        ) : (
          // Farrowing View
          [...Array(2)].map((_, i) => (
            <div key={i} className="glass p-6 rounded-2xl border-l-4 border-green-500">
                <div className="flex justify-between items-start mb-4">
                     <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-green-500">
                        <Baby className="w-5 h-5" />
                    </div>
                    <button className="text-slate-400 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                </div>
                <h3 className="font-bold text-lg mb-1 text-white">Parto #F-23</h3>
                <p className="text-sm text-slate-400 mb-4">Madre: Sow_A2 (Large White)</p>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-white/5 p-2 rounded-lg text-center">
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Vivos</p>
                        <p className="text-lg font-bold text-green-500">14</p>
                    </div>
                     <div className="bg-white/5 p-2 rounded-lg text-center">
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Muertos</p>
                        <p className="text-lg font-bold text-red-500">1</p>
                    </div>
                     <div className="bg-white/5 p-2 rounded-lg text-center">
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Momif.</p>
                        <p className="text-lg font-bold text-amber-500">0</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Parto el 18 Ene, 2024
                </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
