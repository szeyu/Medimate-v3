import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GlucoseLevelCard from '../widgets/GlucoseLevelCard';
import * as FileSystem from 'expo-file-system';

// Replace with your laptop's local IP address (e.g., 192.168.1.X)
// You can find this by running 'ifconfig' on Linux/Mac or 'ipconfig' on Windows
const API_URL = 'http://192.168.100.16:8000';

const TestGlucoseLevelScreen = () => {
  const [recording, setRecording] = useState();
  const [isListening, setIsListening] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [glucoseData, setGlucoseData] = useState({
    glucoseLevel: 0,
    status: 'Normal',
    rangeInfo: '',
  });

  // Add network check
  const checkServerConnection = async () => {
    try {
      const response = await fetch(`${API_URL}/`);
      return response.ok;
    } catch (error) {
      console.error('Server connection error:', error);
      return false;
    }
  };

  useEffect(() => {
    const setup = async () => {
      // Check server connection
      const isConnected = await checkServerConnection();
      if (!isConnected) {
        Alert.alert(
          'Connection Error',
          'Cannot connect to the server. Make sure your phone and laptop are on the same network.',
          [{ text: 'OK' }]
        );
      }

      // Get audio permissions
      try {
        const permission = await Audio.requestPermissionsAsync();
        if (permission.status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'This app needs microphone access to record audio.',
            [{ text: 'OK' }]
          );
        }
      } catch (err) {
        console.error('Failed to get permission:', err);
      }

      // Set audio mode
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          interruptionModeIOS: 1,
          interruptionModeAndroid: 1,
        });
      } catch (err) {
        console.error('Failed to set audio mode:', err);
      }
    };

    setup();

    return () => {
      if (recording) {
        stopRecording();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const fileName = `recording_${new Date().getTime()}.m4a`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

      console.log('Starting recording...');
      const { recording: newRecording } = await Audio.Recording.createAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
        },
      }, undefined, undefined, fileUri);

      setRecording(newRecording);
      setIsListening(true);
      setShowResults(false);
    } catch (err) {
      console.error('Failed to start recording:', err);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      console.log('Stopping recording...');
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(undefined);
      setIsListening(false);

      if (!uri) {
        console.error('No recording URI available');
        Alert.alert('Error', 'No recording data available. Please try again.');
        return;
      }

      console.log('Recording URI:', uri);

      // Create form data
      const formData = new FormData();
      
      // For Android, we need to handle the file:// protocol
      const fileUri = Platform.OS === 'android' ? uri : uri.replace('file://', '');
      
      formData.append('file', {
        uri: fileUri,
        type: 'audio/m4a',
        name: 'glucose_test.m4a',
      });

      console.log('Sending to server...');
      try {
        // Check server connection before sending
        const isConnected = await checkServerConnection();
        if (!isConnected) {
          Alert.alert(
            'Connection Error',
            'Cannot connect to the server. Make sure your phone and laptop are on the same network.',
            [{ text: 'OK' }]
          );
          return;
        }

        const response = await fetch(`${API_URL}/upload-voice`, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        });

        const responseText = await response.text();
        console.log('Server response text:', responseText);

        if (response.ok) {
          const data = JSON.parse(responseText);
          console.log('Server response data:', data);
          setGlucoseData({
            glucoseLevel: data.glucose_level,
            status: data.status,
            rangeInfo: data.range_info || 'Your glucose level has been measured',
          });
          setShowResults(true);
        } else {
          console.error('Server error:', responseText);
          Alert.alert(
            'Server Error',
            'Failed to process voice recording. Please check if the server is running correctly.',
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        console.error('Network error:', error);
        Alert.alert(
          'Network Error',
          'Failed to connect to the server. Make sure your phone and laptop are on the same network.',
          [{ text: 'OK' }]
        );
      }
    } catch (err) {
      console.error('Error stopping recording:', err);
      Alert.alert('Error', 'Failed to stop recording. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {showResults ? (
          <>
            <GlucoseLevelCard
              glucoseLevel={glucoseData.glucoseLevel}
              status={glucoseData.status}
              rangeInfo={glucoseData.rangeInfo}
            />
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => setShowResults(false)}
            >
              <Text style={styles.retryButtonText}>Test Again</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.recordingContainer}>
            <Text style={styles.title}>Voice Glucose Test</Text>
            <Text style={styles.subtitle}>
              {isListening
                ? 'Listening...'
                : 'Press and hold the microphone to start recording'}
            </Text>
            
            <TouchableOpacity
              style={[
                styles.recordButton,
                isListening && styles.recordButtonActive,
              ]}
              onPressIn={startRecording}
              onPressOut={stopRecording}
            >
              <Icon
                name="mic"
                size={32}
                color={isListening ? '#FF4444' : '#FFFFFF'}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
  },
  recordingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1167FE',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  recordButtonActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FF4444',
  },
  retryButton: {
    backgroundColor: '#1167FE',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default TestGlucoseLevelScreen; 