import React from 'react';
import {View, Text, StyleSheet, StyleProp, ViewStyle, Pressable} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {colors} from '@/theme';

export function SurfaceCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

// Rounded tinted icon tile used in quick access grids, list rows, etc.
export function IconTile({
  icon,
  color,
  soft,
  size = 44,
  iconSize = 22,
}: {
  icon: string;
  color: string;
  soft: string;
  size?: number;
  iconSize?: number;
}) {
  return (
    <View
      style={[
        styles.iconTile,
        {width: size, height: size, borderRadius: size / 3.2, backgroundColor: soft},
      ]}>
      <MaterialCommunityIcons name={icon as any} size={iconSize} color={color} />
    </View>
  );
}

export function Pill({
  label,
  color = colors.blue,
  soft = colors.blueSoft,
}: {
  label: string;
  color?: string;
  soft?: string;
}) {
  return (
    <View style={[styles.pill, {backgroundColor: soft}]}>
      <Text style={[styles.pillText, {color}]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: colors.navy,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 3},
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {fontSize: 17, fontWeight: '800', color: colors.navy, letterSpacing: 0.1, flex: 1},
  sectionAction: {fontSize: 13, fontWeight: '700', color: colors.blue, marginLeft: 8},
  iconTile: {alignItems: 'center', justifyContent: 'center', shadowColor: colors.navy, shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: {width: 0, height: 2}, elevation: 1},
  pill: {paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, alignSelf: 'flex-start'},
  pillText: {fontSize: 11, fontWeight: '700'},
});
