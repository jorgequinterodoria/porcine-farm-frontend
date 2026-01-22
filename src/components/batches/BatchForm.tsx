import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    X,
    Loader2,
    Tag,
    Calendar,
    Scale,
    Layers,
    Activity,
    FileText,
    Info,
    TrendingUp
} from 'lucide-react';
import type { BatchFormData } from '../../types/batch.types';
import { batchSchema } from '../../types/batch.types';

interface BatchFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: BatchFormData) => void;
    isLoading?: boolean;
    initialData?: BatchFormData | null;
}

export const BatchForm: React.FC<BatchFormProps> = ({ isOpen, onClose, onSubmit, isLoading, initialData }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(batchSchema),
        defaultValues: {
            code: '',
            name: '',
            batchType: 'fattening',
            status: 'active',
            startDate: new Date().toISOString().split('T')[0],
            expectedEndDate: '',
            initialCount: 0,
            currentCount: 0,
            targetWeight: 0,
            notes: '',
        }
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                reset({
                    ...initialData,
                    startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
                    expectedEndDate: initialData.expectedEndDate ? new Date(initialData.expectedEndDate).toISOString().split('T')[0] : '',
                    initialCount: Number(initialData.initialCount) || 0,
                    currentCount: Number(initialData.currentCount) || 0,
                    targetWeight: Number(initialData.targetWeight) || 0,
                });
            } else {
                reset({
                    code: '',
                    name: '',
                    batchType: 'fattening',
                    status: 'active',
                    startDate: new Date().toISOString().split('T')[0],
                    expectedEndDate: '',
                    initialCount: 0,
                    currentCount: 0,
                    targetWeight: 0,
                    notes: '',
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
                            <Layers className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{initialData ? 'Editar Lote' : 'Crear Nuevo Lote'}</h2>
                            <p className="text-sm text-gray-500">Gestión de lotes de producción</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto custom-scrollbar flex-1">
                    <div className="p-8 space-y-8">

                        {/* Sección: Información General */}
                        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-2 mb-6">
                                <Info className="w-5 h-5 text-indigo-500" />
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Información General</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Código del Lote <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <input
                                            {...register('code')}
                                            className="input pl-4 font-mono font-medium"
                                            placeholder="Ej. LOTE-2023-01"
                                        />
                                    </div>
                                    {errors.code && <p className="text-red-500 text-xs ml-1 font-medium">{errors.code.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Nombre del Lote <span className="text-red-500">*</span></label>
                                    <input {...register('name')} className="input" placeholder="Ej. Engorde Enero" />
                                    {errors.name && <p className="text-red-500 text-xs ml-1 font-medium">{errors.name.message}</p>}
                                </div>
                            </div>
                        </section>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Columna Izquierda */}
                            <div className="space-y-8">

                                {/* Sección: Configuración */}
                                <section>
                                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                                        <Tag className="w-5 h-5 text-indigo-500" />
                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Configuración</h3>
                                    </div>
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 ml-1">Tipo de Lote</label>
                                            <div className="relative">
                                                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                                <select {...register('batchType')} className="input pl-10 cursor-pointer appearance-none">
                                                    <option value="fattening">Engorde</option>
                                                    <option value="breeding">Reproducción</option>
                                                    <option value="weaning">Destete</option>
                                                    <option value="farrowing">Parto</option>
                                                    <option value="quarantine">Cuarentena</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 ml-1">Estado</label>
                                            <div className="relative">
                                                <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                                <select {...register('status')} className="input pl-10 cursor-pointer appearance-none">
                                                    <option value="active">Activo</option>
                                                    <option value="closed">Cerrado</option>
                                                    <option value="planned">Planificado</option>
                                                    <option value="archived">Archivado</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Sección: Fechas */}
                                <section>
                                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                                        <Calendar className="w-5 h-5 text-indigo-500" />
                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Planificación Temporal</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 ml-1">Fecha Inicio <span className="text-red-500">*</span></label>
                                            <input type="date" {...register('startDate')} className="input" />
                                            {errors.startDate && <p className="text-red-500 text-xs ml-1 font-medium">{errors.startDate.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 ml-1">Fecha Fin Estimada</label>
                                            <input type="date" {...register('expectedEndDate')} className="input" />
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Columna Derecha */}
                            <div className="space-y-8">
                                {/* Sección: Métricas */}
                                <section>
                                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                                        <TrendingUp className="w-5 h-5 text-indigo-500" />
                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Métricas Iniciales</h3>
                                    </div>
                                    <div className="space-y-5">
                                        <div className="grid grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700 ml-1">Cantidad Inicial</label>
                                                <input type="number" {...register('initialCount')} className="input" min="0" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700 ml-1">Peso Objetivo (kg)</label>
                                                <div className="relative">
                                                    <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                                    <input type="number" step="0.01" {...register('targetWeight')} className="input pl-10" min="0" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                                        <FileText className="w-5 h-5 text-indigo-500" />
                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Notas</h3>
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <textarea
                                            {...register('notes')}
                                            className="input min-h-[140px] py-3 resize-none h-full"
                                            placeholder="Observaciones adicionales sobre el lote..."
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
                                ) : 'Guardar Lote'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
