import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {
  timetableDays,
  timetableClasses,
  mockStudent,
} from '@/data/mock';

const FILTERS = [
  {id: 'all', label: 'All Classes', icon: 'account-group', kind: null},
  {id: 'lectures', label: 'Lectures', icon: 'book-open-page-variant', kind: 'Lecture'},
  {id: 'tutorials', label: 'Tutorials', icon: 'notebook', kind: 'Tutorial'},
  {id: 'practical', label: 'Practical', icon: 'flask', kind: 'Practical'},
] as const;

const DAY_FULL: Record<string, string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
};

const KIND_TINT: Record<string, {color: string; soft: string}> = {
  Lecture: {color: colors.blue, soft: colors.blueSoft},
  Tutorial: {color: colors.orange, soft: colors.orangeSoft},
  Practical: {color: colors.red, soft: colors.redSoft},
};

const TimetableScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [activeDay, setActiveDay] = useState(() => {
    const today = new Date().getDay();
    const dayMap: Record<number, string> = {0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat'};
    return dayMap[today] || 'tue';
  });
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const day = timetableDays.find(d => d.id === activeDay) ?? timetableDays[0];

  const classes = useMemo(() => {
    const kind = FILTERS.find(f => f.id === activeFilter)?.kind;
    return kind ? timetableClasses.filter(c => c.kind === kind) : timetableClasses;
  }, [activeFilter]);

  const dateHeading = `${DAY_FULL[day.day]}, ${day.date} ${day.month} 2024`;

  return (
    <Screen>
      <View style={styles.container}>
        {/* Fixed Header */}
        <View style={[styles.fixedHeader, {paddingTop: insets.top}]}>
          <View style={styles.header}>
            <Pressable
              style={styles.headerBtn}
              hitSlop={8}
              onPress={() => navigation.canGoBack() && navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Go back">
              <MaterialCommunityIcons name="arrow-left" size={22} color={colors.ink} />
            </Pressable>
            <Text style={styles.title}>Timetable</Text>
            <Pressable
              style={styles.headerBtn}
              hitSlop={8}
              onPress={() => navigation.navigate('Profile')}
              accessibilityRole="button"
              accessibilityLabel="Open profile">
              <Image source={mockStudent.avatar} style={styles.avatar} />
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.scrollContent}>
          {/* Week day selector */}
          <View style={styles.weekCard}>
            <Pressable style={styles.weekArrow} hitSlop={8} accessibilityLabel="Previous week">
              <MaterialCommunityIcons name="chevron-left" size={22} color={colors.slate} />
            </Pressable>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.weekDays}>
              {timetableDays.map(d => {
                const active = d.id === activeDay;
                return (
                  <Pressable
                    key={d.id}
                    style={[styles.dayCell, active && styles.dayCellActive]}
                    onPress={() => setActiveDay(d.id)}>
                    <Text style={[styles.dayName, active && styles.dayTextActive]}>{d.day}</Text>
                    <Text style={[styles.dayDate, active && styles.dayTextActive]}>{d.date}</Text>
                    <Text style={[styles.dayMonth, active && styles.dayMonthActive]}>{d.month}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Pressable style={styles.weekArrow} hitSlop={8} accessibilityLabel="Next week">
              <MaterialCommunityIcons name="chevron-right" size={22} color={colors.slate} />
            </Pressable>

            <Pressable
              style={styles.todayBtn}
              onPress={() => {
                const today = new Date().getDay();
                const dayMap: Record<number, string> = {0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat'};
                setActiveDay(dayMap[today] || 'tue');
              }}
              accessibilityLabel="Jump to today">
              <MaterialCommunityIcons name="calendar-today" size={16} color={colors.blue} />
              <Text style={styles.todayText}>Today</Text>
            </Pressable>
          </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}>
          {FILTERS.map(f => {
            const active = f.id === activeFilter;
            return (
              <Pressable
                key={f.id}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setActiveFilter(f.id)}>
                <MaterialCommunityIcons
                  name={f.icon as any}
                  size={15}
                  color={active ? colors.white : colors.slate}
                />
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{f.label}</Text>
              </Pressable>
            );
          })}
          <Pressable style={styles.chip}>
            <MaterialCommunityIcons name="tune-variant" size={15} color={colors.slate} />
            <Text style={styles.chipText}>Filter</Text>
          </Pressable>
        </ScrollView>

        {/* Day heading */}
        <View style={styles.dayHeading}>
          <Text style={styles.dayHeadingText}>{dateHeading}</Text>
          <Text style={styles.dayHeadingCount}>{classes.length} Classes</Text>
        </View>

        {/* Class timeline */}
        <View style={styles.timeline}>
          {classes.map((c, i) => {
            const tint = KIND_TINT[c.kind] ?? {color: colors.blue, soft: colors.blueSoft};
            return (
              <View key={c.id} style={styles.timelineRow}>
                {/* Time + dot rail */}
                <View style={styles.rail}>
                  <Text style={styles.railTime}>{c.time.split(' ')[0]}</Text>
                  <Text style={styles.railMeridiem}>{c.time.split(' ')[1]}</Text>
                  <View style={[styles.railDot, {backgroundColor: c.dot}]} />
                  {i < classes.length - 1 ? <View style={styles.railLine} /> : null}
                </View>

                {/* Class card */}
                <Pressable style={[styles.classCard, {backgroundColor: c.soft}]}>
                  <View style={styles.classTop}>
                    <View style={[styles.codeChip, {backgroundColor: colors.white}]}>
                      <MaterialCommunityIcons name={c.icon as any} size={16} color={c.color} />
                      <Text style={[styles.codeText, {color: c.color}]}>{c.code}</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color={colors.muted} />
                  </View>

                  <Text style={styles.classTitle}>{c.title}</Text>

                  <View style={[styles.kindBadge, {backgroundColor: tint.soft}]}>
                    <Text style={[styles.kindText, {color: tint.color}]}>{c.kind}</Text>
                  </View>

                  <View style={styles.classMetaRow}>
                    <MaterialCommunityIcons name="map-marker-outline" size={14} color={colors.slate} />
                    <Text style={styles.classMeta} numberOfLines={1}>
                      {c.room}
                    </Text>
                  </View>
                  <View style={styles.classMetaRow}>
                    <MaterialCommunityIcons name="account-outline" size={14} color={colors.slate} />
                    <Text style={styles.classMeta} numberOfLines={1}>
                      {c.lecturer}
                    </Text>
                  </View>
                </Pressable>
              </View>
            );
          })}

          {classes.length === 0 ? (
            <View style={styles.empty}>
              <MaterialCommunityIcons name="calendar-blank-outline" size={28} color={colors.muted} />
              <Text style={styles.emptyText}>No classes match this filter.</Text>
            </View>
          ) : null}
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
  title: {flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '800', color: colors.ink},
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
  scrollContent: {paddingHorizontal: 16, paddingTop: 100, paddingBottom: 20},

  /* Week selector */
  weekCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
  },
  weekArrow: {width: 28, alignItems: 'center', justifyContent: 'center'},
  weekDays: {gap: 8, paddingHorizontal: 2},
  dayCell: {
    width: 48,
    paddingVertical: 8,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: colors.panel,
  },
  dayCellActive: {backgroundColor: colors.blue},
  dayName: {fontSize: 11, fontWeight: '600', color: colors.slate},
  dayDate: {fontSize: 18, fontWeight: '800', color: colors.ink, marginVertical: 1},
  dayMonth: {fontSize: 10, fontWeight: '600', color: colors.muted},
  dayTextActive: {color: colors.white},
  dayMonthActive: {color: 'rgba(255,255,255,0.85)'},
  todayBtn: {alignItems: 'center', justifyContent: 'center', paddingLeft: 8, paddingRight: 4, gap: 2},
  todayText: {fontSize: 10, fontWeight: '700', color: colors.blue},

  /* Filter chips */
  filters: {gap: 8, paddingBottom: 4, marginBottom: 16},
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chipActive: {backgroundColor: colors.blue, borderColor: colors.blue},
  chipText: {fontSize: 12, fontWeight: '700', color: colors.slate},
  chipTextActive: {color: colors.white},

  /* Day heading */
  dayHeading: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14},
  dayHeadingText: {fontSize: 15, fontWeight: '800', color: colors.ink},
  dayHeadingCount: {fontSize: 12, fontWeight: '700', color: colors.slate},

  /* Timeline */
  timeline: {marginBottom: 4},
  timelineRow: {flexDirection: 'row', gap: 12},
  rail: {width: 52, alignItems: 'center'},
  railTime: {fontSize: 12, fontWeight: '800', color: colors.ink},
  railMeridiem: {fontSize: 10, fontWeight: '600', color: colors.muted},
  railDot: {width: 12, height: 12, borderRadius: 6, marginTop: 6, borderWidth: 2, borderColor: colors.white},
  railLine: {flex: 1, width: 2, backgroundColor: colors.line, marginTop: 2},
  classCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
  },
  classTop: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  codeChip: {flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10},
  codeText: {fontSize: 12, fontWeight: '800'},
  classTitle: {fontSize: 15, fontWeight: '800', color: colors.ink, marginTop: 10},
  kindBadge: {alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, marginTop: 6, marginBottom: 8},
  kindText: {fontSize: 11, fontWeight: '700'},
  classMetaRow: {flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3},
  classMeta: {flex: 1, fontSize: 12, color: colors.slate, fontWeight: '600'},
  empty: {alignItems: 'center', gap: 8, paddingVertical: 28},
  emptyText: {fontSize: 13, color: colors.slate, fontWeight: '600'},
});

export default TimetableScreen;
