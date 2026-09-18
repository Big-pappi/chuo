import React, {useMemo, useState} from 'react';
import {View, Text, StyleSheet, Pressable, Image} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Screen from '@/components/ui/Screen';
import {colors, getColors} from '@/theme';
import {useTheme} from '@/context/ThemeContext';
import {
  mockStudent,
  notifications as seedNotifications,
  type NotificationFilter,
} from '@/data/mock';
import {
  NotificationTabs,
  NotificationCard,
  EnableBanner,
} from '../components/notifications';

const GROUPS = ['Today', 'Yesterday'] as const;

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const {isDark} = useTheme();
  const {colors: themeColors} = getColors(isDark);
  const [filter, setFilter] = useState<NotificationFilter>('All');
  const [items, setItems] = useState(seedNotifications);

  const unreadCount = useMemo(
    () => items.filter(n => n.unread).length,
    [items],
  );

  const filtered = useMemo(() => {
    if (filter === 'All') return items;
    if (filter === 'Unread') return items.filter(n => n.unread);
    return items.filter(n => n.category === filter);
  }, [filter, items]);

  const markRead = (id: string) =>
    setItems(prev => prev.map(n => (n.id === id ? {...n, unread: false} : n)));

  const markAllRead = () =>
    setItems(prev => prev.map(n => ({...n, unread: false})));

  return (
    <Screen>
      <View style={[styles.container, {backgroundColor: themeColors.bg}]}>
        {/* Fixed Header */}
        <View style={[styles.fixedHeader, {paddingTop: insets.top, backgroundColor: themeColors.bg}]}>
          <View style={styles.header}>
            <Pressable
              style={[styles.headerBtn, {backgroundColor: themeColors.white}]}
              hitSlop={8}
              onPress={() => navigation.canGoBack() && navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Go back">
              <MaterialCommunityIcons name="arrow-left" size={22} color={themeColors.ink} />
            </Pressable>
            <View style={styles.titleWrap}><Text style={[styles.title, {color: themeColors.ink}]}>Notifications</Text><Text style={[styles.unreadSummary, {color: themeColors.slate}]}>{unreadCount} unread</Text></View>
            <View style={styles.headerActions}>
              <Pressable style={styles.headerBtn} hitSlop={8} accessibilityLabel="Settings">
                <MaterialCommunityIcons name="cog-outline" size={20} color={themeColors.ink} />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.scrollContent}>
          {/* Filters */}
          <NotificationTabs active={filter} onSelect={setFilter} unreadCount={unreadCount} />

          {/* Grouped list */}
          {GROUPS.map(group => {
            const groupItems = filtered.filter(n => n.group === group);
            if (groupItems.length === 0) return null;
            return (
              <View key={group}>
                <Text style={styles.groupHeader}>{group}</Text>
                {groupItems.map(item => (
                  <NotificationCard
                    key={item.id}
                    item={item}
                    onPress={() => markRead(item.id)}
                  />
                ))}
              </View>
            );
          })}

          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <MaterialCommunityIcons name="bell-check-outline" size={54} color={colors.muted} />
              <Text style={styles.emptyText}>You&apos;re all caught up!</Text>
              <Text style={styles.emptySub}>No notifications to show here.</Text>
            </View>
          ) : null}

          <EnableBanner />
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
  titleWrap: {flex: 1, alignItems: 'center'},
  title: {fontSize: 20, fontWeight: '800'},
  unreadSummary: {fontSize: 11, fontWeight: '600', marginTop: 2},
  headerActions: {flexDirection: 'row', gap: 8},

  /* Scroll Content */
  scrollContent: {paddingHorizontal: 16, paddingTop: 100, paddingBottom: 20},
  markAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 5,
    paddingVertical: 4,
    marginBottom: 8,
  },
  markAllText: {fontSize: 12, fontWeight: '700', color: colors.blue},
  groupHeader: {fontSize: 13, fontWeight: '700', color: colors.slate, marginBottom: 10, marginTop: 4},
  empty: {alignItems: 'center', paddingVertical: 40, gap: 6},
  emptyText: {fontSize: 15, fontWeight: '800', color: colors.ink},
  emptySub: {fontSize: 12, fontWeight: '600', color: colors.muted},
});

export default NotificationsScreen;
