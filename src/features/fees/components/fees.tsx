import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {colors, gradients} from '@/theme';
import {SurfaceCard} from '@/components/ui/Cards';
import {
  mockStudent,
  mockUniversity,
  feeSummary,
  feeBreakdown,
  recentPayments,
  paymentMethods,
  formatTZS,
} from '@/data/mock';

/* ------------------------------------------------------------------ */
/* Hero balance card                                                   */
/* ------------------------------------------------------------------ */
export function FeesHero() {
  return (
    <LinearGradient
      colors={gradients.hero}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.hero}>
      <View style={styles.heroTopRow}>
        <View style={styles.heroLogo}>
          <MaterialCommunityIcons name="school" size={20} color={colors.white} />
        </View>
        <View style={{flex: 1}}>
          <View style={styles.heroUniRow}>
            <Text style={styles.heroUni} numberOfLines={1}>
              {mockUniversity.name}
            </Text>
            {mockUniversity.verified ? (
              <MaterialCommunityIcons name="check-decagram" size={15} color="#BFDBFE" />
            ) : null}
          </View>
          <Text style={styles.heroCampus}>
            {mockUniversity.short} • {mockUniversity.campus}
          </Text>
        </View>
      </View>

      <View style={styles.heroBody}>
        <View style={styles.heroCol}>
          <Text style={styles.heroLabel}>Program</Text>
          <Text style={styles.heroValue}>{mockStudent.programme}</Text>
          <View style={styles.heroPill}>
            <Text style={styles.heroPillText}>
              Year {mockStudent.year} • Semester {mockStudent.semester} ({mockStudent.academicYear})
            </Text>
          </View>
        </View>

        <View style={styles.heroBalanceCol}>
          <Text style={styles.heroLabel}>Total Balance</Text>
          <Text style={styles.heroBalance}>{formatTZS(feeSummary.totalBalance)}</Text>
          <View style={styles.duePill}>
            <Text style={styles.duePillText}>Due: {feeSummary.dueDate}</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

/* ------------------------------------------------------------------ */
/* Summary tiles                                                       */
/* ------------------------------------------------------------------ */
type Tile = {label: string; value: string; icon: string; color: string; soft: string; isStatus?: boolean};

export function FeesSummaryTiles() {
  const tiles: Tile[] = [
    {label: 'Total Fees', value: formatTZS(feeSummary.totalFees), icon: 'wallet', color: colors.purple, soft: colors.purpleSoft},
    {label: 'Paid Amount', value: formatTZS(feeSummary.paidAmount), icon: 'credit-card-check', color: colors.blue, soft: colors.blueSoft},
    {label: 'Outstanding', value: formatTZS(feeSummary.outstanding), icon: 'clock-outline', color: colors.orange, soft: colors.orangeSoft},
    {label: 'Payment Status', value: feeSummary.status, icon: 'check-circle', color: colors.green, soft: colors.greenSoft, isStatus: true},
  ];

  return (
    <SurfaceCard style={styles.tilesCard}>
      <View style={styles.tilesRow}>
        {tiles.map(t => (
          <View key={t.label} style={styles.tile}>
            <View style={[styles.tileIcon, {backgroundColor: t.soft}]}>
              <MaterialCommunityIcons name={t.icon as any} size={20} color={t.color} />
            </View>
            <Text style={styles.tileLabel} numberOfLines={1}>
              {t.label}
            </Text>
            {t.isStatus ? (
              <View style={[styles.statusPill, {backgroundColor: t.soft}]}>
                <Text style={[styles.statusPillText, {color: t.color}]} numberOfLines={1}>
                  {t.value}
                </Text>
              </View>
            ) : (
              <Text style={styles.tileValue} numberOfLines={1}>
                {t.value}
              </Text>
            )}
          </View>
        ))}
      </View>
    </SurfaceCard>
  );
}

/* ------------------------------------------------------------------ */
/* Fee breakdown table (debt view)                                     */
/* ------------------------------------------------------------------ */
export function FeeBreakdown() {
  return (
    <SurfaceCard style={styles.breakdownCard}>
      <View style={styles.breakdownHeader}>
        <Text style={styles.breakdownTitle}>Fee Breakdown</Text>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: colors.green}]} />
            <Text style={styles.legendText}>Paid</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: colors.error}]} />
            <Text style={styles.legendText}>Unpaid</Text>
          </View>
        </View>
      </View>

      <View style={styles.tableHeadRow}>
        <Text style={[styles.tableHead, {flex: 1}]}>Description</Text>
        <Text style={[styles.tableHead, styles.amountCol]}>Amount (TZS)</Text>
        <Text style={[styles.tableHead, styles.statusCol]}>Status</Text>
      </View>

      {feeBreakdown.map(row => (
        <View key={row.id} style={styles.tableRow}>
          <Text style={[styles.rowLabel, {flex: 1}]} numberOfLines={1}>
            {row.label}
          </Text>
          <Text style={[styles.rowAmount, styles.amountCol]}>
            {row.amount.toLocaleString('en-US')}
          </Text>
          <View style={[styles.statusCol, styles.rowStatus]}>
            <MaterialCommunityIcons
              name={row.paid ? 'check-circle' : 'close-circle'}
              size={15}
              color={row.paid ? colors.green : colors.error}
            />
            <Text style={[styles.rowStatusText, {color: row.paid ? colors.green : colors.error}]}>
              {row.paid ? 'Paid' : 'Unpaid'}
            </Text>
          </View>
        </View>
      ))}

      <View style={styles.totalRow}>
        <Text style={[styles.totalLabel, {flex: 1}]}>Total</Text>
        <Text style={styles.totalValue}>{formatTZS(feeSummary.totalFees)}</Text>
      </View>
    </SurfaceCard>
  );
}

