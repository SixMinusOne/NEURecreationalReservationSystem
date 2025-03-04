import React, { useState } from 'react';
import { TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import styles from '@/app/css/LoginPage'; // Ensure this file is correct
import { useRouter } from 'expo-router';
import { supabase } from '@/app/lib/supabase'; // Ensure Supabase is properly set up

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  /**
   * Handle login by verifying email & password against the "users" table.
   * Note: This example uses plain-text password matching.
   */
  const handleLogin = async () => {
    try {
      // Query the "users" table for a matching user
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password); // Plain-text password check (not recommended in production)

      if (error) {
        console.error('Login error:', error.message);
        Alert.alert('Login Error', error.message);
        return;
      }

      if (!data || data.length === 0) {
        console.error('Invalid credentials. No user found.');
        Alert.alert('Login Failed', 'Invalid email or password.');
        return;
      }

      console.log('User found:', data[0]);
      Alert.alert('Success', 'Logged in successfully!');
      router.replace('/(tabs)/Home');
    } catch (err) {
      console.error('Unexpected error:', err);
      Alert.alert('Login Error', 'Something went wrong. Please try again.');
    }
  };

  /**
   * Handle Google Sign-In using Supabase Auth.
   * The automatic navigation is removed; now it simply shows a success alert.
   */
  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        console.error('Google Sign-In error:', error.message);
        Alert.alert('Google Sign-In Error', error.message);
      } else {
        console.log('Google Sign-In success:', data);
        // Removed automatic navigation; just display success.
        Alert.alert('Success', 'Google sign in successful!');
      }
    } catch (err) {
      console.error('Google Sign-In error:', err);
      Alert.alert('Google Sign-In Error', 'Something went wrong.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection} />

      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign In</Text>

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

        <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Or sign in with</Text>

        <TouchableOpacity style={styles.googleSignInButton} onPress={handleGoogleSignIn}>
          <Image source={require('@/assets/images/GoogleLogo.png')} style={styles.googleLogo} />
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Don’t have an Account?{' '}
          <Text style={styles.signupLink} onPress={() => router.push('/Register')}>
            Sign Up
          </Text>
        </Text>
      </View>

      <View style={styles.bottomSection} />
    </View>
  );
}