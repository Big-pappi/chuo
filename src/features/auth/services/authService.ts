import apiClient, {updateApiClient} from '@/api/client';
import * as SecureStore from 'expo-secure-store';
import {universityConfig} from '@/api/university.config';

export interface LoginCredentials { email: string; password: string; universityId?: string; }
export interface SignUpCredentials { email: string; password: string; fullName: string; studentId: string; universityId: string; }
export interface AuthResponse {
  access: string;
  refresh: string;
  user: { id: string; email: string; fullName: string; studentId: string; universityId: string };
}

class AuthService {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly USER_DATA_KEY = 'user_data';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (credentials.universityId) await universityConfig.setSelectedUniversity(credentials.universityId);
    await updateApiClient();
    const response = await apiClient.post<AuthResponse>('/auth/login/', {
      email: credentials.email, password: credentials.password, universityId: credentials.universityId,
    });
    await this.storeAuthData(response.data);
    return response.data;
  }

  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    await universityConfig.setSelectedUniversity(credentials.universityId);
    await updateApiClient();
    const response = await apiClient.post<AuthResponse>('/auth/signup/', credentials);
    await this.storeAuthData(response.data);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.clearAuthData();
  }

  async refreshToken(): Promise<string> {
    const refresh = await SecureStore.getItemAsync(AuthService.REFRESH_TOKEN_KEY);
    if (!refresh) throw new Error('No refresh token available');
    const response = await apiClient.post<{access: string}>('/auth/refresh/', {refresh});
    await SecureStore.setItemAsync(AuthService.TOKEN_KEY, response.data.access);
    return response.data.access;
  }

  async forgotPassword(email: string, universityId: string): Promise<void> {
    await universityConfig.setSelectedUniversity(universityId);
    await updateApiClient();
    await apiClient.post('/auth/forgot-password/', {email});
  }

  async verifyOtp(email: string, otp: string): Promise<void> {
    await apiClient.post('/auth/verify-otp/', {email, otp});
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/reset-password/', {email, otp, newPassword});
  }

  async isAuthenticated(): Promise<boolean> { return !!(await SecureStore.getItemAsync(AuthService.TOKEN_KEY)); }
  async getToken(): Promise<string | null> { return SecureStore.getItemAsync(AuthService.TOKEN_KEY); }
  async getUserData(): Promise<AuthResponse['user'] | null> {
    const value = await SecureStore.getItemAsync(AuthService.USER_DATA_KEY);
    return value ? JSON.parse(value) : null;
  }

  private async storeAuthData(data: AuthResponse): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(AuthService.TOKEN_KEY, data.access),
      SecureStore.setItemAsync(AuthService.REFRESH_TOKEN_KEY, data.refresh),
      SecureStore.setItemAsync(AuthService.USER_DATA_KEY, JSON.stringify(data.user)),
    ]);
  }

  private async clearAuthData(): Promise<void> {
    await Promise.all([AuthService.TOKEN_KEY, AuthService.REFRESH_TOKEN_KEY, AuthService.USER_DATA_KEY].map(key => SecureStore.deleteItemAsync(key)));
  }
}

export default new AuthService();
