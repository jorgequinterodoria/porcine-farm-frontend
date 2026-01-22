import { z } from 'zod';

export const tenantSchema = z.object({
    name: z.string().min(1, 'Nombre de la granja es requerido'),
    subdomain: z.string().min(1, 'Subdominio es requerido').toLowerCase(),
    email: z.email('Correo electrónico inválido'),
    adminFirstName: z.string().min(1, 'Nombre del administrador es requerido'),
    adminLastName: z.string().min(1, 'Apellido del administrador es requerido'),
    adminEmail: z.email('Correo electrónico del administrador inválido'),
    adminPassword: z.string().min(6, 'Contraseña del administrador debe tener al menos 6 caracteres').optional(),
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
