import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {SurfaceCard, SectionHeader, IconTile, Pill} from '@/components/ui/Cards';
import {mockStudent} from '@/data/mock';

interface Notice {
  id: string;
  noticeNumber: string;
  title: string;
  content: string;
  category: 'administrative' | 'academic' | 'examination' | 'disciplinary' | 'general';
  priority: 'normal' | 'important' | 'urgent';
  department: string;
  issuedDate: string;
  effectiveDate?: string;
  referenceNumber?: string;
  attachments?: number;
  isRead: boolean;
}

const NoticesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'administrative' | 'academic' | 'examination' | 'disciplinary'>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const [notices] = useState<Notice[]>([
    {
      id: '1',
      noticeNumber: 'NOT-2024-042',
      title: 'Change in Academic Calendar - Semester 2',
      content: 'Due to unforeseen circumstances, the academic calendar for Semester 2 has been revised. The new semester will commence on August 20, 2024, instead of August 15. All students are advised to update their schedules accordingly.',
      category: 'academic',
      priority: 'urgent',
      department: 'Academic Affairs',
      issuedDate: '2024-08-05',
      effectiveDate: '2024-08-06',
      referenceNumber: 'AA/2024/08/001',
      attachments: 1,
      isRead: false,
    },
    {
      id: '2',
      noticeNumber: 'NOT-2024-041',
      title: 'Fee Payment Deadline Extension',
      content: 'The deadline for fee payment for Semester 2 has been extended to August 25, 2024. Students who have not cleared their fees are requested to make payments before the new deadline to avoid late payment penalties.',
      category: 'administrative',
      priority: 'important',
      department: 'Finance Department',
      issuedDate: '2024-08-04',
      effectiveDate: '2024-08-04',
      referenceNumber: 'FD/2024/08/003',
      isRead: false,
    },
    {
      id: '3',
      noticeNumber: 'NOT-2024-040',
      title: 'Examination Hall Seating Arrangement',
      content: 'The seating arrangement for the upcoming semester examinations has been published. Students can check their assigned seats and examination venues through the student portal using their registration numbers.',
      category: 'examination',
      priority: 'important',
      department: 'Examination Office',
      issuedDate: '2024-08-03',
      effectiveDate: '2024-08-03',
      referenceNumber: 'EO/2024/08/002',
      attachments: 2,
      isRead: true,
    },
    {
      id: '4',
      noticeNumber: 'NOT-2024-039',
      title: 'Library Book Return Policy Update',
      content: 'The library has updated its book return policy. The maximum borrowing period for reference books has been reduced from 7 days to 3 days. Students are requested to adhere to the new policy to avoid fines.',
      category: 'administrative',
      priority: 'normal',
      department: 'Library Services',
      issuedDate: '2024-08-02',
      effectiveDate: '2024-08-15',
      referenceNumber: 'LS/2024/08/001',
      isRead: true,
    },
    {
      id: '5',
      noticeNumber: 'NOT-2024-038',
      title: 'Attendance Requirement Clarification',
      content: 'This is to clarify that the minimum attendance requirement for appearing in final examinations is 75%, not 80% as previously communicated. This applies to all undergraduate programs for the current academic year.',
      category: 'academic',
      priority: 'important',
      department: 'Academic Affairs',
      issuedDate: '2024-08-01',
      effectiveDate: '2024-08-01',
      referenceNumber: 'AA/2024/07/015',
      isRead: false,
    },
    {
      id: '6',
      noticeNumber: 'NOT-2024-037',
      title: 'Campus Parking Regulations',
      content: 'New parking regulations will be effective from August 10, 2024. All students with vehicles must register their vehicles with the security office and obtain valid parking permits. Unauthorized parking will result in penalties.',
      category: 'administrative',
      priority: 'normal',
      department: 'Security Office',
      issuedDate: '2024-07-30',
      effectiveDate: '2024-08-10',
      referenceNumber: 'SO/2024/07/008',
      isRead: true,
    },
    {
      id: '7',
      noticeNumber: 'NOT-2024-036',
      title: ' disciplinary Notice - Code of Conduct',
      content: 'All students are reminded to adhere to the university code of conduct. Any violation of academic integrity, including plagiarism and cheating in examinations, will result in strict disciplinary action as per university regulations.',
      category: 'disciplinary',
      priority: 'important',
      department: 'Student Affairs',
      issuedDate: '2024-07-28',
      effectiveDate: '2024-07-28',
      referenceNumber: 'SA/2024/07/005',
      isRead: true,
    },
  ]);

  const getCategoryConfig = (category: Notice['category']) => {
    switch (category) {
      case 'administrative':
        return {icon: 'office-building', color: colors.blue, soft: colors.blueSoft, label: 'Administrative'};
      case 'academic':
        return {icon: 'book-open-variant', color: colors.purple, soft: colors.purpleSoft, label: 'Academic'};
      case 'examination':
        return {icon: 'file-document-edit', color: colors.orange, soft: colors.orangeSoft, label: 'Examination'};
      case 'disciplinary':
        return {icon: 'gavel', color: colors.red, soft: colors.redSoft, label: 'Disciplinary'};
      case 'general':
        return {icon: 'information', color: colors.green, soft: colors.greenSoft, label: 'General'};
      default:
        return {icon: 'file', color: colors.slate, soft: colors.panel, label: 'Unknown'};
    }
  };

  const getPriorityConfig = (priority: Notice['priority']) => {
    switch (priority) {
      case 'urgent':
        return {color: colors.red, soft: colors.redSoft, label: 'Urgent', icon: 'alert-circle'};
      case 'important':
        return {color: colors.orange, soft: colors.orangeSoft, label: 'Important', icon: 'alert'};
      case 'normal':
        return {color: colors.slate, soft: colors.panel, label: 'Normal', icon: 'information-outline'};
      default:
        return {color: colors.slate, soft: colors.panel, label: 'Normal', icon: 'information-outline'};
    }
  };

  const filteredNotices = notices.filter(notice => {
    const matchesCategory = selectedCategory === 'all' || notice.category === selectedCategory;
    const matchesReadStatus = !showUnreadOnly || !notice.isRead;
    return matchesCategory && matchesReadStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
  };

  const renderNoticeCard = (notice: Notice) => {
    const categoryConfig = getCategoryConfig(notice.category);
    const priorityConfig = getPriorityConfig(notice.priority);

    return (
      <SurfaceCard key={notice.id} style={[styles.noticeCard, !notice.isRead && styles.unreadNotice]}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.noticeNumberBadge}>
              <Text style={styles.noticeNumber}>{notice.noticeNumber}</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.noticeTitle}>{notice.title}</Text>
              <Text style={styles.noticeMeta}>
                {categoryConfig.label} • {formatDate(notice.issuedDate)}
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <MaterialCommunityIcons 
              name={priorityConfig.icon as any} 
              size={20} 
              color={priorityConfig.color} 
            />
            {!notice.isRead && <View style={styles.unreadDot} />}
          </View>
        </View>

        <Text style={styles.noticeContent} numberOfLines={3}>
          {notice.content}
        </Text>

        <View style={styles.noticeDetails}>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="domain" size={14} color={colors.slate} />
            <Text style={styles.detailText}>{notice.department}</Text>
          </View>
          {notice.referenceNumber && (
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="pound" size={14} color={colors.slate} />
              <Text style={styles.detailText}>{notice.referenceNumber}</Text>
            </View>
          )}
          {notice.effectiveDate && (
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="calendar-check" size={14} color={colors.slate} />
              <Text style={styles.detailText}>Effective: {formatDate(notice.effectiveDate)}</Text>
            </View>
          )}
        </View>

        {notice.attachments && notice.attachments > 0 && (
          <View style={styles.attachmentsSection}>
            <MaterialCommunityIcons name="attachment" size={14} color={colors.blue} />
            <Text style={styles.attachmentsText}>{notice.attachments} attachment(s)</Text>
          </View>
        )}

        <Pressable
          style={styles.viewButton}
          onPress={() => console.log('View full notice:', notice.id)}>
          <Text style={styles.viewButtonText}>View Official Notice</Text>
          <MaterialCommunityIcons name="chevron-right" size={18} color={colors.blue} />
        </Pressable>
      </SurfaceCard>
    );
  };

  return (
    <Screen>
      <View style={styles.container}>
        {/* Screen header */}
        <View style={styles.header}>
          <Pressable
            style={styles.headerBtn}
            hitSlop={8}
            onPress={() => navigation.canGoBack() && navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.ink} />
          </Pressable>
          <Text style={styles.title}>Official Notices</Text>
          <Pressable
            style={styles.headerBtn}
            hitSlop={8}
            onPress={() => console.log('Archive')}>
            <MaterialCommunityIcons name="archive" size={22} color={colors.ink} />
          </Pressable>
        </View>

        {/* Stats summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{notices.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, {color: colors.blue}]}>
              {notices.filter(n => !n.isRead).length}
            </Text>
            <Text style={styles.statLabel}>Unread</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, {color: colors.red}]}>
              {notices.filter(n => n.priority === 'urgent').length}
            </Text>
            <Text style={styles.statLabel}>Urgent</Text>
          </View>
        </View>

        {/* Unread filter toggle */}
        <Pressable
          style={[styles.unreadToggle, showUnreadOnly && styles.unreadToggleActive]}
          onPress={() => setShowUnreadOnly(!showUnreadOnly)}>
          <MaterialCommunityIcons 
            name={showUnreadOnly ? "email-open" : "email"} 
            size={18} 
            color={showUnreadOnly ? colors.blue : colors.slate} 
          />
          <Text style={[styles.unreadToggleText, showUnreadOnly && styles.unreadToggleTextActive]}>
            {showUnreadOnly ? 'Showing Unread Only' : 'Show Unread Only'}
          </Text>
          {notices.filter(n => !n.isRead).length > 0 && (
            <View style={styles.unreadCountBadge}>
              <Text style={styles.unreadCountText}>{notices.filter(n => !n.isRead).length}</Text>
            </View>
          )}
        </Pressable>

        {/* Category filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}>
          {(['all', 'administrative', 'academic', 'examination', 'disciplinary'] as const).map(category => {
            const isActive = selectedCategory === category;
            const categoryConfig = getCategoryConfig(category === 'all' ? 'administrative' : category);
            const count = category === 'all' ? notices.length : notices.filter(n => n.category === category).length;
            return (
              <Pressable
                key={category}
                style={[styles.categoryTab, isActive && styles.activeCategoryTab]}
                onPress={() => setSelectedCategory(category)}>
                <MaterialCommunityIcons 
                  name={categoryConfig.icon as any} 
                  size={18} 
                  color={isActive ? colors.blue : colors.slate} 
                />
                <Text style={[styles.categoryTabText, isActive && styles.activeCategoryTabText]}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
                {count > 0 && (
                  <View style={[styles.categoryBadge, isActive && styles.activeCategoryBadge]}>
                    <Text style={[styles.categoryBadgeText, isActive && styles.activeCategoryBadgeText]}>
                      {count}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Notices list */}
        <View style={styles.content}>
          <SectionHeader
            title={`${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Notices`}
            actionLabel={filteredNotices.length > 0 ? `${filteredNotices.length} items` : undefined}
          />
          {filteredNotices.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="clipboard-text-outline" size={64} color={colors.muted} />
              <Text style={styles.emptyText}>No notices found</Text>
              <Text style={styles.emptySubtext}>
                {showUnreadOnly 
                  ? 'No unread notices in this category' 
                  : selectedCategory !== 'all' 
                  ? 'No notices in this category' 
                  : 'No notices available'}
              </Text>
            </View>
          ) : (
            filteredNotices.map(renderNoticeCard)
          )}
        </View>

        {/* Notice disclaimer */}
        <SurfaceCard style={styles.disclaimerCard}>
          <View style={styles.disclaimerHeader}>
            <MaterialCommunityIcons name="information-outline" size={18} color={colors.blue} />
            <Text style={styles.disclaimerTitle}>Important Information</Text>
          </View>
          <Text style={styles.disclaimerText}>
            Official notices are legally binding communications from the university. Students are responsible for reading and complying with all notices. Ignorance of published notices is not accepted as a valid excuse.
          </Text>
        </SurfaceCard>
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
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#0B2A6B',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    elevation: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.blue,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.slate,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.line,
  },
  unreadToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  unreadToggleActive: {
    backgroundColor: colors.blueSoft,
    borderColor: colors.blue,
  },
  unreadToggleText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.slate,
  },
  unreadToggleTextActive: {
    color: colors.blue,
  },
  unreadCountBadge: {
    backgroundColor: colors.blue,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryContent: {
    gap: 8,
    paddingRight: 8,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
  },
  activeCategoryTab: {
    backgroundColor: colors.blueSoft,
    borderColor: colors.blue,
  },
  categoryTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.slate,
  },
  activeCategoryTabText: {
    color: colors.blue,
  },
  categoryBadge: {
    backgroundColor: colors.panel,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 16,
    alignItems: 'center',
  },
  activeCategoryBadge: {
    backgroundColor: colors.blue,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.slate,
  },
  activeCategoryBadgeText: {
    color: colors.white,
  },
  content: {marginBottom: 16},
  noticeCard: {
    marginBottom: 16,
  },
  unreadNotice: {
    borderLeftWidth: 4,
    borderLeftColor: colors.blue,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  noticeNumberBadge: {
    backgroundColor: colors.panel,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  noticeNumber: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.slate,
  },
  headerInfo: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 4,
  },
  noticeMeta: {
    fontSize: 12,
    color: colors.slate,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.blue,
  },
  noticeContent: {
    fontSize: 14,
    color: colors.slate,
    lineHeight: 20,
    marginBottom: 12,
  },
  noticeDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 11,
    color: colors.slate,
  },
  attachmentsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  attachmentsText: {
    fontSize: 12,
    color: colors.blue,
    fontWeight: '600',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blueSoft,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.blue,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.slate,
    marginTop: 4,
  },
  disclaimerCard: {
    marginBottom: 20,
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
  },
  disclaimerText: {
    fontSize: 12,
    color: colors.slate,
    lineHeight: 16,
  },
});

export default NoticesScreen;