import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import HealthScoreAppBar from '../../../components/HealthScoreAppBar';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const HeartRateScreen = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('1 Week');
  const periods = ['1 Day', '1 Week', '1 Month', '1 Year', 'All'];

  const lineData = [
    { value: 85, dataPointText: '85', label: 'Mon' },
    { value: 75, dataPointText: '75', label: 'Tue' },
    { value: 80, dataPointText: '80', label: 'Wed', showDataPoint: true },
    { value: 95, dataPointText: '95', label: 'Thu' },
    { value: 90, dataPointText: '90', label: 'Fri', showDataPoint: true },
    { value: 85, dataPointText: '85', label: 'Sat' },
    { value: 88, dataPointText: '88', label: 'Sun' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
      {/* Background Decorations */}

      {/* Header Content */}
      <View style={styles.content}>
        {/* Back Button */}
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={20} color="black" />
            </TouchableOpacity>
            <View style={styles.headerTopTitle}>
                <Text style={styles.headerTitle}>Heart Rate</Text>
                <View style={styles.statusPill}>
                    <Text style={styles.statusText}>Normal</Text>
                </View>
            </View>
          </View>
            {/* BPM Display */}
          <View style={styles.bpmContainer}>
            <View style={styles.heartIconContainer}>
              <Ionicons name="heart" size={24} color="#FF5757" />
            </View>
            <Text style={styles.bpmText}>95<Text style={styles.bpmUnit}>BPM</Text></Text>
          </View>

          {/* Period Selector */}
          <View style={styles.periodSelector}>
            {periods.map(period => (
                <TouchableOpacity 
                    key={period}
                    style={[
                        styles.periodButton,
                        selectedPeriod === period && styles.selectedPeriodButton
                    ]}
                    onPress={() => setSelectedPeriod(period)}
                >
                    <Text 
                        style={[
                            styles.periodText,
                            selectedPeriod === period && styles.selectedPeriodText
                        ]}
                    >
                        {period}
                    </Text>
                </TouchableOpacity>
            ))}
          </View>

          {/* Chart is moved outside this View */}
        </View>
      </View>

      {/* Chart */}
      <View style={styles.chartPlaceholder}>
        {/* <View style={styles.chartContainer}> */}
          <LineChart
            areaChart
            data={lineData}
            width={width - 40}
            height={200}
            spacing={50} // Increased spacing
            initialSpacing={25}
            color="#2D6BFF"
            thickness={2}
            maxValue={120}
            noOfSections={4}
            yAxisTextStyle={{ color: 'gray' }} // Changed color to gray
            yAxisLabelTexts={['0', '60', '80', '100', '120']}
            yAxisTextNumberOfLines={1}
            yAxisLabelWidth={30} // Increased label width
            hideDataPoints={false}
            startFillColor="rgba(45, 107, 255, 0.2)"
            endFillColor="rgba(45, 107, 255, 0.0)"
            startOpacity={0.9}
            endOpacity={0.2}
            backgroundColor="transparent"
            rulesColor="#E5E5E5"
            rulesType="solid"
            xAxisColor="transparent"
            pointerConfig={{
              pointerStripHeight: 160,
              pointerStripColor: 'lightgray',
              pointerStripWidth: 2,
              pointerColor: '#2D6BFF',
              radius: 6,
              pointerLabelWidth: 100,
              pointerLabelHeight: 90,
              activatePointersOnLongPress: true,
              autoAdjustPointerLabelPosition: true,
              pointerLabelComponent: (items) => {
                return (
                  <View style={{
                    height: 90,
                    width: 100, // Increased pointer label width
                    backgroundColor: '#ffffff',
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Text style={{color: 'black', fontSize: 14}}>{items[0].value} BPM</Text>
                    <Text style={{color: 'black', fontSize: 12}}>{items[0].label}</Text>
                  </View>
                );
              },
            }}
            curved
          />
        </View>
      {/* </View> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F5F9',
  },
  appBar: {
      backgroundColor: '#F3F5F9',
      height: 320,
      borderBottomLeftRadius: 35,
      borderBottomRightRadius: 35,
      overflow: 'hidden',
      position: 'relative',
  },
    content: {
      paddingTop: 50,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    backButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: 'rgba(14, 2, 2, 0.3)',
      width: 40,
      alignItems: 'center',
      marginTop: 12,
    },
    iconBackground: {
      position: 'absolute',
      zIndex: 1,
      opacity: 1,
      transform: [{ rotate: '10deg' }],
    },
    headerContainer: {
      backgroundColor: '#1167FE',
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      paddingBottom: 30,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 30,
    },
    headerTopTitle:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width:'83%',
      marginTop: 10,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'black',
    },
    statusPill: {
      backgroundColor: '#D0E4FF',
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 10,
    },
    statusText: {
      color: '#1167FE',
      fontWeight: '500',
    },
    bpmContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 20,
    },
    heartIconContainer: {
      backgroundColor: '#FFF1F1',
      padding: 10,
      borderRadius: 12,
      marginRight: 15,
    },
    bpmText: {
      fontSize: 48,
      fontWeight: 'bold',
      color: '#1E2A47',
    },
    bpmUnit: {
      fontSize: 20,
      color: '#8A8D9F',
      marginLeft: 5,
    },
    periodSelector: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#F5F6FA',
      borderRadius: 20,
      padding: 5,
      marginBottom: 20,
      width: '100%',
  },
  periodButton: {
      paddingVertical: 10,
      paddingHorizontal: 8,
      borderRadius: 15,
      flex: 1,
      alignItems: 'center',
  },
  selectedPeriodButton: {
      backgroundColor: '#1E2A47',
  },
  periodText: {
      color: '#8A8D9F',
      fontWeight: 'bold',
      fontSize: 11,
  },
  selectedPeriodText: {
      color: 'white',
      fontWeight: 'bold',
  },
    chartContainer: {
      marginTop: 20,
      alignItems: 'center',
    },
    chartPlaceholder: {
      height: 200,
      width: '100%',
      backgroundColor: '#F5F6FA',
      borderRadius: 20,
      marginTop: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
});

export default HeartRateScreen;