import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ContactUsScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const handleSubmit = () => {
    if (!name || !email || !subject || !message) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    // Here you would typically send the form data to your backend
    Alert.alert(
      'Message Sent',
      'Thank you for contacting us. We will get back to you soon!',
      [
        { 
          text: 'OK', 
          onPress: () => navigation.goBack() 
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.contactInfoSection}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          
          <View style={styles.contactMethod}>
            <View style={styles.iconContainer}>
              <Icon name="email" size={24} color="#1167FE" />
            </View>
            <View style={styles.contactDetails}>
              <Text style={styles.contactTitle}>Email Us</Text>
              <Text style={styles.contactValue}>support@medimate.com</Text>
            </View>
          </View>
          
          <View style={styles.contactMethod}>
            <View style={styles.iconContainer}>
              <Icon name="phone" size={24} color="#1167FE" />
            </View>
            <View style={styles.contactDetails}>
              <Text style={styles.contactTitle}>Call Us</Text>
              <Text style={styles.contactValue}>+6012-345 6787</Text>
            </View>
          </View>
          
          <View style={styles.contactMethod}>
            <View style={styles.iconContainer}>
              <Icon name="location-on" size={24} color="#1167FE" />
            </View>
            <View style={styles.contactDetails}>
              <Text style={styles.contactTitle}>Visit Us</Text>
              <Text style={styles.contactValue}>Universiti Malaya, 50603 Kuala Lumpur, Malaysia</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Send a Message</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Your Name</Text>
            <View style={styles.inputContainer}>
              <Icon name="person" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Icon name="email" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Subject</Text>
            <View style={styles.inputContainer}>
              <Icon name="subject" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="What is this regarding?"
                value={subject}
                onChangeText={setSubject}
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Message</Text>
            <View style={[styles.inputContainer, styles.messageContainer]}>
              <TextInput
                style={styles.messageInput}
                placeholder="Type your message here..."
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </View>
          
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
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
  contactInfoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactDetails: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    color: '#666666',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    paddingVertical: 12,
  },
  messageContainer: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  messageInput: {
    flex: 1,
    width: '100%',
    fontSize: 16,
    color: '#333333',
    minHeight: 120,
  },
  submitButton: {
    backgroundColor: '#1167FE',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ContactUsScreen; 