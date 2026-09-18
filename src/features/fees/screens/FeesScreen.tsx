import React from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView, Image} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {SectionHeader} from '@/components/ui/Cards';
import {notifications as allNotifications} from '@/data/mock';
import {mockStudent} from '@/data/mock';
import {
  FeeBreakdown,
  RecentPayments,
  PaymentMethods,
} from '../components/fees';

const FeesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const go = (route: string) => () => {
    try {
      navigation.navigate(route);
    } catch {
      /* route may not exist in this prototype */
    }
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
            <Text style={styles.title}>Fees &amp; Payments</Text>
            <Pressable
              style={styles.headerBtn}
              hitSlop={8}
              onPress={go('Profile')}
              accessibilityRole="button"
              accessibilityLabel="Open profile">
              <Image source={mockStudent.avatar} style={styles.avatar} />
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
          <FeeBreakdown />

          <SectionHeader title="Recent Payments" />
          <RecentPayments />

          <SectionHeader title="Payment Methods" />
          <PaymentMethods />
        </ScrollView>
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
    gap: 12,
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
  title: {flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '800', color: colors.ink},
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.panel,
  },

  /* Scroll Content */
  scrollContent: {flex: 1},
  scrollContentContainer: {paddingHorizontal: 16, paddingTop: 100, paddingBottom: 20},
});

export default FeesScreen;
