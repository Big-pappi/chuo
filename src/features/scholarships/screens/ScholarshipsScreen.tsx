import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {SurfaceCard, SectionHeader, IconTile, Pill} from '@/components/ui/Cards';

interface Scholarship {
  id: string;
  name: string;
  provider: string;
  amount: string;
  deadline: string;
  eligibility: string[];
  status: 'available' | 'applied' | 'closed';
  description: string;
}

const ScholarshipsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<'available' | 'applied'>('available');

  const [scholarships] = useState<Scholarship[]>([
    {
      id: '1',
      name: 'Higher Education Students Loans Board (HESLB)',
      provider: 'Government of Tanzania',
      amount: 'Up to TZS 5,000,000',
      deadline: '2024-08-30',
      eligibility: ['Tanzanian citizen', 'Admitted to accredited university', 'From low-income family'],
      status: 'available',
      description: 'Government loan scheme for Tanzanian students pursuing higher education.',
    },
    {
      id: '2',
      name: 'MasterCard Foundation Scholars Program',
      provider: 'MasterCard Foundation',
      amount: 'Full Scholarship',
      deadline: '2024-09-15',
      eligibility: ['African citizen', 'Academic excellence', 'Leadership potential', 'Economic disadvantage'],
      status: 'available',
      description: 'Comprehensive scholarship program for African students including tuition, accommodation, and stipend.',
    },
    {
      id: '3',
      name: 'UDSM Excellence Scholarship',
      provider: 'University of Dar es Salaam',
      amount: 'TZS 1,500,000',
      deadline: '2024-07-31',
      eligibility: ['UDSM student', 'Minimum GPA 3.5', 'Full-time enrollment'],
      status: 'applied',
      description: 'Merit-based scholarship for outstanding UDSM students.',
    },
    {
      id: '4',
      name: 'Women in Tech Scholarship',
      provider: 'Various Tech Companies',
      amount: 'TZS 2,000,000',
      deadline: '2024-10-01',
      eligibility: ['Female student', 'STEM program', 'Minimum GPA 3.0'],
      status: 'available',
      description: 'Scholarship to support women pursuing careers in technology.',
    },
  ]);

  const filteredScholarships = scholarships.filter(s =>
    selectedTab === 'available' ? s.status === 'available' : s.status === 'applied',
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
  };

  const getStatusConfig = (status: Scholarship['status']) => {
    switch (status) {
      case 'available':
        return {color: colors.green, soft: colors.greenSoft, label: 'Available'};
      case 'applied':
        return {color: colors.blue, soft: colors.blueSoft, label: 'Applied'};
      case 'closed':
        return {color: colors.slate, soft: colors.panel, label: 'Closed'};
      default:
        return {color: colors.slate, soft: colors.panel, label: 'Unknown'};
    }
  };

  const renderScholarshipCard = (scholarship: Scholarship) => {
    const statusConfig = getStatusConfig(scholarship.status);

    return (
      <SurfaceCard key={scholarship.id} style={styles.scholarshipCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <IconTile icon="trophy" color={colors.orange} soft={colors.orangeSoft} size={48} iconSize={24} />
            <View style={styles.headerInfo}>
              <Text style={styles.scholarshipName}>{scholarship.name}</Text>
              <Text style={styles.provider}>{scholarship.provider}</Text>
            </View>
          </View>
          <Pill label={statusConfig.label} color={statusConfig.color} soft={statusConfig.soft} />
        </View>

        <View style={styles.amountRow}>
          <MaterialCommunityIcons name="cash-multiple" size={18} color={colors.green} />
          <Text style={styles.amount}>{scholarship.amount}</Text>
        </View>

        <Text style={styles.description} numberOfLines={3}>
          {scholarship.description}
        </Text>

        <View style={styles.eligibilitySection}>
          <Text style={styles.eligibilityTitle}>Eligibility</Text>
          {scholarship.eligibility.map((item, index) => (
            <View key={index} style={styles.eligibilityItem}>
              <MaterialCommunityIcons name="check-circle" size={16} color={colors.green} />
              <Text style={styles.eligibilityText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.deadlineRow}>
          <MaterialCommunityIcons name="calendar-alert" size={14} color={colors.slate} />
          <Text style={styles.deadlineText}>Deadline: {formatDate(scholarship.deadline)}</Text>
        </View>

        <View style={styles.cardActions}>
          <Pressable
            style={styles.detailsButton}
            onPress={() => console.log('[v0] View scholarship details:', scholarship.id)}>
            <Text style={styles.detailsButtonText}>Details</Text>
          </Pressable>
          {scholarship.status === 'available' && (
            <Pressable
              style={styles.applyButton}
              onPress={() => console.log('[v0] Apply for scholarship:', scholarship.id)}>
              <Text style={styles.applyButtonText}>Apply Now</Text>
            </Pressable>
          )}
        </View>
      </SurfaceCard>
    );
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
              onPress={() => navigation.canGoBack() && navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Go back">
              <MaterialCommunityIcons name="arrow-left" size={22} color={colors.ink} />
            </Pressable>
            <Text style={styles.title}>Scholarships</Text>
            <Pressable
              style={styles.headerBtn}
              hitSlop={8}
              accessibilityLabel="Saved scholarships"
              onPress={() => console.log('[v0] Saved scholarships')}>
              <MaterialCommunityIcons name="bookmark-outline" size={22} color={colors.ink} />
            </Pressable>
          </View>
        </View>

        <View style={styles.scrollContent}>
          {/* Stats summary */}
          <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{scholarships.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, {color: colors.green}]}>
              {scholarships.filter(s => s.status === 'available').length}
            </Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{scholarships.filter(s => s.status === 'applied').length}</Text>
            <Text style={styles.statLabel}>Applied</Text>
          </View>
        </View>

        {/* Tab filter */}
        <View style={styles.tabContainer}>
          {(['available', 'applied'] as const).map(tab => {
            const isActive = selectedTab === tab;
            const count = scholarships.filter(s => s.status === tab).length;
            return (
              <Pressable
                key={tab}
                style={[styles.tab, isActive && styles.activeTab]}
                onPress={() => setSelectedTab(tab)}>
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
                {count > 0 && (
                  <View style={[styles.tabBadge, isActive && styles.activeTabBadge]}>
                    <Text style={[styles.tabBadgeText, isActive && styles.activeTabBadgeText]}>{count}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Scholarships list */}
        <View style={styles.content}>
          <SectionHeader
            title={`${selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Scholarships`}
            actionLabel={filteredScholarships.length > 0 ? `${filteredScholarships.length} total` : undefined}
          />
          {filteredScholarships.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="school-outline" size={64} color={colors.muted} />
              <Text style={styles.emptyText}>
                {selectedTab === 'available' ? 'No available scholarships' : 'No applied scholarships'}
              </Text>
              <Text style={styles.emptySubtext}>
                {selectedTab === 'available'
                  ? 'Check back later for new opportunities'
                  : 'Start applying for scholarships'}
              </Text>
            </View>
          ) : (
            filteredScholarships.map(renderScholarshipCard)
          )}
        </View>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},

  /* Fixed Header */
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: colors.bg,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    color: colors.ink,
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

  /* Scroll Content */
  scrollContent: {paddingHorizontal: 16, paddingTop: 100, paddingBottom: 20},

  /* Stats Container */
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#0B2A6B',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    elevation: 1,
  },
  statItem: {flex: 1, alignItems: 'center'},
  statValue: {fontSize: 24, fontWeight: '800', color: colors.blue, marginBottom: 4},
  statLabel: {fontSize: 12, fontWeight: '600', color: colors.slate},
  statDivider: {width: 1, backgroundColor: colors.line},
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.panel,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  activeTab: {
    backgroundColor: colors.white,
    shadowColor: '#0B2A6B',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  tabText: {fontSize: 13, fontWeight: '600', color: colors.slate},
  activeTabText: {color: colors.blue},
  tabBadge: {
    backgroundColor: colors.slate,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  activeTabBadge: {backgroundColor: colors.blue},
  tabBadgeText: {fontSize: 10, fontWeight: '700', color: colors.white},
  activeTabBadgeText: {color: colors.white},
  content: {marginBottom: 20},
  scholarshipCard: {marginBottom: 16},
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12},
  headerInfo: {flex: 1},
  scholarshipName: {fontSize: 15, fontWeight: '700', color: colors.ink, marginBottom: 4},
  provider: {fontSize: 13, color: colors.slate},
  amountRow: {flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12},
  amount: {fontSize: 16, fontWeight: '800', color: colors.green},
  description: {fontSize: 14, color: colors.slate, lineHeight: 20, marginBottom: 12},
  eligibilitySection: {
    backgroundColor: colors.panel,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  eligibilityTitle: {fontSize: 13, fontWeight: '700', color: colors.ink, marginBottom: 8},
  eligibilityItem: {flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6},
  eligibilityText: {flex: 1, fontSize: 13, color: colors.slate},
  deadlineRow: {flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12},
  deadlineText: {fontSize: 12, color: colors.slate},
  cardActions: {flexDirection: 'row', gap: 10},
  detailsButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blueSoft,
    paddingVertical: 12,
    borderRadius: 10,
  },
  detailsButtonText: {fontSize: 14, fontWeight: '700', color: colors.blue},
  applyButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue,
    paddingVertical: 12,
    borderRadius: 10,
  },
  applyButtonText: {fontSize: 14, fontWeight: '700', color: colors.white},
  emptyState: {alignItems: 'center', paddingVertical: 40},
  emptyText: {fontSize: 16, fontWeight: '700', color: colors.ink, marginTop: 16},
  emptySubtext: {fontSize: 14, color: colors.slate, marginTop: 4, textAlign: 'center'},
});

export default ScholarshipsScreen;