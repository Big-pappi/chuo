import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStackParamList} from './types';
import SplashScreen from '@/features/auth/SplashScreen';
import OnboardingScreen from '@/features/onboarding/OnboardingScreen';
import LoginScreen from '@/features/auth/LoginScreen';
import SignUpScreen from '@/features/auth/SignUpScreen';
import OtpScreen from '@/features/auth/OtpScreen';
import ForgotPasswordScreen from '@/features/auth/ForgotPasswordScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}
