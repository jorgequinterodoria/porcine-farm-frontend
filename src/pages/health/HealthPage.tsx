import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  ChevronRight
} from 'lucide-react';
import api from '../../api/axiosInstance';
import type { HealthRecord, Medication } from '../../types/farm.types';

export const HealthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'records' | 'catalog'>('records');
  const [search, setSearch] = useState('');

  const { data: records, isLoading: isLoadingRecords } = useQuery({
    queryKey: ['health-records'],
    queryFn: async () => {
      const response = await api.get('/health/records');
      return response.data.data as HealthRecord[];
    }
  });

  const { data: medications, isLoading: isLoadingMeds } = useQuery({
    queryKey: ['medications'],
    queryFn: async () => {
      const response = await api.get('/health/medications');
      return response.data.data as Medication[];
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Salud y Sanidad</h1>
          <p className="text-slate-400 mt-1">Rastrea tratamientos, vacunas e historial clínico</p>
        </div>
        <button className="btn btn-primary gap-2">
          <Plus className="w-4 h-4" />
          Agregar Registro
        </button>
      </div>

      <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('records')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'records' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          Historial Clínico
        </button>
        <button 
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'catalog' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          Catálogos
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Buscar registros o medicamentos..."
            className="input pl-10 h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn bg-white/5 border-white/10 hover:bg-white/10 text-slate-400 p-2.5">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {activeTab === 'records' ? (
        <div className="space-y-4">
          {isLoadingRecords ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="glass p-6 rounded-2xl animate-pulse h-24"></div>
            ))
          ) : records?.length === 0 ? (
            <div className="glass p-12 text-center rounded-3xl">
              <History className="w-16 h-16 mx-auto mb-4 text-slate-400/20" />
              <h3 className="text-xl font-bold text-white">Sin historial clínico</h3>
              <p className="text-slate-400 mt-1">Registra eventos de salud para comenzar el seguimiento.</p>
            </div>
          ) : (
            records?.map((record) => (
              <div key={record.id} className="glass p-5 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/10 flex items-center gap-5">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                  <Activity className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white">{record.diagnosis || 'Observación General'}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      record.status === 'resolved' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {record.status === 'resolved' ? 'Resuelto' : 'Pendiente'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1.5 capitalize">
                      <Stethoscope className="w-4 h-4" />
                      Tipo: Individual
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(record.recordDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-white">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
              <h3 className="font-bold text-lg text-white">Medicamentos</h3>
            </div>
            <div className="space-y-3">
              {isLoadingMeds ? (
                 <div className="animate-pulse h-20 bg-white/5 rounded-xl"></div>
              ) : medications?.map(med => (
                <div key={med.id} className="p-3 bg-white/5 rounded-xl flex items-center justify-between group">
                  <div>
                    <p className="font-medium text-sm text-white">{med.name}</p>
                    <p className="text-xs text-slate-400">{med.presentation || 'Líquido'} - {med.unit || 'ml'}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
              <button className="w-full py-2 border border-dashed border-white/10 rounded-xl text-xs text-slate-400 hover:border-blue-400 hover:text-blue-400 transition-colors">
                + Agregar Medicamento
              </button>
            </div>
          </div>
          {/* Repetir para Vacunas y Enfermedades */}
        </div>
      )}
    </div>
  );
};
