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

const SecurityScreen = ({ navigation }) => {
  const [biometricLogin, setBiometricLogin] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [autoLock, setAutoLock] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Login Security</Text>
            <Icon name="more-horiz" size={20} color="#CCCCCC" />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Biometric Login</Text>
              <Text style={styles.settingDescription}>
                Use your fingerprint or face ID to log in securely.
              </Text>
            </View>
            <Switch
              value={biometricLogin}
              onValueChange={setBiometricLogin}
              trackColor={{ false: "#E0E0E0", true: "#BBD6FE" }}
              thumbColor={biometricLogin ? "#1167FE" : "#F5F5F5"}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Two-Factor Authentication</Text>
              <Text style={styles.settingDescription}>
                Add an extra layer of security to your account.
              </Text>
            </View>
            <Switch
              value={twoFactorAuth}
              onValueChange={setTwoFactorAuth}
              trackColor={{ false: "#E0E0E0", true: "#BBD6FE" }}
              thumbColor={twoFactorAuth ? "#1167FE" : "#F5F5F5"}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Remember Me</Text>
              <Text style={styles.settingDescription}>
                Stay logged in on this device.
              </Text>
            </View>
            <Switch
              value={rememberMe}
              onValueChange={setRememberMe}
              trackColor={{ false: "#E0E0E0", true: "#BBD6FE" }}
              thumbColor={rememberMe ? "#1167FE" : "#F5F5F5"}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>App Security</Text>
            <Icon name="more-horiz" size={20} color="#CCCCCC" />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Auto-Lock App</Text>
              <Text style={styles.settingDescription}>
                Lock the app automatically when not in use.
              </Text>
            </View>
            <Switch
              value={autoLock}
              onValueChange={setAutoLock}
              trackColor={{ false: "#E0E0E0", true: "#BBD6FE" }}
              thumbColor={autoLock ? "#1167FE" : "#F5F5F5"}
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Change Password</Text>
              <Text style={styles.settingDescription}>
                Update your account password.
              </Text>
            </View>
            <Icon name="chevron-right" size={22} color="#CCCCCC" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Data Privacy</Text>
            <Icon name="more-horiz" size={20} color="#CCCCCC" />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Data Sharing</Text>
              <Text style={styles.settingDescription}>
                Allow anonymous data sharing for app improvement.
              </Text>
            </View>
            <Switch
              value={dataSharing}
              onValueChange={setDataSharing}
              trackColor={{ false: "#E0E0E0", true: "#BBD6FE" }}
              thumbColor={dataSharing ? "#1167FE" : "#F5F5F5"}
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Privacy Policy</Text>
              <Text style={styles.settingDescription}>
                Read our privacy policy.
              </Text>
            </View>
            <Icon name="chevron-right" size={22} color="#CCCCCC" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Download My Data</Text>
              <Text style={styles.settingDescription}>
                Get a copy of your personal data.
              </Text>
            </View>
            <Icon name="chevron-right" size={22} color="#CCCCCC" />
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
});

export default SecurityScreen; 