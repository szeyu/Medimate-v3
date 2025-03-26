import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const TranscribeAICard = () => {
  const navigation = useNavigation();

  // Sample transcription history
  const transcriptions = [
    {
      id: '1',
      title: 'Ibuprofen Usage',
      date: 'Mar 18, 2023',
      summary: 'Take with food, follow dosage, watch for side effects.'
    },
    {
      id: '2',
      title: 'Doctor Appointment',
      date: 'Feb 24, 2023',
      summary: 'Blood pressure check, new prescription for hypertension.'
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Icon name="record-voice-over" size={24} color="#1167FE" />
          <Text style={styles.title}>Transcribe AI</Text>
        </View>
        <TouchableOpacity 
          style={styles.newButton}
          onPress={() => navigation.navigate('TranscribeAI')}
        >
          <Icon name="add" size={20} color="#FFFFFF" />
          <Text style={styles.newButtonText}>New</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {transcriptions.map((item) => (
          <TouchableOpacity 
            key={item.id}
            style={styles.transcriptionItem}
            onPress={() => navigation.navigate('TranscribeAI', { id: item.id })}
          >
            <View style={styles.transcriptionIcon}>
              <Icon name="description" size={20} color="#1167FE" />
            </View>
            <View style={styles.transcriptionInfo}>
              <Text style={styles.transcriptionTitle}>{item.title}</Text>
              <Text style={styles.transcriptionDate}>{item.date}</Text>
              <Text style={styles.transcriptionSummary} numberOfLines={1}>
                {item.summary}
              </Text>
            </View>
            <Icon name="chevron-right" size={20} color="#CCCCCC" />
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity 
        style={styles.viewAllButton}
        onPress={() => navigation.navigate('TranscribeAI', { viewAll: true })}
      >
        <Text style={styles.viewAllText}>View All Transcriptions</Text>
        <Icon name="arrow-forward" size={16} color="#1167FE" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1167FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  newButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  content: {
    marginBottom: 12,
  },
  transcriptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  transcriptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transcriptionInfo: {
    flex: 1,
  },
  transcriptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  transcriptionDate: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 2,
  },
  transcriptionSummary: {
    fontSize: 14,
    color: '#666666',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: '#1167FE',
    marginRight: 4,
  },
});

export default TranscribeAICard; 