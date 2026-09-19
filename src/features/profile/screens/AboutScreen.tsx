import React from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView, Linking, Image} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {SurfaceCard} from '@/components/ui/Cards';
import {appVersion} from '@/data/mock';
import {mockStudent} from '@/data/mock';

export default function AboutScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
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
            <Text style={styles.title}>About</Text>
            <Pressable style={styles.headerBtn} hitSlop={8}>
              <Image source={mockStudent.avatar} style={styles.avatar} />
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <MaterialCommunityIcons name="school" size={48} color={colors.blue} />
            </View>
            <Text style={styles.appName}>CHUO App</Text>
            <Text style={styles.version}>Version {appVersion}</Text>
          </View>

          <Text style={styles.sectionTitle}>Information</Text>

          <SurfaceCard style={styles.infoCard}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="information" size={20} color={colors.blue} />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>App Version</Text>
                <Text style={styles.infoValue}>{appVersion}</Text>
              </View>
            </View>
          </SurfaceCard>

          <SurfaceCard style={styles.infoCard}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="update" size={20} color={colors.green} />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Last Updated</Text>
                <Text style={styles.infoValue}>January 2025</Text>
              </View>
            </View>
          </SurfaceCard>

          <Text style={styles.sectionTitle}>Legal</Text>

          <Pressable style={styles.linkCard} onPress={() => openLink('https://example.com/privacy')}>
            <MaterialCommunityIcons name="shield-account" size={22} color={colors.blue} />
            <View style={styles.linkText}>
              <Text style={styles.linkTitle}>Privacy Policy</Text>
              <Text style={styles.linkSubtitle}>Learn how we protect your data</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.slate} />
          </Pressable>

          <Pressable style={styles.linkCard} onPress={() => openLink('https://example.com/terms')}>
            <MaterialCommunityIcons name="file-document" size={22} color={colors.orange} />
            <View style={styles.linkText}>
              <Text style={styles.linkTitle}>Terms of Service</Text>
              <Text style={styles.linkSubtitle}>Rules and regulations</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.slate} />
          </Pressable>

          <Pressable style={styles.linkCard} onPress={() => openLink('https://example.com/licenses')}>
            <MaterialCommunityIcons name="license" size={22} color={colors.purple} />
            <View style={styles.linkText}>
              <Text style={styles.linkTitle}>Open Source Licenses</Text>
              <Text style={styles.linkSubtitle}>Third-party libraries</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.slate} />
          </Pressable>

          <Text style={styles.footerText}>
            Made with ❤️ for students
          </Text>
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
  logoSection: {
    alignItems: 'center',
    backgroundColor: colors.blueSoft,
    padding: 32,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.blue,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.blue,
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: colors.blue,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 16,
  },
  infoCard: {
    marginBottom: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.slate,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  linkText: {
    flex: 1,
    marginLeft: 12,
  },
  linkTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 2,
  },
  linkSubtitle: {
    fontSize: 12,
    color: colors.slate,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 13,
    color: colors.slate,
    marginTop: 24,
  },
});
