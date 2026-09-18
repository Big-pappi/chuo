import React from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {SurfaceCard} from '@/components/ui/Cards';

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

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.ink} />
          </Pressable>
          <Text style={styles.title}>Linked Devices</Text>
          <View style={styles.headerBtn} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="information" size={20} color={colors.blue} />
            <Text style={styles.infoText}>
              Manage devices that have access to your account
            </Text>
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
    borderRadius: 6,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.redSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.line,
  },
  actionText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '700',
    color: colors.red,
  },
});
