import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  X, 
  Loader2, 
  Tag, 
  Calendar, 
  Scale, 
  Dna, 
  MapPin, 
  Activity, 
  DollarSign, 
  FileText, 
  Info,
  Venus,
  Mars
} from 'lucide-react';
import type { AnimalFormData } from '../../types/animal.types';
import { animalSchema } from '../../types/animal.types';

interface AnimalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AnimalFormData) => void;
  isLoading?: boolean;
  pens?: { id: string; name: string; code: string }[];
  initialData?: AnimalFormData | null;
}

export const AnimalForm: React.FC<AnimalFormProps> = ({ isOpen, onClose, onSubmit, isLoading, pens = [], initialData }) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(animalSchema),
    defaultValues: {
      currentStatus: 'active',
      stage: 'nursery',
      sex: 'female',
      internalCode: '',
      electronicId: '',
      visualId: '',
      birthDate: '',
      birthWeight: 0,
      geneticLine: '',
      purpose: '',
      origin: '',
      acquisitionCost: 0,
      notes: '',
      currentPenId: '',
      breedId: '',
    }
  });

  const selectedSex = watch('sex');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Asegurarse de que las fechas estén en formato YYYY-MM-DD para el input date
        const formattedData = {
          ...initialData,
          birthDate: initialData.birthDate ? new Date(initialData.birthDate).toISOString().split('T')[0] : '',
          // Manejar nulos o indefinidos para selects
          currentPenId: initialData.currentPenId || '',
          breedId: initialData.breedId || '',
          // Asegurarse de que los valores numéricos sean tratados como tal
          birthWeight: Number(initialData.birthWeight) || 0,
          acquisitionCost: Number(initialData.acquisitionCost) || 0,
        };
        reset(formattedData);
      } else {
        reset({
          currentStatus: 'active',
          stage: 'nursery',
          sex: 'female',
          internalCode: '',
          electronicId: '',
          visualId: '',
          birthDate: '',
          birthWeight: 0,
          geneticLine: '',
          purpose: '',
          origin: '',
          acquisitionCost: 0,
          notes: '',
          currentPenId: '',
          breedId: '',
        });
      }
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-scaleIn border border-gray-100 my-8 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-50 p-2.5 rounded-xl">
              <Tag className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Registrar Nuevo Animal</h2>
              <p className="text-sm text-gray-500">Ingresa los detalles del nuevo ejemplar</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors))} className="overflow-y-auto custom-scrollbar flex-1">
          <div className="p-8 space-y-8">
            
            {/* Sección: Identificación */}
            <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <Info className="w-5 h-5 text-indigo-500" />
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Identificación</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Código Interno <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input 
                      {...register('internalCode')} 
                      className="input pl-4 font-mono font-medium" 
                      placeholder="Ej. PQ-123" 
                    />
                  </div>
                  {errors.internalCode && <p className="text-red-500 text-xs ml-1 font-medium">{errors.internalCode.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">ID Electrónico</label>
                  <input {...register('electronicId')} className="input" placeholder="Chip / RFID" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">ID Visual</label>
                  <input {...register('visualId')} className="input" placeholder="Arete / Tatuaje" />
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Columna Izquierda */}
              <div className="space-y-8">
                
                {/* Sección: Características */}
                <section>
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                    <Dna className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Características</h3>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Sexo <span className="text-red-500">*</span></label>
                        <div className="flex gap-3">
                          <label className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                            selectedSex === 'male' 
                              ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' 
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}>
                            <input type="radio" value="male" {...register('sex')} className="hidden" />
                            <Mars className="w-4 h-4" />
                            <span className="text-sm font-medium">Macho</span>
                          </label>
                          <label className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                            selectedSex === 'female' 
                              ? 'bg-pink-50 border-pink-200 text-pink-700 shadow-sm' 
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}>
                            <input type="radio" value="female" {...register('sex')} className="hidden" />
                            <Venus className="w-4 h-4" />
                            <span className="text-sm font-medium">Hembra</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Fecha Nacimiento <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          <input type="date" {...register('birthDate')} className="input pl-10" />
                        </div>
                        {errors.birthDate && <p className="text-red-500 text-xs ml-1 font-medium">{errors.birthDate.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Peso al Nacer (kg)</label>
                        <div className="relative">
                          <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          <input type="number" step="0.01" {...register('birthWeight')} className="input pl-10" placeholder="0.00" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Línea Genética</label>
                        <input {...register('geneticLine')} className="input" placeholder="Ej. Topigs Norsvin" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Sección: Ubicación y Estado */}
                <section>
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                    <MapPin className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Ubicación y Estado</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-5 mb-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 ml-1">Estado Operativo</label>
                      <div className="relative">
                        <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <select {...register('currentStatus')} className="input pl-10 cursor-pointer appearance-none">
                          <option value="active">Activo</option>
                          <option value="sold">Vendido</option>
                          <option value="deceased">Fallecido</option>
                          <option value="quarantine">Cuarentena</option>
                          <option value="sick">Enfermo</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 ml-1">Etapa Productiva</label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <select {...register('stage')} className="input pl-10 cursor-pointer appearance-none">
                          <option value="piglet">Lechón</option>
                          <option value="nursery">Cría (Destete)</option>
                          <option value="fattening">Engorde</option>
                          <option value="breeding">Reproducción</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 ml-1">Corral</label>
                      <select {...register('currentPenId')} className="input cursor-pointer">
                        <option value="">-- Sin asignar --</option>
                        {pens.map(pen => (
                          <option key={pen.id} value={pen.id}>
                            {pen.name} ({pen.code})
                          </option>
                        ))}
                      </select>
                    </div>
                </section>
              </div>

              {/* Columna Derecha */}
              <div className="space-y-8">
                 {/* Sección: Origen y Costos */}
                 <section>
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                    <DollarSign className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Origen y Costos</h3>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 ml-1">Origen</label>
                      <input {...register('origin')} className="input" placeholder="Ej. Granja La Esperanza" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Propósito</label>
                        <input {...register('purpose')} className="input" placeholder="Ej. Engorde" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Costo ($)</label>
                        <input type="number" step="0.01" {...register('acquisitionCost')} className="input" placeholder="0.00" />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                    <FileText className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Notas Adicionales</h3>
                  </div>
                  
                  <div className="space-y-2 flex-1">
                    <textarea 
                      {...register('notes')} 
                      className="input min-h-[140px] py-3 resize-none h-full" 
                      placeholder="Escribe aquí cualquier observación relevante sobre la salud, comportamiento o características especiales..."
                    />
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50 sticky bottom-0 z-10">
            <div className="text-xs text-gray-400">
              <span className="text-red-500">*</span> Campos obligatorios
            </div>
            <div className="flex items-center gap-3">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white border border-transparent hover:border-gray-200 transition-all"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={isLoading} 
                className="btn btn-primary px-8 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all transform active:scale-95"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Guardando...</span>
                  </div>
                ) : 'Guardar Registro'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
