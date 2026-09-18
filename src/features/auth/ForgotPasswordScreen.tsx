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
import {TextInput} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {colors, spacing, typography} from '@/theme';
import Button from '@/components/Button';
import Input from '@/components/Input';
import {useAuth} from '@/hooks/useAuth';
import {forgotPasswordSchema, type ForgotPasswordFormData} from '@/features/auth/validation/authValidation';

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const {forgotPassword} = useAuth();
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');

  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleResetPassword = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data.email, 'default');
      setEmail(data.email);
      setEmailSent(true);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || error.message || 'Failed to send reset email',
      );
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLogin = () => {
    navigation.navigate('Login' as never);
  };

  if (emailSent) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.successContainer}>
            <MaterialCommunityIcons name="email-check" size={100} color={colors.success} />
            <Text style={styles.successTitle}>Email Sent!</Text>
            <Text style={styles.successMessage}>
              We've sent a password reset link to your email address. Please
              check your inbox and follow the instructions.
            </Text>
            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.loginButton}>
              Back to Login
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="lock-reset" size={80} color={colors.blue} />
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your
            password
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({field: {onChange, value}}) => (
              <Input
                label="Email"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                error={!!errors.email}
                helperText={errors.email?.message}
                left={<TextInput.Icon icon="email" />}
                style={styles.input}
              />
            )}
          />

          <Button
            mode="contained"
            onPress={handleSubmit(handleResetPassword)}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.resetButton}>
            Send Reset Link
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Remember your password? </Text>
          <Text style={styles.loginText} onPress={handleLogin}>
            Sign In
          </Text>
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
  resetButton: {
    marginBottom: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
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
  backButton: {
    marginTop: spacing.xl,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  successTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.ink,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  successMessage: {
    fontSize: typography.fontSize.base,
    color: colors.slate,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  loginButton: {
    width: '100%',
  },
});

export default ForgotPasswordScreen;
