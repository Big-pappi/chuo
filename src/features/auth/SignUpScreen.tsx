import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-paper';
import {colors, spacing, typography} from '@/theme';
import Button from '@/components/Button';
import Input from '@/components/Input';
import authService from '@/features/auth/services/authService';
import * as SecureStore from 'expo-secure-store';
import {Ionicons} from '@expo/vector-icons';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

interface University {
  id: number;
  name: string;
  code: string;
  type: string;
  city: string;
  country: string;
}

type SignupStep = 'verify' | 'verify_code' | 'set_password' | 'success';

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState<SignupStep>('verify');
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loadingUniversities, setLoadingUniversities] = useState(true);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmEntry, setSecureConfirmEntry] = useState(true);
  const [showUniversityModal, setShowUniversityModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      setLoadingUniversities(true);
      const data = await authService.getUniversities();
      console.log('Universities data:', data);
      setUniversities(data);
      if (data.length === 0) {
        Alert.alert('No Universities', 'No universities found. Please contact support.');
      }
    } catch (error) {
      console.error('Failed to fetch universities:', error);
      Alert.alert('Error', 'Failed to load universities. Please check your connection.');
    } finally {
      setLoadingUniversities(false);
    }
  };

  const filteredUniversities = universities.filter(uni =>
    uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    uni.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVerifyStudent = async () => {
    if (!selectedUniversity || !registrationNumber) {
      Alert.alert('Error', 'Please select a university and enter your registration number');
      return;
    }

    try {
      setLoading(true);
      const result = await authService.verifyStudent({
        university: selectedUniversity.code,
        registration_number: registrationNumber,
      });

      if (result.student_exists) {
        // Store university and reg number locally
        await SecureStore.setItemAsync('signup_university', selectedUniversity.code);
        await SecureStore.setItemAsync('signup_university_name', selectedUniversity.name);
        await SecureStore.setItemAsync('signup_reg_number', registrationNumber);

        // Send verification code
        await authService.sendVerificationCode({
          university: selectedUniversity.code,
          registration_number: registrationNumber,
        });

        Alert.alert(
          'Verification Code Sent',
          'A 6-digit code has been sent to your email. It will expire in 15 minutes.',
        );
        setStep('verify_code');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Verification failed';
      Alert.alert('Verification Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit verification code');
      return;
    }

    try {
      setLoading(true);
      const universityCode = await SecureStore.getItemAsync('signup_university');
      const regNumber = await SecureStore.getItemAsync('signup_reg_number');

      if (!universityCode || !regNumber) {
        Alert.alert('Error', 'Session expired. Please start over.');
        setStep('verify');
        return;
      }

      setStep('set_password');
    } catch (error: any) {
      console.error('Code verification error:', error);
      Alert.alert('Invalid Code', 'The verification code you entered is invalid or has expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSignup = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please enter and confirm your password');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    try {
      setLoading(true);
      const universityCode = await SecureStore.getItemAsync('signup_university');
      const regNumber = await SecureStore.getItemAsync('signup_reg_number');

      if (!universityCode || !regNumber) {
        Alert.alert('Error', 'Session expired. Please start over.');
        setStep('verify');
        return;
      }

      await authService.completeSignup({
        university: universityCode,
        registration_number: regNumber,
        verification_code: verificationCode,
        password: password,
      });

      // Clear signup data
      await SecureStore.deleteItemAsync('signup_university');
      await SecureStore.deleteItemAsync('signup_university_name');
      await SecureStore.deleteItemAsync('signup_reg_number');

      setStep('success');
    } catch (error: any) {
      console.error('Signup completion error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Signup failed';
      Alert.alert('Signup Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login' as never);
  };

  const renderUniversityModal = () => (
    <Modal
      visible={showUniversityModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowUniversityModal(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select University</Text>
            <TouchableOpacity onPress={() => setShowUniversityModal(false)}>
              <Ionicons name="close" size={24} color={colors.ink} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.slate} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search university..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              mode="flat"
              underlineColor="transparent"
              dense
            />
          </View>

          <ScrollView style={styles.universityList} showsVerticalScrollIndicator={false}>
            {filteredUniversities.map((uni) => (
              <TouchableOpacity
                key={uni.id}
                style={[
                  styles.universityItem,
                  selectedUniversity?.id === uni.id && styles.universityItemSelected,
                ]}
                onPress={() => {
                  setSelectedUniversity(uni);
                  setShowUniversityModal(false);
                }}>
                <View style={styles.universityInfo}>
                  <Text style={styles.universityName}>{uni.name}</Text>
                  <Text style={styles.universityCode}>{uni.code}</Text>
                  <Text style={styles.universityLocation}>{uni.city}, {uni.country}</Text>
                </View>
                {selectedUniversity?.id === uni.id && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.blue} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderVerifyStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Verify Your Student Status</Text>
      <Text style={styles.stepSubtitle}>
        Enter your university and registration number to verify your student status
      </Text>

      {loadingUniversities ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.blue} />
          <Text style={styles.loadingText}>Loading universities...</Text>
        </View>
      ) : (
        <>
          <TouchableOpacity
            style={styles.universitySelector}
            onPress={() => setShowUniversityModal(true)}
            activeOpacity={0.7}>
            <View style={styles.universitySelectorContent}>
              <Ionicons name="school" size={24} color={colors.blue} />
              <View style={styles.universitySelectorText}>
                <Text style={styles.universitySelectorLabel}>University</Text>
                <Text style={styles.universitySelectorValue}>
                  {selectedUniversity ? selectedUniversity.name : 'Select your university'}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.slate} />
          </TouchableOpacity>

          <Input
            label="Registration Number"
            value={registrationNumber}
            onChangeText={setRegistrationNumber}
            autoCapitalize="characters"
            error={!!registrationNumber && registrationNumber.length < 5}
            helperText={registrationNumber && registrationNumber.length < 5 ? 'Invalid registration number' : ''}
            left={<TextInput.Icon icon="card-account-details" />}
            style={styles.input}
            disabled={loading}
          />

          <Button
            mode="contained"
            onPress={handleVerifyStudent}
            loading={loading}
            disabled={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}>
            Verify Student
          </Button>
        </>
      )}
    </View>
  );

  const renderVerifyCodeStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <Ionicons name="mail" size={48} color={colors.blue} />
      </View>
      <Text style={styles.stepTitle}>Enter Verification Code</Text>
      <Text style={styles.stepSubtitle}>
        We've sent a 6-digit code to your email. Enter it below to continue.
      </Text>

      <Input
        label="Verification Code"
        value={verificationCode}
        onChangeText={setVerificationCode}
        keyboardType="number-pad"
        maxLength={6}
        error={!!verificationCode && verificationCode.length !== 6}
        helperText={!!verificationCode && verificationCode.length !== 6 ? 'Code must be 6 digits' : ''}
        left={<TextInput.Icon icon="shield-key" />}
        style={styles.input}
        disabled={loading}
      />

      <Button
        mode="contained"
        onPress={handleVerifyCode}
        loading={loading}
        disabled={loading}
        style={styles.button}
        contentStyle={styles.buttonContent}>
        Verify Code
      </Button>

      <TouchableOpacity onPress={handleVerifyStudent} style={styles.resendLink}>
        <Text style={styles.resendText}>Resend Code</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSetPasswordStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <Ionicons name="lock-closed" size={48} color={colors.blue} />
      </View>
      <Text style={styles.stepTitle}>Set Your Password</Text>
      <Text style={styles.stepSubtitle}>
        Create a secure password for your account
      </Text>

      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={secureTextEntry}
        error={!!password && password.length < 8}
        helperText={!!password && password.length < 8 ? 'Password must be at least 8 characters' : ''}
        right={<TextInput.Icon icon={secureTextEntry ? 'eye-off' : 'eye'} onPress={() => setSecureTextEntry(!secureTextEntry)} />}
        left={<TextInput.Icon icon="lock" />}
        style={styles.input}
        disabled={loading}
      />

      <Input
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={secureConfirmEntry}
        error={!!confirmPassword && password !== confirmPassword}
        helperText={!!confirmPassword && password !== confirmPassword ? 'Passwords do not match' : ''}
        right={<TextInput.Icon icon={secureConfirmEntry ? 'eye-off' : 'eye'} onPress={() => setSecureConfirmEntry(!secureConfirmEntry)} />}
        left={<TextInput.Icon icon="lock-check" />}
        style={styles.input}
        disabled={loading}
      />

      <Button
        mode="contained"
        onPress={handleCompleteSignup}
        loading={loading}
        disabled={loading}
        style={styles.button}
        contentStyle={styles.buttonContent}>
        Complete Signup
      </Button>
    </View>
  );

  const renderSuccessStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.successIconContainer}>
        <Ionicons name="checkmark-circle" size={80} color={colors.green} />
      </View>
      <Text style={styles.stepTitle}>Account Created!</Text>
      <Text style={styles.stepSubtitle}>
        Your account has been created successfully. You can now log in with your registration number and password.
      </Text>

      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        contentStyle={styles.buttonContent}>
        Go to Login
      </Button>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {step === 'verify' && renderVerifyStep()}
        {step === 'verify_code' && renderVerifyCodeStep()}
        {step === 'set_password' && renderSetPasswordStep()}
        {step === 'success' && renderSuccessStep()}

        {step !== 'success' && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Text style={styles.footerLink} onPress={handleLogin}>
              Sign In
            </Text>
          </View>
        )}
      </ScrollView>

      {renderUniversityModal()}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['2xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: spacing.lg,
  },
  stepContainer: {
    width: '100%',
  },
  stepTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.ink,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.slate,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.slate,
    fontSize: typography.fontSize.sm,
  },
  universitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.offWhite,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  universitySelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  universitySelectorText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  universitySelectorLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.slate,
    marginBottom: spacing.xs,
  },
  universitySelectorValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.ink,
  },
  input: {
    marginBottom: spacing.lg,
  },
  button: {
    borderRadius: 16,
    marginBottom: spacing.xl,
  },
  buttonContent: {
    paddingVertical: spacing.md,
  },
  resendLink: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  resendText: {
    color: colors.blue,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  successIconContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.auto,
  },
  footerText: {
    fontSize: typography.fontSize.base,
    color: colors.slate,
  },
  footerLink: {
    fontSize: typography.fontSize.base,
    color: colors.blue,
    fontWeight: typography.fontWeight.semibold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.ink,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchIcon: {
    marginRight: spacing.md,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  universityList: {
    flex: 1,
  },
  universityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  universityItemSelected: {
    backgroundColor: colors.offWhite,
  },
  universityInfo: {
    flex: 1,
  },
  universityName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  universityCode: {
    fontSize: typography.fontSize.sm,
    color: colors.slate,
    marginBottom: spacing.xs,
  },
  universityLocation: {
    fontSize: typography.fontSize.xs,
    color: colors.slate,
  },
});

export default SignUpScreen;
