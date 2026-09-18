/**
 * Central mock data for the CHUO prototype build.
 * All screens read from here so the demo works fully offline.
 */

export const mockStudent = {
  id: 'stu_1',
  name: 'Philip Steven',
  firstName: 'Philip',
  email: 'philip.steven@udsm.ac.tz',
  phone: '+255 712 345 678',
  studentId: 'UDSM/CS/22/0456',
  regNumber: 'UDSM/2021/CS/0456',
  university: 'University of Dar es Salaam',
  universityShort: 'UDSM',
  campus: 'Main Campus',
  programme: 'BSc. Computer Science',
  faculty: 'Computer Science',
  year: 2,
  semester: 2,
  academicYear: '2023/2024',
  status: 'Active',
  // Local profile photo — drop your image at assets/profile/profile.png to replace this.
  avatar: require('../../assets/profile/profile.png'),
  gpa: 3.68,
  gpaDelta: 0.24,
  standing: 'Good Standing',
};

export const mockUniversity = {
  id: 'udsm',
  name: 'University of Dar es Salaam',
  short: 'UDSM',
  campus: 'Main Campus',
  verified: true,
  type: 'Public University',
  founded: 1961,
  website: 'www.udsm.ac.tz',
  description:
    'The premier public university in Tanzania, committed to excellence in teaching, research and innovation.',
  about:
    'UDSM is the oldest and largest university in Tanzania. It offers a wide range of undergraduate and postgraduate programs across multiple disciplines.',
  students: '60,853+',
  faculties: 11,
  programs: '200+',
  location: 'Dar es Salaam',
  accreditation: 'TCU, NACTE',
  phone: '+255 22 241 0500',
  contactEmail: 'vc@udsm.ac.tz',
  address: 'P.O. BOX 35091, Dar es Salaam, Tanzania',
  workingHours: 'Mon - Fri: 8:00 AM - 4:00 PM',
  image:
    'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop',
};

export type QuickAction = {
  id: string;
  label: string;
  icon: string;
  color: string;
  soft: string;
};

// Quick access tiles available to place on the dashboard.
export const quickActionsCatalog: QuickAction[] = [
  {id: 'timetable', label: 'Timetable', icon: 'calendar-clock', color: '#1D4ED8', soft: '#EEF4FF'},
  {id: 'results', label: 'Results', icon: 'file-document', color: '#10B981', soft: '#ECFDF5'},
  {id: 'fees', label: 'Fees & Payments', icon: 'wallet', color: '#F59E0B', soft: '#FFF7ED'},
  {id: 'assignments', label: 'Assignments', icon: 'clipboard-text', color: '#1D4ED8', soft: '#EEF4FF'},
  {id: 'attendance', label: 'Attendance', icon: 'check-decagram', color: '#7C3AED', soft: '#F5F3FF'},
  {id: 'notices', label: 'Notices', icon: 'bullhorn', color: '#F59E0B', soft: '#FFF7ED'},
  {id: 'library', label: 'Library', icon: 'book-open-variant', color: '#1D4ED8', soft: '#EEF4FF'},
  {id: 'exams', label: 'Exam Center', icon: 'clipboard-alert', color: '#EF4444', soft: '#FEF2F2'},
  {id: 'scholarships', label: 'Scholarships', icon: 'trophy', color: '#10B981', soft: '#ECFDF5'},
  {id: 'documents', label: 'Documents', icon: 'folder', color: '#1D4ED8', soft: '#EEF4FF'},
  {id: 'announcements', label: 'Announcements', icon: 'bullhorn-variant', color: '#EF4444', soft: '#FEF2F2'},
  {id: 'more', label: 'More', icon: 'dots-grid', color: '#475569', soft: '#F1F5F9'},
];

export const upcomingClasses = [
  {id: 'c1', time: '08:00 AM', title: 'Data Structures', room: 'Room CS Lab 1', icon: 'code-tags', color: '#1D4ED8', soft: '#EEF4FF', badge: 'In 20 mins'},
  {id: 'c2', time: '10:00 AM', title: 'Database Systems', room: 'Room CS Lab 2', icon: 'database', color: '#10B981', soft: '#ECFDF5'},
  {id: 'c3', time: '01:00 PM', title: 'Web Development', room: 'Room CT Lab 1', icon: 'code-tags', color: '#F59E0B', soft: '#FFF7ED'},
];

