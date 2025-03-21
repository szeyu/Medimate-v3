import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SleepCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="nightlight-round" size={20} color="#000000" />
        <Text style={styles.cardTitle}>Sleep</Text>
      </View>
      <View style={styles.nutrientContainer}>
        {buildNutrientItem('Hours Slept', 3, '#2196F3')}
        {buildNutrientItem('Quality', 2, '#4CAF50')}
        {buildNutrientItem('Stress', 2, '#FF9800')}
      </View>
    </View>
  );
};

const buildNutrientItem = (name, level, color) => {
  return (
    <View style={styles.nutrientItem}>
      <View style={styles.nutrientDots}>
        {[0, 1, 2].map((index) => (
          <View 
            key={index}
            style={[
              styles.nutrientDot, 
              { backgroundColor: index < level ? color : '#EEEEEE' }
            ]} 
          />
        ))}
      </View>
      <Text style={styles.nutrientName}>{name}</Text>
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
  nutrientContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutrientItem: {
    alignItems: 'center',
  },
  nutrientDots: {
    flexDirection: 'row',
  },
  nutrientDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    margin: 2,
  },
  nutrientName: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default SleepCard; 