import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2 } from 'lucide-react';
import type { AnimalFormData } from '../../types/animal.types';
import { animalSchema } from '../../types/animal.types';

interface AnimalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AnimalFormData) => void;
  isLoading?: boolean;
}

export const AnimalForm: React.FC<AnimalFormProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<any>({
    resolver: zodResolver(animalSchema),
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass w-full max-w-2xl rounded-2xl overflow-hidden animate-fadeIn">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">Register New Animal</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Internal Code</label>
              <input {...register('internalCode')} className="input" placeholder="e.g. PQ-123" />
              {errors.internalCode && <p className="text-error text-xs ml-1">{errors.internalCode.message?.toString()}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Sex</label>
              <select {...register('sex')} className="input h-[42px] py-0">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Birth Date</label>
              <input {...register('birthDate')} type="date" className="input" />
              {errors.birthDate && <p className="text-error text-xs ml-1">{errors.birthDate.message?.toString()}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Status</label>
              <select {...register('currentStatus')} className="input h-[42px] py-0">
                <option value="active">Active</option>
                <option value="quarantine">Quarantine</option>
                <option value="nursery">Nursery</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Notes</label>
            <textarea 
              {...register('notes')} 
              className="input min-h-[100px] resize-none" 
              placeholder="Additional information about the animal..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="btn btn-primary min-w-[120px]">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Animal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