export const tasksDeadlines = [
  {id: 't1', title: 'Data Structures Assignment', due: 'Due: 22 May 2024', icon: 'clipboard-text', color: '#7C3AED', soft: '#F5F3FF', status: 'Due Soon', statusColor: '#EF4444'},
  {id: 't2', title: 'Database Systems Quiz', due: 'Due: 23 May 2024', icon: 'file-question', color: '#10B981', soft: '#ECFDF5', status: 'Upcoming', statusColor: '#F59E0B'},
  {id: 't3', title: 'Web Development Project', due: 'Due: 30 May 2024', icon: 'file-document', color: '#1D4ED8', soft: '#EEF4FF', status: 'Upcoming', statusColor: '#F59E0B'},
];

export const feeSummary = {
  totalBalance: 320000,
  totalFees: 1600000,
  paidAmount: 1280000,
  outstanding: 320000,
  dueDate: '30 May 2024',
  status: 'Partially Paid',
};

export const feeBreakdown = [
  {id: 'f1', label: 'Tuition Fees', amount: 800000, paid: true},
  {id: 'f2', label: 'Registration Fees', amount: 150000, paid: true},
  {id: 'f3', label: 'Examination Fees', amount: 200000, paid: true},
  {id: 'f4', label: 'Library Fees', amount: 50000, paid: true},
  {id: 'f5', label: 'ICT Fees', amount: 100000, paid: true},
  {id: 'f6', label: 'Development Fees', amount: 200000, paid: false},
  {id: 'f7', label: 'Student Union Fees', amount: 50000, paid: false},
  {id: 'f8', label: 'Activity Fees', amount: 50000, paid: false},
];

export const recentPayments = [
  {id: 'p1', label: 'Tuition Fees – Semester 2', ref: 'Ref: UDSM/2024/57832', amount: 800000, date: '10 Apr 2024, 10:45 AM', icon: 'file-document', color: '#10B981', soft: '#ECFDF5'},
  {id: 'p2', label: 'Registration Fees', ref: 'Ref: UDSM/2024/45821', amount: 150000, date: '08 Apr 2024, 02:30 PM', icon: 'clipboard-text', color: '#1D4ED8', soft: '#EEF4FF'},
  {id: 'p3', label: 'Library Fees', ref: 'Ref: UDSM/2024/33817', amount: 50000, date: '05 Apr 2024, 11:20 AM', icon: 'book-open-variant', color: '#7C3AED', soft: '#F5F3FF'},
];

export const paymentMethods = [
  {id: 'pm1', label: 'Visa Card', last4: '4242', icon: 'credit-card', brand: 'VISA', isDefault: true},
  {id: 'pm2', label: 'Mastercard', last4: '8888', icon: 'credit-card-multiple', brand: 'MC', isDefault: false},
  {id: 'pm3', label: 'Mobile Money', last4: '5555', icon: 'cellphone', brand: 'MoMo', isDefault: false},
  {id: 'pm4', label: 'CRDB Bank', last4: '1234', icon: 'bank', brand: 'CRDB', isDefault: false},
];

export const timetableDays = [
  {id: 'mon', day: 'Mon', date: '20', month: 'May'},
  {id: 'tue', day: 'Tue', date: '21', month: 'May'},
  {id: 'wed', day: 'Wed', date: '22', month: 'May'},
  {id: 'thu', day: 'Thu', date: '23', month: 'May'},
  {id: 'fri', day: 'Fri', date: '24', month: 'May'},
  {id: 'sat', day: 'Sat', date: '25', month: 'May'},
];

