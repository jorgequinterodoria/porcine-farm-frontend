import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  Layers, 
  Calendar, 
  ChevronRight,
  TrendingUp,
  Edit,
  Trash2
} from 'lucide-react';
import { getBatches, createBatch, updateBatch, deleteBatch } from '../../api/batches';
import type { Batch, BatchFormData } from '../../types/batch.types';
import { BatchForm } from '../../components/batches/BatchForm';

export const BatchListPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<BatchFormData & { id?: string } | null>(null);

  const queryClient = useQueryClient();

  const { data: batches, isLoading } = useQuery({
    queryKey: ['batches'],
    queryFn: () => getBatches()
  });

  const createMutation = useMutation({
    mutationFn: createBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      setIsModalOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: BatchFormData) => updateBatch(selectedBatch!.id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      setIsModalOpen(false);
      setSelectedBatch(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    }
  });

  const handleCreate = () => {
    setSelectedBatch(null);
    setIsModalOpen(true);
  };

  const handleEdit = (batch: Batch) => {
    // Map Batch to BatchFormData structure if needed, or cast if compatible
    // Batch has extra fields (id, createdAt, etc.) which is fine, form ignores them usually or we filter
    // We need to ensure types match for the form default values
    const batchData: BatchFormData & { id: string } = {
        id: batch.id,
        code: batch.code,
        name: batch.name,
        batchType: batch.batchType as BatchFormData['batchType'],
        status: batch.status as BatchFormData['status'],
        startDate: batch.startDate,
        expectedEndDate: batch.expectedEndDate,
        actualEndDate: batch.actualEndDate,
        initialCount: batch.initialCount,
        currentCount: batch.currentCount,
        targetWeight: batch.targetWeight,
        notes: '', // If notes are not in Batch interface from list, might be missing. 
                   // The API response for list might not include notes. 
                   // If we need notes, we might need to fetch details or assume empty.
                   // For now, let's assume empty or mapped if available.
    };
    setSelectedBatch(batchData);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este lote?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (data: BatchFormData) => {
    if (selectedBatch?.id) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredBatches = batches?.filter((b) => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    b.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Lotes de Producción</h1>
          <p className="text-gray-500 text-sm mt-1">Agrupa y rastrea animales por ciclo productivo.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="btn btn-primary shadow-lg shadow-indigo-500/20 gap-2"
        >
          <Plus className="w-4 h-4" />
          Crear Lote
        </button>
      </div>

      {/* Search Section */}
      <div className="relative max-w-lg">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input 
          type="text"
          placeholder="Buscar lotes por nombre o código..."
          className="input pl-10 h-11"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Skeleton Loading (Clean Style)
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-white rounded-xl border border-gray-200 animate-pulse shadow-sm" />
          ))
        ) : filteredBatches?.map((batch) => (
          // Batch Card
          <div 
            key={batch.id} 
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all group relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    batch.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 
                    batch.status === 'closed' ? 'bg-gray-50 text-gray-700 border-gray-100' :
                    'bg-indigo-50 text-indigo-700 border-indigo-100'
                  }`}>
                    {batch.batchType}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{batch.code}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {batch.name}
                </h3>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={(e) => { e.stopPropagation(); handleEdit(batch); }}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Editar"
                >
                    <Edit className="w-4 h-4" />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(batch.id); }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 cursor-pointer" onClick={() => handleEdit(batch)}>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 uppercase font-semibold tracking-wide">
                  <Calendar className="w-3.5 h-3.5" />
                  Iniciado
                </div>
                <p className="font-medium text-gray-900 pl-5">
                  {new Date(batch.startDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 uppercase font-semibold tracking-wide">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Animales
                </div>
                <p className="font-bold text-lg text-gray-900 pl-5">
                  {batch.currentCount || 0}
                </p>
              </div>
            </div>
            
            <div className="absolute bottom-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 pointer-events-none">
               <ChevronRight className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty State */}
      {!isLoading && filteredBatches?.length === 0 && (
        <div className="p-16 text-center bg-white border border-gray-200 border-dashed rounded-xl">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Layers className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No se encontraron lotes</h3>
          <p className="text-sm text-gray-500 mt-1">
            Intenta ajustar tu búsqueda o crea un nuevo lote de producción.
          </p>
        </div>
      )}

      <BatchForm 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
        initialData={selectedBatch}
      />
    </div>
  );
};
