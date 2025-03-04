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

  // Local state for form fields
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle deep links for OAuth:
   */
  useEffect(() => {
    const handleUrl = async (url: string) => {
      console.log('[DEEP LINK] Handling URL:', url);
      try {
        const parsed = AuthSession.parseRedirectUrl(url);
        const params = {
          ...parsed.params,
          ...parsed.fragmentParams,
        };

        console.log('[OAUTH] Received parameters:', JSON.stringify(params));

        if (params.access_token && params.refresh_token) {
          console.log('[SUPABASE] Attempting to set session...');
          const {
            data: { session },
            error,
          } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });

          if (error) {
            console.error('[ERROR] Session setup failed:', error);
            Alert.alert('Error', error.message);
            return;
          }

          if (session) {
            console.log('[SUCCESS] Valid session established');
            router.replace('/(tabs)/Home');
          }
        } else {
          console.warn('[WARNING] Missing tokens in URL parameters');
        }
      } catch (error) {
        console.error('[ERROR] URL processing failed:', error);
        Alert.alert('Error', 'Failed to process authentication');
      }
    };

    console.log('[SETUP] Adding deep link listener');
    const subscription = Linking.addEventListener('url', ({ url }) => {
      console.log('[DEEP LINK] Received:', url);
      handleUrl(url);
    });

    return () => {
      console.log('[CLEANUP] Removing deep link listener');
      subscription.remove();
    };
  }, []);

  /**
   * Handle Google Sign-In (OAuth) with Supabase:
   */
  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    console.log('[AUTH] Initializing Google Sign-In');
    setIsLoading(true);

    try {
      console.log('[BROWSER] Warming up...');
      await WebBrowser.warmUpAsync();

      // Make sure to use your own scheme here:
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'myapp',
        path: 'auth',
      });
      console.log('[AUTH] Generated redirect URI:', redirectUri);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        console.error('[SUPABASE] OAuth error:', error);
        throw new Error(`Authentication failed: ${error.message}`);
      }

      if (!data?.url) {
        console.error('[ERROR] Missing authentication URL');
        throw new Error('Authentication service unavailable');
      }

      console.log('[BROWSER] Opening authentication session...');
      const result = await Promise.race([
        WebBrowser.openAuthSessionAsync(data.url, redirectUri),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Authentication timeout after 30 seconds')), 30000)
        ),
      ]);

      console.log('[BROWSER] Result type:', result.type);
      if (result.type === 'success') {
        console.log('[SUCCESS] Authentication response received');
        const parsed = AuthSession.parseRedirectUrl(result.url);
        const params = {
          ...parsed.params,
          ...parsed.fragmentParams,
        };

        console.log('[OAUTH] Response parameters:', JSON.stringify(params));

        if (!params.access_token || !params.refresh_token) {
          console.error('[ERROR] Missing authentication tokens');
          throw new Error('Authentication tokens not received');
        }

        console.log('[SUPABASE] Setting final session...');
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: params.access_token,
          refresh_token: params.refresh_token,
        });

        if (sessionError) {
          console.error('[SUPABASE] Session error:', sessionError);
          throw sessionError;
        }

        console.log('[NAVIGATION] Redirecting to home...');
        router.replace('/(tabs)/Home');
      } else {
        console.log('[INFO] Authentication cancelled by user');
        Alert.alert('Info', 'Sign-in cancelled');
      }
    } catch (error: any) {
      console.error('[ERROR] Authentication flow failed:', error);
      Alert.alert('Authentication Error', error.message || 'Failed to complete sign-in');
    } finally {
      console.log('[CLEANUP] Resetting loading state');
      setIsLoading(false);
      await WebBrowser.coolDownAsync();
    }
  };

  /**
   * Handle user registration (insert a new row into the "users" table):
   */
  const handleRegister = async () => {
    // Basic checks before inserting:
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);

      // Insert a new row into the "users" table
      // (Replace 'full_name', 'email', 'password' with your actual column names)
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            full_name: fullName,
            email: email,
            password: password, // For production, store hashed passwords, not plaintext
          },
        ])
        .select();

      if (error) {
        console.error('Error inserting user:', error);
        Alert.alert('Error', error.message);
      } else {
        console.log('User created:', data);
        Alert.alert('Success', 'Account created successfully!');

        // Navigate to the home screen (or wherever you prefer)
        router.replace('/(tabs)/Home');
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Navigate to the sign-in screen
   */
  const navigateToSignIn = () => {
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection} />

      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#666"
          value={fullName}
          onChangeText={setFullName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#666"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.signUpButton} 
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.orText}>─ Or Continue With ─</Text>

        <TouchableOpacity 
          style={styles.googleSignInButton} 
          onPress={handleGoogleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Image 
                source={require('@/assets/images/GoogleLogo.png')} 
                style={styles.googleLogo} 
              />
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.signInText}>
          Already have an account?{' '}
          <Text style={styles.signInLink} onPress={navigateToSignIn}>
            Sign In
          </Text>
        </Text>
      </View>

      <View style={styles.bottomSection} />
    </View>
  );
}
