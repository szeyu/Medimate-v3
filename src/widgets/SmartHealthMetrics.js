import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart } from 'react-native-chart-kit';

const SmartHealthMetrics = () => {
  const screenWidth = Dimensions.get('window').width;
  
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Smart Health Metrics</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={[styles.metricCard, { backgroundColor: 'rgba(33, 150, 243, 0.1)' }]}>
          <View style={styles.metricHeader}>
            <Icon name="favorite" size={16} color="#2196F3" />
            <Text style={[styles.metricTitle, { color: '#2196F3' }]}>Heart Rate</Text>
          </View>
          <View style={styles.metricValueContainer}>
            <Text style={[styles.metricValue, { color: '#2196F3' }]}>78.2</Text>
            <Text style={[styles.metricUnit, { color: 'rgba(33, 150, 243, 0.7)' }]}>BPM</Text>
          </View>
          <LineChart
            data={{
              labels: [],
              datasets: [{ data: [60, 70, 65, 80, 75, 85, 78] }]
            }}
            width={screenWidth * 0.4 - 20}
            height={40}
            chartConfig={{
              backgroundGradientFrom: 'rgba(33, 150, 243, 0.0)',
              backgroundGradientTo: 'rgba(33, 150, 243, 0.0)',
              color: () => '#2196F3',
              strokeWidth: 2,
              decimalPlaces: 0,
            }}
            bezier
            withDots={false}
            withInnerLines={false}
            withOuterLines={false}
            withHorizontalLabels={false}
            withVerticalLabels={false}
            style={styles.chart}
          />
        </View>
        
        <View style={[styles.metricCard, { backgroundColor: 'rgba(244, 67, 54, 0.1)' }]}>
          <View style={styles.metricHeader}>
            <Icon name="speed" size={16} color="#F44336" />
            <Text style={[styles.metricTitle, { color: '#F44336' }]}>Blood Pressure</Text>
          </View>
          <View style={styles.metricValueContainer}>
            <Text style={[styles.metricValue, { color: '#F44336' }]}>120</Text>
            <Text style={[styles.metricUnit, { color: 'rgba(244, 67, 54, 0.7)' }]}>NORMAL</Text>
          </View>
        </View>
        
        <View style={[styles.metricCard, { backgroundColor: 'rgba(33, 150, 243, 0.1)' }]}>
          <View style={styles.metricHeader}>
            <Icon name="nightlight-round" size={16} color="#64B5F6" />
            <Text style={[styles.metricTitle, { color: '#64B5F6' }]}>Sleep</Text>
          </View>
          <View style={styles.metricValueContainer}>
            <Text style={[styles.metricValue, { color: '#64B5F6' }]}>87</Text>
            <Text style={[styles.metricUnit, { color: 'rgba(100, 181, 246, 0.7)' }]}>%</Text>
          </View>
          <LineChart
            data={{
              labels: [],
              datasets: [{ data: [60, 80, 85, 75, 90, 87] }]
            }}
            width={screenWidth * 0.4 - 20}
            height={40}
            chartConfig={{
              backgroundGradientFrom: 'rgba(100, 181, 246, 0.0)',
              backgroundGradientTo: 'rgba(100, 181, 246, 0.0)',
              color: () => '#64B5F6',
              strokeWidth: 2,
              decimalPlaces: 0,
            }}
            bezier
            withDots={false}
            withInnerLines={false}
            withOuterLines={false}
            withHorizontalLabels={false}
            withVerticalLabels={false}
            style={styles.chart}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#1167FE',
  },
  metricCard: {
    width: Dimensions.get('window').width * 0.4,
    padding: 12,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  metricUnit: {
    fontSize: 12,
    marginLeft: 4,
  },
  chart: {
    marginTop: 8,
    borderRadius: 8,
  },
});

export default SmartHealthMetrics; 