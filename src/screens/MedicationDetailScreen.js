import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useMedications } from '../providers/MedicationProvider';

const MedicationDetailScreen = ({ route, navigation }) => {
  const { medication } = route.params;
  const { toggleMedicationStatus, deleteMedication } = useMedications();

  const showDeleteConfirmation = () => {
    Alert.alert(
      "Delete Medication",
      "Are you sure you want to delete this medication?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => {
            deleteMedication(medication.id);
            navigation.goBack();
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleStatusToggle = (value) => {
    toggleMedicationStatus(medication.id, value);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{medication.name}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={showDeleteConfirmation}
        >
          <Icon name="delete" size={24} color="#F44336" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.medicationHeader}>
          <View style={styles.medicationIcon}>
            <Icon name="medication" size={30} color="#1167FE" />
          </View>
          <View style={styles.medicationHeaderInfo}>
            <Text style={styles.medicationName}>{medication.name}</Text>
            <Text style={styles.medicationDate}>
              Added on: {new Date().toISOString().split('T')[0]}
            </Text>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Icon name="scale" size={22} color="#1167FE" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Dosage</Text>
            <Text style={styles.detailValue}>{medication.dosage}</Text>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Icon name="repeat" size={22} color="#1167FE" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Frequency</Text>
            <Text style={styles.detailValue}>{medication.frequency}</Text>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Icon name="access-time" size={22} color="#1167FE" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>{medication.time}</Text>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Icon name="info-outline" size={22} color="#1167FE" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Instructions</Text>
            <Text style={styles.detailValue}>{medication.instructions}</Text>
          </View>
        </View>

        <View style={styles.statusToggle}>
          <Text style={styles.statusLabel}>Active Status</Text>
          <Switch
            value={medication.isActive}
            onValueChange={handleStatusToggle}
            trackColor={{ false: "#767577", true: "#1167FE" }}
            thumbColor="#f4f3f4"
          />
        </View>

        <View style={styles.qrCodeSection}>
          <Text style={styles.sectionTitle}>Medication QR Code</Text>
          <View style={styles.qrCodeContainer}>
            <Icon name="qr-code" size={150} color="#1167FE" />
          </View>
        </View>

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Medication History</Text>
          <Text style={styles.historyText}>No history available</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 8,
  },
  content: {
    padding: 16,
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  medicationIcon: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: 'rgba(17, 103, 254, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicationHeaderInfo: {
    marginLeft: 16,
  },
  medicationName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  medicationDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  detailSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 4,
  },
  statusToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  qrCodeSection: {
    marginTop: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  qrCodeContainer: {
    width: 200,
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  historySection: {
    marginTop: 40,
  },
  historyText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MedicationDetailScreen;