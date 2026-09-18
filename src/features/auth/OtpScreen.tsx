import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {colors, spacing, typography} from '@/theme';
import Button from '@/components/Button';
import Input from '@/components/Input';
import {useAuth} from '@/hooks/useAuth';
import {otpSchema, type OtpFormData} from '@/features/auth/validation/authValidation';

const OtpScreen: React.FC = () => {
  const navigation = useNavigation();
  const {verifyOtp} = useAuth();
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const [email, setEmail] = useState('');

  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerifyOtp = async (data: OtpFormData) => {
    try {
      await verifyOtp(email, data.otp);
      navigation.navigate('Login' as never);
    } catch (error: any) {
      Alert.alert(
        'Verification Failed',
        error.response?.data?.message || error.message || 'Invalid OTP code',
      );
    }
  };

  const handleResendOtp = () => {
    setResendDisabled(true);
    setCountdown(30);
    // Simulate resend API call
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="email-check" size={80} color={colors.blue} />
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit verification code to your email address
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="otp"
            render={({field: {onChange, value}}) => (
              <Input
                label="Enter OTP"
                value={value}
                onChangeText={onChange}
                keyboardType="number-pad"
                maxLength={6}
                textAlign="center"
                error={!!errors.otp}
                helperText={errors.otp?.message}
                style={styles.input}
              />
            )}
          />

          <Button
            mode="contained"
            onPress={handleSubmit(handleVerifyOtp)}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.verifyButton}>
            Verify
          </Button>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code? </Text>
            {resendDisabled ? (
              <Text style={styles.countdownText}>Resend in {countdown}s</Text>
            ) : (
              <Text style={styles.resendLink} onPress={handleResendOtp}>
                Resend
              </Text>
            )}
          </View>
        </View>

        <Button mode="text" onPress={handleBack} style={styles.backButton}>
          Back
        </Button>
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
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing['3xl'],
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.ink,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.slate,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  form: {
    marginTop: spacing.lg,
  },
  input: {
    marginBottom: spacing.xl,
  },
  verifyButton: {
    marginBottom: spacing.lg,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: typography.fontSize.sm,
    color: colors.slate,
  },
  countdownText: {
    fontSize: typography.fontSize.sm,
    color: colors.slate,
  },
  resendLink: {
    fontSize: typography.fontSize.sm,
    color: colors.blue,
    fontWeight: typography.fontWeight.medium,
  },
  backButton: {
    marginTop: spacing.xl,
  },
});

export default OtpScreen;
