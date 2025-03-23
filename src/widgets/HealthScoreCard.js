import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HealthScoreCard = () => {
  const navigation = useNavigation();
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Health Score</Text>
        <Icon name="more-horiz" size={24} color="#9E9E9E" />
      </View>
      <TouchableOpacity style={styles.card} 
        onPress={() => navigation.navigate('HealthScore')} >
        <View style={styles.cardContent}>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreText}>88</Text>
          </View>
          <View style={styles.scoreInfo}>
            <Text style={styles.scoreTitle}>Medimate Score</Text>
            <Text style={styles.scoreDescription}>
              Based on the data, we think your health status is above average.
            </Text>
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
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreBox: {
    width: 100,
    height: 100,
    backgroundColor: '#8A3FFC',
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
    color: '#9E9E9E',
    lineHeight: 20,
  },
});

export default HealthScoreCard; 