import React from 'react';
import {View, StyleSheet, Text, Image, Pressable} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {colors} from '@/theme';
import Screen from '@/components/ui/Screen';
import ScreenHeader from '@/components/ui/ScreenHeader';
import {SurfaceCard, SectionHeader, IconTile, Pill} from '@/components/ui/Cards';

const UniversityDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  // @ts-ignore
  const {university} = route.params || {};

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'maintenance':
        return {color: colors.orange, soft: colors.orangeSoft, label: 'Maintenance'};
      case 'inactive':
        return {color: colors.red, soft: colors.redSoft, label: 'Inactive'};
      default:
        return {color: colors.green, soft: colors.greenSoft, label: 'Active'};
    }
  };

  const status = getStatusConfig(university?.status || 'active');

  const infoItems = [
    {
      icon: 'map-marker',
      color: colors.blue,
      soft: colors.blueSoft,
      label: 'Location',
      value: `${university?.location?.region || 'Region'}, ${university?.location?.district || 'District'}`,
    },
    {
      icon: 'web',
      color: colors.purple,
      soft: colors.purpleSoft,
      label: 'Website',
      value: university?.website || 'www.university.ac.tz',
    },
    {
      icon: 'phone',
      color: colors.green,
      soft: colors.greenSoft,
      label: 'Contact',
      value: university?.phone || '+255 XXX XXX XXX',
    },
    {
      icon: 'email',
      color: colors.orange,
      soft: colors.orangeSoft,
      label: 'Email',
      value: university?.email || 'info@university.ac.tz',
    },
  ];

  const programs = ['Computer Science', 'Business', 'Engineering', 'Medicine'];

  return (
    <Screen>
      <ScreenHeader title="University Details" />
      <View style={styles.container}>
        {/* Hero card */}
        <SurfaceCard style={styles.heroCard}>
          {university?.logo ? (
            <Image source={{uri: university.logo}} style={styles.logo} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>{university?.acronym?.substring(0, 2) || 'UN'}</Text>
            </View>
          )}
          <Text style={styles.universityName}>{university?.name || 'University Name'}</Text>
          <Text style={styles.universityAcronym}>{university?.acronym || 'Acronym'}</Text>
          <View style={styles.statusWrap}>
            <Pill label={status.label} color={status.color} soft={status.soft} />
          </View>
        </SurfaceCard>

        {/* Info */}
        <View style={styles.section}>
          <SectionHeader title="Information" />
          <SurfaceCard>
            {infoItems.map((item, index) => (
              <View
                key={item.label}
                style={[styles.infoRow, index < infoItems.length - 1 && styles.infoRowBorder]}>
                <IconTile icon={item.icon} color={item.color} soft={item.soft} size={40} iconSize={20} />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={styles.infoValue}>{item.value}</Text>
                </View>
              </View>
            ))}
          </SurfaceCard>
        </View>

        {/* About */}
        <View style={styles.section}>
          <SectionHeader title="About" />
          <SurfaceCard>
            <Text style={styles.description}>
              {university?.description || 'No description available for this university.'}
            </Text>
          </SurfaceCard>
        </View>

        {/* Programs */}
        <View style={styles.section}>
          <SectionHeader title="Programs Offered" />
          <SurfaceCard>
            <View style={styles.programTags}>
              {programs.map(program => (
                <View key={program} style={styles.programTag}>
                  <Text style={styles.programTagText}>{program}</Text>
                </View>
              ))}
            </View>
          </SurfaceCard>
        </View>

        {/* Action */}
        <Pressable
          style={styles.actionButton}
          onPress={() => console.log('[v0] Apply to university:', university?.id)}>
          <MaterialCommunityIcons name="send" size={18} color={colors.white} />
          <Text style={styles.actionButtonText}>Apply Now</Text>
        </Pressable>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {paddingHorizontal: 16, paddingTop: 4},
  heroCard: {alignItems: 'center', paddingVertical: 24, marginBottom: 16},
  logo: {width: 88, height: 88, borderRadius: 24, marginBottom: 12},
  logoPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: colors.blueSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoText: {fontSize: 28, fontWeight: '800', color: colors.blue},
  universityName: {fontSize: 18, fontWeight: '800', color: colors.ink, textAlign: 'center', marginBottom: 4},
  universityAcronym: {fontSize: 14, color: colors.slate, marginBottom: 12},
  statusWrap: {alignItems: 'center'},
  section: {marginBottom: 16},
  infoRow: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12},
  infoRowBorder: {borderBottomWidth: 1, borderBottomColor: colors.line},
  infoText: {flex: 1},
  infoLabel: {fontSize: 12, color: colors.slate, marginBottom: 2, fontWeight: '600'},
  infoValue: {fontSize: 14, color: colors.ink, fontWeight: '600'},
  description: {fontSize: 14, color: colors.slate, lineHeight: 22},
  programTags: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  programTag: {
    backgroundColor: colors.blueSoft,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  programTagText: {fontSize: 13, color: colors.blue, fontWeight: '700'},
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.blue,
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 20,
    shadowColor: '#1D4ED8',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 6},
    elevation: 3,
  },
  actionButtonText: {fontSize: 16, fontWeight: '800', color: colors.white},
});

export default UniversityDetailScreen;