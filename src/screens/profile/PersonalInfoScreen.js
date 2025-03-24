import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PersonalInfoScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('SSYOK');
  const [email, setEmail] = useState('ssyok@gmail.com');
  const [phone, setPhone] = useState('+60123456789');
  const [dob, setDob] = useState('12/05/2004');
  const [address, setAddress] = useState('Universiti Malaya');
  const [country, setCountry] = useState('Malaysia');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Information</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} 
            style={styles.profileImage} 
          />
          <View style={styles.checkmarkContainer}>
            <Icon name="check" size={16} color="#FFFFFF" />
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.fieldLabel}>Full Name</Text>
          <View style={styles.inputContainer}>
            <Icon name="person" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
            />
            <TouchableOpacity>
              <Icon name="edit" size={20} color="#1167FE" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.fieldLabel}>Email Address</Text>
          <View style={styles.inputContainer}>
            <Icon name="email" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
            <TouchableOpacity>
              <Icon name="edit" size={20} color="#1167FE" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.fieldLabel}>Phone Number</Text>
          <View style={styles.inputContainer}>
            <Icon name="phone" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
            <TouchableOpacity>
              <Icon name="edit" size={20} color="#1167FE" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.fieldLabel}>Date of Birth</Text>
          <View style={styles.inputContainer}>
            <Icon name="cake" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={dob}
              onChangeText={setDob}
              placeholder="MM/DD/YYYY"
            />
            <TouchableOpacity>
              <Icon name="calendar-today" size={20} color="#1167FE" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.fieldLabel}>Address</Text>
          <View style={styles.inputContainer}>
            <Icon name="home" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your address"
            />
            <TouchableOpacity>
              <Icon name="edit" size={20} color="#1167FE" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.fieldLabel}>Country</Text>
          <View style={styles.inputContainer}>
            <Icon name="public" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={country}
              onChangeText={setCountry}
              placeholder="Select your country"
            />
            <TouchableOpacity>
              <Icon name="arrow-drop-down" size={20} color="#1167FE" />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity style={styles.saveButton}>
          <Icon name="check" size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 24,
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#1167FE',
  },
  checkmarkContainer: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#1167FE',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  formSection: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    paddingVertical: 8,
  },
  saveButton: {
    backgroundColor: '#1167FE',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 24,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default PersonalInfoScreen; 