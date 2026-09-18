import React, {useState} from 'react';
import {Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {colors, spacing} from '@/theme';
import Button from '@/components/Button';
import Input from '@/components/Input';
import {loginSchema, type LoginFormData} from '@/features/auth/validation/authValidation';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const [secure, setSecure] = useState(true);
  const {control, handleSubmit, formState: {errors}} = useForm<LoginFormData>({resolver: require('@hookform/resolvers/zod').zodResolver(loginSchema), defaultValues: {identifier: '', password: ''}});
  const submit = () => navigation.navigate('Main' as never);
  return <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <Image source={require('../../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
    <Text style={styles.title}>Welcome back</Text><Text style={styles.subtitle}>Sign in to continue your academic journey.</Text>
    <Controller control={control} name="identifier" render={({field: {onChange, value}}) => <Input label="Email or registration number" value={value} onChangeText={onChange} autoCapitalize="none" error={!!errors.identifier} helperText={errors.identifier?.message} left={<TextInput.Icon icon="account-outline" />} style={styles.input} />} />
    <Controller control={control} name="password" render={({field: {onChange, value}}) => <Input label="Password" value={value} onChangeText={onChange} secureTextEntry={secure} error={!!errors.password} helperText={errors.password?.message} left={<TextInput.Icon icon="lock-outline" />} right={<TextInput.Icon icon={secure ? 'eye-off-outline' : 'eye-outline'} onPress={() => setSecure(!secure)} />} style={styles.input} />} />
    <Text style={styles.forgot} onPress={() => navigation.navigate('ForgotPassword' as never)}>Forgot password?</Text>
    <Button mode="contained" onPress={handleSubmit(submit)} style={styles.button}>Sign In</Button>
    <Text style={styles.footer}>Don&apos;t have an account? <Text style={styles.link} onPress={() => navigation.navigate('SignUp' as never)}>Sign Up</Text></Text>
  </ScrollView></KeyboardAvoidingView>;
};
const styles = StyleSheet.create({container:{flex:1,backgroundColor:'#f7f9fc'},content:{flexGrow:1,padding:24,justifyContent:'center',maxWidth:520,width:'100%',alignSelf:'center'},logo:{width:120,height:120,alignSelf:'center',marginBottom:18},title:{fontSize:32,fontWeight:'800',color:'#061d49'},subtitle:{fontSize:16,color:'#667085',marginTop:8,marginBottom:28},input:{marginBottom:14},forgot:{alignSelf:'flex-end',color:'#0a55b8',fontWeight:'700',marginTop:2},button:{marginTop:26,borderRadius:12,paddingVertical:4},footer:{textAlign:'center',marginTop:24,color:'#667085',fontSize:15},link:{color:'#0a55b8',fontWeight:'800'}});
export default LoginScreen;
