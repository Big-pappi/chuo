import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {colors, spacing, typography} from '@/theme';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'information-outline',
  title,
  message,
}) => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon as any} size={64} color={colors.muted} />
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.ink,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.fontSize.base,
    color: colors.slate,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});

export default EmptyState;
