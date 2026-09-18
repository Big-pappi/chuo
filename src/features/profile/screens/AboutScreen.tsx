import React from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView, Linking} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {SurfaceCard} from '@/components/ui/Cards';
import {appVersion} from '@/data/mock';

export default function AboutScreen() {
  const navigation = useNavigation();

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.ink} />
          </Pressable>
          <Text style={styles.title}>About</Text>
          <View style={styles.headerBtn} />
        </View>

        <ScrollView style={styles.content}>
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
              <Text style={styles.linkSubtitle}>View third-party licenses</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.slate} />
          </Pressable>

          <Text style={styles.sectionTitle}>Support</Text>

          <Pressable style={styles.linkCard} onPress={() => navigation.navigate('HelpCenter' as never)}>
            <MaterialCommunityIcons name="help-circle" size={22} color={colors.green} />
            <View style={styles.linkText}>
              <Text style={styles.linkTitle}>Help Center</Text>
              <Text style={styles.linkSubtitle}>Get help and support</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.slate} />
          </Pressable>

          <Pressable style={styles.linkCard} onPress={() => navigation.navigate('ContactUs' as never)}>
            <MaterialCommunityIcons name="headset" size={22} color={colors.pink} />
            <View style={styles.linkText}>
              <Text style={styles.linkTitle}>Contact Us</Text>
              <Text style={styles.linkSubtitle}>Get in touch with our team</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.slate} />
          </Pressable>

          <Text style={styles.footer}>
            © 2025 CHUO University. All rights reserved.
          </Text>
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
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: colors.slate,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 12,
    marginTop: 8,
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
    fontWeight: '600',
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
  footer: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
});
