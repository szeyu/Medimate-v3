import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import { ContributionGraph } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';

// Import widget components
import UserHeader from '../widgets/UserHeader';
import HealthScoreCard from '../widgets/HealthScoreCard';
import SmartHealthMetrics from '../widgets/SmartHealthMetrics';
import GlucoseLevelCard from '../widgets/GlucoseLevelCard';
import FitnessTrackerCard from '../widgets/FitnessTrackerCard';
import MedicationManagement from '../widgets/MedicationManagementCard';
import HomeAppBar from '../../components/homeAppBar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import WellnessAIChatbotCard from '../widgets/WellnessAIChatbotCard';
import MedicationManagementCard from '../widgets/MedicationManagementCard';
import TranscribeAICard from '../widgets/TranscribeAICard';
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

// const MedicationManagementCard = ({ navigation }) => {
//   // Sample data for the contribution graph
//   const commitsData = [
//     { date: '2023-05-01', count: 2, color: '#1167FE' }, // Taken
//     { date: '2023-05-02', count: 2, color: '#1167FE' },
//     { date: '2023-05-03', count: 2, color: '#1167FE' },
//     { date: '2023-05-04', count: 2, color: '#1167FE' },
//     { date: '2023-05-05', count: 2, color: '#1167FE' },
//     { date: '2023-05-06', count: 2, color: '#1167FE' },
//     { date: '2023-05-07', count: 2, color: '#1167FE' },
//     { date: '2023-05-08', count: 2, color: '#1167FE' },
//     { date: '2023-05-09', count: 2, color: '#1167FE' },
//     { date: '2023-05-10', count: 2, color: '#1167FE' },
//     { date: '2023-05-11', count: 2, color: '#FF5A5A' }, // Missed
//     { date: '2023-05-12', count: 2, color: '#FF5A5A' },
//     { date: '2023-05-13', count: 2, color: '#FF5A5A' },
//     { date: '2023-05-14', count: 2, color: '#FF5A5A' },
//     { date: '2023-05-15', count: 2, color: '#FF5A5A' },
//     { date: '2023-05-16', count: 2, color: '#E8ECF4' }, // Skipped
//     { date: '2023-05-17', count: 2, color: '#E8ECF4' },
//     { date: '2023-05-18', count: 2, color: '#E8ECF4' },
//     { date: '2023-05-19', count: 2, color: '#E8ECF4' },
//     { date: '2023-05-20', count: 2, color: '#E8ECF4' },
//     // Add more dates as needed
//   ];

//   const chartConfig = {
//     backgroundGradientFrom: "#ffffff",
//     backgroundGradientTo: "#ffffff",
//     color: () => "black",
//     strokeWidth: 4,
//     barPercentage: 1,
//   };

//   return (
//     <View>
//       <View style={styles.labelRow}>
//         <Text style={styles.smartHealthMetrics}>Medication Management</Text>
//         <TouchableOpacity onPress={() => navigation.navigate('MedicationScreen')}>
//           <Text style={styles.seeAllText}>See All</Text>
//         </TouchableOpacity>
//       </View>
      
//       <View style={styles.medicationCard}>
//         <View style={styles.medicationHeader}>
//           <View>
//             <Text style={styles.medicationCount}>205</Text>
//             <Text style={styles.medicationLabel}>Medications</Text>
//           </View>
          
//           <TouchableOpacity 
//             style={styles.addButton}
//             onPress={() => navigation.navigate('AddMedicationScreen')}
//           >
//             <Icon name="add" size={24} color="#FFFFFF" />
//           </TouchableOpacity>
//         </View>
        
//         <View style={styles.graphContainer}>
//           <ContributionGraph
//             values={commitsData}
//             endDate={new Date('2023-05-20')}
//             numDays={35}
//             width={320}
//             height={180}
//             chartConfig={chartConfig}
//             squareSize={22}
//             gutterSize={4}
//           />
//         </View>
        
//         <View style={styles.legendContainer}>
//           <View style={styles.legendItem}>
//             <View style={[styles.legendColor, { backgroundColor: '#1167FE' }]} />
//             <Text style={styles.legendText}>Taken</Text>
//           </View>
          
//           <View style={styles.legendItem}>
//             <View style={[styles.legendColor, { backgroundColor: '#FF5A5A' }]} />
//             <Text style={styles.legendText}>Missed</Text>
//           </View>
          
//           <View style={styles.legendItem}>
//             <View style={[styles.legendColor, { backgroundColor: '#E8ECF4' }]} />
//             <Text style={styles.legendText}>Skipped</Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };



// const renderCard = ({ item }) => (
//   <View style={[styles.cardContainer, { backgroundColor: item.color }]}>
//     <Text style={styles.cardTitle}>{item.title}</Text>
//     <Image source={item.image} style={styles.cardImage} />
//     <View style={styles.cardFooter}>
//       <Text style={styles.cardValue}>{item.value}</Text>
//       <Text style={styles.cardUnit}>{item.unit}</Text>
//     </View>
//     {item.status && (
//       <View style={styles.statusContainer}>
//         <Text style={styles.statusText}>{item.status}</Text>
//       </View>
//     )}
//   </View>
// );

const renderCard = ({ item }) => (
  <View style={styles.cardContainer}>
    <Image source={item.image} style={styles.cardImage} />
  </View>
);

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.appBarContainer}>
          <HomeAppBar navigation={navigation} />
        </View>
        <View style={styles.spacer} />
        <HealthScoreCard />
        <View style={styles.spacer} />
        <SmartMetric />
        {/* <SmartHealthMetrics /> */}
        <View style={styles.spacer} />
        <GlucoseLevelCard navigation={navigation} />
        <View style={styles.spacer} />
        {/* <FitnessTracker /> */}
        <FitnessTrackerCard />
        <View style={styles.spacer} />
        <WellnessAIChatbotCard />
        <View style={styles.spacer} />
        <TranscribeAICard />
        <View style={styles.spacer} />
        {/* <MedicationManagement navigation={navigation} /> */}
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
  cardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardImage: {
    width: 140,
    height: 160,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  // cardFooter: {
  //   flexDirection: 'row',
  //   alignItems: 'baseline',
  // },
  // cardValue: {
  //   color: 'white',
  //   fontSize: 24,
  //   fontWeight: 'bold',
  // },
  // cardUnit: {
  //   color: 'white',
  //   fontSize: 14,
  //   marginLeft: 4,
  //   opacity: 0.8,
  // },
  // statusContainer: {
  //   position: 'absolute',
  //   top: '50%',
  //   left: '50%',
  //   transform: [{ translateX: -40 }, { translateY: -15 }],
  //   borderWidth: 2,
  //   borderColor: 'white',
  //   borderRadius: 8,
  //   padding: 6,
  //   paddingHorizontal: 12,
  // },
  // statusText: {
  //   color: 'white',
  //   fontWeight: 'bold',
  //   fontSize: 14,
  // },
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