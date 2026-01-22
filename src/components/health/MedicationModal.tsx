import React, { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Loader2, Save } from 'lucide-react';
import type { Medication, MedicationFormData } from '../../types/farm.types';
import { medicationSchema } from '../../types/farm.types';
import { createMedication, updateMedication } from '../../api/health';

interface MedicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    medication: Medication | null;
}

export const MedicationModal: React.FC<MedicationModalProps> = ({ isOpen, onClose, medication }) => {
    const queryClient = useQueryClient();
    const isEdit = !!medication;

    const { register, handleSubmit, formState: { errors }, reset } = useForm<MedicationFormData>({
        resolver: zodResolver(medicationSchema) as Resolver<MedicationFormData>,
    });

    useEffect(() => {
        if (isOpen) {
            if (medication) {
                reset({
                    code: medication.code,
                    commercialName: medication.commercialName,
                    genericName: medication.genericName || '',
                    category: medication.category || '',
                    presentation: medication.presentation || '',
                    withdrawalPeriodDays: medication.withdrawalPeriodDays ?? 0,
                    dosageInstructions: medication.dosageInstructions || '',
                    manufacturer: medication.manufacturer || ''
                });
            } else {
                reset({
                    code: '',
                    commercialName: '',
                    genericName: '',
                    category: '',
                    presentation: '',
                    withdrawalPeriodDays: 0,
                    dosageInstructions: '',
                    manufacturer: ''
                });
            }
        }
    }, [isOpen, medication, reset]);

    const mutation = useMutation({
        mutationFn: (data: MedicationFormData) => {
            if (isEdit && medication) {
                return updateMedication(medication.id, data);
            }
            return createMedication(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['medications'] });
            onClose();
        }
    });

    const onSubmit = (data: MedicationFormData) => {
        mutation.mutate(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-scaleIn">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                        {isEdit ? 'Editar Medicamento' : 'Nuevo Medicamento'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Código</label>
                            <input {...register('code')} className="input" placeholder="MED-001" />
                            {errors.code && <p className="text-red-500 text-xs">{errors.code.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Nombre Comercial</label>
                            <input {...register('commercialName')} className="input" placeholder="Antibiótico Plus" />
                            {errors.commercialName && <p className="text-red-500 text-xs">{errors.commercialName.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Nombre Genérico</label>
                        <input {...register('genericName')} className="input" placeholder="Amoxicilina" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Categoría</label>
                            <input {...register('category')} className="input" placeholder="Antibiótico" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Presentación</label>
                            <input {...register('presentation')} className="input" placeholder="Frasco 100ml" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Tiempo de Retiro (días)</label>
                            <input type="number" {...register('withdrawalPeriodDays')} className="input" placeholder="0" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Fabricante</label>
                            <input {...register('manufacturer')} className="input" placeholder="Laboratorios X" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Instrucciones de Dosis</label>
                        <textarea {...register('dosageInstructions')} className="input min-h-[80px]" placeholder="1ml por cada 10kg de peso vivo..." />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="btn bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex-1">
                            Cancelar
                        </button>
                        <button type="submit" disabled={mutation.isPending} className="btn btn-primary flex-1 gap-2">
                            {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isEdit ? 'Guardar Cambios' : 'Crear Medicamento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
