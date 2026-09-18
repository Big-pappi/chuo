import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// Backend data access is intentionally disabled while the UI is being built.
import {
  University,
  StudentProfile,
  SemesterResults,
  FeeRecord,
  TimetableEntry,
} from '../../types/university.types';

interface UniversityState {
  universities: University[];
  selectedUniversity: University | null;
  studentProfile: StudentProfile | null;
  results: SemesterResults[];
  fees: FeeRecord[];
  paymentHistory: FeeRecord[];
  timetable: TimetableEntry[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UniversityState = {
  universities: [],
  selectedUniversity: null,
  studentProfile: null,
  results: [],
  fees: [],
  paymentHistory: [],
  timetable: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchUniversities = createAsyncThunk(
  'university/fetchUniversities',
  async (_, { rejectWithValue }) => {
    try {
      return [] as University[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch universities');
    }
  }
);

export const fetchUniversityById = createAsyncThunk(
  'university/fetchUniversityById',
  async (id: string, { rejectWithValue }) => {
    try {
      return {id} as University;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch university');
    }
  }
);

export const fetchStudentProfile = createAsyncThunk(
  'university/fetchStudentProfile',
  async (_, { rejectWithValue }) => {
    try {
      return {} as StudentProfile;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

export const fetchResults = createAsyncThunk(
  'university/fetchResults',
  async (semester: string | undefined = undefined, { rejectWithValue }) => {
    try {
      return [] as SemesterResults[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch results');
    }
  }
);

export const fetchTranscript = createAsyncThunk(
  'university/fetchTranscript',
  async (_, { rejectWithValue }) => {
    try {
      return [] as SemesterResults[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch transcript');
    }
  }
);

export const fetchFees = createAsyncThunk(
  'university/fetchFees',
  async (_, { rejectWithValue }) => {
    try {
      return [] as FeeRecord[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch fees');
    }
  }
);

export const fetchPaymentHistory = createAsyncThunk(
  'university/fetchPaymentHistory',
  async (_, { rejectWithValue }) => {
    try {
      return [] as FeeRecord[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch payment history');
    }
  }
);

export const fetchTimetable = createAsyncThunk(
  'university/fetchTimetable',
  async (_, { rejectWithValue }) => {
    try {
      return [] as TimetableEntry[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch timetable');
    }
  }
);

const universitySlice = createSlice({
  name: 'university',
  initialState,
  reducers: {
    setSelectedUniversity: (state, action: PayloadAction<University | null>) => {
      state.selectedUniversity = action.payload;
    },
    clearUniversityData: state => {
      state.studentProfile = null;
      state.results = [];
      state.fees = [];
      state.paymentHistory = [];
      state.timetable = [];
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    // Fetch Universities
    builder
      .addCase(fetchUniversities.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUniversities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.universities = action.payload;
        state.error = null;
      })
      .addCase(fetchUniversities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch University by ID
    builder
      .addCase(fetchUniversityById.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUniversityById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedUniversity = action.payload;
        state.error = null;
      })
      .addCase(fetchUniversityById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Student Profile
    builder
      .addCase(fetchStudentProfile.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.studentProfile = action.payload;
        state.error = null;
      })
      .addCase(fetchStudentProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Results
    builder
      .addCase(fetchResults.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload;
        state.error = null;
      })
      .addCase(fetchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Transcript
    builder
      .addCase(fetchTranscript.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTranscript.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload;
        state.error = null;
      })
      .addCase(fetchTranscript.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Fees
    builder
      .addCase(fetchFees.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fees = action.payload;
        state.error = null;
      })
      .addCase(fetchFees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Payment History
    builder
      .addCase(fetchPaymentHistory.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentHistory = action.payload;
        state.error = null;
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Timetable
    builder
      .addCase(fetchTimetable.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTimetable.fulfilled, (state, action) => {
        state.isLoading = false;
        state.timetable = action.payload;
        state.error = null;
      })
      .addCase(fetchTimetable.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedUniversity,
  clearUniversityData,
  clearError,
} = universitySlice.actions;

export default universitySlice.reducer;
