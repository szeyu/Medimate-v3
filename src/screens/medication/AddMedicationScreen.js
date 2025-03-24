import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Modal,
  FlatList,
  SafeAreaView,
  Image,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useMedications } from '../../providers/MedicationProvider';

const AddMedicationScreen = ({ route, navigation }) => {
  const { medicationData, isEditing } = route.params || {};
  const { addMedication, editMedication } = useMedications();
  
  // Form state
  const [name, setName] = useState(medicationData?.name || '');
  const [description, setDescription] = useState(medicationData?.description || '');
  const [dosage, setDosage] = useState(medicationData?.dosage || '');
  const [frequency, setFrequency] = useState(medicationData?.frequency || 'Once daily');
  const [time, setTime] = useState(medicationData?.time || '8:00 AM');
  const [startDate, setStartDate] = useState(medicationData?.startDate ? new Date(medicationData.startDate) : new Date());
  const [duration, setDuration] = useState(medicationData?.duration || '4 weeks');
  const [instructions, setInstructions] = useState(medicationData?.instructions || 'Take with food');
  const [cost, setCost] = useState(medicationData?.cost ? String(medicationData.cost) : '');
  
  // UI state
  const [showFrequencyModal, setShowFrequencyModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  
  // Options for dropdowns
  const frequencyOptions = [
    'Once daily',
    'Twice daily',
    '3 times daily',
    'Every other day',
    'Once weekly',
    'As needed'
  ];
  
  const timeOptions = [
    '6:00 AM',
    '7:00 AM',
    '8:00 AM',
    '12:00 PM',
    '1:00 PM',
    '6:00 PM',
    '8:00 PM',
    '10:00 PM'
  ];
  
  const durationOptions = [
    '1 week',
    '2 weeks',
    '4 weeks',
    '6 weeks',
    '8 weeks',
    '3 months',
    '6 months',
    'Ongoing'
  ];
  
  const instructionOptions = [
    'Take with food',
    'Take on empty stomach',
    'Take before meals',
    'Take after meals',
    'Take with water',
    'Do not take with dairy',
    'Take at bedtime'
  ];

  // Format date for display
  const formatDate = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  // Handle date change
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  // Add this state to track the estimated cost
  const [estimatedCost, setEstimatedCost] = useState(112.68);

  // Update the cost change handler
  const handleCostChange = (value) => {
    setCost(value);
    // Update the estimated cost in the card
    const newCost = parseFloat(value) || 0;
    const oldCost = medicationData?.cost || 0;
    
    if (isEditing) {
      // If editing, only show the difference in cost
      const costDifference = newCost - oldCost;
      setEstimatedCost(112.68 + costDifference);
    } else {
      // If adding new, show the total with new cost
      setEstimatedCost(112.68 + newCost);
    }
  };

  // Save medication
  const handleSaveMedication = async () => {
    const updatedMedication = {
      name,
      dosage,
      frequency,
      time,
      instructions,
      isActive: true,
      startDate: startDate.toISOString(),
      endDate: null, // Calculate based on duration
      mealOption: instructions.includes('with food') ? 'With Food' : 
                 instructions.includes('empty stomach') ? 'Before Food' : 'After Food',
      cost: parseFloat(cost) || 0,
      description,
      duration,
    };
    
    if (isEditing) {
      // Update existing medication
      await editMedication(medicationData.id, updatedMedication);
    } else {
      // Add new medication
      await addMedication(updatedMedication);
    }
    
    // Navigate back to medication screen
    navigation.navigate('MedicationList');
  };

  // Existing medications for preview
  const existingMedications = [
    {
      id: '1',
      name: 'Vitamin C',
      dosage: '100mg',
      frequency: '1x Per Day',
      time: '7:00 AM',
      instructions: 'Before Breakfast',
    },
    {
      id: '2',
      name: 'Painexal',
      dosage: '500mg',
      frequency: '2x Per Day',
      time: '10:00 AM',
      instructions: 'After Breakfast',
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit Medication' : 'Add Medication'}
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Financial Cost Card */}
        <View style={styles.cardContainer}>
          <LinearGradient
            colors={['#8A3FFC', '#6610F2']}
            style={styles.cardGradient}
          >
            <Text style={styles.cardLabel}>ESTIMATED MONTHLY EXPENSES</Text>
            <Text style={styles.cardAmount}>RM {estimatedCost.toFixed(2)}</Text>
            <Text style={styles.cardSubtext}>Including this medication</Text>
          </LinearGradient>
        </View>
        
        {/* Form Title */}
        <View style={styles.formTitleContainer}>
          <Text style={styles.formTitle}>Medication Details</Text>
          <Text style={styles.formSubtitle}>
            {medicationData ? "Review the scanned information" : "Enter medication information"}
          </Text>
        </View>
        
        {/* Medication Form */}
        <View style={styles.formContainer}>
          {/* Medication Name */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Medication Name</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter medication name"
            />
          </View>
          
          {/* Medication Description */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter medication description"
              multiline
              numberOfLines={3}
            />
          </View>
          
          {/* Dosage */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Dosage</Text>
            <TextInput
              style={styles.textInput}
              value={dosage}
              onChangeText={setDosage}
              placeholder="Enter dosage (e.g., 50mg)"
            />
          </View>
          
          {/* Frequency */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Frequency</Text>
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => setShowFrequencyModal(true)}
            >
              <Text style={styles.selectInputText}>{frequency}</Text>
              <Icon name="arrow-drop-down" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          {/* Time */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Time</Text>
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => setShowTimeModal(true)}
            >
              <Text style={styles.selectInputText}>{time}</Text>
              <Icon name="access-time" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          {/* Start Date */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Start Date</Text>
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.selectInputText}>{formatDate(startDate)}</Text>
              <Icon name="calendar-today" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          {/* Duration */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Duration</Text>
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => setShowDurationModal(true)}
            >
              <Text style={styles.selectInputText}>{duration}</Text>
              <Icon name="arrow-drop-down" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          {/* Instructions */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Instructions</Text>
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => setShowInstructionsModal(true)}
            >
              <Text style={styles.selectInputText}>{instructions}</Text>
              <Icon name="arrow-drop-down" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          {/* Cost */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Monthly Cost (RM)</Text>
            <TextInput
              style={styles.textInput}
              value={cost}
              onChangeText={handleCostChange}
              placeholder="Enter monthly cost"
              keyboardType="numeric"
            />
            <Text style={styles.helperText}>This will update your estimated monthly expenses</Text>
          </View>
        </View>
        
        {/* Preview Section */}
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Schedule Preview</Text>
          
          {/* Existing medications */}
          {existingMedications.map(med => (
            <View key={med.id} style={styles.medicationItem}>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{med.time}</Text>
                <View style={styles.timeConnector} />
              </View>
              
              <View style={styles.medicationDetails}>
                <View style={styles.medicationNameContainer}>
                  <Text style={styles.medicationName}>{med.name} {med.dosage}</Text>
                  <Text style={styles.medicationInstructions}>
                    {med.frequency} • {med.instructions}
                  </Text>
                </View>
                
                <View style={styles.checkboxContainer}>
                  <View style={styles.checkbox} />
                </View>
              </View>
            </View>
          ))}
          
          {/* New medication preview */}
          <View style={styles.medicationItem}>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{time}</Text>
              <View style={styles.timeConnector} />
            </View>
            
            <View style={[styles.medicationDetails, styles.newMedicationDetails]}>
              <View style={styles.medicationNameContainer}>
                <Text style={styles.medicationName}>{name || 'New Medication'} {dosage}</Text>
                <Text style={styles.medicationInstructions}>
                  {frequency} • {instructions}
                </Text>
              </View>
              
              <View style={styles.checkboxContainer}>
                <View style={styles.checkbox}>
                  <Icon name="add" size={16} color="#8A3FFC" />
                </View>
              </View>
            </View>
          </View>
        </View>
        
        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveMedication}
        >
          <Text style={styles.saveButtonText}>SAVE MEDICATION</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Frequency Modal */}
      <Modal
        visible={showFrequencyModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Frequency</Text>
            <FlatList
              data={frequencyOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setFrequency(item);
                    setShowFrequencyModal(false);
                  }}
                >
                  <Text 
                    style={[
                      styles.modalOptionText,
                      frequency === item && styles.modalOptionTextSelected
                    ]}
                  >
                    {item}
                  </Text>
                  {frequency === item && (
                    <Icon name="check" size={20} color="#8A3FFC" />
                  )}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowFrequencyModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Time Modal */}
      <Modal
        visible={showTimeModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Time</Text>
            <FlatList
              data={timeOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setTime(item);
                    setShowTimeModal(false);
                  }}
                >
                  <Text 
                    style={[
                      styles.modalOptionText,
                      time === item && styles.modalOptionTextSelected
                    ]}
                  >
                    {item}
                  </Text>
                  {time === item && (
                    <Icon name="check" size={20} color="#8A3FFC" />
                  )}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowTimeModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      
      {/* Duration Modal */}
      <Modal
        visible={showDurationModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Duration</Text>
            <FlatList
              data={durationOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setDuration(item);
                    setShowDurationModal(false);
                  }}
                >
                  <Text 
                    style={[
                      styles.modalOptionText,
                      duration === item && styles.modalOptionTextSelected
                    ]}
                  >
                    {item}
                  </Text>
                  {duration === item && (
                    <Icon name="check" size={20} color="#8A3FFC" />
                  )}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowDurationModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Instructions Modal */}
      <Modal
        visible={showInstructionsModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Instructions</Text>
            <FlatList
              data={instructionOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setInstructions(item);
                    setShowInstructionsModal(false);
                  }}
                >
                  <Text 
                    style={[
                      styles.modalOptionText,
                      instructions === item && styles.modalOptionTextSelected
                    ]}
                  >
                    {item}
                  </Text>
                  {instructions === item && (
                    <Icon name="check" size={20} color="#8A3FFC" />
                  )}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowInstructionsModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  cardContainer: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardGradient: {
    padding: 20,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 8,
  },
  cardAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  formTitleContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F3F5F9',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  selectInput: {
    backgroundColor: '#F3F5F9',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectInputText: {
    fontSize: 16,
    color: '#333',
  },
  previewContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  medicationItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timeContainer: {
    alignItems: 'center',
    width: 60,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  timeConnector: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
  },
  medicationDetails: {
    flex: 1,
    backgroundColor: '#F3F5F9',
    borderRadius: 12,
    padding: 16,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  newMedicationDetails: {
    backgroundColor: '#F0E6FF', // Light purple to highlight new medication
    borderWidth: 1,
    borderColor: '#8A3FFC',
  },
  medicationNameContainer: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  medicationInstructions: {
    fontSize: 14,
    color: '#666',
  },
  checkboxContainer: {
    marginLeft: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8A3FFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#8A3FFC',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#8A3FFC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F5F9',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  modalOptionTextSelected: {
    color: '#8A3FFC',
    fontWeight: 'bold',
  },
  modalCloseButton: {
    backgroundColor: '#F3F5F9',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  modalCloseButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default AddMedicationScreen;