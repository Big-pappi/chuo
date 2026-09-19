export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
  Otp: {phone?: string};
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Academics: undefined;
  Notifications: undefined;
  Profile: {screen?: keyof ProfileStackParamList};
};

// Screens reachable from Home / Academics via a stack.
export type HomeStackParamList = {
  Dashboard: undefined;
  Customize: undefined;
  University: undefined;
  Universities: undefined;
  Timetable: undefined;
  Results: undefined;
  Fees: undefined;
  Assignments: undefined;
  Attendance: undefined;
  Documents: undefined;
  Announcements: undefined;
  Notices: undefined;
  Library: undefined;
  ExamCenter: undefined;
  Scholarships: undefined;
};

// Screens reachable from Profile via a stack.
export type ProfileStackParamList = {
  Profile: undefined;
  AccentColor: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  Security: undefined;
  NotificationPreferences: undefined;
  LinkedDevices: undefined;
  HelpCenter: undefined;
  ContactUs: undefined;
  About: undefined;
  Language: undefined;
  DataStorage: undefined;
};

export type AcademicsStackParamList = {
  AcademicsHome: undefined;
  Timetable: undefined;
  Results: undefined;
  Fees: undefined;
  Assignments: undefined;
  Attendance: undefined;
  ExamCenter: undefined;
};
