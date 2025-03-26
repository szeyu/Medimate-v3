import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HelpCenterScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  const faqs = [
    {
      id: '1',
      question: 'How does MediMate work?',
      answer: 'MediMate is an AI-Powered Healthcare Assistant designed to empower individuals managing chronic diseases by providing real-time, personalized support for medication adherence, symptom monitoring, and mental health support.'
    },
    {
      id: '2',
      question: 'What is MediMate AI?',
      answer: 'MediMate AI is the artificial intelligence system that powers our app, providing personalized healthcare support, medication reminders, and health insights based on your data and interactions.'
    },
    {
      id: '3',
      question: 'Is MediMate AI a replacement for professional therapy?',
      answer: 'No, MediMate AI is not a replacement for professional therapy or medical care. It is designed to provide support and information, but you should always consult with a healthcare professional for medical advice.'
    },
    {
      id: '4',
      question: 'How do I access MediMate?',
      answer: 'You can access MediMate through our mobile app available on iOS and Android platforms. Simply download the app from your app store and create an account.'
    },
    {
      id: '5',
      question: 'Is MediMate free to use?',
      answer: 'MediMate offers both free and premium features. Basic health tracking and medication reminders are available for free, while advanced features require a subscription.'
    },
    {
      id: '6',
      question: 'Is my data secure?',
      answer: 'Yes, we take data security very seriously. All your health data is encrypted and stored securely. We comply with relevant healthcare privacy regulations to ensure your information remains confidential.'
    }
  ];
  
  const toggleFaq = (id) => {
    if (expandedFaq === id) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(id);
    }
  };
  
  const renderFaqContent = () => (
    <View style={styles.faqContainer}>
      <View style={styles.searchInputContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {faqs.map((faq) => (
        <TouchableOpacity 
          key={faq.id}
          style={[
            styles.faqItem,
            expandedFaq === faq.id && styles.faqItemExpanded
          ]}
          onPress={() => toggleFaq(faq.id)}
        >
          <View style={styles.faqHeader}>
            <Text style={styles.faqQuestion}>{faq.question}</Text>
            <Icon 
              name={expandedFaq === faq.id ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
              size={24} 
              color="#666" 
            />
          </View>
          
          {expandedFaq === faq.id && (
            <Text style={styles.faqAnswer}>{faq.answer}</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
  
  const renderLiveChatContent = () => (
    <View style={styles.liveChatContainer}>
      <Image
        source={{ uri: 'https://medimate.com/chat_illustration.png' }}
        style={styles.chatIllustration}
        resizeMode="contain"
      />
      
      <Text style={styles.chatTitle}>Chat With Our Live Representative.</Text>
      <Text style={styles.chatDescription}>We aim to reply within 1hr 😊</Text>
      
      <TouchableOpacity style={styles.startChatButton}>
        <Icon name="chat" size={20} color="#FFFFFF" />
        <Text style={styles.startChatText}>Start Live Chat</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQ Contents</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'faq' && styles.activeTab]}
          onPress={() => setActiveTab('faq')}
        >
          <Text style={[styles.tabText, activeTab === 'faq' && styles.activeTabText]}>FAQ</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'liveChat' && styles.activeTab]}
          onPress={() => setActiveTab('liveChat')}
        >
          <Text style={[styles.tabText, activeTab === 'liveChat' && styles.activeTabText]}>Live Chat</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {activeTab === 'faq' ? renderFaqContent() : renderLiveChatContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1167FE',
  },
  tabText: {
    fontSize: 16,
    color: '#666666',
  },
  activeTabText: {
    color: '#1167FE',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  faqContainer: {
    padding: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    paddingVertical: 12,
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  faqItemExpanded: {
    borderLeftWidth: 3,
    borderLeftColor: '#1167FE',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666666',
    marginTop: 12,
    lineHeight: 20,
  },
  liveChatContainer: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatIllustration: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  chatDescription: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
    textAlign: 'center',
  },
  startChatButton: {
    backgroundColor: '#1167FE',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
  },
  startChatText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default HelpCenterScreen; 