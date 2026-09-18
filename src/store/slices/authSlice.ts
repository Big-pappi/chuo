import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  hasOnboarded: boolean;
  isLoading: boolean;
  token: string | null;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  hasOnboarded: false,
  isLoading: false,
  token: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.token = action.payload;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.token = null;
      state.error = action.payload;
    },
    completeOnboarding: state => {
      state.hasOnboarded = true;
    },
    logout: state => {
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
    },
    clearError: state => {
      state.error = null;
    },
  },
});

export const {loginStart, loginSuccess, loginFailure, completeOnboarding, logout, clearError} =
  authSlice.actions;
export default authSlice.reducer;
