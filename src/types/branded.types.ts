





type BrandedType<T, Brand> = T & { readonly __brand: Brand };




export type TenantId = BrandedType<string, 'TenantId'>;
export type TenantName = BrandedType<string, 'TenantName'>;
export type TenantSubdomain = BrandedType<string, 'TenantSubdomain'>;
export type TenantPlan = 'free' | 'basic' | 'premium' | 'enterprise';




export type UserId = BrandedType<string, 'UserId'>;
export type UserEmail = BrandedType<string, 'UserEmail'>;
export type UserRole = 'super_admin' | 'farm_admin' | 'operator';
export type UserStatus = 'active' | 'inactive' | 'suspended';




export type AnimalId = BrandedType<string, 'AnimalId'>;
export type AnimalCode = BrandedType<string, 'AnimalCode'>;
export type AnimalSex = 'male' | 'female';
export type AnimalStatus = 'active' | 'sold' | 'deceased' | 'quarantine' | 'sick';
export type AnimalStage = 'piglet' | 'nursery' | 'fattening' | 'breeding';




export type FacilityId = BrandedType<string, 'FacilityId'>;
export type FacilityType = 'breeding' | 'fattening' | 'nursery' | 'quarantine' | 'slaughter';




export type PenId = BrandedType<string, 'PenId'>;
export type PenCode = BrandedType<string, 'PenCode'>;




export type JWTToken = BrandedType<string, 'JWTToken'>;
export type RefreshToken = BrandedType<string, 'RefreshToken'>;
export type SessionId = BrandedType<string, 'SessionId'>;




export const BrandedTypeUtils = {
  


  create: <T, Brand extends string>(value: T, _brand: Brand): BrandedType<T, Brand> => {
    return value as BrandedType<T, Brand>;
  },

  


  extract: <T>(brandedValue: BrandedType<T, any>): T => {
    return brandedValue as T;
  },

  


  isBrandedType: <T, Brand extends string>(value: any, _brand: Brand): value is BrandedType<T, Brand> => {
    return typeof value === 'object' && '__brand' in value;
  },

  


  hasBrand: (value: any): value is { __brand: string } => {
    return typeof value === 'object' && '__brand' in value;
  },

  


  createTenantId: (value: string): TenantId => {
    return BrandedTypeUtils.create(value, 'TenantId');
  },

  


  createUserId: (value: string): UserId => {
    return BrandedTypeUtils.create(value, 'UserId');
  },

  


  createAnimalId: (value: string): AnimalId => {
    return BrandedTypeUtils.create(value, 'AnimalId');
  },

  


  createFacilityId: (value: string): FacilityId => {
    return BrandedTypeUtils.create(value, 'FacilityId');
  },

  


  createPenId: (value: string): PenId => {
    return BrandedTypeUtils.create(value, 'PenId');
  },

  


  createJWTToken: (value: string): JWTToken => {
    return BrandedTypeUtils.create(value, 'JWTToken');
  },

  


  createUserEmail: (value: string): UserEmail => {
    return BrandedTypeUtils.create(value, 'UserEmail');
  },
};




export const BrandedTypeValidation = {
  


  isValidTenantId: (value: string): boolean => {
    
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidPattern.test(value);
  },

  


  isValidUserEmail: (value: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
  },

  


  isValidAnimalCode: (value: string): boolean => {
    
    const codePattern = /^[A-Z0-9-]{3,20}$/;
    return codePattern.test(value);
  },

  


  isValidAnimalId: (value: string): boolean => {
    
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidPattern.test(value);
  },

  


  isValidJWTToken: (value: string): boolean => {
    
    return value.split('.').length === 3;
  },
};




export const TypeSafeFactory = {
  


  createTenantId: (value: string): TenantId => {
    if (!BrandedTypeValidation.isValidTenantId(value)) {
      throw new Error(`Invalid TenantId format: ${value}`);
    }
    return BrandedTypeUtils.createTenantId(value);
  },

  


  createUserEmail: (value: string): UserEmail => {
    if (!BrandedTypeValidation.isValidUserEmail(value)) {
      throw new Error(`Invalid UserEmail format: ${value}`);
    }
    return BrandedTypeUtils.createUserEmail(value);
  },

  


  createAnimalId: (value: string): AnimalId => {
    if (!BrandedTypeValidation.isValidAnimalId(value)) {
      throw new Error(`Invalid AnimalId format: ${value}`);
    }
    return BrandedTypeUtils.createAnimalId(value);
  },
};




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




export const TypeGuards = {
  


  isTenantId: (value: any): value is TenantId => {
    return BrandedTypeUtils.isBrandedType(value, 'TenantId');
  },

  


  isUserId: (value: any): value is UserId => {
    return BrandedTypeUtils.isBrandedType(value, 'UserId');
  },

  


  isAnimalId: (value: any): value is AnimalId => {
    return BrandedTypeUtils.isBrandedType(value, 'AnimalId');
  },

  


  isJWTToken: (value: any): value is JWTToken => {
    return BrandedTypeUtils.isBrandedType(value, 'JWTToken');
  },
};




export const TypeConversion = {
  


  stringToTenantId: (value: string): TenantId => {
    return TypeSafeFactory.createTenantId(value);
  },

  


  stringToUserId: (value: string): UserId => {
    return BrandedTypeUtils.createUserId(value);
  },

  


  stringToAnimalId: (value: string): AnimalId => {
    return TypeSafeFactory.createAnimalId(value);
  },

  


  tenantIdToString: (tenantId: TenantId): string => {
    return BrandedTypeUtils.extract(tenantId);
  },

  


  userIdToString: (userId: UserId): string => {
    return BrandedTypeUtils.extract(userId);
  },

  


  animalIdToString: (animalId: AnimalId): string => {
    return BrandedTypeUtils.extract(animalId);
  },
};