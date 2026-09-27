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
import {useNavigation, useRoute} from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {getColors, spacing, typography} from '@/theme';
import {useTheme} from '@/context/ThemeContext';
import Button from '@/components/Button';
import Input from '@/components/Input';
import {useAuth} from '@/hooks/useAuth';
import {otpSchema, type OtpFormData} from '@/features/auth/validation/authValidation';

const OtpScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const {verifyOtp} = useAuth();
  const {isDark} = useTheme();
  const {colors: themeColors} = getColors(isDark);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const email = route.params?.email ?? '';

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
      style={[styles.container, {backgroundColor: themeColors.bg}]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={[styles.iconBubble, {backgroundColor: themeColors.blueSoft}]}>
            <MaterialCommunityIcons name="email-check-outline" size={42} color={themeColors.blue} />
          </View>
          <Text style={[styles.title, {color: themeColors.ink}]}>Activate your account</Text>
          <Text style={[styles.subtitle, {color: themeColors.slate}]}>
            Enter the 6-digit code sent to {email || 'your university email'} to finish setting up CHUO.
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
            <Text style={[styles.resendText, {color: themeColors.slate}]}>Didn't receive the code? </Text>
            {resendDisabled ? (
              <Text style={[styles.countdownText, {color: themeColors.slate}]}>Resend in {countdown}s</Text>
            ) : (
              <Text style={[styles.resendLink, {color: themeColors.blue}]} onPress={handleResendOtp}>
                Resend code
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
  },
  iconBubble: {
    width: 88,
    height: 88,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
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
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
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
  },
  countdownText: {
    fontSize: typography.fontSize.sm,
  },
  resendLink: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  backButton: {
    marginTop: spacing.xl,
  },
});

export default OtpScreen;
