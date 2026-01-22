import api from './axiosInstance';
import type { Animal, AnimalFormData } from '../types/animal.types';

export const getAnimals = async (params?: Record<string, string | number | boolean>): Promise<Animal[]> => {
    const response = await api.get('/animals', { params });
    return response.data.data;
};

export const getAnimal = async (id: string): Promise<Animal> => {
    const response = await api.get(`/animals/${id}`);
    return response.data.data;
};

export const createAnimal = async (data: AnimalFormData): Promise<Animal> => {
    const response = await api.post('/animals', data);
    return response.data.data;
};

export const updateAnimal = async (id: string, data: Partial<AnimalFormData>): Promise<Animal> => {
    const response = await api.put(`/animals/${id}`, data);
    return response.data.data;
};

export const deleteAnimal = async (id: string): Promise<void> => {
    await api.delete(`/animals/${id}`);
};
