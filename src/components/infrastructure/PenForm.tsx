import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2 } from 'lucide-react';
import { penSchema, type PenFormData } from '../../types/infrastructure.types';
import type { Facility } from '../../types/farm.types';

interface PenFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: PenFormData) => void;
    isLoading?: boolean;
    facilities: Facility[];
}

export const PenForm: React.FC<PenFormProps> = ({ isOpen, onClose, onSubmit, isLoading, facilities }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(penSchema),
        defaultValues: {
            name: '',
            code: '',
            facilityId: '',
            capacity: 0,
        }
    });

    React.useEffect(() => {
        if (isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-scaleIn border border-gray-100">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
                    <h2 className="text-xl font-bold text-gray-900">Nuevo Corral</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-6 space-y-6">

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Instalación (Ubicación)</label>
                            <select {...register('facilityId')} className="input cursor-pointer">
                                <option value="">Seleccione una instalación</option>
                                {facilities.map((f) => (
                                    <option key={f.id} value={f.id}>
                                        {f.name} ({f.code})
                                    </option>
                                ))}
                            </select>
                            {errors.facilityId && <p className="text-red-500 text-xs ml-1">{errors.facilityId.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Nombre / Identificador</label>
                            <input
                                {...register('name')}
                                className="input"
                                placeholder="Ej. Corral 101"
                            />
                            {errors.name && <p className="text-red-500 text-xs ml-1">{errors.name.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Código</label>
                                <input
                                    {...register('code')}
                                    className="input"
                                    placeholder="Ej. COR-101"
                                />
                                {errors.code && <p className="text-red-500 text-xs ml-1">{errors.code.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Capacidad</label>
                                <input
                                    type="number"
                                    {...register('capacity')}
                                    className="input"
                                    placeholder="0"
                                />
                                {errors.capacity && <p className="text-red-500 text-xs ml-1">{errors.capacity.message}</p>}
                            </div>
                        </div>

                    </div>

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
                            ) : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
