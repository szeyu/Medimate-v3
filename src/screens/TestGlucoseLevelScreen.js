import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TestGlucoseLevelScreen = ({ navigation }) => {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  
  const startRecording = () => {
    setRecording(true);
    
    // Simulate recording for 3 seconds
    setTimeout(() => {
      setRecording(false);
      setProcessing(true);
      
      // Simulate processing for 2 seconds
      setTimeout(() => {
        setProcessing(false);
        setResult({
          level: 100,
          status: 'Normal',
          recommendations: [
            'Consider brown rice to replace white rice',
            'Consider reducing the intake of sweet'
          ]
        });
      }, 2000);
    }, 3000);
  };
  
  const handleSave = () => {
    Alert.alert(
      'Success',
      'Your glucose test result has been saved.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };
  
  const handleRetry = () => {
    setResult(null);
  };
  
  // Custom App Bar component
  const CustomAppBar = ({ navigation }) => (
    <View style={styles.appBar}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="#000000" />
      </TouchableOpacity>
      <Text style={styles.appBarTitle}>Test Glucose Level</Text>
      <View style={styles.appBarRight}>
        {/* Empty view for spacing */}
      </View>
    </View>
  );
  
  const renderInitialState = () => (
    <View style={styles.centeredContainer}>
      <View style={styles.micContainer}>
        <TouchableOpacity 
          style={styles.micButton}
          onPress={startRecording}
        >
          <Icon name="mic" size={40} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.micInstructions}>
          Tap the microphone and say{'\n'}
          "I want to test my glucose level"
        </Text>
      </View>
    </View>
  );
  
  const renderRecordingState = () => (
    <View style={styles.centeredContainer}>
      <View style={styles.recordingContainer}>
        <View style={styles.recordingIndicator}>
          <Icon name="mic" size={40} color="#F44336" />
        </View>
        <Text style={styles.recordingText}>Recording...</Text>
        <Text style={styles.listeningText}>
          Listening for "I want to test my glucose level"
        </Text>
      </View>
    </View>
  );
  
  const renderProcessingState = () => (
    <View style={styles.centeredContainer}>
      <ActivityIndicator size="large" color="#1167FE" />
      <Text style={styles.processingText}>Processing your voice sample...</Text>
    </View>
  );
  
  const renderResultState = () => (
    <View style={styles.resultContainer}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle}>Glucose Test Result</Text>
        <Text style={styles.resultTimestamp}>Today, 2:30 PM</Text>
      </View>
      
      <View style={styles.resultValueContainer}>
        <Text style={styles.resultValue}>{result.level}</Text>
        <Text style={styles.resultUnit}>mg/dL</Text>
      </View>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Status: {result.status}</Text>
      </View>
      
      <View style={styles.riskIndicatorContainer}>
        <View style={styles.riskGradient}>
          <View style={styles.riskGradientInner}>
            <View style={styles.riskGradientLow} />
            <View style={styles.riskGradientMedium} />
            <View style={styles.riskGradientHigh} />
          </View>
          <View 
            style={[
              styles.riskPointer, 
              { left: `${calculatePointerPosition(result.level)}%` }
            ]} 
          />
        </View>
        <View style={styles.riskLabelsContainer}>
          <Text style={styles.riskLabel}>Low (70-90)</Text>
          <Text style={styles.riskLabel}>Normal (90-120)</Text>
          <Text style={styles.riskLabel}>High (120+)</Text>
        </View>
      </View>
      
      <View style={styles.recommendationsContainer}>
        <Text style={styles.recommendationsTitle}>Action Recommended</Text>
        {result.recommendations.map((recommendation, index) => (
          <View key={index} style={styles.recommendationItem}>
            <Icon name="check-circle" size={20} color="#4CAF50" />
            <Text style={styles.recommendationText}>{recommendation}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.saveButton]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.retryButton]}
          onPress={handleRetry}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const calculatePointerPosition = (level) => {
    // Define the glucose ranges
    const lowMin = 70;
    const lowMax = 90;
    const normalMin = 90;
    const normalMax = 120;
    const highMin = 120;
    const highMax = 180; // Setting an upper bound for visualization
    
    // Define position ranges (in percentage)
    const posMin = 5;  // Minimum position (left edge)
    const posMax = 95; // Maximum position (right edge)
    
    let position;
    
    if (level < lowMin) {
      // Below minimum range
      position = posMin;
    } else if (level <= lowMax) {
      // Low range (70-90): 5% to 33%
      position = posMin + ((level - lowMin) / (lowMax - lowMin)) * (33 - posMin);
    } else if (level <= normalMax) {
      // Normal range (90-120): 33% to 67%
      position = 33 + ((level - normalMin) / (normalMax - normalMin)) * (67 - 33);
    } else if (level <= highMax) {
      // High range (120-180): 67% to 95%
      position = 67 + ((level - highMin) / (highMax - highMin)) * (posMax - 67);
    } else {
      // Above maximum range
      position = posMax;
    }
    
    return Math.round(position);
  };

  return (
    <View style={styles.container}>
      <CustomAppBar navigation={navigation} />
      
      <View style={styles.content}>
        {!recording && !processing && !result && renderInitialState()}
        {recording && renderRecordingState()}
        {processing && renderProcessingState()}
        {result && renderResultState()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    top: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
  content: {
    flex: 1,
    padding: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micContainer: {
    alignItems: 'center',
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1167FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  micInstructions: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  recordingContainer: {
    alignItems: 'center',
  },
  recordingIndicator: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  recordingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 8,
  },
  listeningText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  processingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 16,
  },
  resultContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  resultTimestamp: {
    fontSize: 14,
    color: '#666666',
  },
  resultValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  resultValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1167FE',
  },
  resultUnit: {
    fontSize: 16,
    color: '#666666',
    marginLeft: 8,
  },
  statusContainer: {
    marginBottom: 24,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  riskIndicatorContainer: {
    marginBottom: 32,
  },
  riskGradient: {
    height: 8,
    borderRadius: 4,
    position: 'relative',
  },
  riskGradientInner: {
    flexDirection: 'row',
    height: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  riskGradientLow: {
    flex: 1,
    backgroundColor: '#4CAF50', // Green
  },
  riskGradientMedium: {
    flex: 1,
    backgroundColor: '#FFC107', // Yellow
  },
  riskGradientHigh: {
    flex: 1,
    backgroundColor: '#F44336', // Red
  },
  riskPointer: {
    position: 'absolute',
    top: -4,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#1167FE',
  },
  riskLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  riskLabel: {
    fontSize: 12,
    color: '#666666',
  },
  recommendationsContainer: {
    marginBottom: 32,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationText: {
    fontSize: 16,
    marginLeft: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 0.48,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#1167FE',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  retryButtonText: {
    color: '#666666',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TestGlucoseLevelScreen; 