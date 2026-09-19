import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors} from '@/theme';

// Icon-only, Instagram-style navigation. Active tabs use the filled glyph.
const ICONS: Record<string, {active: string; inactive: string}> = {
  Home: {active: 'home', inactive: 'home-outline'},
  Academics: {active: 'school', inactive: 'school-outline'},
  Notifications: {active: 'bell', inactive: 'bell-outline'},
};

const BADGES: Record<string, number> = {
  Notifications: 3,
};

export default function BottomTabBar({state, navigation}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.floatWrap, {paddingBottom: Math.max(insets.bottom, 12)}]}>
      <View style={styles.pill}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const badge = BADGES[route.name];
          const glyphs = ICONS[route.name];
          const color = focused ? colors.white : colors.muted;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable key={route.key} style={styles.tab} onPress={onPress} hitSlop={8}>
              <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                <MaterialCommunityIcons
                  name={(focused ? glyphs.active : glyphs.inactive) as any}
                  size={27}
                  color={color}
                />
                {badge ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{badge}</Text>
                  </View>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 28,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#DCE7FA',
    shadowColor: '#0B2A6B',
    shadowOpacity: 0.14,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 8},
    elevation: 14,
  },
  tab: {alignItems: 'center', justifyContent: 'center', minWidth: 58},
  iconWrap: {
    width: 44,
    height: 38,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: colors.blue,
    shadowColor: colors.blue,
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 5},
    elevation: 6,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  badgeText: {color: colors.white, fontSize: 9, fontWeight: '800'},
});
