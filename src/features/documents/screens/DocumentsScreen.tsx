import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {SurfaceCard, SectionHeader, IconTile, Pill} from '@/components/ui/Cards';
import {mockStudent} from '@/data/mock';

interface Document {
  id: string;
  name: string;
  type: 'certificate' | 'transcript' | 'id' | 'fee' | 'other';
  category: string;
  issuedDate: string;
  expiryDate?: string;
  size: string;
  status: 'verified' | 'pending' | 'expired';
  description: string;
}

const DocumentsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'academic' | 'administrative' | 'financial'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Student ID Card',
      type: 'id',
      category: 'administrative',
      issuedDate: '2024-01-15',
      expiryDate: '2025-01-15',
      size: '245 KB',
      status: 'verified',
      description: 'Official university identification card',
    },
    {
      id: '2',
      name: 'Academic Transcript - Year 1',
      type: 'transcript',
      category: 'academic',
      issuedDate: '2024-02-20',
      size: '1.2 MB',
      status: 'verified',
      description: 'Official academic transcript for first year courses',
    },
    {
      id: '3',
      name: 'Fee Clearance Certificate',
      type: 'fee',
      category: 'financial',
      issuedDate: '2024-03-10',
      size: '512 KB',
      status: 'verified',
      description: 'Certificate confirming all fees are paid',
    },
    {
      id: '4',
      name: 'Enrollment Certificate',
      type: 'certificate',
      category: 'academic',
      issuedDate: '2024-01-20',
      size: '340 KB',
      status: 'verified',
      description: 'Proof of current enrollment at the university',
    },
    {
      id: '5',
      name: 'Library Card',
      type: 'id',
      category: 'administrative',
      issuedDate: '2024-01-15',
      expiryDate: '2025-01-15',
      size: '180 KB',
      status: 'verified',
      description: 'Library access and borrowing card',
    },
    {
      id: '6',
      name: 'Scholarship Award Letter',
      type: 'certificate',
      category: 'financial',
      issuedDate: '2024-02-01',
      size: '890 KB',
      status: 'verified',
      description: 'Official scholarship award notification',
    },
    {
      id: '7',
      name: 'Internship Completion Certificate',
      type: 'certificate',
      category: 'academic',
      issuedDate: '2024-06-15',
      size: '1.5 MB',
      status: 'pending',
      description: 'Certificate for completed internship program',
    },
    {
      id: '8',
      name: 'Hostel Allocation Letter',
      type: 'other',
      category: 'administrative',
      issuedDate: '2024-01-10',
      size: '420 KB',
      status: 'verified',
      description: 'Official hostel room allocation document',
    },
  ]);

  const getTypeConfig = (type: Document['type']) => {
    switch (type) {
      case 'certificate':
        return {icon: 'certificate', color: colors.purple, soft: colors.purpleSoft};
      case 'transcript':
        return {icon: 'file-document', color: colors.blue, soft: colors.blueSoft};
      case 'id':
        return {icon: 'badge-account', color: colors.green, soft: colors.greenSoft};
      case 'fee':
        return {icon: 'receipt', color: colors.orange, soft: colors.orangeSoft};
      default:
        return {icon: 'file', color: colors.slate, soft: colors.panel};
    }
  };

  const getStatusConfig = (status: Document['status']) => {
    switch (status) {
      case 'verified':
        return {color: colors.green, soft: colors.greenSoft, label: 'Verified'};
      case 'pending':
        return {color: colors.orange, soft: colors.orangeSoft, label: 'Pending'};
      case 'expired':
        return {color: colors.red, soft: colors.redSoft, label: 'Expired'};
      default:
        return {color: colors.slate, soft: colors.panel, label: 'Unknown'};
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    {id: 'all', label: 'All Documents', icon: 'file-multiple'},
    {id: 'academic', label: 'Academic', icon: 'book-open-variant'},
    {id: 'administrative', label: 'Administrative', icon: 'account-settings'},
    {id: 'financial', label: 'Financial', icon: 'cash'},
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
  };

  const renderDocumentCard = (document: Document) => {
    const typeConfig = getTypeConfig(document.type);
    const statusConfig = getStatusConfig(document.status);

    return (
      <SurfaceCard key={document.id} style={styles.documentCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <IconTile
              icon={typeConfig.icon}
              color={typeConfig.color}
              soft={typeConfig.soft}
              size={52}
              iconSize={26}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.documentName}>{document.name}</Text>
              <Text style={styles.documentType}>{document.type.charAt(0).toUpperCase() + document.type.slice(1)}</Text>
              <Text style={styles.documentSize}>{document.size}</Text>
            </View>
          </View>
          <Pill label={statusConfig.label} color={statusConfig.color} soft={statusConfig.soft} />
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {document.description}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.footerItem}>
            <MaterialCommunityIcons name="calendar" size={14} color={colors.slate} />
            <Text style={styles.footerText}>Issued: {formatDate(document.issuedDate)}</Text>
          </View>
          {document.expiryDate && (
            <View style={styles.footerItem}>
              <MaterialCommunityIcons name="calendar-alert" size={14} color={colors.slate} />
              <Text style={styles.footerText}>Expires: {formatDate(document.expiryDate)}</Text>
            </View>
          )}
        </View>

        <View style={styles.cardActions}>
          <Pressable
            style={styles.actionButton}
            onPress={() => console.log('Preview document:', document.id)}>
            <MaterialCommunityIcons name="eye-outline" size={18} color={colors.blue} />
            <Text style={styles.actionButtonText}>Preview</Text>
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => console.log('Download document:', document.id)}>
            <MaterialCommunityIcons name="download-outline" size={18} color={colors.blue} />
            <Text style={styles.actionButtonText}>Download</Text>
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => console.log('Share document:', document.id)}>
            <MaterialCommunityIcons name="share-variant" size={18} color={colors.blue} />
            <Text style={styles.actionButtonText}>Share</Text>
          </Pressable>
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
            <Text style={styles.title}>My Documents</Text>
            <Pressable
              style={styles.headerBtn}
              hitSlop={8}
              onPress={() => console.log('Upload document')}>
              <MaterialCommunityIcons name="upload" size={22} color={colors.ink} />
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.scrollContent}>
          {/* Storage summary */}
          <SurfaceCard style={styles.storageCard}>
          <View style={styles.storageHeader}>
            <View style={styles.storageIcon}>
              <MaterialCommunityIcons name="cloud-outline" size={28} color={colors.blue} />
            </View>
            <View style={styles.storageInfo}>
              <Text style={styles.storageLabel}>Document Storage</Text>
              <Text style={styles.storageUsed}>4.8 MB of 50 MB used</Text>
            </View>
          </View>
          <View style={styles.storageBar}>
            <View style={[styles.storageFill, {width: '9.6%'}]} />
          </View>
        </SurfaceCard>

        {/* Category filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}>
          {categories.map(category => {
            const isActive = selectedCategory === category.id;
            const count = documents.filter(d => category.id === 'all' ? true : d.category === category.id).length;
            return (
              <Pressable
                key={category.id}
                style={[styles.categoryTab, isActive && styles.activeCategoryTab]}
                onPress={() => setSelectedCategory(category.id as any)}>
                <MaterialCommunityIcons 
                  name={category.icon as any} 
                  size={20} 
                  color={isActive ? colors.blue : colors.slate} 
                />
                <Text style={[styles.categoryTabText, isActive && styles.activeCategoryTabText]}>
                  {category.label}
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

        {/* Search bar */}
        <Pressable style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.slate} />
          <Text style={styles.searchPlaceholder}>Search documents...</Text>
        </Pressable>

        {/* Documents list */}
        <View style={styles.content}>
          <SectionHeader
            title={`${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Documents`}
            actionLabel={filteredDocuments.length > 0 ? `${filteredDocuments.length} files` : undefined}
          />
          {filteredDocuments.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="file-search-outline" size={64} color={colors.muted} />
              <Text style={styles.emptyText}>No documents found</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery ? 'Try a different search term' : 'No documents in this category'}
              </Text>
            </View>
          ) : (
            filteredDocuments.map(renderDocumentCard)
          )}
        </View>

        {/* Quick actions */}
        <SurfaceCard style={styles.quickActionsCard}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <Pressable style={styles.quickActionItem} onPress={() => console.log('Request document')}>
              <View style={styles.quickActionIcon}>
                <MaterialCommunityIcons name="file-plus" size={24} color={colors.blue} />
              </View>
              <Text style={styles.quickActionText}>Request</Text>
            </Pressable>
            <Pressable style={styles.quickActionItem} onPress={() => console.log('Upload document')}>
              <View style={styles.quickActionIcon}>
                <MaterialCommunityIcons name="cloud-upload" size={24} color={colors.green} />
              </View>
              <Text style={styles.quickActionText}>Upload</Text>
            </Pressable>
            <Pressable style={styles.quickActionItem} onPress={() => console.log('Verify documents')}>
              <View style={styles.quickActionIcon}>
                <MaterialCommunityIcons name="check-decagram" size={24} color={colors.purple} />
              </View>
              <Text style={styles.quickActionText}>Verify</Text>
            </Pressable>
            <Pressable style={styles.quickActionItem} onPress={() => console.log('Document help')}>
              <View style={styles.quickActionIcon}>
                <MaterialCommunityIcons name="help-circle" size={24} color={colors.orange} />
              </View>
              <Text style={styles.quickActionText}>Help</Text>
            </Pressable>
          </View>
        </SurfaceCard>
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

  /* Storage Card */
  storageCard: {
    marginBottom: 16,
  },
  storageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  storageIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  storageInfo: {
    flex: 1,
  },
  storageLabel: {
    fontSize: 14,
    color: colors.slate,
    marginBottom: 4,
  },
  storageUsed: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
  },
  storageBar: {
    height: 6,
    backgroundColor: colors.panel,
    borderRadius: 3,
    overflow: 'hidden',
  },
  storageFill: {
    height: '100%',
    backgroundColor: colors.blue,
    borderRadius: 3,
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
  },
  activeCategoryTab: {
    backgroundColor: colors.blueSoft,
    borderColor: colors.blue,
  },
  categoryTabText: {
    fontSize: 13,
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
    borderRadius: 10,
    minWidth: 18,
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.line,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: colors.slate,
  },
  content: {marginBottom: 16},
  documentCard: {
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
  documentName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 4,
  },
  documentType: {
    fontSize: 12,
    color: colors.slate,
    marginBottom: 2,
  },
  documentSize: {
    fontSize: 11,
    color: colors.muted,
  },
  description: {
    fontSize: 14,
    color: colors.slate,
    lineHeight: 20,
    marginBottom: 12,
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
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.panel,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
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
  quickActionsCard: {
    marginBottom: 20,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.slate,
  },
});

export default DocumentsScreen;