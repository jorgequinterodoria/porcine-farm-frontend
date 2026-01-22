import { z } from 'zod';

export interface Facility {
    id: string;
    name: string;
    code: string;
    type?: string;
    capacity?: number;
    currentOccupancy?: number;
    pens?: Pen[];
}

export interface Pen {
    id: string;
    facilityId: string;
    code: string;
    name: string;
    capacity: number;
    currentOccupancy?: number;
}

// --- Catalogs ---

export interface Medication {
    id: string;
    code: string;
    commercialName: string;
    genericName?: string;
    category?: string;
    presentation?: string;
    withdrawalPeriodDays?: number;
    dosageInstructions?: string;
    manufacturer?: string;
    isActive: boolean;
}

export interface Vaccine {
    id: string;
    code: string;
    name: string;
    disease: string;
    type?: string;
    manufacturer?: string;
    applicationRoute?: string;
    dosage?: string;
    boosterRequired: boolean;
    boosterIntervalDays?: number;
    isActive: boolean;
}

export interface Disease {
    id: string;
    code: string;
    name: string;
    scientificName?: string;
    category?: string;
    severity?: string;
    symptoms?: string;
    treatmentProtocol?: string;
    preventionMeasures?: string;
    isZoonotic: boolean;
    isActive: boolean;
}

// --- Forms Schemas (Zod) ---

export const medicationSchema = z.object({
    code: z.string().min(1, 'Código es requerido'),
    commercialName: z.string().min(1, 'Nombre comercial es requerido'),
    genericName: z.string().optional(),
    category: z.string().optional(),
    presentation: z.string().optional(),
    withdrawalPeriodDays: z.coerce.number().min(0).optional(),
    dosageInstructions: z.string().optional(),
    manufacturer: z.string().optional(),
});

export type MedicationFormData = z.infer<typeof medicationSchema>;

export const vaccineSchema = z.object({
    code: z.string().min(1, 'Código es requerido'),
    name: z.string().min(1, 'Nombre es requerido'),
    disease: z.string().min(1, 'Enfermedad objetivo es requerida'),
    type: z.string().optional(),
    manufacturer: z.string().optional(),
    applicationRoute: z.string().optional(),
    dosage: z.string().optional(),
    boosterRequired: z.boolean(),
    boosterIntervalDays: z.coerce.number().min(0).optional(),
});

export type VaccineFormData = z.infer<typeof vaccineSchema>;

export const diseaseSchema = z.object({
    code: z.string().min(1, 'Código es requerido'),
    name: z.string().min(1, 'Nombre es requerido'),
    scientificName: z.string().optional(),
    category: z.string().optional(),
    severity: z.string().optional(),
    symptoms: z.string().optional(),
    treatmentProtocol: z.string().optional(),
    preventionMeasures: z.string().optional(),
    isZoonotic: z.boolean(),
});

export type DiseaseFormData = z.infer<typeof diseaseSchema>;


// --- Health Records ---

export interface HealthRecord {
    id: string;
    animalId?: string;
    batchId?: string;
    recordDate: string;
    diseaseId?: string;
    diagnosis?: string;
    treatmentPlan?: string;
    status: 'active' | 'resolved' | 'chronic';
}

export interface BreedingService {
    id: string;
    femaleId: string;
    serviceDate: string;
    serviceType: 'natural' | 'ai' | 'other';
    technicianId?: string;
    notes?: string;
}

export interface Farrowing {
    id: string;
    pregnancyId: string;
    motherId: string;
    farrowingDate: string;
    pigletsBornAlive: number;
    pigletsBornDead: number;
    pigletsMummified: number;
    totalLitterWeight?: number;
}
