import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  Building2, 
  LayoutGrid,
  MoreVertical,
  ChevronRight,
  MapPin,
  Users
} from 'lucide-react';
import api from '../../api/axiosInstance';
import type { Facility, Pen } from '../../types/farm.types';

export const InfrastructurePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'facilities' | 'pens'>('facilities');
  const [search, setSearch] = useState('');

  const { data: facilities, isLoading: isLoadingFacilities } = useQuery({
    queryKey: ['facilities'],
    queryFn: async () => {
      const response = await api.get('/infrastructure/facilities');
      return response.data.data as Facility[];
    }
  });

  const { data: pens, isLoading: isLoadingPens } = useQuery({
    queryKey: ['pens'],
    queryFn: async () => {
      const response = await api.get('/infrastructure/pens');
      return response.data.data as Pen[];
    }
  });

  const filteredFacilities = facilities?.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) || 
    f.code.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPens = pens?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Infraestructura</h1>
          <p className="text-slate-400 mt-1">Gestiona galpones, edificios y corrales</p>
        </div>
        <button className="btn btn-primary gap-2">
          <Plus className="w-4 h-4" />
          Agregar {activeTab === 'facilities' ? 'Instalación' : 'Corral'}
        </button>
      </div>

      <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('facilities')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'facilities' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          Instalaciones
        </button>
        <button 
          onClick={() => setActiveTab('pens')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'pens' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          Corrales
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text"
          placeholder={`Buscar ${activeTab === 'facilities' ? 'instalaciones' : 'corrales'}...`}
          className="input pl-10 h-11"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'facilities' ? (
          isLoadingFacilities ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="glass p-6 rounded-2xl animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-white/10 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-white/10 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-white/10 rounded w-full"></div>
                  <div className="h-4 bg-white/10 rounded w-full"></div>
                </div>
              </div>
            ))
          ) : filteredFacilities?.map((f) => (
            <div key={f.id} className="glass p-6 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{f.name}</h3>
                    <p className="text-slate-400 text-sm font-mono uppercase tracking-wider">{f.code}</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-white">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Corrales</span>
                  <span className="font-medium text-white">{f.pens?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Capacidad</span>
                  <span className="font-medium text-blue-400">{f.capacity || 'N/A'}</span>
                </div>
                
                <div className="pt-4 border-t border-white/5">
                  <button className="w-full flex items-center justify-between text-sm text-slate-400 group-hover:text-blue-400 transition-colors">
                    Ver detalles internos
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          isLoadingPens ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="glass p-6 rounded-2xl animate-pulse">
                <div className="h-6 bg-white/10 rounded w-1/2 mb-4"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-white/10 rounded w-full"></div>
                  <div className="h-4 bg-white/10 rounded w-full"></div>
                </div>
              </div>
            ))
          ) : filteredPens?.map((p) => (
            <div key={p.id} className="glass p-6 rounded-2xl hover:bg-white/5 transition-all group">
               <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-white">{p.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-400 text-sm">ID Instalación: {p.facilityId.slice(0, 8)}...</span>
                  </div>
                </div>
                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-[10px] font-bold uppercase">
                  {p.code}
                </span>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Ocupación</span>
                    <span>{p.currentOccupancy || 0} / {p.capacity}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all" 
                      style={{ width: `${Math.min(((p.currentOccupancy || 0) / p.capacity) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-sm text-slate-400">
                    <Users className="w-4 h-4" />
                    Max: {p.capacity}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-400">
                    <LayoutGrid className="w-4 h-4" />
                    Tipo: Crianza
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {(!isLoadingFacilities && !isLoadingPens && (activeTab === 'facilities' ? filteredFacilities : filteredPens)?.length === 0) && (
        <div className="glass p-12 text-center rounded-3xl">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-slate-400/20" />
          <h3 className="text-xl font-bold text-white">No hay nada aquí todavía</h3>
          <p className="text-slate-400 mt-1">Empieza agregando tu primera {activeTab === 'facilities' ? 'instalación' : 'corral'}.</p>
        </div>
      )}
    </div>
  );
};
