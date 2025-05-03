import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import { useUserHealth } from '../providers/UserHealthProvider';

const { width } = Dimensions.get('window');

const HealthInfoScreen = ({ navigation, completeSignUp }) => {
  const { updateHealthData } = useUserHealth();
  // State for health information
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [allergies, setAllergies] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [chronicConditions, setChronicConditions] = useState('');

  // State for form validation
  const [weightError, setWeightError] = useState('');
  const [heightError, setHeightError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [genderError, setGenderError] = useState('');

  // Handle form submission
  const handleSubmit = () => {
    // Reset errors
    setWeightError('');
    setHeightError('');
    setAgeError('');
    setGenderError('');

    // Validate required fields
    let isValid = true;

    if (!weight) {
      setWeightError('Weight is required');
      isValid = false;
    } else if (isNaN(weight) || parseFloat(weight) <= 0) {
      setWeightError('Please enter a valid weight');
      isValid = false;
    }

    if (!height) {
      setHeightError('Height is required');
      isValid = false;
    } else if (isNaN(height) || parseFloat(height) <= 0) {
      setHeightError('Please enter a valid height');
      isValid = false;
    }

    if (!age) {
      setAgeError('Age is required');
      isValid = false;
    } else if (isNaN(age) || parseInt(age) <= 0) {
      setAgeError('Please enter a valid age');
      isValid = false;
    }

    if (!gender) {
      setGenderError('Please select your gender');
      isValid = false;
    }

    if (isValid) {
      // Save health information (this would typically be sent to a backend)
      const healthData = {
        weight,
        height,
        age,
        gender,
        allergies,
        bloodType,
        chronicConditions,
      };
      
      console.log('Health data collected:', healthData);
      
      // Update global health data context
      updateHealthData(healthData);
      
      // Call the completeSignUp function from props to finalize sign up
      if (typeof completeSignUp === 'function') {
        // Pass the health data to the parent component to combine with user data
        completeSignUp(healthData);
      } else {
        // Fallback if completeSignUp is not provided
        console.error('completeSignUp function not provided!');
        navigation.navigate('Home');
      }
    }
  };

  // Skip health info for now function
  const skipForNow = () => {
    if (typeof completeSignUp === 'function') {
      completeSignUp();
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Health Information</Text>
            <Text style={styles.subtitle}>
              Please provide your basic health information to help us personalize your experience
            </Text>
          </View>

          <View style={styles.form}>
            {/* Weight */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Weight (kg)</Text>
              <View style={styles.inputContainer}>
                <Icon name="monitor-weight" size={20} color="#1167FE" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Your weight in kg"
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={(text) => {
                    setWeight(text);
                    if (weightError) setWeightError('');
                  }}
                />
              </View>
              {weightError ? <Text style={styles.errorText}>{weightError}</Text> : null}
            </View>

            {/* Height */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Height (cm)</Text>
              <View style={styles.inputContainer}>
                <Icon name="height" size={20} color="#1167FE" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Your height in cm"
                  keyboardType="numeric"
                  value={height}
                  onChangeText={(text) => {
                    setHeight(text);
                    if (heightError) setHeightError('');
                  }}
                />
              </View>
              {heightError ? <Text style={styles.errorText}>{heightError}</Text> : null}
            </View>

            {/* Age */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Age</Text>
              <View style={styles.inputContainer}>
                <Icon name="cake" size={20} color="#1167FE" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Your age"
                  keyboardType="numeric"
                  value={age}
                  onChangeText={(text) => {
                    setAge(text);
                    if (ageError) setAgeError('');
                  }}
                />
              </View>
              {ageError ? <Text style={styles.errorText}>{ageError}</Text> : null}
            </View>

            {/* Gender */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.pickerContainer}>
                <Icon name="person" size={20} color="#1167FE" style={styles.inputIcon} />
                <Picker
                  selectedValue={gender}
                  style={styles.picker}
                  onValueChange={(itemValue) => {
                    setGender(itemValue);
                    if (genderError) setGenderError('');
                  }}
                >
                  <Picker.Item label="Select gender" value="" />
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                  <Picker.Item label="Non-binary" value="non-binary" />
                  <Picker.Item label="Prefer not to say" value="prefer-not-to-say" />
                </Picker>
              </View>
              {genderError ? <Text style={styles.errorText}>{genderError}</Text> : null}
            </View>

            {/* Blood Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Blood Type (Optional)</Text>
              <View style={styles.pickerContainer}>
                <Icon name="opacity" size={20} color="#1167FE" style={styles.inputIcon} />
                <Picker
                  selectedValue={bloodType}
                  style={styles.picker}
                  onValueChange={(itemValue) => setBloodType(itemValue)}
                >
                  <Picker.Item label="Select blood type" value="" />
                  <Picker.Item label="A+" value="A+" />
                  <Picker.Item label="A-" value="A-" />
                  <Picker.Item label="B+" value="B+" />
                  <Picker.Item label="B-" value="B-" />
                  <Picker.Item label="AB+" value="AB+" />
                  <Picker.Item label="AB-" value="AB-" />
                  <Picker.Item label="O+" value="O+" />
                  <Picker.Item label="O-" value="O-" />
                  <Picker.Item label="Unknown" value="unknown" />
                </Picker>
              </View>
            </View>

            {/* Allergies */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Allergies (Optional)</Text>
              <View style={styles.inputContainer}>
                <Icon name="warning" size={20} color="#1167FE" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="List any allergies, separated by commas"
                  value={allergies}
                  onChangeText={setAllergies}
                  multiline
                />
              </View>
            </View>

            {/* Chronic Conditions */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Chronic Conditions (Optional)</Text>
              <View style={styles.inputContainer}>
                <Icon name="medical-services" size={20} color="#1167FE" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="List any chronic conditions"
                  value={chronicConditions}
                  onChangeText={setChronicConditions}
                  multiline
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

            {/* Skip Button */}
            <TouchableOpacity style={styles.skipButton} onPress={skipForNow}>
              <Text style={styles.skipButtonText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1167FE',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F5F7FF',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    backgroundColor: '#F5F7FF',
    paddingLeft: 12,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#1167FE',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 30,
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default HealthInfoScreen; 