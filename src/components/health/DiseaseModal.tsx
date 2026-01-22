import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Loader2, Save } from 'lucide-react';
import type { Disease, DiseaseFormData } from '../../types/farm.types';
import { diseaseSchema } from '../../types/farm.types';
import { createDisease, updateDisease } from '../../api/health';

interface DiseaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    disease: Disease | null;
}

export const DiseaseModal: React.FC<DiseaseModalProps> = ({ isOpen, onClose, disease }) => {
    const queryClient = useQueryClient();
    const isEdit = !!disease;

    const { register, handleSubmit, formState: { errors }, reset } = useForm<DiseaseFormData>({
        resolver: zodResolver(diseaseSchema),
    });

    useEffect(() => {
        if (isOpen) {
            if (disease) {
                reset({
                    code: disease.code,
                    name: disease.name,
                    scientificName: disease.scientificName || '',
                    category: disease.category || '',
                    severity: disease.severity || '',
                    symptoms: disease.symptoms || '',
                    treatmentProtocol: disease.treatmentProtocol || '',
                    preventionMeasures: disease.preventionMeasures || '',
                    isZoonotic: disease.isZoonotic
                });
            } else {
                reset({
                    code: '',
                    name: '',
                    scientificName: '',
                    category: '',
                    severity: '',
                    symptoms: '',
                    treatmentProtocol: '',
                    preventionMeasures: '',
                    isZoonotic: false
                });
            }
        }
    }, [isOpen, disease, reset]);

    const mutation = useMutation({
        mutationFn: (data: DiseaseFormData) => {
            if (isEdit && disease) {
                return updateDisease(disease.id, data);
            }
            return createDisease(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['diseases'] });
            onClose();
        }
    });

    const onSubmit = (data: DiseaseFormData) => {
        mutation.mutate(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 animate-scaleIn max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                        {isEdit ? 'Editar Enfermedad' : 'Nueva Enfermedad'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Código</label>
                            <input {...register('code')} className="input" placeholder="DIS-001" />
                            {errors.code && <p className="text-red-500 text-xs">{errors.code.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Nombre Común</label>
                            <input {...register('name')} className="input" placeholder="Gripe Porcina" />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Nombre Científico</label>
                        <input {...register('scientificName')} className="input" placeholder="Influenza A virus" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Categoría</label>
                            <input {...register('category')} className="input" placeholder="Viral" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Severidad</label>
                            <select {...register('severity')} className="input">
                                <option value="">Seleccionar...</option>
                                <option value="low">Baja</option>
                                <option value="medium">Media</option>
                                <option value="high">Alta</option>
                                <option value="critical">Crítica</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Síntomas</label>
                        <textarea {...register('symptoms')} className="input min-h-[60px]" placeholder="Fiebre, tos, letargo..." />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Protocolo de Tratamiento</label>
                        <textarea {...register('treatmentProtocol')} className="input min-h-[60px]" placeholder="Aislamiento, hidratación..." />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Medidas de Prevención</label>
                        <textarea {...register('preventionMeasures')} className="input min-h-[60px]" placeholder="Vacunación anual..." />
                    </div>

                    <div className="flex items-center gap-2 py-2">
                        <input type="checkbox" {...register('isZoonotic')} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                        <label className="text-sm text-gray-700 font-medium text-red-600">Es Zoonótica (Transmisible a humanos)</label>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="btn bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex-1">
                            Cancelar
                        </button>
                        <button type="submit" disabled={mutation.isPending} className="btn btn-primary flex-1 gap-2">
                            {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isEdit ? 'Guardar Cambios' : 'Crear Enfermedad'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
