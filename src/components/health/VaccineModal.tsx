import React, { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, Save } from 'lucide-react';
import type { Vaccine, VaccineFormData } from '../../types/farm.types';
import { vaccineSchema } from '../../types/farm.types';

interface VaccineModalProps {
    isOpen: boolean;
    onClose: () => void;
    vaccine: Vaccine | null;
    onSubmit: (data: VaccineFormData) => void;
    isLoading?: boolean;
}

export const VaccineModal: React.FC<VaccineModalProps> = ({ isOpen, onClose, vaccine, onSubmit, isLoading }) => {
    const isEdit = !!vaccine;

    const { register, handleSubmit, formState: { errors }, reset } = useForm<VaccineFormData>({
        resolver: zodResolver(vaccineSchema) as Resolver<VaccineFormData>,
    });

    useEffect(() => {
        if (isOpen) {
            if (vaccine) {
                reset({
                    code: vaccine.code,
                    name: vaccine.name,
                    disease: vaccine.disease,
                    type: vaccine.type || '',
                    manufacturer: vaccine.manufacturer || '',
                    applicationRoute: vaccine.applicationRoute || '',
                    dosage: vaccine.dosage || '',
                    boosterRequired: vaccine.boosterRequired,
                    boosterIntervalDays: vaccine.boosterIntervalDays ?? 0
                });
            } else {
                reset({
                    code: '',
                    name: '',
                    disease: '',
                    type: '',
                    manufacturer: '',
                    applicationRoute: '',
                    dosage: '',
                    boosterRequired: false,
                    boosterIntervalDays: 0
                });
            }
        }
    }, [isOpen, vaccine, reset]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-scaleIn">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                        {isEdit ? 'Editar Vacuna' : 'Nueva Vacuna'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Código</label>
                            <input {...register('code')} className="input" placeholder="VAC-001" />
                            {errors.code && <p className="text-red-500 text-xs">{errors.code.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Nombre</label>
                            <input {...register('name')} className="input" placeholder="Vacuna Aftosa" />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Enfermedad Objetivo</label>
                        <input {...register('disease')} className="input" placeholder="Fiebre Aftosa" />
                        {errors.disease && <p className="text-red-500 text-xs">{errors.disease.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Tipo</label>
                            <input {...register('type')} className="input" placeholder="Virus Vivo" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Fabricante</label>
                            <input {...register('manufacturer')} className="input" placeholder="Lab Y" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Vía de Aplicación</label>
                            <input {...register('applicationRoute')} className="input" placeholder="Intramuscular" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Dosis</label>
                            <input {...register('dosage')} className="input" placeholder="2ml" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 py-2">
                        <input type="checkbox" {...register('boosterRequired')} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                        <label className="text-sm text-gray-700">Requiere Refuerzo</label>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Intervalo de Refuerzo (días)</label>
                        <input type="number" {...register('boosterIntervalDays', { valueAsNumber: true })} className="input" placeholder="0" />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="btn bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex-1">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isLoading} className="btn btn-primary flex-1 gap-2">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isEdit ? 'Guardar Cambios' : 'Crear Vacuna'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
