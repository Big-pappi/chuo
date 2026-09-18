import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  /**
   * Kept for backwards compatibility. The real logo artwork already includes
   * the "Unified University App" tagline, so this is currently a no-op.
   */
  tagline?: boolean;
  /** Use the white logo variant (for dark / navy backgrounds). */
  light?: boolean;
}

// Sizes for the logo image
const SIZES = {
  sm: {width: 60, height: 60},
  md: {width: 80, height: 80},
  lg: {width: 100, height: 100},
};

export default function Logo({size = 'md', light = false}: LogoProps) {
  const s = SIZES[size];

  return (
    <View
      style={[styles.lockup, {width: s.width, height: s.height}]}
      accessibilityRole="image"
      accessibilityLabel="CHUO App Logo">
      <Image
        source={require('../../../assets/logo.png')}
        style={[styles.mark, {width: s.width, height: s.height}]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  lockup: {alignItems: 'center', alignSelf: 'flex-start'},
  mark: {},
});
