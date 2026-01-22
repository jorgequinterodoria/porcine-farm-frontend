import api from './axiosInstance';
import type { Facility, Pen } from '../types/farm.types';

export interface CreateFacilityDTO {
  name: string;
  code: string;
  facilityType: string;
  capacity: number;
}

export interface CreatePenDTO {
  name: string;
  code: string;
  capacity: number;
  facilityId: string;
}

export const getFacilities = async (): Promise<Facility[]> => {
  const response = await api.get('/infrastructure/facilities');
  return response.data.data;
};

export const getFacility = async (id: string): Promise<Facility> => {
  const response = await api.get(`/infrastructure/facilities/${id}`);
  return response.data.data;
};

export const createFacility = async (data: CreateFacilityDTO): Promise<Facility> => {
  const response = await api.post('/infrastructure/facilities', data);
  return response.data.data;
};

export const updateFacility = async (id: string, data: Partial<CreateFacilityDTO>): Promise<Facility> => {
  const response = await api.put(`/infrastructure/facilities/${id}`, data);
  return response.data.data;
};

export const deleteFacility = async (id: string): Promise<void> => {
  await api.delete(`/infrastructure/facilities/${id}`);
};

export const getPens = async (facilityId?: string): Promise<Pen[]> => {
  const params = facilityId ? { facilityId } : {};
  const response = await api.get('/infrastructure/pens', { params });
  return response.data.data;
};

export const getPen = async (id: string): Promise<Pen> => {
  const response = await api.get(`/infrastructure/pens/${id}`);
  return response.data.data;
};

export const createPen = async (data: CreatePenDTO): Promise<Pen> => {
  const response = await api.post('/infrastructure/pens', data);
  return response.data.data;
};

export const updatePen = async (id: string, data: Partial<CreatePenDTO>): Promise<Pen> => {
  const response = await api.put(`/infrastructure/pens/${id}`, data);
  return response.data.data;
};

export const deletePen = async (id: string): Promise<void> => {
  await api.delete(`/infrastructure/pens/${id}`);
};
