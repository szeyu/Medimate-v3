import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GlucoseLevelCard from '../widgets/GlucoseLevelCard';
import * as FileSystem from 'expo-file-system';
import { API_URL } from '../config/env';

const TestGlucoseLevelScreen = () => {
  const [recording, setRecording] = useState();
  const [isListening, setIsListening] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [glucoseData, setGlucoseData] = useState({
    glucoseLevel: 0,
    status: 'Normal',
    rangeInfo: '',
    confidence: 0, // Add confidence
  });
  const [audioPermission, setAudioPermission] = useState(false); // State for permission status
  const [audioSetupComplete, setAudioSetupComplete] = useState(false); // State for audio mode setup

  // Add network check
  const checkServerConnection = async () => {
    try {
      const response = await fetch(`${API_URL}/`); // Check root endpoint
      return response.ok;
    } catch (error) {
      console.error('Server connection error:', error);
      return false;
    }
  };

  // Function to request permissions and set audio mode
  const setupAudio = useCallback(async () => {
    let permissionGranted = false;
    let setupSucceeded = false;
    try {
      // 1. Request Permissions (Check initial status)
      console.log("Checking initial audio permissions...");
      const initialPermission = await Audio.getPermissionsAsync();
      permissionGranted = initialPermission.status === 'granted';
      setAudioPermission(permissionGranted); // Update state with initial status

      if (!permissionGranted) {
        console.log("Audio permission not granted initially.");
        // Don't alert here, prompt will happen on button press
      } else {
        console.log("Audio permission already granted.");
      }

      // 2. Set Audio Mode (Always attempt to set mode)
      console.log("Setting audio mode...");
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true, // Crucial for iOS recording
        playsInSilentModeIOS: true,
        staysActiveInBackground: false, // Keep false unless background recording is needed
        interruptionModeIOS: 1, // INTERRUPTION_MODE_IOS_DO_NOT_MIX
        interruptionModeAndroid: 1, // INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      console.log("Audio mode set successfully.");
      setupSucceeded = true;

    } catch (err) {
      console.error('Failed during audio setup (permissions check or mode setting):', err);
      Alert.alert(
        'Audio Setup Error',
        'Failed to initialize audio recording capabilities. Please restart the app or check permissions.',
        [{ text: 'OK' }]
      );
    } finally {
      setAudioSetupComplete(setupSucceeded); // Mark setup as complete/failed
    }
    return permissionGranted; // Return initial permission status
  }, []); // useCallback with empty dependency array

  useEffect(() => {
    const initialSetup = async () => {
      // Check server connection
      const isConnected = await checkServerConnection();
      if (!isConnected) {
        Alert.alert(
          'Connection Error',
          'Cannot connect to the server. Make sure your phone and laptop are on the same network.',
          [{ text: 'OK' }]
        );
      }
      // Run initial audio setup (permission check + mode setting)
      await setupAudio();
    };

    initialSetup();

    // Cleanup function
    return () => {
      if (recording) {
        console.log("Cleaning up recording on unmount...");
        recording.stopAndUnloadAsync().catch(err => console.error("Error unloading recording on unmount:", err));
        setRecording(undefined);
      }
      // Optional: Reset audio mode on cleanup
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false, // Reset recording permission
      }).catch(err => console.log("Error resetting audio mode on cleanup:", err));
    };
  }, [setupAudio]); // Add setupAudio to dependency array

  const startRecording = async () => {
    // 1. Check if audio setup (mode setting) is complete
    if (!audioSetupComplete) {
       Alert.alert('Setup Incomplete', 'Audio system is not ready. Please wait or restart the app.');
       console.log('Attempted to record before audio setup was complete.');
       return;
    }

    // 2. Check current permission status and request if needed
    let currentPermission = audioPermission;
    if (!currentPermission) {
      console.log("Permission not granted, requesting on button press...");
      // Request permission again if not granted
      const permission = await Audio.requestPermissionsAsync();
      currentPermission = permission.status === 'granted';
      setAudioPermission(currentPermission); // Update state

      if (!currentPermission) {
        console.log("Permission denied after prompt on button press.");
        Alert.alert(
          'Permission Required',
          'Microphone access is needed to record audio for the test. Please enable it in your device settings.',
          [{ text: 'OK' }]
        );
        return; // Stop if permission denied
      }
      console.log("Permission granted after prompt on button press.");
    }

    // 3. Proceed with recording if permission is now granted
    if (recording) {
      console.log("Already recording.");
      return; // Avoid starting multiple recordings
    }

    try {
      // Define recording options
      const recordingOptions = {
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
        web: { // Optional: Add web options if needed
             mimeType: 'audio/webm',
             bitsPerSecond: 128000,
        }
      };

      console.log('Starting recording...');
      const { recording: newRecording } = await Audio.Recording.createAsync(
         recordingOptions, // Pass the full options object
         undefined, // onRecordingStatusUpdate (can add later if needed for timer)
         undefined // intervalMillis
      );

      setRecording(newRecording);
      setIsListening(true);
      setShowResults(false); // Hide previous results when starting new recording
      console.log('Recording started successfully.');

    } catch (err) {
      console.error('Failed to start recording:', err);
      // Check for specific iOS permission error message
      if (err.message && err.message.includes("Recording not allowed on iOS")) {
         Alert.alert(
           'Permission Required',
           'Microphone access seems to be disabled. Please enable it in your device settings to record audio.',
           [{ text: 'OK' }]
         );
      } else {
         Alert.alert('Error', 'Failed to start recording. Please try again.');
      }
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      console.log('Stopping recording...');
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(undefined); // Reset recording state
      setIsListening(false);

      if (!uri) {
        console.error('No recording URI available after stopping.');
        Alert.alert('Error', 'No recording data available. Please try again.');
        return;
      }

      console.log('Recording stopped. URI:', uri);

      // Create form data
      const formData = new FormData();
      const fileUri = Platform.OS === 'android' ? uri : uri.replace('file://', '');
      const fileName = `glucose_test_${Date.now()}.m4a`; // Use unique name

      formData.append('file', {
        uri: fileUri,
        type: 'audio/m4a', // Standard MIME type for M4A/AAC
        name: fileName,
      });
      console.log('Appending file to FormData:', { uri: fileUri, type: 'audio/m4a', name: fileName });

      console.log('Sending to server...');
      try {
        // Check server connection before sending
        const isConnected = await checkServerConnection();
        if (!isConnected) {
          Alert.alert(
            'Connection Error',
            'Cannot connect to the server. Please check your network.',
            [{ text: 'OK' }]
          );
          return;
        }

        // --- API Call ---
        const response = await fetch(`${API_URL}/upload-voice`, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          },
        });

        const responseText = await response.text(); // Get raw text first for debugging
        console.log('Server raw response:', responseText);

        if (response.ok) {
          const data = JSON.parse(responseText); // Parse JSON only if response is OK
          console.log('Server parsed data:', data);

          // Add random offset (consider if this is still needed/valid)
          // const randomOffset = Math.floor(Math.random() * (11 - 6 + 1)) + 7;
          // const adjustedGlucoseLevel = data.glucose_level + randomOffset;
          // Using direct prediction for now, offset logic might be flawed
          const predictedGlucoseLevel = data.glucose_level;

          // Determine status and range info based on predicted level
          let status = "Normal";
          let rangeInfo = "Normal range (80-120 mg/dL)";

          if (predictedGlucoseLevel < 80) {
            status = "Low";
            rangeInfo = "Below normal range (< 80 mg/dL)";
          } else if (predictedGlucoseLevel > 120) {
            status = "High";
            // Refine high range info if needed
            rangeInfo = "Above normal range (> 120 mg/dL)";
            // Example refinement:
            // if (predictedGlucoseLevel > 140) {
            //   rangeInfo = "Potentially high range (> 140 mg/dL)";
            // } else {
            //   rangeInfo = "Elevated range (120-140 mg/dL)";
            // }
          }

          setGlucoseData({
            glucoseLevel: Math.round(predictedGlucoseLevel), // Round the level
            status: status,
            rangeInfo: rangeInfo,
            confidence: data.confidence ? Math.round(data.confidence * 100) : undefined, // Use confidence from server if available
          });
          setShowResults(true);
        } else {
          console.error(`Server error: ${response.status}`, responseText);
          let detail = "Failed to process voice recording.";
          try {
             const errorJson = JSON.parse(responseText);
             detail = errorJson.detail || detail; // Use detail from server error if available
          } catch (e) { /* Ignore JSON parse error if response is not JSON */ }
          Alert.alert(
            'Server Error',
            `${detail} (Status: ${response.status})`,
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        console.error('Network or processing error:', error);
        Alert.alert(
          'Error',
          'Failed to send or process recording. Please check network and try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (err) {
      console.error('Error stopping/unloading recording:', err);
      Alert.alert('Error', 'Failed to stop recording properly. Please try again.');
    }
  };

  // --- UI Rendering ---
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Voice Glucose Test</Text>
        <Text style={styles.description}>
          This test uses voice analysis to estimate glucose levels. For best results, please read the following passage clearly and at a normal pace into the microphone.
        </Text>

        <View style={styles.readingPassageContainer}>
          <Text style={styles.readingPassageTitle}>The Rainbow Passage</Text>
          <Text style={styles.readingPassageText}>
            When the sunlight strikes raindrops in the air, they act like a prism and form a rainbow. The rainbow is a division of white light into many beautiful colors. These take the shape of a long round arch, with its path high above, and its two ends apparently beyond the horizon. There is, according to legend, a boiling pot of gold at one end. People look, but no one ever finds it.
          </Text>
        </View>

        {showResults ? (
          <>
            <GlucoseLevelCard
              glucoseLevel={glucoseData.glucoseLevel}
              status={glucoseData.status}
              rangeInfo={glucoseData.rangeInfo}
              confidence={glucoseData.confidence} // Pass confidence
            />
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => setShowResults(false)} // Reset to allow new test
            >
              <Text style={styles.retryButtonText}>Test Again</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.recordingContainer}>
            <Text style={styles.subtitle}>
              {isListening
                ? 'Recording... Read the passage above'
                : 'Press and hold the microphone to start recording'}
            </Text>

            <TouchableOpacity
              style={[
                styles.recordButton,
                isListening && styles.recordButtonActive,
              ]}
              // Use onPressIn/Out for hold-to-record behavior
              onPressIn={startRecording}
              onPressOut={stopRecording}
              disabled={!audioSetupComplete} // Disable button until audio mode is set
              activeOpacity={0.7} // Standard opacity change on press
            >
              <Icon
                name="mic"
                size={32}
                // Change icon color based on state, ensure contrast
                color={isListening ? '#FF4444' : (audioSetupComplete ? '#FFFFFF' : '#A0A0A0')}
              />
            </TouchableOpacity>
            {!audioSetupComplete && (
                <Text style={styles.setupText}>Initializing audio...</Text>
            )}
          </View>
        )}

        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerTitle}>Study Information & Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            This feature is based on research correlating voice acoustics with glucose levels (e.g., "Acoustic Analysis and Prediction of Type 2 Diabetes Mellitus Using Smartphone-Recorded Voice Segments"). Reported study metrics vary (e.g., accuracy ~0.75, specificity ~0.77, sensitivity ~0.73).
          </Text>
          <Text style={styles.disclaimerText}>
            <Text style={{fontWeight: 'bold'}}>Important:</Text> This is an experimental feature for informational purposes only and is not a substitute for standard medical glucose monitoring or professional medical advice. Results may vary and should not be used for diagnosis or treatment decisions. Always consult with healthcare professionals.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  readingPassageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  readingPassageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  readingPassageText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    textAlign: 'justify',
  },
  recordingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1167FE', // Default color
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  recordButtonActive: {
    backgroundColor: '#FFFFFF', // Color when recording
    borderWidth: 3,
    borderColor: '#FF4444', // Recording border color
  },
  setupText: {
    marginTop: 10,
    fontSize: 12,
    color: '#888',
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
  disclaimerContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#6C757D',
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 8,
    lineHeight: 20,
  },
  // Ensure GlucoseLevelCard styles accommodate confidence if needed
});

export default TestGlucoseLevelScreen;