export const timetableClasses = [
  {id: 'tc1', time: '08:00 AM', code: 'CS 221', title: 'Data Structures', kind: 'Lecture', room: 'Room CS Lab 1, Block D', lecturer: 'Dr. J. Mwangi', icon: 'code-tags', color: '#1D4ED8', soft: '#EEF4FF', dot: '#1D4ED8'},
  {id: 'tc2', time: '10:00 AM', code: 'MTH 231', title: 'Discrete Mathematics', kind: 'Lecture', room: 'Room MTH 2, Block A', lecturer: 'Dr. R. Komba', icon: 'sigma', color: '#10B981', soft: '#ECFDF5', dot: '#10B981'},
  {id: 'tc3', time: '12:00 PM', code: 'CS 223', title: 'Database Systems', kind: 'Tutorial', room: 'Room CS Lab 2, Block D', lecturer: 'Mr. A. Joseph', icon: 'database', color: '#F59E0B', soft: '#FFF7ED', dot: '#F59E0B'},
  {id: 'tc4', time: '02:00 PM', code: 'ENG 201', title: 'Technical English', kind: 'Lecture', room: 'Room ENG 1, Block B', lecturer: 'Dr. L. Simon', icon: 'book-open-variant', color: '#7C3AED', soft: '#F5F3FF', dot: '#7C3AED'},
  {id: 'tc5', time: '04:00 PM', code: 'CS 225', title: 'Algorithms', kind: 'Practical', room: 'Computer Lab 3, Block D', lecturer: 'Dr. P. Thomas', icon: 'code-tags', color: '#EF4444', soft: '#FEF2F2', dot: '#EF4444'},
];

export const resultsSummary = {
  cgpa: 3.68,
  scale: 4.0,
  class: 'UPPER SECOND',
  coursesTaken: 8,
  aGrades: 3,
  bGrades: 4,
  passRate: '100%',
  totalCredits: 27,
  totalPoints: 99.0,
  semesterGpa: 3.67,
};

export const resultsSemesters = [
  {id: 's1', label: 'Semester 1', year: '2022/2023'},
  {id: 's2', label: 'Semester 2', year: '2022/2023'},
  {id: 's3', label: 'Semester 1', year: '2023/2024'},
  {id: 's4', label: 'Semester 2', year: '2023/2024'},
];

export const courseResults = [
  {id: 1, code: 'CS 221', title: 'Data Structures', credits: 4, grade: 'A', points: 4.0},
  {id: 2, code: 'CS 223', title: 'Database Systems', credits: 4, grade: 'A-', points: 3.67},
  {id: 3, code: 'CS 225', title: 'Algorithms', credits: 4, grade: 'B+', points: 3.33},
  {id: 4, code: 'CS 227', title: 'Operating Systems', credits: 4, grade: 'A', points: 4.0},
  {id: 5, code: 'CS 229', title: 'Computer Networks', credits: 4, grade: 'B+', points: 3.33},
  {id: 6, code: 'MTH 231', title: 'Discrete Mathematics', credits: 3, grade: 'A-', points: 3.67},
  {id: 7, code: 'ENG 201', title: 'Technical English', credits: 2, grade: 'B', points: 3.0},
  {id: 8, code: 'GST 101', title: 'Gender Studies', credits: 2, grade: 'A', points: 4.0},
];

export const gradeGrade = (grade: string) => {
  if (grade.startsWith('A')) return {color: '#10B981', soft: '#ECFDF5'};
  if (grade.startsWith('B')) return {color: '#F59E0B', soft: '#FFF7ED'};
  if (grade.startsWith('C')) return {color: '#F97316', soft: '#FFF7ED'};
  return {color: '#EF4444', soft: '#FEF2F2'};
};

export const announcements = [
  {id: 'a1', title: 'Orientation Week for New Students', date: '20 May 2024', icon: 'bell', color: '#1D4ED8', soft: '#EEF4FF', unread: true},
  {id: 'a2', title: 'Second Semester Timetable Released', date: '18 May 2024', icon: 'file-document', color: '#10B981', soft: '#ECFDF5', unread: false},
];

export type Notification = {
  id: string;
  title: string;
  body: string;
  time: string;
  group: 'Today' | 'Yesterday';
  category: 'Announcements' | 'Academic' | 'General';
  icon: string;
  color: string;
  soft: string;
  dot: string;
  unread: boolean;
  badge?: string;
  link?: string;
  trailing?: 'check' | 'chevron' | 'dot';
};

