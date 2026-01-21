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

export interface Medication {
    id: string;
    name: string;
    activeComponent?: string;
    presentation?: string;
    unit?: string;
}

export interface Disease {
    id: string;
    name: string;
    category?: string;
    commonSymptoms?: string;
}

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
