import { z } from 'zod';

// --- Feed Types ---
export interface FeedType {
    id: string;
    code: string;
    name: string;
    category?: string;
    proteinPercentage?: number;
    energyMcalKg?: number;
    crudeFiberPercentage?: number;
    formula?: string;
    manufacturer?: string;
    costPerKg?: number;
    isActive: boolean;
    feedInventory?: FeedInventory[];
    minimumStockKg?: number;
    maximumStockKg?: number;
    currentStockKg?: number; // Helper for frontend display
    initialStockKg?: number; // Only for creation
}

export interface FeedInventory {
    id: string;
    feedTypeId: string;
    currentStockKg: number;
    minimumStockKg?: number;
    maximumStockKg?: number;
    lastPurchaseDate?: string;
    lastPurchasePrice?: number;
}

export interface FeedMovement {
    id: string;
    feedTypeId: string;
    movementType: 'purchase' | 'adjustment_in' | 'adjustment_out' | 'out';
    quantityKg: number;
    movementDate: string;
    unitCost?: number;
    totalCost?: number;
    supplier?: string;
    invoiceNumber?: string;
    notes?: string;
}

export interface FeedConsumption {
    id: string;
    consumptionDate: string;
    penId?: string;
    batchId?: string;
    animalId?: string;
    feedTypeId: string;
    quantityKg: number;
    numberOfAnimals?: number;
    notes?: string;
    feedType?: FeedType;
    pen?: { name: string };
    batch?: { code: string };
}

export interface StockAlert {
    feedTypeId: string;
    feedName: string;
    code: string;
    currentStock: number;
    minimumStock: number;
    severity: 'critical' | 'warning';
}

// --- Zod Schemas ---

export const feedTypeSchema = z.object({
    code: z.string().min(1, 'Código es requerido'),
    name: z.string().min(1, 'Nombre es requerido'),
    category: z.string().optional(),
    proteinPercentage: z.coerce.number().min(0).max(100).optional(),
    energyMcalKg: z.coerce.number().min(0).optional(),
    crudeFiberPercentage: z.coerce.number().min(0).max(100).optional(),
    formula: z.string().optional(),
    manufacturer: z.string().optional(),
    costPerKg: z.coerce.number().min(0).optional(),
    minimumStockKg: z.coerce.number().min(0).optional(),
    maximumStockKg: z.coerce.number().min(0).optional(),
    initialStockKg: z.coerce.number().min(0).optional(),
});

export type FeedTypeFormData = z.infer<typeof feedTypeSchema>;

export const feedMovementSchema = z.object({
    feedTypeId: z.string().min(1, 'Seleccione un alimento'),
    movementType: z.enum(['purchase', 'adjustment_in', 'adjustment_out', 'out']),
    quantityKg: z.coerce.number().positive('Cantidad debe ser mayor a 0'),
    movementDate: z.string().min(1, 'Fecha es requerida'),
    unitCost: z.coerce.number().min(0).optional(),
    supplier: z.string().optional(),
    invoiceNumber: z.string().optional(),
    notes: z.string().optional(),
});

export type FeedMovementFormData = z.infer<typeof feedMovementSchema>;

export const feedConsumptionSchema = z.object({
    consumptionDate: z.string().min(1, 'Fecha es requerida'),
    feedTypeId: z.string().min(1, 'Seleccione un alimento'),
    quantityKg: z.coerce.number().positive('Cantidad debe ser mayor a 0'),
    targetType: z.enum(['pen', 'batch', 'animal']),
    targetId: z.string().min(1, 'Seleccione un destino'),
    numberOfAnimals: z.coerce.number().int().min(1).optional(),
    notes: z.string().optional(),
});

export type FeedConsumptionFormData = z.infer<typeof feedConsumptionSchema>;
