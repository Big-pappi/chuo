import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView, TextInput, Image} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Screen from '@/components/ui/Screen';
import {colors} from '@/theme';
import Button from '@/components/Button';
import {mockStudent} from '@/data/mock';

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
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
        {/* Fixed Header */}
        <View style={[styles.fixedHeader, {paddingTop: insets.top}]}>
          <View style={styles.header}>
            <Pressable
              style={styles.headerBtn}
              hitSlop={8}
              onPress={() => navigation.canGoBack() && navigation.goBack()}>
              <MaterialCommunityIcons name="arrow-left" size={22} color={colors.ink} />
            </Pressable>
            <Text style={styles.title}>Change Password</Text>
            <Pressable style={styles.headerBtn} hitSlop={8} onPress={handleSave}>
              <Image source={mockStudent.avatar} style={styles.avatar} />
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
          <Text style={styles.sectionTitle}>Change Password</Text>
          
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
              <Text style={styles.tipsTitle}>Password Requirements</Text>
              <View style={styles.tipRow}>
                <MaterialCommunityIcons name="circle-outline" size={14} color={colors.slate} />
                <Text style={styles.tip}>At least 8 characters</Text>
              </View>
              <View style={styles.tipRow}>
                <MaterialCommunityIcons name="circle-outline" size={14} color={colors.slate} />
                <Text style={styles.tip}>Include uppercase and lowercase letters</Text>
              </View>
              <View style={styles.tipRow}>
                <MaterialCommunityIcons name="circle-outline" size={14} color={colors.slate} />
                <Text style={styles.tip}>Include at least one number</Text>
              </View>
              <View style={styles.tipRow}>
                <MaterialCommunityIcons name="circle-outline" size={14} color={colors.slate} />
                <Text style={styles.tip}>Include at least one special character</Text>
              </View>
            </View>

            <Button title="Update Password" onPress={handleSave} style={styles.saveButton} />
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
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 24,
  },
  inputGroup: {marginBottom: 20},
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
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.line,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 12,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tip: {
    fontSize: 13,
    color: colors.slate,
  },
  saveButton: {
    marginTop: 8,
  },
});