export const notifications: Notification[] = [
  {id: 'n1', title: 'New Timetable Released', body: 'Your Semester 2 timetable is now available.', time: '10:30 AM', group: 'Today', category: 'Academic', icon: 'calendar', color: '#7C3AED', soft: '#F5F3FF', dot: '#7C3AED', unread: true, badge: 'New', link: 'Tap to view your timetable'},
  {id: 'n2', title: 'Tuition Fees Payment Received', body: 'Your payment of TZS 800,000 for Semester 2 was successful.', time: '9:15 AM', group: 'Today', category: 'General', icon: 'file-check', color: '#10B981', soft: '#ECFDF5', dot: '#10B981', unread: true, trailing: 'check'},
  {id: 'n3', title: 'Career Fair 2024', body: "Don't miss the UDSM Career Fair happening on 24th May at the Main Auditorium.", time: '8:45 AM', group: 'Today', category: 'Announcements', icon: 'bullhorn', color: '#F59E0B', soft: '#FFF7ED', dot: '#F59E0B', unread: true, trailing: 'chevron'},
  {id: 'n4', title: 'Assignment Graded', body: 'Database Systems Assignment has been graded. Check your results now.', time: 'Yesterday', group: 'Yesterday', category: 'Academic', icon: 'file-document', color: '#1D4ED8', soft: '#EEF4FF', dot: '#1D4ED8', unread: false, trailing: 'dot'},
  {id: 'n5', title: 'Public Holiday', body: 'University will be closed on 1st June 2024 (Madaraka Day).', time: 'Yesterday', group: 'Yesterday', category: 'General', icon: 'calendar-star', color: '#EF4444', soft: '#FEF2F2', dot: '#EF4444', unread: false, trailing: 'dot'},
  {id: 'n6', title: 'Important Security Update', body: 'Please update your password to keep your account secure.', time: 'Yesterday', group: 'Yesterday', category: 'General', icon: 'shield-check', color: '#10B981', soft: '#ECFDF5', dot: '#10B981', unread: false, trailing: 'dot'},
];

// Aggregate figures shown in the notifications hero card.
export const notificationStats = [
  {key: 'unread', label: 'Unread', value: 3, icon: 'email-outline'},
  {key: 'announcements', label: 'Announcements', value: 5, icon: 'bullhorn-outline'},
  {key: 'academic', label: 'Academic', value: 8, icon: 'school-outline'},
  {key: 'general', label: 'General', value: 2, icon: 'message-outline'},
];

export const notificationFilters = ['All', 'Unread', 'Announcements', 'Academic', 'General'] as const;
export type NotificationFilter = (typeof notificationFilters)[number];

// Profile screen: quick access tiles + account / support menu rows.
export const profileQuickAccess = [
  {id: 'results', label: 'My Results', icon: 'school', color: '#1D4ED8', soft: '#EEF4FF'},
  {id: 'timetable', label: 'Timetable', icon: 'calendar-blank', color: '#1D4ED8', soft: '#EEF4FF'},
  {id: 'fees', label: 'Fee & Payments', icon: 'credit-card-outline', color: '#10B981', soft: '#ECFDF5'},
  {id: 'library', label: 'Library', icon: 'book-open-variant', color: '#F59E0B', soft: '#FFF7ED'},
  {id: 'attendance', label: 'Attendance', icon: 'clock-outline', color: '#1D4ED8', soft: '#EEF4FF'},
];

export const profileAccountItems = [
  {id: 'personal', title: 'Personal Information', subtitle: 'View and update your personal details', icon: 'account-outline', color: '#1D4ED8', soft: '#EEF4FF'},
  {id: 'password', title: 'Change Password', subtitle: 'Update your account password', icon: 'lock-outline', color: '#1D4ED8', soft: '#EEF4FF'},
  {id: 'security', title: 'Security', subtitle: 'Manage 2FA and security settings', icon: 'shield-check-outline', color: '#10B981', soft: '#ECFDF5'},
  {id: 'notifications', title: 'Notification Preferences', subtitle: 'Choose what you want to be notified about', icon: 'bell-outline', color: '#F59E0B', soft: '#FFF7ED'},
  {id: 'devices', title: 'Linked Devices', subtitle: 'Manage devices connected to your account', icon: 'cellphone-link', color: '#1D4ED8', soft: '#EEF4FF'},
];

export const profileSupportItems = [
  {id: 'help', title: 'Help Center', subtitle: 'Get help and support', icon: 'help-circle-outline', color: '#1D4ED8', soft: '#EEF4FF'},
  {id: 'contact', title: 'Contact Us', subtitle: "We're here to help", icon: 'headset', color: '#7C3AED', soft: '#F5F3FF'},
  {id: 'about', title: 'About', subtitle: 'App version 2.4.1', icon: 'information-outline', color: '#10B981', soft: '#ECFDF5'},
];

export const appVersion = '2.4.1';

