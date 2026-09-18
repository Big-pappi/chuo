import React from 'react';
import {View, Text, StyleSheet, Pressable, Image} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {colors} from '@/theme';
import {mockStudent} from '@/data/mock';

interface Props {
  onSearch?: () => void;
  onNotifications?: () => void;
  onProfile?: () => void;
  notificationCount?: number;
  topInset?: number;
}

export default function DashboardHeader({
  onSearch,
  onNotifications,
  onProfile,
  notificationCount = 3,
  topInset = 0,
}: Props) {
  return (
    <View style={[styles.header, {paddingTop: topInset}]}>
      <Pressable onPress={onProfile} hitSlop={8}>
        <Image source={mockStudent.avatar} style={styles.avatar} />
        <View style={styles.online} />
      </Pressable>
      <View style={styles.headerCenter}>
        <Text style={styles.headerGreeting}>{`Good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, ${mockStudent.firstName}`}</Text>
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.iconBtn} onPress={onSearch} hitSlop={8}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.ink} />
        </Pressable>
        <Pressable style={styles.iconBtn} onPress={onNotifications} hitSlop={8}>
          <MaterialCommunityIcons name="bell-outline" size={20} color={colors.ink} />
          {notificationCount ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerCenter: {flex: 1, alignItems: 'flex-start', marginLeft: 12},
  headerGreeting: {fontSize: 14, fontWeight: '800', color: colors.ink},
  eyebrow: {
    fontSize: 9,
    letterSpacing: 1.4,
    fontWeight: '800',
    color: colors.blue,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
  actions: {flexDirection: 'row', alignItems: 'center', gap: 8},
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B2A6B',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
    elevation: 1,
  },
  badge: {
    position: 'absolute',
    top: 3,
    right: 3,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {color: colors.white, fontSize: 8, fontWeight: '800'},
  avatar: {width: 42, height: 42, borderRadius: 21, backgroundColor: colors.line, borderWidth: 3, borderColor: colors.bg},
  online: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.white,
  },
});
