import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {getColors} from '@/theme';
import {SectionHeader} from '@/components/ui/Cards';
import {useTheme} from '@/context/ThemeContext';
import {
  mockStudent,
  notifications as allNotifications,
  profileAccountItems,
  profileSupportItems,
  profilePreferenceSettings,
  profilePrivacySettings,
  profileAppSettings,
} from '@/data/mock';
import {
  ProfileCard,
  MenuList,
  SettingsGroup,
  LogOutRow,
} from '../components/profile';

const allSettings = [
  ...profilePreferenceSettings,
  ...profilePrivacySettings,
  ...profileAppSettings,
];

const initialToggles = allSettings.reduce<Record<string, boolean>>((acc, item) => {
  if (item.control === 'toggle') acc[item.id] = item.defaultOn ?? false;
  return acc;
}, {});

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {isDark, setTheme} = useTheme();
  const {colors: themeColors} = getColors(isDark);
  const unreadCount = allNotifications.filter(n => n.unread).length;
  const [toggles, setToggles] = useState<Record<string, boolean>>(initialToggles);

  const handleToggle = (id: string, value: boolean) => {
    setToggles(prev => ({...prev, [id]: value}));
  };

  const go = (route: string) => () => {
    try {
      navigation.navigate(route);
    } catch {
      /* route may not exist in this prototype */
    }
  };

  return (
    <Screen>
      <View style={[styles.container, {backgroundColor: themeColors.bg}]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={[styles.headerBtn, {backgroundColor: themeColors.white}]}
            hitSlop={8}
            onPress={() => navigation.canGoBack() && navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back">
            <MaterialCommunityIcons name="arrow-left" size={22} color={themeColors.ink} />
          </Pressable>
          <Text style={[styles.title, {color: themeColors.ink}]}>Profile</Text>
          <Pressable
            style={[styles.headerBtn, {backgroundColor: themeColors.white}]}
            hitSlop={8}
            onPress={go('Notifications')}
            accessibilityRole="button"
            accessibilityLabel="Notifications">
            <MaterialCommunityIcons name="bell-outline" size={22} color={themeColors.ink} />
            {unreadCount ? (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        <ProfileCard onEdit={() => navigation.navigate('EditProfile' as never)} />

        <SectionHeader title="Settings" />
        <SettingsGroup
          label="Preferences"
          items={profilePreferenceSettings}
          toggles={toggles}
          onToggle={handleToggle}
          onPress={id => {
            if (id === 'language') {
              navigation.navigate('Language' as never);
            } else {
              go(id)();
            }
          }}
        />
        <SettingsGroup
          label="Privacy & Security"
          items={profilePrivacySettings}
          toggles={toggles}
          onToggle={handleToggle}
          onPress={id => go(id === 'changePassword' ? 'password' : id)()}
        />
        <SettingsGroup
          label="App"
          items={profileAppSettings}
          toggles={toggles}
          onToggle={handleToggle}
          onPress={id => {
            if (id === 'accentColor') {
              navigation.navigate('AccentColor' as never);
            } else if (id === 'storage') {
              navigation.navigate('DataStorage' as never);
            } else {
              go(id)();
            }
          }}
        />

        <SectionHeader title="Account" />
        <MenuList items={profileAccountItems} onPress={id => {
          if (id === 'personal') {
            navigation.navigate('EditProfile' as never);
          } else if (id === 'password') {
            navigation.navigate('ChangePassword' as never);
          } else if (id === 'security') {
            navigation.navigate('Security' as never);
          } else if (id === 'notifications') {
            navigation.navigate('NotificationPreferences' as never);
          } else if (id === 'devices') {
            navigation.navigate('LinkedDevices' as never);
          } else {
            go(id)();
          }
        }} />

        <SectionHeader title="Support" />
        <MenuList items={profileSupportItems} onPress={id => {
          if (id === 'help') {
            navigation.navigate('HelpCenter' as never);
          } else if (id === 'contact') {
            navigation.navigate('ContactUs' as never);
          } else if (id === 'about') {
            navigation.navigate('About' as never);
          } else {
            go(id)();
          }
        }} />

        <LogOutRow onPress={go('Login')} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {paddingHorizontal: 16, paddingTop: 8},
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
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B2A6B',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    elevation: 1,
  },
  title: {flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '800'},
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  notificationBadgeText: {color: '#FFFFFF', fontSize: 9, fontWeight: '800'},
});

export default ProfileScreen;
