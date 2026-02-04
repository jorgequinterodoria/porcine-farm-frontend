import React, { useState, useMemo } from 'react';
import { withObservables } from '@nozbe/watermelondb/react';
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

// WatermelonDB Imports
import { database } from '../../db';
import { Facility, Pen } from '../../db/models';
import type { FacilityFormData, PenFormData } from '../../types/infrastructure.types';

// Components
import { FacilityForm } from '../../components/infrastructure/FacilityForm';
import { PenForm } from '../../components/infrastructure/PenForm';

interface InfrastructurePageProps {
  facilities: Facility[];
  pens: Pen[];
}

const InfrastructurePageComponent: React.FC<InfrastructurePageProps> = ({ facilities, pens }) => {
  const [activeTab, setActiveTab] = useState<'facilities' | 'pens'>('facilities');
  const [search, setSearch] = useState('');
  
  const [isFacilityFormOpen, setIsFacilityFormOpen] = useState(false);
  const [isPenFormOpen, setIsPenFormOpen] = useState(false);

  const handleOpenForm = () => {
    if (activeTab === 'facilities') {
      setIsFacilityFormOpen(true);
    } else {
      setIsPenFormOpen(true);
    }
  };

  // 🔥 CORE: Crear Facility
  const handleCreateFacility = async (data: FacilityFormData) => {
    try {
      await database.write(async () => {
        await database.collections.get<Facility>('facilities').create(facility => {
            facility.name = data.name;
            facility.code = data.code;
            facility.facilityType = data.facilityType;
            facility.capacity = Number(data.capacity) || 0;
            // facility.areaSqm = Number(data.areaSqm) || 0; // Si el form lo envía
            facility.isActive = true;
        });
      });
      setIsFacilityFormOpen(false);
    } catch (error) {
      console.error('Error creating facility:', error);
      alert('Error al guardar la instalación');
    }
  };

  // 🔥 CORE: Crear Pen
  const handleCreatePen = async (data: PenFormData) => {
    try {
      await database.write(async () => {
        await database.collections.get<Pen>('pens').create(pen => {
            pen.name = data.name;
            pen.code = data.code;
            pen.facilityId = data.facilityId;
            pen.capacity = Number(data.capacity) || 0;
            // pen.areaSqm = Number(data.areaSqm) || 0;
            pen.isActive = true;
        });
      });
      setIsPenFormOpen(false);
    } catch (error) {
      console.error('Error creating pen:', error);
      alert('Error al guardar el corral');
    }
  };

  // --- Filtrado ---
  const filteredFacilities = useMemo(() => 
    facilities.filter(f => 
      f.name.toLowerCase().includes(search.toLowerCase()) || 
      f.code.toLowerCase().includes(search.toLowerCase())
    ), [facilities, search]);

  const filteredPens = useMemo(() => 
    pens.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.code.toLowerCase().includes(search.toLowerCase())
    ), [pens, search]);

  // Helper para contar corrales por facility (ya que tenemos todos los pens)
  const getPensCount = (facilityId: string) => {
      return pens.filter(p => p.facilityId === facilityId).length;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
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

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
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

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'facilities' ? (
          filteredFacilities.map((f) => (
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
                  <span className="font-semibold text-gray-900">{getPensCount(f.id)}</span>
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
          filteredPens.map((p) => (
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
                {/* Ocupación Visual (Placeholder, requiere lógica real de animales) */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2 font-medium">
                    <span>Ocupación Actual</span>
                    <span className="text-gray-900">
                      0 / {p.capacity}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-indigo-500 transition-all duration-500" 
                      style={{ width: '0%' }}
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

      {/* Empty State */}
      {((activeTab === 'facilities' ? filteredFacilities : filteredPens).length === 0) && (
        <div className="bg-white border border-gray-200 border-dashed p-16 text-center rounded-xl">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No hay nada aquí todavía</h3>
          <p className="text-gray-500 mt-1 text-sm">Empieza agregando tu primera {activeTab === 'facilities' ? 'instalación' : 'corral'}.</p>
        </div>
      )}

      <FacilityForm 
        isOpen={isFacilityFormOpen} 
        onClose={() => setIsFacilityFormOpen(false)}
        onSubmit={handleCreateFacility}
      />

      <PenForm 
        isOpen={isPenFormOpen} 
        onClose={() => setIsPenFormOpen(false)}
        onSubmit={handleCreatePen}
        // Pasamos facilities como prop al formulario para el select
        facilities={facilities}
      />
    </div>
  );
};

const enhance = withObservables([], () => ({
  facilities: database.collections.get<Facility>('facilities').query(),
  pens: database.collections.get<Pen>('pens').query(),
}));

export const InfrastructurePage = enhance(InfrastructurePageComponent);
