import api from './axiosInstance';

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
}

export const getProfile = async () => {
    const response = await api.get('/auth/profile');
    return response.data.data;
};

export const updateProfile = async (data: UpdateProfileRequest) => {
    const response = await api.put('/auth/profile', data);
    return response.data.data;
};

export const changePassword = async (data: ChangePasswordRequest) => {
    const response = await api.post('/auth/change-password', data);
    return response.data;
};
