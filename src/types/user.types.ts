export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'super_admin' | 'farm_admin' | 'veterinarian' | 'operator' | 'admin';
    tenantId: string | null;
    isActive: boolean;
    lastLogin?: string;
    createdAt: string;
}

export interface CreateUserRequest {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    password?: string;
}

export interface UpdateUserRequest {
    firstName?: string;
    lastName?: string;
    role?: string;
    isActive?: boolean;
}
