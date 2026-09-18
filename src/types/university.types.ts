// University Types
export interface University {
  id: string;
  name: string;
  acronym: string;
  logo?: string;
  location: {
    region: string;
    district: string;
    address?: string;
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  apiConfig: {
    baseUrl: string;
    version: string;
    endpoints: UniversityEndpoints;
    authType: 'oauth' | 'api_key' | 'basic';
  };
  status: 'active' | 'inactive' | 'maintenance';
}

export interface UniversityEndpoints {
  auth: {
    login: string;
    logout: string;
    refreshToken?: string;
  };
  student: {
    profile: string;
    results: string;
    fees: string;
    timetable: string;
    courses: string;
  };
  academic?: {
    semesters: string;
    departments: string;
    programs: string;
  };
}

// Student Data Types
export interface StudentProfile {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  program: string;
  department: string;
  yearOfStudy: number;
  semester: number;
  gpa?: number;
  cgpa?: number;
  photo?: string;
}

export interface AcademicResult {
  id: string;
  courseCode: string;
  courseName: string;
  credits: number;
  grade: string;
  gradePoint: number;
  semester: string;
  academicYear: string;
}

export interface SemesterResults {
  semester: string;
  academicYear: string;
  gpa: number;
  courses: AcademicResult[];
}

export interface FeeRecord {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paymentDate?: string;
  receiptNumber?: string;
}

export interface TimetableEntry {
  id: string;
  courseCode: string;
  courseName: string;
  day: string;
  startTime: string;
  endTime: string;
  location: string;
  lecturer?: string;
}

export interface Course {
  code: string;
  name: string;
  credits: number;
  semester: string;
  lecturer?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth Types
export interface LoginCredentials {
  universityId: string;
  studentId: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: StudentProfile;
  university: University;
}
