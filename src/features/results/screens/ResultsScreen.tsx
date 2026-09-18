import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, Pressable, Image, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootState, AppDispatch} from '../../../store/store';
import {fetchResults, fetchTranscript} from '../../../store/slices/universitySlice';
import {SemesterResults, AcademicResult} from '../../../types/university.types';
import {colors} from '../../../theme';
import Screen from '@/components/ui/Screen';
import {SurfaceCard, Pill} from '@/components/ui/Cards';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import {mockStudent} from '@/data/mock';

const ResultsScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const {results, isLoading, error} = useSelector((state: RootState) => state.university);
  const [viewMode, setViewMode] = useState<'current' | 'transcript'>('current');

  useEffect(() => {
    if (viewMode === 'current') {
      dispatch(fetchResults());
    } else {
      dispatch(fetchTranscript());
    }
  }, [dispatch, viewMode]);

  const gradeColor = (gradePoint: number) => {
    if (gradePoint >= 4.0) return colors.green;
    if (gradePoint >= 3.0) return colors.blue;
    if (gradePoint >= 2.0) return colors.orange;
    return colors.red;
  };

  const gradeSoft = (gradePoint: number) => {
    if (gradePoint >= 4.0) return colors.greenSoft;
    if (gradePoint >= 3.0) return colors.blueSoft;
    if (gradePoint >= 2.0) return colors.orangeSoft;
    return colors.redSoft;
  };

  const renderCourse = (course: AcademicResult) => (
    <View key={course.id} style={styles.courseRow}>
      <View style={styles.courseLeft}>
        <Text style={styles.courseCode}>{course.courseCode}</Text>
        <Text style={styles.courseName} numberOfLines={1}>
          {course.courseName}
        </Text>
        <Text style={styles.courseMeta}>{course.credits} credits</Text>
      </View>
      <View style={styles.courseRight}>
        <View style={[styles.gradeBadge, {backgroundColor: gradeSoft(course.gradePoint)}]}>
          <Text style={[styles.gradeBadgeText, {color: gradeColor(course.gradePoint)}]}>
            {course.grade}
          </Text>
        </View>
        <Text style={[styles.gradePoint, {color: gradeColor(course.gradePoint)}]}>
          {course.gradePoint.toFixed(1)}
        </Text>
      </View>
    </View>
  );

  const renderSemesterCard = (semester: SemesterResults) => (
    <View
      key={`${semester.semester}-${semester.academicYear}`}
      style={styles.semesterCard}>
      <View style={styles.semesterHeader}>
        <View style={styles.semesterIcon}>
          <MaterialCommunityIcons name="book-open-variant" size={20} color={colors.blue} />
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.semesterTitle}>{semester.semester}</Text>
          <Text style={styles.academicYear}>{semester.academicYear}</Text>
        </View>
        <View style={styles.gpaContainer}>
          <Text style={styles.gpaLabel}>GPA</Text>
          <Text style={styles.gpaValue}>{semester.gpa.toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.coursesList}>{semester.courses.map(renderCourse)}</View>
    </View>
  );

  if (isLoading && results.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && results.length === 0) {
    return (
      <EmptyState icon="file-document-outline" title="Error Loading Results" message={error} />
    );
  }

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
            <Text style={styles.title}>My Results</Text>
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
            {(['current', 'transcript'] as const).map(mode => {
              const active = viewMode === mode;
              return (
                <Pressable
                  key={mode}
                  style={[styles.toggleButton, active && styles.activeToggle]}
                  onPress={() => setViewMode(mode)}>
                  <Text style={[styles.toggleText, active && styles.activeToggleText]}>
                    {mode === 'current' ? 'Current' : 'Full Transcript'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Results list */}
          {results.length === 0 ? (
            <EmptyState
              icon="file-document-outline"
              title="No Results Available"
              message="Your academic results will appear here"
            />
          ) : (
            results.map(renderSemesterCard)
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

  /* Semester timeline */
  semesterCard: {marginBottom: 22, paddingLeft: 14, borderLeftWidth: 3, borderLeftColor: colors.blue},
  semesterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  semesterIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  semesterTitle: {fontSize: 16, fontWeight: '800', color: colors.ink},
  academicYear: {fontSize: 12, color: colors.slate, marginTop: 2},
  gpaContainer: {alignItems: 'center'},
  gpaLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.slate,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  gpaValue: {fontSize: 22, fontWeight: '800', color: colors.blue},
  coursesList: {gap: 12},
  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.line,
  },
  courseLeft: {
    flex: 1,
    gap: 4,
  },
  courseCode: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.blue,
  },
  courseName: {fontSize: 14, fontWeight: '700', color: colors.ink},
  courseMeta: {fontSize: 11, color: colors.slate},
  courseRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  gradeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    minWidth: 36,
    alignItems: 'center',
  },
  gradeBadgeText: {fontSize: 13, fontWeight: '800'},
  gradePoint: {fontSize: 15, fontWeight: '800', minWidth: 28, textAlign: 'right'},
});

export default ResultsScreen;
