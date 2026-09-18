import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, Image} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {resultsSemesters, mockStudent} from '@/data/mock';
import {
  SemesterTabs,
  CourseResults,
  PerformanceOverview,
} from '../components/results';

const AcademicsHomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeSemester, setActiveSemester] = useState(
    resultsSemesters[resultsSemesters.length - 1].id,
  );

  return (
    <Screen>
      <View style={styles.container}>
        {/* Screen header — back / centered title / filter (matches prototype) */}
        <View style={styles.header}>
          <Pressable
            style={styles.headerBtn}
            hitSlop={8}
            onPress={() => navigation.canGoBack() && navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back">
            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.ink} />
          </Pressable>
          <Text style={styles.title}>My Results</Text>
          <Pressable
            hitSlop={8}
            onPress={() => navigation.navigate('Profile')}
            accessibilityRole="button"
            accessibilityLabel="Open profile">
            <Image source={mockStudent.avatar} style={styles.avatar} />
          </Pressable>
        </View>

        <SemesterTabs
          semesters={resultsSemesters}
          activeId={activeSemester}
          onSelect={setActiveSemester}
        />
        <CourseResults />
        <PerformanceOverview />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {paddingHorizontal: 16, paddingTop: 8},
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
  avatar: {width: 42, height: 42, borderRadius: 21, backgroundColor: colors.panel},
});

export default AcademicsHomeScreen;
