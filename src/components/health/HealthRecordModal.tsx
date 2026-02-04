import React, { useState } from 'react';
import { useForm, useFieldArray, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, Save, Plus, Trash2, Pill, AlertTriangle } from 'lucide-react';
import type { Medication, Disease, HealthRecordFormData } from '../../types/farm.types';
import { healthRecordSchema } from '../../types/farm.types';
// import { Animal } from '../../db/models'; // Assuming Animal model

interface HealthRecordModalProps {
    isOpen: boolean;
    onClose: () => void;
    medications: Medication[];
    diseases: Disease[];
    animals: any[]; // Using any[] to accept models
    onSubmit: (data: HealthRecordFormData) => void;
    isLoading?: boolean;
}

export const HealthRecordModal: React.FC<HealthRecordModalProps> = ({ isOpen, onClose, medications, diseases, animals, onSubmit, isLoading }) => {
    const [activeSection, setActiveSection] = useState<'details' | 'treatment'>('details');

    const { register, control, handleSubmit, formState: { errors }, watch, reset } = useForm<HealthRecordFormData>({
        resolver: zodResolver(healthRecordSchema) as Resolver<HealthRecordFormData>,
        defaultValues: {
            recordDate: new Date().toISOString().split('T')[0],
            targetType: 'individual',
            treatments: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'treatments'
    });

    const targetType = watch('targetType');

    // Reset form when modal opens
    React.useEffect(() => {
        if (isOpen) {
            reset({
                recordDate: new Date().toISOString().split('T')[0],
                targetType: 'individual',
                treatments: []
            });
            setActiveSection('details');
        }
    }, [isOpen, reset]);

    const handleDiseaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const diseaseId = e.target.value;
        const disease = diseases.find(d => d.id === diseaseId);
        if (disease) {
            // Optional: Auto-fill symptoms or treatment plan based on disease
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-6 animate-scaleIn max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Pill className="w-5 h-5 text-indigo-600" />
                            Nuevo Evento de Salud
                        </h2>
                        <p className="text-sm text-gray-500">Registra diagnósticos, tratamientos y observaciones.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-4">
                        <button
                            type="button"
                            onClick={() => setActiveSection('details')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                activeSection === 'details'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Detalles del Evento
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveSection('treatment')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                                activeSection === 'treatment'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Tratamiento
                            {fields.length > 0 && (
                                <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full text-xs">
                                    {fields.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Section: Details */}
                    <div className={activeSection === 'details' ? 'block space-y-4' : 'hidden'}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Tipo de Objetivo</label>
                                <select {...register('targetType')} className="input">
                                    <option value="individual">Individual (Animal)</option>
                                    <option value="batch">Lote Completo</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">
                                    {targetType === 'individual' ? 'Seleccionar Animal' : 'Código del Lote'}
                                </label>
                                {targetType === 'individual' ? (
                                    <select {...register('targetId')} className="input">
                                        <option value="">Seleccionar...</option>
                                        {animals?.map(animal => (
                                            <option key={animal.id} value={animal.id}>
                                                {animal.internalCode} - {animal.sex === 'male' ? 'Macho' : 'Hembra'}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input {...register('targetId')} className="input" placeholder="Ej. LOTE-2024-A" />
                                )}
                                {errors.targetId && <p className="text-red-500 text-xs">{errors.targetId.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Fecha del Evento</label>
                                <input type="date" {...register('recordDate')} className="input" />
                                {errors.recordDate && <p className="text-red-500 text-xs">{errors.recordDate.message}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Temperatura (°C)</label>
                                <input type="number" step="0.1" {...register('temperature', { valueAsNumber: true })} className="input" placeholder="38.5" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Enfermedad / Patología (Opcional)</label>
                            <select {...register('diseaseId')} onChange={handleDiseaseChange} className="input">
                                <option value="">Seleccionar del catálogo...</option>
                                {diseases.map(d => (
                                    <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Diagnóstico / Motivo</label>
                            <input {...register('diagnosis')} className="input" placeholder="Ej. Infección respiratoria leve..." />
                            {errors.diagnosis && <p className="text-red-500 text-xs">{errors.diagnosis.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Síntomas Observados</label>
                                <textarea {...register('symptoms')} className="input min-h-[80px]" placeholder="Tos, fiebre, letargo..." />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Plan de Tratamiento / Notas</label>
                                <textarea {...register('treatmentPlan')} className="input min-h-[80px]" placeholder="Aislar y administrar antibiótico..." />
                            </div>
                        </div>
                    </div>

                    {/* Section: Treatment */}
                    <div className={activeSection === 'treatment' ? 'block space-y-4' : 'hidden'}>
                        {fields.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <AlertTriangle className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                                <p className="text-sm text-gray-500 mb-4">No hay medicamentos agregados a este evento.</p>
                                <button
                                    type="button"
                                    onClick={() => append({ 
                                        medicationId: '', 
                                        startDate: new Date().toISOString().split('T')[0], 
                                        dosage: '' 
                                    })}
                                    className="btn btn-secondary text-xs"
                                >
                                    <Plus className="w-3 h-3 mr-1" />
                                    Agregar Medicamento
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 bg-white rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Medicamento</label>
                                                <select {...register(`treatments.${index}.medicationId`)} className="input text-sm">
                                                    <option value="">Seleccionar...</option>
                                                    {medications.map(m => (
                                                        <option key={m.id} value={m.id}>{m.commercialName} ({m.presentation})</option>
                                                    ))}
                                                </select>
                                                {errors.treatments?.[index]?.medicationId && <p className="text-red-500 text-xs">Requerido</p>}
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Dosis</label>
                                                <input {...register(`treatments.${index}.dosage`)} className="input text-sm" placeholder="Ej. 2ml" />
                                                {errors.treatments?.[index]?.dosage && <p className="text-red-500 text-xs">Requerido</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Inicio</label>
                                                <input type="date" {...register(`treatments.${index}.startDate`)} className="input text-sm" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Frecuencia</label>
                                                <input {...register(`treatments.${index}.frequency`)} className="input text-sm" placeholder="Ej. Cada 12h" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Vía</label>
                                                <input {...register(`treatments.${index}.applicationRoute`)} className="input text-sm" placeholder="Ej. IM" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Retiro (Fecha)</label>
                                                <input type="date" {...register(`treatments.${index}.withdrawalDate`)} className="input text-sm" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => append({ 
                                        medicationId: '', 
                                        startDate: new Date().toISOString().split('T')[0], 
                                        dosage: '' 
                                    })}
                                    className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-xs font-medium text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-3 h-3" />
                                    Agregar Otro Medicamento
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 flex gap-3 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="btn bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex-1">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isLoading} className="btn btn-primary flex-1 gap-2">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Guardar Registro
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
