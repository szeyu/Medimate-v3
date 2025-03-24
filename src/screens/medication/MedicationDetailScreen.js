// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   Switch
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useMedications } from '../providers/MedicationProvider';

// const MedicationDetailScreen = ({ route, navigation }) => {
//   const { medication } = route.params;
//   const { toggleMedicationStatus, deleteMedication } = useMedications();

//   const showDeleteConfirmation = () => {
//     Alert.alert(
//       "Delete Medication",
//       "Are you sure you want to delete this medication?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel"
//         },
//         { 
//           text: "Delete", 
//           onPress: () => {
//             deleteMedication(medication.id);
//             navigation.goBack();
//           },
//           style: "destructive"
//         }
//       ]
//     );
//   };

//   const handleStatusToggle = (value) => {
//     toggleMedicationStatus(medication.id, value);
//     navigation.goBack();
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Icon name="arrow-back" size={24} color="#000000" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{medication.name}</Text>
//         <TouchableOpacity
//           style={styles.deleteButton}
//           onPress={showDeleteConfirmation}
//         >
//           <Icon name="delete" size={24} color="#F44336" />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.content}>
//         <View style={styles.medicationHeader}>
//           <View style={styles.medicationIcon}>
//             <Icon name="medication" size={30} color="#1167FE" />
//           </View>
//           <View style={styles.medicationHeaderInfo}>
//             <Text style={styles.medicationName}>{medication.name}</Text>
//             <Text style={styles.medicationDate}>
//               Added on: {new Date().toISOString().split('T')[0]}
//             </Text>
//           </View>
//         </View>

//         <View style={styles.detailSection}>
//           <Icon name="scale" size={22} color="#1167FE" />
//           <View style={styles.detailContent}>
//             <Text style={styles.detailLabel}>Dosage</Text>
//             <Text style={styles.detailValue}>{medication.dosage}</Text>
//           </View>
//         </View>

//         <View style={styles.detailSection}>
//           <Icon name="repeat" size={22} color="#1167FE" />
//           <View style={styles.detailContent}>
//             <Text style={styles.detailLabel}>Frequency</Text>
//             <Text style={styles.detailValue}>{medication.frequency}</Text>
//           </View>
//         </View>

//         <View style={styles.detailSection}>
//           <Icon name="access-time" size={22} color="#1167FE" />
//           <View style={styles.detailContent}>
//             <Text style={styles.detailLabel}>Time</Text>
//             <Text style={styles.detailValue}>{medication.time}</Text>
//           </View>
//         </View>

//         <View style={styles.detailSection}>
//           <Icon name="info-outline" size={22} color="#1167FE" />
//           <View style={styles.detailContent}>
//             <Text style={styles.detailLabel}>Instructions</Text>
//             <Text style={styles.detailValue}>{medication.instructions}</Text>
//           </View>
//         </View>

//         <View style={styles.statusToggle}>
//           <Text style={styles.statusLabel}>Active Status</Text>
//           <Switch
//             value={medication.isActive}
//             onValueChange={handleStatusToggle}
//             trackColor={{ false: "#767577", true: "#1167FE" }}
//             thumbColor="#f4f3f4"
//           />
//         </View>

//         <View style={styles.qrCodeSection}>
//           <Text style={styles.sectionTitle}>Medication QR Code</Text>
//           <View style={styles.qrCodeContainer}>
//             <Icon name="qr-code" size={150} color="#1167FE" />
//           </View>
//         </View>

//         <View style={styles.historySection}>
//           <Text style={styles.sectionTitle}>Medication History</Text>
//           <Text style={styles.historyText}>No history available</Text>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//     backgroundColor: '#FFFFFF',
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   deleteButton: {
//     padding: 8,
//   },
//   content: {
//     padding: 16,
//   },
//   medicationHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   medicationIcon: {
//     width: 60,
//     height: 60,
//     borderRadius: 15,
//     backgroundColor: 'rgba(17, 103, 254, 0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   medicationHeaderInfo: {
//     marginLeft: 16,
//   },
//   medicationName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   medicationDate: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 4,
//   },
//   detailSection: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     paddingVertical: 8,
//   },
//   detailContent: {
//     marginLeft: 12,
//     flex: 1,
//   },
//   detailLabel: {
//     fontSize: 16,
//     color: '#666',
//   },
//   detailValue: {
//     fontSize: 18,
//     fontWeight: '500',
//     marginTop: 4,
//   },
//   statusToggle: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//     padding: 16,
//     borderRadius: 12,
//     marginTop: 24,
//   },
//   statusLabel: {
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   qrCodeSection: {
//     marginTop: 40,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   qrCodeContainer: {
//     width: 200,
//     height: 200,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     alignSelf: 'center',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   historySection: {
//     marginTop: 40,
//   },
//   historyText: {
//     fontSize: 16,
//     color: '#666',
//     fontStyle: 'italic',
//     textAlign: 'center',
//     marginTop: 20,
//   },
// });

// export default MedicationDetailScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const MedicationDetialScreen = ({ route, navigation }) => {
  const { medication } = route.params || {};
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    if (medication) {
      setSelectedMedication(medication);
    }
  }, [medication]);
  
  const closeModal = () => {
    setSelectedMedication(null);
    if (navigation) {
      navigation.goBack();
    }
  };

  return(
    <View>
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
              <View style={styles.pillImage}>
                <View style={styles.pillLine} />
              </View>
              <View style={styles.sparkle1} />
              <View style={styles.sparkle2} />
              <View style={styles.handIllustration} />
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
              <TouchableOpacity style={styles.skipButton} onPress={closeModal}>
                <Icon name="close" size={24} color="#FFFFFF" />
                <Text style={styles.buttonText}>Skip</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.rescheduleButton} onPress={closeModal}>
                <Icon name="calendar-today" size={24} color="#1167FE" />
                <Text style={styles.rescheduleButtonText}>Reschedule</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.takeButton} onPress={closeModal}>
                <Icon name="add" size={24} color="#FFFFFF" />
                <Text style={styles.buttonText}>Take</Text>
              </TouchableOpacity>
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
  )
};

const styles = StyleSheet.create({
  // Add new styles for the modal
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
  },
  pillImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  pillLine: {
    width: 40,
    height: 4,
    backgroundColor: '#4A5568',
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  sparkle1: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: '#1167FE',
    borderRadius: 4,
    right: 40,
    top: 40,
    transform: [{ rotate: '45deg' }],
  },
  sparkle2: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: '#1167FE',
    borderRadius: 4,
    left: 40,
    bottom: 60,
    transform: [{ rotate: '45deg' }],
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
  },
  skipButton: {
    backgroundColor: '#FF4757',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  rescheduleButton: {
    backgroundColor: '#EDF2F7',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  takeButton: {
    backgroundColor: '#1167FE',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 4,
  },
  rescheduleButtonText: {
    color: '#333',
    fontWeight: 'bold',
    marginTop: 4,
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

export default MedicationDetialScreen;