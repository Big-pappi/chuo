import React from 'react';
import {View, StyleSheet, Text, Pressable, ImageBackground, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useTheme} from '@/context/ThemeContext';
import {getColors} from '@/theme';

type Props = {
  children: React.ReactNode;
  onBack?: () => void;
  scroll?: boolean;
  showLogo?: boolean;
};

export default function AuthShell({children, onBack, scroll = true, showLogo = true}: Props) {
  const {isDark} = useTheme();
  const {colors, gradients} = getColors(isDark);

  const content = scroll ? (
    <ScrollView
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={styles.flex}>{children}</View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}>
      <LinearGradient
        colors={gradients.hero}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.aura}
      />
      <View style={[styles.overlay, {backgroundColor: colors.bg}]}>
        <View style={styles.topBar}>
          {onBack ? (
            <Pressable style={[styles.iconBtn, {backgroundColor: colors.white}]} onPress={onBack} hitSlop={10}>
              <MaterialCommunityIcons name="arrow-left" size={22} color={colors.ink} />
            </Pressable>
          ) : (
            <View style={{width: 44}} />
          )}
          <View style={{flex: 1}} />
          <View style={[styles.stepPill, {backgroundColor: colors.white, borderColor: colors.line}]}>
            <Text style={[styles.stepPillText, {color: colors.blue}]}>CHUO</Text>
          </View>
        </View>

        {showLogo ? (
          <View style={styles.logoWrap}>
            <View style={[styles.logoBadge, {backgroundColor: colors.white, borderColor: colors.blueSoft}]}>
              <MaterialCommunityIcons name="school" size={34} color={colors.blue} />
            </View>
          </View>
        ) : null}

        {content}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  aura: {
    position: 'absolute',
    top: -140,
    left: -80,
    right: -80,
    height: 380,
    opacity: 0.9,
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 56,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#06245E',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    elevation: 3,
  },
  stepPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  stepPillText: {fontSize: 12, fontWeight: '800', letterSpacing: 1.2},
  logoWrap: {alignItems: 'center', marginBottom: 18, marginTop: 6},
  logoBadge: {
    width: 76,
    height: 76,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#06245E',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: 6},
    elevation: 5,
  },
  scroll: {paddingBottom: 40, flexGrow: 1},
});
