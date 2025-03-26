import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HydrationCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="opacity" size={20} color="#000000" />
        <Text style={styles.cardTitle}>Hydration</Text>
      </View>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: '35%', backgroundColor: '#2196F3' }]} />
      </View>
      <View style={styles.progressBarLabels}>
        <Text style={styles.progressBarCurrentLabel}>700ml</Text>
        <Text style={styles.progressBarTargetLabel}>2,000ml</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#EEEEEE',
    borderRadius: 4,
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },
  progressBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressBarCurrentLabel: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  progressBarTargetLabel: {
    fontSize: 12,
    color: '#9E9E9E',
  },
});

export default HydrationCard; 