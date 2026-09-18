import React, {useEffect, useRef} from 'react';
import {Animated, Image, StyleSheet, Text, View} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {useNavigation} from '@react-navigation/native';

const SplashScreen: React.FC = () => {
  const navigation = useNavigation();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.94)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {toValue: 1, duration: 700, useNativeDriver: true}),
      Animated.spring(scale, {toValue: 1, friction: 8, tension: 45, useNativeDriver: true}),
    ]).start();
    const timer = setTimeout(() => navigation.navigate('Onboarding' as never), 2200);
    return () => clearTimeout(timer);
  }, [navigation, opacity, scale]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Animated.View style={[styles.content, {opacity, transform: [{scale}]}]}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.name}>University App</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center'},
  content: {alignItems: 'center', width: '100%', paddingHorizontal: 24},
  logo: {width: 120, height: 120, marginBottom: 24},
  name: {color: '#061d49', fontSize: 32, fontWeight: '800', letterSpacing: -0.5},
});

export default SplashScreen;
