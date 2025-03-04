import React, { useState } from 'react';
import { TextInput, TouchableOpacity, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import { styles } from '@/app/css/RegisterPage'; // ✅ Import styles
import { useRouter } from 'expo-router'; // ✅ Import router for navigation
import { supabase } from '@/app/lib/supabase'; // ✅ Ensure Supabase is properly set up

export default function RegisterScreen() {
  const router = useRouter(); // ✅ Router for navigation

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    console.log('Registering with:', fullName, email, password, confirmPassword);
  };

  const handleGoogleSignIn = async () => {
    console.log('Google Sign-In button clicked'); // Log when button is pressed
  
    try {
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'myapp://auth', // Must match app.json scheme
        },
      });
  
      console.log('Sign-In Response:', data, error);
  
      if (error) {
        console.error('Google Sign-In error:', error.message);
        return;
      }
  
      console.log('Google Sign-In success:', data);
      router.push('/(tabs)/Home');
    } catch (err) {
      console.error('Google Sign-In failed:', err);
    }
  };
  
  

  const navigateToSignIn = () => {
    router.push('/'); // ✅ Navigates to the main tab screen (index.tsx)
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection} />

      {/* Register Form Section */}
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
