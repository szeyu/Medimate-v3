import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ConversationalAIDOMWrapper from '../components/ConversationalAIDOMWrapper';

const VoiceAssistanceScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  
  // Switch to chat mode
  const switchToChatMode = () => {
    navigation.replace('WellnessAIChatbot');
  };
  
  // Handle new message from the AI
  const handleNewMessage = (message) => {
    setMessages(prevMessages => [message, ...prevMessages]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Voice Assistant</Text>
        <TouchableOpacity>
          <Icon name="more-vert" size={24} color="#000000" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.modeToggleContainer}>
        <TouchableOpacity 
          style={styles.modeToggleButton}
          onPress={switchToChatMode}
        >
          <Icon name="chat" size={18} color="#1167FE" />
          <Text style={styles.modeToggleText}>Switch to Chat Mode</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.voiceContainer}>
        <ScrollView style={styles.conversationContainer}>
          {messages.map((message, index) => (
            <View 
              key={index} 
              style={[
                styles.messageBubble,
                message.source === 'ai' ? styles.aiMessage : styles.userMessage
              ]}
            >
              {message.source === 'ai' && (
                <View style={styles.aiAvatar}>
                  <Icon name="smart-toy" size={20} color="#FFFFFF" />
                </View>
              )}
              <View 
                style={[
                  styles.messageContent,
                  message.source === 'ai' ? styles.aiMessageContent : styles.userMessageContent
                ]}
              >
                <Text 
                  style={[
                    styles.messageText,
                    message.source === 'ai' ? styles.aiMessageText : styles.userMessageText
                  ]}
                >
                  {message.message}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
        
        <View style={styles.micButtonContainer}>
          <View style={styles.domComponentContainer}>
            <ConversationalAIDOMWrapper
              platform={Platform.OS}
              onMessage={handleNewMessage}
              userHealthData={{
                name: 'Alex',
                age: 42,
                gender: 'Male',
                conditions: ['Type 2 Diabetes', 'Hypertension'],
                medications: ['Metformin', 'Lisinopril'],
                lifestyle: {
                  smoker: true,
                  exercise: 'Moderate',
                  diet: 'Mixed, high in processed foods',
                  sleep: '6 hours average',
                },
                metrics: {
                  bloodPressure: '135/85',
                  glucose: '100 mg/dL',
                  weight: '195 lbs',
                  height: '5\'10"',
                  bmi: 28.2,
                },
                goals: [
                  'Reduce blood sugar levels',
                  'Quit smoking',
                  'Improve sleep quality',
                  'Lose 15 pounds',
                ],
              }}
            />
          </View>
          <Text style={styles.micInstructions}>
            Tap the microphone and speak
          </Text>
        </View>
        
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Try asking:</Text>
          <View style={styles.suggestionChips}>
            <TouchableOpacity style={styles.suggestionChip}>
              <Text style={styles.suggestionChipText}>What's my blood pressure?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestionChip}>
              <Text style={styles.suggestionChipText}>How can I lower my glucose?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestionChip}>
              <Text style={styles.suggestionChipText}>Tips to quit smoking</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestionChip}>
              <Text style={styles.suggestionChipText}>What's my medication schedule?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modeToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D0E1FF',
  },
  modeToggleText: {
    fontSize: 14,
    color: '#1167FE',
    marginLeft: 6,
  },
  voiceContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  conversationContainer: {
    flex: 1,
    marginBottom: 16,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  userMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1167FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageContent: {
    borderRadius: 16,
    padding: 12,
    maxWidth: '90%',
  },
  aiMessageContent: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  userMessageContent: {
    backgroundColor: '#1167FE',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  aiMessageText: {
    color: '#000000',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  micButtonContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  domComponentContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(17, 103, 254, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  domComponent: {
    width: 100,
    height: 100,
  },
  micInstructions: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  suggestionsContainer: {
    marginTop: 16,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  suggestionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  suggestionChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  suggestionChipText: {
    fontSize: 14,
    color: '#1167FE',
  },
});

export default VoiceAssistanceScreen;