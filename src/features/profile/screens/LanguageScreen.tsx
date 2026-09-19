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
          <Text style={styles.sectionTitle}>Select Language</Text>

          {languages.map(lang => (
            <Pressable
              key={lang.id}
              style={styles.languageCard}
              onPress={() => setSelectedLanguage(lang.id)}>
              <View style={styles.languageRow}>
                <View style={styles.flagContainer}>
                  <Text style={styles.flag}>{lang.flag}</Text>
                </View>
                <View style={styles.languageInfo}>
                  <Text style={styles.languageName}>{lang.name}</Text>
                  <Text style={styles.nativeName}>{lang.nativeName}</Text>
                </View>
                {selectedLanguage === lang.id && (
                  <View style={styles.radioButton}>
                    <View style={styles.radioButtonInner} />
                  </View>
                )}
              </View>
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
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 24,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.line,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  flag: {
    fontSize: 28,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.ink,
    marginBottom: 2,
  },
  nativeName: {
    fontSize: 13,
    color: colors.slate,
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.blue,
  },
});
