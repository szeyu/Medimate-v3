import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const MedicationScheduleScreen = ({ route, navigation }) => {
  const { medications } = route.params || { medications: [] };
  const [selectedDayIndex, setSelectedDayIndex] = useState(2); // Default to Wednesday (index 2)
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const days = [15, 16, 17, 18, 19, 20, 21]; // Example days
  
  const renderWeekdayItem = ({ item, index }) => {
    const isSelected = index === selectedDayIndex;
    return (
      <TouchableOpacity
        style={[
          styles.dayItem,
          isSelected && styles.selectedDayItem
        ]}
        onPress={() => setSelectedDayIndex(index)}
      >
        <Text style={[
          styles.weekdayText,
          isSelected && styles.selectedWeekdayText
        ]}>
          {weekdays[index]}
        </Text>
        <Text style={[
          styles.dayText,
          isSelected && styles.selectedDayText
        ]}>
          {days[index]}
        </Text>
        {isSelected && <View style={styles.selectedDot} />}
      </TouchableOpacity>
    );
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMedication(null);
  };
  
  const renderTimelineItem = ({ item, index }) => {
    return (
      <TouchableOpacity
      style={styles.medicationCard}
      onPress={() => {
        setSelectedMedication(item);
        setModalVisible(true);
      }}
    >

        <View style={styles.medicationIconContainer}>
          <Icon name="medication" size={24} color="#4A5568" />
        </View>
        
        <View style={styles.medicationContent}>
          <Text style={styles.medicationName}>{item.name}</Text>
          <View style={styles.medicationDetails}>
            <Text style={styles.medicationInstructions}>{item.instructions}</Text>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.medicationDosage}>{item.dosage}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.checkboxContainer}
          onPress={(e) => {
            // Stop propagation to prevent card navigation
            e.stopPropagation();
            // Add your checkbox toggle logic here
            const updatedData = [...timelineData];
            // Toggle the taken status
            updatedData[index].taken = !updatedData[index].taken;
          }}
        >
          <View style={[styles.checkbox, item.taken && styles.checkboxChecked]}>
            {item.taken && <Icon name="check" size={18} color="#FFFFFF" />}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  
  
  // Example timeline data
  const timelineData = [
    { 
      time: '08:00 AM', 
      name: 'Amoxicilline', 
      dosage: '250mg', 
      instructions: 'Before Eating',
      taken: true 
    },
    { 
      time: '12:00 PM', 
      name: 'Losartan', 
      dosage: '500mg', 
      instructions: 'After eating',
      taken: false 
    },
    { 
      time: '06:00 PM', 
      name: 'Albuterol', 
      dosage: '1kg', 
      instructions: 'Before Eating',
      taken: true 
    },
  ];
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('HomeScreen')}
        >
          <Icon name="arrow-back" size={20} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Medications</Text>
      </View>
      
      <View style={styles.weekdaySelector}>
        <FlatList
          horizontal
          data={weekdays}
          renderItem={renderWeekdayItem}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekdayList}
        />
      </View>
      
      <FlatList
        data={timelineData}
        renderItem={renderTimelineItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.timelineContainer}
      />

      {/* Medication Detail Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Pill Image */}
            <View style={styles.pillImageContainer}>
              <Image source={require('../../../assets/MedicationPill.png')} style={styles.pillImage} />
            </View>
            
            {/* Medication Details */}
            <Text style={styles.modalMedicationName}>
              {selectedMedication?.name}
            </Text>
            
            <View style={styles.modalMedicationDetails}>
              <MaterialCommunityIcons name="pill" size={16} color="#718096" />
              <Text style={styles.modalMedicationText}>2x Pills</Text>
              <Text style={styles.modalBulletPoint}>•</Text>
              <MaterialCommunityIcons name="silverware-fork-knife" size={16} color="#718096" />
              <Text style={styles.modalMedicationText}>
                {selectedMedication?.instructions}
              </Text>
            </View>
            
            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <View style={styles.buttonColumn}>
                <TouchableOpacity style={styles.skipButton} onPress={closeModal}>
                  <Icon name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.skipButtonText}>Skip</Text>
              </View>
              
              <View style={styles.buttonColumn}>
                <TouchableOpacity style={styles.rescheduleButton} onPress={closeModal}>
                  <Icon name="calendar-today" size={24} color="#1167FE" />
                </TouchableOpacity>
                <Text style={styles.rescheduleButtonText}>Reschedule</Text>
              </View>
              
              <View style={styles.buttonColumn}>
                <TouchableOpacity style={styles.takeButton} 
                  onPress={() => {
                    closeModal();
                    navigation.navigate('PillTaken');
                  }}
                >
                  <Icon name="add" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.takeButtonText}>Take</Text>
              </View>
            </View>
            
            {/* Close Button */}
            <TouchableOpacity 
              style={styles.closeModalButton} 
              onPress={closeModal}
            >
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F5F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F3F5F9',
    marginTop: 40,
  },
  backButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(2, 1, 1, 0.2)',
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  weekdaySelector: {
    paddingVertical: 10,
    backgroundColor: '#F3F5F9',
  },
  weekdayList: {
    paddingHorizontal: 10,
  },
  dayItem: {
    width: 70,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedDayItem: {
    backgroundColor: '#1167FE',
  },
  weekdayText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  selectedWeekdayText: {
    color: '#FFFFFF',
  },
  dayText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  selectedDayText: {
    color: '#FFFFFF',
  },
  selectedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginTop: 6,
  },
  timelineContainer: {
    padding: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timeColumn: {
    width: 80,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: '#666666',
  },
  timelineLine: {
    width: 20,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1167FE',
  },
  timelineConnector: {
    width: 2,
    flex: 1,
    backgroundColor: '#1167FE',
    marginTop: 4,
  },
  medicationColumn: {
    flex: 1,
  },
  medicationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  medicationIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F3F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  medicationContent: {
    flex: 1,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  medicationDosage: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  medicationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicationInstructions: {
    fontSize: 16,
    color: '#718096',
  },
  bulletPoint: {
    fontSize: 16,
    color: '#718096',
    marginHorizontal: 6,
  },
  medicationDosage: {
    fontSize: 16,
    color: '#718096',
  },
  checkboxContainer: {
    marginLeft: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#718096',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1167FE',
    borderColor: '#1167FE',
  },
  // Add modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    position: 'relative',
  },
  pillImageContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    marginTop: 35,
  },
  pillImage: {
    width: 250,
    height: 250,
    // borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  handIllustration: {
    position: 'absolute',
    width: 200,
    height: 100,
    backgroundColor: 'rgba(255, 182, 193, 0.5)', // Light pink for the hand
    borderRadius: 50,
    transform: [{ rotate: '-30deg' }],
    bottom: 30,
  },
  modalMedicationName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
    color: '#333',
  },
  modalMedicationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalMedicationText: {
    fontSize: 16,
    color: '#718096',
    marginLeft: 4,
    marginRight: 8,
  },
  modalBulletPoint: {
    fontSize: 16,
    color: '#718096',
    marginHorizontal: 4,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
  },
  buttonColumn: {
    alignItems: 'center',
    width: '30%',
  },
  skipButton: {
    backgroundColor: '#FF4757',
    borderRadius: 16,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  rescheduleButton: {
    backgroundColor: '#EDF2F7',
    borderRadius: 16,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  takeButton: {
    backgroundColor: '#1167FE',
    borderRadius: 16,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  skipButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  rescheduleButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  takeButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  closeModalButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 4,
  },
});

export default MedicationScheduleScreen;