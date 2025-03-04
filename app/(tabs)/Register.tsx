import React, { useState } from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { styles } from '@/app/css/RegisterPage'; // ✅ Import styles
import { useRouter } from 'expo-router'; // ✅ Import router for navigation

export default function RegisterScreen() {
  const router = useRouter(); // ✅ Router for navigation

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    console.log('Registering with:', fullName, email, password, confirmPassword);
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

        <Text style={styles.signInText}>
          Already have an account?{' '}
          <Text style={styles.signInLink} onPress={navigateToSignIn}>Sign In</Text>
        </Text>
      </View>

      <View style={styles.bottomSection} />
    </View>
  );
}