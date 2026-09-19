import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView, Switch, Image} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {SurfaceCard} from '@/components/ui/Cards';
import {mockStudent} from '@/data/mock';

export default function NotificationPreferencesScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    announcements: true,
    grades: true,
    fees: true,
    timetable: true,
    library: false,
    events: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings({...settings, [key]: !settings[key]});
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
            <Text style={styles.title}>Notifications</Text>
            <Pressable style={styles.headerBtn} hitSlop={8}>
              <Image source={mockStudent.avatar} style={styles.avatar} />
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="bell-ring" size={24} color={colors.blue} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Notification Preferences</Text>
              <Text style={styles.infoText}>
                Customize how you receive updates and alerts
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Notification Channels</Text>

          <SurfaceCard style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons name="bell-ring" size={22} color={colors.blue} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Push Notifications</Text>
                  <Text style={styles.settingSubtitle}>Receive notifications on your device</Text>
                </View>
              </View>
              <Switch
                value={settings.pushNotifications}
                onValueChange={() => toggleSetting('pushNotifications')}
                trackColor={{false: colors.line, true: colors.blue}}
                thumbColor={settings.pushNotifications ? colors.white : colors.white}
              />
            </View>
          </SurfaceCard>

          <SurfaceCard style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons name="email" size={22} color={colors.green} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Email Notifications</Text>
                  <Text style={styles.settingSubtitle}>Receive updates via email</Text>
                </View>
              </View>
              <Switch
                value={settings.emailNotifications}
                onValueChange={() => toggleSetting('emailNotifications')}
                trackColor={{false: colors.line, true: colors.blue}}
                thumbColor={settings.emailNotifications ? colors.white : colors.white}
              />
            </View>
          </SurfaceCard>

          <SurfaceCard style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons name="message-text" size={22} color={colors.orange} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>SMS Notifications</Text>
                  <Text style={styles.settingSubtitle}>Receive text messages</Text>
                </View>
              </View>
              <Switch
                value={settings.smsNotifications}
                onValueChange={() => toggleSetting('smsNotifications')}
                trackColor={{false: colors.line, true: colors.blue}}
                thumbColor={settings.smsNotifications ? colors.white : colors.white}
              />
            </View>
          </SurfaceCard>

          <Text style={styles.sectionTitle}>Notification Types</Text>

          <SurfaceCard style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons name="megaphone" size={22} color={colors.purple} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Announcements</Text>
                  <Text style={styles.settingSubtitle}>University announcements</Text>
                </View>
              </View>
              <Switch
                value={settings.announcements}
                onValueChange={() => toggleSetting('announcements')}
                trackColor={{false: colors.line, true: colors.blue}}
                thumbColor={settings.announcements ? colors.white : colors.white}
              />
            </View>
          </SurfaceCard>

          <SurfaceCard style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons name="school" size={22} color={colors.blue} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Grades & Results</Text>
                  <Text style={styles.settingSubtitle}>Academic results updates</Text>
                </View>
              </View>
              <Switch
                value={settings.grades}
                onValueChange={() => toggleSetting('grades')}
                trackColor={{false: colors.line, true: colors.blue}}
                thumbColor={settings.grades ? colors.white : colors.white}
              />
            </View>
          </SurfaceCard>

          <SurfaceCard style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons name="credit-card" size={22} color={colors.green} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Fees & Payments</Text>
                  <Text style={styles.settingSubtitle}>Payment reminders</Text>
                </View>
              </View>
              <Switch
                value={settings.fees}
                onValueChange={() => toggleSetting('fees')}
                trackColor={{false: colors.line, true: colors.blue}}
                thumbColor={settings.fees ? colors.white : colors.white}
              />
            </View>
          </SurfaceCard>

          <SurfaceCard style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons name="calendar" size={22} color={colors.orange} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Timetable</Text>
                  <Text style={styles.settingSubtitle}>Class schedule updates</Text>
                </View>
              </View>
              <Switch
                value={settings.timetable}
                onValueChange={() => toggleSetting('timetable')}
                trackColor={{false: colors.line, true: colors.blue}}
                thumbColor={settings.timetable ? colors.white : colors.white}
              />
            </View>
          </SurfaceCard>

          <SurfaceCard style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons name="book" size={22} color={colors.red} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Library</Text>
                  <Text style={styles.settingSubtitle}>Library notifications</Text>
                </View>
              </View>
              <Switch
                value={settings.library}
                onValueChange={() => toggleSetting('library')}
                trackColor={{false: colors.line, true: colors.blue}}
                thumbColor={settings.library ? colors.white : colors.white}
              />
            </View>
          </SurfaceCard>

          <SurfaceCard style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons name="calendar-star" size={22} color={colors.pink} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Events</Text>
                  <Text style={styles.settingSubtitle}>University events</Text>
                </View>
              </View>
              <Switch
                value={settings.events}
                onValueChange={() => toggleSetting('events')}
                trackColor={{false: colors.line, true: colors.blue}}
                thumbColor={settings.events ? colors.white : colors.white}
              />
            </View>
          </SurfaceCard>
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
});
