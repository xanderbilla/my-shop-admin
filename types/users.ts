export interface Address {
  id: string;
  title: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
  type: "HOME" | "WORK" | "OTHER";
  coordinates?: {
    lat: number | null;
    lng: number | null;
  };
}

export interface User {
  userId: string;
  username: string;
  custName: string;
  email: string;
  phone: string | null;
  gender: string | null;
  profilePicture: string | null;
  enabled: boolean;
  addresses: Address[];
  preferences: {
    newsletter: boolean;
    notifications: boolean;
    language: string;
    currency: string;
    theme: string;
  };
  accountStats: {
    totalOrders: number;
    totalSpent: number;
    favoriteCategories: string[];
    wishlistCount: number;
  };
  roles: string[];
  userStatus: string;
  kycVerified: boolean;
  fraudRisk: string;
  consent: {
    marketing: boolean;
    dataSharing: boolean;
  };
  deleteStatus: {
    isDeleted: boolean;
    restoresCount: number;
    deletedAt: string | null;
    restoreAt: string | null;
  };
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
  createdBy: string;
  updatedBy: string;
}

export interface UsersResponse {
  message: string;
  data: {
    data: User[];
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  success: boolean;
  status: number;
  timestamp: string;
}

export interface UserResponse {
  message: string;
  data: User;
  success: boolean;
  status: number;
  timestamp: string;
}

export interface UsersTableFilters {
  page: number;
  limit: number;
  query?: string;
  userStatus?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: string;
}
