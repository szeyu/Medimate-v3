import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';

const ScanMedicationScreen = ({ navigation }) => {
  // Sample medications that could be scanned
  const sampleMedications = [
    {
      id: '1',
      name: 'Vitamin B12',
      dosage: '50mcg',
      description: 'Supports red blood cell production',
      image: require('../../../assets/medicationSample.png')
    },
    {
      id: '2',
      name: 'Amoxicillin',
      dosage: '500mg',
      description: 'Antibiotic for bacterial infections',
      image: require('../../../assets/medicationSample.png')
    },
    {
      id: '3',
      name: 'Lisinopril',
      dosage: '10mg',
      description: 'Used to treat high blood pressure',
      image: require('../../../assets/medicationSample.png')
    }
  ];

  const renderMedicationItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.medicationItem}
      onPress={() => navigation.navigate('MedicationDescription', { medication: item })}
    >
      <Image source={item.image} style={styles.medicationImage} />
      <View style={styles.medicationInfo}>
        <Text style={styles.medicationName}>{item.name} {item.dosage}</Text>
        <Text style={styles.medicationDescription}>{item.description}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#8A3FFC" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Medication</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.infoContainer}>
        <Icon name="info-outline" size={24} color="#8A3FFC" style={styles.infoIcon} />
        <Text style={styles.infoText}>
          Scan your medication label to automatically add it to your schedule
        </Text>
      </View>

      <View style={styles.scanButtonContainer}>
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={() => navigation.navigate('Scan')}
        >
          <Ionicons name="camera" size={24} color="#FFFFFF" style={styles.scanIcon} />
          <Text style={styles.scanButtonText}>Scan Medication Label</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recentContainer}>
        <Text style={styles.recentTitle}>Recently Scanned Medications</Text>
        <FlatList
          data={sampleMedications}
          renderItem={renderMedicationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.medicationList}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0E6FF',
    padding: 16,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  scanButtonContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  scanButton: {
    backgroundColor: '#8A3FFC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  scanIcon: {
    marginRight: 8,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  recentContainer: {
    flex: 1,
    marginTop: 24,
    paddingHorizontal: 20,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  medicationList: {
    paddingBottom: 20,
  },
  medicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medicationImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 16,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  medicationDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default ScanMedicationScreen;