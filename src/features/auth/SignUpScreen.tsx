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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-paper';
import {colors, spacing, typography} from '@/theme';
import Button from '@/components/Button';
import Input from '@/components/Input';
import authService from '@/features/auth/services/authService';
import * as SecureStore from 'expo-secure-store';

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
  const [selectedUniversity, setSelectedUniversity] = useState<string>('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmEntry, setSecureConfirmEntry] = useState(true);
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      setLoadingUniversities(true);
      const data = await authService.getUniversities();
      console.log('Universities data:', data);
      console.log('Number of universities:', data.length);
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

  const handleVerifyStudent = async () => {
    if (!selectedUniversity || !registrationNumber) {
      Alert.alert('Error', 'Please select a university and enter your registration number');
      return;
    }

    try {
      setLoading(true);
      const selectedUni = universities.find(u => u.name === selectedUniversity);
      if (!selectedUni) {
        Alert.alert('Error', 'Invalid university selection');
        return;
      }

      const result = await authService.verifyStudent({
        university: selectedUni.code,
        registration_number: registrationNumber,
      });

      if (result.student_exists) {
        // Store university and reg number locally
        await SecureStore.setItemAsync('signup_university', selectedUni.code);
        await SecureStore.setItemAsync('signup_university_name', selectedUni.name);
        await SecureStore.setItemAsync('signup_reg_number', registrationNumber);

        // Send verification code
        await authService.sendVerificationCode({
          university: selectedUni.code,
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

      // Just verify the code, don't complete signup yet
      // We'll complete signup after setting password
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
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Select University</Text>
            <TextInput
              mode="outlined"
              value={selectedUniversity}
              onChangeText={setSelectedUniversity}
              placeholder="Tap to select university"
              right={<TextInput.Icon icon="chevron-down" onPress={() => setShowUniversityDropdown(!showUniversityDropdown)} />}
              style={styles.input}
              disabled={loading}
              onFocus={() => setShowUniversityDropdown(true)}
            />
            {showUniversityDropdown && (
              <View style={styles.dropdown}>
                {universities.map((uni) => (
                  <Text
                    key={uni.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedUniversity(uni.name);
                      setShowUniversityDropdown(false);
                    }}>
                    {uni.name}
                  </Text>
                ))}
              </View>
            )}
          </View>

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
            style={styles.button}>
            Verify Student
          </Button>
        </>
      )}
    </View>
  );

  const renderVerifyCodeStep = () => (
    <View style={styles.stepContainer}>
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
        style={styles.button}>
        Verify Code
      </Button>

      <TouchableOpacity onPress={handleVerifyStudent} style={styles.resendLink}>
        <Text style={styles.resendText}>Resend Code</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSetPasswordStep = () => (
    <View style={styles.stepContainer}>
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
        style={styles.button}>
        Complete Signup
      </Button>
    </View>
  );

  const renderSuccessStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.successIcon}>✓</Text>
      <Text style={styles.stepTitle}>Account Created!</Text>
      <Text style={styles.stepSubtitle}>
        Your account has been created successfully. You can now log in with your registration number and password.
      </Text>

      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}>
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
            <Text style={styles.loginText} onPress={handleLogin}>
              Sign In
            </Text>
          </View>
        )}
      </ScrollView>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: spacing['2xl'],
    marginBottom: spacing.md,
  },
  logo: {
    width: 120,
    height: 120,
  },
  stepContainer: {
    marginTop: spacing.md,
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
    fontSize: typography.fontSize.sm,
    color: colors.slate,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.slate,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  input: {
    marginBottom: spacing.md,
  },
  dropdown: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 200,
  },
  dropdownItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  button: {
    marginTop: spacing.md,
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
  successIcon: {
    fontSize: 64,
    color: colors.green,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  footerText: {
    fontSize: typography.fontSize.base,
    color: colors.slate,
  },
  loginText: {
    fontSize: typography.fontSize.base,
    color: colors.blue,
    fontWeight: typography.fontWeight.medium,
  },
});

export default SignUpScreen;
