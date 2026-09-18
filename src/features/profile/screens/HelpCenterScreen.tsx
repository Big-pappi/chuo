import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView, TextInput} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {SurfaceCard} from '@/components/ui/Cards';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqs, setExpandedFaqs] = useState<Record<string, boolean>>({});

  const toggleFaq = (id: string) => {
    setExpandedFaqs({...expandedFaqs, [id]: !expandedFaqs[id]});
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.ink} />
          </Pressable>
          <Text style={styles.title}>Help Center</Text>
          <View style={styles.headerBtn} />
        </View>

        <ScrollView style={styles.content}>
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
            <MaterialCommunityIcons name="headset" size={24} color={colors.blue} />
            <View style={styles.contactText}>
              <Text style={styles.contactTitle}>Still need help?</Text>
              <Text style={styles.contactSubtitle}>Contact our support team</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.slate} />
          </Pressable>
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: 16, paddingTop: 8},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '800', color: colors.ink},
  content: {flex: 1},
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.line,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.ink,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 12,
    marginTop: 8,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  topicCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginRight: '4%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  topicIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
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
    marginTop: 12,
    lineHeight: 18,
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
