import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Modal,
  Animated,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMedications } from '../../providers/MedicationProvider';

const PillTakenScreen = ({ route, navigation }) => {
  const { medication } = route.params;
  const { markMedicationAsTaken } = useMedications();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Show the confirmation modal immediately
    setShowConfirmation(true);
  }, []);

  const handleConfirmTaken = async () => {
    // Mark medication as taken in the provider
    await markMedicationAsTaken(medication.id);
    
    // Hide confirmation modal
    setShowConfirmation(false);
    
    // Show success message
    setShowSuccess(true);
    
    // Animate the success message
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    
    // Navigate back to MedicationList screen after a delay
    setTimeout(() => {
      navigation.navigate('MedicationList');
    }, 2000);
  };

  const handleCancel = () => {
    // Just go back to the medication screen
    navigation.goBack();
  };

  const handleEdit = () => {
    // Navigate to the edit screen with the medication data
    navigation.navigate('AddMedication', { 
      medicationData: medication,
      isEditing: true
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background content (medication screen) */}
      <View style={styles.backgroundContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Medication Details</Text>
          <View style={styles.backButton} />
        </View>
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.medicationCard}>
            <View style={styles.medicationHeader}>
              <View style={styles.medicationIconContainer}>
                <FontAwesome5 name="pills" size={24} color="#8A3FFC" />
              </View>
              <View style={styles.medicationTitleContainer}>
                <Text style={styles.medicationName}>{medication.name}</Text>
                <Text style={styles.medicationDosage}>{medication.dosage}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Icon name="schedule" size={20} color="#8A3FFC" />
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Time</Text>
                  <Text style={styles.detailValue}>{medication.time}</Text>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Icon name="repeat" size={20} color="#8A3FFC" />
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Frequency</Text>
                  <Text style={styles.detailValue}>{medication.frequency}</Text>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Icon name="restaurant" size={20} color="#8A3FFC" />
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Instructions</Text>
                  <Text style={styles.detailValue}>{medication.instructions}</Text>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Icon name="calendar-today" size={20} color="#8A3FFC" />
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Start Date</Text>
                  <Text style={styles.detailValue}>{formatDate(medication.startDate)}</Text>
                </View>
              </View>
              
              {medication.duration && (
                <View style={styles.detailRow}>
                  <View style={styles.detailIconContainer}>
                    <Icon name="hourglass-empty" size={20} color="#8A3FFC" />
                  </View>
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>Duration</Text>
                    <Text style={styles.detailValue}>{medication.duration}</Text>
                  </View>
                </View>
              )}
              
              {medication.description && (
                <View style={styles.detailRow}>
                  <View style={styles.detailIconContainer}>
                    <Icon name="description" size={20} color="#8A3FFC" />
                  </View>
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>Description</Text>
                    <Text style={styles.detailValue}>{medication.description}</Text>
                  </View>
                </View>
              )}
              
              {medication.cost > 0 && (
                <View style={styles.detailRow}>
                  <View style={styles.detailIconContainer}>
                    <Icon name="attach-money" size={20} color="#8A3FFC" />
                  </View>
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>Monthly Cost</Text>
                    <Text style={styles.detailValue}>RM {medication.cost.toFixed(2)}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
      
      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmation}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image 
              source={require('../../../assets/MedicationPill.png')} 
              style={styles.pillIcon}
              resizeMode="contain"
            />
            
            <Text style={styles.modalTitle}>Take Medication</Text>
            
            <Text style={styles.modalText}>
              Are you about to take {medication.name} {medication.dosage}?
            </Text>
            
            <View style={styles.medicationSummary}>
              <View style={styles.summaryRow}>
                <Icon name="schedule" size={16} color="#8A3FFC" />
                <Text style={styles.summaryText}>{medication.time}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Icon name="restaurant" size={16} color="#8A3FFC" />
                <Text style={styles.summaryText}>{medication.instructions}</Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmTaken}
            >
              <Text style={styles.confirmButtonText}>Yes, I'm taking it now</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEdit}
            >
              <Text style={styles.editButtonText}>Edit Medication</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Success Modal */}
      <Modal
        visible={showSuccess}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.successContent,
              { opacity: fadeAnim }
            ]}
          >
            <Icon name="check-circle" size={80} color="#4CAF50" />
            <Text style={styles.successTitle}>Great Job!</Text>
            <Text style={styles.successText}>
              You've taken your {medication.name} for today.
            </Text>
            <Text style={styles.successSubtext}>
              Next dose: Tomorrow at {medication.time}
            </Text>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  backgroundContent: {
    flex: 1,
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F5F9',
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
  scrollContent: {
    padding: 20,
  },
  medicationCard: {
    backgroundColor: '#FFFFFF',
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
    alignItems: 'center',
    marginBottom: 16,
  },
  medicationIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0E6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  medicationTitleContainer: {
    flex: 1,
  },
  medicationName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  medicationDosage: {
    fontSize: 16,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F5F9',
    marginVertical: 16,
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0E6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  pillIcon: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  medicationSummary: {
    width: '100%',
    backgroundColor: '#F0E6FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  confirmButton: {
    backgroundColor: '#8A3FFC',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#F0E6FF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#8A3FFC',
  },
  editButtonText: {
    color: '#8A3FFC',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#F3F5F9',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  successContent: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  successSubtext: {
    fontSize: 14,
    color: '#8A3FFC',
    textAlign: 'center',
    fontWeight: '500',
  }
});

export default PillTakenScreen;