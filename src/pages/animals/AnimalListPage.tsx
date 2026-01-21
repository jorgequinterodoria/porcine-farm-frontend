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
          <h1 className="text-3xl font-bold">Animals Inventory</h1>
          <p className="text-text-dim mt-1">Manage and track your livestock history</p>
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim" />
          <input 
            type="text"
            placeholder="Search by code or electronic ID..."
            className="input pl-10 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-dim" />
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

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-xs uppercase tracking-wider text-text-dim font-bold">
              <th className="px-6 py-4">Internal Code</th>
              <th className="px-6 py-4">Sex</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Current Pen</th>
              <th className="px-6 py-4">Breed</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
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
                <td className="px-6 py-4 font-bold text-primary group-hover:underline">
                  {animal.internalCode}
                </td>
                <td className="px-6 py-4 capitalize">{animal.sex}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                    animal.currentStatus === 'active' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                  }`}>
                    {animal.currentStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm">
                    <MapPin className="w-3.5 h-3.5 text-text-dim" />
                    {animal.currentPenId ? 'Corral #4' : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-text-dim">{animal.breed?.name || 'Standard'}</td>
                <td className="px-6 py-4 text-sm text-text-dim">
                  {new Date(animal.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-text-dim hover:text-text-main p-1 rounded-md hover:bg-white/10">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {!isLoading && filteredAnimals?.length === 0 && (
          <div className="p-12 text-center text-text-dim">
            <Rows className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No animals found</p>
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
