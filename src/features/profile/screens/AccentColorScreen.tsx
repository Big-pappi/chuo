import React from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {useTheme} from '@/context/ThemeContext';

const THEME_OPTIONS = [
  {id: 'light' as const, name: 'Light Theme', color: '#3B82F6', icon: 'white-balance-sunny', desc: 'Clean and bright interface'},
  {id: 'dark' as const, name: 'Dark Theme', color: '#1E3A8A', icon: 'weather-night', desc: 'Easy on the eyes in low light'},
  {id: 'blue' as const, name: 'Blue Accent', color: '#3B82F6', icon: 'water', desc: 'Blue primary color theme'},
  {id: 'green' as const, name: 'Green Accent', color: '#10B981', icon: 'leaf', desc: 'Green primary color theme'},
  {id: 'purple' as const, name: 'Purple Accent', color: '#8B5CF6', icon: 'account-circle', desc: 'Purple primary color theme'},
  {id: 'orange' as const, name: 'Orange Accent', color: '#F97316', icon: 'fire', desc: 'Orange primary color theme'},
  {id: 'red' as const, name: 'Red Accent', color: '#EF4444', icon: 'heart', desc: 'Red primary color theme'},
  {id: 'pink' as const, name: 'Pink Accent', color: '#EC4899', icon: 'flower', desc: 'Pink primary color theme'},
];

export default function AccentColorScreen() {
  const navigation = useNavigation();
  const {theme, accent, setTheme, setAccent} = useTheme();

  const handleThemeSelect = (selectedTheme: 'light' | 'dark') => {
    setTheme(selectedTheme);
  };

  const handleAccentSelect = (selectedAccent: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'pink') => {
    setAccent(selectedAccent);
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={styles.headerBtn}
            hitSlop={8}
            onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.ink} />
          </Pressable>
          <Text style={styles.title}>Change Theme</Text>
          <View style={styles.headerBtn} />
        </View>

        <Text style={styles.subtitle}>Choose your preferred theme</Text>

        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Mode</Text>
          {THEME_OPTIONS.filter(opt => opt.id === 'light' || opt.id === 'dark').map(option => (
            <Pressable
              key={option.id}
              style={[styles.option, theme === option.id && styles.selectedOption]}
              onPress={() => handleThemeSelect(option.id)}>
              <View style={[styles.colorCircle, {backgroundColor: option.color}]}>
                <MaterialCommunityIcons name={option.icon as any} size={24} color="#fff" />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionName}>{option.name}</Text>
                <Text style={styles.optionDesc}>{option.desc}</Text>
              </View>
              {theme === option.id && (
                <MaterialCommunityIcons name="check-circle" size={24} color={colors.blue} />
              )}
            </Pressable>
          ))}

          <Text style={styles.sectionTitle}>Accent Color</Text>
          {THEME_OPTIONS.filter(opt => opt.id === 'blue' || opt.id === 'green' || opt.id === 'purple' || opt.id === 'orange' || opt.id === 'red' || opt.id === 'pink').map(option => (
            <Pressable
              key={option.id}
              style={[styles.option, accent === option.id && styles.selectedOption]}
              onPress={() => handleAccentSelect(option.id)}>
              <View style={[styles.colorCircle, {backgroundColor: option.color}]}>
                <MaterialCommunityIcons name={option.icon as any} size={24} color="#fff" />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionName}>{option.name}</Text>
                <Text style={styles.optionDesc}>{option.desc}</Text>
              </View>
              {accent === option.id && (
                <MaterialCommunityIcons name="check-circle" size={24} color={colors.blue} />
              )}
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: 16, paddingTop: 8},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '800', color: colors.ink},
  subtitle: {fontSize: 14, color: colors.slate, marginBottom: 24, textAlign: 'center'},
  content: {flex: 1},
  sectionTitle: {fontSize: 16, fontWeight: '700', color: colors.ink, marginBottom: 12, marginTop: 8},
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: colors.blue,
    backgroundColor: colors.blueSoft,
  },
  colorCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionText: {flex: 1},
  optionName: {fontSize: 16, fontWeight: '700', color: colors.ink, marginBottom: 4},
  optionDesc: {fontSize: 13, color: colors.slate},
});
