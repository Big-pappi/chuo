import React, {useState} from 'react';
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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {TextInput, Menu} from 'react-native-paper';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {colors, spacing, typography} from '@/theme';
import Button from '@/components/Button';
import Input from '@/components/Input';
import {useAuth} from '@/hooks/useAuth';
import {signUpSchema, type SignUpFormData} from '@/features/auth/validation/authValidation';
import {universityConfig} from '@/api/university.config';

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation();
  const {signUp} = useAuth();
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmEntry, setSecureConfirmEntry] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [anchorWidth, setAnchorWidth] = useState(0);

  const universities = universityConfig.getAllUniversities();

  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      studentId: '',
      password: '',
      confirmPassword: '',
      universityId: '',
      termsAccepted: false,
    },
  });

  const handleSignUp = async (data: SignUpFormData) => {
    try {
      await signUp({
        fullName: data.fullName,
        email: data.email,
        studentId: data.studentId,
        password: data.password,
        universityId: data.universityId,
      });
      // Navigation will be handled by auth state change
    } catch (error: any) {
      Alert.alert(
        'Sign Up Failed',
        error.response?.data?.message || error.message || 'An error occurred during sign up',
      );
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login' as never);
  };

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

        <View style={styles.form}>
          <Text style={styles.welcomeText}>Create Your Account</Text>
          <Text style={styles.subtitleText}>
            Join thousands of students managing their academic journey
          </Text>

          <Controller
            control={control}
            name="fullName"
            render={({field: {onChange, value}}) => (
              <Input
                label="Full Name"
                value={value}
                onChangeText={onChange}
                autoCapitalize="words"
                textContentType="name"
                autoComplete="name"
                returnKeyType="next"
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
                left={<TextInput.Icon icon="account" size={20} />}
                style={styles.input}
                contentStyle={styles.inputContent}
              />
            )}
          />

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
                autoCorrect={false}
                textContentType="emailAddress"
                autoComplete="email"
                returnKeyType="next"
                error={!!errors.email}
                helperText={errors.email?.message}
                left={<TextInput.Icon icon="email" size={20} />}
                style={styles.input}
                contentStyle={styles.inputContent}
              />
            )}
          />

          <Controller
            control={control}
            name="universityId"
            render={({field: {onChange, value}}) => {
              const selected = universities.find(u => u.id === value);
              return (
                <View
                  style={[styles.input, styles.fullWidth]}
                  onLayout={e => setAnchorWidth(e.nativeEvent.layout.width)}>
                  <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchorPosition="bottom"
                    contentStyle={[
                      styles.menuContent,
                      anchorWidth ? {width: anchorWidth} : null,
                    ]}
                    anchor={
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setMenuVisible(true)}>
                        <View pointerEvents="none">
                          <Input
                            label="University"
                            value={selected ? selected.name : ''}
                            editable={false}
                            error={!!errors.universityId}
                            helperText={errors.universityId?.message}
                            left={<TextInput.Icon icon="school" size={20} />}
                            right={<TextInput.Icon icon="chevron-down" size={20} />}
                            contentStyle={styles.inputContent}
                          />
                        </View>
                      </TouchableOpacity>
                    }>
                    {universities.map(u => (
                      <Menu.Item
                        key={u.id}
                        onPress={() => {
                          onChange(u.id);
                          setMenuVisible(false);
                        }}
                        title={`${u.name} (${u.acronym})`}
                        titleStyle={styles.menuItemText}
                        leadingIcon={value === u.id ? 'check' : undefined}
                      />
                    ))}
                  </Menu>
                </View>
              );
            }}
          />

          <Controller
            control={control}
            name="studentId"
            render={({field: {onChange, value}}) => (
              <Input
                label="Registration Number"
                value={value}
                onChangeText={onChange}
                autoCapitalize="characters"
                autoCorrect={false}
                returnKeyType="next"
                error={!!errors.studentId}
                helperText={errors.studentId?.message}
                left={<TextInput.Icon icon="card-account-details" size={20} />}
                style={styles.input}
                contentStyle={styles.inputContent}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({field: {onChange, value}}) => (
              <Input
                label="Password"
                value={value}
                onChangeText={onChange}
                secureTextEntry={secureTextEntry}
                textContentType="password"
                autoComplete="password-new"
                returnKeyType="next"
                error={!!errors.password}
                helperText={errors.password?.message}
                right={
                  <TextInput.Icon
                    icon={secureTextEntry ? 'eye-off' : 'eye'}
                    onPress={() => setSecureTextEntry(!secureTextEntry)}
                    size={20}
                  />
                }
                left={<TextInput.Icon icon="lock" size={20} />}
                style={styles.input}
                contentStyle={styles.inputContent}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({field: {onChange, value}}) => (
              <Input
                label="Confirm Password"
                value={value}
                onChangeText={onChange}
                secureTextEntry={secureConfirmEntry}
                textContentType="password"
                autoComplete="password-new"
                returnKeyType="done"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                right={
                  <TextInput.Icon
                    icon={secureConfirmEntry ? 'eye-off' : 'eye'}
                    onPress={() => setSecureConfirmEntry(!secureConfirmEntry)}
                    size={20}
                  />
                }
                left={<TextInput.Icon icon="lock-check" size={20} />}
                style={styles.input}
                contentStyle={styles.inputContent}
              />
            )}
          />

          <Controller
            control={control}
            name="termsAccepted"
            render={({field: {onChange, value}}) => (
              <TouchableOpacity
                style={styles.termsContainer}
                activeOpacity={0.7}
                onPress={() => onChange(!value)}>
                <MaterialCommunityIcons
                  name={value ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  size={24}
                  color={value ? colors.blue : colors.slate}
                />
                <Text style={styles.termsText}>
                  I agree to the{' '}
                  <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>
            )}
          />
          {errors.termsAccepted && (
            <Text style={styles.errorText}>{errors.termsAccepted.message}</Text>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit(handleSignUp)}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.signUpButton}>
            Create Account
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Text style={styles.loginText} onPress={handleLogin}>
            Sign In
          </Text>
        </View>
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
  form: {
    marginTop: spacing.md,
    width: '100%',
  },
  welcomeText: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  subtitleText: {
    fontSize: typography.fontSize.sm,
    color: colors.slate,
    marginBottom: spacing.xl,
  },
  input: {
    marginBottom: spacing.md,
    width: '100%',
  },
  inputContent: {
    width: '100%',
    minWidth: 0,
    paddingHorizontal: 8,
  },
  fullWidth: {
    width: '100%',
  },
  menuContent: {
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  menuItemText: {
    fontSize: typography.fontSize.sm,
    color: colors.ink,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  termsText: {
    fontSize: typography.fontSize.sm,
    color: colors.slate,
    marginLeft: spacing.sm,
    flex: 1,
  },
  termsLink: {
    color: colors.blue,
    fontWeight: typography.fontWeight.medium,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
    marginTop: spacing.xs,
  },
  signUpButton: {
    marginTop: spacing.md,
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
