import React, { useRef, useEffect } from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Animated, 
  } from 'react-native';
  import Icon from 'react-native-vector-icons/MaterialIcons';

const DisclaimerModal = ({ visible, onClose }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  const handleClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.modalContainer,
            { opacity: fadeAnim, transform: [{ scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }] }
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Important Health Disclaimer</Text>
            <TouchableOpacity onPress={handleClose}>
              <Icon name="close" size={24} color="#000000" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <Icon name="warning" size={32} color="#FFA726" style={styles.warningIcon} />
            <Text style={styles.disclaimerText}>
              The Wellness AI Assistant provides general health information and suggestions based on the data you share.
            </Text>
            <Text style={styles.disclaimerText}>
              This is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.
            </Text>
            <Text style={styles.disclaimerText}>
              In case of emergency, contact your local emergency services immediately.
            </Text>
          </View>
          
          <TouchableOpacity style={styles.acknowledgmentButton} onPress={handleClose}>
            <Text style={styles.acknowledgmentButtonText}>I Understand</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212121',
    },
    modalContent: {
        padding: 20,
    },
    warningIcon: {
        alignSelf: 'center',
        marginBottom: 16,
    },
    disclaimerText: {
        fontSize: 14,
        color: '#424242',
        marginBottom: 12,
        lineHeight: 20,
        textAlign: 'center',
    },
    acknowledgmentButton: {
        backgroundColor: '#1167FE',
        padding: 14,
        alignItems: 'center',
        margin: 16,
        borderRadius: 8,
    },
    acknowledgmentButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default DisclaimerModal;