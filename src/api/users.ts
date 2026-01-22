import api from './axiosInstance';
import type { User, UpdateUserRequest, CreateUserRequest } from '../types/user.types';

export const getUsers = async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data.data;
};

export const updateUser = async (id: string, data: UpdateUserRequest): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data.data;
};

export const deleteUser = async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
};

export const inviteUser = async (data: CreateUserRequest): Promise<void> => {
    if (data.password) {
        await api.post('/users', data);
    } else {
        await api.post('/auth/invite', data);
    }
};
