import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView, Image} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {SurfaceCard, SectionHeader, IconTile, Pill} from '@/components/ui/Cards';
import {mockStudent} from '@/data/mock';

interface Exam {
  id: string;
  courseCode: string;
  courseName: string;
  examType: 'midterm' | 'final' | 'quiz' | 'practical';
  date: string;
  time: string;
  duration: string;
  venue: string;
  seatNumber: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  instructions: string[];
  materialsAllowed: string[];
}

interface ExamResult {
  id: string;
  courseCode: string;
  courseName: string;
  examType: 'midterm' | 'final' | 'quiz' | 'practical';
  date: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  gpa: number;
  status: 'passed' | 'failed' | 'pending';
}

const ExamCenterScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'schedule' | 'results' | 'instructions'>('schedule');

  const [exams] = useState<Exam[]>([
    {
      id: '1',
      courseCode: 'CS 301',
      courseName: 'Database Systems',
      examType: 'final',
      date: '2026-09-25',
      time: '09:00',
      duration: '3 hours',
      venue: 'Examination Hall A',
      seatNumber: 'A-45',
      status: 'scheduled',
      instructions: ['Bring student ID card', 'No electronic devices allowed', 'Arrive 15 minutes early'],
      materialsAllowed: ['Pen', 'Pencil', 'Eraser', 'Calculator (non-programmable)'],
    },
    {
      id: '2',
      courseCode: 'CS 402',
      courseName: 'Mobile Computing',
      examType: 'final',
      date: '2026-09-28',
      time: '14:00',
      duration: '3 hours',
      venue: 'Examination Hall B',
      seatNumber: 'B-23',
      status: 'scheduled',
      instructions: ['Bring student ID card', 'Laptops provided for practical exam', 'Backup your work regularly'],
      materialsAllowed: ['Pen', 'Notebook'],
    },
    {
      id: '3',
      courseCode: 'CS 401',
      courseName: 'Artificial Intelligence',
      examType: 'midterm',
      date: '2026-10-02',
      time: '10:00',
      duration: '2 hours',
      venue: 'Room 305',
      seatNumber: 'C-12',
      status: 'scheduled',
      instructions: ['Bring student ID card', 'No calculators allowed', 'Formula sheet provided'],
      materialsAllowed: ['Pen', 'Pencil'],
    },
    {
      id: '4',
      courseCode: 'CS 303',
      courseName: 'Web Technologies',
      examType: 'practical',
      date: '2026-08-15',
      time: '09:00',
      duration: '4 hours',
      venue: 'Computer Lab 1',
      seatNumber: 'LAB-08',
      status: 'completed',
      instructions: ['Bring student ID card', 'Computers provided', 'Internet access allowed'],
      materialsAllowed: ['Pen', 'USB drive'],
    },
  ]);

  const [examResults] = useState<ExamResult[]>([
    {
      id: '1',
      courseCode: 'CS 303',
      courseName: 'Web Technologies',
      examType: 'practical',
      date: '2024-07-15',
      marksObtained: 85,
      totalMarks: 100,
      percentage: 85,
      grade: 'A',
      gpa: 4.0,
      status: 'passed',
    },
    {
      id: '2',
      courseCode: 'CS 201',
      courseName: 'Data Structures & Algorithms',
      examType: 'midterm',
      date: '2024-06-20',
      marksObtained: 72,
      totalMarks: 100,
      percentage: 72,
      grade: 'B',
      gpa: 3.0,
      status: 'passed',
    },
    {
      id: '3',
      courseCode: 'CS 202',
      courseName: 'Computer Networks',
      examType: 'midterm',
      date: '2024-06-18',
      marksObtained: 58,
      totalMarks: 100,
      percentage: 58,
      grade: 'C',
      gpa: 2.0,
      status: 'passed',
    },
  ]);

  const getExamTypeConfig = (type: Exam['examType']) => {
    switch (type) {
      case 'final':
        return {icon: 'file-document-edit', color: colors.red, soft: colors.redSoft, label: 'Final Exam'};
      case 'midterm':
        return {icon: 'file-document', color: colors.orange, soft: colors.orangeSoft, label: 'Midterm'};
      case 'quiz':
        return {icon: 'clipboard-list', color: colors.blue, soft: colors.blueSoft, label: 'Quiz'};
      case 'practical':
        return {icon: 'desktop-classic', color: colors.green, soft: colors.greenSoft, label: 'Practical'};
      default:
        return {icon: 'file', color: colors.slate, soft: colors.panel, label: 'Exam'};
    }
  };

  const getStatusConfig = (status: Exam['status']) => {
    switch (status) {
      case 'scheduled':
        return {color: colors.green, soft: colors.greenSoft, label: 'Scheduled'};
      case 'completed':
        return {color: colors.blue, soft: colors.blueSoft, label: 'Completed'};
      case 'cancelled':
        return {color: colors.red, soft: colors.redSoft, label: 'Cancelled'};
      default:
        return {color: colors.slate, soft: colors.panel, label: 'Unknown'};
    }
  };

  const getResultStatusConfig = (status: ExamResult['status']) => {
    switch (status) {
      case 'passed':
        return {color: colors.green, soft: colors.greenSoft, label: 'Passed', icon: 'check-circle'};
      case 'failed':
        return {color: colors.red, soft: colors.redSoft, label: 'Failed', icon: 'close-circle'};
      case 'pending':
        return {color: colors.orange, soft: colors.orangeSoft, label: 'Pending', icon: 'clock'};
      default:
        return {color: colors.slate, soft: colors.panel, label: 'Unknown', icon: 'help-circle'};
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
  };

  const getDaysRemaining = (examDate: string) => {
    const exam = new Date(examDate);
    const today = new Date();
    const diffTime = exam.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderExamCard = (exam: Exam) => {
    const typeConfig = getExamTypeConfig(exam.examType);
    const statusConfig = getStatusConfig(exam.status);
    const daysRemaining = getDaysRemaining(exam.date);

    return (
      <SurfaceCard key={exam.id} style={styles.examCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <IconTile
              icon={typeConfig.icon}
              color={typeConfig.color}
              soft={typeConfig.soft}
              size={48}
              iconSize={24}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.courseName}>{exam.courseName}</Text>
              <Text style={styles.courseCode}>{exam.courseCode}</Text>
              <Text style={styles.examType}>{typeConfig.label}</Text>
            </View>
          </View>
          <Pill label={statusConfig.label} color={statusConfig.color} soft={statusConfig.soft} />
        </View>

        <View style={styles.examDetails}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="calendar" size={16} color={colors.slate} />
              <Text style={styles.detailText}>{formatDate(exam.date)}</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="clock" size={16} color={colors.slate} />
              <Text style={styles.detailText}>{exam.time}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="timer" size={16} color={colors.slate} />
              <Text style={styles.detailText}>{exam.duration}</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="map-marker" size={16} color={colors.slate} />
              <Text style={styles.detailText}>{exam.venue}</Text>
            </View>
          </View>
        </View>

        <View style={styles.seatInfo}>
          <MaterialCommunityIcons name="chair-school" size={20} color={colors.blue} />
          <Text style={styles.seatText}>Seat Number: <Text style={styles.seatNumber}>{exam.seatNumber}</Text></Text>
        </View>

        {exam.status === 'scheduled' && (
          <View style={[styles.daysBadge, {backgroundColor: daysRemaining <= 3 ? colors.redSoft : colors.greenSoft}]}>
            <MaterialCommunityIcons 
              name={daysRemaining <= 3 ? "alert" : "calendar-check"} 
              size={18} 
              color={daysRemaining <= 3 ? colors.red : colors.green} 
            />
            <Text style={[styles.daysText, {color: daysRemaining <= 3 ? colors.red : colors.green}]}>
              {daysRemaining > 0 ? `${daysRemaining} days remaining` : daysRemaining === 0 ? 'Exam today' : 'Overdue'}
            </Text>
          </View>
        )}

        <Pressable
          style={styles.viewButton}
          onPress={() => console.log('View exam details:', exam.id)}>
          <Text style={styles.viewButtonText}>View Admit Card</Text>
          <MaterialCommunityIcons name="chevron-right" size={18} color={colors.blue} />
        </Pressable>
      </SurfaceCard>
    );
  };

  const renderResultCard = (result: ExamResult) => {
    const typeConfig = getExamTypeConfig(result.examType);
    const statusConfig = getResultStatusConfig(result.status);

    return (
      <SurfaceCard key={result.id} style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <View style={styles.resultLeft}>
            <IconTile
              icon={typeConfig.icon}
              color={typeConfig.color}
              soft={typeConfig.soft}
              size={44}
              iconSize={22}
            />
            <View style={styles.resultInfo}>
              <Text style={styles.resultCourseName}>{result.courseName}</Text>
              <Text style={styles.resultCourseCode}>{result.courseCode}</Text>
              <Text style={styles.resultDate}>{formatDate(result.date)}</Text>
            </View>
          </View>
          <View style={styles.resultGrade}>
            <Text style={[styles.gradeText, {color: statusConfig.color}]}>{result.grade}</Text>
            <Text style={styles.gpaText}>GPA: {result.gpa.toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.marksSection}>
          <View style={styles.marksRow}>
            <Text style={styles.marksLabel}>Marks Obtained</Text>
            <Text style={styles.marksValue}>{result.marksObtained}/{result.totalMarks}</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, {width: `${result.percentage}%`, backgroundColor: statusConfig.color}]} 
            />
          </View>
          <Text style={styles.percentageText}>{result.percentage.toFixed(1)}%</Text>
        </View>

        <View style={styles.resultFooter}>
          <Pill label={statusConfig.label} color={statusConfig.color} soft={statusConfig.soft} />
          <Pressable
            style={styles.detailsButton}
            onPress={() => console.log('View detailed result:', result.id)}>
            <MaterialCommunityIcons name="eye" size={16} color={colors.blue} />
            <Text style={styles.detailsButtonText}>Details</Text>
          </Pressable>
        </View>
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
            <Text style={styles.title}>Exam Center</Text>
            <Pressable
              style={styles.headerBtn}
              hitSlop={8}
              onPress={() => navigation.navigate('Profile')}>
              <Image source={mockStudent.avatar} style={styles.avatar} />
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>

        {/* Tab navigation */}
        <View style={styles.tabContainer}>
          {(['schedule', 'results', 'instructions'] as const).map(tab => {
            const isActive = activeTab === tab;
            const icon = tab === 'schedule' ? 'calendar-clock' : 
                         tab === 'results' ? 'chart-line' : 'information';
            return (
              <Pressable
                key={tab}
                style={[styles.tab, isActive && styles.activeTab]}
                onPress={() => setActiveTab(tab)}>
                <MaterialCommunityIcons 
                  name={icon as any} 
                  size={22} 
                  color={isActive ? colors.blue : colors.slate} 
                />
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Content based on active tab */}
        <View style={styles.content}>
          {activeTab === 'schedule' && (
            <>
              <SectionHeader
                title="Upcoming Exams"
                actionLabel={`${exams.filter(e => e.status === 'scheduled').length} scheduled`}
              />
              {exams.filter(e => e.status === 'scheduled').length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons name="calendar-check" size={64} color={colors.muted} />
                  <Text style={styles.emptyText}>No upcoming exams</Text>
                  <Text style={styles.emptySubtext}>Your exam schedule will appear here</Text>
                </View>
              ) : (
                exams.filter(e => e.status === 'scheduled').map(renderExamCard)
              )}
            </>
          )}

          {activeTab === 'results' && (
            <>
              <SectionHeader
                title="Exam Results"
                actionLabel={`${examResults.length} results`}
              />
              {examResults.length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons name="chart-line" size={64} color={colors.muted} />
                  <Text style={styles.emptyText}>No results available</Text>
                  <Text style={styles.emptySubtext}>Your exam results will appear here</Text>
                </View>
              ) : (
                examResults.map(renderResultCard)
              )}
            </>
          )}

          {activeTab === 'instructions' && (
            <SurfaceCard style={styles.instructionsCard}>
              <View style={styles.instructionsHeader}>
                <MaterialCommunityIcons name="information-outline" size={24} color={colors.blue} />
                <Text style={styles.instructionsTitle}>General Examination Instructions</Text>
              </View>
              
              <View style={styles.instructionSection}>
                <Text style={styles.instructionSectionTitle}>Before the Exam</Text>
                <View style={styles.instructionList}>
                  <View style={styles.instructionItem}>
                    <MaterialCommunityIcons name="check-circle" size={16} color={colors.green} />
                    <Text style={styles.instructionText}>Bring your student ID card</Text>
                  </View>
                  <View style={styles.instructionItem}>
                    <MaterialCommunityIcons name="check-circle" size={16} color={colors.green} />
                    <Text style={styles.instructionText}>Arrive at the venue 15 minutes early</Text>
                  </View>
                  <View style={styles.instructionItem}>
                    <MaterialCommunityIcons name="check-circle" size={16} color={colors.green} />
                    <Text style={styles.instructionText}>Check your seat number beforehand</Text>
                  </View>
                  <View style={styles.instructionItem}>
                    <MaterialCommunityIcons name="check-circle" size={16} color={colors.green} />
                    <Text style={styles.instructionText}>Bring only allowed materials</Text>
                  </View>
                </View>
              </View>

              <View style={styles.instructionSection}>
                <Text style={styles.instructionSectionTitle}>During the Exam</Text>
                <View style={styles.instructionList}>
                  <View style={styles.instructionItem}>
                    <MaterialCommunityIcons name="check-circle" size={16} color={colors.green} />
                    <Text style={styles.instructionText}>Switch off all electronic devices</Text>
                  </View>
                  <View style={styles.instructionItem}>
                    <MaterialCommunityIcons name="check-circle" size={16} color={colors.green} />
                    <Text style={styles.instructionText}>Follow invigilator instructions</Text>
                  </View>
                  <View style={styles.instructionItem}>
                    <MaterialCommunityIcons name="check-circle" size={16} color={colors.green} />
                    <Text style={styles.instructionText}>Do not communicate with other students</Text>
                  </View>
                  <View style={styles.instructionItem}>
                    <MaterialCommunityIcons name="check-circle" size={16} color={colors.green} />
                    <Text style={styles.instructionText}>Raise hand for queries or assistance</Text>
                  </View>
                </View>
              </View>

              <View style={styles.instructionSection}>
                <Text style={styles.instructionSectionTitle}>Prohibited Items</Text>
                <View style={styles.prohibitedList}>
                  <View style={styles.prohibitedItem}>
                    <MaterialCommunityIcons name="close-circle" size={16} color={colors.red} />
                    <Text style={styles.prohibitedText}>Mobile phones and smartwatches</Text>
                  </View>
                  <View style={styles.prohibitedItem}>
                    <MaterialCommunityIcons name="close-circle" size={16} color={colors.red} />
                    <Text style={styles.prohibitedText}>Books and notes (unless allowed)</Text>
                  </View>
                  <View style={styles.prohibitedItem}>
                    <MaterialCommunityIcons name="close-circle" size={16} color={colors.red} />
                    <Text style={styles.prohibitedText}>Programmable calculators</Text>
                  </View>
                  <View style={styles.prohibitedItem}>
                    <MaterialCommunityIcons name="close-circle" size={16} color={colors.red} />
                    <Text style={styles.prohibitedText}>Any unauthorized materials</Text>
                  </View>
                </View>
              </View>
            </SurfaceCard>
          )}
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
    marginBottom: 16,
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

  /* Tab Container - Cool Design */
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 6,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.line,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: colors.blue,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.slate,
  },
  activeTabText: {
    color: colors.white,
  },
  content: {marginBottom: 16},
  examCard: {
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
  courseName: {
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
  examType: {
    fontSize: 12,
    color: colors.muted,
  },
  examDetails: {
    backgroundColor: colors.panel,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  detailText: {
    fontSize: 13,
    color: colors.slate,
    flexShrink: 1,
  },
  seatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.blueSoft,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  seatText: {
    fontSize: 14,
    color: colors.slate,
    flexShrink: 1,
  },
  seatNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.blue,
  },
  daysBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  daysText: {
    fontSize: 14,
    fontWeight: '700',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blueSoft,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.blue,
  },
  resultCard: {
    marginBottom: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  resultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  resultInfo: {
    flex: 1,
  },
  resultCourseName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 4,
  },
  resultCourseCode: {
    fontSize: 13,
    color: colors.slate,
    marginBottom: 2,
  },
  resultDate: {
    fontSize: 12,
    color: colors.muted,
  },
  resultGrade: {
    alignItems: 'center',
  },
  gradeText: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 2,
  },
  gpaText: {
    fontSize: 12,
    color: colors.slate,
  },
  marksSection: {
    backgroundColor: colors.panel,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  marksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  marksLabel: {
    fontSize: 13,
    color: colors.slate,
  },
  marksValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
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
  percentageText: {
    fontSize: 12,
    color: colors.slate,
    textAlign: 'center',
  },
  resultFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.blue,
  },
  instructionsCard: {
    marginBottom: 20,
  },
  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
  },
  instructionSection: {
    marginBottom: 16,
  },
  instructionSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 8,
  },
  instructionList: {
    gap: 8,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  instructionText: {
    fontSize: 13,
    color: colors.slate,
    flex: 1,
  },
  prohibitedList: {
    gap: 8,
  },
  prohibitedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  prohibitedText: {
    fontSize: 13,
    color: colors.slate,
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.slate,
    marginTop: 4,
  },
});

export default ExamCenterScreen;
