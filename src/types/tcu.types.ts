// TCU (Tanzania Commission for Universities) API Types
// Based on TCU API Specification v4.3

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface TCUApplicant {
  institutionId: string;
  formFourIndex: string;
  formSixIndex?: string;
  category: string;
  status: 'pending' | 'verified' | 'admitted' | 'rejected';
  programmeChoices?: TCUProgrammeChoice[];
  verificationStatus?: string;
}

export interface TCUProgrammeChoice {
  programmeCode: string;
  programmeName: string;
  priority: number;
  institutionId: string;
}

export interface TCUAdmission {
  institutionId: string;
  formFourIndex: string;
  programmeCode: string;
  programmeName: string;
  admissionStatus: 'admitted' | 'pending' | 'rejected';
  confirmationCode?: string;
  admissionDate?: string;
}

export interface TCUProgramme {
  programmeCode: string;
  programmeName: string;
  institutionId: string;
  institutionName: string;
  degreeLevel: 'certificate' | 'diploma' | 'bachelor' | 'master' | 'phd';
  duration: number;
  admissionCapacity: number;
}

export interface TCUInstitution {
  institutionId: string;
  institutionName: string;
  acronym: string;
  region: string;
  district: string;
  type: 'public' | 'private';
  establishedYear: number;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface TCUStatistics {
  totalApplicants: number;
  totalAdmitted: number;
  totalEnrolled: number;
  byProgramme: Array<{
    programmeCode: string;
    programmeName: string;
    applicants: number;
    admitted: number;
    enrolled: number;
  }>;
  byGender: {
    male: number;
    female: number;
  };
}

export interface TCUDashboardData {
  institutionId: string;
  academicYear: string;
  statistics: TCUStatistics;
  lastUpdated: string;
}
