import React from 'react';
import {View, Text, StyleSheet, ImageBackground, Pressable, ScrollView} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import Svg, {Circle} from 'react-native-svg';
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
/* Results hero card                                                  */
/* ------------------------------------------------------------------ */
export function ResultsHero() {
  return (
    <ImageBackground
      source={{uri: mockUniversity.image}}
      style={styles.hero}
      imageStyle={styles.heroImage}
      resizeMode="cover">
      <View style={styles.heroOverlay} />

      {/* University identity */}
      <View style={styles.heroTopRow}>
        {/* Crest badge — swap the icon for the university logo image when provided */}
        <View style={styles.heroLogo}>
          <MaterialCommunityIcons name="school" size={20} color={colors.blue} />
        </View>
        <View style={styles.heroUniRow}>
          <Text style={styles.heroUni} numberOfLines={1}>
            {mockUniversity.name}
          </Text>
          {mockUniversity.verified ? (
            <MaterialCommunityIcons name="check-decagram" size={14} color="#6EE7B7" />
          ) : null}
        </View>
      </View>

      <View style={styles.heroBody}>
        <View style={styles.heroLeft}>
          <Text style={styles.heroSub}>
            {mockStudent.universityShort}  •  {mockStudent.campus}
          </Text>
          <Text style={styles.heroProgram} numberOfLines={2}>
            {mockStudent.programme}
          </Text>
          <Text style={styles.heroMeta}>
            Year {mockStudent.year}  •  Semester {mockStudent.semester} ({mockStudent.academicYear})
          </Text>
          <View style={styles.standingPill}>
            <View style={styles.standingDot} />
            <Text style={styles.standingText}>{mockStudent.standing}</Text>
          </View>
        </View>

        <View style={styles.heroDivider} />

        <View style={styles.heroRight}>
          <Text style={styles.heroLabel}>CGPA (Current)</Text>
          <View style={styles.cgpaRow}>
            <Text style={styles.cgpaValue}>{resultsSummary.cgpa.toFixed(2)}</Text>
            <Text style={styles.cgpaScale}>/ {resultsSummary.scale.toFixed(2)}</Text>
          </View>
          <Text style={styles.heroLabel}>Class</Text>
          <Text style={styles.classText}>{resultsSummary.class}</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

/* ------------------------------------------------------------------ */
/* Stats row                                                          */
/* ------------------------------------------------------------------ */
const STATS = [
  {label: 'Courses Taken', value: String(resultsSummary.coursesTaken), icon: 'clipboard-text', color: colors.blue, soft: colors.blueSoft},
  {label: 'A Grades', value: String(resultsSummary.aGrades), icon: 'star-circle', color: colors.green, soft: colors.greenSoft},
  {label: 'B Grades', value: String(resultsSummary.bGrades), icon: 'medal', color: colors.orange, soft: colors.orangeSoft},
  {label: 'Pass Rate', value: resultsSummary.passRate, icon: 'chart-line', color: colors.sky, soft: colors.blueSoft},
];

export function ResultsStats() {
  return (
    <View style={styles.statsGrid}>
      {STATS.map(s => (
        <View key={s.label} style={styles.statCard}>
          <IconTile icon={s.icon} color={s.color} soft={s.soft} size={44} iconSize={22} />
          <View style={styles.statText}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel} numberOfLines={1}>
              {s.label}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

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

      <View style={styles.perfBody}>
        <Donut segments={segments} />

        <View style={styles.legend}>
          {GRADE_BANDS.map((band, i) => (
            <View key={band.key} style={styles.legendRow}>
              <View style={[styles.legendDot, {backgroundColor: band.color}]} />
              <Text style={styles.legendLabel}>{band.label}</Text>
              <Text style={styles.legendCount}>{counts[i]} Courses</Text>
            </View>
          ))}
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

  /* Hero */
  hero: {borderRadius: 22, padding: 18, marginBottom: 16, overflow: 'hidden'},
  heroImage: {borderRadius: 22},
  heroOverlay: {...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(11,42,107,0.62)'},
  heroTopRow: {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14},
  heroLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  heroUniRow: {flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6},
  heroUni: {flexShrink: 1, color: colors.white, fontSize: 15, fontWeight: '800'},
  heroBody: {flexDirection: 'row', alignItems: 'stretch'},
  heroLeft: {flex: 1, paddingRight: 14},
  heroSub: {color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '600', marginBottom: 6},
  heroProgram: {color: colors.white, fontSize: 17, fontWeight: '800', lineHeight: 22},
  heroMeta: {color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '600', marginTop: 3, marginBottom: 10},
  standingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  standingDot: {width: 7, height: 7, borderRadius: 4, backgroundColor: '#6EE7B7'},
  standingText: {color: colors.white, fontSize: 11, fontWeight: '700'},
  heroDivider: {width: 1, alignSelf: 'stretch', backgroundColor: 'rgba(255,255,255,0.22)'},
  heroRight: {width: 118, paddingLeft: 14, justifyContent: 'center'},
  heroLabel: {color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: '600', marginBottom: 3},
  cgpaRow: {flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginBottom: 10},
  cgpaValue: {color: colors.white, fontSize: 28, fontWeight: '800', lineHeight: 30},
  cgpaScale: {color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600', marginBottom: 3},
  classText: {color: '#6EE7B7', fontSize: 14, fontWeight: '800'},

  /* Stats */
  statsGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16},
  statCard: {
    width: '47.8%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
  },
  statText: {flex: 1},
  statValue: {fontSize: 22, fontWeight: '800', color: colors.ink, lineHeight: 26},
  statLabel: {fontSize: 12, fontWeight: '600', color: colors.slate, marginTop: 2},

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
  perfBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 16,
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
