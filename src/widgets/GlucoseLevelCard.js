import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const GlucoseLevelCard = ({ navigation }) => {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Glucose Level</Text>
        <Icon name="more-horiz" size={24} color="#000000" />
      </View>
      <TouchableOpacity 
        style={[styles.card, styles.glucoseCard]} 
        onPress={() => navigation.navigate('TestGlucoseLevel')}
      >
        <View style={styles.glucoseCardContent}>
          <View style={styles.glucoseLevelContainer}>
            <Text style={styles.glucoseLevelText}>100</Text>
            <Text style={styles.glucoseLevelUnit}>mg/dL</Text>
          </View>
          <View style={styles.glucoseLevelInfo}>
            <Text style={styles.glucoseLevelTitle}>Current Glucose Level</Text>
            <Text style={styles.glucoseLevelDescription}>
              Your glucose level is within normal range
            </Text>
            <View style={styles.glucoseLevelStatus}>
              <View style={styles.glucoseLevelStatusIndicator} />
              <Text style={styles.glucoseLevelStatusText}>Normal</Text>
            </View>
          </View>
        </View>
        <View style={styles.glucoseCardArrow}>
          <Icon name="chevron-right" size={24} color="#1167FE" />
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
  glucoseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  glucoseCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  glucoseLevelContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glucoseLevelText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  glucoseLevelUnit: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
  },
  glucoseLevelInfo: {
    marginLeft: 16,
    flex: 1,
  },
  glucoseLevelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  glucoseLevelDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  glucoseLevelStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  glucoseLevelStatusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  glucoseLevelStatusText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  glucoseCardArrow: {
    padding: 8,
  },
});

export default GlucoseLevelCard; 