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
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

const VoiceAssistanceScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recording, setRecording] = useState();
  const [recordingStatus, setRecordingStatus] = useState('stopped');
  const [audioPermission, setAudioPermission] = useState(false);
  const [recordedUris, setRecordedUris] = useState([]);
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);
  const [currentDuration, setCurrentDuration] = useState('0:00');
  const scrollViewRef = useRef(null);
  const durationInterval = useRef(null);
  
  // Use FileSystem.documentDirectory for storing voice recordings
  const voiceDirectory = `${FileSystem.documentDirectory}voice/`;
  
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
  
  // Request audio recording permissions and create voice directory when component mounts
  useEffect(() => {
    // Function to get permissions
    const getPermission = async () => {
      try {
        const permission = await Audio.requestPermissionsAsync();
        setAudioPermission(permission.status === 'granted');
        
        if (permission.status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'This app needs microphone access to record audio.',
            [{ text: 'OK' }]
          );
        }
      } catch (err) {
        console.error('Failed to get permission', err);
      }
    };
    
    // Create voice directory if it doesn't exist
    const setupVoiceDirectory = async () => {
      try {
        const dirInfo = await FileSystem.getInfoAsync(voiceDirectory);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(voiceDirectory, { intermediates: true });
          console.log('Created voice directory at:', voiceDirectory);
        }
      } catch (err) {
        console.error('Failed to create voice directory', err);
        Alert.alert(
          'Error',
          'Failed to create directory for voice recordings. Please check app permissions and try again.',
          [{ text: 'OK' }]
        );
      }
    };
    
    getPermission();
    setupVoiceDirectory();
    
    // Set audio mode for recording
    const setAudioMode = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          // Use numeric values instead of constants to avoid errors
          interruptionModeIOS: 1, // 1 corresponds to INTERRUPTION_MODE_IOS_DO_NOT_MIX
          interruptionModeAndroid: 1, // 1 corresponds to INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
        });
      } catch (err) {
        console.error('Failed to set audio mode', err);
      }
    };
    
    setAudioMode();
    
    // Cleanup function
    return () => {
      if (recording) {
        stopRecording();
      }
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);
  
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
    // Ensure message has a type property (default to 'text' if not specified)
    const messageWithType = {
      ...message,
      type: message.type || 'text',
      id: message.id || new Date().getTime().toString()
    };
    
    setMessages(prevMessages => [...prevMessages, messageWithType]);
    
    // Scroll to the bottom after adding a new message
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  };
  
  // Play voice message
  const playVoiceMessage = async (uri, messageId) => {
    try {
      // If already playing the same message, stop it
      if (isPlaying && currentlyPlayingId === messageId) {
        await stopPlayback();
        return;
      }
      
      // If playing a different message, stop the current one first
      if (sound) {
        await sound.unloadAsync();
      }
      
      console.log('Loading sound from:', uri);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      
      setSound(newSound);
      setIsPlaying(true);
      setCurrentlyPlayingId(messageId);
    } catch (err) {
      console.error('Failed to play voice message', err);
      Alert.alert('Error', 'Failed to play voice message. Please try again.');
    }
  };
  
  // Stop playback
  const stopPlayback = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
      setCurrentlyPlayingId(null);
    }
  };
  
  // Monitor playback status
  const onPlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      // Playback finished
      setIsPlaying(false);
      setCurrentlyPlayingId(null);
    }
  };
  
  // Calculate duration in MM:SS format
  const calculateDuration = (milliseconds) => {
    if (!milliseconds) return '0:00';
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Update duration during recording
  const updateDuration = async () => {
    if (recording) {
      try {
        const status = await recording.getStatusAsync();
        console.log('Recording status update:', JSON.stringify(status));
        
        if (status.isRecording) {
          if (status.durationMillis) {
            const duration = calculateDuration(status.durationMillis);
            setCurrentDuration(duration);
            console.log(`Current duration: ${duration} (${status.durationMillis}ms)`);
          } else {
            console.warn('Status is recording but durationMillis is not available');
          }
        } else {
          console.warn('Status is not recording:', status.isRecording);
        }
      } catch (error) {
        console.error('Error updating duration:', error);
      }
    }
  };
  
  // Start recording function
  const startRecording = async () => {
    try {
      // Check if permission is granted
      if (!audioPermission) {
        const permission = await Audio.requestPermissionsAsync();
        setAudioPermission(permission.status === 'granted');
        
        if (permission.status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'This app needs microphone access to record audio.',
            [{ text: 'OK' }]
          );
          return;
        }
      }
      
      // Prepare recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        interruptionModeIOS: 1,
        interruptionModeAndroid: 1,
      });
      
      // Create a unique filename with timestamp
      const fileName = `recording_${new Date().getTime()}.m4a`;
      const fileUri = `${voiceDirectory}${fileName}`;
      
      // Create and start recording
      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        undefined,
        undefined,
        fileUri
      );
      
      // Check initial status
      const initialStatus = await recording.getStatusAsync();
      console.log('Initial recording status:', JSON.stringify(initialStatus));
      
      setRecording(recording);
      setRecordingStatus('recording');
      setCurrentDuration('0:00');
      
      // Start duration updates
      durationInterval.current = setInterval(updateDuration, 1000);
      
      setIsListening(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };
  
  // Stop recording function
  const stopRecording = async () => {
    try {
      if (!recording) {
        return;
      }
      
      // Clear duration update interval
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
        durationInterval.current = null;
      }
      
      console.log('Stopping recording..');
      
      // Get URI and status before unloading
      const uri = recording.getURI();
      const status = await recording.getStatusAsync();
      console.log('Final recording status before stopping:', JSON.stringify(status));
      
      await recording.stopAndUnloadAsync();
      console.log('Recording stopped and stored at', uri);
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        interruptionModeIOS: 1,
        interruptionModeAndroid: 1,
      });
      
      let duration = '0:00';
      if (status.isDoneRecording && status.durationMillis) {
        duration = calculateDuration(status.durationMillis);
        console.log(`Recording duration: ${duration} (${status.durationMillis}ms)`);
      } else {
        console.warn('Could not get recording duration from status. Status:', JSON.stringify(status));
        
        // Try to get duration from the sound object as a fallback
        try {
          const { sound: tempSound } = await Audio.Sound.createAsync({ uri });
          const soundStatus = await tempSound.getStatusAsync();
          if (soundStatus.durationMillis) {
            duration = calculateDuration(soundStatus.durationMillis);
            console.log(`Got duration from sound object: ${duration} (${soundStatus.durationMillis}ms)`);
          }
          await tempSound.unloadAsync();
        } catch (soundErr) {
          console.error('Failed to get duration from sound object:', soundErr);
        }
      }
      
      // Add URI to the list of recorded files
      if (uri) {
        setRecordedUris(prevUris => [...prevUris, uri]);
        
        // Add the voice message to the messages list with actual duration
        handleNewMessage({
          source: 'user',
          type: 'voice',
          message: 'Voice message',
          uri: uri,
          duration: duration,
          id: new Date().getTime().toString()
        });
      }
      
      setRecording(undefined);
      setRecordingStatus('stopped');
      setCurrentDuration('0:00');
      
      // Update UI to show processing state
      setIsListening(false);
      setIsProcessing(true);
      
      // Simulate processing the audio and getting a response
      setTimeout(() => {
        setIsProcessing(false);
        processRecordedAudio(uri);
      }, 2000);
    } catch (err) {
      console.error('Failed to stop recording', err);
      Alert.alert('Error', 'Failed to stop recording. Please try again.');
    }
  };
  
  // Process the recorded audio (simulated)
  const processRecordedAudio = (uri) => {
    // In a real app, you would send the audio to a speech-to-text service
    // and then process the text with an AI service
    
    // For now, we'll simulate a random question from the user
    const userQuestions = [
      "What's my blood pressure?",
      "How can I lower my glucose levels?",
      "What's my medication schedule?",
      "Can you give me tips to quit smoking?"
    ];
    
    const randomQuestion = userQuestions[Math.floor(Math.random() * userQuestions.length)];
    
    // Note: We've already added the voice message in stopRecording()
    // Now we're simulating the AI's response to the voice message
    
    // Simulate AI response
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
      
      handleNewMessage({
        source: 'ai',
        type: 'text',
        message: response
      });
    }, 1000);
  };
  
  // Simulate conversation
  const toggleConversation = () => {
    if (!isConnected) {
      // Start conversation
      setIsConnected(true);
      
      // Start recording
      startRecording();
      
      // Simulate AI greeting
      setTimeout(() => {
        handleNewMessage({
          source: 'ai',
          message: `Hello! I'm your Wellness AI Assistant running on ${Platform.OS}. How can I help you today?`
        });
      }, 1000);
    } else {
      // If recording, stop it
      if (recording) {
        stopRecording();
      }
      
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
  
  // Handle recording button press
  const handleRecordingButtonPress = () => {
    if (recordingStatus === 'recording') {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  // Modified effect to handle conversation flow
  useEffect(() => {
    let timer;
    
    if (isListening && isConnected && !recording) {
      // If we're listening but not actively recording, start a new recording
      timer = setTimeout(() => {
        startRecording();
      }, 1000);
    }
    
    return () => clearTimeout(timer);
  }, [isListening, isConnected, recording]);
  
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
    // If recording is in progress, stop it first
    if (recording) {
      stopRecording();
    }
    
    if (!isConnected) {
      // Start conversation if not already started
      setIsConnected(true);
      
      // Add the AI greeting first
      setTimeout(() => {
        handleNewMessage({
          source: 'ai',
          message: `Hello! I'm your Wellness AI Assistant running on ${Platform.OS}. How can I help you today?`
        });
        
        // Then add the user question after a short delay
        setTimeout(() => {
          // Add user message
          handleNewMessage({
            source: 'user',
            message: question
          });
          
          // Simulate AI thinking and responding
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
            
            // After response, we're ready for voice input
            setIsListening(true);
          }, 2000);
        }, 1000);
      }, 500);
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
        
        // After response, we're ready for voice input
        setTimeout(() => {
          setIsListening(true);
        }, 1000);
      }, 2000);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
      if (recording) {
        stopRecording();
      }
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

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
                  message.source === 'ai' ? styles.aiMessageContent : styles.userMessageContent,
                  message.type === 'voice' && styles.voiceMessageContent
                ]}
              >
                {message.type === 'voice' ? (
                  <TouchableOpacity 
                    style={styles.voiceMessageContainer}
                    onPress={() => playVoiceMessage(message.uri, message.id)}
                  >
                    <View style={styles.voicePlayButton}>
                      <Icon 
                        name={isPlaying && currentlyPlayingId === message.id ? "pause" : "play-arrow"} 
                        size={20} 
                        color={message.source === 'ai' ? "#1167FE" : "#FFFFFF"} 
                      />
                    </View>
                    <View style={styles.voiceWaveform}>
                      <View style={styles.voiceWaveformBars}>
                        {[...Array(8)].map((_, i) => (
                          <View 
                            key={i} 
                            style={[
                              styles.voiceWaveformBar,
                              { height: 5 + Math.random() * 15 },
                              message.source === 'ai' ? styles.aiVoiceWaveformBar : styles.userVoiceWaveformBar
                            ]} 
                          />
                        ))}
                      </View>
                    </View>
                    <Text 
                      style={[
                        styles.voiceDuration,
                        message.source === 'ai' ? styles.aiMessageText : styles.userMessageText
                      ]}
                    >
                      {message.duration || '0:00'}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text 
                    style={[
                      styles.messageText,
                      message.source === 'ai' ? styles.aiMessageText : styles.userMessageText
                    ]}
                  >
                    {message.message}
                  </Text>
                )}
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
                recording && styles.micButtonRecording,
              ]}
              onPress={isConnected ? handleRecordingButtonPress : toggleConversation}
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
            {recording ? "Recording... Tap to stop" : 
             isListening ? "Listening..." : 
             isProcessing ? "Processing..." : 
             isConnected ? "Tap to start recording" : 
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
  // Voice message styles
  voiceMessageContent: {
    minWidth: 150,
    maxWidth: 250,
  },
  voiceMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  voicePlayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  voiceWaveform: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
  },
  voiceWaveformBars: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 20,
  },
  voiceWaveformBar: {
    width: 3,
    borderRadius: 3,
    marginHorizontal: 2,
  },
  aiVoiceWaveformBar: {
    backgroundColor: '#1167FE',
  },
  userVoiceWaveformBar: {
    backgroundColor: '#FFFFFF',
  },
  voiceDuration: {
    fontSize: 12,
    marginLeft: 8,
  },
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
  micButtonRecording: {
    backgroundColor: "rgba(255, 0, 0, 0.3)",
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