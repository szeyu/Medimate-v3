import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const ScanScreen = ({ navigation }) => {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [flashMode, setFlashMode] = useState(false);

  const toggleFlash = () => {
    setFlashMode(!flashMode);
  };

  const handleCapture = () => {
    setScanning(true);
    
    // Simulate OCR processing
    setTimeout(() => {
      setScanned(true);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Scan Medication</Text>
        
        <TouchableOpacity
          style={styles.flashButton}
          onPress={toggleFlash}
        >
          <Ionicons 
            name={flashMode ? "flash" : "flash-off"} 
            size={20} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.cameraContainer}>
        {/* Mock camera view with hardcoded image */}
        <Image 
          source={require('../../../assets/medicationSample.png')} 
          style={styles.mockCamera}
          resizeMode="contain"
        />
        
        {/* Scan frame overlay */}
        <View style={styles.scanFrame}>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
        </View>
        
        {/* Instruction text */}
        <Text style={styles.instructionText}>
          Position the medication label within the frame
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={handleCapture}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
      </View>
      
      {/* Processing overlay */}
      {scanning && !scanned && (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.processingText}>OCR in progress...</Text>
        </View>
      )}
      
      {/* Result overlay */}
      {scanned && (
        <View style={styles.resultContainer}>
          <Icon name="check-circle" size={60} color="#4CAF50" />
          <Text style={styles.resultText}>Scan Complete!</Text>
          <Text style={styles.resultSubtext}>Vitamin B12 50mcg detected</Text>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => {
              navigation.navigate('AddMedication', { 
                medicationData: {
                  name: "Vitamin B12",
                  description: "Vitamin B12, also known as cobalamin, is an essential nutrient that supports the production of red blood cells and proper neurological function.",
                  dosage: "50mcg",
                  frequency: "Once daily",
                  time: "12:00 PM",
                  startDate: new Date(),
                  duration: "6 weeks",
                  instructions: "Take with food",
                  quantity: "90 tablets",
                  refillDate: "2025-05-01"
                }
              });
            }}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  flashButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mockCamera: {
    width: width,
    height: height * 0.5,
  },
  scanFrame: {
    position: 'absolute',
    width: width * 0.8,
    height: height * 0.3,
    borderWidth: 2,
    borderColor: 'rgba(138, 63, 252, 0.5)',
    backgroundColor: 'transparent',
  },
  cornerTL: {
    position: 'absolute',
    top: -3,
    left: -3,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#8A3FFC',
  },
  cornerTR: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#8A3FFC',
  },
  cornerBL: {
    position: 'absolute',
    bottom: -3,
    left: -3,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#8A3FFC',
  },
  cornerBR: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#8A3FFC',
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 8,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  processingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  processingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  resultContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  resultText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  resultSubtext: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 30,
  },
  continueButton: {
    backgroundColor: '#8A3FFC',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  }
});

export default ScanScreen;