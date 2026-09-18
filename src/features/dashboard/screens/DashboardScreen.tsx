import React, {useMemo, useState} from 'react';
import {View, Text, StyleSheet, Pressable, Modal} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {useAppSelector} from '@/store/hooks';
import {WidgetId} from '@/store/slices/dashboardSlice';
import {mockStudent} from '@/data/mock';
import DashboardHeader from '../components/DashboardHeader';
import {
  HeroCard,
  QuickAccess,
  TodaysClasses,
  TasksDeadlines,
  FeeStatus,
  Announcements,
  Opportunities,
} from '../components/widgets';

// Maps a quick-access tile id to the screen it opens (when available).
const TILE_ROUTES: Record<string, string> = {
  timetable: 'Timetable',
  results: 'Results',
  fees: 'Fees',
  scholarships: 'Scholarships',
  assignments: 'Assignments',
  attendance: 'Attendance',
  notices: 'Notices',
  library: 'Library',
  exams: 'ExamCenter',
  documents: 'Documents',
  announcements: 'Announcements',
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

// Date filter presets the student can pick to scope the dashboard content.
const DATE_FILTERS = ['Today', 'This Week', 'This Month', 'This Semester'] as const;
type DateFilter = (typeof DATE_FILTERS)[number];

function filterLabel(filter: DateFilter): string {
  if (filter === 'Today') {
    return new Date().toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  return filter;
}

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const widgets = useAppSelector(state => state.dashboard.widgets);
  const quickAccess = useAppSelector(state => state.dashboard.quickAccess);
  const insets = useSafeAreaInsets();

  const [dateFilter, setDateFilter] = useState<DateFilter>('Today');
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const dateText = useMemo(() => filterLabel(dateFilter), [dateFilter]);

  const goCustomize = () => navigation.navigate('Customize');
  const go = (route: string) => navigation.navigate(route);

  const renderWidget = (id: WidgetId) => {
    switch (id) {
      case 'gpaHero':
        return <HeroCard key={id} onProfile={() => navigation.navigate('Profile')} />;
      case 'quickAccess':
        return (
          <QuickAccess
            key={id}
            tileIds={quickAccess}
            onCustomize={goCustomize}
            onTilePress={tileId => {
              const route = TILE_ROUTES[tileId];
              if (route) go(route);
            }}
          />
        );
      case 'upcomingClasses':
        return <TodaysClasses key={id} onViewAll={() => go('Timetable')} />;
      case 'tasks':
        return <TasksDeadlines key={id} />;
      case 'feeStatus':
        return (
          <FeeStatus key={id} onDetails={() => go('Fees')} />
        );
      case 'announcements':
        return <Announcements key={id} onViewAll={() => go('Notifications')} />;
      case 'opportunities':
        return <Opportunities key={id} />;
      default:
        return null;
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={[styles.fixedHeader, {paddingTop: insets.top}]}>
          <DashboardHeader
            onNotifications={() => navigation.navigate('Notifications')}
            onProfile={() => navigation.navigate('Profile')}
          />
        </View>

        <View style={styles.scrollContent}>
          {/* Greeting */}
          <View style={styles.greetingRow}>
            <View style={{flex: 1}}>
              <Text style={styles.greeting}>{greeting()}, {mockStudent.firstName}</Text>
              <Text style={styles.subGreeting}>Here&apos;s your academic snapshot</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Pressable style={styles.datePill} onPress={() => setDatePickerOpen(true)}>
              <MaterialCommunityIcons name="calendar-blank-outline" size={16} color={colors.blue} />
              <Text style={styles.dateText}>{dateText}</Text>
              <MaterialCommunityIcons name="chevron-down" size={16} color={colors.slate} />
            </Pressable>

            <Pressable style={styles.customizeBtn} onPress={goCustomize}>
              <MaterialCommunityIcons name="tune-variant" size={16} color={colors.blue} />
              <Text style={styles.customizeText}>Customize</Text>
            </Pressable>
          </View>

          {widgets.filter(w => w.enabled).map(w => renderWidget(w.id))}
        </View>
      </View>

      <Modal
        visible={datePickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDatePickerOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setDatePickerOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>Filter by date</Text>
            {DATE_FILTERS.map(option => {
              const active = option === dateFilter;
              return (
                <Pressable
                  key={option}
                  style={[styles.sheetRow, active && styles.sheetRowActive]}
                  onPress={() => {
                    setDateFilter(option);
                    setDatePickerOpen(false);
                  }}>
                  <Text style={[styles.sheetRowText, active && styles.sheetRowTextActive]}>
                    {option}
                  </Text>
                  {active ? (
                    <MaterialCommunityIcons name="check" size={18} color={colors.blue} />
                  ) : null}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg},
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: colors.bg,
  },
  scrollContent: {paddingHorizontal: 18, paddingTop: 104, paddingBottom: 20},
  greetingRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 14},
  greeting: {fontSize: 25, fontWeight: '900', color: colors.navy, marginBottom: 4, letterSpacing: -0.5},
  subGreeting: {fontSize: 13, fontWeight: '600', color: colors.slate},
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: colors.navy,
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
    elevation: 1,
  },
  dateText: {fontSize: 13, fontWeight: '700', color: colors.ink},
  customizeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.blueSoft,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: colors.navy,
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
    elevation: 1,
  },
  customizeText: {fontSize: 13, fontWeight: '700', color: colors.blue},
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  sheetTitle: {fontSize: 16, fontWeight: '800', color: colors.ink, marginBottom: 12},
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  sheetRowActive: {backgroundColor: colors.blueSoft},
  sheetRowText: {fontSize: 15, fontWeight: '600', color: colors.ink},
  sheetRowTextActive: {color: colors.blue, fontWeight: '800'},
});

export default DashboardScreen;
