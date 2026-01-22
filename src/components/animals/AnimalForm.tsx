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
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(animalSchema),
    defaultValues: {
      currentStatus: 'active',
      sex: 'female'
    }
  });

  if (!isOpen) return null;

  return (
    // Overlay: Fondo gris oscuro suave con desenfoque
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm transition-opacity">
      
      {/* Modal: Blanco sólido con sombra profunda */}
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-scaleIn border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Registrar Nuevo Animal</h2>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Body */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Código Interno</label>
                <input 
                  {...register('internalCode')} 
                  className="input" // Usa tu clase global .input (blanca con borde gris)
                  placeholder="ej. PQ-123" 
                />
                {errors.internalCode && <p className="text-red-500 text-xs ml-1">{errors.internalCode.message?.toString()}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Sexo</label>
                <select {...register('sex')} className="input cursor-pointer">
                  <option value="male">Macho</option>
                  <option value="female">Hembra</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Fecha de Nacimiento</label>
                <input 
                  {...register('birthDate')} 
                  type="date" 
                  className="input" 
                />
                {errors.birthDate && <p className="text-red-500 text-xs ml-1">{errors.birthDate.message?.toString()}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Estado</label>
                <select {...register('currentStatus')} className="input cursor-pointer">
                  <option value="active">Activo</option>
                  <option value="quarantine">Cuarentena</option>
                  <option value="nursery">Cría</option>
                  <option value="sold">Vendido</option>
                  <option value="deceased">Fallecido</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Notas</label>
              <textarea 
                {...register('notes')} 
                className="input min-h-[100px] py-3 resize-none" 
                placeholder="Información adicional, observaciones sanitarias o genéticas..."
              />
            </div>
          </div>

          {/* Footer: Fondo gris muy tenue para diferenciar acciones */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50/50">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="btn btn-primary min-w-[140px] shadow-lg shadow-indigo-500/20"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Guardando...</span>
                </div>
              ) : 'Guardar Animal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};