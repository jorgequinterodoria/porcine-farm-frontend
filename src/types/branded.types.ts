// Branded types for enhanced type safety
// These prevent accidental assignment between similar types

/**
 * Base type for branded types
 */
type BrandedType<T, Brand> = T & { readonly __brand: Brand };

/**
 * Tenant-related types
 */
export type TenantId = BrandedType<string, 'TenantId'>;
export type TenantName = BrandedType<string, 'TenantName'>;
export type TenantSubdomain = BrandedType<string, 'TenantSubdomain'>;
export type TenantPlan = 'free' | 'basic' | 'premium' | 'enterprise';

/**
 * User-related types
 */
export type UserId = BrandedType<string, 'UserId'>;
export type UserEmail = BrandedType<string, 'UserEmail'>;
export type UserRole = 'super_admin' | 'farm_admin' | 'operator';
export type UserStatus = 'active' | 'inactive' | 'suspended';

/**
 * Animal-related types
 */
export type AnimalId = BrandedType<string, 'AnimalId'>;
export type AnimalCode = BrandedType<string, 'AnimalCode'>;
export type AnimalSex = 'male' | 'female';
export type AnimalStatus = 'active' | 'sold' | 'deceased' | 'quarantine' | 'sick';
export type AnimalStage = 'piglet' | 'nursery' | 'fattening' | 'breeding';

/**
 * Facility-related types
 */
export type FacilityId = BrandedType<string, 'FacilityId'>;
export type FacilityType = 'breeding' | 'fattening' | 'nursery' | 'quarantine' | 'slaughter';

/**
 * Pen-related types
 */
export type PenId = BrandedType<string, 'PenId'>;
export type PenCode = BrandedType<string, 'PenCode'>;

/**
 * Authentication-related types
 */
export type JWTToken = BrandedType<string, 'JWTToken'>;
export type RefreshToken = BrandedType<string, 'RefreshToken'>;
export type SessionId = BrandedType<string, 'SessionId'>;

/**
 * Utility functions for working with branded types
 */
export const BrandedTypeUtils = {
  /**
   * Create a branded type value
   */
  create: <T, Brand extends string>(value: T, brand: Brand): BrandedType<T, Brand> => {
    return value as BrandedType<T, Brand>;
  },

  /**
   * Extract the underlying value from a branded type
   */
  extract: <T>(brandedValue: BrandedType<T, any>): T => {
    return brandedValue as T;
  },

  /**
   * Type guard for branded types
   */
  isBrandedType: <T, Brand extends string>(value: any, brand: Brand): value is BrandedType<T, Brand> => {
    return typeof value === 'object' && '__brand' in value;
  },

  /**
   * Check if a value has a brand (for any brand)
   */
  hasBrand: (value: any): value is { __brand: string } => {
    return typeof value === 'object' && '__brand' in value;
  },

  /**
   * Create a TenantId
   */
  createTenantId: (value: string): TenantId => {
    return BrandedTypeUtils.create(value, 'TenantId');
  },

  /**
   * Create a UserId
   */
  createUserId: (value: string): UserId => {
    return BrandedTypeUtils.create(value, 'UserId');
  },

  /**
   * Create an AnimalId
   */
  createAnimalId: (value: string): AnimalId => {
    return BrandedTypeUtils.create(value, 'AnimalId');
  },

  /**
   * Create a FacilityId
   */
  createFacilityId: (value: string): FacilityId => {
    return BrandedTypeUtils.create(value, 'FacilityId');
  },

  /**
   * Create a PenId
   */
  createPenId: (value: string): PenId => {
    return BrandedTypeUtils.create(value, 'PenId');
  },

  /**
   * Create a JWTToken
   */
  createJWTToken: (value: string): JWTToken => {
    return BrandedTypeUtils.create(value, 'JWTToken');
  },

  /**
   * Create a UserEmail
   */
  createUserEmail: (value: string): UserEmail => {
    return BrandedTypeUtils.create(value, 'UserEmail');
  },

  /**
   * Create a UserId
   */
  createUserId: (value: string): UserId => {
    return BrandedTypeUtils.create(value, 'UserId' as any);
  },

  /**
   * Create an AnimalId
   */
  createAnimalId: (value: string): AnimalId => {
    return BrandedTypeUtils.create(value, 'AnimalId' as any);
  },

  /**
   * Create a FacilityId
   */
  createFacilityId: (value: string): FacilityId => {
    return BrandedTypeUtils.create(value, 'FacilityId' as any);
  },

  /**
   * Create a PenId
   */
  createPenId: (value: string): PenId => {
    return BrandedTypeUtils.create(value, 'PenId' as any);
  },

  /**
   * Create a JWTToken
   */
  createJWTToken: (value: string): JWTToken => {
    return BrandedTypeUtils.create(value, 'JWTToken' as any);
  },

  /**
   * Create a UserEmail
   */
  createUserEmail: (value: string): UserEmail => {
    return BrandedTypeUtils.create(value, 'UserEmail' as any);
  },
};

/**
 * Validation functions for branded types
 */
