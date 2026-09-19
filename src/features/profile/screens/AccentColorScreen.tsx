import React from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView, Image} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {useTheme} from '@/context/ThemeContext';
import {mockStudent} from '@/data/mock';

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
  const insets = useSafeAreaInsets();
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
        {/* Fixed Header */}
        <View style={[styles.fixedHeader, {paddingTop: insets.top}]}>
          <View style={styles.header}>
            <Pressable
              style={styles.headerBtn}
              hitSlop={8}
              onPress={() => navigation.canGoBack() && navigation.goBack()}>
              <MaterialCommunityIcons name="arrow-left" size={22} color={colors.ink} />
            </Pressable>
            <Text style={styles.title}>Theme</Text>
            <Pressable style={styles.headerBtn} hitSlop={8}>
              <Image source={mockStudent.avatar} style={styles.avatar} />
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
          <Text style={styles.sectionTitle}>Theme Mode</Text>
          <View style={styles.themeOptions}>
            {THEME_OPTIONS.filter(opt => opt.id === 'light' || opt.id === 'dark').map(option => (
              <Pressable
                key={option.id}
                style={[styles.themeOption, theme === option.id && styles.selectedThemeOption]}
                onPress={() => handleThemeSelect(option.id)}>
                <View style={[styles.themeIcon, {backgroundColor: option.color}]}>
                  <MaterialCommunityIcons name={option.icon as any} size={28} color="#fff" />
                </View>
                <Text style={styles.themeName}>{option.name}</Text>
                {theme === option.id && (
                  <View style={styles.themeCheck}>
                    <MaterialCommunityIcons name="check" size={16} color="#fff" />
                  </View>
                )}
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Accent Color</Text>
          <View style={styles.colorGrid}>
            {THEME_OPTIONS.filter(opt => opt.id === 'blue' || opt.id === 'green' || opt.id === 'purple' || opt.id === 'orange' || opt.id === 'red' || opt.id === 'pink').map(option => (
              <Pressable
                key={option.id}
                style={styles.colorOption}
                onPress={() => handleAccentSelect(option.id)}>
                <View style={[styles.colorCircle, accent === option.id && styles.selectedColorCircle, {backgroundColor: option.color}]}>
                  {accent === option.id && (
                    <MaterialCommunityIcons name="check" size={20} color="#fff" />
                  )}
                </View>
                <Text style={styles.colorName}>{option.name}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B2A6B',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    elevation: 1,
  },
  title: {flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '800', color: colors.ink},
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.panel,
  },
  scrollContent: {flex: 1},
  scrollContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 100,
    paddingBottom: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
    width: '100%',
  },
  themeOption: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThemeOption: {
    borderColor: colors.blue,
    backgroundColor: colors.blueSoft,
  },
  themeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  themeName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.ink,
  },
  themeCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    width: '100%',
  },
  colorOption: {
    width: '30%',
    alignItems: 'center',
  },
  colorCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorName: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.slate,
  },
  selectedColorCircle: {
    borderColor: colors.blue,
  },
});
