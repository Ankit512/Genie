// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance with base configuration
import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Get the auth token from Firebase
    const { getIdToken } = await import('../lib/firebase');
    const token = await getIdToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Redirect to login on auth error
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 