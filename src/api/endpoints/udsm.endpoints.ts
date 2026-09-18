import apiClient from '../client';
import {
  ApiResponse,
  StudentProfile,
  SemesterResults,
  FeeRecord,
  TimetableEntry,
  LoginCredentials,
  AuthResponse,
} from '@/types/university.types';

// UDSM (University of Dar es Salaam) ARIS API Service
// Based on ARIS 3 system
export const udsmApi = {
  baseURL: 'https://aris2.udsm.ac.tz/api',

  // Authentication
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      `${this.baseURL}/auth/login`,
      {
        ...credentials,
        institution: 'UDSM',
      }
    );
    return response.data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post(`${this.baseURL}/auth/logout`);
  },

  // Student Profile
  async getStudentProfile(): Promise<StudentProfile> {
    const response = await apiClient.get<ApiResponse<StudentProfile>>(
      `${this.baseURL}/student/profile`
    );
    return response.data.data;
  },

  async updateStudentProfile(data: Partial<StudentProfile>): Promise<StudentProfile> {
    const response = await apiClient.put<ApiResponse<StudentProfile>>(
      `${this.baseURL}/student/profile`,
      data
    );
    return response.data.data;
  },

  // Academic Results
  async getResults(semester?: string): Promise<SemesterResults[]> {
    const params = semester ? { semester } : {};
    const response = await apiClient.get<ApiResponse<SemesterResults[]>>(
      `${this.baseURL}/student/results`,
      { params }
    );
    return response.data.data;
  },

  async getTranscript(): Promise<SemesterResults[]> {
    const response = await apiClient.get<ApiResponse<SemesterResults[]>>(
      `${this.baseURL}/student/transcript`
    );
    return response.data.data;
  },

  async getCGPA(): Promise<{ cgpa: number; totalCredits: number }> {
    const response = await apiClient.get<ApiResponse<{ cgpa: number; totalCredits: number }>>(
      `${this.baseURL}/student/cgpa`
    );
    return response.data.data;
  },

  // Fees
  async getFees(): Promise<FeeRecord[]> {
    const response = await apiClient.get<ApiResponse<FeeRecord[]>>(
      `${this.baseURL}/student/fees`
    );
    return response.data.data;
  },

  async getPaymentHistory(): Promise<FeeRecord[]> {
    const response = await apiClient.get<ApiResponse<FeeRecord[]>>(
      `${this.baseURL}/student/payments`
    );
    return response.data.data;
  },

  async getFeeStatement(academicYear: string): Promise<FeeRecord[]> {
    const response = await apiClient.get<ApiResponse<FeeRecord[]>>(
      `${this.baseURL}/student/fee-statement`,
      { params: { academicYear } }
    );
    return response.data.data;
  },

  // Timetable
  async getTimetable(): Promise<TimetableEntry[]> {
    const response = await apiClient.get<ApiResponse<TimetableEntry[]>>(
      `${this.baseURL}/student/timetable`
    );
    return response.data.data;
  },

  async getExamSchedule(): Promise<TimetableEntry[]> {
    const response = await apiClient.get<ApiResponse<TimetableEntry[]>>(
      `${this.baseURL}/student/exam-schedule`
    );
    return response.data.data;
  },

  // Course Registration
  async getAvailableCourses(semester: string): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(
      `${this.baseURL}/student/courses/available`,
      { params: { semester } }
    );
    return response.data.data;
  },

  async registerCourses(courses: string[]): Promise<void> {
    await apiClient.post(`${this.baseURL}/student/courses/register`, { courses });
  },

  async getRegisteredCourses(semester: string): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(
      `${this.baseURL}/student/courses/registered`,
      { params: { semester } }
    );
    return response.data.data;
  },
};

export default udsmApi;
