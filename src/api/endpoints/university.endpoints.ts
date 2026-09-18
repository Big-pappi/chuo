import apiClient from '../client';
import {
  University,
  StudentProfile,
  SemesterResults,
  FeeRecord,
  TimetableEntry,
  ApiResponse,
  LoginCredentials,
  AuthResponse,
} from '../../types/university.types';

// University API Service
export const universityApi = {
  // Authentication
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      `/auth/login`,
      credentials
    );
    return response.data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const response = await apiClient.post<ApiResponse<{ token: string }>>(
      '/auth/refresh',
      { refreshToken }
    );
    return response.data.data;
  },

  // Student Profile
  async getStudentProfile(): Promise<StudentProfile> {
    const response = await apiClient.get<ApiResponse<StudentProfile>>(
      '/student/profile'
    );
    return response.data.data;
  },

  async updateStudentProfile(data: Partial<StudentProfile>): Promise<StudentProfile> {
    const response = await apiClient.put<ApiResponse<StudentProfile>>(
      '/student/profile',
      data
    );
    return response.data.data;
  },

  // Academic Results
  async getResults(semester?: string): Promise<SemesterResults[]> {
    const params = semester ? { semester } : {};
    const response = await apiClient.get<ApiResponse<SemesterResults[]>>(
      '/student/results',
      { params }
    );
    return response.data.data;
  },

  async getTranscript(): Promise<SemesterResults[]> {
    const response = await apiClient.get<ApiResponse<SemesterResults[]>>(
      '/student/transcript'
    );
    return response.data.data;
  },

  // Fees
  async getFees(): Promise<FeeRecord[]> {
    const response = await apiClient.get<ApiResponse<FeeRecord[]>>(
      '/student/fees'
    );
    return response.data.data;
  },

  async getPaymentHistory(): Promise<FeeRecord[]> {
    const response = await apiClient.get<ApiResponse<FeeRecord[]>>(
      '/student/payments'
    );
    return response.data.data;
  },

  // Timetable
  async getTimetable(): Promise<TimetableEntry[]> {
    const response = await apiClient.get<ApiResponse<TimetableEntry[]>>(
      '/student/timetable'
    );
    return response.data.data;
  },

  // Universities Directory
  async getUniversities(): Promise<University[]> {
    const response = await apiClient.get<ApiResponse<University[]>>(
      '/universities'
    );
    return response.data.data;
  },

  async getUniversityById(id: string): Promise<University> {
    const response = await apiClient.get<ApiResponse<University>>(
      `/universities/${id}`
    );
    return response.data.data;
  },
};

export default universityApi;
