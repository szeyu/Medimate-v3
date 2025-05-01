import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AiHealthSuggestionAppBar from '../../components/AiHealthSuggestionAppBar';

const AiHealthSuggestionScreen = ({ navigation }) => {

  return (
    <ScrollView style={styles.container}>
      <View style={{ flex: 1, backgroundColor: '#F3F5F9' }}>
        <AiHealthSuggestionAppBar navigation={navigation} />
      </View>
      <View style={styles.content}>
        {/* Header with filter */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>All Suggestions</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="calendar-outline" size={20} color="#2C3E50" />
            <Text style={styles.filterText}>Highest</Text>
            <Ionicons name="chevron-down" size={20} color="#2C3E50" />
          </TouchableOpacity>
        </View>
        
        {/* Nutrition Card */}
        <TouchableOpacity style={styles.suggestionCard} 
            onPress={() => navigation.navigate('NutritionGuidance')}
        >
          {/* Icons Row */}
          <View style={styles.iconRow}>
            <View style={styles.iconContainer}>
              <FontAwesome5 name="utensils" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="pill" size={20} color="#FFFFFF" />
            </View>
            <View style={[styles.iconContainer, styles.addIconContainer]}>
              <Ionicons name="add" size={20} color="#1167FE" />
            </View>
            <View style={styles.chevronContainer}>
              <Ionicons name="chevron-forward" size={24} color="#A0AEC0" />
            </View>
          </View>
          
          {/* Nutrition content */}
          <Text style={styles.cardTitle}>Nutrition Guidance</Text>
          <View style={styles.cardDetails}>
            <Text style={styles.cardSubtitle}>Breathing, Relax</Text>
            <Text style={styles.cardDot}>•</Text>
            <Text style={styles.cardDuration}>25-30min</Text>
          </View>
        </TouchableOpacity>

        {/* Physical Activities Card */}
        <TouchableOpacity style={styles.suggestionCard}>
          {/* Icons Row */}
          <View style={styles.iconRow}>
            <View style={[styles.iconContainer, styles.purpleIconContainer]}>
              <FontAwesome5 name="walking" size={20} color="#FFFFFF" />
            </View>
            <View style={[styles.iconContainer, styles.purpleIconContainer]}>
              <MaterialCommunityIcons name="bike" size={20} color="#FFFFFF" />
            </View>
            <View style={[styles.iconContainer, styles.purpleAddIconContainer]}>
              <Ionicons name="add" size={20} color="#8B5CF6" />
            </View>
            <View style={styles.chevronContainer}>
              <Ionicons name="chevron-forward" size={24} color="#A0AEC0" />
            </View>
          </View>
          
          {/* Physical Activities content */}
          <Text style={styles.cardTitle}>Physical Activities</Text>
          <View style={styles.cardDetails}>
            <Text style={styles.cardSubtitle}>Breathing, Relax</Text>
            <Text style={styles.cardDot}>•</Text>
            <Text style={styles.cardDuration}>25-30min</Text>
          </View>
        </TouchableOpacity>

        {/* Mindful Breathing Card */}
        <TouchableOpacity style={styles.suggestionCard}>
          {/* Icons Row */}
          <View style={styles.iconRow}>
            <View style={[styles.iconContainer, styles.tealIconContainer]}>
              <FontAwesome5 name="flag" size={20} color="#FFFFFF" />
            </View>
            <View style={[styles.iconContainer, styles.tealIconContainer]}>
              <MaterialCommunityIcons name="brain" size={20} color="#FFFFFF" />
            </View>
            <View style={[styles.iconContainer, styles.tealAddIconContainer]}>
              <Ionicons name="add" size={20} color="#06B6D4" />
            </View>
            <View style={styles.chevronContainer}>
              <Ionicons name="chevron-forward" size={24} color="#A0AEC0" />
            </View>
          </View>
          
          {/* Mindful Breathing content */}
          <Text style={styles.cardTitle}>Mindful Breathing</Text>
          <View style={styles.cardDetails}>
            <Text style={styles.cardSubtitle}>Breathing, Relax</Text>
            <Text style={styles.cardDot}>•</Text>
            <Text style={styles.cardDuration}>25-30min</Text>
          </View>
        </TouchableOpacity>
        
        {/* Wellness Resources Card */}
        <TouchableOpacity style={styles.suggestionCard}>
          {/* Icons Row */}
          <View style={styles.iconRow}>
            <View style={[styles.iconContainer, styles.orangeIconContainer]}>
              <MaterialCommunityIcons name="bookmark" size={20} color="#FFFFFF" />
            </View>
            <View style={[styles.iconContainer, styles.orangeIconContainer]}>
              <Ionicons name="play" size={20} color="#FFFFFF" />
            </View>
            <View style={[styles.iconContainer, styles.orangeAddIconContainer]}>
              <Ionicons name="add" size={20} color="#F59E0B" />
            </View>
            <View style={styles.chevronContainer}>
              <Ionicons name="chevron-forward" size={24} color="#A0AEC0" />
            </View>
          </View>
          
          {/* Wellness Resources content */}
          <Text style={styles.cardTitle}>Wellness Resources</Text>
          <View style={styles.cardDetails}>
            <Text style={styles.cardSubtitle}>Breathing, Relax</Text>
            <Text style={styles.cardDot}>•</Text>
            <Text style={styles.cardDuration}>25-30min</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F5F9',
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  filterText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
    marginHorizontal: 8,
  },
  suggestionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  iconRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#1167FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  addIconContainer: {
    backgroundColor: '#E6EFFF',
  },
  chevronContainer: {
    marginLeft: 'auto',
    justifyContent: 'center',
    marginTop: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  cardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#718096',
  },
  cardDot: {
    fontSize: 16,
    color: '#718096',
    marginHorizontal: 8,
  },
  cardDuration: {
    fontSize: 16,
    color: '#718096',
  },
  purpleIconContainer: {
    backgroundColor: '#893FFC', // Purple color for physical activities
  },
  addIconContainer: {
    backgroundColor: '#E6EFFF', 
  },
  purpleAddIconContainer: {
    backgroundColor: '#F3EEFF', // Light purple background for the add button
  },
  tealIconContainer: {
    backgroundColor: '#06B6D4', // Teal color for mindful breathing
  },
  tealAddIconContainer: {
    backgroundColor: '#E0F7FA', // Light teal background for the add button
  },
  orangeIconContainer: {
    backgroundColor: '#F59E0B', // Orange color for wellness resources
  },
  orangeAddIconContainer: {
    backgroundColor: '#FEF3C7', // Light orange background for the add button
  },
});

export default AiHealthSuggestionScreen;