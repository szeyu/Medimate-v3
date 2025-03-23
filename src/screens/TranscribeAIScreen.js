import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Animated,
  Easing,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import * as Clipboard from 'expo-clipboard';

const TranscribeAIScreen = ({ navigation, route }) => {
  const [stage, setStage] = useState('initial'); // initial, recording, processing, result, saving
  const [transcription, setTranscription] = useState('');
  const [displayedTranscription, setDisplayedTranscription] = useState('');
  const [summary, setSummary] = useState({});
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [isCopied, setIsCopied] = useState(false);
  const [isStoppingRecording, setIsStoppingRecording] = useState(false);
  
  // Ref for recording timeout
  const recordingTimeoutRef = useRef(null);
  
  // Refs for ScrollViews
  const recordingScrollViewRef = useRef(null);
  const resultScrollViewRef = useRef(null);
  
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim1 = useRef(new Animated.Value(0)).current;
  const waveAnim2 = useRef(new Animated.Value(0)).current;
  const waveAnim3 = useRef(new Animated.Value(0)).current;
  
  // Sample transcription text - without speaker identification, only line breaks after periods
  const fullTranscriptionText = "Good morning. How are you feeling today? I've been having some pain in my joints especially in the morning. It's been getting worse over the past few weeks. I see. Let's talk about your symptoms in more detail. Are you experiencing any swelling or redness around the painful joints? Yes especially in my fingers and wrists. They feel stiff for about an hour after I wake up. That could indicate inflammatory arthritis. I'm going to recommend some blood tests to check for markers of inflammation and autoimmune conditions. In the meantime I'd suggest taking ibuprofen to help with the pain and inflammation. Is ibuprofen safe to take with my blood pressure medication? That's a good question. Ibuprofen can sometimes interfere with blood pressure medications and may cause your blood pressure to rise. Let's try a lower dose of 200mg twice daily with food and monitor your blood pressure regularly. If you notice any significant changes stop taking it and call me immediately. How long should I take it for? Start with a 10-day course. If your symptoms improve we can discuss a longer-term plan after we get your test results back. Remember to always take it with food to protect your stomach.";
  
  // Format the text with line breaks after periods
  const formattedTranscriptionText = fullTranscriptionText.replace(/\.\s+/g, '.\n\n');
  
  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
    };
  }, []);
  
  // Auto-scroll to bottom when transcription updates during recording
  useEffect(() => {
    if (recordingScrollViewRef.current && stage === 'recording') {
      setTimeout(() => {
        recordingScrollViewRef.current.scrollToEnd({ animated: true });
      }, 50);
    }
  }, [displayedTranscription, stage]);
  
  // Typing effect for transcription - showing 2-3 words at a time
  useEffect(() => {
    if (stage === 'recording') {
      // Split text into words
      const words = formattedTranscriptionText.split(' ');
      let currentWordIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (currentWordIndex < words.length) {
          // Add 2-3 words at a time (randomly choose between 2 and 3)
          const wordsToAdd = Math.floor(Math.random() * 2) + 2; // 2 or 3
          const endIndex = Math.min(currentWordIndex + wordsToAdd, words.length);
          const newWords = words.slice(0, endIndex).join(' ');
          
          setDisplayedTranscription(newWords);
          currentWordIndex = endIndex;
        } else {
          clearInterval(typingInterval);
        }
      }, 300); // Adjust timing for natural reading speed
      
      return () => clearInterval(typingInterval);
    }
  }, [stage]);
  
  // Start recording animations
  useEffect(() => {
    let pulseAnimation;
    
    if (stage === 'recording') {
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
      
      // Sound wave animations - using only transform properties
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
      
      // Simulate recording for 15 seconds - store the timeout reference
      recordingTimeoutRef.current = setTimeout(() => {
        if (stage === 'recording') {
          handleStopRecording();
        }
      }, 15000);
      
      return () => {
        pulseAnimation && pulseAnimation.stop();
        // Clear the timeout when the effect is cleaned up
        if (recordingTimeoutRef.current) {
          clearTimeout(recordingTimeoutRef.current);
          recordingTimeoutRef.current = null;
        }
      };
    }
  }, [stage]);
  
  const handleStartRecording = () => {
    setStage('recording');
    setDisplayedTranscription('');
    setIsStoppingRecording(false);
  };
  
  const handleStopRecording = () => {
    // Prevent multiple calls to stop recording
    if (isStoppingRecording) return;
    
    // Clear the automatic timeout
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
    
    setIsStoppingRecording(true);
    setTranscription(displayedTranscription || formattedTranscriptionText);
    setStage('processing');
    
    // Simulate processing for 3 seconds
    setTimeout(() => {
      setStage('result');
      setSummary({
        title: "Medical Consultation: Joint Pain and Medication",
        keyPoints: [
          "Patient experiencing joint pain and stiffness in the morning",
          "Symptoms include swelling in fingers and wrists",
          "Possible inflammatory arthritis",
          "Recommended blood tests for inflammation markers",
          "Prescribed ibuprofen 200mg twice daily with food"
        ],
        medications: [
          "Ibuprofen 200mg - Take twice daily with food for 10 days"
        ],
        followUp: "Return after blood test results for longer-term plan"
      });
      setIsStoppingRecording(false);
    }, 3000);
  };
  
  const handleSave = () => {
    setStage('saving');
  };
  
  const handleConfirmSave = () => {
    if (!title) {
      Alert.alert('Error', 'Please enter a title for this transcription');
      return;
    }
    
    // Here you would typically save the data to your backend or local storage
    Alert.alert(
      'Success',
      'Your transcription has been saved successfully!',
      [
        { 
          text: 'OK', 
          onPress: () => navigation.goBack() 
        }
      ]
    );
  };
  
  const handleNewRecording = () => {
    setStage('initial');
    setDisplayedTranscription('');
    setTranscription('');
    setSummary({});
    setTitle('');
    setIsCopied(false);
    setIsStoppingRecording(false);
  };
  
  const handleCopyToClipboard = async () => {
    const summaryText = `
      ${summary.title}
      
      Key Points:
      ${summary.keyPoints.map(point => `• ${point}`).join('\n')}
      
      Medications:
      ${summary.medications.map(med => `• ${med}`).join('\n')}
      
      Follow-up:
      ${summary.followUp}
    `;
    
    // await Clipboard.setStringAsync(summaryText);
    setIsCopied(true);
    
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };
  
  // Custom App Bar component
  const CustomAppBar = ({ navigation, title }) => (
    <View style={styles.appBar}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.appBarTitle}>{title}</Text>
      <View style={styles.appBarRight}>
        {/* You can add right-side icons here if needed */}
      </View>
    </View>
  );
  
  // Render the initial screen with start recording button
  const renderInitialScreen = () => (
    <View style={styles.initialContainer}>
      <View style={styles.initialContent}>
        {/* <Icon
          name="mic"
          size={120}
          color="#4285F4"
          style={styles.illustration}
        /> */}
        <Text style={styles.initialTitle}>Transcribe Medical Conversations</Text>
        <Text style={styles.initialDescription}>
          Record and transcribe your medical conversations to get AI-powered summaries and key points.
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.startRecordingButton}
        onPress={handleStartRecording}
      >
        <Icon name="mic" size={24} color="#FFFFFF" />
        <Text style={styles.startRecordingText}>Start Recording</Text>
      </TouchableOpacity>
    </View>
  );
  
  // Render the recording screen with waveform animation
  const renderRecordingScreen = () => (
    <View style={styles.recordingContainer}>
      <View style={styles.recordingHeader}>
        <Text style={styles.recordingTitle}>Recording...</Text>
        <Text style={styles.recordingTimer}>00:15</Text>
      </View>
      
      <View style={styles.waveformContainer}>
        <Animated.View 
          style={[
            styles.recordingCircle,
            {
              transform: [
                { scale: pulseAnim }
              ]
            }
          ]}
        >
          <Icon name="mic" size={32} color="#FFFFFF" />
        </Animated.View>
        
        <View style={styles.waveformWrapper}>
          <Animated.View 
            style={[
              styles.waveformBar,
              {
                transform: [
                  { scaleY: waveAnim1 },
                  { translateY: 0 }
                ]
              }
            ]}
          />
          <Animated.View 
            style={[
              styles.waveformBar,
              {
                transform: [
                  { scaleY: waveAnim2 },
                  { translateY: 0 }
                ]
              }
            ]}
          />
          <Animated.View 
            style={[
              styles.waveformBar,
              {
                transform: [
                  { scaleY: waveAnim3 },
                  { translateY: 0 }
                ]
              }
            ]}
          />
          <Animated.View 
            style={[
              styles.waveformBar,
              {
                transform: [
                  { scaleY: waveAnim1 },
                  { translateY: 0 }
                ]
              }
            ]}
          />
          <Animated.View 
            style={[
              styles.waveformBar,
              {
                transform: [
                  { scaleY: waveAnim2 },
                  { translateY: 0 }
                ]
              }
            ]}
          />
        </View>
      </View>
      
      <View style={styles.transcriptionPreviewContainer}>
        <Text style={styles.transcriptionPreviewTitle}>Transcription Preview</Text>
        <ScrollView 
          ref={recordingScrollViewRef}
          style={styles.transcriptionPreviewContent}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <Text style={styles.transcriptionPreviewText}>
            {displayedTranscription}
          </Text>
        </ScrollView>
      </View>
      
      <TouchableOpacity 
        style={styles.stopRecordingButton}
        onPress={handleStopRecording}
        disabled={isStoppingRecording}
      >
        <Icon name="stop" size={24} color="#FFFFFF" />
        <Text style={styles.stopRecordingText}>Stop Recording</Text>
      </TouchableOpacity>
    </View>
  );
  
  // Render the processing screen with loading indicator
  const renderProcessingScreen = () => (
    <View style={styles.processingContainer}>
      <ActivityIndicator size="large" color="#1167FE" />
      <Text style={styles.processingText}>Processing your recording...</Text>
    </View>
  );
  
  // Render the result screen with summary and transcription
  const renderResultScreen = () => (
    <ScrollView 
      ref={resultScrollViewRef}
      style={styles.resultContainer}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle}>{summary.title}</Text>
        <TouchableOpacity 
          style={[
            styles.copyButton,
            isCopied ? styles.copiedButton : null
          ]}
          onPress={handleCopyToClipboard}
        >
          <Icon name={isCopied ? "check" : "content-copy"} size={16} color={isCopied ? "#FFFFFF" : "#1167FE"} />
          <Text style={[
            styles.copyButtonText,
            isCopied ? styles.copiedButtonText : null
          ]}>
            {isCopied ? "Copied!" : "Copy Summary"}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Key Points</Text>
        {summary.keyPoints && summary.keyPoints.map((point, index) => (
          <View key={index} style={styles.keyPointItem}>
            <Icon name="check-circle" size={16} color="#4CAF50" style={styles.keyPointIcon} />
            <Text style={styles.keyPointText}>{point}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Medications</Text>
        <View style={styles.medicationsContainer}>
          {summary.medications && summary.medications.map((medication, index) => (
            <View key={index} style={styles.medicationItem}>
              <Icon name="medication" size={16} color="#1167FE" style={styles.medicationIcon} />
              <Text style={styles.medicationText}>{medication}</Text>
            </View>
          ))}
        </View>
        
        <Text style={styles.sectionTitle}>Follow-up</Text>
        <View style={styles.followUpContainer}>
          <Text style={styles.followUpText}>{summary.followUp}</Text>
        </View>
      </View>
      
      <View style={styles.transcriptionSection}>
        <View style={styles.transcriptionHeader}>
          <Text style={styles.transcriptionTitle}>Full Transcription</Text>
        </View>
        <ScrollView 
          style={styles.transcriptionContent}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={true}
        >
          <Text style={styles.transcriptionFullText}>{transcription}</Text>
        </ScrollView>
      </View>
      
      <View style={styles.resultActions}>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Icon name="save" size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save Transcription</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.newRecordingButton}
          onPress={handleNewRecording}
        >
          <Icon name="mic" size={20} color="#666666" />
          <Text style={styles.newRecordingText}>New Recording</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
  
  // Render the saving screen with form
  const renderSavingScreen = () => (
    <View style={styles.savingContainer}>
      <View style={styles.saveForm}>
        <Text style={styles.saveTitle}>Save Transcription</Text>
        
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Title</Text>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter a title for this transcription"
          />
        </View>
        
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Date</Text>
          <View style={styles.dateField}>
            <Icon name="event" size={20} color="#666666" />
            <Text style={styles.dateText}>
              {date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={handleConfirmSave}
        >
          <Text style={styles.confirmButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <CustomAppBar 
        navigation={navigation} 
        title="Transcribe AI" 
      />
      
      {stage === 'initial' && renderInitialScreen()}
      {stage === 'recording' && renderRecordingScreen()}
      {stage === 'processing' && renderProcessingScreen()}
      {stage === 'result' && renderResultScreen()}
      {stage === 'saving' && renderSavingScreen()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    padding: 8,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  appBarRight: {
    width: 40,
  },
  initialContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  initialContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  initialTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  initialDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  startRecordingButton: {
    backgroundColor: '#1167FE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
  },
  startRecordingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  recordingContainer: {
    flex: 1,
    padding: 16,
  },
  recordingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  recordingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  recordingTimer: {
    fontSize: 16,
    color: '#FF5252',
    fontWeight: '600',
  },
  waveformContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  recordingCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1167FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  waveformWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
  waveformBar: {
    width: 4,
    height: 40,
    backgroundColor: '#1167FE',
    borderRadius: 2,
    marginHorizontal: 4,
  },
  transcriptionPreviewContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  transcriptionPreviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  transcriptionPreviewContent: {
    flex: 1,
  },
  transcriptionPreviewText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  stopRecordingButton: {
    backgroundColor: '#FF5252',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
  },
  stopRecordingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  processingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 16,
  },
  resultContainer: {
    flex: 1,
    padding: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
    marginRight: 16,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1167FE',
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  copyButtonText: {
    color: '#1167FE',
    fontSize: 14,
    marginLeft: 8,
  },
  copiedButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  copiedButtonText: {
    color: '#FFFFFF',
  },
  summarySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  keyPointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  keyPointIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  keyPointText: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  medicationsContainer: {
    marginBottom: 16,
  },
  medicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  medicationIcon: {
    marginRight: 8,
  },
  medicationText: {
    fontSize: 14,
    color: '#666666',
  },
  followUpContainer: {
    marginBottom: 8,
  },
  followUpText: {
    fontSize: 14,
    color: '#666666',
  },
  transcriptionSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  transcriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transcriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  transcriptionContent: {
    maxHeight: 200,
  },
  transcriptionFullText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  resultActions: {
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#1167FE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  newRecordingButton: {
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
  },
  newRecordingText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  savingContainer: {
    flex: 1,
    padding: 16,
  },
  saveForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  saveTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  formField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  dateField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 8,
  },
  titleInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333333',
  },
  confirmButton: {
    backgroundColor: '#1167FE',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TranscribeAIScreen; 