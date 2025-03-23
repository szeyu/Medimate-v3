import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomAppBar from '../../components/customAppBar';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Feather from 'react-native-vector-icons/Feather';

const AddMedicationScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState(1);
  const [frequency, setFrequency] = useState('3x Per Week');
  const [startDate, setStartDate] = useState('Jun 1');
  const [endDate, setEndDate] = useState('Jun 25');
  const [mealOption, setMealOption] = useState('After');
  const [selectedStyle, setSelectedStyle] = useState(0);
  const [instructions, setInstructions] = useState('');
  const [autoReminder, setAutoReminder] = useState(true);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDateObj, setStartDateObj] = useState(new Date());
  const [endDateObj, setEndDateObj] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000 * 24)); // 24 days later
  const [tempStartDate, setTempStartDate] = useState(new Date());
  const [tempEndDate, setTempEndDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000 * 24));


  const medicationStyles = [
    { icon: 'favorite', color: '#000000', bg: '#F3F4F6'},
    { icon: 'medical-services', color: '#000000', bg: '#F3F4F6'},
    { type: 'fontawesome', icon: faPlus, color: '#000000', bg: '#F3F4F6' },
    { icon: 'flash-on', color: '#000000', bg: '#F3F4F6'},
    { type: 'feather', icon: 'more-horizontal', color: '#000000', bg: '#F3F4F6' },
  ];

  const [sliderWidth, setSliderWidth] = useState(0);
  // Add new state for frequency dropdown
  const [showFrequencyModal, setShowFrequencyModal] = useState(false);
  const frequencyOptions = [
    '1x Per Day',
    '2x Per Day',
    '3x Per Day',
    '1x Per Week',
    '2x Per Week',
    '3x Per Week',
    'As Needed'
  ];


  const formatDate = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    return `${month} ${day}`;
  };

  const handleStartDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setTempStartDate(selectedDate);
    }
  };
  
  const handleEndDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setTempEndDate(selectedDate);
    }
  };
  
  // Confirm button handlers
  const confirmStartDate = () => {
    setStartDateObj(tempStartDate);
    setStartDate(formatDate(tempStartDate));
    setShowStartDatePicker(false);
  };
  
  const confirmEndDate = () => {
    setEndDateObj(tempEndDate);
    setEndDate(formatDate(tempEndDate));
    setShowEndDatePicker(false);
  };
  
  const handleSliderLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setSliderWidth(width);
  };
  
  const handleSliderPress = (event) => {
    if (sliderWidth === 0) return;
    
    const { locationX } = event.nativeEvent;
    const newDosage = Math.max(1, Math.min(5, Math.round((locationX / sliderWidth) * 5)));
    setDosage(newDosage);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ flex: 1, backgroundColor: '#F3F5F9' }}>
        <CustomAppBar navigation={navigation} />
      </View>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Medication Name</Text>
          <View style={styles.inputContainer}>
            <Icon name="description" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Oxycodone"
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity>
              <Icon name="edit" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Medication Dosage</Text>
        </View>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={5}
            step={1}
            value={dosage}
            onValueChange={setDosage}
            minimumTrackTintColor="#2563EB"
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor="#2563EB"
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>1</Text>
            <Text style={styles.sliderLabel}>3</Text>
            <Text style={styles.sliderLabel}>5</Text>
          </View>
        </View>
      </View>

        <View style={styles.section}>
          <Text style={styles.label}>Medication Frequency</Text>
          <TouchableOpacity 
            style={styles.selectButton}
            onPress={() => setShowFrequencyModal(true)}
          >
            <Icon name="event" size={20} color="#6B7280" />
            <Text style={styles.selectButtonText}>{frequency}</Text>
            <Icon name="keyboard-arrow-down" size={20} color="#6B7280" />
          </TouchableOpacity>
          <Modal
            visible={showFrequencyModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowFrequencyModal(false)}
          >
            <TouchableOpacity 
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowFrequencyModal(false)}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Frequency</Text>
                <FlatList
                  data={frequencyOptions}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.frequencyOption,
                        frequency === item && styles.frequencyOptionSelected
                      ]}
                      onPress={() => {
                        setFrequency(item);
                        setShowFrequencyModal(false);
                      }}
                    >
                      <Text style={[
                        styles.frequencyOptionText,
                        frequency === item && styles.frequencyOptionTextSelected
                      ]}>
                        {item}
                      </Text>
                      {frequency === item && (
                        <Icon name="check" size={20} color="#2563EB" />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        </View>

        <View style={styles.section}>
        <Text style={styles.label}>Medication Duration</Text>
        <View style={styles.durationContainer}>
          <View style={styles.durationColumn}>
            <Text style={styles.durationLabel}>From</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => {
                setShowEndDatePicker(false); // Close other picker first
                setTempStartDate(startDateObj); // Initialize with current value
                setShowStartDatePicker(true);
              }}
            >
              <Icon name="event" size={20} color="#6B7280" />
              <Text style={styles.dateButtonText}>{startDate}</Text>
              <Icon name="keyboard-arrow-down" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <View style={styles.durationColumn}>
            <Text style={styles.durationLabel}>To</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => {
                setShowStartDatePicker(false); // Close other picker first
                setTempEndDate(endDateObj); // Initialize with current value
                setShowEndDatePicker(true);
              }}
            >
              <Icon name="event" size={20} color="#6B7280" />
              <Text style={styles.dateButtonText}>{endDate}</Text>
              <Icon name="keyboard-arrow-down" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Move date pickers outside the columns to prevent overlap */}
        {showStartDatePicker && (
          <Modal
            transparent={true}
            animationType="fade"
            visible={showStartDatePicker}
            onRequestClose={() => setShowStartDatePicker(false)}
          >
            <TouchableOpacity 
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowStartDatePicker(false)}
            >
              <View style={styles.datePickerContainer}>
                <View style={styles.datePickerHeader}>
                  <Text style={styles.datePickerTitle}>Select Start Date</Text>
                  <TouchableOpacity onPress={() => setShowStartDatePicker(false)}>
                    <Icon name="close" size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={tempStartDate}
                  mode="date"
                  display="spinner"
                  onChange={handleStartDateChange}
                  style={styles.datePicker}
                />
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={confirmStartDate}
                >
                  <Text style={styles.datePickerButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        )}
        
        {showEndDatePicker && (
          <Modal
            transparent={true}
            animationType="fade"
            visible={showEndDatePicker}
            onRequestClose={() => setShowEndDatePicker(false)}
          >
            <TouchableOpacity 
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowEndDatePicker(false)}
            >
              <View style={styles.datePickerContainer}>
                <View style={styles.datePickerHeader}>
                  <Text style={styles.datePickerTitle}>Select End Date</Text>
                  <TouchableOpacity onPress={() => setShowEndDatePicker(false)}>
                    <Icon name="close" size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={tempEndDate}
                  mode="date"
                  display="spinner"
                  onChange={handleEndDateChange}
                  minimumDate={startDateObj}
                  style={styles.datePicker}
                />
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={confirmEndDate}
                >
                  <Text style={styles.datePickerButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        )}
      </View>

        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Take with Meal?</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Select 1</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.mealOptionsContainer}>
            <TouchableOpacity 
              style={[
                styles.mealOption,
                mealOption === 'Before' && styles.mealOptionSelected
              ]}
              onPress={() => setMealOption('Before')}
            >
              <Icon 
                name="undo" 
                size={20} 
                color={mealOption === 'Before' ? '#FFFFFF' : '#1F2937'} 
              />
              <Text style={[
                styles.mealOptionText,
                mealOption === 'Before' && styles.mealOptionTextSelected
              ]}>Before</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.mealOption,
                mealOption === 'After' && styles.mealOptionSelected
              ]}
              onPress={() => setMealOption('After')}
            >
              <Icon 
                name="redo" 
                size={20} 
                color={mealOption === 'After' ? '#FFFFFF' : '#1F2937'} 
              />
              <Text style={[
                styles.mealOptionText,
                mealOption === 'After' && styles.mealOptionTextSelected
              ]}>After</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Select Medication Style</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.styleGrid}>
            {medicationStyles.map((style, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.styleOption,
                  { backgroundColor: selectedStyle === index ? '#893FFC' : style.bg },
                  selectedStyle === index && styles.styleOptionSelected
                ]}
                onPress={() => setSelectedStyle(index)}
              >
                {style.type === 'fontawesome' ? (
                  <FontAwesomeIcon 
                    icon={style.icon} 
                    size={24} 
                    color={selectedStyle === index ? '#FFFFFF' : style.color} 
                  />
                ) : style.type === 'feather' ? (
                  <Feather
                    name={style.icon} 
                    size={24} 
                    color={selectedStyle === index ? '#FFFFFF' : style.color} 
                  />
                ) : (
                  <Icon 
                    name={style.icon} 
                    size={24} 
                    color={selectedStyle === index ? '#FFFFFF' : style.color} 
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Custom AI Instruction</Text>
          </View>
          <View style={styles.instructionsContainer}>
            <TextInput
              style={styles.instructionsInput}
              multiline
              placeholder="Please remind me when I have reached the medication threshold prescribed by Dr. Hannibal Lecto"
              placeholderTextColor="#6B7280"
              value={instructions}
              onChangeText={setInstructions}
            />
            <Text style={styles.characterCount}>250/500</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.reminderRow}>
            <Text style={styles.label}>Set Auto Reminder?</Text>
            <Switch
              value={autoReminder}
              onValueChange={setAutoReminder}
              trackColor={{ false: "#D1D5DB", true: "#2563EB" }}
              thumbColor="#FFFFFF"
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
          </View>
          <Text style={styles.switchDescription}>
             Enable automatic reminders for this medication
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('MedicationSchedule')}
        >
          <Text style={styles.addButtonText}>Save</Text>
        </TouchableOpacity>
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
    padding: 16,
    paddingTop: 48, // Add extra padding for status bar
    backgroundColor: '#1E293B', // Dark blue color from the image
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparent white
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 16,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9FAFB',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  sliderContainer: {
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  sliderLabel: {
    color: '#6B7280',
    fontSize: 14,
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#1167FE',
    borderRadius: 4,
  },
  seeAllButton: {
    alignSelf: 'flex-end',
  },
  seeAllText: {
    color: '#1167FE',
    fontSize: 14,
    fontWeight: '500',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9FAFB',
  },
  selectButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 8,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  durationLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9FAFB',
  },
  dateButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 8,
  },
  switchDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  mealOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  mealOption: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    gap: 8,
  },
  mealOptionSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#1167FE',
  },
  mealOptionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  mealOptionTextSelected: {
    color: '#FFFFFF',
  },
  styleGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  styleOption: {
    width: 60,
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  styleOptionSelected: {
    borderWidth: 2,
    borderColor: '#D8C7FB',
  },
  instructionsContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    padding: 12,
  },
  instructionsInput: {
    height: 80,
    fontSize: 14,
    color: '#1F2937',
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#6B7280',
    alignSelf: 'flex-end',
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addButton: {
    backgroundColor: '#1167FE',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  frequencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  frequencyOptionSelected: {
    backgroundColor: '#F3F4F6',
  },
  frequencyOptionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  frequencyOptionTextSelected: {
    color: '#2563EB',
    fontWeight: '500',
  },
  // Add these new styles for the date picker modal
  datePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '90%',
    alignItems: 'center',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  datePicker: {
    width: '100%',
    height: 200,
  },
  datePickerButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  datePickerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddMedicationScreen;