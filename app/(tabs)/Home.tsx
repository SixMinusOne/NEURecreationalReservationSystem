import React, { useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import { useRouter } from 'expo-router';
import { supabase } from '@/app/lib/supabase';
import styles from '@/app/css/HomePage'; // Your CSS file

const facilityImages = {
  Badminton: require('@/assets/images/badminton.jpg'),
  Basketball: require('@/assets/images/basketball.jpg'),
  Volleyball: require('@/assets/images/volleyball.jpg'),
  Boxing: require('@/assets/images/boxing.jpg'),
  Bowling: require('@/assets/images/bowling.jpg'),
  Gym: require('@/assets/images/gym.jpg'),
};

// Styles for the Drawer Navigation
const drawerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  navText: {
    color: 'white',
    marginLeft: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default function FacilitiesScreen() {
  const drawerRef = useRef(null);
  const router = useRouter();

  const handleLogout = async () => {
    // Sign out from Supabase
    await supabase.auth.signOut();
    // Navigate to the index page ("/")
    router.replace('/');
  };

  // Drawer Navigation Menu
  const renderDrawer = () => (
    <View style={[drawerStyles.container, { justifyContent: 'space-between' }]}>
      <View>
        <TouchableOpacity style={drawerStyles.navItem}>
          <FontAwesome name="bell" size={28} color="white" />
          <Text style={drawerStyles.navText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={drawerStyles.navItem}>
          <FontAwesome name="history" size={28} color="white" />
          <Text style={drawerStyles.navText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={drawerStyles.navItem}>
          <FontAwesome name="user" size={28} color="white" />
          <Text style={drawerStyles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
      {/* Logout Button at the Bottom */}
      <TouchableOpacity style={drawerStyles.navItem} onPress={handleLogout}>
        <FontAwesome name="sign-out" size={28} color="white" />
        <Text style={drawerStyles.navText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <DrawerLayout
      ref={drawerRef}
      drawerWidth={300}
      drawerPosition="left"
      renderNavigationView={renderDrawer}
    >
      <View style={styles.container}>
        {/* Header with Menu Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => drawerRef.current?.openDrawer()}>
            <FontAwesome name="bars" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Facilities</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Top Image Section */}
          <View style={styles.topImageContainer}>
            <Image source={require('@/assets/images/recreation.jpg')} style={styles.topImage} />
          </View>

          {/* Section Title */}
          <Text style={styles.sectionTitle}>Facilities Available</Text>

          {/* Facility Cards */}
          {Object.keys(facilityImages).map((facility, index) => (
            <View key={index} style={styles.facilityContainer}>
              <Image source={facilityImages[facility]} style={styles.facilityImage} />
              <Text style={styles.facilityText}>{facility}</Text>
              <TouchableOpacity style={styles.reserveButton}>
                <Text style={styles.buttonText}>Reserve Now</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </DrawerLayout>
  );
}
