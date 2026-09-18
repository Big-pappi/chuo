import React from 'react';
import {View, Text, StyleSheet, Pressable, Image, Switch} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {colors, gradients} from '@/theme';
import {SurfaceCard, IconTile} from '@/components/ui/Cards';
import {
  mockStudent,
  mockUniversity,
  profileQuickAccess,
  type ProfileSettingItem,
} from '@/data/mock';

type MenuItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  soft: string;
};

/* ------------------------------------------------------------------ */
/* Identity card                                                       */
/* ------------------------------------------------------------------ */
export function ProfileCard({onEdit}: {onEdit?: () => void}) {
  return (
    <SurfaceCard style={styles.card}>
      <View style={styles.cardTop}>
        {/* Avatar with edit badge */}
        <View style={styles.avatarWrap}>
          <Image source={mockStudent.avatar} style={styles.avatar} />
          <Pressable style={styles.editBadge} onPress={onEdit} hitSlop={6}>
            <MaterialCommunityIcons name="pencil" size={12} color={colors.white} />
          </Pressable>
        </View>

        {/* Name + meta */}
        <View style={styles.identity}>
          <Text style={styles.name} numberOfLines={1}>
            {mockStudent.name}
          </Text>
          <View style={styles.idRow}>
            <Text style={styles.idText} numberOfLines={1}>
              Student ID: {mockStudent.regNumber}
            </Text>
            <MaterialCommunityIcons name="content-copy" size={13} color={colors.muted} />
          </View>
          <Text style={styles.program}>{mockStudent.faculty}</Text>
          <View style={styles.yearPill}>
            <Text style={styles.yearPillText}>
              Year {mockStudent.year} • Semester {mockStudent.semester}
            </Text>
          </View>
        </View>
      </View>

      {/* University row */}
      <View style={styles.uniRow}>
        <View style={styles.uniLogo}>
          <MaterialCommunityIcons name="school" size={18} color={colors.blue} />
        </View>
        <Text style={styles.uniName} numberOfLines={2}>
          {mockUniversity.name}
        </Text>
        {mockUniversity.verified ? (
          <MaterialCommunityIcons name="check-decagram" size={16} color={colors.blue} />
        ) : null}
      </View>

      <View style={styles.divider} />

      {/* Contact / status row */}
      <View style={styles.metaRow}>
        <MetaCell icon="email-outline" label="Email" value={mockStudent.email} />
        <View style={styles.metaDivider} />
        <MetaCell icon="phone-outline" label="Phone" value={mockStudent.phone} />
        <View style={styles.metaDivider} />
        <MetaCell
          icon="account-outline"
          label="Campus"
          value={mockStudent.campus}
        />
      </View>
    </SurfaceCard>
  );
}

