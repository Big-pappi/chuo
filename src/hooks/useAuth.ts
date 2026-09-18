import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {RootState, AppDispatch} from '@/store/store';
import {loginSuccess, logout} from '@/store/slices/authSlice';
import type {LoginCredentials, SignUpCredentials} from '@/features/auth/services/authService';

const PREVIEW_TOKEN = 'ui-preview-token';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const {isAuthenticated, isLoading, token, error} = useSelector((state: RootState) => state.auth);

  const login = useCallback(async (_credentials: LoginCredentials) => {
    dispatch(loginSuccess(PREVIEW_TOKEN));
    return {access: PREVIEW_TOKEN, refresh: 'ui-preview-refresh', user: {id: 'preview', email: _credentials.email, fullName: 'Preview Student', studentId: 'UDSM/CS/22/0456', universityId: _credentials.universityId || 'udsm'}};
  }, [dispatch]);

  const signUp = useCallback(async (credentials: SignUpCredentials) => {
    dispatch(loginSuccess(PREVIEW_TOKEN));
    return {access: PREVIEW_TOKEN, refresh: 'ui-preview-refresh', user: {id: 'preview', email: credentials.email, fullName: credentials.fullName, studentId: credentials.studentId, universityId: credentials.universityId}};
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigation.reset({index: 0, routes: [{name: 'Login' as never}]});
  }, [dispatch, navigation]);

  const forgotPassword = useCallback(async (_email: string, _universityId: string) => undefined, []);
  const verifyOtp = useCallback(async (_email: string, _otp: string) => undefined, []);
  const resetPassword = useCallback(async (_email: string, _otp: string, _newPassword: string) => undefined, []);

  return {isAuthenticated, isLoading, isCheckingAuth: false, token, error, login, signUp, logout: handleLogout, forgotPassword, verifyOtp, resetPassword};
};
