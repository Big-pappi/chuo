import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView, TextInput} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import Button from '@/components/Button';

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSave = () => {
    // Password change logic here
    navigation.goBack();
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.ink} />
          </Pressable>
          <Text style={styles.title}>Change Password</Text>
          <Pressable style={styles.headerBtn} onPress={handleSave}>
            <Text style={styles.saveBtn}>Save</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={formData.currentPassword}
                  onChangeText={text => setFormData({...formData, currentPassword: text})}
                  placeholder="Enter current password"
                  secureTextEntry={!showPassword.current}
                />
                <Pressable
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword({...showPassword, current: !showPassword.current})}>
                  <MaterialCommunityIcons
                    name={showPassword.current ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.slate}
                  />
                </Pressable>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={formData.newPassword}
                  onChangeText={text => setFormData({...formData, newPassword: text})}
                  placeholder="Enter new password"
                  secureTextEntry={!showPassword.new}
                />
                <Pressable
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword({...showPassword, new: !showPassword.new})}>
                  <MaterialCommunityIcons
                    name={showPassword.new ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.slate}
                  />
                </Pressable>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm New Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={formData.confirmPassword}
                  onChangeText={text => setFormData({...formData, confirmPassword: text})}
                  placeholder="Confirm new password"
                  secureTextEntry={!showPassword.confirm}
                />
                <Pressable
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword({...showPassword, confirm: !showPassword.confirm})}>
                  <MaterialCommunityIcons
                    name={showPassword.confirm ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.slate}
                  />
                </Pressable>
              </View>
            </View>

            <View style={styles.tips}>
              <Text style={styles.tipsTitle}>Password Requirements:</Text>
              <Text style={styles.tip}>• At least 8 characters</Text>
              <Text style={styles.tip}>• Include uppercase and lowercase letters</Text>
              <Text style={styles.tip}>• Include at least one number</Text>
              <Text style={styles.tip}>• Include at least one special character</Text>
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
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 48,
    fontSize: 15,
    color: colors.ink,
    borderWidth: 1,
    borderColor: colors.line,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 14,
  },
  tips: {
    backgroundColor: colors.panel,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 8,
  },
  tip: {
    fontSize: 13,
    color: colors.slate,
    marginBottom: 4,
  },
});
