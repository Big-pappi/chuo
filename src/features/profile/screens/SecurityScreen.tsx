import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView, Switch} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {SurfaceCard} from '@/components/ui/Cards';

export default function SecurityScreen() {
  const navigation = useNavigation();
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    passwordExpiry: false,
    sessionTimeout: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings({...settings, [key]: !settings[key]});
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.ink} />
          </Pressable>
          <Text style={styles.title}>Security</Text>
          <View style={styles.headerBtn} />
        </View>

        <ScrollView style={styles.content}>
          <SurfaceCard style={styles.card}>
            <Text style={styles.cardTitle}>Two-Factor Authentication</Text>
            <Text style={styles.cardSubtitle}>
              Add an extra layer of security to your account
            </Text>
            <View style={styles.cardRow}>
              <View style={styles.cardIcon}>
                <MaterialCommunityIcons name="shield-check" size={24} color={colors.blue} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardInfoTitle}>2FA Status</Text>
                <Text style={[styles.cardInfoStatus, {color: settings.twoFactorAuth ? colors.green : colors.orange}]}>
                  {settings.twoFactorAuth ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
              <Switch
                value={settings.twoFactorAuth}
                onValueChange={() => toggleSetting('twoFactorAuth')}
                trackColor={{false: colors.line, true: colors.blue}}
                thumbColor={settings.twoFactorAuth ? colors.white : colors.white}
              />
            </View>
          </SurfaceCard>

          <Text style={styles.sectionTitle}>Security Settings</Text>

          <SurfaceCard style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons name="bell-alert" size={22} color={colors.blue} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Login Alerts</Text>
                  <Text style={styles.settingSubtitle}>Get notified of new logins</Text>
                </View>
              </View>
              <Switch
                value={settings.loginAlerts}
                onValueChange={() => toggleSetting('loginAlerts')}
                trackColor={{false: colors.line, true: colors.blue}}
                thumbColor={settings.loginAlerts ? colors.white : colors.white}
              />
            </View>
          </SurfaceCard>

          <SurfaceCard style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons name="clock-alert" size={22} color={colors.orange} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Password Expiry</Text>
                  <Text style={styles.settingSubtitle}>Require password change every 90 days</Text>
                </View>
              </View>
              <Switch
                value={settings.passwordExpiry}
                onValueChange={() => toggleSetting('passwordExpiry')}
                trackColor={{false: colors.line, true: colors.blue}}
                thumbColor={settings.passwordExpiry ? colors.white : colors.white}
              />
            </View>
          </SurfaceCard>

          <SurfaceCard style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons name="timer" size={22} color={colors.blue} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Session Timeout</Text>
                  <Text style={styles.settingSubtitle}>Auto logout after inactivity</Text>
                </View>
              </View>
              <Switch
                value={settings.sessionTimeout}
                onValueChange={() => toggleSetting('sessionTimeout')}
                trackColor={{false: colors.line, true: colors.blue}}
                thumbColor={settings.sessionTimeout ? colors.white : colors.white}
              />
            </View>
          </SurfaceCard>

          <Pressable style={styles.actionCard} onPress={() => navigation.navigate('ChangePassword' as never)}>
            <MaterialCommunityIcons name="lock-reset" size={22} color={colors.blue} />
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Change Password</Text>
              <Text style={styles.actionSubtitle}>Update your account password</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.slate} />
          </Pressable>
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
  card: {
    marginBottom: 24,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.slate,
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardInfoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 2,
  },
  cardInfoStatus: {
    fontSize: 13,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 12,
  },
  settingCard: {
    marginBottom: 12,
    padding: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: colors.slate,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.line,
  },
  actionText: {
    flex: 1,
    marginLeft: 12,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: colors.slate,
  },
});
