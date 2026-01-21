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
          <h1 className="text-3xl font-bold">Health & Sanity</h1>
          <p className="text-text-dim mt-1">Track treatments, vaccines and health history</p>
        </div>
        <button className="btn btn-primary gap-2">
          <Plus className="w-4 h-4" />
          Add Record
        </button>
      </div>

      <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('records')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'records' ? 'bg-primary text-white shadow-lg' : 'text-text-dim hover:text-text-main'
          }`}
        >
          Clinical Records
        </button>
        <button 
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'catalog' ? 'bg-primary text-white shadow-lg' : 'text-text-dim hover:text-text-main'
          }`}
        >
          Catalogues
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim" />
          <input 
            type="text"
            placeholder="Search records or medicine..."
            className="input pl-10 h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn bg-white/5 border-border hover:bg-white/10 text-text-dim p-2.5">
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
              <History className="w-16 h-16 mx-auto mb-4 text-text-dim/20" />
              <h3 className="text-xl font-bold">No clinical history</h3>
              <p className="text-text-dim mt-1">Register health events to start tracking.</p>
            </div>
          ) : (
            records?.map((record) => (
              <div key={record.id} className="glass p-5 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/10 flex items-center gap-5">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
                  <Activity className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold">{record.diagnosis || 'General Observation'}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      record.status === 'resolved' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-text-dim">
                    <span className="flex items-center gap-1.5 capitalize">
                      <Stethoscope className="w-4 h-4" />
                      Type: Individual
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(record.recordDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button className="text-text-dim hover:text-text-main">
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
              <ShieldCheck className="w-6 h-6 text-primary" />
              <h3 className="font-bold text-lg">Medications</h3>
            </div>
            <div className="space-y-3">
              {isLoadingMeds ? (
                 <div className="animate-pulse h-20 bg-white/5 rounded-xl"></div>
              ) : medications?.map(med => (
                <div key={med.id} className="p-3 bg-white/5 rounded-xl flex items-center justify-between group">
                  <div>
                    <p className="font-medium text-sm">{med.name}</p>
                    <p className="text-xs text-text-dim">{med.presentation || 'Liquid'} - {med.unit || 'ml'}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-dim opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
              <button className="w-full py-2 border border-dashed border-border rounded-xl text-xs text-text-dim hover:border-primary hover:text-primary transition-colors">
                + Add Medication
              </button>
            </div>
          </div>
          {/* Repeat for Vaccines and Diseases */}
        </div>
      )}
    </div>
  );
};
