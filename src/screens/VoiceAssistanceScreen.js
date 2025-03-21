import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const VoiceAssistanceScreen = ({ navigation }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  
  // Animation values
  const pulseAnim = new Animated.Value(1);
  
  // Switch to chat mode
  const switchToChatMode = () => {
    navigation.replace('WellnessAIChatbot');
  };
  
  // Start/stop listening
  const toggleListening = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      // Simulate listening and response after 3 seconds
      setTimeout(() => {
        setTranscript("What's my blood pressure?");
        
        // Simulate AI response after 2 more seconds
        setTimeout(() => {
          setResponse("Your last recorded blood pressure was 135/85, which is slightly elevated. The ideal blood pressure is below 120/80 mmHg. Would you like some tips to help lower your blood pressure?");
          setIsListening(false);
        }, 2000);
      }, 3000);
    } else {
      setTranscript('');
      setResponse('');
    }
  };
  
  // Pulse animation for the mic button when listening
  useEffect(() => {
    let pulseAnimation;
    
    if (isListening) {
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
      
      pulseAnimation.start();
    } else {
      pulseAnim.setValue(1);
    }
    
    return () => {
      if (pulseAnimation) {
        pulseAnimation.stop();
      }
    };
  }, [isListening]);

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
        <View style={styles.conversationContainer}>
          {transcript ? (
            <View style={styles.transcriptContainer}>
              <Text style={styles.transcriptLabel}>You said:</Text>
              <Text style={styles.transcriptText}>{transcript}</Text>
            </View>
          ) : null}
          
          {response ? (
            <View style={styles.responseContainer}>
              <View style={styles.aiAvatar}>
                <Icon name="smart-toy" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.responseContent}>
                <Text style={styles.responseText}>{response}</Text>
              </View>
            </View>
          ) : null}
        </View>
        
        <View style={styles.micButtonContainer}>
          <Animated.View 
            style={[
              styles.micButtonOuter,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <TouchableOpacity
              style={[styles.micButton, isListening && styles.micButtonActive]}
              onPress={toggleListening}
            >
              <Icon name="mic" size={36} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>
          <Text style={styles.micInstructions}>
            {isListening 
              ? "Listening..." 
              : "Tap the microphone and speak"}
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
  transcriptContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  transcriptLabel: {
    fontSize: 12,
    color: '#1167FE',
    marginBottom: 4,
  },
  transcriptText: {
    fontSize: 16,
    color: '#000000',
  },
  responseContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
    alignSelf: 'flex-start',
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
  responseContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  responseText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 22,
  },
  micButtonContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  micButtonOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(17, 103, 254, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1167FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButtonActive: {
    backgroundColor: '#F44336',
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