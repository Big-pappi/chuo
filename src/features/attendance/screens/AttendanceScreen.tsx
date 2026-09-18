import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView, Image} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {SurfaceCard, SectionHeader, IconTile, Pill} from '@/components/ui/Cards';
import {mockStudent} from '@/data/mock';

interface AttendanceRecord {
  id: string;
  course: string;
  courseCode: string;
  instructor: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  status: 'good' | 'warning' | 'critical';
  schedule: string;
  room: string;
}

const AttendanceScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState<'semester' | 'month' | 'week'>('semester');

  const [attendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: '1',
      course: 'Database Systems',
      courseCode: 'CS 301',
      instructor: 'Dr. John Smith',
      totalClasses: 24,
      attendedClasses: 22,
      percentage: 91.7,
      status: 'good',
      schedule: 'Mon, Wed 10:00-11:30',
      room: 'Room 201',
    },
    {
      id: '2',
      course: 'Mobile Computing',
      courseCode: 'CS 402',
      instructor: 'Prof. Sarah Johnson',
      totalClasses: 20,
      attendedClasses: 18,
      percentage: 90.0,
      status: 'good',
      schedule: 'Tue, Thu 14:00-15:30',
      room: 'Lab 102',
    },
    {
      id: '3',
      course: 'Artificial Intelligence',
      courseCode: 'CS 401',
      instructor: 'Dr. Michael Brown',
      totalClasses: 22,
      attendedClasses: 15,
      percentage: 68.2,
      status: 'warning',
      schedule: 'Mon, Wed 14:00-15:30',
      room: 'Room 305',
    },
    {
      id: '4',
      course: 'Web Technologies',
      courseCode: 'CS 303',
      instructor: 'Dr. Emily Davis',
      totalClasses: 18,
      attendedClasses: 16,
      percentage: 88.9,
      status: 'good',
      schedule: 'Tue, Thu 10:00-11:30',
      room: 'Lab 101',
    },
    {
      id: '5',
      course: 'Data Structures & Algorithms',
      courseCode: 'CS 201',
      instructor: 'Prof. David Wilson',
      totalClasses: 26,
      attendedClasses: 12,
      percentage: 46.2,
      status: 'critical',
      schedule: 'Fri 09:00-12:00',
      room: 'Room 104',
    },
  ]);

  const getStatusConfig = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'good':
        return {color: colors.green, soft: colors.greenSoft, icon: 'check', label: 'Good'};
      case 'warning':
        return {color: colors.orange, soft: colors.orangeSoft, icon: 'alert', label: 'Warning'};
      case 'critical':
        return {color: colors.red, soft: colors.redSoft, icon: 'alert-circle', label: 'Critical'};
      default:
        return {color: colors.slate, soft: colors.panel, icon: 'help-circle', label: 'Unknown'};
    }
  };

  const calculateOverallAttendance = () => {
    const totalClasses = attendanceRecords.reduce((sum, record) => sum + record.totalClasses, 0);
    const totalAttended = attendanceRecords.reduce((sum, record) => sum + record.attendedClasses, 0);
    return totalClasses > 0 ? ((totalAttended / totalClasses) * 100).toFixed(1) : '0';
  };

  const overallAttendance = calculateOverallAttendance();
  const overallStatus = parseFloat(overallAttendance) >= 80 ? 'good' : parseFloat(overallAttendance) >= 60 ? 'warning' : 'critical';
  const overallConfig = getStatusConfig(overallStatus);

  const renderAttendanceCard = (record: AttendanceRecord) => {
    const statusConfig = getStatusConfig(record.status);

    return (
      <SurfaceCard key={record.id} style={styles.attendanceCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <IconTile
              icon="book-open-variant"
              color={colors.blue}
              soft={colors.blueSoft}
              size={48}
              iconSize={24}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.courseTitle}>{record.course}</Text>
              <Text style={styles.courseCode}>{record.courseCode}</Text>
              <Text style={styles.instructor}>{record.instructor}</Text>
            </View>
          </View>
          <Pill label={statusConfig.label} color={statusConfig.color} soft={statusConfig.soft} />
        </View>

        <View style={styles.attendanceProgress}>
          <View style={styles.progressInfo}>
            <Text style={styles.attendanceLabel}>Attendance</Text>
            <Text style={[styles.attendancePercentage, {color: statusConfig.color}]}>
              {record.percentage.toFixed(1)}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${record.percentage}%`,
                  backgroundColor: statusConfig.color,
                },
              ]}
            />
          </View>
          <Text style={styles.attendanceDetails}>
            {record.attendedClasses} of {record.totalClasses} classes
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.footerItem}>
            <MaterialCommunityIcons name="calendar-clock" size={14} color={colors.slate} />
            <Text style={styles.footerText}>{record.schedule}</Text>
          </View>
          <View style={styles.footerItem}>
            <MaterialCommunityIcons name="map-marker" size={14} color={colors.slate} />
            <Text style={styles.footerText}>{record.room}</Text>
          </View>
        </View>

        <Pressable
          style={styles.detailsButton}
          onPress={() => console.log('View attendance details:', record.id)}>
          <Text style={styles.detailsButtonText}>View Detailed Report</Text>
          <MaterialCommunityIcons name="chevron-right" size={18} color={colors.blue} />
        </Pressable>
      </SurfaceCard>
    );
  };

  return (
    <Screen>
      <View style={styles.container}>
        {/* Fixed Header */}
        <View style={[styles.fixedHeader, {paddingTop: insets.top}]}>
          <View style={styles.header}>
            <Pressable
              style={styles.headerBtn}
              hitSlop={8}
              onPress={() => navigation.canGoBack() && navigation.goBack()}>
              <MaterialCommunityIcons name="arrow-left" size={22} color={colors.ink} />
            </Pressable>
            <Text style={styles.title}>Attendance</Text>
            <Pressable
              style={styles.headerBtn}
              hitSlop={8}
              onPress={() => navigation.navigate('Profile')}>
              <Image source={mockStudent.avatar} style={styles.avatar} />
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
          {/* Period filter */}
          <View style={styles.periodFilter}>
            {(['semester', 'month', 'week'] as const).map(period => {
              const isActive = selectedPeriod === period;
              return (
                <Pressable
                  key={period}
                  style={[styles.periodTab, isActive && styles.activePeriodTab]}
                  onPress={() => setSelectedPeriod(period)}>
                  <Text style={[styles.periodTabText, isActive && styles.activePeriodTabText]}>
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Course attendance list */}
          <View style={styles.content}>
            <SectionHeader
              title="Course Attendance"
              actionLabel={`${attendanceRecords.length} courses`}
            />
            {attendanceRecords.map(renderAttendanceCard)}
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},

  /* Fixed Header */
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: colors.bg,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    color: colors.ink,
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B2A6B',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    elevation: 1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.panel,
  },

  /* Scroll Content */
  scrollContent: {flex: 1},
  scrollContentContainer: {paddingHorizontal: 16, paddingTop: 100, paddingBottom: 20},

  periodFilter: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 6,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.line,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  activePeriodTab: {
    backgroundColor: colors.blue,
  },
  periodTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.slate,
  },
  activePeriodTabText: {
    color: colors.white,
  },
  content: {marginBottom: 16},
  attendanceCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  headerInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 4,
  },
  courseCode: {
    fontSize: 13,
    color: colors.slate,
    marginBottom: 2,
  },
  instructor: {
    fontSize: 12,
    color: colors.muted,
  },
  attendanceProgress: {
    backgroundColor: colors.panel,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  attendanceLabel: {
    fontSize: 13,
    color: colors.slate,
  },
  attendancePercentage: {
    fontSize: 18,
    fontWeight: '800',
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.line,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  attendanceDetails: {
    fontSize: 12,
    color: colors.slate,
    textAlign: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: colors.slate,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blueSoft,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.blue,
  },
});

export default AttendanceScreen;