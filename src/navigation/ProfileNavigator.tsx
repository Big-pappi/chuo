import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ProfileStackParamList} from './types';
import ProfileScreen from '@/features/profile/screens/ProfileScreen';
import EditProfileScreen from '@/features/profile/screens/EditProfileScreen';
import ChangePasswordScreen from '@/features/profile/screens/ChangePasswordScreen';
import SecurityScreen from '@/features/profile/screens/SecurityScreen';
import NotificationPreferencesScreen from '@/features/profile/screens/NotificationPreferencesScreen';
import LinkedDevicesScreen from '@/features/profile/screens/LinkedDevicesScreen';
import HelpCenterScreen from '@/features/profile/screens/HelpCenterScreen';
import ContactUsScreen from '@/features/profile/screens/ContactUsScreen';
import AboutScreen from '@/features/profile/screens/AboutScreen';
import LanguageScreen from '@/features/profile/screens/LanguageScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="Security" component={SecurityScreen} />
      <Stack.Screen name="NotificationPreferences" component={NotificationPreferencesScreen} />
      <Stack.Screen name="LinkedDevices" component={LinkedDevicesScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
    </Stack.Navigator>
  );
}
