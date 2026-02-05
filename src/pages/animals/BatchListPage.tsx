import React, { useState, useMemo } from 'react';
import { withObservables } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb';
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


import { database } from '../../db';
import { Batch } from '../../db/models';
import type { BatchFormData } from '../../types/batch.types';


import { BatchForm } from '../../components/batches/BatchForm';

interface BatchListPageProps {
  batches: Batch[];
}

const BatchListPageComponent: React.FC<BatchListPageProps> = ({ batches }) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<BatchFormData & { id?: string } | null>(null);

  
  const filteredBatches = useMemo(() => {
    return batches.filter(batch => {
      const matchesSearch = 
        batch.name.toLowerCase().includes(search.toLowerCase()) || 
        batch.code.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [batches, search]);

  const handleCreate = () => {
    setSelectedBatch(null);
    setIsModalOpen(true);
  };

  const handleEdit = (batch: Batch) => {
    const batchData: BatchFormData & { id: string } = {
      id: batch.id,
      code: batch.code,
      name: batch.name,
      batchType: batch.batchType as BatchFormData['batchType'],
      status: batch.status as BatchFormData['status'],
      startDate: new Date(batch.startDate).toISOString().split('T')[0],
      expectedEndDate: batch.expectedEndDate ? new Date(batch.expectedEndDate).toISOString().split('T')[0] : '',
      actualEndDate: batch.actualEndDate ? new Date(batch.actualEndDate).toISOString().split('T')[0] : '',
      initialCount: batch.initialCount || 0,
      currentCount: batch.currentCount || 0,
      targetWeight: batch.targetWeight || 0,
      notes: batch.notes || '',
    };
    setSelectedBatch(batchData);
    setIsModalOpen(true);
  };

  
  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este lote?')) return;

    try {
      await database.write(async () => {
        const batch = await database.collections.get<Batch>('batches').find(id);
        await batch.markAsDeleted();
      });
    } catch (error) {
      console.error('Error al eliminar lote:', error);
      alert('Error al eliminar el lote');
    }
  };

  
  const handleSubmit = async (data: BatchFormData) => {
    try {
      await database.write(async () => {
        const collection = database.collections.get<Batch>('batches');

        if (selectedBatch?.id) {
          
          const batch = await collection.find(selectedBatch.id);
          await batch.update(b => {
            updateBatchFields(b, data);
          });
        } else {
          
          await collection.create(b => {
            updateBatchFields(b, data);
          });
        }
      });
      setIsModalOpen(false);
      setSelectedBatch(null);
    } catch (error) {
      console.error('Error al guardar lote:', error);
      alert('Error al guardar en base de datos local');
    }
  };

  const updateBatchFields = (batch: Batch, data: BatchFormData) => {
    batch.code = data.code;
    batch.name = data.name;
    batch.batchType = data.batchType;
    batch.status = data.status;
    batch.startDate = new Date(data.startDate).getTime();
    batch.expectedEndDate = data.expectedEndDate ? new Date(data.expectedEndDate).getTime() : undefined;
    batch.initialCount = Number(data.initialCount) || 0;
    batch.currentCount = Number(data.currentCount) || 0;
    batch.targetWeight = Number(data.targetWeight) || 0;
    batch.notes = data.notes || '';
    
    if (data.actualEndDate) batch.actualEndDate = new Date(data.actualEndDate).getTime();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Lotes de Producción</h1>
          <p className="text-gray-500 text-sm mt-1">
            {batches.length} lotes registrados. Agrupa y rastrea animales por ciclo productivo.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="btn btn-primary shadow-lg shadow-indigo-500/20 gap-2"
        >
          <Plus className="w-4 h-4" />
          Crear Lote
        </button>
      </div>

      {}
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

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBatches.map((batch) => (
          <div
            key={batch.id}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all group relative overflow-hidden cursor-pointer"
            onClick={() => handleEdit(batch)}
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

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
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

      {filteredBatches.length === 0 && (
        <div className="p-16 text-center bg-white border border-gray-200 border-dashed rounded-xl">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Layers className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No se encontraron lotes</h3>
          <p className="text-sm text-gray-500 mt-1">
            {batches.length === 0 ? 'La base de datos está vacía.' : 'Intenta ajustar tu búsqueda o crea un nuevo lote.'}
          </p>
        </div>
      )}

      <BatchForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedBatch}
      />
    </div>
  );
};

const enhance = withObservables([], () => ({
  batches: database.collections.get<Batch>('batches').query(
    Q.sortBy('created_at', Q.desc)
  ),
}));

export const BatchListPage = enhance(BatchListPageComponent);
