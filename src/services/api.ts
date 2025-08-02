import axios, { AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL, API_TIMEOUT, LOCAL_STORAGE_KEYS } from '../constants';
import type { ApiResponse } from '../types';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Generic API methods
export const apiClient = {
  // GET request
  get: async <T>(url: string, params?: any): Promise<ApiResponse<T>> => {
    try {
      const response = await api.get(url, { params });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  // POST request
  post: async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    try {
      const response = await api.post(url, data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  // PUT request
  put: async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    try {
      const response = await api.put(url, data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  // PATCH request
  patch: async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    try {
      const response = await api.patch(url, data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  // DELETE request
  delete: async <T>(url: string): Promise<ApiResponse<T>> => {
    try {
      const response = await api.delete(url);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  // File upload
  upload: async <T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
};

// Error handler
function handleApiError(error: AxiosError): ApiResponse<never> {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    return {
      success: false,
      message: (data as any)?.message || `HTTP Error ${status}`,
      errors: (data as any)?.errors || [],
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      errors: ['NETWORK_ERROR'],
    };
  } else {
    // Something else happened
    return {
      success: false,
      message: 'An unexpected error occurred.',
      errors: ['UNKNOWN_ERROR'],
    };
  }
}

// Specific API service functions
export const authService = {
  // Basic authentication
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  
  register: (userData: any) =>
    apiClient.post('/auth/register', userData),
  
  logout: () =>
    apiClient.post('/auth/logout'),
  
  refreshToken: () =>
    apiClient.post('/auth/refresh'),
  
  // Password management
  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    apiClient.post('/auth/reset-password', { token, password }),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.post('/auth/change-password', { currentPassword, newPassword }),
  
  // Email verification
  verifyEmail: (token: string) =>
    apiClient.post('/auth/verify-email', { token }),
  
  resendVerificationEmail: () =>
    apiClient.post('/auth/resend-verification'),
  
  // Two-factor authentication
  setupTwoFactor: () =>
    apiClient.post('/auth/setup-2fa'),
  
  verifyTwoFactor: (code: string, backupCode?: string) =>
    apiClient.post('/auth/verify-2fa', { code, backupCode }),
  
  disableTwoFactor: () =>
    apiClient.post('/auth/disable-2fa'),
  
  generateBackupCodes: () =>
    apiClient.post('/auth/generate-backup-codes'),
  
  // Social authentication
  googleAuth: (token: string) =>
    apiClient.post('/auth/google', { token }),
  
  facebookAuth: (token: string) =>
    apiClient.post('/auth/facebook', { token }),
  
  appleAuth: (token: string) =>
    apiClient.post('/auth/apple', { token }),
  
  // Profile management
  updateProfile: (data: any) =>
    apiClient.put('/auth/profile', data),
  
  uploadAvatar: (file: File, onProgress?: (progress: number) => void) =>
    apiClient.upload('/auth/avatar', file, onProgress),
  
  deleteAccount: () =>
    apiClient.delete('/auth/account'),
  
  // Session management
  checkSession: () =>
    apiClient.get('/auth/session'),
  
  getSessions: () =>
    apiClient.get('/auth/sessions'),
  
  revokeSession: (sessionId: string) =>
    apiClient.delete(`/auth/sessions/${sessionId}`),
  
  revokeAllSessions: () =>
    apiClient.delete('/auth/sessions'),
};

export const userService = {
  getProfile: () =>
    apiClient.get('/users/profile'),
  
  updateProfile: (data: any) =>
    apiClient.put('/users/profile', data),
  
  uploadAvatar: (file: File, onProgress?: (progress: number) => void) =>
    apiClient.upload('/users/avatar', file, onProgress),
};

export const universityService = {
  getUniversities: (params?: any) =>
    apiClient.get('/universities', params),
  
  getUniversity: (id: string) =>
    apiClient.get(`/universities/${id}`),
  
  searchUniversities: (query: string, filters?: any) =>
    apiClient.get('/universities/search', { query, ...filters }),
};

export const applicationService = {
  getApplications: () =>
    apiClient.get('/applications'),
  
  getApplication: (id: string) =>
    apiClient.get(`/applications/${id}`),
  
  createApplication: (data: any) =>
    apiClient.post('/applications', data),
  
  updateApplication: (id: string, data: any) =>
    apiClient.put(`/applications/${id}`, data),
  
  deleteApplication: (id: string) =>
    apiClient.delete(`/applications/${id}`),
  
  submitApplication: (id: string) =>
    apiClient.post(`/applications/${id}/submit`),
};

export const documentService = {
  getDocuments: () =>
    apiClient.get('/documents'),
  
  uploadDocument: (file: File, type: string, onProgress?: (progress: number) => void) =>
    apiClient.upload('/documents', file, onProgress),
  
  deleteDocument: (id: string) =>
    apiClient.delete(`/documents/${id}`),
};

// Export the configured axios instance for direct use if needed
export default api;