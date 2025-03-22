import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useMedications } from '../providers/MedicationProvider';

const ScanMedicationScreen = ({ navigation }) => {
  const { medications, isLoading } = useMedications();

  const renderMedicationCard = ({ item }) => (
    <TouchableOpacity
      style={styles.medicationCard}
      onPress={() => navigation.navigate('Scan')}
    >
      <View style={styles.cardContent}>
        <View style={styles.medicationIcon}>
          <Icon name="medication" size={24} color="#1167FE" />
        </View>
        <View style={styles.medicationInfo}>
          <Text style={styles.medicationName}>{item.name}</Text>
          <Text style={styles.medicationDetails}>{item.dosage} • {item.frequency}</Text>
          <Text style={styles.medicationTime}>{item.time}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: item.isActive ? '#4CAF50' : '#F44336' }
          ]} />
          <Text style={styles.statusText}>
            {item.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyImageContainer}>
        <Image
          source={require('../../assets/scannedMedication.png')}
          style={styles.emptyImage}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.emptyTitle}>Amoxiciline</Text>
      <Text style={styles.emptyDescription}>
        Successfully analyzed !!
      </Text>
      {/* Medication Info Icons */}
      <View style={styles.medicationInfoContainer}>
        <View style={styles.infoItem}>
          <View style={[styles.infoIcon, { backgroundColor: '#242E49' }]}>
            <Icon name="warning" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.infoText}>High Risk</Text>
        </View>
        
        <View style={styles.infoItem}>
          <View style={[styles.infoIcon, { backgroundColor: '#FA4E5E' }]}>
            <Icon name="shield" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.infoText}>Antibiotic</Text>
        </View>
        
        <View style={styles.infoItem}>
          <View style={[styles.infoIcon, { backgroundColor: '#893FFC' }]}>
            <Icon name="schedule" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.infoText}>2× Daily</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddMedication')}
      >
        <Text style={styles.seeDetailsButtonText}>See Details</Text>
        <Icon name="arrow-forward" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Scan')}
        >
          <Icon name="arrow-back" size={20} color="#000000" />
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1167FE" />
        </View>
      ) : (
        <FlatList
          data={medications}
          renderItem={renderMedicationCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[
            styles.listContainer,
            medications.length === 0 && styles.emptyListContainer
          ]}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F5F9',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(2, 1, 1, 0.2)',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  medicationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  medicationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(17, 103, 254, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicationInfo: {
    flex: 1,
    marginLeft: 16,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  medicationDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  medicationTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyImageContainer: {
    width: 200,
    height: 200,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 100,
  },
  emptyImage: {
    width: 300,
    height: 300,
  },
  emptyTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 48,
    color: '#333333',
  },
  emptyDescription: {
    fontSize: 18,
    color: '#6B778F',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    maxWidth: '80%',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#1167FE',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  scanButton: {
    flexDirection: 'row',
    backgroundColor: '#1167FE',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    marginTop: 20,
  },
  seeDetailsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicationInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  infoItem: {
    alignItems: 'center',
    width: '30%',
  },
  infoIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
});

export default ScanMedicationScreen;