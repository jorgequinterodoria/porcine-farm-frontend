import api from './axiosInstance';
import type { Batch, BatchFormData } from '../types/batch.types';

export const getBatches = async (params?: Record<string, string | number | boolean>): Promise<Batch[]> => {
    const response = await api.get('/batches', { params });
    return response.data.data;
};

export const getBatch = async (id: string): Promise<Batch> => {
    const response = await api.get(`/batches/${id}`);
    return response.data.data;
};

export const createBatch = async (data: BatchFormData): Promise<Batch> => {
    const response = await api.post('/batches', data);
    return response.data.data;
};

export const updateBatch = async (id: string, data: Partial<BatchFormData>): Promise<Batch> => {
    const response = await api.put(`/batches/${id}`, data);
    return response.data.data;
};

export const deleteBatch = async (id: string): Promise<void> => {
    await api.delete(`/batches/${id}`);
};