export const BrandedTypeValidation = {
  /**
   * Validate tenant ID format
   */
  isValidTenantId: (value: string): boolean => {
    // UUID v4 pattern
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidPattern.test(value);
  },

  /**
   * Validate user email format
   */
  isValidUserEmail: (value: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
  },

  /**
   * Validate animal code format
   */
  isValidAnimalCode: (value: string): boolean => {
    // Alphanumeric with optional hyphens, 3-20 chars
    const codePattern = /^[A-Z0-9-]{3,20}$/;
    return codePattern.test(value);
  },

  /**
   * Validate animal ID format
   */
  isValidAnimalId: (value: string): boolean => {
    // UUID v4 pattern
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidPattern.test(value);
  },

  /**
   * Validate JWT token format
   */
  isValidJWTToken: (value: string): boolean {
    // JWT tokens have 3 parts separated by dots
    return value.split('.').length === 3;
  },
};

/**
 * Type-safe factory functions with validation
 */
export const TypeSafeFactory = {
  /**
   * Create a TenantId with validation
   */
  createTenantId: (value: string): TenantId => {
    if (!BrandedTypeValidation.isValidTenantId(value)) {
      throw new Error(`Invalid TenantId format: ${value}`);
    }
    return BrandedTypeUtils.createTenantId(value);
  },

  /**
   * Create a UserEmail with validation
   */
  createUserEmail: (value: string): UserEmail => {
    if (!BrandedTypeValidation.isValidUserEmail(value)) {
      throw new Error(`Invalid UserEmail format: ${value}`);
    }
    return BrandedTypeUtils.createUserEmail(value);
  },

  /**
   * Create an AnimalId with validation
   */
  createAnimalId: (value: string): AnimalId => {
    if (!BrandedTypeValidation.isValidAnimalId(value)) {
      throw new Error(`Invalid AnimalId format: ${value}`);
    }
    return BrandedTypeUtils.createAnimalId(value);
  },
};

/**
 * Database result types with branded IDs
 */
export interface DatabaseTenant {
  id: TenantId;
  name: TenantName;
  subdomain: TenantSubdomain;
  plan: TenantPlan;
  maxUsers: number;
  maxAnimals: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseUser {
  id: UserId;
  tenantId: TenantId;
  email: UserEmail;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseAnimal {
  id: AnimalId;
  tenantId: TenantId;
  internalCode: AnimalCode;
  identificationNumber?: string;
  electronicId?: string;
  visualId?: string;
  sex: AnimalSex;
  birthDate: Date;
  birthWeight?: number;
  currentWeight?: number;
  currentStatus: AnimalStatus;
  stage: AnimalStage;
  breed?: string;
  currentPenId?: PenId;
  motherId?: AnimalId;
  fatherId?: AnimalId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseFacility {
  id: FacilityId;
  tenantId: TenantId;
  name: string;
  type: FacilityType;
  capacity: number;
  currentOccupancy: number;
  address?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabasePen {
  id: PenId;
  tenantId: TenantId;
  facilityId: FacilityId;
  name: string;
  code: PenCode;
  type: FacilityType;
  capacity: number;
  currentOccupancy: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Authentication DTOs with branded types
 */
export interface LoginRequest {
  email: UserEmail;
  password: string;
}

export interface LoginResponse {
  user: {
    id: UserId;
    email: UserEmail;
    firstName: string;
    lastName: string;
    role: UserRole;
    tenantId: TenantId;
  };
  tenant?: {
    id: TenantId;
    name: TenantName;
    subdomain: TenantSubdomain;
    plan: TenantPlan;
  };
  token: JWTToken;
  expiresIn: string;
}

export interface RegisterRequest {
  email: UserEmail;
  password: string;
  firstName: string;
  lastName: string;
  tenantName: TenantName;
  tenantSubdomain: TenantSubdomain;
}

/**
 * API response types with branded types
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Type guards for runtime validation
 */
export const TypeGuards = {
  /**
   * Check if a value is a TenantId
   */
  isTenantId: (value: any): value is TenantId => {
    return BrandedTypeUtils.isBrandedType(value, 'TenantId');
  },

  /**
   * Check if a value is a UserId
   */
  isUserId: (value: any): value is UserId => {
    return BrandedTypeUtils.isBrandedType(value, 'UserId');
  },

  /**
   * Check if a value is an AnimalId
   */
  isAnimalId: (value: any): value is AnimalId => {
    return BrandedTypeUtils.isBrandedType(value, 'AnimalId');
  },

  /**
   * Check if a value is a JWTToken
   */
  isJWTToken: (value: any): value is JWTToken => {
    return BrandedTypeUtils.isBrandedType(value, 'JWTToken');
  },
};

/**
 * Conversion utilities
 */
export const TypeConversion = {
  /**
   * Convert string to TenantId (with validation)
   */
  stringToTenantId: (value: string): TenantId => {
    return TypeSafeFactory.createTenantId(value);
  },

  /**
   * Convert string to UserId (with validation)
   */
  stringToUserId: (value: string): UserId => {
    return BrandedTypeUtils.createUserId(value);
  },

  /**
   * Convert string to AnimalId (with validation)
   */
  stringToAnimalId: (value: string): AnimalId => {
    return TypeSafeFactory.createAnimalId(value);
  },

  /**
   * Convert TenantId to string
   */
  tenantIdToString: (tenantId: TenantId): string => {
    return BrandedTypeUtils.extract(tenantId);
  },

  /**
   * Convert UserId to string
   */
  userIdToString: (userId: UserId): string => {
    return BrandedTypeUtils.extract(userId);
  },

  /**
   * Convert AnimalId to string
   */
  animalIdToString: (animalId: AnimalId): string => {
    return BrandedTypeUtils.extract(animalId);
  },
};