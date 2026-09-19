import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView, TextInput, Alert, Image} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {SurfaceCard} from '@/components/ui/Cards';
import Button from '@/components/Button';
import {mockStudent} from '@/data/mock';

export default function ContactUsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = () => {
    Alert.alert('Message Sent', 'Thank you for contacting us. We will get back to you soon.');
    navigation.goBack();
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
            <Text style={styles.title}>Contact Us</Text>
            <Pressable style={styles.headerBtn} hitSlop={8}>
              <Image source={mockStudent.avatar} style={styles.avatar} />
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="headset" size={24} color={colors.blue} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>We're here to help</Text>
              <Text style={styles.infoText}>
                Have questions or need assistance? Reach out to our support team.
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Contact Information</Text>

          <SurfaceCard style={styles.contactCard}>
            <View style={styles.contactRow}>
              <View style={styles.contactIcon}>
                <MaterialCommunityIcons name="email" size={20} color={colors.blue} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>support@chuoapp.ac.tz</Text>
              </View>
            </View>
          </SurfaceCard>

          <SurfaceCard style={styles.contactCard}>
            <View style={styles.contactRow}>
              <View style={styles.contactIcon}>
                <MaterialCommunityIcons name="phone" size={20} color={colors.green} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>+255 123 456 789</Text>
              </View>
            </View>
          </SurfaceCard>

          <SurfaceCard style={styles.contactCard}>
            <View style={styles.contactRow}>
              <View style={styles.contactIcon}>
                <MaterialCommunityIcons name="map-marker" size={20} color={colors.red} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Address</Text>
                <Text style={styles.contactValue}>University Campus, Dar es Salaam</Text>
              </View>
            </View>
          </SurfaceCard>

          <Text style={styles.sectionTitle}>Send us a message</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={text => setFormData({...formData, name: text})}
              placeholder="Your name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={text => setFormData({...formData, email: text})}
              placeholder="Your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Subject</Text>
            <TextInput
              style={styles.input}
              value={formData.subject}
              onChangeText={text => setFormData({...formData, subject: text})}
              placeholder="Message subject"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.message}
              onChangeText={text => setFormData({...formData, message: text})}
              placeholder="Your message"
              multiline
              numberOfLines={4}
            />
          </View>

          <Button title="Send Message" onPress={handleSubmit} style={styles.sendButton} />
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
    marginBottom: 24,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 16,
  },
  contactCard: {
    marginBottom: 12,
    padding: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: colors.slate,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  inputGroup: {marginBottom: 20},
  label: {fontSize: 14, fontWeight: '600', color: colors.slate, marginBottom: 8},
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.ink,
    borderWidth: 1,
    borderColor: colors.line,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  sendButton: {
    marginTop: 8,
  },
});
