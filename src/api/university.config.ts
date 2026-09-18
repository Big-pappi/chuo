import * as SecureStore from 'expo-secure-store';

export interface UniversityConfig {
  id: string;
  name: string;
  acronym: string;
  apiType: 'generic' | 'tcu' | 'udsm' | 'custom';
  baseUrl: string;
  logo?: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
  features: {
    results: boolean;
    fees: boolean;
    timetable: boolean;
    courseRegistration: boolean;
    library: boolean;
  };
}

// Supported Tanzanian Universities Configuration
export const UNIVERSITIES_CONFIG: UniversityConfig[] = [
  {
    id: 'udsm',
    name: 'University of Dar es Salaam',
    acronym: 'UDSM',
    apiType: 'udsm',
    baseUrl: 'https://aris2.udsm.ac.tz/api',
    theme: {
      primaryColor: '#1E88E5',
      secondaryColor: '#FFC107',
    },
    features: {
      results: true,
      fees: true,
      timetable: true,
      courseRegistration: true,
      library: true,
    },
  },
  {
    id: 'mzumbe',
    name: 'Mzumbe University',
    acronym: 'MU',
    apiType: 'generic',
    baseUrl: 'https://aris.mzumbe.ac.tz/api',
    theme: {
      primaryColor: '#2E7D32',
      secondaryColor: '#FF9800',
    },
    features: {
      results: true,
      fees: true,
      timetable: true,
      courseRegistration: true,
      library: false,
    },
  },
  {
    id: 'must',
    name: 'Mbeya University of Science and Technology',
    acronym: 'MUST',
    apiType: 'generic',
    baseUrl: 'https://sims.must.ac.tz/api',
    theme: {
      primaryColor: '#1565C0',
      secondaryColor: '#FF5722',
    },
    features: {
      results: true,
      fees: true,
      timetable: true,
      courseRegistration: true,
      library: false,
    },
  },
  {
    id: 'suza',
    name: 'State University of Zanzibar',
    acronym: 'SUZA',
    apiType: 'generic',
    baseUrl: 'https://portal.suza.ac.tz/api',
    theme: {
      primaryColor: '#00695C',
      secondaryColor: '#FFC107',
    },
    features: {
      results: true,
      fees: true,
      timetable: true,
      courseRegistration: true,
      library: true,
    },
  },
  {
    id: 'udom',
    name: 'University of Dodoma',
    acronym: 'UDOM',
    apiType: 'generic',
    baseUrl: 'https://aris.udom.ac.tz/api',
    theme: {
      primaryColor: '#6D4C41',
      secondaryColor: '#FF9800',
    },
    features: {
      results: true,
      fees: true,
      timetable: true,
      courseRegistration: true,
      library: true,
    },
  },
  {
    id: 'sua',
    name: 'Sokoine University of Agriculture',
    acronym: 'SUA',
    apiType: 'generic',
    baseUrl: 'https://sua.ac.tz/api',
    theme: {
      primaryColor: '#2E7D32',
      secondaryColor: '#FFC107',
    },
    features: {
      results: true,
      fees: true,
      timetable: true,
      courseRegistration: true,
      library: true,
    },
  },
];

// University Selection Management
export const universityConfig = {
  getSelectedUniversity: async (): Promise<UniversityConfig | null> => {
    const universityId = await SecureStore.getItemAsync('selected_university');
    if (!universityId) return null;
    return UNIVERSITIES_CONFIG.find(u => u.id === universityId) || null;
  },

  setSelectedUniversity: async (universityId: string): Promise<void> => {
    const university = UNIVERSITIES_CONFIG.find(u => u.id === universityId);
    if (university) {
      await SecureStore.setItemAsync('selected_university', universityId);
    }
  },

  getUniversityById: (id: string): UniversityConfig | undefined => {
    return UNIVERSITIES_CONFIG.find(u => u.id === id);
  },

  getAllUniversities: (): UniversityConfig[] => {
    return UNIVERSITIES_CONFIG;
  },

  clearSelectedUniversity: async (): Promise<void> => {
    await SecureStore.deleteItemAsync('selected_university');
  },
};

export default universityConfig;
