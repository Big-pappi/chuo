import React from 'react';
import {View, ScrollView, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getColors} from '@/theme';
import {useTheme} from '@/context/ThemeContext';

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  contentStyle?: StyleProp<ViewStyle>;
  background?: string;
}

export default function Screen({
  children,
  scroll = true,
  edges = ['top'],
  contentStyle,
  background,
}: ScreenProps) {
  const {isDark} = useTheme();
  const themeColors = getColors(isDark).colors;
  const surface = background ?? themeColors.bg;
  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: surface}]} edges={edges}>
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, contentStyle]}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  flex: {flex: 1},
  content: {paddingTop: 8, paddingBottom: 118},
});
