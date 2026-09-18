import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, Pressable, TextInput} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {RootState, AppDispatch} from '@/store/store';
import {fetchUniversities} from '@/store/slices/universitySlice';
import {University} from '@/types/university.types';
import {colors} from '@/theme';
import Screen from '@/components/ui/Screen';
import ScreenHeader from '@/components/ui/ScreenHeader';
import {SurfaceCard, SectionHeader, Pill} from '@/components/ui/Cards';

const UniversityListScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const {universities, isLoading, error} = useSelector((state: RootState) => state.university);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchUniversities());
  }, [dispatch]);

  const filteredUniversities =
    searchQuery.trim() === ''
      ? universities
      : universities.filter(
          uni =>
            uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            uni.acronym.toLowerCase().includes(searchQuery.toLowerCase()) ||
            uni.location.region.toLowerCase().includes(searchQuery.toLowerCase()),
        );

  const getStatusConfig = (status: University['status']) => {
    switch (status) {
      case 'active':
        return {color: colors.green, soft: colors.greenSoft, label: 'Active'};
      case 'maintenance':
        return {color: colors.orange, soft: colors.orangeSoft, label: 'Maintenance'};
      default:
        return {color: colors.red, soft: colors.redSoft, label: 'Inactive'};
    }
  };

  const renderUniversity = (item: University) => {
    const status = getStatusConfig(item.status);
    return (
      <Pressable
        key={item.id}
        onPress={() => navigation.navigate('University', {university: item})}>
        <SurfaceCard style={styles.card}>
          <View style={styles.logoContainer}>
            {item.logo ? (
              <Image source={{uri: item.logo}} style={styles.logo} />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>{item.acronym.substring(0, 2)}</Text>
              </View>
            )}
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.universityName} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.universityAcronym}>{item.acronym}</Text>
            <View style={styles.locationRow}>
              <MaterialCommunityIcons name="map-marker" size={14} color={colors.slate} />
              <Text style={styles.locationText} numberOfLines={1}>
                {item.location.region}, {item.location.district}
              </Text>
            </View>
          </View>
          <View style={styles.cardRight}>
            <Pill label={status.label} color={status.color} soft={status.soft} />
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.muted} />
          </View>
        </SurfaceCard>
      </Pressable>
    );
  };

  return (
    <Screen>
      <ScreenHeader title="Universities" />
      <View style={styles.container}>
        {/* Search bar */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.slate} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search universities..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <MaterialCommunityIcons name="close-circle" size={20} color={colors.muted} />
            </Pressable>
          )}
        </View>

        {/* List */}
        <View style={styles.content}>
          <SectionHeader
            title="All Universities"
            actionLabel={filteredUniversities.length > 0 ? `${filteredUniversities.length} total` : undefined}
          />
          {isLoading && universities.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="progress-clock" size={64} color={colors.muted} />
              <Text style={styles.emptyText}>Loading universities…</Text>
            </View>
          ) : filteredUniversities.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="school-outline" size={64} color={colors.muted} />
              <Text style={styles.emptyText}>{error ? 'Error Loading Universities' : 'No Universities Found'}</Text>
              <Text style={styles.emptySubtext}>{error || 'Try adjusting your search criteria'}</Text>
            </View>
          ) : (
            filteredUniversities.map(renderUniversity)
          )}
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {paddingHorizontal: 16, paddingTop: 4},
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: '#0B2A6B',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    elevation: 1,
  },
  searchInput: {flex: 1, fontSize: 15, color: colors.ink, padding: 0},
  content: {marginBottom: 20},
  card: {flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12},
  logoContainer: {},
  logo: {width: 52, height: 52, borderRadius: 16},
  logoPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.blueSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {fontSize: 16, fontWeight: '800', color: colors.blue},
  cardInfo: {flex: 1},
  universityName: {fontSize: 15, fontWeight: '700', color: colors.ink, marginBottom: 2},
  universityAcronym: {fontSize: 13, color: colors.slate, marginBottom: 4},
  locationRow: {flexDirection: 'row', alignItems: 'center', gap: 4},
  locationText: {flex: 1, fontSize: 12, color: colors.slate},
  cardRight: {alignItems: 'flex-end', gap: 8},
  emptyState: {alignItems: 'center', paddingVertical: 40},
  emptyText: {fontSize: 16, fontWeight: '700', color: colors.ink, marginTop: 16},
  emptySubtext: {fontSize: 14, color: colors.slate, marginTop: 4, textAlign: 'center'},
});

export default UniversityListScreen;