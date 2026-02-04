import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { 
  getFacilities, 
  getPens, 
  createFacility, 
  createPen 
} from '../../api/infrastructure';
import { FacilityForm } from '../../components/infrastructure/FacilityForm';
import { PenForm } from '../../components/infrastructure/PenForm';
import type { FacilityFormData, PenFormData } from '../../types/infrastructure.types';

export const InfrastructurePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'facilities' | 'pens'>('facilities');
  const [search, setSearch] = useState('');
  
  
  const [isFacilityFormOpen, setIsFacilityFormOpen] = useState(false);
  const [isPenFormOpen, setIsPenFormOpen] = useState(false);

  const queryClient = useQueryClient();

  
  const { data: facilities, isLoading: isLoadingFacilities } = useQuery({
    queryKey: ['facilities'],
    queryFn: getFacilities
  });

  const { data: pens, isLoading: isLoadingPens } = useQuery({
    queryKey: ['pens'],
    queryFn: () => getPens() 
  });

  
  const createFacilityMutation = useMutation({
    mutationFn: createFacility,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      setIsFacilityFormOpen(false);
    }
  });

  const createPenMutation = useMutation({
    mutationFn: createPen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pens'] });
      
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      setIsPenFormOpen(false);
    }
  });

  
  const handleOpenForm = () => {
    if (activeTab === 'facilities') {
      setIsFacilityFormOpen(true);
    } else {
      setIsPenFormOpen(true);
    }
  };

  const handleCreateFacility = (data: FacilityFormData) => {
    createFacilityMutation.mutate({
      ...data,
      
      capacity: Number(data.capacity)
    });
  };

  const handleCreatePen = (data: PenFormData) => {
    createPenMutation.mutate({
      ...data,
      capacity: Number(data.capacity)
    });
  };

  const filteredFacilities = facilities?.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) || 
    f.code.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPens = pens?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Infraestructura</h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona galpones, edificios y corrales de tu granja.</p>
        </div>
        <button 
          onClick={handleOpenForm}
          className="btn btn-primary shadow-lg shadow-indigo-500/20 gap-2"
        >
          <Plus className="w-4 h-4" />
          Agregar {activeTab === 'facilities' ? 'Instalación' : 'Corral'}
        </button>
      </div>

      {}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        
        {}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('facilities')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'facilities' 
                ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Instalaciones
          </button>
          <button 
            onClick={() => setActiveTab('pens')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'pens' 
                ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Corrales
          </button>
        </div>

        {}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder={`Buscar ${activeTab === 'facilities' ? 'instalaciones' : 'corrales'}...`}
            className="input pl-9 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'facilities' ? (
          
          isLoadingFacilities ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                </div>
              </div>
            ))
          ) : filteredFacilities?.map((f) => (
            <div key={f.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md hover:border-indigo-200 transition-all group">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 border border-indigo-100">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{f.name}</h3>
                    <p className="text-gray-400 text-xs font-mono uppercase tracking-wider mt-0.5">{f.code}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-1 rounded transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50">
                  <span className="text-gray-500">Corrales</span>
                  <span className="font-semibold text-gray-900">{f.pens?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50">
                  <span className="text-gray-500">Capacidad Total</span>
                  <span className="font-semibold text-indigo-600">{f.capacity || 'N/A'}</span>
                </div>
                
                <div className="pt-2">
                  <button className="w-full flex items-center justify-between text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors group/btn">
                    Ver detalles internos
                    <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          
          isLoadingPens ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 animate-pulse h-48" />
            ))
          ) : filteredPens?.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md hover:border-indigo-200 transition-all group">
               <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{p.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-500 text-xs">Instalación: {p.facilityId.slice(0, 8)}...</span>
                  </div>
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 border border-gray-200 rounded text-[10px] font-bold uppercase">
                  {p.code}
                </span>
              </div>

              <div className="space-y-5">
                {}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2 font-medium">
                    <span>Ocupación Actual</span>
                    <span className={(p.currentOccupancy ?? 0) >= p.capacity ? "text-red-600" : "text-gray-900"}>
                      {p.currentOccupancy || 0} / {p.capacity}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        (p.currentOccupancy ?? 0) >= p.capacity ? 'bg-red-500' : 'bg-indigo-500'
                      }`} 
                      style={{ width: `${Math.min(((p.currentOccupancy || 0) / p.capacity) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded">
                    <Users className="w-3.5 h-3.5" />
                    Max: {p.capacity}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded">
                    <LayoutGrid className="w-3.5 h-3.5" />
                    Tipo: Crianza
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {}
      {(!isLoadingFacilities && !isLoadingPens && (activeTab === 'facilities' ? filteredFacilities : filteredPens)?.length === 0) && (
        <div className="bg-white border border-gray-200 border-dashed p-16 text-center rounded-xl">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No hay nada aquí todavía</h3>
          <p className="text-gray-500 mt-1 text-sm">Empieza agregando tu primera {activeTab === 'facilities' ? 'instalación' : 'corral'}.</p>
        </div>
      )}

      {}
      <FacilityForm 
        isOpen={isFacilityFormOpen} 
        onClose={() => setIsFacilityFormOpen(false)}
        onSubmit={handleCreateFacility}
        isLoading={createFacilityMutation.isPending}
      />

      <PenForm 
        isOpen={isPenFormOpen} 
        onClose={() => setIsPenFormOpen(false)}
        onSubmit={handleCreatePen}
        isLoading={createPenMutation.isPending}
        facilities={facilities || []}
      />
    </div>
  );
};
