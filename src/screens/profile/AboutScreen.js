import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AboutScreen = ({ navigation }) => {
  const appVersion = '1.0.0';
  
  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://medimate.com/logo.png' }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>MediMate</Text>
          <Text style={styles.appVersion}>Version {appVersion}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About MediMate</Text>
          <Text style={styles.aboutText}>
            MediMate is an AI-Powered Healthcare Assistant designed to empower individuals 
            managing chronic diseases (e.g., diabetes, cardiovascular issues) by providing 
            real-time, personalized support.
          </Text>
          <Text style={styles.aboutText}>
            Our mission is to enhance patient independence and quality of life through an 
            intuitive, scalable solution that addresses key challenges: medication adherence, 
            symptom monitoring, mental health support, and accessibility for users with disabilities.
          </Text>
          <Text style={styles.aboutText}>
            Built with React Native and powered by Eleven Labs for voice interactions, 
            MediMate aligns with SDG 3.4 (reducing premature mortality from non-communicable diseases).
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal Information</Text>
          
          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => openLink('https://medimate.com/terms')}
          >
            <View style={styles.linkItemLeft}>
              <Icon name="description" size={20} color="#666" style={styles.linkIcon} />
              <Text style={styles.linkText}>Terms of Service</Text>
            </View>
            <Icon name="open-in-new" size={18} color="#CCCCCC" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => openLink('https://medimate.com/privacy')}
          >
            <View style={styles.linkItemLeft}>
              <Icon name="security" size={20} color="#666" style={styles.linkIcon} />
              <Text style={styles.linkText}>Privacy Policy</Text>
            </View>
            <Icon name="open-in-new" size={18} color="#CCCCCC" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => openLink('https://medimate.com/licenses')}
          >
            <View style={styles.linkItemLeft}>
              <Icon name="verified-user" size={20} color="#666" style={styles.linkIcon} />
              <Text style={styles.linkText}>Licenses</Text>
            </View>
            <Icon name="open-in-new" size={18} color="#CCCCCC" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connect With Us</Text>
          
          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => openLink('https://twitter.com/medimate')}
          >
            <View style={styles.linkItemLeft}>
              <Icon name="alternate-email" size={20} color="#666" style={styles.linkIcon} />
              <Text style={styles.linkText}>Twitter</Text>
            </View>
            <Icon name="open-in-new" size={18} color="#CCCCCC" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => openLink('https://facebook.com/medimate')}
          >
            <View style={styles.linkItemLeft}>
              <Icon name="facebook" size={20} color="#666" style={styles.linkIcon} />
              <Text style={styles.linkText}>Facebook</Text>
            </View>
            <Icon name="open-in-new" size={18} color="#CCCCCC" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => openLink('https://instagram.com/medimate')}
          >
            <View style={styles.linkItemLeft}>
              <Icon name="photo-camera" size={20} color="#666" style={styles.linkIcon} />
              <Text style={styles.linkText}>Instagram</Text>
            </View>
            <Icon name="open-in-new" size={18} color="#CCCCCC" />
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
  logoContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1167FE',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#666666',
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  linkItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkIcon: {
    marginRight: 12,
  },
  linkText: {
    fontSize: 16,
    color: '#333333',
  },
});

export default AboutScreen; 