import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    tenantId: string | null;
    farmId?: string | null;
}

interface Tenant {
    id: string;
    name: string;
    subdomain: string;
    subscriptionPlan: string;
}

interface AuthState {
    user: User | null;
    tenant: Tenant | null;
    token: string | null;
    login: (user: User, tenant: Tenant | null, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            tenant: null,
            token: null,
            login: (user, tenant, token) => {
                localStorage.setItem('auth_token', token);
                set({ user, tenant, token });
            },
            logout: () => {
                localStorage.removeItem('auth_token');
                set({ user: null, tenant: null, token: null });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
