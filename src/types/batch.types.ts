import { z } from 'zod';

export const batchSchema = z.object({
    code: z.string().min(1, 'El código es requerido'),
    name: z.string().min(1, 'El nombre es requerido'),
    batchType: z.enum(['fattening', 'breeding', 'weaning', 'farrowing', 'quarantine']).default('fattening'),
    status: z.enum(['active', 'closed', 'planned', 'archived']).default('active'),
    startDate: z.string().min(1, 'La fecha de inicio es requerida'),
    expectedEndDate: z.string().optional(),
    actualEndDate: z.string().optional(),
    initialCount: z.coerce.number().min(0, 'La cantidad inicial debe ser mayor o igual a 0').default(0),
    currentCount: z.coerce.number().min(0).default(0),
    targetWeight: z.coerce.number().min(0).optional(),
    notes: z.string().optional(),
});

export type BatchFormData = z.infer<typeof batchSchema>;

export interface Batch {
    id: string;
    code: string;
    name: string;
    tenantId: string;
    batchType: string;
    status: string;
    startDate: string;
    expectedEndDate?: string;
    actualEndDate?: string;
    initialCount: number;
    currentCount: number;
    targetWeight?: number;
    createdAt: string;
    updatedAt: string;
}
