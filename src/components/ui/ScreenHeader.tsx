import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {colors} from '@/theme';

interface Action {
  icon: string;
  onPress?: () => void;
  badge?: number;
}

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  actions?: Action[];
}

export default function ScreenHeader({title, onBack, actions = []}: ScreenHeaderProps) {
  const navigation = useNavigation<any>();
  const handleBack = onBack || (() => navigation.goBack());

  return (
    <View style={styles.header}>
      <Pressable style={styles.iconBtn} onPress={handleBack} hitSlop={8}>
        <MaterialCommunityIcons name="arrow-left" size={22} color={colors.ink} />
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.actions}>
        {actions.length > 0 ? (
          actions.map((a, i) => (
            <Pressable key={i} style={styles.iconBtn} onPress={a.onPress} hitSlop={8}>
              <MaterialCommunityIcons name={a.icon as any} size={20} color={colors.ink} />
              {a.badge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{a.badge}</Text>
                </View>
              ) : null}
            </Pressable>
          ))
        ) : (
          <View style={styles.iconBtn} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B2A6B',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    elevation: 1,
  },
  title: {flex: 1, textAlign: 'center', fontSize: 19, fontWeight: '800', color: colors.navy, letterSpacing: 0.2},
  actions: {flexDirection: 'row', gap: 8, minWidth: 40, justifyContent: 'flex-end'},
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {color: colors.white, fontSize: 9, fontWeight: '800'},
});
