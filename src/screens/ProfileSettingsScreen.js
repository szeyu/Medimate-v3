import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProfileAppBar from '../../components/ProfileAppBar';

const ProfileScreen = ({ navigation, handleLogOut }) => {
  const [darkMode, setDarkMode] = React.useState(false);
  
  const toggleDarkMode = () => {
    setDarkMode(previousState => !previousState);
  };
  
  const renderSettingItem = (icon, title, hasSwitch = false, onPress = () => {}) => {
    return (
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={onPress}
        disabled={hasSwitch}
      >
        <View style={styles.settingItemLeft}>
          <Icon name={icon} size={22} color="#666" style={styles.settingIcon} />
          <Text style={styles.settingText}>{title}</Text>
        </View>
        
        {hasSwitch ? (
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: "#E0E0E0", true: "#BBD6FE" }}
            thumbColor={darkMode ? "#1167FE" : "#F5F5F5"}
          />
        ) : (
          <Icon name="chevron-right" size={22} color="#CCCCCC" />
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Account</Text>
        <View style={{ width: 24 }} />
      </View> */}
      <ProfileAppBar navigation={navigation} />
      
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity 
          style={styles.profileCard}
          onPress={() => navigation.navigate('PersonalInfo')}
        >
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} 
            style={styles.profileImage} 
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>SSYOK</Text>
            <Text style={styles.profileEmail}>ssyok@gmail.com</Text>
          </View>
          <Icon name="edit" size={20} color="#1167FE" />
        </TouchableOpacity>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>General Settings</Text>
            <Icon name="more-horiz" size={20} color="#CCCCCC" />
          </View>
          
          {renderSettingItem('person', 'Personal Info', false, () => navigation.navigate('PersonalInfo'))}
          {renderSettingItem('notifications', 'Notification', false, () => navigation.navigate('NotificationSettings'))}
          {renderSettingItem('settings', 'Preferences', false, () => navigation.navigate('Preferences'))}
          {renderSettingItem('security', 'Security', false, () => navigation.navigate('Security'))}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Accessibility</Text>
            <Icon name="more-horiz" size={20} color="#CCCCCC" />
          </View>
          
          {renderSettingItem('language', 'Language', false, () => navigation.navigate('LanguageSettings'))}
          {renderSettingItem('visibility', 'Dark Mode', true)}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Help & Support</Text>
            <Icon name="more-horiz" size={20} color="#CCCCCC" />
          </View>
          
          {renderSettingItem('info', 'About', false, () => navigation.navigate('About'))}
          {renderSettingItem('help', 'Help Center', false, () => navigation.navigate('HelpCenter'))}
          {renderSettingItem('contact-support', 'Contact Us', false, () => navigation.navigate('ContactUs'))}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sign Out</Text>
            <Icon name="more-horiz" size={20} color="#CCCCCC" />
          </View>
          
          {renderSettingItem('logout', 'Sign Out', false, () => {
            handleLogOut();
            alert('Signing out...');
          })}
        </View>
        
        <View style={styles.dangerSection}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          
          <TouchableOpacity 
            style={styles.deleteAccountButton}
            onPress={() => {
              // Handle delete account logic here
              alert('This will permanently delete your account. Are you sure?');
            }}
          >
            <View style={styles.deleteIconContainer}>
              <Icon name="delete" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.deleteAccountText}>Delete Account</Text>
            <Icon name="chevron-right" size={22} color="#FF5252" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScrollView>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1167FE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#E6F0FF',
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
    marginBottom: 8,
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
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 16,
  },
  settingText: {
    fontSize: 16,
    color: '#333333',
  },
  dangerSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 32,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF5252',
  },
  deleteAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  deleteIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF5252',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  deleteAccountText: {
    flex: 1,
    fontSize: 16,
    color: '#FF5252',
  },
});

export default ProfileScreen; 