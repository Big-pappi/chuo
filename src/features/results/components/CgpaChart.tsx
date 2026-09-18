import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {colors, spacing, typography} from '@/theme';

interface CgpaData {
  semester: string;
  cgpa: number;
}

interface CgpaChartProps {
  data: CgpaData[];
  targetCgpa?: number;
}

const CgpaChart: React.FC<CgpaChartProps> = ({data, targetCgpa = 4.0}) => {
  const maxCgpa = 4.0;
  const chartHeight = 200;
  const barWidth = 40;
  const gap = 20;

  const renderBar = (item: CgpaData, index: number) => {
    const barHeight = (item.cgpa / maxCgpa) * (chartHeight - 40);
    const targetHeight = (targetCgpa / maxCgpa) * (chartHeight - 40);
    
    return (
      <View key={index} style={styles.barContainer}>
        <View style={styles.barWrapper}>
          <View
            style={[
              styles.bar,
              {
                height: barHeight,
                backgroundColor: item.cgpa >= 3.5 ? colors.success : item.cgpa >= 3.0 ? colors.blue : colors.warning,
              },
            ]}
          />
          <View
            style={[
              styles.targetLine,
              {
                bottom: targetHeight,
              },
            ]}
          />
        </View>
        <Text style={styles.barValue}>{item.cgpa.toFixed(2)}</Text>
        <Text style={styles.barLabel}>{item.semester}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>CGPA Progress</Text>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: colors.success}]} />
            <Text style={styles.legendText}>≥ 3.5</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: colors.blue}]} />
            <Text style={styles.legendText}>3.0 - 3.5</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: colors.warning}]} />
            <Text style={styles.legendText}>{'< 3.0'}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.chart}>
        <View style={styles.yAxis}>
          <Text style={styles.yAxisLabel}>4.0</Text>
          <Text style={styles.yAxisLabel}>3.0</Text>
          <Text style={styles.yAxisLabel}>2.0</Text>
          <Text style={styles.yAxisLabel}>1.0</Text>
          <Text style={styles.yAxisLabel}>0.0</Text>
        </View>
        <View style={styles.barsContainer}>
          {data.map((item, index) => renderBar(item, index))}
        </View>
      </View>
      
      <View style={styles.targetInfo}>
        <View style={[styles.targetBadge, {backgroundColor: colors.blue + '20'}]}>
          <Text style={[styles.targetText, {color: colors.blue}]}>
            Target CGPA: {targetCgpa.toFixed(2)}
          </Text>
        </View>
        <Text style={styles.currentCgpa}>
          Current CGPA: {data[data.length - 1]?.cgpa.toFixed(2) || 'N/A'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.white,
  },
  chartHeader: {
    marginBottom: spacing.lg,
  },
  chartTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  legendText: {
    fontSize: typography.fontSize.xs,
    color: colors.slate,
  },
  chart: {
    flexDirection: 'row',
    height: 200,
    marginBottom: spacing.lg,
  },
  yAxis: {
    width: 40,
    justifyContent: 'space-between',
    paddingRight: spacing.sm,
  },
  yAxisLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.slate,
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 20,
  },
  barContainer: {
    alignItems: 'center',
  },
  barWrapper: {
    position: 'relative',
    height: 160,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 40,
    borderRadius: 4,
  },
  targetLine: {
    position: 'absolute',
    left: -10,
    right: -10,
    height: 2,
    backgroundColor: colors.blue,
    borderStyle: 'dashed',
  },
  barValue: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.ink,
    marginTop: spacing.xs,
  },
  barLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.slate,
    marginTop: spacing.xs,
  },
  targetInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  targetBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  targetText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  currentCgpa: {
    fontSize: typography.fontSize.sm,
    color: colors.slate,
  },
});

export default CgpaChart;
