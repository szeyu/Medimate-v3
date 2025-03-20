import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MedicationScheduleScreen = ({ route, navigation }) => {
  const { medications } = route.params || { medications: [] };
  const [selectedDayIndex, setSelectedDayIndex] = useState(2); // Default to Wednesday (index 2)
  
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
      </TouchableOpacity>
    );
  };
  
  const renderTimelineItem = ({ item, index }) => {
    return (
      <View style={styles.timelineItem}>
        <View style={styles.timeColumn}>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <View style={styles.timelineLine}>
          <View style={styles.timelineDot} />
          <View style={styles.timelineConnector} />
        </View>
        <View style={styles.medicationColumn}>
          <View style={styles.medicationCard}>
            <View style={styles.medicationCardHeader}>
              <View style={styles.medicationIcon}>
                <Icon name="medication" size={20} color="#1167FE" />
              </View>
              <Text style={styles.medicationName}>{item.name}</Text>
            </View>
            <Text style={styles.medicationDosage}>{item.dosage}</Text>
            <View style={styles.medicationCardFooter}>
              <Text style={styles.medicationInstructions}>{item.instructions}</Text>
              <TouchableOpacity style={styles.checkButton}>
                <Icon name="check-circle" size={24} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };
  
  // Example timeline data
  const timelineData = [
    { time: '08:00 AM', name: 'Aspirin', dosage: '100mg', instructions: 'Take with food' },
    { time: '12:00 PM', name: 'Vitamin D', dosage: '1000 IU', instructions: 'Take with lunch' },
    { time: '06:00 PM', name: 'Ibuprofen', dosage: '200mg', instructions: 'Take after dinner' },
    { time: '10:00 PM', name: 'Melatonin', dosage: '5mg', instructions: 'Take before bed' },
  ];
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back-ios" size={20} color="#000000" />
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
        />
      </View>
      
      <FlatList
        data={timelineData}
        renderItem={renderTimelineItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.timelineContainer}
      />
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
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  weekdaySelector: {
    height: 80,
    paddingHorizontal: 16,
  },
  dayItem: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    backgroundColor: '#FFFFFF',
  },
  selectedDayItem: {
    backgroundColor: '#1167FE',
  },
  weekdayText: {
    fontSize: 14,
    color: '#666666',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medicationCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  medicationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(17, 103, 254, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  medicationDosage: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  medicationCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medicationInstructions: {
    fontSize: 12,
    color: '#666666',
    flex: 1,
  },
  checkButton: {
    padding: 4,
  },
});

export default MedicationScheduleScreen;