function MetaCell({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: string;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.metaCell}>
      <MaterialCommunityIcons name={icon as any} size={18} color={colors.blue} />
      <View style={styles.metaText}>
        <Text style={styles.metaLabel}>{label}</Text>
        <Text style={[styles.metaValue, valueColor && {color: valueColor}]} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Quick access row                                                    */
/* ------------------------------------------------------------------ */
export function ProfileQuickAccess({onPress}: {onPress?: (id: string) => void}) {
  return (
    <View style={styles.quickRow}>
      {profileQuickAccess.map(item => (
        <Pressable
          key={item.id}
          style={styles.quickTile}
          onPress={() => onPress?.(item.id)}>
          <IconTile icon={item.icon} color={item.color} soft={item.soft} size={44} iconSize={22} />
          <Text style={styles.quickLabel} numberOfLines={2}>
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Menu list card                                                      */
/* ------------------------------------------------------------------ */
export function MenuList({
  items,
  onPress,
}: {
  items: MenuItem[];
  onPress?: (id: string) => void;
}) {
  return (
    <SurfaceCard style={styles.menuCard}>
      {items.map((item, i) => (
        <View key={item.id}>
          <Pressable style={styles.menuRow} onPress={() => onPress?.(item.id)}>
            <IconTile icon={item.icon} color={item.color} soft={item.soft} size={42} iconSize={20} />
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle} numberOfLines={1}>
                {item.subtitle}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.muted} />
          </Pressable>
          {i < items.length - 1 ? <View style={styles.menuDivider} /> : null}
        </View>
      ))}
    </SurfaceCard>
  );
}

/* ------------------------------------------------------------------ */
/* Settings group card                                                 */
/* ------------------------------------------------------------------ */
export function SettingsGroup({
  label,
  items,
  toggles,
  onToggle,
  onPress,
}: {
  label: string;
  items: ProfileSettingItem[];
  toggles: Record<string, boolean>;
  onToggle: (id: string, value: boolean) => void;
  onPress?: (id: string) => void;
}) {
  return (
    <View style={styles.groupWrap}>
      <Text style={styles.groupLabel}>{label}</Text>
      <SurfaceCard style={styles.menuCard}>
        {items.map((item, i) => {
          const isToggle = item.control === 'toggle';
          const on = toggles[item.id] ?? false;
          return (
            <View key={item.id}>
              <Pressable
                style={styles.menuRow}
                disabled={isToggle}
                onPress={() => !isToggle && onPress?.(item.id)}>
                <IconTile icon={item.icon} color={item.color} soft={item.soft} size={42} iconSize={20} />
                <View style={styles.menuText}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle} numberOfLines={1}>
                    {item.subtitle}
                  </Text>
                </View>
                {isToggle ? (
                  <Switch
                    value={on}
                    onValueChange={v => onToggle(item.id, v)}
                    trackColor={{false: colors.line, true: colors.blue}}
                    thumbColor={colors.white}
                    ios_backgroundColor={colors.line}
                  />
                ) : item.control === 'value' ? (
                  <View style={styles.valueControl}>
                    <Text style={styles.valueText}>{item.value}</Text>
                    {item.id !== 'appVersion' ? (
                      <MaterialCommunityIcons name="chevron-right" size={22} color={colors.muted} />
                    ) : null}
                  </View>
                ) : (
                  <MaterialCommunityIcons name="chevron-right" size={22} color={colors.muted} />
                )}
              </Pressable>
              {i < items.length - 1 ? <View style={styles.menuDivider} /> : null}
            </View>
          );
        })}
      </SurfaceCard>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Log out row                                                         */
/* ------------------------------------------------------------------ */
export function LogOutRow({onPress}: {onPress?: () => void}) {
  return (
    <SurfaceCard style={styles.logoutCard}>
      <Pressable style={styles.logoutRow} onPress={onPress}>
        <IconTile icon="logout" color={colors.error} soft={colors.redSoft} size={42} iconSize={20} />
        <Text style={styles.logoutText}>Log Out</Text>
        <MaterialCommunityIcons name="chevron-right" size={22} color={colors.error} />
      </Pressable>
    </SurfaceCard>
  );
}

/* ------------------------------------------------------------------ */
/* Journey banner                                                      */
/* ------------------------------------------------------------------ */
export function JourneyBanner({onPress}: {onPress?: () => void}) {
  return (
    <LinearGradient
      colors={gradients.hero}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.banner}>
      <View style={styles.bannerIconWrap}>
        <MaterialCommunityIcons name="school" size={34} color="rgba(255,255,255,0.9)" />
      </View>
      <Text style={styles.bannerTitle}>Your journey matters</Text>
      <Text style={styles.bannerText}>
        Keep learning, stay focused and achieve your goals.
      </Text>
      <Pressable style={styles.bannerBtn} onPress={onPress}>
        <Text style={styles.bannerBtnText}>View Academic Progress</Text>
        <MaterialCommunityIcons name="arrow-right" size={16} color={colors.blue} />
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  /* Card */
  card: {marginBottom: 20},
  cardTop: {flexDirection: 'row', gap: 14},
  avatarWrap: {width: 76, height: 76},
  avatar: {width: 76, height: 76, borderRadius: 38, backgroundColor: colors.panel},
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  identity: {flex: 1},
  name: {fontSize: 18, fontWeight: '800', color: colors.ink, marginBottom: 4},
  idRow: {flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3},
  idText: {flexShrink: 1, fontSize: 12, color: colors.slate, fontWeight: '600'},
  program: {fontSize: 12, color: colors.slate, marginBottom: 8},
  yearPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.blueSoft,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  yearPillText: {fontSize: 11, fontWeight: '700', color: colors.blue},

  uniRow: {flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16},
  uniLogo: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uniName: {flex: 1, fontSize: 13, fontWeight: '700', color: colors.ink},

  divider: {height: 1, backgroundColor: colors.line, marginVertical: 14},

  metaRow: {flexDirection: 'row', alignItems: 'stretch'},
  metaCell: {flex: 1, flexDirection: 'row', alignItems: 'center', gap: 7, paddingRight: 6},
  metaText: {flex: 1},
  metaLabel: {fontSize: 10, color: colors.muted, fontWeight: '600', marginBottom: 2},
  metaValue: {fontSize: 11, color: colors.ink, fontWeight: '700'},
  metaDivider: {width: 1, backgroundColor: colors.line, marginHorizontal: 4},

  /* Quick access */
  quickRow: {flexDirection: 'row', gap: 8, marginBottom: 24},
  quickTile: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 4,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#0B2A6B',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 1,
  },
  quickLabel: {fontSize: 10, fontWeight: '700', color: colors.ink, textAlign: 'center'},

  /* Menu */
  menuCard: {padding: 6, marginBottom: 24},
  menuRow: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 10},
  menuText: {flex: 1},
  menuTitle: {fontSize: 14, fontWeight: '700', color: colors.ink, marginBottom: 2},
  menuSubtitle: {fontSize: 12, color: colors.slate},
  menuDivider: {height: 1, backgroundColor: colors.line, marginLeft: 64},

  /* Settings groups */
  groupWrap: {marginBottom: 18},
  groupLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  valueControl: {flexDirection: 'row', alignItems: 'center', gap: 4},
  valueText: {fontSize: 13, fontWeight: '700', color: colors.slate},

  /* Log out */
  logoutCard: {padding: 6, marginBottom: 24},
  logoutRow: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 10},
  logoutText: {flex: 1, fontSize: 14, fontWeight: '800', color: colors.error},

  /* Banner */
  banner: {borderRadius: 20, padding: 20, marginTop: 4, overflow: 'hidden'},
  bannerIconWrap: {
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
  bannerText: {color: 'rgba(255,255,255,0.88)', fontSize: 12, lineHeight: 17, marginBottom: 16, maxWidth: '72%'},
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
