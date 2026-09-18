import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { universityConfig } from './university.config';

// The mobile app talks only to Django. Provider URLs and credentials stay server-side.
const getAPIConfig = async () => {
  const university = await universityConfig.getSelectedUniversity();
  const baseURL = __DEV__
    ? 'https://chuo-backend-nine.vercel.app/api/v1'
    : 'https://chuo-backend-nine.vercel.app/api/v1';

  return {
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(university ? { 'X-University-ID': university.id } : {}),
    },
  };
};

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://chuo-backend-nine.vercel.app/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Update base URL when university changes
export const updateApiClient = async () => {
  const config = await getAPIConfig();
  apiClient.defaults.baseURL = config.baseURL;
  apiClient.defaults.headers = config.headers as any;
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await SecureStore.getItemAsync('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token
        const refreshToken = await SecureStore.getItemAsync('refresh_token');
        if (refreshToken) {
          const config = await getAPIConfig();
          const response = await axios.post(`${config.baseURL}/auth/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access, refresh } = response.data;
          
          // Update both access and refresh tokens
          await SecureStore.setItemAsync('auth_token', access);
          if (refresh) {
            await SecureStore.setItemAsync('refresh_token', refresh);
          }
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access}`;
          }
          
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - Clear tokens and redirect to login
        await SecureStore.deleteItemAsync('auth_token');
        await SecureStore.deleteItemAsync('refresh_token');
        await SecureStore.deleteItemAsync('user_data');
        
        // Navigate to login (handled by auth context)
        return Promise.reject(error);
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject({
        ...error,
        message: 'Network error. Please check your internet connection.',
      } as AxiosError);
    }

    // Handle other errors
    const errorMessage = (error.response.data as any)?.message || error.message || 'An error occurred';
    return Promise.reject({
      ...error,
      message: errorMessage,
    } as AxiosError);
  }
);

export default apiClient;
