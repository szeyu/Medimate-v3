import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FitnessTracker = () => {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Fitness & Activity Tracker</Text>
        <Icon name="more-horiz" size={24} color="#000000" />
      </View>
      <View style={styles.card}>
        {buildProgressBar('Calories Burned', '1500', '2000', 0.75, '#F44336', 'local-fire-department')}
        <View style={styles.divider} />
        {buildProgressBar('Steps Taken', '7500', '10000', 0.75, '#2196F3', 'directions-walk', true)}
      </View>
    </View>
  );
};

const buildProgressBar = (title, current, target, progress, color, iconName, isCompleted = false) => {
  return (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarHeader}>
        <View style={styles.progressBarTitleContainer}>
          <Icon name={iconName} size={20} color={color} />
          <Text style={styles.progressBarTitle}>{title}</Text>
          {isCompleted && <Icon name="check-circle" size={16} color="#4CAF50" style={styles.checkIcon} />}
        </View>
      </View>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
      </View>
      <View style={styles.progressBarLabels}>
        <Text style={styles.progressBarCurrentLabel}>You've reached {current}</Text>
        <Text style={styles.progressBarTargetLabel}>{target}cal</Text>
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
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBarTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarTitle: {
    fontWeight: 'bold',
    marginLeft: 8,
  },
  checkIcon: {
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
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 16,
  },
});

export default FitnessTracker; 