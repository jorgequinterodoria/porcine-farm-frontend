import api from './axiosInstance';
import type { 
    FeedType, FeedTypeFormData, 
    FeedMovement, FeedMovementFormData, 
    FeedConsumption, FeedConsumptionFormData,
    StockAlert
} from '../types/feeding.types';


export const getFeedTypes = async (): Promise<FeedType[]> => {
    const response = await api.get('/feeding/types');
    return response.data.data.map((type: FeedType) => ({
        ...type,
        currentStockKg: type.feedInventory?.[0]?.currentStockKg || 0,
        minimumStockKg: type.feedInventory?.[0]?.minimumStockKg || 0,
        maximumStockKg: type.feedInventory?.[0]?.maximumStockKg || 0
    }));
};

export const createFeedType = async (data: FeedTypeFormData): Promise<FeedType> => {
    const response = await api.post('/feeding/types', data);
    return response.data.data;
};

export const updateFeedType = async (id: string, data: Partial<FeedTypeFormData>): Promise<FeedType> => {
    const response = await api.put(`/feeding/types/${id}`, data);
    return response.data.data;
};

export const deleteFeedType = async (id: string): Promise<void> => {
    await api.delete(`/feeding/types/${id}`);
};


export const addFeedMovement = async (data: FeedMovementFormData): Promise<FeedMovement> => {
    const response = await api.post('/feeding/movements', data);
    return response.data.data;
};


export const getFeedConsumption = async (filters?: { penId?: string; batchId?: string }): Promise<FeedConsumption[]> => {
    const response = await api.get('/feeding/consumption', { params: filters });
    return response.data.data;
};

export const registerFeedConsumption = async (data: FeedConsumptionFormData): Promise<FeedConsumption> => {
    
    const payload = {
        consumptionDate: data.consumptionDate,
        feedTypeId: data.feedTypeId,
        quantityKg: data.quantityKg,
        numberOfAnimals: data.numberOfAnimals,
        notes: data.notes,
        penId: data.targetType === 'pen' ? data.targetId : undefined,
        batchId: data.targetType === 'batch' ? data.targetId : undefined,
        animalId: data.targetType === 'animal' ? data.targetId : undefined,
    };
    const response = await api.post('/feeding/consumption', payload);
    return response.data.data;
};


export const getStockAlerts = async (): Promise<StockAlert[]> => {
    const response = await api.get('/feeding/alerts');
    return response.data.data;
};
