import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AiAppBar from '../components/AiAppBar';

const AIToolsScreen = ({ navigation }) => {
  // AI tools data
  const aiTools = [
    {
      id: '1',
      title: 'Wellness AI Chatbot',
      description: 'Chat with our AI assistant about your health concerns and get personalized advice.',
      icon: 'chat',
      iconType: 'material',
      color: '#1167FE',
      screen: 'WellnessAIChatbot',
    },
    {
      id: '2',
      title: 'Voice Assistant',
      description: 'Talk to our AI assistant using your voice for a hands-free experience.',
      icon: 'microphone',
      iconType: 'community',
      color: '#FF5A5A',
      screen: 'VoiceAssistance',
    },
    {
      id: '3',
      title: 'Test Glucose Level',
      description: 'Use voice commands to test and track your glucose levels.',
      icon: 'water',
      iconType: 'community',
      color: '#20C997',
      screen: 'TestGlucoseLevel',
    },
    {
      id: '4',
      title: 'Transcribe AI',
      description: 'Record and transcribe medical conversations with AI-powered summaries.',
      icon: 'transcribe',
      iconType: 'community',
      color: '#FFC107',
      screen: 'TranscribeAI',
    },
    {
      id: '5',
      title: 'AI Health Guidance',
      description: 'Get personalized health guidance from our AI-powered tools.',
      icon: 'medical-services',
      iconType: 'material',
      color: '#6610F2',
      screen: 'AiHealthSuggestion',
    }
  ];

  const renderToolCard = (tool) => {
    const IconComponent = tool.iconType === 'material' ? Icon : MaterialCommunityIcons;
    
    return (
      <TouchableOpacity
        key={tool.id}
        style={styles.toolCard}
        onPress={() => navigation.navigate(tool.screen)}
      >
        <View style={[styles.iconContainer, { backgroundColor: tool.color }]}>
          <IconComponent name={tool.icon} size={28} color="#FFFFFF" />
        </View>
        <View style={styles.toolInfo}>
          <Text style={styles.toolTitle}>{tool.title}</Text>
          <Text style={styles.toolDescription}>{tool.description}</Text>
        </View>
        <Icon name="chevron-right" size={24} color="#8D9BB5" />
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Health Tools</Text>
      </View> */}
      <AiAppBar navigation={navigation}/>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.bannerContainer}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Powered by AI</Text>
            <Text style={styles.bannerDescription}>
              Our AI tools help you manage your health more effectively with personalized insights and assistance.
            </Text>
          </View>
          <View style={styles.bannerIconContainer}>
            {/* <MaterialCommunityIcons name="robot" size={60} color="#FFFFFF" /> */}
            <Image source={require('../../assets/chatbot-image.png')} style={styles.bannerIcon} />
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Available Tools</Text>
        
        <View style={styles.toolsContainer}>
          {aiTools.map(tool => renderToolCard(tool))}
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80, // Extra padding for bottom nav bar
  },
  bannerContainer: {
    backgroundColor: '#242E49',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerContent: {
    flex: 1,
    paddingRight: 16,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  bannerDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    lineHeight: 20,
    marginRight: 4,
  },
  bannerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerIcon: {
    height: 130,
    width: 130,
    paddingRight: 5,
    marginTop: 23,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  toolsContainer: {
    marginBottom: 24,
  },
  toolCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  toolInfo: {
    flex: 1,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});

export default AIToolsScreen; 