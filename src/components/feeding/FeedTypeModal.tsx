import React, { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, Save } from 'lucide-react';
import type { FeedType, FeedTypeFormData } from '../../types/feeding.types';
import { feedTypeSchema } from '../../types/feeding.types';

interface FeedTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    feedType: FeedType | null;
    onSubmit: (data: FeedTypeFormData) => void;
    isLoading?: boolean;
}

export const FeedTypeModal: React.FC<FeedTypeModalProps> = ({ isOpen, onClose, feedType, onSubmit, isLoading }) => {
    const isEdit = !!feedType;

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FeedTypeFormData>({
        resolver: zodResolver(feedTypeSchema) as Resolver<FeedTypeFormData>,
    });

    useEffect(() => {
        if (isOpen) {
            if (feedType) {
                reset({
                    code: feedType.code,
                    name: feedType.name,
                    category: feedType.category || '',
                    proteinPercentage: feedType.proteinPercentage ?? 0,
                    energyMcalKg: feedType.energyMcalKg ?? 0,
                    crudeFiberPercentage: feedType.crudeFiberPercentage ?? 0,
                    formula: feedType.formula || '',
                    manufacturer: feedType.manufacturer || '',
                    costPerKg: feedType.costPerKg ?? 0,
                    minimumStockKg: feedType.minimumStockKg ?? 0,
                    maximumStockKg: feedType.maximumStockKg ?? 0
                });
            } else {
                reset({
                    code: '',
                    name: '',
                    category: '',
                    proteinPercentage: 0,
                    energyMcalKg: 0,
                    crudeFiberPercentage: 0,
                    formula: '',
                    manufacturer: '',
                    costPerKg: 0,
                    minimumStockKg: 0,
                    maximumStockKg: 0,
                    initialStockKg: 0
                });
            }
        }
    }, [isOpen, feedType, reset]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 animate-scaleIn max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                        {isEdit ? 'Editar Alimento' : 'Nuevo Alimento'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Código</label>
                            <input {...register('code')} className="input" placeholder="AL-001" />
                            {errors.code && <p className="text-red-500 text-xs">{errors.code.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Nombre</label>
                            <input {...register('name')} className="input" placeholder="Iniciador Fase 1" />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Categoría</label>
                            <input {...register('category')} className="input" placeholder="Pre-iniciador" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Fabricante</label>
                            <input {...register('manufacturer')} className="input" placeholder="NutriPork" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Proteína (%)</label>
                            <input type="number" step="0.1" {...register('proteinPercentage', { valueAsNumber: true })} className="input" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Energía (Mcal/kg)</label>
                            <input type="number" step="0.1" {...register('energyMcalKg', { valueAsNumber: true })} className="input" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Fibra (%)</label>
                            <input type="number" step="0.1" {...register('crudeFiberPercentage', { valueAsNumber: true })} className="input" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Costo Estimado ($/kg)</label>
                        <input type="number" step="0.01" {...register('costPerKg', { valueAsNumber: true })} className="input" />
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                        <h3 className="text-sm font-bold text-gray-900 mb-3">Configuración de Inventario</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {!isEdit && (
                                <div className="space-y-1 col-span-2">
                                    <label className="text-sm font-medium text-gray-700">Stock Inicial (kg)</label>
                                    <input type="number" step="0.01" {...register('initialStockKg', { valueAsNumber: true })} className="input" placeholder="0" />
                                    <p className="text-xs text-gray-500">Cantidad disponible actualmente (solo al crear).</p>
                                </div>
                            )}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Stock Mínimo (Alerta)</label>
                                <input type="number" {...register('minimumStockKg', { valueAsNumber: true })} className="input" placeholder="100" />
                                <p className="text-xs text-gray-500">Se generará alerta cuando el stock baje de este nivel.</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Stock Máximo (Capacidad)</label>
                                <input type="number" {...register('maximumStockKg', { valueAsNumber: true })} className="input" placeholder="1000" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="btn bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex-1">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isLoading} className="btn btn-primary flex-1 gap-2">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isEdit ? 'Guardar Cambios' : 'Crear Alimento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
