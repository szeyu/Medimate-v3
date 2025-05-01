import React , { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MedicationDescriptionAppBar = ({ 
    navigation, 
    medicationName = "Amoxiciline", 
    takenCount = 25}) => {
const [activeTab, setActiveTab] = useState('Recent');
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#242E49" />
      <View style={styles.appBar}>
        {/* Background Decorations */}

        {/* Header Content */}
        <View style={styles.content}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>{medicationName}</Text>

          {/* Medication Info */}
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={18} color="white" style={styles.infoIcon} />
              <Text style={styles.infoText}>Prescribed Medication</Text>
            </View>
            
            <Text style={styles.infoDivider}></Text>
            
            <View style={styles.infoItem}>
              <Ionicons name="checkmark-circle-outline" size={18} color="white" style={styles.infoIcon} />
              <Text style={styles.infoText}>{takenCount}× Taken</Text>
            </View>
          </View>

          {/* Tab Navigation */}
            <View style={styles.tabContainer}>
            {['Recent', 'Archived', 'Deleted'].map((tab) => (
                <TouchableOpacity 
                key={tab}
                style={[
                    styles.tab, 
                    activeTab === tab && styles.activeTab
                ]}
                onPress={() => setActiveTab(tab)}
                >
                <Text style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText
                ]}>
                    {tab}
                </Text>
                </TouchableOpacity>
            ))}
            </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: '#242E49',
    height: 280,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    width: 40,
    alignItems: 'center',
    marginTop: 12,
  },
  title: {
    marginTop: 16,
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 6,
  },
  infoText: {
    color: 'white',
    fontSize: 14,
    opacity: 0.8,
  },
  infoDivider: {
    color: 'white',
    opacity: 0.5,
    marginHorizontal: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
    fontSize: 16,
  },
  activeTabText: {
    color: 'white',
  },
});

export default MedicationDescriptionAppBar;
