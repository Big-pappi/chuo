import React, {useState, useEffect} from 'react';
import {Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {colors, spacing} from '@/theme';
import Button from '@/components/Button';
import Input from '@/components/Input';
import authService from '@/features/auth/services/authService';

interface University {
  id: number;
  name: string;
  code: string;
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
  const [selectedUniversity, setSelectedUniversity] = useState<string>('');
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);

  const {control, handleSubmit, formState: {errors}} = useForm<StudentLoginFormData>({
    defaultValues: {
      university: '',
      registration_number: '',
      password: ''
    }
  });

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      setLoadingUniversities(true);
      const data = await authService.getUniversities();
      console.log('Universities data:', data);
      setUniversities(data);
    } catch (error) {
      console.error('Failed to fetch universities:', error);
      Alert.alert('Error', 'Failed to load universities. Please check your connection.');
    } finally {
      setLoadingUniversities(false);
    }
  };

  const submit = async (data: StudentLoginFormData) => {
    if (!data.university) {
      Alert.alert('Error', 'Please select a university');
      return;
    }

    try {
      setLoading(true);
      const selectedUni = universities.find(u => u.name === selectedUniversity);
      if (!selectedUni) {
        Alert.alert('Error', 'Invalid university selection');
        return;
      }
      await authService.studentLogin({
        university: selectedUni.code,
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

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Image source={require('../../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue your academic journey.</Text>

        {loadingUniversities ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0a55b8" />
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
                right={<TextInput.Icon icon="chevron-down" />}
                style={styles.input}
                disabled={loading}
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
                      }}
                    >
                      {uni.name}
                    </Text>
                  ))}
                </View>
              )}
            </View>

            <Controller
              control={control}
              name="registration_number"
              render={({field: {onChange, value}}) => (
                <Input
                  label="Registration Number"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  error={!!errors.registration_number}
                  helperText={errors.registration_number?.message}
                  left={<TextInput.Icon icon="account-outline" />}
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
                  left={<TextInput.Icon icon="lock-outline" />}
                  right={<TextInput.Icon icon={secure ? 'eye-off-outline' : 'eye-outline'} onPress={() => setSecure(!secure)} />}
                  style={styles.input}
                  disabled={loading}
                />
              )}
            />

            <Text style={styles.forgot} onPress={() => navigation.navigate('ForgotPassword' as never)}>Forgot password?</Text>

            <Button
              mode="contained"
              onPress={handleSubmit(submit)}
              style={styles.button}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </>
        )}

        <Text style={styles.footer}>Don&apos;t have an account? <Text style={styles.link} onPress={() => navigation.navigate('SignUp' as never)}>Sign Up</Text></Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f7f9fc'},
  content: {flexGrow: 1, padding: 24, justifyContent: 'center', maxWidth: 520, width: '100%', alignSelf: 'center'},
  logo: {width: 120, height: 120, alignSelf: 'center', marginBottom: 18},
  title: {fontSize: 32, fontWeight: '800', color: '#061d49'},
  subtitle: {fontSize: 16, color: '#667085', marginTop: 8, marginBottom: 28},
  inputGroup: {marginBottom: 14},
  label: {fontSize: 14, fontWeight: '600', color: '#061d49', marginBottom: 8},
  input: {marginBottom: 14},
  loadingContainer: {alignItems: 'center', padding: 20},
  loadingText: {marginTop: 12, color: '#667085'},
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  forgot: {alignSelf: 'flex-end', color: '#0a55b8', fontWeight: '700', marginTop: 2},
  button: {marginTop: 26, borderRadius: 12, paddingVertical: 4},
  footer: {textAlign: 'center', marginTop: 24, color: '#667085', fontSize: 15},
  link: {color: '#0a55b8', fontWeight: '800'}
});

export default LoginScreen;
