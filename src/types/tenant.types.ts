import { z } from 'zod';

export const tenantSchema = z.object({
    name: z.string().min(1, 'Farm name is required'),
    subdomain: z.string().min(1, 'Subdomain is required').toLowerCase(),
    email: z.string().email('Invalid email address'),
    adminFirstName: z.string().min(1, 'Admin first name is required'),
    adminLastName: z.string().min(1, 'Admin last name is required'),
    adminEmail: z.string().email('Invalid admin email'),
    adminPassword: z.string().min(6, 'Password must be at least 6 characters').optional(),
    subscriptionPlan: z.string().default('free'),
    maxAnimals: z.number().int().positive().default(100),
    maxUsers: z.number().int().positive().default(5),
});

export type TenantFormData = z.infer<typeof tenantSchema>;

export interface Tenant {
    id: string;
    name: string;
    subdomain: string;
    email: string;
    subscriptionPlan: string;
    isActive: boolean;
    maxAnimals: number;
    maxUsers: number;
    createdAt: string;
}
