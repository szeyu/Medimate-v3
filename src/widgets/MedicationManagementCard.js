import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/MaterialIcons';

const MedicationManagementCard = () => {

  const navigation = useNavigation();

  // Custom grid data to match the image
  const gridData = [
    // Row 1 - Darker grays to blues
    ['#3D475E', '#718096', '#9EA7B7', '#DCE1E8', '#DCE1E8', '#DCE1E8', '#DCE1E8', '#A6CBFF', '#458CFF', '#1167FE'],
    // Row 2 - Blues to reds
    ['#1167FE', '#1167FE', '#458CFF', '#A6CBFF', '#FFD8DD', '#FF8391', '#FA4E5E', '#FF8391', '#FFD8DD', '#E8ECF4'],
    // Row 3 - Blues to grays
    ['#1167FE', '#1167FE', '#458CFF', '#A6CBFF', '#DCE1E8', '#DCE1E8', '#DCE1E8', '#9EA7B7', '#718096', '#3D475E'],
  ];

  return (
    <View>
      <View style={styles.labelRow}>
        <Text style={styles.sectionTitle}>Medication Management</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MedicationSchedule')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.medicationCard}>
        <View style={styles.medicationHeader}>
          <View>
            <Text style={styles.medicationCount}>205</Text>
            <Text style={styles.medicationLabel}>Medications</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('AddMedication')}
          >
            <Icon name="add" size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.monthLabel}>
          <Text style={styles.monthText}>May</Text>
        </View>
        
        <View style={styles.customGridContainer}>
          {gridData.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.gridRow}>
              {row.map((color, colIndex) => (
                <View 
                  key={`cell-${rowIndex}-${colIndex}`} 
                  style={[styles.gridCell, { backgroundColor: color }]} 
                />
              ))}
            </View>
          ))}
        </View>
        
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#1167FE' }]} />
            <Text style={styles.legendText}>Taken</Text>
          </View>
          
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FA4E5E' }]} />
            <Text style={styles.legendText}>Missed</Text>
          </View>
          
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#DCE1E8' }]} />
            <Text style={styles.legendText}>Skipped</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    color: '#1167FE',
    fontSize: 14,
    fontWeight: '500',
  },
  medicationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  medicationCount: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
  },
  medicationLabel: {
    fontSize: 20,
    color: '#9EA7B7',
    marginTop: 2,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#1167FE',
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginRight: 5,
  },
  monthLabel: {
    alignItems: 'center',
    marginBottom: 10,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  customGridContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  gridCell: {
    width: 28,
    height: 28,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
})

export default MedicationManagementCard;