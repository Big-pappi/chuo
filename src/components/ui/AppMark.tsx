import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

interface AppMarkProps {
  size?: number;
  light?: boolean;
}

export default function AppMark({size = 88, light = false}: AppMarkProps) {
  return (
    <View style={[styles.frame, {width: size, height: size, borderRadius: size * 0.24}, light && styles.lightFrame]}>
      <Image
        source={require('../../../assets/chuo-app-icon.png')}
        style={{width: size, height: size, borderRadius: size * 0.24}}
        resizeMode="cover"
        accessibilityRole="image"
        accessibilityLabel="CHUO graduation cap mark"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {overflow: 'hidden', backgroundColor: '#1E3A8A'},
  lightFrame: {backgroundColor: '#FFFFFF'},
});
