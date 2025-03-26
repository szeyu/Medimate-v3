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

const NotificationSettingsScreen = ({ navigation }) => {
  const [dailyReminders, setDailyReminders] = useState(false);
  const [healthInsights, setHealthInsights] = useState(true);
  const [sleepInsights, setSleepInsights] = useState(true);
  const [clinicalNotifications, setClinicalNotifications] = useState(false);
  const [soundQuality, setSoundQuality] = useState('High');
  const [priorityHealthSound, setPriorityHealthSound] = useState(true);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>General Settings</Text>
            <Icon name="more-horiz" size={20} color="#CCCCCC" />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Daily Reminders</Text>
              <Text style={styles.settingDescription}>
                Receive daily nudges to complete health assessments.
              </Text>
            </View>
            <Switch
              value={dailyReminders}
              onValueChange={setDailyReminders}
              trackColor={{ false: "#E0E0E0", true: "#BBD6FE" }}
              thumbColor={dailyReminders ? "#1167FE" : "#F5F5F5"}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Health Insights</Text>
              <Text style={styles.settingDescription}>
                Receive daily nudges to complete health assessments.
              </Text>
            </View>
            <Switch
              value={healthInsights}
              onValueChange={setHealthInsights}
              trackColor={{ false: "#E0E0E0", true: "#BBD6FE" }}
              thumbColor={healthInsights ? "#1167FE" : "#F5F5F5"}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Sleep Insights</Text>
              <Text style={styles.settingDescription}>
                Receive daily nudges to complete health assessments.
              </Text>
            </View>
            <Switch
              value={sleepInsights}
              onValueChange={setSleepInsights}
              trackColor={{ false: "#E0E0E0", true: "#BBD6FE" }}
              thumbColor={sleepInsights ? "#1167FE" : "#F5F5F5"}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Clinical Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive daily nudges to complete health assessments.
              </Text>
            </View>
            <Switch
              value={clinicalNotifications}
              onValueChange={setClinicalNotifications}
              trackColor={{ false: "#E0E0E0", true: "#BBD6FE" }}
              thumbColor={clinicalNotifications ? "#1167FE" : "#F5F5F5"}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sound Notification</Text>
            <Icon name="more-horiz" size={20} color="#CCCCCC" />
          </View>
          
          <TouchableOpacity style={styles.soundQualityItem}>
            <Text style={styles.soundQualityTitle}>Audio Quality</Text>
            <View style={styles.soundQualityValue}>
              <Text style={styles.soundQualityText}>{soundQuality}</Text>
              <Icon name="chevron-right" size={20} color="#CCCCCC" />
            </View>
          </TouchableOpacity>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Priority Health Sound Warning</Text>
              <Text style={styles.settingDescription}>
                Receive daily nudges to complete health assessments.
              </Text>
            </View>
            <Switch
              value={priorityHealthSound}
              onValueChange={setPriorityHealthSound}
              trackColor={{ false: "#E0E0E0", true: "#BBD6FE" }}
              thumbColor={priorityHealthSound ? "#1167FE" : "#F5F5F5"}
            />
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
  soundQualityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  soundQualityTitle: {
    fontSize: 16,
    color: '#333333',
  },
  soundQualityValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  soundQualityText: {
    fontSize: 16,
    color: '#666666',
    marginRight: 8,
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

export default NotificationSettingsScreen; 