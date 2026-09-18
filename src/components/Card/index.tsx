import React from 'react';
import {View, StyleSheet, ViewStyle, Pressable} from 'react-native';
import {colors, spacing} from '@/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

const Card: React.FC<CardProps> = ({children, style, onPress, ...props}) => {
  const CardComponent = onPress ? Pressable : View;
  
  return (
    <CardComponent
      style={[styles.card, style]}
      onPress={onPress}
      {...props}>
      <View style={styles.content}>
        {children}
      </View>
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    elevation: 3,
    shadowColor: colors.navy,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.08,
    shadowRadius: 14,
    marginVertical: spacing.sm,
    overflow: 'hidden',
  },
  content: {
    padding: spacing.md,
  },
});

export default Card;