/* ------------------------------------------------------------------ */
/* Recent payments / transactions                                      */
/* ------------------------------------------------------------------ */
export function RecentPayments() {
  return (
    <SurfaceCard style={styles.listCard}>
      {recentPayments.map((p, i) => (
        <View key={p.id}>
          <View style={styles.paymentRow}>
            <View style={[styles.payIcon, {backgroundColor: p.soft}]}>
              <MaterialCommunityIcons name={p.icon as any} size={20} color={p.color} />
            </View>
            <View style={styles.payInfo}>
              <Text style={styles.payLabel} numberOfLines={1}>
                {p.label}
              </Text>
              <Text style={styles.payRef} numberOfLines={1}>
                {p.ref}
              </Text>
            </View>
            <View style={styles.payRight}>
              <Text style={styles.payAmount}>{formatTZS(p.amount)}</Text>
              <Text style={styles.payDate}>{p.date}</Text>
            </View>
          </View>
          {i < recentPayments.length - 1 ? <View style={styles.rowDivider} /> : null}
        </View>
      ))}
    </SurfaceCard>
  );
}

/* ------------------------------------------------------------------ */
/* Saved payment methods (display only)                                */
/* ------------------------------------------------------------------ */
export function PaymentMethods() {
  return (
    <View style={styles.methodsRow}>
      {paymentMethods.map(m => (
        <SurfaceCard key={m.id} style={styles.methodCard}>
          <View style={styles.methodTop}>
            <View style={styles.methodBrand}>
              <MaterialCommunityIcons name={m.icon as any} size={20} color={colors.blue} />
            </View>
            <MaterialCommunityIcons name="dots-vertical" size={18} color={colors.muted} />
          </View>
          <Text style={styles.methodName} numberOfLines={1}>
            {m.label}
          </Text>
          <Text style={styles.methodDigits}>•••• {m.last4}</Text>
          {m.isDefault ? (
            <View style={styles.defaultPill}>
              <Text style={styles.defaultPillText}>Default</Text>
            </View>
          ) : null}
        </SurfaceCard>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  /* Hero */
  hero: {borderRadius: 22, padding: 18, marginBottom: 16, overflow: 'hidden'},
  heroTopRow: {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16},
  heroLogo: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroUniRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  heroUni: {color: colors.white, fontSize: 15, fontWeight: '800', flexShrink: 1},
  heroCampus: {color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '600', marginTop: 2},
  heroBody: {flexDirection: 'row', gap: 14},
  heroCol: {flex: 1},
  heroBalanceCol: {alignItems: 'flex-end'},
  heroLabel: {color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '600', marginBottom: 5},
  heroValue: {color: colors.white, fontSize: 15, fontWeight: '800', marginBottom: 8},
  heroPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  heroPillText: {color: colors.white, fontSize: 10, fontWeight: '700'},
  heroBalance: {color: colors.white, fontSize: 22, fontWeight: '900', marginBottom: 8},
  duePill: {backgroundColor: colors.error, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999},
  duePillText: {color: colors.white, fontSize: 10, fontWeight: '800'},

  /* Summary tiles */
  tilesCard: {marginBottom: 20, paddingVertical: 16, paddingHorizontal: 8},
  tilesRow: {flexDirection: 'row'},
  tile: {flex: 1, alignItems: 'center', paddingHorizontal: 4, gap: 6},
  tileIcon: {width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center'},
  tileLabel: {fontSize: 10, color: colors.slate, fontWeight: '600', textAlign: 'center'},
  tileValue: {fontSize: 11, fontWeight: '800', color: colors.ink, textAlign: 'center'},
  statusPill: {paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999},
  statusPillText: {fontSize: 9, fontWeight: '800'},

  /* Breakdown */
  breakdownCard: {marginBottom: 20},
  breakdownHeader: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12},
  breakdownTitle: {fontSize: 16, fontWeight: '800', color: colors.ink},
  legendRow: {flexDirection: 'row', gap: 12},
  legendItem: {flexDirection: 'row', alignItems: 'center', gap: 4},
  legendDot: {width: 8, height: 8, borderRadius: 4},
  legendText: {fontSize: 11, fontWeight: '600', color: colors.slate},
  tableHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    marginBottom: 4,
  },
  tableHead: {fontSize: 11, fontWeight: '700', color: colors.muted},
  amountCol: {width: 96, textAlign: 'right'},
  statusCol: {width: 74},
  tableRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: 9},
  rowLabel: {fontSize: 13, fontWeight: '600', color: colors.ink},
  rowAmount: {fontSize: 13, fontWeight: '700', color: colors.ink},
  rowStatus: {flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4},
  rowStatusText: {fontSize: 11, fontWeight: '700'},
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  totalLabel: {fontSize: 14, fontWeight: '800', color: colors.ink},
  totalValue: {fontSize: 15, fontWeight: '900', color: colors.ink},

  /* Recent payments */
  listCard: {marginBottom: 20, padding: 6},
  paymentRow: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 10},
  payIcon: {width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center'},
  payInfo: {flex: 1},
  payLabel: {fontSize: 13, fontWeight: '700', color: colors.ink, marginBottom: 3},
  payRef: {fontSize: 11, fontWeight: '600', color: colors.muted},
  payRight: {alignItems: 'flex-end'},
  payAmount: {fontSize: 13, fontWeight: '800', color: colors.ink, marginBottom: 3},
  payDate: {fontSize: 10, fontWeight: '600', color: colors.muted},
  rowDivider: {height: 1, backgroundColor: colors.line, marginLeft: 64},

  /* Payment methods */
  methodsRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 8},
  methodCard: {width: '47%', padding: 14},
  methodTop: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14},
  methodBrand: {
    width: 40,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodName: {fontSize: 13, fontWeight: '700', color: colors.ink, marginBottom: 4},
  methodDigits: {fontSize: 12, fontWeight: '700', color: colors.slate, letterSpacing: 1},
  defaultPill: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: colors.greenSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  defaultPillText: {fontSize: 9, fontWeight: '800', color: colors.green},
});
