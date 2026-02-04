/* eslint-disable react-refresh/only-export-components */
import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import type { Animal } from '../../types/animal.types';
import type { User } from '../../types/user.types';
import type { Tenant } from '../../types/tenant.types';
import type { Batch } from '../../types/batch.types';
import type { Facility, Pen } from '../../types/farm.types';


const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
});


const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const testQueryClient = createTestQueryClient();
  
  return (
    <QueryClientProvider client={testQueryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });


export const createMockAnimal = (overrides: Partial<Animal> = {}): Animal => ({
  id: 'animal-1',
  internalCode: 'ANIMAL-001',
  identificationNumber: 'ID-001',
  breed: 'Yorkshire',
  gender: 'male',
  birthDate: '2024-01-01',
  status: 'active',
  currentWeight: 50.5,
  createdAt: '2024-01-01T00:00:00Z',
  tenantId: 'tenant-1',
  ...overrides,
} as Animal);

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-1',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'farm_admin',
  tenantId: 'tenant-1',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
} as User);

export const createMockTenant = (overrides: Partial<Tenant> = {}): Tenant => ({
  id: 'tenant-1',
  name: 'Test Farm',
  subdomain: 'testfarm',
  plan: 'basic',
  maxUsers: 5,
  maxAnimals: 100,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
} as Tenant);

export const createMockBatch = (overrides: Partial<Batch> = {}): Batch => ({
  id: 'batch-1',
  code: 'BATCH-A',
  name: 'Batch A',
  description: 'Test batch',
  animalCount: 25,
  status: 'active',
  startDate: '2024-01-01',
  tenantId: 'tenant-1',
  ...overrides,
} as Batch);

export const createMockFacility = (overrides: Partial<Facility> = {}): Facility => ({
  id: 'facility-1',
  name: 'Main Facility',
  type: 'breeding',
  capacity: 100,
  currentOccupancy: 75,
  tenantId: 'tenant-1',
  status: 'active',
  ...overrides,
} as Facility);

export const createMockPen = (overrides: Partial<Pen> = {}): Pen => ({
  id: 'pen-1',
  code: 'PEN-A',
  name: 'Pen A',
  facilityId: 'facility-1',
  capacity: 20,
  currentOccupancy: 15,
  type: 'breeding',
  tenantId: 'tenant-1',
  status: 'active',
  ...overrides,
} as Pen);


export * from '@testing-library/react';
export { customRender as render };
export { default as userEvent } from '@testing-library/user-event';