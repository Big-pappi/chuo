import React from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView, Image} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {SurfaceCard} from '@/components/ui/Cards';
import {mockStudent} from '@/data/mock';

const mockDevices = [
  {
    id: '1',
    name: 'iPhone 14 Pro',
    type: 'Mobile',
    lastActive: '2 minutes ago',
    current: true,
  },
  {
    id: '2',
    name: 'MacBook Pro',
    type: 'Desktop',
    lastActive: '3 days ago',
    current: false,
  },
  {
    id: '3',
    name: 'Windows PC',
    type: 'Desktop',
    lastActive: '1 week ago',
    current: false,
  },
];

export default function LinkedDevicesScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

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
            <Text style={styles.title}>Linked Devices</Text>
            <Pressable style={styles.headerBtn} hitSlop={8}>
              <Image source={mockStudent.avatar} style={styles.avatar} />
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="devices" size={24} color={colors.blue} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Manage Devices</Text>
              <Text style={styles.infoText}>
                Manage devices that have access to your account
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Active Devices</Text>

          {mockDevices.map(device => (
            <SurfaceCard key={device.id} style={styles.deviceCard}>
              <View style={styles.deviceRow}>
                <View style={styles.deviceIcon}>
                  <MaterialCommunityIcons
                    name={device.type === 'Mobile' ? 'cellphone' : 'laptop'}
                    size={24}
                    color={colors.blue}
                  />
                </View>
                <View style={styles.deviceInfo}>
                  <View style={styles.deviceHeader}>
                    <Text style={styles.deviceName}>{device.name}</Text>
                    {device.current && (
                      <View style={styles.currentBadge}>
                        <Text style={styles.currentBadgeText}>Current</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.deviceType}>{device.type}</Text>
                  <Text style={styles.deviceActive}>Last active: {device.lastActive}</Text>
                </View>
                {!device.current && (
                  <Pressable style={styles.removeBtn}>
                    <MaterialCommunityIcons name="close" size={20} color={colors.red} />
                  </Pressable>
                )}
              </View>
            </SurfaceCard>
          ))}

          <Pressable style={styles.actionCard}>
            <MaterialCommunityIcons name="logout-variant" size={22} color={colors.red} />
            <Text style={styles.actionText}>Sign Out All Other Devices</Text>
          </Pressable>
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
  deviceCard: {
    marginBottom: 12,
    padding: 16,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
    marginRight: 8,
  },
  currentBadge: {
    backgroundColor: colors.greenSoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.green,
  },
  deviceType: {
    fontSize: 12,
    color: colors.slate,
    marginBottom: 2,
  },
  deviceActive: {
    fontSize: 11,
    color: colors.muted,
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.redSoft,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 15,
    fontWeight: '700',
    color: colors.red,
  },
});
