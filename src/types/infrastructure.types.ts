import { z } from 'zod';

export const facilitySchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  code: z.string().min(2, 'El código debe tener al menos 2 caracteres'),
  facilityType: z.string().min(1, 'El tipo de instalación es requerido'),
  capacity: z.coerce.number().min(1, 'La capacidad debe ser mayor a 0'),
});

export const penSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  code: z.string().min(2, 'El código debe tener al menos 2 caracteres'),
  capacity: z.coerce.number().min(1, 'La capacidad debe ser mayor a 0'),
  facilityId: z.string().uuid('Debe seleccionar una instalación válida'),
});

export type FacilityFormData = z.infer<typeof facilitySchema>;
export type PenFormData = z.infer<typeof penSchema>;
