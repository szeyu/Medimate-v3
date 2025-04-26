import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { API_URL } from '../config/env';

const WellnessAIChatbotScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hello! I'm your Wellness AI Assistant. How can I help you today with your health and wellness goals?",
      sender: 'ai',
      timestamp: new Date(),
      isStreaming: false,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [streamingId, setStreamingId] = useState(null);
  const flatListRef = useRef(null);
  const streamingIntervalRef = useRef(null);

  // User health data (hardcoded knowledge)
  const userHealthData = {
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
      glucose: '140 mg/dL',
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
  };

  // Switch to voice mode
  const switchToVoiceMode = () => {
    navigation.replace('VoiceAssistance');
  };

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      isStreaming: false,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Add empty AI message that will be streamed
      const aiMessageId = (Date.now() + 1).toString();
      const aiMessage = {
        id: aiMessageId,
        text: '',
        sender: 'ai',
        timestamp: new Date(),
        isStreaming: true,
      };
      
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      setStreamingId(aiMessageId);
      setStreamingText('');

      // Make API call to backend
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputText,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Get the response text
      const responseText = await response.text();
      
      // Split the response into lines and process each line
      const lines = responseText.split('\n').filter(line => line.trim());
      let accumulatedText = '';

      for (let i = 0; i < lines.length; i++) {
        try {
          const data = JSON.parse(lines[i]);
          
          if (data.error) {
            throw new Error(data.error);
          }
          
          if (!data.done) {
            accumulatedText += data.text;
            
            // Update message text
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                msg.id === aiMessageId ? { ...msg, text: accumulatedText } : msg
              )
            );
            
            // Add delay between chunks
            if (i < lines.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 30));
            }
          }
        } catch (e) {
          console.error('Error parsing JSON:', e);
        }
      }

      // Mark message as complete
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg
        )
      );
      setStreamingId(null);
      setIsTyping(false);

    } catch (error) {
      console.error('Error:', error);
      setIsTyping(false);
      // Add error message
      const errorMessage = {
        id: Date.now().toString(),
        text: 'Sorry, there was an error processing your message. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
        isStreaming: false,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
      }
    };
  }, []);

  // Auto-scroll to bottom when messages change or when streaming text updates
  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, streamingText, isTyping]);

  const generateAIResponse = (userInput, userData) => {
    // Convert user input to lowercase for easier matching
    const input = userInput.toLowerCase();

    // Check for different types of user queries and provide appropriate responses
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return `Hello ${userData.name}! How are you feeling today?`;
    }
    
    if (input.includes('how are you')) {
      return "I'm functioning well, thank you for asking! More importantly, how are you doing today?";
    }
    
    if (input.includes('my name') || input.includes('who am i')) {
      return `Your name is ${userData.name}. You're ${userData.age} years old.`;
    }
    
    if (input.includes('my health') || input.includes('my condition')) {
      return `Based on your records, you have ${userData.conditions.join(' and ')}. You're currently taking ${userData.medications.join(' and ')} to manage these conditions.`;
    }
    
    if (input.includes('blood pressure') || input.includes('bp')) {
      return `Your last recorded blood pressure was ${userData.metrics.bloodPressure}, which is slightly elevated. The ideal blood pressure is below 120/80 mmHg. Would you like some tips to help lower your blood pressure?`;
    }
    
    if (input.includes('glucose') || input.includes('blood sugar') || input.includes('diabetes')) {
      return `Your last glucose reading was ${userData.metrics.glucose}, which is above the target range for someone with Type 2 Diabetes. The recommended fasting glucose level is 80-130 mg/dL. Have you been following your medication schedule and dietary recommendations?`;
    }
    
    if (input.includes('weight') || input.includes('bmi')) {
      return `Your current weight is ${userData.metrics.weight} with a BMI of ${userData.metrics.bmi}, which falls in the overweight category. Your goal is to lose 15 pounds. Would you like me to suggest some weight management strategies?`;
    }
    
    if (input.includes('smoking') || input.includes('quit smoking')) {
      return "I see that quitting smoking is one of your health goals. Quitting smoking can significantly improve your blood pressure and overall cardiovascular health. Have you considered nicotine replacement therapy or speaking with your doctor about medication options to help you quit?";
    }
    
    if (input.includes('diet') || input.includes('food') || input.includes('eat')) {
      return "Your current diet is mixed with a high intake of processed foods. For someone with Type 2 Diabetes and Hypertension, I'd recommend a diet rich in vegetables, whole grains, lean proteins, and limited in sodium, added sugars, and refined carbohydrates. Would you like some specific meal suggestions?";
    }
    
    if (input.includes('exercise') || input.includes('workout') || input.includes('physical activity')) {
      return "You currently have a moderate exercise routine. For managing diabetes and hypertension, aim for at least 150 minutes of moderate-intensity aerobic activity per week, plus muscle-strengthening activities twice a week. Even short walks after meals can help control blood sugar levels.";
    }
    
    if (input.includes('sleep') || input.includes('tired')) {
      return "You're averaging about 6 hours of sleep per night, which is less than the recommended 7-9 hours for adults. Poor sleep can affect blood sugar control and blood pressure. Would you like some tips for improving your sleep quality?";
    }
    
    if (input.includes('medication') || input.includes('medicine') || input.includes('pill')) {
      return "You're currently taking Metformin for diabetes and Lisinopril for hypertension. It's important to take these medications as prescribed by your doctor. Are you experiencing any side effects or having trouble remembering to take your medications?";
    }
    
    if (input.includes('stress') || input.includes('anxiety') || input.includes('worried')) {
      return "Stress management is important for both diabetes and hypertension control. Have you tried relaxation techniques like deep breathing, meditation, or progressive muscle relaxation? Even 10 minutes of mindfulness practice daily can help reduce stress levels.";
    }
    
    if (input.includes('goal') || input.includes('target')) {
      return `Your current health goals are: ${userData.goals.join(', ')}. Which one would you like to focus on first?`;
    }
    
    // Default response if no specific match is found
    return "I understand you're interested in improving your health. As someone with Type 2 Diabetes and Hypertension, focusing on medication adherence, a balanced diet, regular physical activity, and stress management can help you achieve better health outcomes. Is there a specific aspect of your health you'd like to discuss?";
  };

  const renderMessage = ({ item }) => {
    const isAI = item.sender === 'ai';
    const isCurrentlyStreaming = item.id === streamingId;
    
    return (
      <View style={[styles.messageBubble, isAI ? styles.aiMessage : styles.userMessage]}>
        {isAI && (
          <View style={styles.aiAvatar}>
            <Icon name="smart-toy" size={20} color="#FFFFFF" />
          </View>
        )}
        <View style={[styles.messageContent, isAI ? styles.aiMessageContent : styles.userMessageContent]}>
          <Text style={[styles.messageText, isAI ? styles.aiMessageText : styles.userMessageText]}>
            {item.text}
            {isCurrentlyStreaming && <Text style={styles.cursorBlink}>|</Text>}
          </Text>
          <Text style={styles.timestamp}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wellness AI Assistant</Text>
        <TouchableOpacity>
          <Icon name="more-vert" size={24} color="#000000" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.modeToggleContainer}>
        <TouchableOpacity 
          style={styles.modeToggleButton}
          onPress={switchToVoiceMode}
        >
          <Icon name="mic" size={18} color="#1167FE" />
          <Text style={styles.modeToggleText}>Switch to Voice Mode</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chatContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
        />

        {isTyping && (
          <View style={styles.typingIndicator}>
            <ActivityIndicator size="small" color="#1167FE" />
            <Text style={styles.typingText}>AI is thinking...</Text>
          </View>
        )}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor="#9E9E9E"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Icon name="send" size={24} color={inputText.trim() ? "#FFFFFF" : "#CCCCCC"} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
  chatContainer: {
    flex: 1,
    position: 'relative',
  },
  messageList: {
    padding: 16,
    paddingBottom: 80,
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
  cursorBlink: {
    color: '#1167FE',
    fontWeight: 'bold',
    opacity: 1,
  },
  timestamp: {
    fontSize: 10,
    color: '#9E9E9E',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginLeft: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignSelf: 'flex-start',
    position: 'absolute',
    bottom: 80,
    left: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  typingText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1167FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#F5F5F5',
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
});

export default WellnessAIChatbotScreen; 