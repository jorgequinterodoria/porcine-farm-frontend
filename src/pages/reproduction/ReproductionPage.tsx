import React, { useState } from 'react';
import { 
  Plus, 
  Heart,
  Baby,
  CalendarDays,
  ClipboardCheck,
  MoreVertical,
  ArrowRight
} from 'lucide-react';

export const ReproductionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'breeding' | 'pregnancy' | 'farrowing'>('breeding');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Ciclo Reproductivo</h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona eventos de cría, gestación y partos en la granja.</p>
        </div>
        <button className="btn btn-primary shadow-lg shadow-indigo-500/20 gap-2">
          <Plus className="w-4 h-4" />
          Agregar Evento
        </button>
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg w-full md:w-fit overflow-x-auto">
        <button 
          onClick={() => setActiveTab('breeding')}
          className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
            activeTab === 'breeding' 
              ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Celos y Montas
        </button>
        <button 
          onClick={() => setActiveTab('pregnancy')}
          className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
            activeTab === 'pregnancy' 
              ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Gestación
        </button>
        <button 
          onClick={() => setActiveTab('farrowing')}
          className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
            activeTab === 'farrowing' 
              ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Partos
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'breeding' ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md hover:border-rose-200 transition-all group">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 border border-rose-100">
                        <Heart className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Servicio Natural #88</h3>
                        <p className="text-gray-500 text-xs font-mono mt-0.5">ID: P-203</p>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
                        <span className="text-gray-500">Fecha del Evento</span>
                        <span className="font-medium text-gray-900">21/01/2024</span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
                        <span className="text-gray-500">Técnico</span>
                        <span className="font-medium text-gray-900">Juan Pérez</span>
                    </div>
                </div>
                <div className="mt-6 pt-2 flex items-center justify-between">
                    <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full font-medium border border-gray-200">En Progreso</span>
                    <button className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Detalles <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
          ))
        ) : activeTab === 'pregnancy' ? (
          <div className="col-span-full bg-white border border-gray-200 border-dashed p-16 text-center rounded-xl">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardCheck className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No hay gestaciones activas</h3>
            <p className="text-gray-500 mt-1 text-sm max-w-sm mx-auto">
                Las gestaciones confirmadas aparecerán aquí automáticamente después de la confirmación del servicio.
            </p>
          </div>
        ) : (
          [...Array(2)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                        <Baby className="w-5 h-5" />
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-1 rounded transition-colors">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
                <h3 className="font-bold text-lg mb-1 text-gray-900">Parto #F-23</h3>
                <p className="text-xs text-gray-500 mb-5 font-mono">Madre: Sow_A2 (Large White)</p>
                
                <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="bg-emerald-50 p-2 rounded-lg text-center border border-emerald-100">
                        <p className="text-[10px] text-emerald-600 uppercase font-bold tracking-wide">Vivos</p>
                        <p className="text-xl font-bold text-emerald-700">14</p>
                    </div>
                    <div className="bg-rose-50 p-2 rounded-lg text-center border border-rose-100">
                        <p className="text-[10px] text-rose-600 uppercase font-bold tracking-wide">Muertos</p>
                        <p className="text-xl font-bold text-rose-700">1</p>
                    </div>
                    <div className="bg-amber-50 p-2 rounded-lg text-center border border-amber-100">
                        <p className="text-[10px] text-amber-600 uppercase font-bold tracking-wide">Momif.</p>
                        <p className="text-xl font-bold text-amber-700">0</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-medium">Parto el 18 Ene, 2024</span>
                </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};