import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const facilityImages = {
  Badminton: require('../../assets/images/badminton.jpg'),
  Basketball: require('../../assets/images/basketball.jpg'),
  Volleyball: require('../../assets/images/volleyball.jpg'),
  Boxing: require('../../assets/images/boxing.jpg'),
  Bowling: require('../../assets/images/bowling.jpg'),
  Gym: require('../../assets/images/gym.jpg'),
};

export default function FacilitiesScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.topImageContainer}>
          <Image source={require('../../assets/images/recreation.jpg')} style={styles.topImage} />
        </View>

        <Text style={styles.sectionTitle}>Facilities Available</Text>

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

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <FontAwesome name="bell" size={28} color="white" />
          <Text style={styles.navText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <FontAwesome name="history" size={28} color="white" />
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <FontAwesome name="user" size={28} color="white" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D2D3EB',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 100,
  },
  topImageContainer: {
    width: '100%',
    height: 180,
    overflow: 'hidden',
  },
  topImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#333',
  },
  facilityContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  facilityImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    resizeMode: 'cover',
    marginBottom: 15,
  },
  facilityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reserveButton: {
    backgroundColor: '#6B6DAE',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#6B6DAE',
    paddingVertical: 15,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
});

