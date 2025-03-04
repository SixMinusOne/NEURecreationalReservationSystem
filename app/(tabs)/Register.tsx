import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { styles } from '@/app/css/RegisterPage';
import { useRouter } from 'expo-router';
import { supabase } from '@/app/lib/supabase';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession(); // Ensure session is completed properly

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // Handle deep linking for OAuth redirect
  useEffect(() => {
    const handleUrl = async (url: string) => {
      try {
        // Parse the redirect URL to extract tokens
        const { params } = AuthSession.parseRedirectUrl(url);

        if (params.access_token && params.refresh_token) {
          // Set the session in Supabase
          const { data: sessionData, error } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });

          if (error) {
            Alert.alert('Error', error.message);
          } else if (sessionData?.session) {
            router.replace('/(tabs)/Home'); // Navigate to Home if session exists
          }
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to handle authentication');
        console.error('Deep link handling error:', error);
      }
    };

    // Listen for incoming deep links
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleUrl(url);
    });

    // Cleanup the listener
    return () => subscription.remove();
  }, []);

  const handleRegister = () => {
    console.log('Registering with:', fullName, email, password, confirmPassword);
    // Add your registration logic here
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log('Google Sign-In button clicked');

      // Create a redirect URL for the OAuth flow
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'myapp',
        path: 'auth',
      });

      console.log('Redirect URL:', redirectUri);

      // Start the OAuth flow
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true, // Critical for mobile flow
        },
      });

      if (error) {
        console.error('Google Sign-In error:', error.message);
        Alert.alert('Error', error.message);
        return;
      }

      console.log('Google Sign-In success:', data);

      // Open the OAuth URL in the browser
      if (data.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

        if (result.type === 'success') {
          // Handle the redirect URL
          const { params } = AuthSession.parseRedirectUrl(result.url);

          if (params.access_token && params.refresh_token) {
            // Set the session in Supabase
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: params.access_token,
              refresh_token: params.refresh_token,
            });

            if (sessionError) {
              console.error('Session error:', sessionError.message);
              Alert.alert('Error', sessionError.message);
            } else if (sessionData?.session) {
              router.replace('/(tabs)/Home'); // Navigate to Home if session exists
            }
          }
        } else {
          console.error('OAuth flow failed:', result.type);
          Alert.alert('Error', 'Google Sign-In failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Google Sign-In failed:', err);
      Alert.alert('Error', 'Google Sign-In failed. Please try again.');
    }
  };

  const navigateToSignIn = () => {
    router.push('/'); // Navigate to the main tab screen
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection} />

      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign Up</Text>

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

        <TouchableOpacity style={styles.signUpButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Or sign up with</Text>

        <TouchableOpacity style={styles.googleSignInButton} onPress={handleGoogleSignIn}>
          <Image source={require('@/assets/images/GoogleLogo.png')} style={styles.googleLogo} />
        </TouchableOpacity>

        <Text style={styles.signInText}>
          Already have an account?{' '}
          <Text style={styles.signInLink} onPress={navigateToSignIn}>Sign In</Text>
        </Text>
      </View>

      <View style={styles.bottomSection} />
    </View>
  );
}