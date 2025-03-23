import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MedicationDescriptionAppBar from '../../../components/medicationDescriptionAppBar';
import { BarChart } from 'react-native-gifted-charts';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const MedicationDescriptionScreen = ({ navigation }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('Weekly');
  const [detailsExpanded, setDetailsExpanded] = useState(true);
  const [sideEffectsExpanded, setSideEffectsExpanded] = useState(true);
  const [aiRecommendationExpanded, setAiRecommendationExpanded] = useState(true);
  const [precautionsExpanded, setPrecautionsExpanded] = useState(false);

  // Side effects list
  const sideEffects = [
    'Abdominal or stomach cramps',
    'Stomach Pains',
    'Bleeding Gums',
    'Peeling & Loosening Blister',
    'Bloating & Bloody Nose'
  ];

  // Bar chart data
  const barData = [
    { value: 15, frontColor: '#E9ECEF', label: 'M' },
    { value: 30, frontColor: '#E9ECEF', label: 'T' },
    { value: 25, frontColor: '#E9ECEF', label: 'W' },
    { value: 40, frontColor: '#4285F4', label: 'T' },
    { value: 60, frontColor: '#4285F4', label: 'F' },
    { value: 45, frontColor: '#4285F4', label: 'S' },
    { value: 35, frontColor: '#E9ECEF', label: 'S' },
    { value: 25, frontColor: '#E9ECEF', label: 'M' },
    { value: 30, frontColor: '#E9ECEF', label: 'T' },
    { value: 20, frontColor: '#E9ECEF', label: 'W' },
    { value: 15, frontColor: '#E9ECEF', label: 'T' },
    { value: 25, frontColor: '#FF5A5F', label: 'F' },
    { value: 40, frontColor: '#FF5A5F', label: 'S' },
    { value: 30, frontColor: '#FF5A5F', label: 'S' },
    { value: 20, frontColor: '#E9ECEF', label: 'M' },
    { value: 15, frontColor: '#E9ECEF', label: 'T' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={{ flex: 1, backgroundColor: '#F3F5F9' }}>
        <MedicationDescriptionAppBar navigation={navigation} />
      </View>
      <View style={styles.content}>
        {/* Report Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Report</Text>
          <Icon name="more-horiz" size={24} color="#9E9E9E" />
        </View>
        <View style={styles.reportCard}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>251 Total</Text>
            <TouchableOpacity style={styles.timeframeButton}>
              <Icon name="calendar-today" size={16} color="#1F2937" />
              <Text style={styles.timeframeText}>{selectedTimeframe}</Text>
              <Icon name="keyboard-arrow-down" size={16} color="#1F2937" />
            </TouchableOpacity>
          </View>

          <View style={styles.chartContainer}>
            <BarChart
              data={barData}
              barWidth={16}
              spacing={12}
              // roundedTop
              // roundedBottom
              hideRules
              xAxisThickness={0}
              yAxisThickness={-30}
              yAxisTextStyle={{ color: 'transparent' }}
              noOfSections={3}
              maxValue={70}
              height={150}
            />
          </View>

          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#4285F4' }]} />
              <Text style={styles.legendText}>Taken</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#E9ECEF' }]} />
              <Text style={styles.legendText}>Reschedule</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FF5A5F' }]} />
              <Text style={styles.legendText}>Skipped</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
        {/* Details Section */}
          <TouchableOpacity 
            style={styles.infoCard}
            onPress={() => setDetailsExpanded(!detailsExpanded)}
          >
            <View style={styles.infoCardHeader}>
              <View style={styles.infoIconContainer}>
                <Icon name="info-outline" size={20} color="#1F2937" />
                <Text style={styles.infoCardTitle}>Details</Text>
              </View>
              <Icon 
                name={detailsExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                size={24} 
                color="#6B7280" 
              />
            </View>
            
            {detailsExpanded && (
              <Text style={styles.infoCardContent}>
                Amoxicillin belongs to the group of medicines known as penicillin antibiotics. It works by killing the bacteria and preventing their growth.
              </Text>
            )}
          </TouchableOpacity>

          {/* Side Effects Section */}
          <TouchableOpacity 
            style={styles.infoCard}
            onPress={() => setSideEffectsExpanded(!sideEffectsExpanded)}
          >
            <View style={styles.infoCardHeader}>
              <View style={styles.infoIconContainer}>
                <AntDesign name="warning" size={20} color="#1F2937" />
                <Text style={styles.infoCardTitle}>Side Effects</Text>
              </View>
              <Icon 
                name={sideEffectsExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                size={24} 
                color="#6B7280" 
              />
            </View>
            
            {sideEffectsExpanded && (
              <View style={styles.sideEffectsList}>
                {sideEffects.map((effect, index) => (
                  <View key={index} style={styles.sideEffectItem}>
                    <View style={styles.checkmarkContainer}>
                      <Icon name="check" size={16} color="#FFFFFF" />
                    </View>
                    <Text style={styles.sideEffectText}>{effect}</Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>

          {/* AI Recommendation Section icons - smart-toy */} 
          <TouchableOpacity 
            style={[styles.infoCard, styles.aiRecommendationCard]}
            onPress={() => setAiRecommendationExpanded(!aiRecommendationExpanded)}
          >
            <View style={styles.infoCardHeader}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="hardware-chip-outline" size={20} color="#FFFFFF" />
                <Text style={[styles.infoCardTitle, { color: '#FFFFFF' }]}>AI Recommendation</Text>
              </View>
              <Icon 
                name={aiRecommendationExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                size={24} 
                color="#FFFFFF" 
              />
            </View>
            
            {aiRecommendationExpanded && (
              <Text style={[styles.infoCardContent, { color: '#FFFFFF' }]}>
                Take amoxicillin exactly as prescribed by your doctor. Follow all directions on your prescription label and read all medication guides or instruction sheets.
              </Text>
            )}
          </TouchableOpacity>

          {/* Precautions Section */}
          <TouchableOpacity 
            style={styles.infoCard}
            onPress={() => setPrecautionsExpanded(!precautionsExpanded)}
          >
            <View style={styles.infoCardHeader}>
              <View style={styles.infoIconContainer}>
                <Icon name="help-outline" size={20} color="#1F2937" />
                <Text style={styles.infoCardTitle}>Precautions</Text>
              </View>
              <Icon 
                name={precautionsExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                size={24} 
                color="#6B7280" 
              />
            </View>
            
            {precautionsExpanded && (
              <Text style={styles.infoCardContent}>
                Before taking amoxicillin, tell your doctor if you are allergic to any penicillin antibiotic.
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F5F9',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparent white
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  seeAllButton: {
    alignSelf: 'flex-end',
  },
  seeAllText: {
    color: '#1167FE',
    fontSize: 14,
    fontWeight: '500',
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  timeframeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timeframeText: {
    fontSize: 14,
    color: '#1F2937',
    marginHorizontal: 4,
  },
  chartContainer: {
    marginBottom: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
    justifyContent: 'space-between', // Center the items horizontally
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
    marginRight: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#6B7280',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 10,
  },
  infoCardContent: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
    lineHeight: 20,
  },
  aiRecommendationCard: {
    backgroundColor: '#1167FE',
  },
  sideEffectsList: {
    marginTop: 12,
  },
  sideEffectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkmarkContainer: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#FF5A5F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  sideEffectText: {
    fontSize: 14,
    color: '#6B7280',
  },
  styleGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  styleOption: {
    width: 60,
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  styleOptionSelected: {
    borderWidth: 2,
    borderColor: '#D8C7FB',
  },
});

export default MedicationDescriptionScreen;