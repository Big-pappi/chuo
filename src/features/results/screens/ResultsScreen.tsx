import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootState, AppDispatch} from '../../../store/store';
import {fetchResults, fetchTranscript} from '../../../store/slices/universitySlice';
import {SemesterResults, AcademicResult} from '../../../types/university.types';
import {colors} from '../../../theme';
import Screen from '@/components/ui/Screen';
import {Pill} from '@/components/ui/Cards';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';

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

  // Aggregate stats across all loaded semesters for the hero summary.
  const summary = useMemo(() => {
    if (results.length === 0) {
      return {cgpa: 0, credits: 0, courses: 0, best: 0};
    }
    let totalPoints = 0;
    let totalCredits = 0;
    let courseCount = 0;
    let best = 0;
    results.forEach(sem => {
      sem.courses.forEach(course => {
        totalPoints += course.gradePoint * course.credits;
        totalCredits += course.credits;
        courseCount += 1;
      });
      best = Math.max(best, sem.gpa);
    });
    return {
      cgpa: totalCredits > 0 ? totalPoints / totalCredits : 0,
      credits: totalCredits,
      courses: courseCount,
      best,
    };
  }, [results]);

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

  // Classification bands on the Tanzanian 5.0 GPA scale.
  const standing = (cgpa: number) => {
    if (cgpa >= 4.4) return 'First Class';
    if (cgpa >= 3.5) return 'Upper Second';
    if (cgpa >= 2.7) return 'Lower Second';
    if (cgpa >= 2.0) return 'Pass';
    return 'Fail';
  };

  const renderCourse = (course: AcademicResult) => (
    <View key={course.id} style={styles.courseRow}>
      <View style={[styles.gradeChip, {backgroundColor: gradeSoft(course.gradePoint)}]}>
        <Text style={[styles.gradeChipText, {color: gradeColor(course.gradePoint)}]}>
          {course.grade}
        </Text>
      </View>
      <View style={styles.courseInfo}>
        <Text style={styles.courseName} numberOfLines={1}>
          {course.courseName}
        </Text>
        <Text style={styles.courseMeta}>
          {course.courseCode} • {course.credits} credits
        </Text>
      </View>
      <Text style={[styles.gradePoint, {color: gradeColor(course.gradePoint)}]}>
        {course.gradePoint.toFixed(1)}
      </Text>
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
            <Text style={styles.title}>Academic Results</Text>
          </View>
        </View>

        <View style={styles.scrollContent}>
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

        {/* Results snapshot */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>CGPA</Text>
              <Text style={styles.summaryValue}>{summary.cgpa.toFixed(2)}</Text>
              <Text style={styles.summaryMeta}>/ 5.0</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Credits</Text>
              <Text style={styles.summaryValue}>{summary.credits}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Best GPA</Text>
              <Text style={styles.summaryValue}>{summary.best.toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.standingBadge}>
            <Text style={styles.standingText}>{standing(summary.cgpa)}</Text>
          </View>
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

  /* Scroll Content */
  scrollContent: {paddingHorizontal: 16, paddingTop: 100, paddingBottom: 20},

  /* Results snapshot */
  summaryCard: {marginBottom: 24, paddingVertical: 4},
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.slate,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.ink,
    marginBottom: 2,
  },
  summaryMeta: {
    fontSize: 11,
    color: colors.slate,
  },
  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.line,
  },
  standingBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.greenSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  standingText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.green,
  },

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
  coursesList: {gap: 14},
  courseRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
  gradeChip: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeChipText: {fontSize: 14, fontWeight: '800'},
  courseInfo: {flex: 1},
  courseName: {fontSize: 14, fontWeight: '700', color: colors.ink},
  courseMeta: {fontSize: 12, color: colors.slate, marginTop: 2},
  gradePoint: {fontSize: 15, fontWeight: '800'},
});

export default ResultsScreen;
