import apiClient from '../client';
import {
  ApiResponse,
  TCUApplicant,
  TCUAdmission,
  TCUProgramme,
  TCUInstitution,
} from '@/types/tcu.types';

// TCU (Tanzania Commission for Universities) API Service
// Based on TCU API Specification v4.3
export const tcuApi = {
  // Base URL for TCU API
  baseURL: 'https://api.tcu.go.tz',

  // Applicant Management
  async checkApplicantStatus(formData: {
    institutionId: string;
    formFourIndex: string;
    formSixIndex?: string;
    category: string;
  }): Promise<TCUApplicant> {
    const response = await apiClient.post<ApiResponse<TCUApplicant>>(
      `${this.baseURL}/applicants/checkStatus`,
      formData
    );
    return response.data.data;
  },

  async addApplicant(formData: {
    institutionId: string;
    formFourIndex: string;
    formSixIndex?: string;
    category: string;
    otherFormFourIndexes?: string[];
    otherFormSixIndexes?: string[];
  }): Promise<TCUApplicant> {
    const response = await apiClient.post<ApiResponse<TCUApplicant>>(
      `${this.baseURL}/applicants/add`,
      formData
    );
    return response.data.data;
  },

  async submitProgrammeChoices(formData: {
    institutionId: string;
    formFourIndex: string;
    programmeChoices: Array<{
      programmeCode: string;
      priority: number;
    }>;
  }): Promise<void> {
    await apiClient.post(
      `${this.baseURL}/applicants/submitProgramme`,
      formData
    );
  },

  async getApplicantVerificationStatus(formData: {
    institutionId: string;
    formFourIndex: string;
  }): Promise<{ status: string; verified: boolean }> {
    const response = await apiClient.post<ApiResponse<{ status: string; verified: boolean }>>(
      `${this.baseURL}/applicants/getApplicantVerificationStatus`,
      formData
    );
    return response.data.data;
  },

  async submitEnrolledStudents(students: Array<{
    institutionId: string;
    registrationNumber: string;
    programmeCode: string;
    academicYear: string;
  }>): Promise<void> {
    await apiClient.post(
      `${this.baseURL}/applicants/submitEnrolledStudents`,
      { students }
    );
  },

  // Admission Management
  async confirmAdmission(formData: {
    institutionId: string;
    formFourIndex: string;
    programmeCode: string;
    confirmationCode: string;
  }): Promise<void> {
    await apiClient.post(
      `${this.baseURL}/admission/confirm`,
      formData
    );
  },

  async getAdmittedApplicants(institutionId: string): Promise<TCUAdmission[]> {
    const response = await apiClient.post<ApiResponse<TCUAdmission[]>>(
      `${this.baseURL}/admission/getAdmitted`,
      { institutionId }
    );
    return response.data.data;
  },

  async getProgrammesWithAdmitted(institutionId: string): Promise<TCUProgramme[]> {
    const response = await apiClient.post<ApiResponse<TCUProgramme[]>>(
      `${this.baseURL}/admission/getProgrammes`,
      { institutionId }
    );
    return response.data.data;
  },

  async requestConfirmationCode(formData: {
    institutionId: string;
    formFourIndex: string;
    programmeCode: string;
  }): Promise<{ confirmationCode: string }> {
    const response = await apiClient.post<ApiResponse<{ confirmationCode: string }>>(
      `${this.baseURL}/admission/requestConfirmationCode`,
      formData
    );
    return response.data.data;
  },

  // Dashboard and Reporting
  async populateDashboard(formData: {
    institutionId: string;
    statistics: Array<{
      programmeCode: string;
      maleCount: number;
      femaleCount: number;
    }>;
  }): Promise<void> {
    await apiClient.post(
      `${this.baseURL}/dashboard/populate`,
      formData
    );
  },

  async getDashboardStatistics(institutionId: string): Promise<{
    totalApplicants: number;
    totalAdmitted: number;
    totalEnrolled: number;
    byProgramme: Array<{
      programmeCode: string;
      applicants: number;
      admitted: number;
      enrolled: number;
    }>;
  }> {
    const response = await apiClient.get<ApiResponse<any>>(
      `${this.baseURL}/dashboard/statistics`,
      { params: { institutionId } }
    );
    return response.data.data;
  },

  // Institutions
  async getInstitutions(): Promise<TCUInstitution[]> {
    const response = await apiClient.get<ApiResponse<TCUInstitution[]>>(
      `${this.baseURL}/institutions`
    );
    return response.data.data;
  },

  async getInstitutionById(institutionId: string): Promise<TCUInstitution> {
    const response = await apiClient.get<ApiResponse<TCUInstitution>>(
      `${this.baseURL}/institutions/${institutionId}`
    );
    return response.data.data;
  },

  // Foreign Applicants
  async submitForeignApplicants(formData: {
    institutionId: string;
    applicants: Array<{
      passportNumber: string;
      nationality: string;
      programmeCode: string;
    }>;
  }): Promise<void> {
    await apiClient.post(
      `${this.baseURL}/applicants/submitForeignApplicants`,
      formData
    );
  },
};

export default tcuApi;
