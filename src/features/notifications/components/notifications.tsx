import React from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView, ImageBackground} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {colors, gradients} from '@/theme';
import {SurfaceCard, IconTile} from '@/components/ui/Cards';
import {
  mockUniversity,
  notificationStats,
  notificationFilters,
  type Notification,
  type NotificationFilter,
} from '@/data/mock';

// Match the dashboard hero gradient so all screens stay uniform.
const HERO_GRADIENT = gradients.hero;

/* ------------------------------------------------------------------ */
/* Hero card                                                          */
/* ------------------------------------------------------------------ */
export function NotificationsHero() {
  return (
    <LinearGradient
      colors={gradients.hero}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.hero}>

      {/* Identity + bell */}
      <View style={styles.heroTop}>
        <View style={styles.heroLogo}>
          <MaterialCommunityIcons name="school" size={18} color={colors.white} />
        </View>
        <View style={styles.heroIdentity}>
          <View style={styles.heroUniRow}>
            <Text style={styles.heroUni} numberOfLines={2}>
              {mockUniversity.name}
            </Text>
            {mockUniversity.verified ? (
              <MaterialCommunityIcons name="check-decagram" size={14} color="#6EE7B7" />
            ) : null}
          </View>
          <Text style={styles.heroSub}>
            {mockUniversity.short}  •  {mockUniversity.campus}
          </Text>
        </View>
        <View style={styles.heroBell}>
          <MaterialCommunityIcons name="bell" size={26} color={colors.white} />
        </View>
      </View>

      {/* Stats */}
      <View style={styles.heroStats}>
        {notificationStats.map((s, i) => (
          <View key={s.key} style={[styles.statCol, i < notificationStats.length - 1 && styles.statBorder]}>
            <View style={styles.statLabelRow}>
              <MaterialCommunityIcons name={s.icon as any} size={12} color="rgba(255,255,255,0.85)" />
              <Text style={styles.statLabel} numberOfLines={1}>
                {s.label}
              </Text>
            </View>
            <Text style={styles.statValue}>{s.value}</Text>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}

/* ------------------------------------------------------------------ */
/* Filter chips                                                       */
/* ------------------------------------------------------------------ */
export function NotificationTabs({
  active,
  onSelect,
  unreadCount,
}: {
  active: NotificationFilter;
  onSelect: (f: NotificationFilter) => void;
  unreadCount: number;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabsRow}>
      {notificationFilters.map(f => {
        const isActive = f === active;
        const showBadge = f === 'Unread' && unreadCount > 0;
        return (
          <Pressable
            key={f}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onSelect(f)}>
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{f}</Text>
            {showBadge ? (
              <View style={[styles.chipBadge, isActive && styles.chipBadgeActive]}>
                <Text style={[styles.chipBadgeText, isActive && styles.chipBadgeTextActive]}>
                  {unreadCount}
                </Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/* ------------------------------------------------------------------ */
/* Single notification row                                            */
/* ------------------------------------------------------------------ */
export function NotificationCard({
  item,
  onPress,
}: {
  item: Notification;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <SurfaceCard style={[styles.card, item.unread && styles.cardUnread]}>
        <View style={[styles.statusDot, {backgroundColor: item.dot}]} />
        <IconTile icon={item.icon} color={item.color} soft={item.soft} size={44} iconSize={22} />

        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.cardText} numberOfLines={2}>
            {item.body}
          </Text>
          {item.link ? (
            <View style={styles.linkRow}>
              <Text style={styles.linkText}>{item.link}</Text>
              <MaterialCommunityIcons name="chevron-right" size={15} color={colors.blue} />
            </View>
          ) : null}
        </View>

        <View style={styles.cardRight}>
          <Text style={styles.cardTime}>{item.time}</Text>
          {item.badge ? (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>{item.badge}</Text>
            </View>
          ) : item.trailing === 'check' ? (
            <MaterialCommunityIcons name="check-circle" size={18} color={colors.green} />
          ) : item.trailing === 'chevron' ? (
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.muted} />
          ) : item.trailing === 'dot' ? (
            <View style={styles.smallDot} />
          ) : null}
        </View>
      </SurfaceCard>
    </Pressable>
  );
}

/* ------------------------------------------------------------------ */
/* Enable notifications banner                                        */
/* ------------------------------------------------------------------ */
export function EnableBanner({onEnable}: {onEnable?: () => void}) {
  return (
    <LinearGradient
      colors={HERO_GRADIENT}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.banner}>
      <View style={styles.bannerBellWrap}>
        <MaterialCommunityIcons name="bell-ring" size={34} color="rgba(255,255,255,0.9)" />
      </View>
      <Text style={styles.bannerTitle}>Never miss an update!</Text>
      <Text style={styles.bannerText}>
        Enable push notifications to receive important alerts instantly.
      </Text>
      <Pressable style={styles.bannerBtn} onPress={onEnable}>
        <MaterialCommunityIcons name="bell-outline" size={16} color={colors.blue} />
        <Text style={styles.bannerBtnText}>Enable Notifications</Text>
        <MaterialCommunityIcons name="arrow-right" size={16} color={colors.blue} />
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  /* Hero */
  hero: {borderRadius: 22, padding: 18, marginBottom: 18, overflow: 'hidden'},
  heroTop: {flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18},
  heroLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIdentity: {flex: 1},
  heroUniRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  heroUni: {flexShrink: 1, color: colors.white, fontSize: 15, fontWeight: '800'},
  heroSub: {color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '600', marginTop: 2},
  heroBell: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroStats: {flexDirection: 'row', alignItems: 'stretch'},
  statCol: {flex: 1, paddingHorizontal: 6},
  statBorder: {borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.22)'},
  statLabelRow: {flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6},
  statLabel: {flexShrink: 1, color: 'rgba(255,255,255,0.85)', fontSize: 10, fontWeight: '600'},
  statValue: {color: colors.white, fontSize: 22, fontWeight: '800'},

  /* Tabs */
  tabsRow: {gap: 10, paddingVertical: 4, paddingRight: 8, marginBottom: 16},
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chipActive: {backgroundColor: colors.blue, borderColor: colors.blue},
  chipText: {fontSize: 13, fontWeight: '700', color: colors.slate},
  chipTextActive: {color: colors.white},
  chipBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  chipBadgeActive: {backgroundColor: 'rgba(255,255,255,0.28)'},
  chipBadgeText: {color: colors.white, fontSize: 10, fontWeight: '800'},
  chipBadgeTextActive: {color: colors.white},

  /* Card */
  card: {flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12, paddingLeft: 22},
  cardUnread: {backgroundColor: colors.white},
  statusDot: {position: 'absolute', left: 12, top: 22, width: 8, height: 8, borderRadius: 4},
  cardBody: {flex: 1},
  cardTitle: {fontSize: 14, fontWeight: '800', color: colors.ink, marginBottom: 3},
  cardText: {fontSize: 12, color: colors.slate, lineHeight: 17},
  linkRow: {flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 6},
  linkText: {fontSize: 12, fontWeight: '700', color: colors.blue},
  cardRight: {alignItems: 'flex-end', justifyContent: 'space-between', alignSelf: 'stretch', gap: 10},
  cardTime: {fontSize: 11, color: colors.muted, fontWeight: '600'},
  newBadge: {backgroundColor: colors.blueSoft, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999},
  newBadgeText: {fontSize: 10, fontWeight: '800', color: colors.blue},
  smallDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.blue},

  /* Banner */
  banner: {borderRadius: 20, padding: 20, marginTop: 4, overflow: 'hidden'},
  bannerBellWrap: {
    position: 'absolute',
    right: 18,
    top: 18,
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {color: colors.white, fontSize: 17, fontWeight: '800', marginBottom: 6},
  bannerText: {color: 'rgba(255,255,255,0.88)', fontSize: 12, lineHeight: 17, marginBottom: 16, maxWidth: '75%'},
  bannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 999,
  },
  bannerBtnText: {color: colors.blue, fontSize: 13, fontWeight: '800'},
});
