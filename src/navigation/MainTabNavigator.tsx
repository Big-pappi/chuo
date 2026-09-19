import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from './types';
import BottomTabBar from './BottomTabBar';
import HomeNavigator from './HomeNavigator';
import AcademicsNavigator from './AcademicsNavigator';
import NotificationsScreen from '@/features/notifications/screens/NotificationsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={props => <BottomTabBar {...props} />}>
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Academics" component={AcademicsNavigator} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
    </Tab.Navigator>
  );
}
