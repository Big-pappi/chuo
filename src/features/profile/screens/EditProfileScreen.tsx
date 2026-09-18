import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView, TextInput} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import {mockStudent} from '@/data/mock';
import Button from '@/components/Button';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    name: mockStudent.name,
    email: mockStudent.email,
    phone: mockStudent.phone,
    campus: mockStudent.campus,
  });

  const handleSave = () => {
    // Save logic here
    navigation.goBack();
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.ink} />
          </Pressable>
          <Text style={styles.title}>Edit Profile</Text>
          <Pressable style={styles.headerBtn} onPress={handleSave}>
            <Text style={styles.saveBtn}>Save</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={text => setFormData({...formData, name: text})}
                placeholder="Enter your full name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={text => setFormData({...formData, email: text})}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={text => setFormData({...formData, phone: text})}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Campus</Text>
              <TextInput
                style={styles.input}
                value={formData.campus}
                onChangeText={text => setFormData({...formData, campus: text})}
                placeholder="Enter your campus"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Academic Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Student ID</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={mockStudent.regNumber}
                editable={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Program</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={mockStudent.programme}
                editable={false}
              />
            </View>
          </View>
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
  saveBtn: {fontSize: 16, fontWeight: '700', color: colors.blue},
  content: {flex: 1},
  section: {marginBottom: 24},
  sectionTitle: {fontSize: 16, fontWeight: '800', color: colors.ink, marginBottom: 16},
  inputGroup: {marginBottom: 16},
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
  disabledInput: {
    backgroundColor: colors.panel,
    color: colors.muted,
  },
});
