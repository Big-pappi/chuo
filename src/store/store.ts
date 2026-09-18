import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import dashboardReducer from './slices/dashboardSlice';
import universityReducer from './slices/universitySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    dashboard: dashboardReducer,
    university: universityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
