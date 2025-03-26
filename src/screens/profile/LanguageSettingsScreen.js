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
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LanguageSettingsScreen = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('English (UK)');
  const [enableBilingual, setEnableBilingual] = useState(true);
  
  const languages = [
    { id: '1', name: 'English (UK)', code: 'en-UK' },
    { id: '2', name: 'Japanese (JP)', code: 'ja-JP' },
    { id: '3', name: 'Arabic (AR)', code: 'ar-AR' },
    { id: '4', name: 'French (FR)', code: 'fr-FR' },
    { id: '5', name: 'Scottish (SC)', code: 'en-SC' },
    { id: '6', name: 'German (GR)', code: 'de-GR' },
    { id: '7', name: 'Italian (IL)', code: 'it-IL' },
  ];
  
  const renderLanguageItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.languageItem}
      onPress={() => setSelectedLanguage(item.name)}
    >
      <View style={styles.languageInfo}>
        <Icon name="language" size={20} color="#666" style={styles.languageIcon} />
        <Text style={styles.languageName}>{item.name}</Text>
      </View>
      {selectedLanguage === item.name ? (
        <Icon name="check" size={20} color="#1167FE" />
      ) : (
        <View style={styles.radioOuter}>
          {selectedLanguage === item.name && <View style={styles.radioInner} />}
        </View>
      )}
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Languages</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected Language</Text>
          <View style={styles.selectedLanguageContainer}>
            <Icon name="language" size={24} color="#FFFFFF" style={styles.selectedLanguageIcon} />
            <Text style={styles.selectedLanguageText}>{selectedLanguage}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bilingual Feature</Text>
          <View style={styles.bilingualContainer}>
            <View style={styles.bilingualInfo}>
              <Icon name="translate" size={20} color="#666" style={styles.bilingualIcon} />
              <Text style={styles.bilingualText}>Enable Bilingual?</Text>
            </View>
            <Switch
              value={enableBilingual}
              onValueChange={setEnableBilingual}
              trackColor={{ false: "#E0E0E0", true: "#BBD6FE" }}
              thumbColor={enableBilingual ? "#1167FE" : "#F5F5F5"}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.allLanguagesHeader}>
            <Text style={styles.sectionTitle}>All Languages</Text>
            <TouchableOpacity style={styles.searchButton}>
              <Icon name="search" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={languages}
            renderItem={renderLanguageItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  selectedLanguageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1167FE',
    borderRadius: 8,
    padding: 12,
  },
  selectedLanguageIcon: {
    marginRight: 12,
  },
  selectedLanguageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bilingualContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bilingualInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bilingualIcon: {
    marginRight: 12,
  },
  bilingualText: {
    fontSize: 16,
    color: '#333333',
  },
  allLanguagesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageIcon: {
    marginRight: 12,
  },
  languageName: {
    fontSize: 16,
    color: '#333333',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1167FE',
  },
});

export default LanguageSettingsScreen; 