import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MedicationManagement = ({ navigation }) => {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Medication Management</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Medications')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <View style={styles.medicationSummary}>
          <View style={styles.medicationSummaryItem}>
            <Text style={styles.medicationCount}>3</Text>
            <Text style={styles.medicationLabel}>Active Medications</Text>
          </View>
          <View style={styles.medicationSummaryItem}>
            <Text style={styles.medicationCount}>98%</Text>
            <Text style={styles.medicationLabel}>Adherence Rate</Text>
          </View>
        </View>
        
        <View style={styles.medicationActions}>
          <TouchableOpacity 
            style={styles.medicationActionButton}
            onPress={() => navigation.navigate('AddMedication')}
          >
            <Icon name="add-circle-outline" size={24} color="#1167FE" />
            <Text style={styles.actionButtonText}>Add Medication</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.medicationActionButton}
            onPress={() => navigation.navigate('ScanMedication')}
          >
            <Icon name="qr-code-scanner" size={24} color="#1167FE" />
            <Text style={styles.actionButtonText}>Scan Medication</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.upcomingMedication}>
          <Text style={styles.upcomingTitle}>Upcoming Medication</Text>
          <View style={styles.upcomingCard}>
            <View style={styles.upcomingIconContainer}>
              <Icon name="medication" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.upcomingDetails}>
              <Text style={styles.upcomingMedName}>Amoxicillin</Text>
              <Text style={styles.upcomingDosage}>500mg • Once daily</Text>
              <Text style={styles.upcomingTime}>Today, 8:00 PM</Text>
            </View>
            <TouchableOpacity style={styles.upcomingTakeButton}>
              <Text style={styles.upcomingTakeText}>Take</Text>
            </TouchableOpacity>
          </View>
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
  seeAllText: {
    color: '#1167FE',
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
  medicationSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  medicationSummaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  medicationCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1167FE',
  },
  medicationLabel: {
    fontSize: 14,
    color: '#666666',
  },
  medicationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  medicationActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 12,
    flex: 0.48,
  },
  actionButtonText: {
    marginLeft: 8,
    color: '#1167FE',
    fontWeight: '500',
  },
  upcomingMedication: {
    marginTop: 8,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 12,
  },
  upcomingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1167FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upcomingDetails: {
    flex: 1,
    marginLeft: 12,
  },
  upcomingMedName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  upcomingDosage: {
    fontSize: 14,
    color: '#666666',
  },
  upcomingTime: {
    fontSize: 12,
    color: '#1167FE',
  },
  upcomingTakeButton: {
    backgroundColor: '#1167FE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  upcomingTakeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default MedicationManagement; 