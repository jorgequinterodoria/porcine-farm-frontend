import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2 } from 'lucide-react';
import { facilitySchema, type FacilityFormData } from '../../types/infrastructure.types';

interface FacilityFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FacilityFormData) => void;
    isLoading?: boolean;
}

export const FacilityForm: React.FC<FacilityFormProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(facilitySchema),
        defaultValues: {
            name: '',
            code: '',
            facilityType: 'barn',
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

                {}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
                    <h2 className="text-xl font-bold text-gray-900">Nueva Instalación</h2>
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
                            <label className="text-sm font-semibold text-gray-700 ml-1">Nombre</label>
                            <input
                                {...register('name')}
                                className="input"
                                placeholder="Ej. Maternidad"
                            />
                            {errors.name && <p className="text-red-500 text-xs ml-1">{errors.name.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Código</label>
                                <input
                                    {...register('code')}
                                    className="input"
                                    placeholder="Ej. MAT-01"
                                />
                                {errors.code && <p className="text-red-500 text-xs ml-1">{errors.code.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Capacidad Total</label>
                                <input
                                    type="number"
                                    {...register('capacity')}
                                    className="input"
                                    placeholder="0"
                                />
                                {errors.capacity && <p className="text-red-500 text-xs ml-1">{errors.capacity.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Tipo</label>
                            <select {...register('facilityType')} className="input cursor-pointer">
                                <option value="barn">Sección</option>
                                <option value="building">Edificio</option>
                                <option value="warehouse">Almacén</option>
                                <option value="quarantine">Cuarentena</option>
                                <option value="other">Otro</option>
                            </select>
                            {errors.facilityType && <p className="text-red-500 text-xs ml-1">{errors.facilityType.message}</p>}
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
