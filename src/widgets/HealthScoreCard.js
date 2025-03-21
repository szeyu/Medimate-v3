import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HealthScoreCard = () => {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Health Score</Text>
        <Icon name="more-horiz" size={24} color="#000000" />
      </View>
      <View style={styles.card}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreText}>88</Text>
        </View>
        <View style={styles.scoreInfo}>
          <Text style={styles.scoreTitle}>Asklepios Score</Text>
          <Text style={styles.scoreDescription}>
            Asklepios predicts, optimize your health with our AI-driven insights
          </Text>
        </View>
      </View>
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
  scoreBox: {
    width: 80,
    height: 80,
    backgroundColor: '#9C27B0',
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreDescription: {
    fontSize: 14,
    color: '#9E9E9E',
    marginTop: 4,
  },
});

export default HealthScoreCard; 