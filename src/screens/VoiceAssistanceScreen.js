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
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const VoiceAssistanceScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollViewRef = useRef(null);
  
  // Animation for the pulsing effect
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim1 = useRef(new Animated.Value(0)).current;
  const waveAnim2 = useRef(new Animated.Value(0)).current;
  const waveAnim3 = useRef(new Animated.Value(0)).current;
  
  // User health data
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
  };
  
  // Start pulsing animation when listening
  useEffect(() => {
    let pulseAnimation;
    
    if (isListening) {
      // Pulse animation
      pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      
      // Sound wave animations
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim1, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim1, {
            toValue: 0,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim2, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim2, {
            toValue: 0,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim3, {
            toValue: 1,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim3, {
            toValue: 0,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      pulseAnimation.start();
    } else {
      // Reset animations
      pulseAnim.setValue(1);
      waveAnim1.setValue(0);
      waveAnim2.setValue(0);
      waveAnim3.setValue(0);
    }
    
    return () => {
      if (pulseAnimation) {
        pulseAnimation.stop();
      }
    };
  }, [isListening]);
  
  // Switch to chat mode
  const switchToChatMode = () => {
    navigation.replace('WellnessAIChatbot');
  };
  
  // Handle new message
  const handleNewMessage = (message) => {
    // Add message to the end of the array instead of the beginning
    setMessages(prevMessages => [...prevMessages, message]);
    
    // Scroll to the bottom after adding a new message
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  };
  
  // Simulate conversation
  const toggleConversation = () => {
    if (!isConnected) {
      // Start conversation
      setIsConnected(true);
      setIsListening(true);
      
      // Simulate AI greeting
      setTimeout(() => {
        handleNewMessage({
          source: 'ai',
          message: `Hello! I'm your Wellness AI Assistant running on ${Platform.OS}. How can I help you today?`
        });
        
        // Keep listening for user input
        setIsListening(true);
      }, 1000);
    } else {
      // End conversation
      setIsConnected(false);
      setIsListening(false);
      
      // Simulate AI goodbye
      handleNewMessage({
        source: 'ai',
        message: 'Goodbye! Feel free to talk to me again when you need assistance.'
      });
    }
  };
  
  // Simulate receiving user input and responding
  useEffect(() => {
    let timer;
    
    if (isListening && isConnected) {
      // Simulate user speaking after 3 seconds
      timer = setTimeout(() => {
        const userQuestions = [
          "What's my blood pressure?",
          "How can I lower my glucose levels?",
          "What's my medication schedule?",
          "Can you give me tips to quit smoking?"
        ];
        
        const randomQuestion = userQuestions[Math.floor(Math.random() * userQuestions.length)];
        
        // Add user message
        handleNewMessage({
          source: 'user',
          message: randomQuestion
        });
        
        // Simulate AI thinking and responding
        setIsListening(false);
        setIsProcessing(true);
        
        setTimeout(() => {
          let response = "";
          
          if (randomQuestion.includes("blood pressure")) {
            response = `Your blood pressure is ${userHealthData.metrics.bloodPressure}, which is slightly elevated. The ideal blood pressure is below 120/80 mmHg. Would you like some tips to help lower your blood pressure?`;
          } else if (randomQuestion.includes("glucose")) {
            response = `Your current glucose level is ${userHealthData.metrics.glucose}. To lower your glucose levels, I recommend reducing your intake of refined carbohydrates and sugars, increasing physical activity, staying hydrated, and ensuring you take your medications as prescribed.`;
          } else if (randomQuestion.includes("medication")) {
            response = `Your current medication schedule is: Metformin 500mg twice daily with meals, and Lisinopril 10mg once daily in the morning. Your next dose of Metformin is due at 6:30 PM today.`;
          } else if (randomQuestion.includes("smoking")) {
            response = `Quitting smoking is one of the best things you can do for your health. Some effective strategies include: setting a quit date, using nicotine replacement therapy, avoiding triggers, seeking support from friends and family, and considering medication options.`;
          }
          
          setIsProcessing(false);
          
          handleNewMessage({
            source: 'ai',
            message: response
          });
          
          // Resume listening after response
          setTimeout(() => {
            setIsListening(true);
          }, 1000);
        }, 2000);
      }, 3000);
    }
    
    return () => clearTimeout(timer);
  }, [isListening, isConnected]);
  
  // Wave animation interpolations
  const wave1Opacity = waveAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3]
  });
  
  const wave2Opacity = waveAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.2]
  });
  
  const wave3Opacity = waveAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.1]
  });
  
  // Handle suggestion chip press
  const handleSuggestionPress = (question) => {
    if (!isConnected) {
      // Start conversation if not already started
      toggleConversation();
      
      // Add the question after a delay
      setTimeout(() => {
        handleNewMessage({
          source: 'user',
          message: question
        });
        
        // Simulate AI thinking and responding
        setIsListening(false);
        setIsProcessing(true);
        
        setTimeout(() => {
          let response = "";
          
          if (question.includes("blood pressure")) {
            response = `Your blood pressure is ${userHealthData.metrics.bloodPressure}, which is slightly elevated. The ideal blood pressure is below 120/80 mmHg. Would you like some tips to help lower your blood pressure?`;
          } else if (question.includes("glucose")) {
            response = `Your current glucose level is ${userHealthData.metrics.glucose}. To lower your glucose levels, I recommend reducing your intake of refined carbohydrates and sugars, increasing physical activity, staying hydrated, and ensuring you take your medications as prescribed.`;
          } else if (question.includes("medication")) {
            response = `Your current medication schedule is: Metformin 500mg twice daily with meals, and Lisinopril 10mg once daily in the morning. Your next dose of Metformin is due at 6:30 PM today.`;
          } else if (question.includes("smoking")) {
            response = `Quitting smoking is one of the best things you can do for your health. Some effective strategies include: setting a quit date, using nicotine replacement therapy, avoiding triggers, seeking support from friends and family, and considering medication options.`;
          }
          
          setIsProcessing(false);
          
          handleNewMessage({
            source: 'ai',
            message: response
          });
          
          // Resume listening after response
          setTimeout(() => {
            setIsListening(true);
          }, 1000);
        }, 2000);
      }, 1500);
    } else {
      // If already connected, just add the question
      handleNewMessage({
        source: 'user',
        message: question
      });
      
      // Simulate AI thinking and responding
      setIsListening(false);
      setIsProcessing(true);
      
      setTimeout(() => {
        let response = "";
        
        if (question.includes("blood pressure")) {
          response = `Your blood pressure is ${userHealthData.metrics.bloodPressure}, which is slightly elevated. The ideal blood pressure is below 120/80 mmHg. Would you like some tips to help lower your blood pressure?`;
        } else if (question.includes("glucose")) {
          response = `Your current glucose level is ${userHealthData.metrics.glucose}. To lower your glucose levels, I recommend reducing your intake of refined carbohydrates and sugars, increasing physical activity, staying hydrated, and ensuring you take your medications as prescribed.`;
        } else if (question.includes("medication")) {
          response = `Your current medication schedule is: Metformin 500mg twice daily with meals, and Lisinopril 10mg once daily in the morning. Your next dose of Metformin is due at 6:30 PM today.`;
        } else if (question.includes("smoking")) {
          response = `Quitting smoking is one of the best things you can do for your health. Some effective strategies include: setting a quit date, using nicotine replacement therapy, avoiding triggers, seeking support from friends and family, and considering medication options.`;
        }
        
        setIsProcessing(false);
        
        handleNewMessage({
          source: 'ai',
          message: response
        });
        
        // Resume listening after response
        setTimeout(() => {
          setIsListening(true);
        }, 1000);
      }, 2000);
    }
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
        <ScrollView 
          style={styles.conversationContainer}
          ref={scrollViewRef}
          contentContainerStyle={{ paddingTop: 16 }}
        >
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
          <View style={styles.micButtonWrapper}>
            {isListening && (
              <View style={styles.wavesContainer}>
                <Animated.View style={[styles.wave, { opacity: wave1Opacity, transform: [{ scale: 1.8 }] }]} />
                <Animated.View style={[styles.wave, { opacity: wave2Opacity, transform: [{ scale: 2.4 }] }]} />
                <Animated.View style={[styles.wave, { opacity: wave3Opacity, transform: [{ scale: 3.0 }] }]} />
              </View>
            )}
            
            <TouchableOpacity
              style={[
                styles.micButton,
                isConnected && styles.micButtonActive,
              ]}
              onPress={toggleConversation}
              activeOpacity={0.7}
            >
              <Animated.View
                style={[
                  styles.buttonInner,
                  isConnected && styles.buttonInnerActive,
                  isProcessing && styles.buttonInnerProcessing,
                  { transform: [{ scale: pulseAnim }] }
                ]}
              >
                <Icon
                  name={isProcessing ? "autorenew" : "mic"}
                  size={32}
                  color="#FFFFFF"
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.micInstructions}>
            {isListening ? "Listening..." : 
             isProcessing ? "Processing..." : 
             isConnected ? "Tap to end conversation" : 
             "Tap microphone to start"}
          </Text>
        </View>
        
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Try asking</Text>
          <View style={styles.suggestionChips}>
            <TouchableOpacity 
              style={styles.suggestionChip}
              onPress={() => handleSuggestionPress("What's my blood pressure?")}
            >
              <Text style={styles.suggestionChipText}>What's my blood pressure?</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.suggestionChip}
              onPress={() => handleSuggestionPress("How can I lower my glucose levels?")}
            >
              <Text style={styles.suggestionChipText}>How can I lower my glucose?</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.suggestionChip}
              onPress={() => handleSuggestionPress("What's my medication schedule?")}
            >
              <Text style={styles.suggestionChipText}>My medication schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.suggestionChip}
              onPress={() => handleSuggestionPress("Can you give me tips to quit smoking?")}
            >
              <Text style={styles.suggestionChipText}>Tips to quit smoking</Text>
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
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
  micButtonWrapper: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  wavesContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  wave: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#1167FE",
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(17, 103, 254, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  micButtonActive: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
  },
  buttonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1167FE",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1167FE",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 5,
  },
  buttonInnerActive: {
    backgroundColor: "#F44336",
    shadowColor: "#F44336",
  },
  buttonInnerProcessing: {
    backgroundColor: "#FFC107",
    shadowColor: "#FFC107",
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