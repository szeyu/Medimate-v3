import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { ContributionGraph } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';

// Import widget components
import UserHeader from '../widgets/UserHeader';
import SmartHealthMetrics from '../widgets/SmartHealthMetrics';
import GlucoseLevelCard from '../widgets/GlucoseLevelCard';
import FitnessTrackerCard from '../widgets/FitnessTrackerCard';
import MedicationManagement from '../widgets/MedicationManagementCard';
import HomeAppBar from '../../components/homeAppBar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import MedicationManagementCard from '../widgets/MedicationManagementCard';
import MentalStatusCard from '../widgets/MentalStatusCard';

const bloodPressureCard = require('../../assets/blood-pressure-card.png');
const heartRateCard = require('../../assets/heart-rate-card.png');
const sleepCard = require('../../assets/sleep-card.png');

const medi_manage = require('../../assets/medication.png');

const healthCards = [
  { 
    id: '1', 
    title: 'Blood Pressure',
    value: '120',
    unit: 'mmHg',
    status: 'NORMAL',
    color: '#FF5A5A',
    image: bloodPressureCard 
  },
  { 
    id: '2', 
    title: 'Heart Rate',
    value: '78.2',
    unit: 'BPM',
    color: '#1167FE',
    image: heartRateCard 
  },
  { 
    id: '3', 
    title: 'Sleep',
    value: '87',
    unit: 'hours',
    color: '#20C997',
    image: sleepCard 
  },
];

const SmartMetric = () => {
  return (
    <View>
      <View style={styles.labelRow}>
        <Text style={styles.sectionTitle}>Smart Health Metrics</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
          horizontal
          data={healthCards}
          renderItem={renderCard}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsContainer}
        />
    </View>
  )
}

const renderCard = ({ item }) => (
  <View style={styles.cardContainer}>
    <Image source={item.image} style={styles.cardImage} />
  </View>
);

const HomeScreen = ({ navigation }) => {
  useEffect(() => {
    // Set a timeout to show a medication reminder notification after 10 seconds
    const notificationTimer = setTimeout(() => {
      showMedicationReminder();
    }, 10000); // 10 seconds

    // Clean up the timer when component unmounts
    return () => clearTimeout(notificationTimer);
  }, []);

  const showMedicationReminder = () => {
    // Show an alert that simulates a notification
    Alert.alert(
      "Medication Reminder",
      "It's time to take your Painexal medication.",
      [
        {
          text: "Skip",
          style: "cancel"
        },
        { 
          text: "Take Now", 
          onPress: () => navigation.navigate('Medications')
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.appBarContainer}>
          <HomeAppBar navigation={navigation} />
        </View>
        <View style={styles.spacer} />
        <SmartMetric />
        <View style={styles.spacer} />
        <MentalStatusCard navigation={navigation} />
        <View style={styles.spacer} />
        <GlucoseLevelCard navigation={navigation} />
        <View style={styles.spacer} />
        <FitnessTrackerCard />
        <View style={styles.spacer} />
        <MedicationManagementCard navigation={navigation} />
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F5F9',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80, // Extra padding for bottom nav bar
  },
  appBarContainer: {
    marginHorizontal: -16, // Counteract the padding from contentContainer
    marginTop: -16, // Counteract the padding from contentContainer
  },
  spacer: {
    height: 20,
  },
  cardsContainer: {
    paddingRight: 16,
  },
  cardContainer: {
    marginRight: 16,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    elevation: 2,
    borderRadius: 16,
    width: 120,
    height: 180,
    padding: 12,
    // justifyContent: 'space-between',
  },
  cardImage: {
    width: 140,
    height: 160,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    color: '#1167FE',
    fontSize: 14,
    fontWeight: '500',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 8,
  },
});

export default HomeScreen;