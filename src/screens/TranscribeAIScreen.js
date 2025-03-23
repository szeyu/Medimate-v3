import React, { useState, useRef, useEffect } from 'react';
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
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
//import Clipboard from '@react-native-clipboard/clipboard';

const TranscribeAIScreen = ({ navigation, route }) => {
  const [stage, setStage] = useState('initial'); // initial, recording, processing, result, saving
  const [transcription, setTranscription] = useState('');
  const [summary, setSummary] = useState({});
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [isCopied, setIsCopied] = useState(false);
  
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim1 = useRef(new Animated.Value(0)).current;
  const waveAnim2 = useRef(new Animated.Value(0)).current;
  const waveAnim3 = useRef(new Animated.Value(0)).current;
  
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
  }, [stage]);
  
  // Start recording
  const startRecording = () => {
    setStage('recording');
    
    // Simulate recording for 5 seconds
    setTimeout(() => {
      // Simulate transcription result
      setTranscription("I am taking this medicine.\n\nYes I know, this is called ibuprofen. You should take it seriously. It is a controlled medicine in Malaysia.\n\nShould I eat after or before meal?\n\nYou should eat it after meal.");
      setStage('processing');
      
      // Simulate processing for 2 seconds
      setTimeout(() => {
        // Simulate summary result
        setSummary({
          summary: [
            'Patient takes ibuprofen.',
            'Doctor confirms it\'s a controlled drug in Malaysia.',
            'Take after a meal to avoid stomach issues.',
          ],
          warnings: [
            'No empty stomach - can cause ulcers.',
            'Watch for side effects - nausea, dizziness, pain.',
          ],
          missed: [
            'Dosage & duration - confirm with the doctor.',
            'Who should avoid it - pregnant women, ulcer patients.',
            'Alternatives - paracetamol may be safer.',
          ],
          advice: [
            'Take with food.',
            'Follow dosage.',
            'Watch for side effects.',
            'Consult a doctor if unsure.',
          ]
        });
        setStage('result');
      }, 2000);
    }, 5000);
  };
  
  // Cancel recording
  const cancelRecording = () => {
    setStage('initial');
  };
  
  // Save result
  const saveResult = () => {
    setStage('saving');
  };
  
  // Confirm save
  const confirmSave = () => {
    // Here you would save the transcription to your database
    navigation.goBack();
  };
  
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
  
  const handleCopy = () => {
    // Create a formatted string of the summary
    const summaryText = `Summary:\n${summary.summary?.join('\n')}\n\n` +
      `Warnings:\n${summary.warnings?.join('\n')}\n\n` +
      `What the Doctor Missed:\n${summary.missed?.join('\n')}\n\n` +
      `Final Advice:\n${summary.advice?.join('\n')}`;

    // Clipboard.setString(summaryText);
    setIsCopied(true);
    ToastAndroid.show('Copied to clipboard!', ToastAndroid.SHORT);

    // Reset the "Copied" state after 2 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  
  // Render different content based on stage
  const renderContent = () => {
    switch (stage) {
      case 'initial':
        return (
          <View style={styles.centeredContent}>
            <Text style={styles.instructionText}>
              Tap the microphone to start recording a conversation with your doctor or about your medication
            </Text>
            <TouchableOpacity 
              style={styles.recordButton}
              onPress={startRecording}
            >
              <Icon name="mic" size={40} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.helpText}>
              The AI will transcribe and summarize important medical information
            </Text>
          </View>
        );
        
      case 'recording':
        return (
          <View style={styles.centeredContent}>
            <View style={styles.transcribingHeader}>
              <Text style={styles.transcribingTitle}>Transcribing...</Text>
            </View>
            
            <View style={styles.recordingContainer}>
              <View style={styles.wavesContainer}>
                <Animated.View style={[styles.wave, { opacity: wave1Opacity, transform: [{ scale: 1.8 }] }]} />
                <Animated.View style={[styles.wave, { opacity: wave2Opacity, transform: [{ scale: 2.4 }] }]} />
                <Animated.View style={[styles.wave, { opacity: wave3Opacity, transform: [{ scale: 3.0 }] }]} />
              </View>
              
              <Animated.View
                style={[
                  styles.recordingIndicator,
                  { transform: [{ scale: pulseAnim }] }
                ]}
              >
                <Icon name="mic" size={32} color="#FFFFFF" />
              </Animated.View>
            </View>
            
            <View style={styles.transcriptionPreview}>
              <Text style={styles.transcriptionText}>
                {transcription || "Listening..."}
              </Text>
            </View>
            
            <View style={styles.recordingActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={cancelRecording}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.doneButton}
                onPress={() => setStage('processing')}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
        
      case 'processing':
        return (
          <View style={styles.centeredContent}>
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color="#1167FE" />
              <Text style={styles.processingText}>Processing transcription...</Text>
            </View>
          </View>
        );
        
      case 'result':
        return (
          <ScrollView style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Transcribe Result</Text>
            </View>
            
            <View style={styles.summarySection}>
              <View style={styles.sectionHeader}>
                <Icon name="check-circle" size={20} color="#4CAF50" />
                <Text style={styles.sectionTitle}>Summary</Text>
              </View>
              
              <View style={styles.sectionContent}>
                {summary.summary?.map((item, index) => (
                  <View key={index} style={styles.bulletItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.summarySection}>
              <View style={styles.sectionHeader}>
                <Icon name="warning" size={20} color="#FFC107" />
                <Text style={styles.sectionTitle}>Warnings</Text>
              </View>
              
              <View style={styles.sectionContent}>
                {summary.warnings?.map((item, index) => (
                  <View key={index} style={styles.bulletItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.summarySection}>
              <View style={styles.sectionHeader}>
                <Icon name="info" size={20} color="#2196F3" />
                <Text style={styles.sectionTitle}>What the Doctor Missed</Text>
              </View>
              
              <View style={styles.sectionContent}>
                {summary.missed?.map((item, index) => (
                  <View key={index} style={styles.bulletItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.summarySection}>
              <View style={styles.sectionHeader}>
                <Icon name="lightbulb" size={20} color="#FF9800" />
                <Text style={styles.sectionTitle}>Final Advice</Text>
              </View>
              
              <View style={styles.sectionContent}>
                {summary.advice?.map((item, index) => (
                  <View key={index} style={styles.bulletItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.resultActions}>
              <TouchableOpacity 
                style={[
                  styles.actionButton, 
                  styles.copyButton,
                  isCopied && styles.copiedButton
                ]}
                onPress={handleCopy}
              >
                <Text style={[
                  styles.copyButtonText,
                  isCopied && styles.copiedButtonText
                ]}>
                  {isCopied ? 'Copied!' : 'Copy'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.saveButton]}
                onPress={saveResult}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        );
        
      case 'saving':
        return (
          <View style={styles.savingContainer}>
            <View style={styles.saveForm}>
              <Text style={styles.saveTitle}>Save Result</Text>
              
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Date of Visit</Text>
                <View style={styles.dateField}>
                  <Icon name="calendar-today" size={16} color="#666666" />
                  <Text style={styles.dateText}>Tue, 18 Mar 2023</Text>
                </View>
              </View>
              
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Title</Text>
                <TextInput
                  style={styles.titleInput}
                  value={title || "Safe Use of Ibuprofen: Doctor's Advice and Patient Precautions"}
                  onChangeText={setTitle}
                  placeholder="Enter a title for this transcription"
                />
              </View>
              
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={confirmSave}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transcribe AI</Text>
        <View style={{ width: 24 }} />
      </View>
      
      {renderContent()}
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
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666666',
    lineHeight: 24,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1167FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#1167FE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  helpText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#888888',
    maxWidth: 300,
  },
  transcribingHeader: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  transcribingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  recordingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  wavesContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wave: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1167FE',
  },
  recordingIndicator: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  transcriptionPreview: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    height: 200,
    marginBottom: 24,
  },
  transcriptionText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
  },
  recordingActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  doneButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#1167FE',
    alignItems: 'center',
    marginLeft: 8,
  },
  doneButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  processingContainer: {
    alignItems: 'center',
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
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 12,
    backgroundColor: '#1E293B',
    borderRadius: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  summarySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionContent: {
    paddingLeft: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#666666',
    marginRight: 8,
  },
  bulletText: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
    lineHeight: 20,
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  copyButton: {
    backgroundColor: '#F8F9FA',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  copyButtonText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#1167FE',
    marginLeft: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  savingContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  saveForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
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
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 8,
  },
  titleInput: {
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#1167FE',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  copiedButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  copiedButtonText: {
    color: '#FFFFFF',
  },
});

export default TranscribeAIScreen; 