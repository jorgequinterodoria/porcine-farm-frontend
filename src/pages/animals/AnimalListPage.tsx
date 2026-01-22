import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Rows,
  MapPin,
  Pencil,
  Trash2,
  Eye
} from 'lucide-react';
import api from '../../api/axiosInstance';
import { getPens } from '../../api/infrastructure';
import { updateAnimal } from '../../api/animals';
import type { Animal, AnimalFormData } from '../../types/animal.types';
import { AnimalForm } from '../../components/animals/AnimalForm';
import { AnimalDetailsModal } from '../../components/animals/AnimalDetailsModal';

export const AnimalListPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: animals, isLoading } = useQuery({
    queryKey: ['animals', statusFilter],
    queryFn: async () => {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await api.get('/animals', { params });
      return response.data.data as Animal[];
    }
  });

  const { data: pens } = useQuery({
    queryKey: ['pens'],
    queryFn: () => getPens(),
  });

  const createAnimalMutation = useMutation({
    mutationFn: (data: AnimalFormData) => api.post('/animals', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals'] });
      handleCloseForm();
    }
  });

  const updateAnimalMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AnimalFormData> }) =>
      updateAnimal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals'] });
      handleCloseForm();
    }
  });

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAnimal(null);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedAnimal(null);
  };

  const handleEditClick = (animal: Animal) => {
    setEditingAnimal(animal);
    setOpenMenuId(null);
    setIsFormOpen(true);
  };

  const handleViewDetails = (animal: Animal) => {
    setSelectedAnimal(animal);
    setOpenMenuId(null);
    setIsDetailsOpen(true);
  };

  const handleFormSubmit = (data: AnimalFormData) => {
    // Transformar cadenas vacías a undefined para evitar errores de UUID en el backend
    const sanitizedData = {
      ...data,
      currentPenId: data.currentPenId || undefined,
      breedId: data.breedId || undefined,
      motherId: data.motherId || undefined,
      fatherId: data.fatherId || undefined,
    };

    if (editingAnimal) {
      updateAnimalMutation.mutate({ id: editingAnimal.id, data: sanitizedData });
    } else {
      createAnimalMutation.mutate(sanitizedData);
    }
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Cerrar menú al hacer clic fuera
  React.useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const filteredAnimals = animals?.filter(a =>
    a.internalCode.toLowerCase().includes(search.toLowerCase())
  );

  const statusMap: Record<string, { label: string; className: string }> = {
    active: { label: 'Activo', className: 'bg-green-50 text-green-700 border-green-200' },
    quarantine: { label: 'Cuarentena', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    sold: { label: 'Vendido', className: 'bg-gray-50 text-gray-700 border-gray-200' },
    deceased: { label: 'Fallecido', className: 'bg-red-50 text-red-700 border-red-200' },
    sick: { label: 'Enfermo', className: 'bg-orange-50 text-orange-700 border-orange-200' },
  };

  const stageMap: Record<string, { label: string; className: string }> = {
    piglet: { label: 'Lechón', className: 'bg-pink-50 text-pink-700 border-pink-200' },
    nursery: { label: 'Cría', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    fattening: { label: 'Engorde', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    breeding: { label: 'Reproducción', className: 'bg-purple-50 text-purple-700 border-purple-200' },
  };

  const getStatusInfo = (status: string) => {
    return statusMap[status] || { label: status, className: 'bg-gray-50 text-gray-700 border-gray-200' };
  };

  const getStageInfo = (stage: string) => {
    return stageMap[stage] || { label: stage || 'Sin definir', className: 'bg-gray-50 text-gray-700 border-gray-200' };
  };

  const getPenCode = (penId?: string | null) => {
    if (!penId) return 'Sin asignar';
    const pen = pens?.find(p => p.id === penId);
    return pen ? pen.code : 'No encontrado';
  };

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
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            {/* Header gris muy claro con texto oscuro */}
            <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
              <th className="px-6 py-4">Código Interno</th>
              <th className="px-6 py-4">Sexo</th>
              <th className="px-6 py-4">Peso (kg)</th>
              <th className="px-6 py-4">Corral</th>
              <th className="px-6 py-4">Edad</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-16"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-20"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-16"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-20"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-16"></div></td>
                  <td className="px-6 py-4"></td>
                </tr>
              ))
            ) : filteredAnimals?.map((animal) => (
              /* Hover gris suave */
              <tr key={animal.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4 font-bold text-indigo-600 group-hover:text-indigo-700">
                  {animal.internalCode}
                </td>
                <td className="px-6 py-4 capitalize text-gray-700">{animal.sex === 'male' ? 'Macho' : 'Hembra'}</td>
                <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                  {animal.birthWeight ? `${animal.birthWeight} kg` : '-'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {/* Aquí idealmente mostraríamos el nombre del corral si viniera en el objeto animal, por ahora mostramos si está asignado o no */}
                    {getPenCode(animal.currentPenId)}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {/* Calcular edad aproximada o mostrar fecha de nacimiento */}
                  {new Date(animal.birthDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {/* Badges estilo pastel (fondo claro, texto oscuro) */}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusInfo(animal.currentStatus).className}`}>
                    {getStatusInfo(animal.currentStatus).label}
                  </span>
                </td>
                <td className="px-6 py-4 text-right relative">
                  <button
                    onClick={(e) => toggleMenu(e, animal.id)}
                    className={`p-2 rounded-lg transition-colors ${openMenuId === animal.id
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
                      }`}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {openMenuId === animal.id && (
                    <div className="absolute right-8 top-8 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 animate-scaleIn origin-top-right overflow-hidden">
                      <div className="p-1">
                        <button 
                          onClick={() => handleViewDetails(animal)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-colors text-left"
                        >
                          <Eye className="w-4 h-4" />
                          Ver Detalles
                        </button>
                        <button 
                          onClick={() => handleEditClick(animal)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-colors text-left"
                        >
                          <Pencil className="w-4 h-4" />
                          Editar Animal
                        </button>
                        <button 
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )}
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
        onClose={handleCloseForm} 
        onSubmit={handleFormSubmit}
        isLoading={createAnimalMutation.isPending || updateAnimalMutation.isPending}
        pens={pens || []}
        initialData={editingAnimal as unknown as AnimalFormData} // Casting seguro para adaptar la interfaz Animal a AnimalFormData
      />

      {isDetailsOpen && (
        <AnimalDetailsModal 
          animal={selectedAnimal}
          onClose={handleCloseDetails}
          getPenCode={getPenCode}
          getStatusInfo={getStatusInfo}
          getStageInfo={getStageInfo}
        />
      )}
    </div>
  );
};
