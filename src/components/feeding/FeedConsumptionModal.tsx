import React from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, Save, Utensils } from 'lucide-react';
import type { FeedType, FeedConsumptionFormData } from '../../types/feeding.types';
import { feedConsumptionSchema } from '../../types/feeding.types';

// Import models if needed for types, though we are passing them as props
// import { Pen } from '../../db/models'; 
// Assuming Pen type matches roughly what we need for the select

interface FeedConsumptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    feedTypes: FeedType[];
    pens: any[];
    batches: any[];
    onSubmit: (data: FeedConsumptionFormData) => void;
    isLoading?: boolean;
}

export const FeedConsumptionModal: React.FC<FeedConsumptionModalProps> = ({ isOpen, onClose, feedTypes, pens, batches, onSubmit, isLoading }) => {
    
    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<FeedConsumptionFormData>({
        resolver: zodResolver(feedConsumptionSchema) as Resolver<FeedConsumptionFormData>,
        defaultValues: {
            consumptionDate: new Date().toISOString().split('T')[0],
            targetType: 'pen'
        }
    });

    const targetType = watch('targetType');

    // Reset form when modal opens/closes
    React.useEffect(() => {
        if (isOpen) {
            reset({
                consumptionDate: new Date().toISOString().split('T')[0],
                targetType: 'pen'
            });
        }
    }, [isOpen, reset]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-scaleIn">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Utensils className="w-5 h-5 text-indigo-600" />
                        Registrar Consumo Diario
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Alimento Consumido</label>
                        <select {...register('feedTypeId')} className="input">
                            <option value="">Seleccionar...</option>
                            {feedTypes.map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.name} ({type.code}) - Disponible: {type.currentStockKg}kg
                                </option>
                            ))}
                        </select>
                        {errors.feedTypeId && <p className="text-red-500 text-xs">{errors.feedTypeId.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Fecha de Consumo</label>
                            <input type="date" {...register('consumptionDate')} className="input" />
                            {errors.consumptionDate && <p className="text-red-500 text-xs">{errors.consumptionDate.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Cantidad Total (kg)</label>
                            <div className="relative">
                                <input type="number" step="0.01" {...register('quantityKg', { valueAsNumber: true })} className="input pr-12" placeholder="0.00" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">kg</span>
                            </div>
                            {errors.quantityKg && <p className="text-red-500 text-xs">{errors.quantityKg.message}</p>}
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                        <h3 className="text-sm font-bold text-gray-900 mb-3">Destino del Consumo</h3>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <label className={`flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${targetType === 'pen' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'hover:bg-gray-50'}`}>
                                <input type="radio" value="pen" {...register('targetType')} className="sr-only" />
                                <span className="text-sm font-medium">Por Corral</span>
                            </label>
                            <label className={`flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${targetType === 'batch' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'hover:bg-gray-50'}`}>
                                <input type="radio" value="batch" {...register('targetType')} className="sr-only" />
                                <span className="text-sm font-medium">Por Lote</span>
                            </label>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                                {targetType === 'pen' ? 'Seleccionar Corral' : 'Seleccionar Lote'}
                            </label>
                            
                            {targetType === 'pen' ? (
                                <select {...register('targetId')} className="input">
                                    <option value="">Seleccionar Corral...</option>
                                    {pens?.map(pen => (
                                        <option key={pen.id} value={pen.id}>
                                            {pen.name} ({pen.code}) - Cap: {pen.capacity}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <select {...register('targetId')} className="input">
                                    <option value="">Seleccionar Lote...</option>
                                    {batches?.map(batch => (
                                        <option key={batch.id} value={batch.id}>
                                            {batch.name} ({batch.code})
                                        </option>
                                    ))}
                                </select>
                            )}
                            {errors.targetId && <p className="text-red-500 text-xs">{errors.targetId.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Notas / Observaciones</label>
                        <textarea {...register('notes')} className="input min-h-[60px]" placeholder="Observaciones opcionales..." />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="btn bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex-1">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isLoading} className="btn btn-primary flex-1 gap-2">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Registrar Consumo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
