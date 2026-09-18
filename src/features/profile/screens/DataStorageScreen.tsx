import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView, Alert} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {SurfaceCard} from '@/components/ui/Cards';

export default function DataStorageScreen() {
  const navigation = useNavigation();
  const [storageInfo, setStorageInfo] = useState({
    cacheSize: '125 MB',
    downloadsSize: '450 MB',
    totalSize: '575 MB',
  });

  const clearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. Are you sure?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setStorageInfo({...storageInfo, cacheSize: '0 MB'});
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ],
    );
  };

  const clearDownloads = () => {
    Alert.alert(
      'Clear Downloads',
      'This will delete all downloaded files. Are you sure?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setStorageInfo({...storageInfo, downloadsSize: '0 MB'});
            Alert.alert('Success', 'Downloads cleared successfully');
          },
        },
      ],
    );
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.ink} />
          </Pressable>
          <Text style={styles.title}>Data & Storage</Text>
          <View style={styles.headerBtn} />
        </View>

        <ScrollView style={styles.content}>
          <SurfaceCard style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <MaterialCommunityIcons name="database" size={32} color={colors.blue} />
            </View>
            <Text style={styles.summaryTitle}>Total Storage Used</Text>
            <Text style={styles.summaryValue}>{storageInfo.totalSize}</Text>
          </SurfaceCard>

          <Text style={styles.sectionTitle}>Storage Breakdown</Text>

          <SurfaceCard style={styles.storageCard}>
            <View style={styles.storageRow}>
              <View style={styles.storageIcon}>
                <MaterialCommunityIcons name="caching" size={22} color={colors.orange} />
              </View>
              <View style={styles.storageInfo}>
                <Text style={styles.storageLabel}>Cache</Text>
                <Text style={styles.storageValue}>{storageInfo.cacheSize}</Text>
              </View>
              <Pressable style={styles.clearBtn} onPress={clearCache}>
                <Text style={styles.clearBtnText}>Clear</Text>
              </Pressable>
            </View>
          </SurfaceCard>

          <SurfaceCard style={styles.storageCard}>
            <View style={styles.storageRow}>
              <View style={styles.storageIcon}>
                <MaterialCommunityIcons name="download" size={22} color={colors.green} />
              </View>
              <View style={styles.storageInfo}>
                <Text style={styles.storageLabel}>Downloads</Text>
                <Text style={styles.storageValue}>{storageInfo.downloadsSize}</Text>
              </View>
              <Pressable style={styles.clearBtn} onPress={clearDownloads}>
                <Text style={styles.clearBtnText}>Clear</Text>
              </Pressable>
            </View>
          </SurfaceCard>

          <Text style={styles.sectionTitle}>Storage Settings</Text>

          <SurfaceCard style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons name="wifi" size={22} color={colors.blue} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Download on Wi-Fi Only</Text>
                  <Text style={styles.settingSubtitle}>Save mobile data</Text>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={colors.slate} />
            </View>
          </SurfaceCard>

          <SurfaceCard style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons name="video" size={22} color={colors.purple} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Video Quality</Text>
                  <Text style={styles.settingSubtitle}>Auto (recommended)</Text>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={colors.slate} />
            </View>
          </SurfaceCard>

          <Pressable style={styles.actionCard}>
            <MaterialCommunityIcons name="delete-forever" size={22} color={colors.red} />
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Clear All Data</Text>
              <Text style={styles.actionSubtitle}>Delete all app data and reset</Text>
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
  summaryCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 24,
  },
  summaryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.slate,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.ink,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 12,
    marginTop: 8,
  },
  storageCard: {
    marginBottom: 12,
    padding: 16,
  },
  storageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storageIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  storageInfo: {
    flex: 1,
  },
  storageLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 2,
  },
  storageValue: {
    fontSize: 13,
    color: colors.slate,
  },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.blueSoft,
  },
  clearBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.blue,
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
    color: colors.red,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: colors.slate,
  },
});
