import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {colors} from '@/theme';
import {SurfaceCard, SectionHeader, IconTile, Pill} from '@/components/ui/Cards';
import {
  mockStudent,
  mockUniversity,
  quickActionsCatalog,
  upcomingClasses,
  tasksDeadlines,
  feeSummary,
  announcements,
  applications,
  formatTZS,
  QuickAction,
} from '@/data/mock';

/* ------------------------------------------------------------------ */
/* At-a-glance academic summary                                       */
/* ------------------------------------------------------------------ */
export function HeroCard({onProfile}: {onProfile?: () => void}) {
  return (
    <View style={styles.summaryBlock}>
      <View style={styles.summaryHeader}>
        <View><Text style={styles.summaryEyebrow}>AT A GLANCE</Text><Text style={styles.summaryTitle}>Academic overview</Text></View>
        <Pressable onPress={onProfile} style={styles.summaryAction}><MaterialCommunityIcons name="arrow-top-right" size={16} color={colors.blue} /></Pressable>
      </View>
      <View style={styles.metricsRow}>
        <View style={styles.metric}><View style={[styles.metricIcon, {backgroundColor: colors.blueSoft}]}><MaterialCommunityIcons name="chart-line" size={18} color={colors.blue} /></View><Text style={styles.metricLabel}>GPA</Text><Text style={styles.metricValue}>{mockStudent.gpa.toFixed(2)}</Text><Text style={styles.metricMeta}>+{mockStudent.gpaDelta.toFixed(2)} term</Text></View>
        <View style={styles.metric}><View style={[styles.metricIcon, {backgroundColor: colors.greenSoft}]}><MaterialCommunityIcons name="medal-outline" size={18} color={colors.green} /></View><Text style={styles.metricLabel}>Standing</Text><Text style={styles.metricValueSmall}>{mockStudent.standing}</Text><Text style={styles.metricMeta}>Current</Text></View>
        <View style={styles.metric}><View style={[styles.metricIcon, {backgroundColor: colors.orangeSoft}]}><MaterialCommunityIcons name="calendar-outline" size={18} color={colors.orange} /></View><Text style={styles.metricLabel}>Progress</Text><Text style={styles.metricValueSmall}>Y{mockStudent.year} / S{mockStudent.semester}</Text><Text style={styles.metricMeta}>Programme</Text></View>
      </View>
    </View>
  );
}

