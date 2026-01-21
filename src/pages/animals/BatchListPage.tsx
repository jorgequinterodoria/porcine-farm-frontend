import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  Layers, 
  Calendar, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import api from '../../api/axiosInstance';

interface Batch {
  id: string;
  code: string;
  name: string;
  batchType: string;
  startDate: string;
  currentCount: number;
}

export const BatchListPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const { data: batches, isLoading } = useQuery({
    queryKey: ['batches'],
    queryFn: async () => {
      const response = await api.get('/batches');
      return response.data.data as Batch[];
    }
  });

  const filteredBatches = batches?.filter((b) => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    b.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Lotes</h1>
          <p className="text-slate-400 mt-1">Agrupa y rastrea animales por ciclo de producción</p>
        </div>
        <button className="btn btn-primary gap-2">
          <Plus className="w-4 h-4" />
          Crear Lote
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text"
          placeholder="Buscar lotes por nombre o código..."
          className="input pl-10 h-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="glass h-40 animate-pulse rounded-2xl" />
          ))
        ) : filteredBatches?.map((batch) => (
          <div key={batch.id} className="glass p-6 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer group">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{batch.batchType}</span>
                  <div className="w-1 h-1 rounded-full bg-slate-500" />
                  <span className="text-xs text-slate-500">{batch.code}</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{batch.name}</h3>
              </div>
              <div className="bg-white/5 p-2 rounded-lg">
                <Layers className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div className="text-xs">
                  <p className="text-slate-400">Iniciado</p>
                  <p className="font-medium text-white">{new Date(batch.startDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-slate-400" />
                <div className="text-xs">
                  <p className="text-slate-400">Animales</p>
                  <p className="font-medium text-lg text-white">{batch.currentCount || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-end">
              <span className="text-xs font-medium text-blue-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                Ver Detalles <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {!isLoading && filteredBatches?.length === 0 && (
        <div className="p-12 text-center glass rounded-2xl">
          <Layers className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium text-white">No se encontraron lotes</p>
        </div>
      )}
    </div>
  );
};
