import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import HealthScoreAppBar from '../../components/HealthScoreAppBar';
import { Ionicons } from '@expo/vector-icons';

const HealthScoreScreen = ({ navigation }) => {
  // Sample data for the mini charts
  const heartRateData = {
    labels: [],
    datasets: [
      {
        data: [65, 70, 80, 95, 85, 90, 95],
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const bloodPressureData = {
    labels: [],
    datasets: [
      {
        data: [110, 115, 125, 130, 120, 115, 121],
        color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const sleepData = {
    labels: [],
    datasets: [
      {
        data: [5.5, 6.0, 5.8, 6.2, 6.3, 6.4, 6.5],
        color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "",
    },
    propsForBackgroundLines: {
      stroke: "transparent",
    },
  };

  return (
    <ScrollView style={styles.container}>
      
      {/* Blue Header Section */}
      <HealthScoreAppBar navigation={navigation}/>
      {/* Stats Cards */}
      <View style={styles.cardsContainer}>
        {/* Heart Rate Card */}
        <TouchableOpacity style={styles.card}
          onPress={() => {
            navigation.navigate('HeartRate');
          }}>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Heart Rate</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>95</Text>
              <Text style={styles.unitText}>bpm</Text>
            </View>
          </View>
          <View style={styles.chartContainer}>
            <LineChart
              data={heartRateData}
              width={160}
              height={80}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(17, 103, 254, ${opacity})`,
              }}
              bezier
              withDots={false}
              decorator={() => {
                return (
                  <View
                    style={{
                      position: 'absolute',
                      right: 17,
                      top: 10,
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: '#1167FE',
                      borderWidth: 2,
                      borderColor: '#FFFFFF',
                    }}
                  />
                );
              }}
              withInnerLines={false}
              withOuterLines={false}
              withVerticalLines={false}
              withHorizontalLines={false}
              withVerticalLabels={false}
              withHorizontalLabels={false}
              style={styles.chart}
            />
          </View>
        </TouchableOpacity>
        
        {/* Blood Pressure Card */}
        <TouchableOpacity style={styles.card}
          onPress={() => {
            navigation.navigate('BloodPressure');
          }}>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Blood Pressure</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>121</Text>
              <Text style={styles.unitText}>mmHg</Text>
            </View>
          </View>
          <View style={styles.chartContainer}>
            <LineChart
              data={bloodPressureData}
              width={160}
              height={80}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
              }}
              bezier
              withDots={false}
              decorator={() => {
                return (
                  <View
                    style={{
                      position: 'absolute',
                      right: 17,
                      top: 37,
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: '#EF4444',
                      borderWidth: 2,
                      borderColor: '#FFFFFF',
                    }}
                  />
                );
              }}
              withInnerLines={false}
              withOuterLines={false}
              withVerticalLines={false}
              withHorizontalLines={false}
              withVerticalLabels={false}
              withHorizontalLabels={false}
              style={styles.chart}
            />
          </View>
        </TouchableOpacity>
        
        {/* Sleep Card */}
        <View style={styles.card}>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Sleep</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>6.5</Text>
              <Text style={styles.unitText}>hr</Text>
            </View>
          </View>
          <View style={styles.chartContainer}>
            <LineChart
              data={sleepData}
              width={160}
              height={80}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
              }}
              bezier
              withDots={false}
              decorator={() => {
                return (
                  <View
                    style={{
                      position: 'absolute',
                      right: 17,
                      top: 10,
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: '#8B5CF6',
                      borderWidth: 2,
                      borderColor: '#FFFFFF',
                    }}
                  />
                );
              }}
              withInnerLines={false}
              withOuterLines={false}
              withVerticalLines={false}
              withHorizontalLines={false}
              withVerticalLabels={false}
              withHorizontalLabels={false}
              style={styles.chart}
            />
          </View>
        </View>
        <TouchableOpacity 
          style={styles.cardContainer}
          onPress={() => navigation.navigate('MentalGreat')}
        >
            <Image
                source={require('../../../assets/mental-health-cover.png')}
                style={styles.backgroundImage}
            />
            <View style={styles.overlay}/>
            <View style={styles.cardContent}>
                <View style={styles.textContent}>
                    <Text style={styles.cardSubtitle}>Here is your daily score</Text>
                    <Text style={styles.scoreText}>Great</Text>
                    <Text style={styles.scoreDescription}>
                        I always know I am{'\n'}the best !
                    </Text>
                </View>
                <Image
                    source={require('../../../assets/GreatStatus.png')}
                    style={styles.statusImage}
                />
            </View>
          </TouchableOpacity>
      </View>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  headerContainer: {
    backgroundColor: '#1167FE',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 30,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  statusPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontWeight: '500',
  },
  scoreNumber: {
    fontSize: 100,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 110,
  },
  scoreDescription: {
    fontSize: 18,
    color: 'white',
    marginTop: 10,
  },
  cardsContainer: {
    padding: 16,
    marginTop: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  valueText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  unitText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 4,
    marginBottom: 4,
  },
  chartContainer: {
    width: 140,
    height: 60,
    justifyContent: 'center',
  },
  chart: {
    borderRadius: 16,
    paddingRight: 16,
  },
  cardContainer: {
    position: 'relative',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backgroundImage: {
      width: '100%',
      height: 200,
      borderRadius: 24,
      position: 'absolute',
      opacity: 1,
      resizeMode: 'cover',
  },
  cardContent: {
      padding: 24,
      height: 200,
      flexDirection: 'row', // Add this
      justifyContent: 'space-between', // Add this
      alignItems: 'center', // Add this
  },
  textContent: {
      flex: 1, // Add this
      paddingRight: 10, // Add spacing between text and image
  },
  statusImage: {
      width: 370,
      height: 370,
      resizeMode: 'contain',
      position: 'absolute', // Change from relative to absolute
      right: -140, // Position from the right edge
      bottom: -50, // Position from the bottom
      zIndex: 1, // Ensure it appears above other elements
  },
  cardSubtitle: {
      fontSize: 18,
      color: '#429D71',
      marginBottom: 34,
  },
  scoreText: {
      fontSize: 38,
      fontWeight: 'bold',
      color: '#429D71',
      marginBottom: 10,
  },
  scoreDescription: {
      fontSize: 20,
      color: '#429D71',
      lineHeight: 22,
      fontWeight: 'semi-bold',
  },
  overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(255, 255, 255, 0.2)', // Adjust the last number (0.1) for transparency
  },
});

export default HealthScoreScreen;