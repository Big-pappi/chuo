import React from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {colors} from '@/theme';
import {SurfaceCard, IconTile} from '@/components/ui/Cards';
import {
  mockStudent,
  mockUniversity,
  resultsSummary,
  courseResults,
  gradeGrade,
} from '@/data/mock';

/* ------------------------------------------------------------------ */
/* Semester selector                                                  */
/* ------------------------------------------------------------------ */
export function SemesterTabs({
  semesters,
  activeId,
  onSelect,
}: {
  semesters: {id: string; label: string; year: string}[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabsRow}>
      {semesters.map(s => {
        const active = s.id === activeId;
        return (
          <Pressable
            key={s.id}
            style={[styles.tab, active && styles.tabActive]}
            onPress={() => onSelect(s.id)}>
            <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{s.label}</Text>
            <Text style={[styles.tabYear, active && styles.tabYearActive]}>{s.year}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/* ------------------------------------------------------------------ */
/* Course results table                                               */
/* ------------------------------------------------------------------ */
export function CourseResults({onDownload}: {onDownload?: () => void}) {
  return (
    <SurfaceCard style={styles.block}>
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>Course Results</Text>
        <Pressable style={styles.downloadBtn} onPress={onDownload} hitSlop={8}>
          <MaterialCommunityIcons name="download" size={16} color={colors.blue} />
          <Text style={styles.downloadText}>Download Transcript</Text>
        </Pressable>
      </View>

      {/* Column headers */}
      <View style={styles.tableHead}>
        <Text style={[styles.th, styles.colNum]}>#</Text>
        <Text style={[styles.th, styles.colCode]}>Course</Text>
        <Text style={[styles.th, styles.colTitle]}>Title</Text>
        <Text style={[styles.th, styles.colCredits]}>Cr</Text>
        <Text style={[styles.th, styles.colGrade]}>Grade</Text>
        <Text style={[styles.th, styles.colPoints]}>Pts</Text>
      </View>

      {courseResults.map(c => {
        const g = gradeGrade(c.grade);
        return (
          <View key={c.id} style={styles.tableRow}>
            <Text style={[styles.td, styles.colNum, styles.tdMuted]}>{c.id}</Text>
            <Text style={[styles.td, styles.colCode, styles.tdStrong]}>{c.code}</Text>
            <Text style={[styles.td, styles.colTitle]} numberOfLines={1}>
              {c.title}
            </Text>
            <Text style={[styles.td, styles.colCredits, styles.tdCenter]}>{c.credits}</Text>
            <View style={styles.colGrade}>
              <View style={[styles.gradePill, {backgroundColor: g.soft}]}>
                <Text style={[styles.gradePillText, {color: g.color}]}>{c.grade}</Text>
              </View>
            </View>
            <Text style={[styles.td, styles.colPoints, styles.tdStrong, styles.tdRight]}>
              {c.points.toFixed(2)}
            </Text>
          </View>
        );
      })}

      {/* Summary strip */}
      <View style={styles.summaryStrip}>
        <View style={styles.summaryCell}>
          <Text style={styles.summaryLabel} numberOfLines={1}>
            Total Credits
          </Text>
          <Text style={styles.summaryValue} numberOfLines={1} adjustsFontSizeToFit>
            {resultsSummary.totalCredits}
          </Text>
        </View>
        <View style={styles.summaryCell}>
          <Text style={styles.summaryLabel} numberOfLines={1}>
            Total Points
          </Text>
          <Text style={styles.summaryValue} numberOfLines={1} adjustsFontSizeToFit>
            {resultsSummary.totalPoints.toFixed(2)}
          </Text>
        </View>
        <View style={[styles.summaryCell, styles.summaryCellDark]}>
          <Text style={styles.summaryLabelLight} numberOfLines={1}>
            Semester GPA
          </Text>
          <Text style={styles.summaryGpaText} numberOfLines={1} adjustsFontSizeToFit>
            <Text style={styles.summaryValueLight}>{resultsSummary.semesterGpa.toFixed(2)}</Text>
            <Text style={styles.summaryScaleLight}> / {resultsSummary.scale.toFixed(2)}</Text>
          </Text>
        </View>
      </View>

      <View style={styles.infoNote}>
        <MaterialCommunityIcons name="information-outline" size={14} color={colors.slate} />
        <Text style={styles.infoNoteText}>
          GPA and class are calculated based on completed semesters.
        </Text>
      </View>
    </SurfaceCard>
  );
}

/* ------------------------------------------------------------------ */
/* Donut chart                                                        */
/* ------------------------------------------------------------------ */
function Donut({
  segments,
  size = 130,
  strokeWidth = 18,
}: {
  segments: {value: number; color: string}[];
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  let offset = 0;
  return (
    <View style={{width: size, height: size}}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.line}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {segments.map((s, i) => {
          if (s.value <= 0) return null;
          const length = (s.value / total) * circumference;
          const dash = `${length} ${circumference - length}`;
          const el = (
            <Circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={s.color}
              strokeWidth={strokeWidth}
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              fill="none"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
          offset += length;
          return el;
        })}
      </Svg>
      <View style={styles.donutCenter}>
        <Text style={styles.donutValue}>{resultsSummary.cgpa.toFixed(2)}</Text>
        <Text style={styles.donutLabel}>CGPA</Text>
      </View>
    </View>
  );
}

const GRADE_BANDS = [
  {key: 'A', label: 'A (70 - 100)', color: colors.green},
  {key: 'B', label: 'B (60 - 69)', color: colors.orange},
  {key: 'C', label: 'C (50 - 59)', color: colors.orangeDark},
  {key: 'D', label: 'D (40 - 49)', color: colors.red},
  {key: 'F', label: 'F (0 - 39)', color: colors.ink},
];

export function PerformanceOverview() {
  // Derive the grade distribution from the actual course results.
  const counts = GRADE_BANDS.map(
    band => courseResults.filter(c => c.grade.startsWith(band.key)).length,
  );
  const segments = GRADE_BANDS.map((band, i) => ({value: counts[i], color: band.color}));

  return (
    <SurfaceCard style={styles.block}>
      <Text style={styles.perfTitle}>Performance Overview</Text>

      <View style={styles.performanceContent}>
        <View style={styles.performanceRows}>
          {GRADE_BANDS.map((band, i) => {
            const maxCount = Math.max(...counts, 1);
            return (
              <View key={band.key} style={styles.performanceRow}>
                <View style={[styles.gradeLetter, {backgroundColor: band.color}]}><Text style={styles.gradeLetterText}>{band.key}</Text></View>
                <View style={styles.performanceTrack}><View style={[styles.performanceFill, {backgroundColor: band.color, width: `${Math.max((counts[i] / maxCount) * 100, counts[i] ? 10 : 0)}%`}]} /></View>
                <Text style={styles.performanceCount}>{counts[i]}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.gpaSection}>
          <Text style={styles.gpaSectionLabel}>Current CGPA</Text>
          <Text style={styles.gpaSectionValue}>{resultsSummary.cgpa.toFixed(2)}</Text>
          <Text style={styles.gpaSectionScale}>/ {resultsSummary.scale.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.congrats}>
        <View style={styles.trophy}>
          <MaterialCommunityIcons name="trophy" size={22} color={colors.white} />
        </View>
        <Text style={styles.congratsTitle}>Great Job, {mockStudent.firstName}!</Text>
        <Text style={styles.congratsText}>
          You are doing excellent. Keep up the great work!
        </Text>
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  block: {marginBottom: 16},
  sectionBlock: {marginBottom: 20},

  /* Semester tabs */
  tabsRow: {gap: 10, paddingVertical: 4, paddingRight: 8, marginBottom: 16},
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
  },
  tabActive: {backgroundColor: colors.blue, borderColor: colors.blue},
  tabLabel: {fontSize: 12, fontWeight: '700', color: colors.ink},
  tabLabelActive: {color: colors.white},
  tabYear: {fontSize: 10, fontWeight: '600', color: colors.slate, marginTop: 2},
  tabYearActive: {color: 'rgba(255,255,255,0.85)'},

  /* Course results */
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  resultsTitle: {fontSize: 18, fontWeight: '800', color: colors.ink},
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.blueSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  downloadText: {fontSize: 12, fontWeight: '700', color: colors.blue},
  tableHead: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  th: {fontSize: 10, fontWeight: '700', color: colors.muted, textTransform: 'uppercase'},
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.panel,
  },
  td: {fontSize: 12, color: colors.slate},
  tdStrong: {fontWeight: '800', color: colors.ink},
  tdMuted: {color: colors.muted},
  tdCenter: {textAlign: 'center'},
  tdRight: {textAlign: 'right'},
  colNum: {width: 22},
  colCode: {width: 58},
  colTitle: {flex: 1, paddingRight: 6},
  colCredits: {width: 26},
  colGrade: {width: 44, alignItems: 'center'},
  colPoints: {width: 42},
  gradePill: {paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, minWidth: 34, alignItems: 'center'},
  gradePillText: {fontSize: 11, fontWeight: '800'},

  /* Summary strip */
  summaryStrip: {flexDirection: 'row', gap: 8, marginTop: 16},
  summaryCell: {flex: 1, backgroundColor: colors.panel, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 10},
  summaryCellDark: {backgroundColor: colors.navy},
  summaryLabel: {fontSize: 11, color: colors.slate, marginBottom: 6},
  summaryLabelLight: {fontSize: 11, color: 'rgba(255,255,255,0.8)', marginBottom: 6},
  summaryValue: {fontSize: 18, fontWeight: '800', color: colors.ink},
  summaryGpaText: {color: colors.white},
  summaryValueLight: {fontSize: 18, fontWeight: '800', color: colors.white},
  summaryScaleLight: {fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.8)'},
  infoNote: {flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14},
  infoNoteText: {flex: 1, fontSize: 11, color: colors.slate},

  /* Performance */
  perfTitle: {fontSize: 18, fontWeight: '800', color: colors.ink, marginBottom: 16},
  performanceContent: {gap: 20},
  performanceRows: {gap: 12},
  performanceRow: {flexDirection: 'row', alignItems: 'center', gap: 10},
  gradeLetter: {width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center'},
  gradeLetterText: {color: colors.white, fontSize: 12, fontWeight: '900'},
  performanceTrack: {flex: 1, height: 10, borderRadius: 999, backgroundColor: colors.panel, overflow: 'hidden'},
  performanceFill: {height: '100%', borderRadius: 999},
  performanceCount: {width: 22, textAlign: 'right', fontSize: 12, fontWeight: '800', color: colors.ink},
  gpaSection: {
    alignItems: 'center',
    backgroundColor: colors.blueSoft,
    borderRadius: 16,
    padding: 16,
  },
  gpaSectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.blue,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  gpaSectionValue: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.blue,
    lineHeight: 36,
  },
  gpaSectionScale: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.slate,
  },
  donutCenter: {...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center'},
  donutValue: {fontSize: 22, fontWeight: '800', color: colors.ink},
  donutLabel: {fontSize: 10, fontWeight: '700', color: colors.slate, marginTop: 2},
  legend: {flexGrow: 1, flexShrink: 1, minWidth: 170, gap: 10},
  legendRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  legendDot: {width: 10, height: 10, borderRadius: 5},
  legendLabel: {flex: 1, fontSize: 12, fontWeight: '600', color: colors.ink},
  legendCount: {fontSize: 11, fontWeight: '600', color: colors.slate},

  /* Congrats */
  congrats: {
    marginTop: 16,
    backgroundColor: colors.greenSoft,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  trophy: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  congratsTitle: {fontSize: 15, fontWeight: '800', color: colors.greenDark, marginBottom: 4},
  congratsText: {fontSize: 12, color: colors.slate, textAlign: 'center', lineHeight: 17},
});
