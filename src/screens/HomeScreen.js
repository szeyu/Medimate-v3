import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';

// Import widget components
import UserHeader from '../widgets/UserHeader';
import HealthScoreCard from '../widgets/HealthScoreCard';
import SmartHealthMetrics from '../widgets/SmartHealthMetrics';
import GlucoseLevelCard from '../widgets/GlucoseLevelCard';
import FitnessTracker from '../widgets/FitnessTracker';
import NutritionCard from '../widgets/NutritionCard';
import SleepCard from '../widgets/SleepCard';
import HydrationCard from '../widgets/HydrationCard';
import WellnessAIChatbot from '../widgets/WellnessAIChatbot';
import MedicationManagement from '../widgets/MedicationManagement';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <UserHeader />
        <View style={styles.spacer} />
        <HealthScoreCard />
        <View style={styles.spacer} />
        <SmartHealthMetrics />
        <View style={styles.spacer} />
        <GlucoseLevelCard navigation={navigation} />
        <View style={styles.spacer} />
        <FitnessTracker />
        <View style={styles.spacer} />
        <NutritionCard />
        <View style={styles.spacer} />
        <SleepCard />
        <View style={styles.spacer} />
        <HydrationCard />
        <View style={styles.spacer} />
        <WellnessAIChatbot />
        <View style={styles.spacer} />
        <MedicationManagement navigation={navigation} />
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F5F9',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80, // Extra padding for bottom nav bar
  },
  spacer: {
    height: 20,
  },
});

export default HomeScreen;