import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

const HealthScoreCard = () => {
  const navigation = useNavigation();
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Health Score</Text>
        <TouchableOpacity>
          <Icon name="more-horiz" size={24} color="#9E9E9E" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate('HealthScore')}
      >
        <LinearGradient
          colors={['#8A3FFC', '#7030CC']}
          style={styles.scoreBox}
        >
          <Text style={styles.scoreText}>88</Text>
        </LinearGradient>
        <View style={styles.scoreInfo}>
          <Text style={styles.scoreTitle}>Medimate Score</Text>
          <Text style={styles.scoreDescription}>
            Based on the data, we think your health status is above average.
          </Text>
          <View style={styles.scoreMetrics}>
            <View style={styles.metricItem}>
              <Icon name="trending-up" size={16} color="#4CAF50" />
              <Text style={styles.metricText}>+5% from last week</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
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
    color: '#333',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreBox: {
    width: 100,
    height: 100,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  scoreInfo: {
    flex: 1,
    marginLeft: 16,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  scoreDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  scoreMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FFF0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metricText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
  },
});

export default HealthScoreCard; 