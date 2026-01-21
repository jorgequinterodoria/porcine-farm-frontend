import { z } from 'zod';

export const animalSchema = z.object({
    internalCode: z.string().min(1, 'Internal code is required'),
    sex: z.enum(['male', 'female']),
    birthDate: z.string().min(1, 'Birth date is required'),
    currentStatus: z.string().default('active'),
    currentPenId: z.string().uuid().optional().nullable(),
    breedId: z.string().uuid().optional().nullable(),
    motherId: z.string().uuid().optional().nullable(),
    fatherId: z.string().uuid().optional().nullable(),
    notes: z.string().optional().nullable(),
});

export type AnimalFormData = z.infer<typeof animalSchema>;

export interface Animal {
    id: string;
    internalCode: string;
    sex: string;
    birthDate: string;
    currentStatus: string;
    currentPenId?: string;
    breed?: { name: string };
    createdAt: string;
}
