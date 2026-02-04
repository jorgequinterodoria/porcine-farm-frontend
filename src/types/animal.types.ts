import { z } from 'zod';

export const animalSchema = z.object({
    internalCode: z.string().min(1, 'Código interno es requerido'),
    electronicId: z.string().optional(),
    visualId: z.string().optional(),
    sex: z.enum(['male', 'female']),
    birthDate: z.string().min(1, 'Fecha de nacimiento es requerida'),
    birthWeight: z.coerce.number().min(0).optional(),
    geneticLine: z.string().optional(),
    currentStatus: z.string().default('active'),
    stage: z.string().default('nursery'),
    currentPenId: z.uuid().optional().or(z.literal('')).nullable(),
    breedId: z.uuid().optional().or(z.literal('')).nullable(),
    motherId: z.uuid().optional().or(z.literal('')).nullable(),
    fatherId: z.uuid().optional().or(z.literal('')).nullable(),
    purpose: z.string().optional(),
    origin: z.string().optional(),
    acquisitionCost: z.coerce.number().min(0).optional(),
    notes: z.string().optional(),
});

export type AnimalFormData = z.infer<typeof animalSchema>;

export interface Animal {
    id: string;
    internalCode: string;
    electronicId?: string;
    visualId?: string;
    sex: string;
    birthDate: string | Date;
    birthWeight?: number;
    currentStatus: string;
    stage: string;
    currentPenId?: string;
    breedId?: string;
    breed?: { name: string };
    createdAt: string | Date;
    geneticLine?: string;
    purpose?: string;
    origin?: string;
    acquisitionCost?: number;
    notes?: string;
}
