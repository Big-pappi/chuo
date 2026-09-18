import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView, Image} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {SurfaceCard, Pill} from '@/components/ui/Cards';
import {mockStudent} from '@/data/mock';

interface Assignment {
  id: string;
  title: string;
  course: string;
  courseCode: string;
  dueDate: string;
  submittedDate?: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  grade?: string;
  marks?: number;
  totalMarks?: number;
  description: string;
  attachments: number;
}

const AssignmentsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');

  const [assignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Database Design Project',
      course: 'Database Systems',
      courseCode: 'CS 301',
      dueDate: '2024-08-15',
      status: 'pending',
      description: 'Design a complete database schema for a university management system including ER diagrams and normalization.',
      attachments: 2,
    },
    {
      id: '2',
      title: 'Mobile App Prototype',
      course: 'Mobile Computing',
      courseCode: 'CS 402',
      dueDate: '2024-08-10',
      submittedDate: '2024-08-08',
      status: 'submitted',
      description: 'Create a functional prototype of a student attendance tracking app using React Native.',
      attachments: 3,
    },
    {
      id: '3',
      title: 'Research Paper on AI Ethics',
      course: 'Artificial Intelligence',
      courseCode: 'CS 401',
      dueDate: '2024-08-05',
      submittedDate: '2024-08-03',
      status: 'graded',
      grade: 'A',
      marks: 45,
      totalMarks: 50,
      description: 'Write a 10-page research paper discussing ethical considerations in AI development and deployment.',
      attachments: 1,
    },
    {
      id: '4',
      title: 'Web Development Assignment',
      course: 'Web Technologies',
      courseCode: 'CS 303',
      dueDate: '2024-08-01',
      status: 'overdue',
      description: 'Build a responsive e-commerce website using HTML, CSS, and JavaScript.',
      attachments: 4,
    },
    {
      id: '5',
      title: 'Algorithm Analysis',
      course: 'Data Structures & Algorithms',
      courseCode: 'CS 201',
      dueDate: '2024-08-20',
      status: 'pending',
      description: 'Analyze time and space complexity of various sorting algorithms with empirical data.',
      attachments: 2,
    },
  ]);

  const filteredAssignments = assignments.filter(assignment => {
    if (activeTab === 'all') return true;
    return assignment.status === activeTab;
  });

  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'pending':
        return {color: colors.orange, soft: colors.orangeSoft};
      case 'submitted':
        return {color: colors.blue, soft: colors.blueSoft};
      case 'graded':
        return {color: colors.green, soft: colors.greenSoft};
      case 'overdue':
        return {color: colors.red, soft: colors.redSoft};
      default:
        return {color: colors.slate, soft: colors.panel};
    }
  };

  const getStatusIcon = (status: Assignment['status']) => {
    switch (status) {
      case 'pending':
        return 'clock-outline';
      case 'submitted':
        return 'check-circle-outline';
      case 'graded':
        return 'star-outline';
      case 'overdue':
        return 'alert-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
  };

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderAssignmentCard = (assignment: Assignment) => {
    const statusStyle = getStatusColor(assignment.status);
    const daysRemaining = getDaysRemaining(assignment.dueDate);

    return (
      <View key={assignment.id} style={[styles.assignmentCard, {backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line}]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIcon}>
            <MaterialCommunityIcons name={getStatusIcon(assignment.status)} size={20} color={statusStyle.color} />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.assignmentTitle} numberOfLines={1}>
              {assignment.title}
            </Text>
            <Text style={styles.courseInfo}>
              {assignment.courseCode} • {assignment.course}
            </Text>
          </View>
          <Pill label={assignment.status.toUpperCase()} color={statusStyle.color} soft={statusStyle.soft} />
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.footerInfo}>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="calendar" size={14} color={colors.slate} />
              <Text style={styles.infoText}>Due: {formatDate(assignment.dueDate)}</Text>
            </View>
            {assignment.attachments > 0 && (
              <View style={styles.infoItem}>
                <MaterialCommunityIcons name="attachment" size={14} color={colors.slate} />
                <Text style={styles.infoText}>{assignment.attachments} file(s)</Text>
              </View>
            )}
          </View>

          {assignment.status === 'graded' && assignment.grade && (
            <View style={styles.gradeBadge}>
              <Text style={styles.gradeText}>{assignment.grade}</Text>
              <Text style={styles.marksText}>
                {assignment.marks}/{assignment.totalMarks}
              </Text>
            </View>
          )}

          {assignment.status === 'pending' && (
            <View style={[styles.daysBadge, {backgroundColor: daysRemaining <= 2 ? colors.redSoft : colors.greenSoft}]}>
              <Text style={[styles.daysText, {color: daysRemaining <= 2 ? colors.red : colors.green}]}>
                {daysRemaining > 0 ? `${daysRemaining}d left` : 'Due today'}
              </Text>
            </View>
          )}
        </View>
      </View>
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
            <Text style={styles.title}>Assignments</Text>
            <Pressable
              style={styles.headerBtn}
              hitSlop={8}
              onPress={() => navigation.navigate('Profile')}>
              <Image source={mockStudent.avatar} style={styles.avatar} />
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
          {/* View toggle */}
          <View style={styles.toggleContainer}>
            {(['all', 'pending', 'submitted', 'graded'] as const).map(tab => {
              const active = activeTab === tab;
              return (
                <Pressable
                  key={tab}
                  style={[styles.toggleButton, active && styles.activeToggle]}
                  onPress={() => setActiveTab(tab)}>
                  <Text style={[styles.toggleText, active && styles.activeToggleText]}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Assignments list */}
          {filteredAssignments.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="clipboard-text-outline" size={64} color={colors.muted} />
              <Text style={styles.emptyText}>No assignments found</Text>
              <Text style={styles.emptySubtext}>
                {activeTab === 'all' ? 'You have no assignments yet' : `No ${activeTab} assignments`}
              </Text>
            </View>
          ) : (
            filteredAssignments.map(renderAssignmentCard)
          )}
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

  /* Scroll Content */
  scrollContent: {flex: 1},
  scrollContentContainer: {paddingHorizontal: 16, paddingTop: 100, paddingBottom: 20},

  /* Header Buttons */
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

  /* Toggle - Cool Design */
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 6,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.line,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: colors.blue,
  },
  toggleText: {fontSize: 13, fontWeight: '700', color: colors.slate},
  activeToggleText: {color: colors.white},

  /* Assignment card */
  assignmentCard: {marginBottom: 16},
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assignmentTitle: {fontSize: 16, fontWeight: '800', color: colors.ink},
  courseInfo: {fontSize: 12, color: colors.slate, marginTop: 2},
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerInfo: {
    flexDirection: 'row',
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: colors.slate,
  },
  gradeBadge: {
    backgroundColor: colors.greenSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  gradeText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.green,
  },
  marksText: {
    fontSize: 11,
    color: colors.greenDark,
  },
  daysBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  daysText: {
    fontSize: 12,
    fontWeight: '700',
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

export default AssignmentsScreen;