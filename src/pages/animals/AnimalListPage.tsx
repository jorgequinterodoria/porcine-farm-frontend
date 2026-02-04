import React, { useState, useMemo } from 'react';
import { withObservables } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Rows,
  MapPin,
  Pencil,
  Trash2,
  Eye,
  Cloud,
  Check
} from 'lucide-react';

// WatermelonDB Imports
import { database } from '../../db';
import { Animal, Pen } from '../../db/models';
import type { AnimalFormData } from '../../types/animal.types';

// Components
import { AnimalForm } from '../../components/animals/AnimalForm';
import { AnimalDetailsModal } from '../../components/animals/AnimalDetailsModal';

// Interfaces para las props inyectadas por withObservables
interface AnimalListPageProps {
  animals: Animal[];
  pens: Pen[];
}

// Mapas de UI (Estados y Etapas)
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

const AnimalListPageComponent: React.FC<AnimalListPageProps> = ({ animals, pens }) => {
  // --- Estados Locales de UI ---
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // --- Lógica de Filtrado (En memoria) ---
  // Nota: Watermelon es muy rápido, filtrar 1000-2000 animales en memoria está bien.
  // Para datasets gigantes, usaríamos Q.where() en el enhance.
  const filteredAnimals = useMemo(() => {
    return animals.filter(animal => {
      const matchesSearch = 
        animal.internalCode?.toLowerCase().includes(search.toLowerCase()) || 
        animal.visualId?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || animal.currentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [animals, search, statusFilter]);

  // --- Helpers de UI ---
  const getStatusInfo = (status: string) => {
    return statusMap[status] || { label: status, className: 'bg-gray-50 text-gray-700 border-gray-200' };
  };

  const getStageInfo = (stage: string) => {
    return stageMap[stage] || { label: stage || 'Sin definir', className: 'bg-gray-50 text-gray-700 border-gray-200' };
  };

  const getPenCode = (penId?: string | null) => {
    if (!penId) return 'Sin asignar';
    const pen = pens.find(p => p.id === penId);
    return pen ? pen.code : '...';
  };

  // --- Manejadores de Acción (Offline-First) ---

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

  // 🔥 CORE: Guardar en Base de Datos Local
  const handleFormSubmit = async (data: AnimalFormData) => {
    try {
      await database.write(async () => {
        const collection = database.collections.get<Animal>('animals');

        if (editingAnimal) {
          // UPDATE
          await editingAnimal.update(animal => {
            updateAnimalFields(animal, data);
          });
        } else {
          // CREATE
          await collection.create(animal => {
            updateAnimalFields(animal, data);
            animal.currentStatus = 'active'; // Default
          });
        }
      });
      handleCloseForm();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar en base de datos local");
    }
  };

  // Helper para mapear campos (DRY)
  const updateAnimalFields = (animal: Animal, data: AnimalFormData) => {
    animal.internalCode = data.internalCode;
    animal.sex = data.sex;
    animal.birthDate = new Date(data.birthDate);
    animal.birthWeight = Number(data.birthWeight) || 0;
    animal.currentPenId = data.currentPenId || null;
    animal.electronicId = data.electronicId || null;
    animal.visualId = data.visualId || null;
    animal.geneticLine = data.geneticLine || null;
    animal.purpose = data.purpose || null;
    animal.origin = data.origin || null;
    animal.acquisitionCost = Number(data.acquisitionCost) || 0;
    animal.notes = data.notes || null;
    animal.breedId = data.breedId || null;
    animal.currentStatus = data.currentStatus || 'active';
    animal.stage = data.stage || 'nursery';
  };

  // 🔥 CORE: Eliminar (Soft Delete)
  const handleDelete = async (animal: Animal) => {
    if(!confirm('¿Estás seguro de eliminar este animal?')) return;
    
    try {
      await database.write(async () => {
        await animal.markAsDeleted(); // Soft delete compatible con Sync
      });
      setOpenMenuId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  React.useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventario de Animales</h1>
          <p className="text-gray-500 mt-1">
            {animals.length} animales registrados en base de datos local
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary gap-2 shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" />
          Agregar Animal
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por código, ID visual..."
            className="input pl-10 h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
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

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
              <th className="px-6 py-4">Código Interno</th>
              <th className="px-6 py-4">Sexo</th>
              <th className="px-6 py-4">Peso (kg)</th>
              <th className="px-6 py-4">Corral</th>
              <th className="px-6 py-4">Fecha Nac.</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredAnimals.map((animal) => (
              <tr key={animal.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-indigo-600 group-hover:text-indigo-700">
                      {animal.internalCode}
                    </span>
                    {/* Indicador de Sync */}
                    <span className="text-[10px] flex items-center gap-1 mt-0.5">
                       {animal.syncStatus === 'created' || animal.syncStatus === 'updated' ? (
                         <><Cloud className="w-3 h-3 text-yellow-500" /> <span className="text-yellow-600">Pendiente</span></>
                       ) : (
                         <><Check className="w-3 h-3 text-green-500" /> <span className="text-gray-400">Sync</span></>
                       )}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 capitalize text-gray-700">
                  {animal.sex === 'male' ? 'Macho' : 'Hembra'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                  {animal.birthWeight ? `${animal.birthWeight} kg` : '-'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {getPenCode(animal.currentPenId)}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(animal.birthDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
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

                  {/* Menú Dropdown */}
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
                          onClick={() => handleDelete(animal)}
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

        {filteredAnimals.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            <Rows className="w-12 h-12 mx-auto mb-4 opacity-20 text-gray-300" />
            <p className="text-lg font-medium text-gray-900">No se encontraron animales</p>
            <p className="text-sm mt-1 text-gray-500">
               {animals.length === 0 ? 'La base de datos está vacía.' : 'Ajusta los filtros de búsqueda.'}
            </p>
          </div>
        )}
      </div>

      {/* Modales */}
<AnimalForm 
  isOpen={isFormOpen} 
  onClose={handleCloseForm} 
  onSubmit={handleFormSubmit}
  pens={pens.map(p => ({ id: p.id, name: p.name, code: p.code }))}
  
  // 👇 AQUÍ ESTÁ LA SOLUCIÓN
  initialData={editingAnimal ? {
    // 1. Esparcimos los datos crudos pero forzamos el tipo 'any' temporalmente para romper el bloqueo
    ...editingAnimal._raw as any,
    
    // 2. Sobrescribimos y saneamos los campos específicos que dan error (null -> undefined)
    electronicId: editingAnimal.electronicId ?? undefined,
    visualId: editingAnimal.visualId ?? undefined,
    geneticLine: editingAnimal.geneticLine ?? undefined,
    purpose: editingAnimal.purpose ?? undefined,
    origin: editingAnimal.origin ?? undefined,
    notes: editingAnimal.notes ?? undefined,
    currentPenId: editingAnimal.currentPenId ?? undefined,
    breedId: editingAnimal.breedId ?? undefined,
    motherId: editingAnimal.motherId ?? undefined,
    fatherId: editingAnimal.fatherId ?? undefined,

    // 3. Formateamos fechas y números para el formulario HTML
    birthDate: new Date(editingAnimal.birthDate).toISOString().split('T')[0],
    birthWeight: Number(editingAnimal.birthWeight),
    acquisitionCost: Number(editingAnimal.acquisitionCost),
    
    // 4. Aseguramos los Enums (si vienen nulos, ponemos un default)
    currentStatus: editingAnimal.currentStatus || 'active',
    stage: editingAnimal.stage || 'nursery',
    sex: editingAnimal.sex || 'female',
  } : null} 
/>

      {isDetailsOpen && selectedAnimal && (
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

// 🔌 CONECTOR WATERMELON DB
// Esto hace que el componente se actualice en tiempo real
const enhance = withObservables([], () => ({
  animals: database.collections.get<Animal>('animals').query(
    Q.sortBy('created_at', Q.desc) // Ordenar por fecha de creación
  ),
  pens: database.collections.get<Pen>('pens').query(),
}));

export const AnimalListPage = enhance(AnimalListPageComponent);