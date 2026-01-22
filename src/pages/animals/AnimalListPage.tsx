import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Rows,
  MapPin
} from 'lucide-react';
import api from '../../api/axiosInstance';
import type { Animal, AnimalFormData } from '../../types/animal.types';
import { AnimalForm } from '../../components/animals/AnimalForm';

export const AnimalListPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: animals, isLoading } = useQuery({
    queryKey: ['animals', statusFilter],
    queryFn: async () => {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await api.get('/animals', { params });
      return response.data.data as Animal[];
    }
  });

  const createAnimal = useMutation({
    mutationFn: (data: AnimalFormData) => api.post('/animals', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals'] });
      setIsFormOpen(false);
    }
  });

  const filteredAnimals = animals?.filter(a => 
    a.internalCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          {/* Título oscuro y subtítulo gris suave */}
          <h1 className="text-2xl font-bold text-gray-900">Inventario de Animales</h1>
          <p className="text-gray-500 mt-1">Gestiona y rastrea el historial de tu ganado</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary gap-2 shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" />
          Agregar Animal
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Buscar por código o ID electrónico..."
            /* Input blanco con borde gris y texto oscuro */
            className="input pl-10 h-11" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select 
            /* Select limpio con fondo blanco */
            className="input h-11 w-40 py-0 cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos los Estados</option>
            <option value="active">Activo</option>
            <option value="quarantine">Cuarentena</option>
            <option value="sold">Vendido</option>
            <option value="deceased">Fallecido</option>
          </select>
        </div>
      </div>

      {/* Tarjeta blanca con borde sutil en lugar de glass oscuro */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            {/* Header gris muy claro con texto oscuro */}
            <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
              <th className="px-6 py-4">Código Interno</th>
              <th className="px-6 py-4">Sexo</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Corral Actual</th>
              <th className="px-6 py-4">Raza</th>
              <th className="px-6 py-4">Creado</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-16"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-20"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-28"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-20"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                  <td className="px-6 py-4"></td>
                </tr>
              ))
            ) : filteredAnimals?.map((animal) => (
              /* Hover gris suave */
              <tr key={animal.id} className="hover:bg-gray-50 transition-colors group cursor-pointer">
                <td className="px-6 py-4 font-bold text-indigo-600 group-hover:text-indigo-700">
                  {animal.internalCode}
                </td>
                <td className="px-6 py-4 capitalize text-gray-700">{animal.sex === 'male' ? 'Macho' : 'Hembra'}</td>
                <td className="px-6 py-4">
                  {/* Badges estilo pastel (fondo claro, texto oscuro) */}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    animal.currentStatus === 'active' 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {animal.currentStatus === 'active' ? 'Activo' : animal.currentStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {animal.currentPenId ? 'Corral #4' : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{animal.breed?.name || 'Estándar'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(animal.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {!isLoading && filteredAnimals?.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            <Rows className="w-12 h-12 mx-auto mb-4 opacity-20 text-gray-300" />
            <p className="text-lg font-medium text-gray-900">No se encontraron animales</p>
            <p className="text-sm mt-1 text-gray-500">Intenta ajustar tus filtros o términos de búsqueda</p>
          </div>
        )}
      </div>

      <AnimalForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={(data) => createAnimal.mutate(data)}
        isLoading={createAnimal.isPending}
      />
    </div>
  );
};