import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
const chatbot = require('../../assets/chatbot-image.png');


const WellnessAIChatbotCard = () => {
  const navigation = useNavigation();
  return (
    <View>
      <TouchableOpacity 
        onPress={() => navigation.navigate('WellnessAIChatbot')}
      >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Wellness AI Chatbot</Text>
        <Icon name="more-horiz" size={24} color="#9E9E9E" />
      </View>
      
      <View style={styles.chatbotCard}>
        <View style={styles.chatbotBadge}>
          <Text style={styles.badgeText}>BASIC</Text>
        </View>
        
        <View style={styles.chatbotContent}>
          <View>
            <View style={styles.countContainer}>
              <Text style={styles.conversationCount}>1,922</Text>
              <Text style={styles.totalText}>Total</Text>
            </View>
            <Text style={styles.chatbotDescription}>
              AI Health Chatbot{'\n'}Conversations
            </Text>
          </View>
          <Image source = {chatbot} style={styles.chatbotImage} />
        </View>
      </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chatbotCard: {
    backgroundColor: '#242E49',
    borderRadius: 16,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chatbotBadge: {
    backgroundColor: '#458CFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 16,
    borderColor: '#1167FE',
    borderWidth: 3,
    marginTop: -6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  chatbotContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  conversationCount: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: -10,
  },
  totalText: {
    color: '#AAAAAA',
    fontSize: 16,
    marginLeft: 8,
  },
  chatbotDescription: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 2,
  },
  chatbotImage: {
    position: 'absolute',
    right: -23,
    bottom: -21,
    height: 180,
    width: 180,
    opacity: 1,
    zIndex: 0, // Place behind the text content
    borderRadius: 16,
  },
});

export default WellnessAIChatbotCard;