// Profile screen: in-page settings groups (preferences / privacy / app).
export type ProfileSettingControl = 'toggle' | 'chevron' | 'value';

export type ProfileSettingItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  soft: string;
  control: ProfileSettingControl;
  value?: string;
  defaultOn?: boolean;
};

export const profilePreferenceSettings: ProfileSettingItem[] = [
  {id: 'language', title: 'Language', subtitle: 'Choose your preferred language', icon: 'translate', color: '#1D4ED8', soft: '#EEF4FF', control: 'value', value: 'English'},
  {id: 'pushNotifications', title: 'Notifications', subtitle: 'Enable push notifications', icon: 'bell-outline', color: '#F59E0B', soft: '#FFF7ED', control: 'toggle', defaultOn: true},
];

export const profilePrivacySettings: ProfileSettingItem[] = [
  {id: 'changePassword', title: 'Change Password', subtitle: 'Update your account password', icon: 'lock-outline', color: '#1D4ED8', soft: '#EEF4FF', control: 'chevron'},
  {id: 'biometric', title: 'Biometric Login', subtitle: 'Use fingerprint or face ID to sign in', icon: 'fingerprint', color: '#10B981', soft: '#ECFDF5', control: 'toggle', defaultOn: false},
];

export const profileAppSettings: ProfileSettingItem[] = [
  {id: 'accentColor', title: 'Change Theme', subtitle: 'Choose your preferred theme color', icon: 'palette-outline', color: '#10B981', soft: '#ECFDF5', control: 'chevron'},
  {id: 'storage', title: 'Data & Storage', subtitle: 'Manage cache and downloads', icon: 'database-outline', color: '#1D4ED8', soft: '#EEF4FF', control: 'chevron'},
  {id: 'appVersion', title: 'App Version', subtitle: 'Current installed version', icon: 'information-outline', color: '#10B981', soft: '#ECFDF5', control: 'value', value: appVersion},
];

export const applications = [
  {id: 'app1', name: 'UDSM Scholarship', status: 'Under Review', statusColor: '#F59E0B', progress: 0.6},
  {id: 'app2', name: 'AIESEC Tanzania Internship', status: 'Shortlisted', statusColor: '#10B981', progress: 0.85},
];

export const universitiesList = [
  {id: 'udsm', name: 'University of Dar es Salaam', short: 'UDSM', location: 'Dar es Salaam', type: 'Public', students: '60,853+'},
  {id: 'sua', name: 'Sokoine University of Agriculture', short: 'SUA', location: 'Morogoro', type: 'Public', students: '18,200+'},
  {id: 'must', name: 'Mbeya Univ. of Science & Tech.', short: 'MUST', location: 'Mbeya', type: 'Public', students: '9,400+'},
  {id: 'nm-aist', name: 'Nelson Mandela AIST', short: 'NM-AIST', location: 'Arusha', type: 'Public', students: '1,100+'},
  {id: 'ardhi', name: 'Ardhi University', short: 'ARU', location: 'Dar es Salaam', type: 'Public', students: '6,300+'},
  {id: 'muhas', name: 'Muhimbili Univ. of Health', short: 'MUHAS', location: 'Dar es Salaam', type: 'Public', students: '5,800+'},
];

export const signupUniversities = universitiesList.map(u => ({label: u.name, value: u.id}));

export const signupCourses = [
  {label: 'BSc. Computer Science', value: 'cs'},
  {label: 'BSc. Information Technology', value: 'it'},
  {label: 'BSc. Software Engineering', value: 'se'},
  {label: 'Bachelor of Commerce', value: 'com'},
  {label: 'Bachelor of Laws (LLB)', value: 'llb'},
  {label: 'Bachelor of Education', value: 'edu'},
];

export const signupYears = [
  {label: 'Year 1', value: '1'},
  {label: 'Year 2', value: '2'},
  {label: 'Year 3', value: '3'},
  {label: 'Year 4', value: '4'},
];

export const signupCampuses = [
  {label: 'Main Campus', value: 'main'},
  {label: 'Mlimani Campus', value: 'mlimani'},
  {label: 'Mwalimu Nyerere Campus', value: 'mnyerere'},
  {label: 'Mkwawa Campus', value: 'mkwawa'},
];

export const formatTZS = (n: number) => 'TZS ' + n.toLocaleString('en-US');
