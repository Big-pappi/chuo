import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AcademicsStackParamList} from './types';
import AcademicsHomeScreen from '@/features/academics/screens/AcademicsHomeScreen';
import TimetableScreen from '@/features/timetable/screens/TimetableScreen';
import FeesScreen from '@/features/fees/screens/FeesScreen';
import AssignmentsScreen from '@/features/assignments/screens/AssignmentsScreen';
import AttendanceScreen from '@/features/attendance/screens/AttendanceScreen';
import ExamCenterScreen from '@/features/exams/screens/ExamCenterScreen';

const Stack = createNativeStackNavigator<AcademicsStackParamList>();

export default function AcademicsNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="AcademicsHome" component={AcademicsHomeScreen} />
      <Stack.Screen name="Timetable" component={TimetableScreen} />
      <Stack.Screen name="Results" component={AcademicsHomeScreen} />
      <Stack.Screen name="Fees" component={FeesScreen} />
      <Stack.Screen name="Assignments" component={AssignmentsScreen} />
      <Stack.Screen name="Attendance" component={AttendanceScreen} />
      <Stack.Screen name="ExamCenter" component={ExamCenterScreen} />
    </Stack.Navigator>
  );
}
