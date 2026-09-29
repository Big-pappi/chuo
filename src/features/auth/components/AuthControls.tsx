import React from 'react';
import {View, StyleSheet, Text, Pressable, ActivityIndicator} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useTheme} from '@/context/ThemeContext';
import {getColors} from '@/theme';

type Props = {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  icon?: string;
  error?: string;
  secure?: boolean;
  onToggleSecure?: () => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'number-pad';
  returnKeyType?: 'done' | 'next' | 'go';
  onSubmitEditing?: () => void;
};

export function AuthInput({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  error,
  secure,
  onToggleSecure,
  autoCapitalize = 'none',
  keyboardType = 'default',
  returnKeyType = 'next',
  onSubmitEditing,
}: Props) {
  const {isDark} = useTheme();
  const {colors} = getColors(isDark);

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, {color: colors.slate}]}>{label}</Text>
      <View
        style={[
          styles.field,
          {backgroundColor: colors.white, borderColor: error ? colors.error : colors.line},
        ]}>
        {icon ? (
          <MaterialCommunityIcons name={icon as any} size={20} color={colors.muted} style={styles.leadingIcon} />
        ) : null}
        <TextInput
          style={[styles.input, {color: colors.ink}]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          secureTextEntry={secure}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />
        {onToggleSecure ? (
          <Pressable onPress={onToggleSecure} hitSlop={10} style={styles.trailing}>
            <MaterialCommunityIcons
              name={secure ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.muted}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={[styles.error, {color: colors.error}]}>{error}</Text> : null}
    </View>
  );
}

import {TextInput} from 'react-native';

export function AuthButton({
  label,
  onPress,
  loading,
  disabled,
  variant = 'primary',
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'ghost';
}) {
  const {isDark} = useTheme();
  const {colors} = getColors(isDark);
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      style={({pressed}) => [
        styles.btn,
        isPrimary
          ? {backgroundColor: colors.blue, opacity: pressed ? 0.9 : 1}
          : {backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.blue},
        (disabled || loading) && {opacity: 0.55},
      ]}
      onPress={onPress}
      disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.white : colors.blue} />
      ) : (
        <Text
          style={[
            styles.btnText,
            {color: isPrimary ? colors.white : colors.blue},
          ]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

export function StepIndicator({steps, current}: {steps: string[]; current: number}) {
  const {isDark} = useTheme();
  const {colors} = getColors(isDark);

  return (
    <View style={styles.stepRow}>
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <View key={label} style={styles.stepItem}>
            <View
              style={[
                styles.stepDot,
                {
                  backgroundColor: done || active ? colors.blue : colors.panel,
                  borderColor: active ? colors.blue : 'transparent',
                  borderWidth: active ? 2 : 0,
                },
              ]}>
              {done ? (
                <MaterialCommunityIcons name="check" size={14} color={colors.white} />
              ) : (
                <Text style={[styles.stepDotText, {color: active ? colors.white : colors.muted}]}>{i + 1}</Text>
              )}
            </View>
            <Text
              style={[
                styles.stepLabel,
                {color: active ? colors.ink : colors.muted},
              ]}
              numberOfLines={1}>
              {label}
            </Text>
            {i < steps.length - 1 ? (
              <View style={[styles.stepConnector, {backgroundColor: done ? colors.blue : colors.line}]} />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {marginBottom: 16},
  label: {fontSize: 13, fontWeight: '700', marginBottom: 8, marginLeft: 2},
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 56,
  },
  leadingIcon: {marginRight: 10},
  input: {flex: 1, fontSize: 16, padding: 0, height: '100%'},
  trailing: {paddingHorizontal: 4, paddingVertical: 8},
  error: {fontSize: 12, marginTop: 6, marginLeft: 4, fontWeight: '600'},
  btn: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {fontSize: 16, fontWeight: '800', letterSpacing: 0.3},
  stepRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 24, marginTop: 4},
  stepItem: {flexDirection: 'row', alignItems: 'center', flex: 1},
  stepDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotText: {fontSize: 12, fontWeight: '800'},
  stepLabel: {fontSize: 11, fontWeight: '700', marginLeft: 6, flexShrink: 1},
  stepConnector: {flex: 1, height: 2, borderRadius: 1, marginHorizontal: 6},
});
