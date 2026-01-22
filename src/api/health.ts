import api from './axiosInstance';
import type { 
    Medication, MedicationFormData, 
    Vaccine, VaccineFormData, 
    Disease, DiseaseFormData,
    HealthRecord 
} from '../types/farm.types';

// --- Medications ---
export const getMedications = async (): Promise<Medication[]> => {
    const response = await api.get('/health/medications');
    return response.data.data;
};

export const createMedication = async (data: MedicationFormData): Promise<Medication> => {
    const response = await api.post('/health/medications', data);
    return response.data.data;
};

export const updateMedication = async (id: string, data: Partial<MedicationFormData>): Promise<Medication> => {
    const response = await api.put(`/health/medications/${id}`, data);
    return response.data.data;
};

export const deleteMedication = async (id: string): Promise<void> => {
    await api.delete(`/health/medications/${id}`);
};

// --- Vaccines ---
export const getVaccines = async (): Promise<Vaccine[]> => {
    const response = await api.get('/health/vaccines');
    return response.data.data;
};

export const createVaccine = async (data: VaccineFormData): Promise<Vaccine> => {
    const response = await api.post('/health/vaccines', data);
    return response.data.data;
};

export const updateVaccine = async (id: string, data: Partial<VaccineFormData>): Promise<Vaccine> => {
    const response = await api.put(`/health/vaccines/${id}`, data);
    return response.data.data;
};

export const deleteVaccine = async (id: string): Promise<void> => {
    await api.delete(`/health/vaccines/${id}`);
};

// --- Diseases ---
export const getDiseases = async (): Promise<Disease[]> => {
    const response = await api.get('/health/diseases');
    return response.data.data;
};

export const createDisease = async (data: DiseaseFormData): Promise<Disease> => {
    const response = await api.post('/health/diseases', data);
    return response.data.data;
};

export const updateDisease = async (id: string, data: Partial<DiseaseFormData>): Promise<Disease> => {
    const response = await api.put(`/health/diseases/${id}`, data);
    return response.data.data;
};

export const deleteDisease = async (id: string): Promise<void> => {
    await api.delete(`/health/diseases/${id}`);
};

// --- Records ---
export const getHealthRecords = async (): Promise<HealthRecord[]> => {
    const response = await api.get('/health/records');
    return response.data.data;
};
