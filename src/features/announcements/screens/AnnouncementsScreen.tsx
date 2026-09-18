import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView, Image} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {SurfaceCard, SectionHeader, IconTile, Pill} from '@/components/ui/Cards';
import {mockStudent} from '@/data/mock';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'academic' | 'event' | 'emergency' | 'exam';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  author: string;
  authorRole: string;
  publishedDate: string;
  expiryDate?: string;
  likes: number;
  views: number;
  attachments?: number;
  image?: string;
  tags: string[];
}

const AnnouncementsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [selectedType, setSelectedType] = useState<'all' | 'general' | 'academic' | 'event' | 'exam'>('all');
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const [announcements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Semester Examination Schedule Released',
      content: 'The examination schedule for the upcoming semester has been released. Please check your student portal for detailed timing and venue information. Make sure to bring your student ID card.',
      type: 'exam',
      priority: 'high',
      author: 'Examination Office',
      authorRole: 'Academic Office',
      publishedDate: '2024-08-05',
      expiryDate: '2024-08-20',
      likes: 234,
      views: 1520,
      attachments: 2,
      tags: ['exams', 'schedule', 'important'],
    },
    {
      id: '2',
      title: 'University Career Fair 2024',
      content: 'Join us for the annual University Career Fair featuring over 50 top employers. Network with industry professionals, explore job opportunities, and attend career workshops.',
      type: 'event',
      priority: 'medium',
      author: 'Career Services',
      authorRole: 'Student Services',
      publishedDate: '2024-08-04',
      expiryDate: '2024-08-25',
      likes: 189,
      views: 890,
      attachments: 1,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      tags: ['career', 'event', 'opportunity'],
    },
    {
      id: '3',
      title: 'Library Maintenance Notice',
      content: 'The main library will undergo maintenance from August 10-12. During this period, limited services will be available. Students are advised to plan their study accordingly.',
      type: 'general',
      priority: 'medium',
      author: 'Library Administration',
      authorRole: 'Administrative',
      publishedDate: '2024-08-03',
      expiryDate: '2024-08-12',
      likes: 56,
      views: 423,
      tags: ['library', 'maintenance'],
    },
    {
      id: '4',
      title: 'New Scholarship Opportunities',
      content: 'Several new scholarship opportunities are now available for deserving students. Applications are open until August 30. Visit the financial aid office for more information.',
      type: 'academic',
      priority: 'high',
      author: 'Financial Aid Office',
      authorRole: 'Financial Services',
      publishedDate: '2024-08-02',
      expiryDate: '2024-08-30',
      likes: 312,
      views: 2100,
      attachments: 3,
      tags: ['scholarship', 'financial', 'opportunity'],
    },
    {
      id: '5',
      title: 'Campus Wi-Fi Upgrade',
      content: 'IT Services will be upgrading the campus Wi-Fi network over the weekend. Expect intermittent connectivity on August 8-9. The upgrade will improve internet speed and coverage.',
      type: 'general',
      priority: 'low',
      author: 'IT Services',
      authorRole: 'Technical Services',
      publishedDate: '2024-08-01',
      expiryDate: '2024-08-10',
      likes: 45,
      views: 320,
      tags: ['it', 'wifi', 'upgrade'],
    },
    {
      id: '6',
      title: 'Research Symposium Call for Papers',
      content: 'The Annual Research Symposium is accepting paper submissions. This is a great opportunity to present your research to faculty and peers. Deadline for submission is August 25.',
      type: 'academic',
      priority: 'medium',
      author: 'Research Office',
      authorRole: 'Academic Office',
      publishedDate: '2024-07-30',
      expiryDate: '2024-08-25',
      likes: 78,
      views: 540,
      attachments: 1,
      tags: ['research', 'symposium', 'academic'],
    },
  ]);

  const getTypeConfig = (type: Announcement['type']) => {
    switch (type) {
      case 'general':
        return {icon: 'bullhorn', color: colors.blue, soft: colors.blueSoft, label: 'General'};
      case 'academic':
        return {icon: 'school', color: colors.purple, soft: colors.purpleSoft, label: 'Academic'};
      case 'event':
        return {icon: 'calendar-star', color: colors.green, soft: colors.greenSoft, label: 'Event'};
      case 'emergency':
        return {icon: 'alert-circle', color: colors.red, soft: colors.redSoft, label: 'Emergency'};
      case 'exam':
        return {icon: 'file-document-edit', color: colors.orange, soft: colors.orangeSoft, label: 'Exam'};
      default:
        return {icon: 'information', color: colors.slate, soft: colors.panel, label: 'Info'};
    }
  };

  const getPriorityConfig = (priority: Announcement['priority']) => {
    switch (priority) {
      case 'urgent':
        return {color: colors.red, soft: colors.redSoft, label: 'Urgent'};
      case 'high':
        return {color: colors.orange, soft: colors.orangeSoft, label: 'High'};
      case 'medium':
        return {color: colors.blue, soft: colors.blueSoft, label: 'Medium'};
      case 'low':
        return {color: colors.slate, soft: colors.panel, label: 'Low'};
      default:
        return {color: colors.slate, soft: colors.panel, label: 'Unknown'};
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesType = selectedType === 'all' || announcement.type === selectedType;
    const matchesPriority = selectedPriority === 'all' || announcement.priority === selectedPriority;
    return matchesType && matchesPriority;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
  };

  const renderAnnouncementCard = (announcement: Announcement) => {
    const typeConfig = getTypeConfig(announcement.type);
    const priorityConfig = getPriorityConfig(announcement.priority);

    return (
      <SurfaceCard key={announcement.id} style={styles.announcementCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <IconTile
              icon={typeConfig.icon}
              color={typeConfig.color}
              soft={typeConfig.soft}
              size={44}
              iconSize={22}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.announcementTitle}>{announcement.title}</Text>
              <Text style={styles.announcementMeta}>
                {typeConfig.label} • {formatDate(announcement.publishedDate)}
              </Text>
            </View>
          </View>
          <Pill label={priorityConfig.label} color={priorityConfig.color} soft={priorityConfig.soft} />
        </View>

        {announcement.image && (
          <Image source={{uri: announcement.image}} style={styles.announcementImage} />
        )}

        <Text style={styles.announcementContent} numberOfLines={3}>
          {announcement.content}
        </Text>

        {announcement.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {announcement.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.cardFooter}>
          <View style={styles.footerItem}>
            <MaterialCommunityIcons name="account-outline" size={14} color={colors.slate} />
            <Text style={styles.footerText}>{announcement.author}</Text>
          </View>
          <View style={styles.footerItem}>
            <MaterialCommunityIcons name="eye-outline" size={14} color={colors.slate} />
            <Text style={styles.footerText}>{announcement.views}</Text>
          </View>
          <View style={styles.footerItem}>
            <MaterialCommunityIcons name="heart-outline" size={14} color={colors.slate} />
            <Text style={styles.footerText}>{announcement.likes}</Text>
          </View>
          {announcement.attachments && announcement.attachments > 0 && (
            <View style={styles.footerItem}>
              <MaterialCommunityIcons name="attachment" size={14} color={colors.slate} />
              <Text style={styles.footerText}>{announcement.attachments}</Text>
            </View>
          )}
        </View>

        <Pressable
          style={styles.readMoreButton}
          onPress={() => console.log('Read full announcement:', announcement.id)}>
          <Text style={styles.readMoreText}>Read More</Text>
          <MaterialCommunityIcons name="chevron-right" size={18} color={colors.blue} />
        </Pressable>
      </SurfaceCard>
    );
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
              onPress={() => navigation.canGoBack() && navigation.goBack()}>
              <MaterialCommunityIcons name="arrow-left" size={22} color={colors.ink} />
            </Pressable>
            <Text style={styles.title}>Announcements</Text>
            <Pressable
              style={styles.headerBtn}
              hitSlop={8}
              onPress={() => console.log('Filter settings')}>
              <MaterialCommunityIcons name="filter-variant" size={22} color={colors.ink} />
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.scrollContent}>
          {/* Stats summary */}
          <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{announcements.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, {color: colors.orange}]}>
              {announcements.filter(a => a.priority === 'high' || a.priority === 'urgent').length}
            </Text>
            <Text style={styles.statLabel}>Important</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, {color: colors.green}]}>
              {announcements.filter(a => new Date(a.expiryDate || a.publishedDate) >= new Date()).length}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
        </View>

        {/* Type filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.typeScroll}
          contentContainerStyle={styles.typeContent}>
          {(['all', 'general', 'academic', 'event', 'exam'] as const).map(type => {
            const isActive = selectedType === type;
            const typeConfig = getTypeConfig(type === 'all' ? 'general' : type);
            const count = type === 'all' ? announcements.length : announcements.filter(a => a.type === type).length;
            return (
              <Pressable
                key={type}
                style={[styles.typeTab, isActive && styles.activeTypeTab]}
                onPress={() => setSelectedType(type)}>
                <MaterialCommunityIcons 
                  name={typeConfig.icon as any} 
                  size={18} 
                  color={isActive ? colors.blue : colors.slate} 
                />
                <Text style={[styles.typeTabText, isActive && styles.activeTypeTabText]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
                {count > 0 && (
                  <View style={[styles.typeBadge, isActive && styles.activeTypeBadge]}>
                    <Text style={[styles.typeBadgeText, isActive && styles.activeTypeBadgeText]}>
                      {count}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Priority filter */}
        <View style={styles.priorityFilter}>
          {(['all', 'high', 'medium', 'low'] as const).map(priority => {
            const isActive = selectedPriority === priority;
            return (
              <Pressable
                key={priority}
                style={[styles.priorityTab, isActive && styles.activePriorityTab]}
                onPress={() => setSelectedPriority(priority)}>
                <Text style={[styles.priorityTabText, isActive && styles.activePriorityTabText]}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Announcements list */}
        <View style={styles.content}>
          <SectionHeader
            title="Latest Announcements"
            actionLabel={filteredAnnouncements.length > 0 ? `${filteredAnnouncements.length} items` : undefined}
          />
          {filteredAnnouncements.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="phone-off" size={64} color={colors.muted} />
              <Text style={styles.emptyText}>No announcements found</Text>
              <Text style={styles.emptySubtext}>
                {selectedType !== 'all' || selectedPriority !== 'all' 
                  ? 'Try different filters' 
                  : 'No announcements at the moment'}
              </Text>
            </View>
          ) : (
            filteredAnnouncements.map(renderAnnouncementCard)
          )}
        </View>
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

  /* Scroll Content */
  scrollContent: {paddingHorizontal: 16, paddingTop: 100, paddingBottom: 20},

  /* Stats Container */
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
  typeScroll: {
    marginBottom: 16,
  },
  typeContent: {
    gap: 8,
    paddingRight: 8,
  },
  typeTab: {
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
  activeTypeTab: {
    backgroundColor: colors.blueSoft,
    borderColor: colors.blue,
  },
  typeTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.slate,
  },
  activeTypeTabText: {
    color: colors.blue,
  },
  typeBadge: {
    backgroundColor: colors.panel,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 16,
    alignItems: 'center',
  },
  activeTypeBadge: {
    backgroundColor: colors.blue,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.slate,
  },
  activeTypeBadgeText: {
    color: colors.white,
  },
  priorityFilter: {
    flexDirection: 'row',
    backgroundColor: colors.panel,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  priorityTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  activePriorityTab: {
    backgroundColor: colors.white,
    shadowColor: '#0B2A6B',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  priorityTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.slate,
  },
  activePriorityTabText: {
    color: colors.blue,
  },
  content: {marginBottom: 20},
  announcementCard: {
    marginBottom: 16,
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
  headerInfo: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 4,
  },
  announcementMeta: {
    fontSize: 12,
    color: colors.slate,
  },
  announcementImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
  },
  announcementContent: {
    fontSize: 14,
    color: colors.slate,
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: colors.panel,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.slate,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: colors.slate,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blueSoft,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  readMoreText: {
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
});

export default AnnouncementsScreen;