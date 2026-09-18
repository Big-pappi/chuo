import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView, TextInput, Alert} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {SurfaceCard} from '@/components/ui/Cards';

export default function ContactUsScreen() {
  const navigation = useNavigation();
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
        <View style={styles.header}>
          <Pressable style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.ink} />
          </Pressable>
          <Text style={styles.title}>Contact Us</Text>
          <View style={styles.headerBtn} />
        </View>

        <ScrollView style={styles.content}>
          <SurfaceCard style={styles.infoCard}>
            <Text style={styles.infoTitle}>We're here to help</Text>
            <Text style={styles.infoText}>
              Have questions or need assistance? Reach out to our support team and we'll get back to you as soon as possible.
            </Text>
          </SurfaceCard>

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
              placeholder="What is this about?"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.message}
              onChangeText={text => setFormData({...formData, message: text})}
              placeholder="Tell us more..."
              multiline
              numberOfLines={4}
            />
          </View>

          <Pressable style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>Send Message</Text>
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
  infoCard: {
    marginBottom: 24,
    padding: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: colors.slate,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 12,
    marginTop: 8,
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
    fontWeight: '600',
    color: colors.slate,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.slate,
    marginBottom: 8,
  },
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
  submitBtn: {
    backgroundColor: colors.blue,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
});
