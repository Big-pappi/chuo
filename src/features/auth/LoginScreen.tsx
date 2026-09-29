import React, {useState, useEffect} from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
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

interface StudentLoginFormData {
  university: string;
  registration_number: string;
  password: string;
}

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loadingUniversities, setLoadingUniversities] = useState(true);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [showUniversityModal, setShowUniversityModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const {control, handleSubmit, formState: {errors}} = useForm<StudentLoginFormData>({
    defaultValues: {
      university: '',
      registration_number: '',
      password: ''
    }
  });

  useEffect(() => {
    fetchUniversities();
    loadSavedUniversity();
  }, []);

  const loadSavedUniversity = async () => {
    try {
      const savedUniversityName = await SecureStore.getItemAsync('signup_university_name');
      if (savedUniversityName && universities.length > 0) {
        const savedUni = universities.find(u => u.name === savedUniversityName);
        if (savedUni) {
          setSelectedUniversity(savedUni);
        }
      }
    } catch (error) {
      console.error('Failed to load saved university:', error);
    }
  };

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

  const submit = async (data: StudentLoginFormData) => {
    if (!selectedUniversity) {
      Alert.alert('Error', 'Please select a university');
      return;
    }

    try {
      setLoading(true);
      await authService.studentLogin({
        university: selectedUniversity.code,
        registration_number: data.registration_number,
        password: data.password
      });
      navigation.navigate('Main' as never);
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
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

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image source={require('../../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue your academic journey.</Text>
        </View>

        {loadingUniversities ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.blue} />
            <Text style={styles.loadingText}>Loading universities...</Text>
          </View>
        ) : (
          <View style={styles.form}>
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

            <Controller
              control={control}
              name="registration_number"
              render={({field: {onChange, value}}) => (
                <Input
                  label="Registration Number"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="characters"
                  error={!!errors.registration_number}
                  helperText={errors.registration_number?.message}
                  left={<TextInput.Icon icon="card-account-details" />}
                  style={styles.input}
                  disabled={loading}
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
                  secureTextEntry={secure}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  left={<TextInput.Icon icon="lock" />}
                  right={<TextInput.Icon icon={secure ? 'eye-off' : 'eye'} onPress={() => setSecure(!secure)} />}
                  style={styles.input}
                  disabled={loading}
                />
              )}
            />

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword' as never)}>
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </TouchableOpacity>

            <Button
              mode="contained"
              onPress={handleSubmit(submit)}
              loading={loading}
              disabled={loading}
              style={styles.button}
              contentStyle={styles.buttonContent}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Text style={styles.footerLink} onPress={() => navigation.navigate('SignUp' as never)}>
            Sign Up
          </Text>
        </View>
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
  content: {
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
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.ink,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.slate,
    textAlign: 'center',
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
  form: {
    width: '100%',
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
  forgotPassword: {
    color: colors.blue,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'right',
    marginBottom: spacing.lg,
  },
  button: {
    borderRadius: 16,
    marginBottom: spacing.xl,
  },
  buttonContent: {
    paddingVertical: spacing.md,
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

export default LoginScreen;
