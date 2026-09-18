import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {colors, spacing, typography} from '@/theme';
import Card from '@/components/Card';

interface TimetableEntry {
  id: string;
  day: string;
  time: string;
  course: string;
  venue: string;
  lecturer: string;
  type: 'lecture' | 'lab' | 'tutorial';
}

const WeekView: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [timetableData] = useState<Record<string, TimetableEntry[]>>({
    Monday: [
      {
        id: '1',
        day: 'Monday',
        time: '08:00 - 10:00',
        course: 'CS201: Data Structures',
        venue: 'Room 301',
        lecturer: 'Dr. M. Kimaro',
        type: 'lecture',
      },
      {
        id: '2',
        day: 'Monday',
        time: '10:00 - 12:00',
        course: 'CS202: Algorithms',
        venue: 'Room 302',
        lecturer: 'Prof. J. Mushi',
        type: 'lecture',
      },
      {
        id: '3',
        day: 'Monday',
        time: '14:00 - 16:00',
        course: 'CS201 Lab',
        venue: 'Computer Lab 1',
        lecturer: 'Dr. M. Kimaro',
        type: 'lab',
      },
    ],
    Tuesday: [
      {
        id: '4',
        day: 'Tuesday',
        time: '09:00 - 11:00',
        course: 'CS203: Database Systems',
        venue: 'Room 303',
        lecturer: 'Dr. A. Massawe',
        type: 'lecture',
      },
      {
        id: '5',
        day: 'Tuesday',
        time: '14:00 - 16:00',
        course: 'CS203 Lab',
        venue: 'Computer Lab 2',
        lecturer: 'Dr. A. Massawe',
        type: 'lab',
      },
    ],
    Wednesday: [
      {
        id: '6',
        day: 'Wednesday',
        time: '08:00 - 10:00',
        course: 'CS204: Software Engineering',
        venue: 'Room 304',
        lecturer: 'Prof. S. Mwakyembe',
        type: 'lecture',
      },
      {
        id: '7',
        day: 'Wednesday',
        time: '11:00 - 13:00',
        course: 'CS201 Tutorial',
        venue: 'Room 301',
        lecturer: 'Dr. M. Kimaro',
        type: 'tutorial',
      },
    ],
    Thursday: [
      {
        id: '8',
        day: 'Thursday',
        time: '10:00 - 12:00',
        course: 'CS205: Computer Networks',
        venue: 'Room 305',
        lecturer: 'Dr. R. Mtaho',
        type: 'lecture',
      },
      {
        id: '9',
        day: 'Thursday',
        time: '14:00 - 16:00',
        course: 'CS205 Lab',
        venue: 'Network Lab',
        lecturer: 'Dr. R. Mtaho',
        type: 'lab',
      },
    ],
    Friday: [
      {
        id: '10',
        day: 'Friday',
        time: '09:00 - 11:00',
        course: 'CS206: Operating Systems',
        venue: 'Room 306',
        lecturer: 'Prof. E. Marwa',
        type: 'lecture',
      },
      {
        id: '11',
        day: 'Friday',
        time: '14:00 - 16:00',
        course: 'CS206 Tutorial',
        venue: 'Room 306',
        lecturer: 'Prof. E. Marwa',
        type: 'tutorial',
      },
    ],
    Saturday: [],
    Sunday: [],
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const getTypeColor = (type: TimetableEntry['type']) => {
    switch (type) {
      case 'lecture':
        return colors.blue;
      case 'lab':
        return colors.success;
      case 'tutorial':
        return colors.warning;
      default:
        return colors.slate;
    }
  };

  const getTypeIcon = (type: TimetableEntry['type']) => {
    switch (type) {
      case 'lecture':
        return 'presentation';
      case 'lab':
        return 'flask';
      case 'tutorial':
        return 'account-group';
      default:
        return 'calendar';
    }
  };

  const currentClasses = timetableData[selectedDay] || [];

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScroll}>
        {days.map(day => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDay === day && styles.activeDayButton,
            ]}
            onPress={() => setSelectedDay(day)}>
            <Text style={[
              styles.dayText,
              selectedDay === day && styles.activeDayText,
            ]}>
              {day.slice(0, 3)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content}>
        {currentClasses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="calendar-blank" size={80} color={colors.slate} />
            <Text style={styles.emptyText}>No classes</Text>
            <Text style={styles.emptySubtext}>Enjoy your day off!</Text>
          </View>
        ) : (
          currentClasses.map(cls => (
            <Card key={cls.id} style={styles.classCard}>
              <View style={styles.cardHeader}>
                <View style={[
                  styles.typeBadge,
                  {backgroundColor: getTypeColor(cls.type) + '20'}
                ]}>
                  <MaterialCommunityIcons
                    name={getTypeIcon(cls.type) as any}
                    size={20}
                    color={getTypeColor(cls.type)}
                  />
                </View>
                <Text style={styles.time}>{cls.time}</Text>
              </View>

              <Text style={styles.course}>{cls.course}</Text>

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons name="map-marker" size={16} color={colors.slate} />
                  <Text style={styles.detailText}>{cls.venue}</Text>
                </View>
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons name="account" size={16} color={colors.slate} />
                  <Text style={styles.detailText}>{cls.lecturer}</Text>
                </View>
              </View>

              <View style={[
                styles.typeIndicator,
                {backgroundColor: getTypeColor(cls.type)}
              ]} />
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  daysScroll: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.panel,
  },
  dayButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginRight: spacing.sm,
    backgroundColor: colors.white,
  },
  activeDayButton: {
    backgroundColor: colors.blue,
  },
  dayText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.slate,
  },
  activeDayText: {
    color: colors.white,
  },
  content: {
    padding: spacing.md,
  },
  classCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  typeBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  time: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.ink,
  },
  course: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.ink,
    marginBottom: spacing.md,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: typography.fontSize.sm,
    color: colors.slate,
    marginLeft: spacing.xs,
  },
  typeIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  emptyText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.medium,
    color: colors.ink,
    marginTop: spacing.lg,
  },
  emptySubtext: {
    fontSize: typography.fontSize.base,
    color: colors.slate,
    marginTop: spacing.xs,
  },
});

export default WeekView;
