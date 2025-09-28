import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log("API Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("API Error:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
    });

    // Handle network errors
    if (!error.response) {
      console.error("Network Error - Is the server running?");
    }

    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authApi = {
  signin: (data: { username: string; password: string }) =>
    api.post("/auth/signin", data),

  signup: (data: {
    username: string;
    name: string;
    email: string;
    password: string;
  }) => api.post("/auth/signup", data),

  forgotPassword: (data: { email: string }) =>
    api.post("/auth/forgot-password", data),

  resendOtp: (data: { email: string }) => api.post("/auth/resend-otp", data),

  verify: (data: { username: string; verificationCode: string }) =>
    api.post("/auth/verify", data),

  resetPassword: (data: {
    email: string;
    verificationCode: string;
    newPassword: string;
  }) => api.post("/auth/reset-password", data),

  me: () => api.get("/auth/me"),
};

// Users API endpoints
export const usersApi = {
  getUsers: (params?: {
    page?: number;
    limit?: number;
    query?: string;
    userStatus?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => api.get("/admin/users", { params }),

  getUser: (userId: string) => api.get(`/admin/users/${userId}`),

  deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),

  restoreUser: (userId: string) => api.post(`/admin/users/${userId}/restore`),

  updateUserRole: (userId: string, roles: string[]) =>
    api.put(`/admin/users/${userId}/roles`, { roles }),

  updateUserStatus: (userId: string, status: string) =>
    api.put(`/admin/users/${userId}/status`, { status }),

  verifyUser: (userId: string) => api.put(`/admin/users/${userId}/verify`),

  verifyKyc: (userId: string) => api.put(`/admin/users/${userId}/verify-kyc`),

  updateFraudRisk: (userId: string, risk: string) =>
    api.put(`/admin/users/${userId}/risk`, { risk }),

  updateDefaultAddress: (userId: string, addressId: string) =>
    api.post(`/admin/users/${userId}/address/${addressId}/default`),
};
