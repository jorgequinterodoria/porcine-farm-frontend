import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  Stethoscope, 
  Activity,
  Calendar,
  History,
  ShieldCheck,
  MoreVertical,
  Filter,
  Syringe,
  AlertCircle,
  Edit,
  Trash2
} from 'lucide-react';
import { getHealthRecords, getMedications, getVaccines, getDiseases, deleteMedication, deleteVaccine, deleteDisease } from '../../api/health';
import type { Medication, Vaccine, Disease } from '../../types/farm.types';
import { MedicationModal } from '../../components/health/MedicationModal';
import { VaccineModal } from '../../components/health/VaccineModal';
import { DiseaseModal } from '../../components/health/DiseaseModal';
import { HealthRecordModal } from '../../components/health/HealthRecordModal';

export const HealthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'records' | 'catalog'>('records');
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  // Modals state
  const [isHealthRecordModalOpen, setIsHealthRecordModalOpen] = useState(false);
  const [isMedicationModalOpen, setIsMedicationModalOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);

  const [isVaccineModalOpen, setIsVaccineModalOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null);

  const [isDiseaseModalOpen, setIsDiseaseModalOpen] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);

  // Queries
  const { data: records, isLoading: isLoadingRecords } = useQuery({
    queryKey: ['health-records'],
    queryFn: getHealthRecords
  });

  const { data: medications, isLoading: isLoadingMeds } = useQuery({
    queryKey: ['medications'],
    queryFn: getMedications
  });

  const { data: vaccines, isLoading: isLoadingVaccines } = useQuery({
    queryKey: ['vaccines'],
    queryFn: getVaccines
  });

  const { data: diseases, isLoading: isLoadingDiseases } = useQuery({
    queryKey: ['diseases'],
    queryFn: getDiseases
  });

  // Delete mutations
  const deleteMedicationMutation = useMutation({
    mutationFn: deleteMedication,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['medications'] })
  });

  const deleteVaccineMutation = useMutation({
    mutationFn: deleteVaccine,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vaccines'] })
  });

  const deleteDiseaseMutation = useMutation({
    mutationFn: deleteDisease,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['diseases'] })
  });

  const handleDelete = (type: 'medication' | 'vaccine' | 'disease', id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este registro?')) {
        if (type === 'medication') deleteMedicationMutation.mutate(id);
        if (type === 'vaccine') deleteVaccineMutation.mutate(id);
        if (type === 'disease') deleteDiseaseMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Salud y Sanidad</h1>
          <p className="text-gray-500 text-sm mt-1">Rastrea tratamientos, vacunas e historial clínico del ganado.</p>
        </div>
        <button 
          onClick={() => setIsHealthRecordModalOpen(true)}
          className="btn btn-primary shadow-lg shadow-indigo-500/20 gap-2"
        >
          <Plus className="w-4 h-4" />
          Agregar Registro
        </button>
      </div>

      {/* Tabs & Search Container */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        
        {/* Segmented Control Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('records')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'records' 
                ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Historial Clínico
          </button>
          <button 
            onClick={() => setActiveTab('catalog')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'catalog' 
                ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Catálogos
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Buscar registros o medicamentos..."
              className="input pl-9 h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="h-10 w-10 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {activeTab === 'records' ? (
        <div className="space-y-4">
          {isLoadingRecords ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 animate-pulse h-24" />
            ))
          ) : records?.length === 0 ? (
            <div className="bg-white border border-gray-200 border-dashed p-16 text-center rounded-xl">
              <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-bold text-gray-900">Sin historial clínico</h3>
              <p className="text-gray-500 mt-1 text-sm">Registra eventos de salud para comenzar el seguimiento.</p>
            </div>
          ) : (
            records?.map((record) => (
              <div 
                key={record.id} 
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group flex flex-col sm:flex-row sm:items-center gap-5 cursor-pointer"
              >
                <div className="flex items-center gap-5 flex-1">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{record.diagnosis || 'Observación General'}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        record.status === 'resolved' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {record.status === 'resolved' ? 'Resuelto' : 'Pendiente'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5 capitalize">
                        <Stethoscope className="w-4 h-4 text-gray-400" />
                        Individual
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(record.recordDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition-colors self-end sm:self-center">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        /* VISTA DE CATÁLOGOS */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Tarjeta de Medicamentos */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Medicamentos</h3>
            </div>
            
            <div className="space-y-2 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar">
              {isLoadingMeds ? (
                <div className="animate-pulse h-20 bg-gray-50 rounded-xl"></div>
              ) : medications?.map(med => (
                <div key={med.id} className="p-3 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-between group hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{med.commercialName}</p>
                    <p className="text-xs text-gray-500">{med.presentation || 'N/A'}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setSelectedMedication(med); setIsMedicationModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-md shadow-sm">
                        <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete('medication', med.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-md shadow-sm">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
                onClick={() => { setSelectedMedication(null); setIsMedicationModalOpen(true); }}
                className="w-full mt-4 py-2 border border-dashed border-gray-300 rounded-lg text-xs font-medium text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              + Agregar Medicamento
            </button>
          </div>

          {/* Tarjeta Vacunas */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                <Syringe className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Vacunas</h3>
            </div>
            
            <div className="space-y-2 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar">
              {isLoadingVaccines ? (
                <div className="animate-pulse h-20 bg-gray-50 rounded-xl"></div>
              ) : vaccines?.map(vac => (
                <div key={vac.id} className="p-3 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-between group hover:border-teal-200 hover:bg-teal-50/30 transition-colors">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{vac.name}</p>
                    <p className="text-xs text-gray-500">{vac.disease}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setSelectedVaccine(vac); setIsVaccineModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-white rounded-md shadow-sm">
                        <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete('vaccine', vac.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-md shadow-sm">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button 
                onClick={() => { setSelectedVaccine(null); setIsVaccineModalOpen(true); }}
                className="w-full mt-4 py-2 border border-dashed border-gray-300 rounded-lg text-xs font-medium text-gray-500 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
            >
              + Agregar Vacuna
            </button>
          </div>

           {/* Tarjeta Enfermedades */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Enfermedades</h3>
            </div>
            
            <div className="space-y-2 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar">
              {isLoadingDiseases ? (
                <div className="animate-pulse h-20 bg-gray-50 rounded-xl"></div>
              ) : diseases?.map(dis => (
                <div key={dis.id} className="p-3 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-between group hover:border-rose-200 hover:bg-rose-50/30 transition-colors">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{dis.name}</p>
                    <p className="text-xs text-gray-500">{dis.code}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setSelectedDisease(dis); setIsDiseaseModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-white rounded-md shadow-sm">
                        <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete('disease', dis.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-md shadow-sm">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button 
                onClick={() => { setSelectedDisease(null); setIsDiseaseModalOpen(true); }}
                className="w-full mt-4 py-2 border border-dashed border-gray-300 rounded-lg text-xs font-medium text-gray-500 hover:border-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              + Agregar Patología
            </button>
          </div>

        </div>
      )}

      {/* Modals */}
      <MedicationModal 
        isOpen={isMedicationModalOpen} 
        onClose={() => setIsMedicationModalOpen(false)} 
        medication={selectedMedication} 
      />
      <VaccineModal 
        isOpen={isVaccineModalOpen} 
        onClose={() => setIsVaccineModalOpen(false)} 
        vaccine={selectedVaccine} 
      />
      <DiseaseModal 
        isOpen={isDiseaseModalOpen} 
        onClose={() => setIsDiseaseModalOpen(false)} 
        disease={selectedDisease} 
      />
      <HealthRecordModal
        isOpen={isHealthRecordModalOpen}
        onClose={() => setIsHealthRecordModalOpen(false)}
        medications={medications || []}
        diseases={diseases || []}
      />
    </div>
  );
};
