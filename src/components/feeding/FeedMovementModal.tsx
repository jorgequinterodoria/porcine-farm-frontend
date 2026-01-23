import React from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Loader2, Save } from 'lucide-react';
import type { FeedType, FeedMovementFormData } from '../../types/feeding.types';
import { feedMovementSchema } from '../../types/feeding.types';
import { addFeedMovement } from '../../api/feeding';

interface FeedMovementModalProps {
    isOpen: boolean;
    onClose: () => void;
    feedTypes: FeedType[];
}

export const FeedMovementModal: React.FC<FeedMovementModalProps> = ({ isOpen, onClose, feedTypes }) => {
    const queryClient = useQueryClient();

    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<FeedMovementFormData>({
        resolver: zodResolver(feedMovementSchema) as Resolver<FeedMovementFormData>,
        defaultValues: {
            movementDate: new Date().toISOString().split('T')[0],
            movementType: 'purchase'
        }
    });

    const movementType = watch('movementType');

    const mutation = useMutation({
        mutationFn: addFeedMovement,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['feed-types'] }); // To update stock
            reset();
            onClose();
        }
    });

    const onSubmit = (data: FeedMovementFormData) => {
        mutation.mutate(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-scaleIn">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Registrar Movimiento de Inventario</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Tipo de Alimento</label>
                        <select {...register('feedTypeId')} className="input">
                            <option value="">Seleccionar...</option>
                            {feedTypes.map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.name} ({type.code}) - Stock: {type.currentStockKg}kg
                                </option>
                            ))}
                        </select>
                        {errors.feedTypeId && <p className="text-red-500 text-xs">{errors.feedTypeId.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Tipo de Movimiento</label>
                            <select {...register('movementType')} className="input">
                                <option value="purchase">Compra / Entrada</option>
                                <option value="adjustment_in">Ajuste (+)</option>
                                <option value="adjustment_out">Ajuste (-)</option>
                                <option value="out">Salida / Venta</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Fecha</label>
                            <input type="date" {...register('movementDate')} className="input" />
                            {errors.movementDate && <p className="text-red-500 text-xs">{errors.movementDate.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Cantidad (kg)</label>
                        <div className="relative">
                            <input type="number" step="0.01" {...register('quantityKg')} className="input pr-12" placeholder="0.00" />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">kg</span>
                        </div>
                        {errors.quantityKg && <p className="text-red-500 text-xs">{errors.quantityKg.message}</p>}
                    </div>

                    {movementType === 'purchase' && (
                        <div className="bg-gray-50 p-4 rounded-xl space-y-4 border border-gray-100">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Datos de Compra</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Costo Unitario ($/kg)</label>
                                    <input type="number" step="0.01" {...register('unitCost')} className="input" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Proveedor</label>
                                    <input {...register('supplier')} className="input" placeholder="Agroinsumos S.A." />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">N° Factura / Remisión</label>
                                <input {...register('invoiceNumber')} className="input" />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Notas / Observaciones</label>
                        <textarea {...register('notes')} className="input min-h-[80px]" placeholder="Motivo del ajuste o detalles adicionales..." />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="btn bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex-1">
                            Cancelar
                        </button>
                        <button type="submit" disabled={mutation.isPending} className="btn btn-primary flex-1 gap-2">
                            {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Registrar Movimiento
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
