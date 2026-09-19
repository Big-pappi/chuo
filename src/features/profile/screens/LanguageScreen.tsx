import React from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView, Image} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {mockStudent} from '@/data/mock';

const languages = [
  {id: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧'},
  {id: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇹🇿'},
  {id: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷'},
  {id: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦'},
];

export default function LanguageScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedLanguage, setSelectedLanguage] = React.useState('en');

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
            <Text style={styles.title}>Language</Text>
            <Pressable style={styles.headerBtn} hitSlop={8}>
              <Image source={mockStudent.avatar} style={styles.avatar} />
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="translate" size={24} color={colors.blue} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>App Language</Text>
              <Text style={styles.infoText}>
                Choose your preferred language for the app interface
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Available Languages</Text>

          {languages.map(lang => (
            <Pressable
              key={lang.id}
              style={[styles.languageCard, selectedLanguage === lang.id && styles.selectedCard]}
              onPress={() => setSelectedLanguage(lang.id)}>
              <View style={styles.languageRow}>
                <Text style={styles.flag}>{lang.flag}</Text>
                <View style={styles.languageInfo}>
                  <Text style={styles.languageName}>{lang.name}</Text>
                  <Text style={styles.nativeName}>{lang.nativeName}</Text>
                </View>
              </View>
              {selectedLanguage === lang.id && (
                <View style={styles.checkContainer}>
                  <MaterialCommunityIcons name="check-circle" size={24} color={colors.blue} />
                </View>
              )}
            </Pressable>
          ))}
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
  scrollContentContainer: {paddingHorizontal: 16, paddingTop: 100, paddingBottom: 20},
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.blueSoft,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.blue,
  },
  infoContent: {flex: 1, marginLeft: 12},
  infoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.blue,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: colors.blue,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 16,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: colors.blue,
    backgroundColor: colors.blueSoft,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 36,
    marginRight: 16,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 4,
  },
  nativeName: {
    fontSize: 13,
    color: colors.slate,
  },
  checkContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 4,
  },
});
