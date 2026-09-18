import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {LinearGradient} from 'expo-linear-gradient';
import Screen from '@/components/ui/Screen';
import {colors, gradients} from '@/theme';
import {SurfaceCard, Pill} from '@/components/ui/Cards';

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
      <SurfaceCard key={assignment.id} style={styles.assignmentCard}>
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
            <Text style={styles.title}>Assignments</Text>
            <Pressable style={styles.headerBtn} hitSlop={8}>
              <MaterialCommunityIcons name="clipboard-check" size={20} color={colors.blue} />
            </Pressable>
          </View>
        </View>

        <View style={styles.scrollContent}>
          {/* Hero summary */}
          <LinearGradient
            colors={gradients.hero}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.hero}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>Total Assignments</Text>
              <View style={styles.heroCgpaRow}>
                <Text style={styles.heroCgpa}>{assignments.length}</Text>
              </View>
            </View>
            <View style={styles.standingPill}>
              <View style={styles.standingDot} />
              <Text style={styles.standingText}>Active</Text>
            </View>
          </View>

          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{assignments.filter(a => a.status === 'pending').length}</Text>
              <Text style={styles.heroStatLabel}>Pending</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{assignments.filter(a => a.status === 'submitted').length}</Text>
              <Text style={styles.heroStatLabel}>Submitted</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={[styles.heroStatValue, {color: colors.green}]}>{assignments.filter(a => a.status === 'graded').length}</Text>
              <Text style={styles.heroStatLabel}>Graded</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={[styles.heroStatValue, {color: colors.red}]}>{assignments.filter(a => a.status === 'overdue').length}</Text>
              <Text style={styles.heroStatLabel}>Overdue</Text>
            </View>
          </View>
        </LinearGradient>

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
        </View>
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

  /* Scroll Content */
  scrollContent: {paddingHorizontal: 16, paddingTop: 100, paddingBottom: 20},

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

  /* Hero */
  hero: {
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  heroCgpaRow: {flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 6},
  heroCgpa: {color: colors.white, fontSize: 44, fontWeight: '800', lineHeight: 46},
  standingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(110,231,183,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  standingDot: {width: 7, height: 7, borderRadius: 4, backgroundColor: '#6EE7B7'},
  standingText: {color: '#6EE7B7', fontSize: 12, fontWeight: '800'},
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingVertical: 14,
  },
  heroStat: {flex: 1, alignItems: 'center'},
  heroStatValue: {color: colors.white, fontSize: 20, fontWeight: '800'},
  heroStatLabel: {color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '600', marginTop: 3},
  heroStatDivider: {width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.2)'},

  /* Toggle */
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.panel,
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: colors.white,
    shadowColor: '#0B2A6B',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  toggleText: {fontSize: 13, fontWeight: '700', color: colors.slate},
  activeToggleText: {color: colors.blue},

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