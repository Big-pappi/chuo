import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView, TextInput, Image} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {SurfaceCard} from '@/components/ui/Cards';
import {mockStudent} from '@/data/mock';

const helpTopics = [
  {id: '1', title: 'Account & Login', icon: 'account-circle', color: colors.blue},
  {id: '2', title: 'Academic Records', icon: 'school', color: colors.green},
  {id: '3', title: 'Fees & Payments', icon: 'credit-card', color: colors.orange},
  {id: '4', title: 'Timetable', icon: 'calendar', color: colors.purple},
  {id: '5', title: 'Library', icon: 'book', color: colors.red},
  {id: '6', title: 'Technical Issues', icon: 'wrench', color: colors.slate},
];

const faqs = [
  {
    id: '1',
    question: 'How do I reset my password?',
    answer: 'Go to Profile > Security > Change Password. You will need to enter your current password to set a new one.',
  },
  {
    id: '2',
    question: 'Where can I view my grades?',
    answer: 'Navigate to the Results section from the dashboard to view your academic performance and GPA.',
  },
  {
    id: '3',
    question: 'How do I update my profile information?',
    answer: 'Go to Profile > Personal Information and tap on the edit icon to update your details.',
  },
];

export default function HelpCenterScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqs, setExpandedFaqs] = useState<Record<string, boolean>>({});

  const toggleFaq = (id: string) => {
    setExpandedFaqs({...expandedFaqs, [id]: !expandedFaqs[id]});
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
            <Text style={styles.title}>Help Center</Text>
            <Pressable style={styles.headerBtn} hitSlop={8}>
              <Image source={mockStudent.avatar} style={styles.avatar} />
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="help-circle" size={24} color={colors.blue} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Need Help?</Text>
              <Text style={styles.infoText}>
                Search for answers or browse our help topics
              </Text>
            </View>
          </View>

          <View style={styles.searchWrapper}>
            <MaterialCommunityIcons name="magnify" size={20} color={colors.slate} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for help..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <Text style={styles.sectionTitle}>Help Topics</Text>

          <View style={styles.topicsGrid}>
            {helpTopics.map(topic => (
              <Pressable key={topic.id} style={styles.topicCard}>
                <View style={[styles.topicIcon, {backgroundColor: `${topic.color}20`}]}>
                  <MaterialCommunityIcons name={topic.icon as any} size={24} color={topic.color} />
                </View>
                <Text style={styles.topicTitle}>{topic.title}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

          {faqs.map(faq => (
            <SurfaceCard key={faq.id} style={styles.faqCard}>
              <Pressable style={styles.faqHeader} onPress={() => toggleFaq(faq.id)}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <MaterialCommunityIcons
                  name={expandedFaqs[faq.id] ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.slate}
                />
              </Pressable>
              {expandedFaqs[faq.id] && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </SurfaceCard>
          ))}

          <Pressable style={styles.contactCard}>
            <MaterialCommunityIcons name="headset" size={22} color={colors.blue} />
            <View style={styles.contactText}>
              <Text style={styles.contactTitle}>Contact Support</Text>
              <Text style={styles.contactSubtitle}>Get help from our team</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.slate} />
          </Pressable>
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: colors.bg,
  },
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
  scrollContent: {flex: 1},
  scrollContentContainer: {paddingHorizontal: 16, paddingTop: 100, paddingBottom: 20},
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.blueSoft,
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.blue,
  },
  infoContent: {flex: 1, marginLeft: 12},
  infoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.blue,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: colors.blue,
    lineHeight: 18,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.line,
  },
  searchIcon: {marginRight: 12},
  searchInput: {flex: 1, fontSize: 14, color: colors.ink},
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 16,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  topicCard: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
  },
  topicIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  topicTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
  },
  faqCard: {
    marginBottom: 12,
    padding: 16,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
    marginRight: 12,
  },
  faqAnswer: {
    fontSize: 13,
    color: colors.slate,
    lineHeight: 18,
    marginTop: 12,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.line,
  },
  contactText: {
    flex: 1,
    marginLeft: 12,
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 12,
    color: colors.slate,
  },
});
