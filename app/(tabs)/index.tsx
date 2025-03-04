import React, { useState } from 'react';
import { TextInput, TouchableOpacity, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import styles from '@/app/css/LoginPage'; // Ensure this file is correct
import { useRouter } from 'expo-router';
import { supabase } from '@/app/lib/supabase'; // Ensure Supabase is properly set up

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('Login error:', error.message);
      return;
    }

    console.log('Logged in successfully!');
    router.push('/(tabs)/Home'); // ✅ Navigate to Home.tsx
  };

  const handleGoogleSignIn = async () => {
    const { error, data } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('Google Sign-In error:', error.message);
    } else {
      console.log('Google Sign-In success:', data);
      router.push('/(tabs)/Home'); // ✅ Navigate to Home.tsx
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