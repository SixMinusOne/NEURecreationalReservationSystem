import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import { styles } from '@/app/css/RegisterPage';
import { useRouter } from 'expo-router';
import { supabase } from '@/app/lib/supabase';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleUrl = async (url) => {
      console.log('[DEEP LINK] Handling URL:', url);
      try {
        const parsed = AuthSession.parseRedirectUrl(url);
        const params = { ...parsed.params, ...parsed.fragmentParams };

        if (params.access_token && params.refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });
          if (error) {
            Alert.alert('Error', error.message);
            return;
          }
          router.replace('/(tabs)/Home');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to process authentication');
      }
    };

    const subscription = Linking.addEventListener('url', ({ url }) => handleUrl(url));
    return () => subscription.remove();
  }, []);

  const enforceGmailDomain = (email) => {
    if (!email.endsWith('@gmail.com')) {
      Alert.alert('Error', 'Please use a Gmail address (e.g., example@gmail.com).');
      return false;
    }
    return true;
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await WebBrowser.warmUpAsync();
      const redirectUri = AuthSession.makeRedirectUri({ scheme: 'myapp', path: 'auth' });
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: redirectUri, skipBrowserRedirect: true },
      });

      if (error || !data?.url) throw new Error('Authentication service unavailable');

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
      if (result.type === 'success') {
        const parsed = AuthSession.parseRedirectUrl(result.url);
        const params = { ...parsed.params, ...parsed.fragmentParams };

        if (!params.access_token || !params.refresh_token) throw new Error('Authentication tokens not received');
        await supabase.auth.setSession({ access_token: params.access_token, refresh_token: params.refresh_token });
        router.replace('/(tabs)/Home');
      } else {
        Alert.alert('Info', 'Sign-in cancelled');
      }
    } catch (error) {
      Alert.alert('Authentication Error', error.message || 'Failed to complete sign-in');
    } finally {
      setIsLoading(false);
      await WebBrowser.coolDownAsync();
    }
  };

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    if (!enforceGmailDomain(email)) {
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase.from('users').insert([{ full_name: fullName, email, password }]);
      if (error) throw error;
      Alert.alert('Success', 'Account created successfully!');
      router.replace('/(tabs)/Home');
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection} />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Account</Text>
        <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput style={styles.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
        <TouchableOpacity style={styles.signUpButton} onPress={handleRegister} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.buttonText}>Create Account</Text>}
        </TouchableOpacity>
        <Text style={styles.orText}>─ Or Continue With ─</Text>
        <TouchableOpacity style={styles.googleSignInButton} onPress={handleGoogleSignIn} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" size="small" /> : <Image source={require('@/assets/images/GoogleLogo.png')} style={styles.googleLogo} />}
        </TouchableOpacity>
        <Text style={styles.signInText}>Already have an account? <Text style={styles.signInLink} onPress={() => router.push('/')}>Sign In</Text></Text>
      </View>
      <View style={styles.bottomSection} />
    </View>
  );
}
