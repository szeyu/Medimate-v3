import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PreferencesScreen = ({ navigation }) => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [healthReminders, setHealthReminders] = useState(true);
  const [medicationReminders, setMedicationReminders] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [dataSync, setDataSync] = useState(true);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preferences</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notification Preferences</Text>
            <Icon name="more-horiz" size={20} color="#CCCCCC" />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive notifications directly on your device.
              </Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: "#E0E0E0", true: "#BBD6FE" }}
              thumbColor={pushNotifications ? "#1167FE" : "#F5F5F5"}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Email Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive notifications via email.
              </Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: "#E0E0E0", true: "#BBD6FE" }}
              thumbColor={emailNotifications ? "#1167FE" : "#F5F5F5"}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>SMS Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive notifications via text message.
              </Text>
            </View>
            <Switch
              value={smsNotifications}
              onValueChange={setSmsNotifications}
              trackColor={{ false: "#E0E0E0", true: "#BBD6FE" }}
              thumbColor={smsNotifications ? "#1167FE" : "#F5F5F5"}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reminder Preferences</Text>
            <Icon name="more-horiz" size={20} color="#CCCCCC" />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Health Check Reminders</Text>
              <Text style={styles.settingDescription}>
                Reminders for regular health check-ups.
              </Text>
            </View>
            <Switch
              value={healthReminders}
              onValueChange={setHealthReminders}
              trackColor={{ false: "#E0E0E0", true: "#BBD6FE" }}
              thumbColor={healthReminders ? "#1167FE" : "#F5F5F5"}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Medication Reminders</Text>
              <Text style={styles.settingDescription}>
                Reminders to take your medications.
              </Text>
            </View>
            <Switch
              value={medicationReminders}
              onValueChange={setMedicationReminders}
              trackColor={{ false: "#E0E0E0", true: "#BBD6FE" }}
              thumbColor={medicationReminders ? "#1167FE" : "#F5F5F5"}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Appointment Reminders</Text>
              <Text style={styles.settingDescription}>
                Reminders for upcoming appointments.
              </Text>
            </View>
            <Switch
              value={appointmentReminders}
              onValueChange={setAppointmentReminders}
              trackColor={{ false: "#E0E0E0", true: "#BBD6FE" }}
              thumbColor={appointmentReminders ? "#1167FE" : "#F5F5F5"}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Data Preferences</Text>
            <Icon name="more-horiz" size={20} color="#CCCCCC" />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Sync Data</Text>
              <Text style={styles.settingDescription}>
                Automatically sync your data across devices.
              </Text>
            </View>
            <Switch
              value={dataSync}
              onValueChange={setDataSync}
              trackColor={{ false: "#E0E0E0", true: "#BBD6FE" }}
              thumbColor={dataSync ? "#1167FE" : "#F5F5F5"}
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Units of Measurement</Text>
              <Text style={styles.settingDescription}>
                Choose your preferred units (metric/imperial).
              </Text>
            </View>
            <Icon name="chevron-right" size={22} color="#CCCCCC" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.saveButton}>
          <Icon name="check" size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save Preferences</Text>
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
  section: {
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666666',
  },
  saveButton: {
    backgroundColor: '#1167FE',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 8,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default PreferencesScreen; 