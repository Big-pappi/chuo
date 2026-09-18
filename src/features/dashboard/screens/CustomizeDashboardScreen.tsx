import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import Screen from '@/components/ui/Screen';
import ScreenHeader from '@/components/ui/ScreenHeader';
import {SurfaceCard, SectionHeader, IconTile} from '@/components/ui/Cards';
import {colors} from '@/theme';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {
  toggleWidget,
  moveWidget,
  toggleQuickAccess,
  resetDashboard,
  WidgetId,
} from '@/store/slices/dashboardSlice';
import {quickActionsCatalog} from '@/data/mock';

function Toggle({on}: {on: boolean}) {
  return (
    <View style={[styles.switch, on && styles.switchOn]}>
      <View style={[styles.knob, on && styles.knobOn]} />
    </View>
  );
}

const CustomizeDashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const widgets = useAppSelector(state => state.dashboard.widgets);
  const quickAccess = useAppSelector(state => state.dashboard.quickAccess);

  return (
    <Screen background={colors.bg}>
      <ScreenHeader
        title="Customize Dashboard"
        actions={[{icon: 'restore', onPress: () => dispatch(resetDashboard())}]}
      />

      <View style={styles.container}>
        <Text style={styles.intro}>
          Choose which sections appear on your dashboard and the order they show in.
        </Text>

        {/* Dashboard sections */}
        <SectionHeader title="Sections" />
        <SurfaceCard style={styles.card}>
          {widgets.map((w, index) => (
            <View
              key={w.id}
              style={[styles.row, index < widgets.length - 1 && styles.rowBorderBottom]}>
              <View style={styles.reorder}>
                <Pressable
                  disabled={index === 0}
                  onPress={() => dispatch(moveWidget({id: w.id as WidgetId, direction: 'up'}))}
                  hitSlop={6}>
                  <MaterialCommunityIcons
                    name="chevron-up"
                    size={20}
                    color={index === 0 ? colors.line : colors.slate}
                  />
                </Pressable>
                <Pressable
                  disabled={index === widgets.length - 1}
                  onPress={() => dispatch(moveWidget({id: w.id as WidgetId, direction: 'down'}))}
                  hitSlop={6}>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={20}
                    color={index === widgets.length - 1 ? colors.line : colors.slate}
                  />
                </Pressable>
              </View>
              <Text style={[styles.rowLabel, !w.enabled && styles.rowLabelOff]}>{w.title}</Text>
              <Pressable onPress={() => dispatch(toggleWidget(w.id as WidgetId))} hitSlop={8}>
                <Toggle on={w.enabled} />
              </Pressable>
            </View>
          ))}
        </SurfaceCard>

        {/* Quick access tiles */}
        <SectionHeader title="Quick Access Shortcuts" />
        <SurfaceCard style={styles.card}>
          <View style={styles.tileGrid}>
            {quickActionsCatalog.map(tile => {
              const on = quickAccess.includes(tile.id);
              return (
                <Pressable
                  key={tile.id}
                  style={styles.tile}
                  onPress={() => dispatch(toggleQuickAccess(tile.id))}>
                  <View style={on ? undefined : styles.tileOff}>
                    <IconTile
                      icon={tile.icon}
                      color={tile.color}
                      soft={tile.soft}
                      size={48}
                      iconSize={22}
                    />
                  </View>
                  <Text style={styles.tileLabel} numberOfLines={1}>
                    {tile.label}
                  </Text>
                  <View style={[styles.check, on && styles.checkOn]}>
                    {on ? (
                      <MaterialCommunityIcons name="check" size={12} color={colors.white} />
                    ) : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </SurfaceCard>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.saveBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.saveText}>Done</Text>
        </Pressable>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {paddingHorizontal: 16, paddingTop: 4},
  intro: {fontSize: 13, color: colors.slate, marginBottom: 18, lineHeight: 18},
  card: {paddingVertical: 4, marginBottom: 20},
  row: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 4},
  rowBorderBottom: {borderBottomWidth: 1, borderBottomColor: colors.line},
  reorder: {alignItems: 'center', justifyContent: 'center'},
  rowLabel: {flex: 1, fontSize: 15, fontWeight: '600', color: colors.ink},
  rowLabelOff: {color: colors.muted},

  switch: {width: 46, height: 27, borderRadius: 14, backgroundColor: colors.line, padding: 3},
  switchOn: {backgroundColor: colors.blue},
  knob: {width: 21, height: 21, borderRadius: 11, backgroundColor: colors.white},
  knobOn: {transform: [{translateX: 19}]},

  tileGrid: {flexDirection: 'row', flexWrap: 'wrap', paddingVertical: 8},
  tile: {width: '25%', alignItems: 'center', marginVertical: 10, gap: 6},
  tileOff: {opacity: 0.35},
  tileLabel: {fontSize: 10, fontWeight: '600', color: colors.slate, textAlign: 'center'},
  check: {
    position: 'absolute',
    top: -2,
    right: '22%',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.line,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: {backgroundColor: colors.success, borderColor: colors.success},

  footer: {paddingHorizontal: 16, paddingTop: 4, paddingBottom: 12},
  saveBtn: {backgroundColor: colors.blue, borderRadius: 14, paddingVertical: 15, alignItems: 'center'},
  saveText: {color: colors.white, fontSize: 15, fontWeight: '700'},
});

export default CustomizeDashboardScreen;
