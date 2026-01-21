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
          <h1 className="text-3xl font-bold text-white">Animals Inventory</h1>
          <p className="text-slate-400 mt-1">Manage and track your livestock history</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Animal
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by code or electronic ID..."
            className="input pl-10 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            className="input h-10 w-40 py-0"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="quarantine">Quarantine</option>
            <option value="sold">Sold</option>
            <option value="deceased">Deceased</option>
          </select>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-white/10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-xs uppercase tracking-wider text-slate-400 font-bold">
              <th className="px-6 py-4">Internal Code</th>
              <th className="px-6 py-4">Sex</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Current Pen</th>
              <th className="px-6 py-4">Breed</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-24"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-16"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-20"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-28"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-20"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-24"></div></td>
                  <td className="px-6 py-4"></td>
                </tr>
              ))
            ) : filteredAnimals?.map((animal) => (
              <tr key={animal.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                <td className="px-6 py-4 font-bold text-blue-400 group-hover:underline">
                  {animal.internalCode}
                </td>
                <td className="px-6 py-4 capitalize text-white">{animal.sex}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                    animal.currentStatus === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {animal.currentStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-white">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {animal.currentPenId ? 'Corral #4' : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">{animal.breed?.name || 'Standard'}</td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  {new Date(animal.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {!isLoading && filteredAnimals?.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            <Rows className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium text-white">No animals found</p>
            <p className="text-sm mt-1">Try adjusting your filters or search terms</p>
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