/* Legacy detail card kept as a profile entry point for existing routes. */
function LegacyHeroCard({onProfile}: {onProfile?: () => void}) {
  return (
    <Pressable onPress={onProfile}>
      <LinearGradient colors={['#06245E', '#0B4FD8', '#3A82F6']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.heroCard}>
        {/* Header row */}
        <View style={styles.heroRow}>
          <View style={styles.heroBadge}>
            <MaterialCommunityIcons name="school" size={16} color={colors.blue} />
            <Text style={styles.heroBadgeText}>{mockUniversity.short}</Text>
          </View>
          <View style={[styles.heroBadge, styles.heroBadgeGreen]}>
            <Text style={styles.heroBadgeTextGreen}>Student</Text>
          </View>
        </View>

        {/* GPA section */}
        <View style={styles.gpaSection}>
          <Text style={styles.gpaLabel}>Current GPA</Text>
          <View style={styles.gpaRow}>
            <Text style={styles.gpaValue}>{mockStudent.gpa.toFixed(2)}</Text>
            <View style={styles.gpaTrend}>
              <MaterialCommunityIcons name="trending-up" size={12} color={colors.green} />
              <Text style={styles.gpaTrendText}>+{mockStudent.gpaDelta.toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.standingBadge}>
            <Text style={styles.standingText}>{mockStudent.standing}</Text>
          </View>
        </View>

        {/* Info cards */}
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="book-open-variant" size={14} color={colors.blue} />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Program</Text>
              <Text style={styles.infoValue} numberOfLines={1}>{mockStudent.programme}</Text>
              <Text style={styles.infoMeta}>Y{mockStudent.year} • S{mockStudent.semester}</Text>
            </View>
          </View>
          <Pressable style={styles.infoCard}>
            <MaterialCommunityIcons name="identifier" size={14} color={colors.green} />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Student ID</Text>
              <Text style={styles.infoValue}>{mockStudent.studentId}</Text>
              <Text style={styles.infoMeta}>Tap to copy</Text>
            </View>
          </Pressable>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

/* ------------------------------------------------------------------ */
/* Quick access grid                                                  */
/* ------------------------------------------------------------------ */
export function QuickAccess({
  tileIds,
  onCustomize,
  onTilePress,
}: {
  tileIds: string[];
  onCustomize?: () => void;
  onTilePress?: (id: string) => void;
}) {
  const catalog = new Map(quickActionsCatalog.map(t => [t.id, t]));
  const tiles = tileIds
    .map(id => catalog.get(id))
    .filter(Boolean) as QuickAction[];

  return (
    <View style={styles.block}>
      <SectionHeader title="Quick Access" actionLabel="Edit" onAction={onCustomize} />
      <View style={styles.qaGrid}>
        {tiles.map(tile => (
          <Pressable
            key={tile.id}
            style={styles.qaItem}
            onPress={() => onTilePress?.(tile.id)}>
            <View style={[styles.qaTile, {backgroundColor: tile.soft}]}>
              <MaterialCommunityIcons name={tile.icon as any} size={28} color={tile.color} />
            </View>
            <Text style={styles.qaLabel} numberOfLines={2}>
              {tile.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Today's classes                                                    */
/* ------------------------------------------------------------------ */
export function TodaysClasses({onViewAll}: {onViewAll?: () => void}) {
  return (
    <View style={styles.sectionBlock}>
      <SectionHeader title="Today's Classes" actionLabel="View All" onAction={onViewAll} />
      <View style={styles.listContainer}>
        {upcomingClasses.map(c => (
          <View key={c.id} style={styles.listItem}>
            <View style={styles.listIcon}>
              <MaterialCommunityIcons name={c.icon as any} size={20} color={c.color} />
            </View>
            <View style={styles.listContent}>
              <Text style={styles.listTime}>{c.time}</Text>
              <Text style={styles.listTitle}>{c.title}</Text>
              <Text style={styles.listMeta}>{c.room}</Text>
            </View>
            {c.badge ? <Pill label={c.badge} color={colors.purple} soft={colors.purpleSoft} /> : null}
          </View>
        ))}
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Tasks & deadlines                                                  */
/* ------------------------------------------------------------------ */
export function TasksDeadlines({onViewAll}: {onViewAll?: () => void}) {
  return (
    <View style={styles.sectionBlock}>
      <SectionHeader title="Tasks & Deadlines" actionLabel="View All" onAction={onViewAll} />
      <View style={styles.listContainer}>
        {tasksDeadlines.map(t => (
          <View key={t.id} style={styles.listItem}>
            <View style={[styles.listIcon, {backgroundColor: t.soft}]}>
              <MaterialCommunityIcons name={t.icon as any} size={20} color={t.color} />
            </View>
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>{t.title}</Text>
              <Text style={styles.listMeta}>{t.due}</Text>
            </View>
            <Pill label={t.status} color={t.statusColor} soft={t.statusColor + '1A'} />
          </View>
        ))}
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Fee status                                                         */
/* ------------------------------------------------------------------ */
export function FeeStatus({onDetails}: {onDetails?: () => void}) {
  return (
    <SurfaceCard style={styles.block}>
      <SectionHeader title="Fee Status" actionLabel="View Details" onAction={onDetails} />
      <View style={styles.feeRow}>
        <View style={{flex: 1}}>
          <Text style={styles.feeLabel}>Total Balance</Text>
          <Text style={styles.feeValue}>{formatTZS(feeSummary.totalBalance)}</Text>
          <Text style={styles.feeDue}>Due Date: {feeSummary.dueDate}</Text>
        </View>
        <View style={styles.feeCard}>
          <MaterialCommunityIcons name="credit-card" size={22} color={colors.white} />
          <View style={styles.feeCardDot} />
        </View>
      </View>
    </SurfaceCard>
  );
}

/* ------------------------------------------------------------------ */
/* Latest announcements                                               */
/* ------------------------------------------------------------------ */
export function Announcements({onViewAll}: {onViewAll?: () => void}) {
  return (
    <View style={styles.sectionBlock}>
      <SectionHeader title="Latest Announcements" actionLabel="View All" onAction={onViewAll} />
      <View style={styles.listContainer}>
        {announcements.map(a => (
          <View key={a.id} style={styles.listItem}>
            <View style={[styles.listIcon, {backgroundColor: a.soft}]}>
              <MaterialCommunityIcons name={a.icon as any} size={20} color={a.color} />
            </View>
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>{a.title}</Text>
              <Text style={styles.listMeta}>{a.date}</Text>
            </View>
            <View style={[styles.annDot, {backgroundColor: a.unread ? colors.blue : colors.line}]} />
          </View>
        ))}
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Opportunities banner                                               */
/* ------------------------------------------------------------------ */
export function Opportunities({onExplore}: {onExplore?: () => void}) {
  return (
    <SurfaceCard style={[styles.block, styles.oppCard]}>
      <Text style={styles.oppTitleDark}>Your Future</Text>
      <Text style={styles.oppTitleBlue}>Starts Here</Text>
      <Text style={styles.oppText}>
        Explore scholarships, internships and opportunities.
      </Text>

      <View style={styles.oppTracker}>
        <Text style={styles.oppTrackerTitle}>Application Tracker</Text>
        <Text style={styles.oppTrackerSub}>{applications.length} Active Applications</Text>
        {applications.map(app => (
          <View key={app.id} style={styles.oppApp}>
            <View style={{flex: 1}}>
              <Text style={styles.oppAppName}>{app.name}</Text>
              <View style={styles.oppBarTrack}>
                <View
                  style={[
                    styles.oppBarFill,
                    {width: `${app.progress * 100}%`, backgroundColor: app.statusColor},
                  ]}
                />
              </View>
            </View>
            <Pill label={app.status} color={app.statusColor} soft={app.statusColor + '1A'} />
          </View>
        ))}
      </View>

      <Pressable style={styles.oppBtn} onPress={onExplore}>
        <Text style={styles.oppBtnText}>Explore Opportunities</Text>
      </Pressable>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  block: {marginBottom: 16},
  sectionBlock: {marginBottom: 20},

  summaryBlock: {marginBottom: 18},
  summaryHeader: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10},
  summaryEyebrow: {fontSize: 10, fontWeight: '800', letterSpacing: 1.2, color: colors.blue, marginBottom: 2},
  summaryTitle: {fontSize: 18, fontWeight: '900', color: colors.ink},
  summaryAction: {width: 34, height: 34, borderRadius: 12, backgroundColor: colors.blueSoft, alignItems: 'center', justifyContent: 'center'},
  metricsRow: {flexDirection: 'row', gap: 8},
  metric: {flex: 1, minHeight: 128, borderRadius: 20, padding: 12, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, shadowColor: colors.navy, shadowOpacity: 0.04, shadowRadius: 12, shadowOffset: {width: 0, height: 4}, elevation: 1},
  metricIcon: {width: 36, height: 36, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginBottom: 10},
  metricPrimary: {backgroundColor: colors.blue, borderColor: colors.blue},
  metricPrimaryLabel: {color: 'rgba(255,255,255,0.76)'},
  metricPrimaryMeta: {color: 'rgba(255,255,255,0.78)'},
  metricLabel: {fontSize: 10, fontWeight: '700', color: colors.slate, marginBottom: 9},
  metricValue: {fontSize: 31, lineHeight: 34, fontWeight: '900', color: colors.white},
  metricValueSmall: {fontSize: 15, lineHeight: 20, fontWeight: '900', color: colors.ink, marginTop: 7},
  metricMeta: {fontSize: 10, fontWeight: '600', color: colors.slate, marginTop: 5},

  /* Hero Card - Clean Style */
  heroCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    backgroundColor: colors.navy,
    overflow: 'hidden',
    shadowColor: colors.navy,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 3},
    elevation: 2,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  heroBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  heroBadgeGreen: {
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  heroBadgeTextGreen: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },

  /* GPA Section */
  gpaSection: {
    marginBottom: 14,
  },
  gpaLabel: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  gpaRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 8,
  },
  gpaValue: {
    color: colors.white,
    fontSize: 42,
    fontWeight: '800',
    lineHeight: 38,
  },
  gpaTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 2,
  },
  gpaTrendText: {
    color: colors.green,
    fontSize: 11,
    fontWeight: '700',
  },
  standingBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  standingText: {
    color: colors.green,
    fontSize: 11,
    fontWeight: '700',
  },

  /* Info Cards */
  infoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  infoCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 14,
    padding: 10,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  infoValue: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 1,
  },
  infoMeta: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 9,
    fontWeight: '500',
  },

  /* Quick access */
  qaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  qaItem: {
    width: '23%',
    alignItems: 'center',
    gap: 10,
  },
  qaTile: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.navy,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    elevation: 2,
  },
  qaLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 14,
  },

  /* Clean List Styles */
  listContainer: {
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.line,
  },
  listIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    flex: 1,
  },
  listTime: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.blue,
    marginBottom: 1,
  },
  listTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 1,
  },
  listMeta: {
    fontSize: 11,
    color: colors.slate,
  },
  annDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  /* Fee */
  feeRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 14},
  feeLabel: {fontSize: 12, color: colors.slate, marginBottom: 4},
  feeValue: {fontSize: 22, fontWeight: '800', color: colors.blue, marginBottom: 4},
  feeDue: {fontSize: 12, color: colors.slate},
  feeCard: {
    width: 58,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.blueDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feeCardDot: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.orange,
  },

  /* Opportunities */
  oppCard: {backgroundColor: colors.blueSoft},
  oppTitleDark: {fontSize: 22, fontWeight: '800', color: colors.ink},
  oppTitleBlue: {fontSize: 22, fontWeight: '800', color: colors.blue, marginBottom: 6},
  oppText: {fontSize: 13, color: colors.slate, marginBottom: 16, lineHeight: 18},
  oppTracker: {backgroundColor: colors.white, borderRadius: 16, padding: 14, marginBottom: 16},
  oppTrackerTitle: {fontSize: 14, fontWeight: '800', color: colors.ink},
  oppTrackerSub: {fontSize: 12, fontWeight: '700', color: colors.blue, marginBottom: 12},
  oppApp: {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12},
  oppAppName: {fontSize: 13, fontWeight: '600', color: colors.ink, marginBottom: 6},
  oppBarTrack: {height: 6, borderRadius: 3, backgroundColor: colors.line, overflow: 'hidden'},
  oppBarFill: {height: 6, borderRadius: 3},
  oppBtn: {backgroundColor: colors.blue, borderRadius: 12, paddingVertical: 13, alignItems: 'center'},
  oppBtnText: {color: colors.white, fontSize: 14, fontWeight: '700'},
});
