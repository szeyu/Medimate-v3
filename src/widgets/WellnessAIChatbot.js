import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const WellnessAIChatbot = () => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderWithHelp}>
        <View style={styles.cardHeader}>
          <Icon name="chat-bubble-outline" size={20} color="#000000" />
          <Text style={styles.cardTitle}>Wellness AI Chatbot</Text>
        </View>
        <Icon name="help-outline" size={20} color="#9E9E9E" />
      </View>
      <View style={styles.badgeContainer}>
        <View style={styles.basicBadge}>
          <Text style={styles.basicBadgeText}>BASIC</Text>
        </View>
      </View>
      <View style={styles.chatbotStats}>
        <View>
          <Text style={styles.chatbotStatsNumber}>1,922</Text>
          <Text style={styles.chatbotStatsLabel}>total</Text>
          <Text style={styles.chatbotStatsDescription}>
            AI Health Chatbot Conversations
          </Text>
        </View>
        <View style={styles.chatbotIconContainer}>
          <Icon name="chat-bubble-outline" size={30} color="#1167FE" />
          <View style={styles.chatbotAddButton}>
            <Icon name="add" size={16} color="#FFFFFF" />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderWithHelp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  badgeContainer: {
    marginBottom: 16,
  },
  basicBadge: {
    backgroundColor: '#1167FE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  basicBadgeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  chatbotStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatbotStatsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  chatbotStatsLabel: {
    fontSize: 14,
    color: '#9E9E9E',
  },
  chatbotStatsDescription: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 4,
  },
  chatbotIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatbotAddButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#1167FE',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WellnessAIChatbot; 