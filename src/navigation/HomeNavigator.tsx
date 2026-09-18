import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeStackParamList} from './types';
import DashboardScreen from '@/features/dashboard/screens/DashboardScreen';
import CustomizeDashboardScreen from '@/features/dashboard/screens/CustomizeDashboardScreen';
import UniversityDetailScreen from '@/features/universities/screens/UniversityDetailScreen';
import UniversityListScreen from '@/features/universities/screens/UniversityListScreen';
import TimetableScreen from '@/features/timetable/screens/TimetableScreen';
import AcademicsHomeScreen from '@/features/academics/screens/AcademicsHomeScreen';
import FeesScreen from '@/features/fees/screens/FeesScreen';
import AssignmentsScreen from '@/features/assignments/screens/AssignmentsScreen';
import AttendanceScreen from '@/features/attendance/screens/AttendanceScreen';
import DocumentsScreen from '@/features/documents/screens/DocumentsScreen';
import AnnouncementsScreen from '@/features/announcements/screens/AnnouncementsScreen';
import NoticesScreen from '@/features/notices/screens/NoticesScreen';
import LibraryScreen from '@/features/library/screens/LibraryScreen';
import ExamCenterScreen from '@/features/exams/screens/ExamCenterScreen';
import ScholarshipsScreen from '@/features/scholarships/screens/ScholarshipsScreen';
import ProfileScreen from '@/features/profile/screens/ProfileScreen';
import AccentColorScreen from '@/features/profile/screens/AccentColorScreen';
import EditProfileScreen from '@/features/profile/screens/EditProfileScreen';
import ChangePasswordScreen from '@/features/profile/screens/ChangePasswordScreen';
import SecurityScreen from '@/features/profile/screens/SecurityScreen';
import NotificationPreferencesScreen from '@/features/profile/screens/NotificationPreferencesScreen';
import LinkedDevicesScreen from '@/features/profile/screens/LinkedDevicesScreen';
import HelpCenterScreen from '@/features/profile/screens/HelpCenterScreen';
import ContactUsScreen from '@/features/profile/screens/ContactUsScreen';
import AboutScreen from '@/features/profile/screens/AboutScreen';
import LanguageScreen from '@/features/profile/screens/LanguageScreen';
import DataStorageScreen from '@/features/profile/screens/DataStorageScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Customize" component={CustomizeDashboardScreen} />
      <Stack.Screen name="University" component={UniversityDetailScreen} />
      <Stack.Screen name="Universities" component={UniversityListScreen} />
      <Stack.Screen name="Timetable" component={TimetableScreen} />
      <Stack.Screen name="Results" component={AcademicsHomeScreen} />
      <Stack.Screen name="Fees" component={FeesScreen} />
      <Stack.Screen name="Assignments" component={AssignmentsScreen} />
      <Stack.Screen name="Attendance" component={AttendanceScreen} />
      <Stack.Screen name="Documents" component={DocumentsScreen} />
      <Stack.Screen name="Announcements" component={AnnouncementsScreen} />
      <Stack.Screen name="Notices" component={NoticesScreen} />
      <Stack.Screen name="Library" component={LibraryScreen} />
      <Stack.Screen name="ExamCenter" component={ExamCenterScreen} />
      <Stack.Screen name="Scholarships" component={ScholarshipsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="AccentColor" component={AccentColorScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="Security" component={SecurityScreen} />
      <Stack.Screen name="NotificationPreferences" component={NotificationPreferencesScreen} />
      <Stack.Screen name="LinkedDevices" component={LinkedDevicesScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="DataStorage" component={DataStorageScreen} />
    </Stack.Navigator>
  );
}
