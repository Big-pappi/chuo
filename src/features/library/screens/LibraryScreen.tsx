import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView, Image} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {SurfaceCard, SectionHeader, IconTile, Pill} from '@/components/ui/Cards';
import {mockStudent} from '@/data/mock';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  cover?: string;
  dueDate?: string;
  borrowedDate: string;
  status: 'borrowed' | 'returned' | 'overdue' | 'reserved';
  renewalCount: number;
  maxRenewals: number;
  fine?: number;
}

interface DigitalResource {
  id: string;
  title: string;
  type: 'ebook' | 'journal' | 'research' | 'database';
  category: string;
  accessUrl: string;
  description: string;
}

const LibraryScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'borrowed' | 'digital' | 'history' | 'search'>('borrowed');

  const [borrowedBooks] = useState<Book[]>([
    {
      id: '1',
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      isbn: '978-0262033848',
      category: 'Computer Science',
      cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200',
      dueDate: '2026-10-15',
      borrowedDate: '2026-09-15',
      status: 'borrowed',
      renewalCount: 1,
      maxRenewals: 2,
    },
    {
      id: '2',
      title: 'Database System Concepts',
      author: 'Abraham Silberschatz',
      isbn: '978-0078022159',
      category: 'Computer Science',
      cover: 'https://images.unsplash.com/photo-1555252333-9f8e92e65dfc?w=200',
      dueDate: '2026-10-10',
      borrowedDate: '2026-09-10',
      status: 'borrowed',
      renewalCount: 0,
      maxRenewals: 2,
    },
    {
      id: '3',
      title: 'Artificial Intelligence: A Modern Approach',
      author: 'Stuart Russell',
      isbn: '978-0134610993',
      category: 'Artificial Intelligence',
      dueDate: '2026-09-01',
      borrowedDate: '2026-08-01',
      status: 'overdue',
      renewalCount: 2,
      maxRenewals: 2,
      fine: 5.00,
    },
  ]);

  const [digitalResources] = useState<DigitalResource[]>([
    {
      id: '1',
      title: 'IEEE Xplore Digital Library',
      type: 'database',
      category: 'Research',
      accessUrl: 'https://ieeexplore.ieee.org',
      description: 'Access to technical literature in engineering and technology',
    },
    {
      id: '2',
      title: 'ScienceDirect',
      type: 'database',
      category: 'Research',
      accessUrl: 'https://www.sciencedirect.com',
      description: 'Full-text scientific database with articles from over 2,500 journals',
    },
    {
      id: '3',
      title: 'Springer eBooks',
      type: 'ebook',
      category: 'E-Books',
      accessUrl: 'https://link.springer.com',
      description: 'Collection of over 200,000 eBooks across various disciplines',
    },
    {
      id: '4',
      title: 'JSTOR',
      type: 'journal',
      category: 'Journals',
      accessUrl: 'https://www.jstor.org',
      description: 'Digital library of academic journals, books, and primary sources',
    },
  ]);

  const [readingHistory] = useState<Book[]>([
    {
      id: '4',
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      author: 'Robert C. Martin',
      isbn: '978-0132350884',
      category: 'Software Engineering',
      borrowedDate: '2024-06-01',
      status: 'returned',
      renewalCount: 1,
      maxRenewals: 2,
    },
    {
      id: '5',
      title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
      author: 'Erich Gamma',
      isbn: '978-0201633610',
      category: 'Software Engineering',
      borrowedDate: '2024-05-15',
      status: 'returned',
      renewalCount: 0,
      maxRenewals: 2,
    },
  ]);

  const getStatusConfig = (status: Book['status']) => {
    switch (status) {
      case 'borrowed':
        return {color: colors.green, soft: colors.greenSoft, label: 'Borrowed', icon: 'book-check'};
      case 'returned':
        return {color: colors.blue, soft: colors.blueSoft, label: 'Returned', icon: 'book-variant'};
      case 'overdue':
        return {color: colors.red, soft: colors.redSoft, label: 'Overdue', icon: 'alert-circle'};
      case 'reserved':
        return {color: colors.orange, soft: colors.orangeSoft, label: 'Reserved', icon: 'clock'};
      default:
        return {color: colors.slate, soft: colors.panel, label: 'Unknown', icon: 'help'};
    }
  };

  const getResourceTypeConfig = (type: DigitalResource['type']) => {
    switch (type) {
      case 'ebook':
        return {icon: 'book-open-page-variant', color: colors.purple, soft: colors.purpleSoft, label: 'E-Book'};
      case 'journal':
        return {icon: 'newspaper', color: colors.blue, soft: colors.blueSoft, label: 'Journal'};
      case 'research':
        return {icon: 'microscope', color: colors.green, soft: colors.greenSoft, label: 'Research'};
      case 'database':
        return {icon: 'database', color: colors.orange, soft: colors.orangeSoft, label: 'Database'};
      default:
        return {icon: 'file', color: colors.slate, soft: colors.panel, label: 'Resource'};
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
  };

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderBorrowedBook = (book: Book) => {
    const statusConfig = getStatusConfig(book.status);
    const daysRemaining = book.dueDate ? getDaysRemaining(book.dueDate) : 0;

    return (
      <SurfaceCard key={book.id} style={styles.bookCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            {book.cover ? (
              <Image source={{uri: book.cover}} style={styles.bookCover} />
            ) : (
              <View style={[styles.bookCoverPlaceholder, {backgroundColor: colors.panel}]}>
                <MaterialCommunityIcons name="book" size={32} color={colors.slate} />
              </View>
            )}
            <View style={styles.headerInfo}>
              <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
              <Text style={styles.bookAuthor}>{book.author}</Text>
              <Text style={styles.bookIsbn}>ISBN: {book.isbn}</Text>
            </View>
          </View>
          <Pill label={statusConfig.label} color={statusConfig.color} soft={statusConfig.soft} />
        </View>

        <View style={styles.bookDetails}>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="calendar" size={14} color={colors.slate} />
            <Text style={styles.detailText}>Borrowed: {formatDate(book.borrowedDate)}</Text>
          </View>
          {book.dueDate && (
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="calendar-alert" size={14} color={colors.slate} />
              <Text style={styles.detailText}>Due: {formatDate(book.dueDate)}</Text>
            </View>
          )}
        </View>

        {book.status === 'borrowed' && (
          <View style={[styles.daysBadge, {backgroundColor: daysRemaining <= 3 ? colors.redSoft : colors.greenSoft}]}>
            <MaterialCommunityIcons 
              name={daysRemaining <= 3 ? "alert" : "check-circle"} 
              size={16} 
              color={daysRemaining <= 3 ? colors.red : colors.green} 
            />
            <Text style={[styles.daysText, {color: daysRemaining <= 3 ? colors.red : colors.green}]}>
              {daysRemaining > 0 ? `${daysRemaining} days remaining` : daysRemaining === 0 ? 'Due today' : 'Overdue'}
            </Text>
          </View>
        )}

        {book.fine && book.fine > 0 && (
          <View style={styles.fineBadge}>
            <MaterialCommunityIcons name="cash" size={16} color={colors.red} />
            <Text style={styles.fineText}>Fine: TZS {book.fine.toFixed(2)}</Text>
          </View>
        )}

        <View style={styles.renewalInfo}>
          <Text style={styles.renewalText}>
            Renewals: {book.renewalCount}/{book.maxRenewals}
          </Text>
        </View>

        <View style={styles.cardActions}>
          {book.status === 'borrowed' && book.renewalCount < book.maxRenewals && (
            <Pressable
              style={styles.actionButton}
              onPress={() => console.log('Renew book:', book.id)}>
              <MaterialCommunityIcons name="refresh" size={18} color={colors.blue} />
              <Text style={styles.actionButtonText}>Renew</Text>
            </Pressable>
          )}
          <Pressable
            style={styles.actionButton}
            onPress={() => console.log('Return book:', book.id)}>
            <MaterialCommunityIcons name="book-variant" size={18} color={colors.blue} />
            <Text style={styles.actionButtonText}>Return</Text>
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => console.log('Book details:', book.id)}>
            <MaterialCommunityIcons name="information" size={18} color={colors.blue} />
            <Text style={styles.actionButtonText}>Details</Text>
          </Pressable>
        </View>
      </SurfaceCard>
    );
  };

  const renderDigitalResource = (resource: DigitalResource) => {
    const typeConfig = getResourceTypeConfig(resource.type);

    return (
      <SurfaceCard key={resource.id} style={styles.resourceCard}>
        <View style={styles.resourceHeader}>
          <IconTile
            icon={typeConfig.icon}
            color={typeConfig.color}
            soft={typeConfig.soft}
            size={48}
            iconSize={24}
          />
          <View style={styles.resourceInfo}>
            <Text style={styles.resourceTitle}>{resource.title}</Text>
            <Pill label={typeConfig.label} color={typeConfig.color} soft={typeConfig.soft} />
          </View>
        </View>

        <Text style={styles.resourceDescription} numberOfLines={2}>
          {resource.description}
        </Text>

        <View style={styles.resourceMeta}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="tag" size={14} color={colors.slate} />
            <Text style={styles.metaText}>{resource.category}</Text>
          </View>
        </View>

        <Pressable
          style={styles.accessButton}
          onPress={() => console.log('Access resource:', resource.id)}>
          <Text style={styles.accessButtonText}>Access Resource</Text>
          <MaterialCommunityIcons name="arrow-right" size={18} color={colors.blue} />
        </Pressable>
      </SurfaceCard>
    );
  };

  const renderHistoryItem = (book: Book) => {
    const statusConfig = getStatusConfig(book.status);

    return (
      <SurfaceCard key={book.id} style={styles.historyCard}>
        <View style={styles.historyHeader}>
          <View style={styles.historyLeft}>
            <IconTile
              icon="book"
              color={colors.blue}
              soft={colors.blueSoft}
              size={40}
              iconSize={20}
            />
            <View style={styles.historyInfo}>
              <Text style={styles.historyTitle} numberOfLines={1}>{book.title}</Text>
              <Text style={styles.historyAuthor}>{book.author}</Text>
            </View>
          </View>
          <Pill label={statusConfig.label} color={statusConfig.color} soft={statusConfig.soft} />
        </View>

        <View style={styles.historyDetails}>
          <View style={styles.historyDetailItem}>
            <MaterialCommunityIcons name="calendar" size={12} color={colors.slate} />
            <Text style={styles.historyDetailText}>Borrowed: {formatDate(book.borrowedDate)}</Text>
          </View>
          <View style={styles.historyDetailItem}>
            <MaterialCommunityIcons name="refresh" size={12} color={colors.slate} />
            <Text style={styles.historyDetailText}>Renewed: {book.renewalCount} time(s)</Text>
          </View>
        </View>
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
            <Text style={styles.title}>Library</Text>
            <Pressable
              style={styles.headerBtn}
              hitSlop={8}
              onPress={() => navigation.navigate('Profile')}>
              <Image source={mockStudent.avatar} style={styles.avatar} />
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
          {/* Tab navigation - Horizontal scrolling like announcements */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.tabScroll}
            contentContainerStyle={styles.tabContent}>
            {(['borrowed', 'digital', 'history', 'search'] as const).map(tab => {
              const isActive = activeTab === tab;
              const icon = tab === 'borrowed' ? 'book' : 
                           tab === 'digital' ? 'cloud' : 
                           tab === 'history' ? 'clock-time-three' : 'magnify';
              const count = tab === 'borrowed' ? borrowedBooks.length :
                           tab === 'digital' ? digitalResources.length :
                           tab === 'history' ? readingHistory.length : 0;
              return (
                <Pressable
                  key={tab}
                  style={[styles.tab, isActive && styles.activeTab]}
                  onPress={() => setActiveTab(tab)}>
                  <MaterialCommunityIcons 
                    name={icon as any} 
                    size={18} 
                    color={isActive ? colors.blue : colors.slate} 
                  />
                  <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                  {count > 0 && (
                    <View style={[styles.tabBadge, isActive && styles.activeTabBadge]}>
                      <Text style={[styles.tabBadgeText, isActive && styles.activeTabBadgeText]}>
                        {count}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Content based on active tab */}
          <View style={styles.content}>
            {activeTab === 'borrowed' && (
              <>
                <SectionHeader
                  title="Borrowed Books"
                  actionLabel={`${borrowedBooks.length} items`}
                />
                {borrowedBooks.length === 0 ? (
                  <View style={styles.emptyState}>
                    <MaterialCommunityIcons name="book-off" size={64} color={colors.muted} />
                    <Text style={styles.emptyText}>No borrowed books</Text>
                    <Text style={styles.emptySubtext}>Visit the library to borrow books</Text>
                  </View>
                ) : (
                  borrowedBooks.map(renderBorrowedBook)
                )}
              </>
            )}

            {activeTab === 'digital' && (
              <>
                <SectionHeader
                  title="Digital Resources"
                  actionLabel={`${digitalResources.length} available`}
                />
                <View style={styles.resourceGrid}>
                  {digitalResources.map(renderDigitalResource)}
                </View>
              </>
            )}

            {activeTab === 'history' && (
              <>
                <SectionHeader
                  title="Reading History"
                  actionLabel={`${readingHistory.length} items`}
                />
                {readingHistory.length === 0 ? (
                  <View style={styles.emptyState}>
                    <MaterialCommunityIcons name="history" size={64} color={colors.muted} />
                    <Text style={styles.emptyText}>No reading history</Text>
                    <Text style={styles.emptySubtext}>Your borrowed books will appear here</Text>
                  </View>
                ) : (
                  readingHistory.map(renderHistoryItem)
                )}
              </>
            )}

            {activeTab === 'search' && (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="book-search" size={64} color={colors.muted} />
                <Text style={styles.emptyText}>Catalog Search</Text>
                <Text style={styles.emptySubtext}>Search library catalog coming soon</Text>
              </View>
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
    gap: 12,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    color: colors.ink,
  },

  /* Scroll Content */
  scrollContent: {flex: 1},
  scrollContentContainer: {paddingHorizontal: 16, paddingTop: 100, paddingBottom: 20},

  /* Header Buttons */
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
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.panel,
  },

  /* Tab Container - Horizontal scrolling like announcements */
  tabScroll: {
    marginBottom: 20,
  },
  tabContent: {
    gap: 8,
    paddingRight: 8,
  },
  tab: {
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
  activeTab: {
    backgroundColor: colors.blueSoft,
    borderColor: colors.blue,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.slate,
  },
  activeTabText: {
    color: colors.blue,
  },
  tabBadge: {
    backgroundColor: colors.panel,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 16,
    alignItems: 'center',
  },
  activeTabBadge: {
    backgroundColor: colors.blue,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.slate,
  },
  activeTabBadgeText: {
    color: colors.white,
  },
  content: {marginBottom: 16},
  bookCard: {
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
  bookCover: {
    width: 60,
    height: 80,
    borderRadius: 8,
  },
  bookCoverPlaceholder: {
    width: 60,
    height: 80,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 13,
    color: colors.slate,
    marginBottom: 2,
  },
  bookIsbn: {
    fontSize: 11,
    color: colors.muted,
  },
  bookDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: colors.slate,
  },
  daysBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  daysText: {
    fontSize: 13,
    fontWeight: '700',
  },
  fineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.redSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  fineText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.red,
  },
  renewalInfo: {
    marginBottom: 12,
  },
  renewalText: {
    fontSize: 12,
    color: colors.slate,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.panel,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.blue,
  },
  resourceGrid: {
    gap: 12,
  },
  resourceCard: {
    marginBottom: 12,
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resourceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  resourceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 6,
  },
  resourceDescription: {
    fontSize: 13,
    color: colors.slate,
    lineHeight: 18,
    marginBottom: 12,
  },
  resourceMeta: {
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.slate,
  },
  accessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blueSoft,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  accessButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.blue,
  },
  historyCard: {
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 2,
  },
  historyAuthor: {
    fontSize: 12,
    color: colors.slate,
  },
  historyDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  historyDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  historyDetailText: {
    fontSize: 11,
    color: colors.slate,
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

export default LibraryScreen;