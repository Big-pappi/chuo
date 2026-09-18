import React from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {SurfaceCard} from '@/components/ui/Cards';

const languages = [
  {id: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧'},
  {id: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇹🇿'},
  {id: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷'},
  {id: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦'},
];

export default function LanguageScreen() {
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = React.useState('en');

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.ink} />
          </Pressable>
          <Text style={styles.title}>Language</Text>
          <View style={styles.headerBtn} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="information" size={20} color={colors.blue} />
            <Text style={styles.infoText}>
              Choose your preferred language for the app interface
            </Text>
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
    marginBottom: 24,
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
  content: {flex: 1},
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.blueSoft,
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 13,
    color: colors.blue,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 12,
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
    fontSize: 32,
    marginRight: 16,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 2,
  },
  nativeName: {
    fontSize: 13,
    color: colors.slate,
  },
});
