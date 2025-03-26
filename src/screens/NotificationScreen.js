import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NotificationScreen = ({ navigation }) => {
  // Sample notification data
  const notifications = [
    {
        id: '1',
        title: 'Medication Reminder',
        message: 'Time to take Painexal',
        time: 'now',
        type: 'medication',
        read: false,
    },
    {
        id: '2',
        title: 'Medication Reminder',
        message: 'Time to take Vitamin C',
        time: '1 hour ago',
        type: 'medication',
        read: false,
    },
    {
      id: '3',
      title: 'Alert',
      message: 'Heart rate is high. Please check your health status or consult a doctor immediately.',
      time: 'Yesterday',
      type: 'Alert',
      read: true,
    },
    {
        id: '4',
        title: 'Medication Reminder',
        message: 'Time to take Vitamin C',
        time: 'Yesterday',
        type: 'medication',
        read: true,
    },
    {
        id: '5',
        title: 'Health Tip',
        message: 'Remember to drink at least 8 glasses of water today',
        time: '2 days ago',
        type: 'tip',
        read: true,
    },
  ];

  const renderNotificationItem = ({ item }) => {
    let iconName;
    let iconColor;

    switch (item.type) {
      case 'medication':
        iconName = 'medication';
        iconColor = '#1167FE';
        break;
      case 'appointment':
        iconName = 'event';
        iconColor = '#20C997';
        break;
      case 'tip':
        iconName = 'lightbulb';
        iconColor = '#FFC107';
        break;
      case 'Alert':
        iconName = 'warning';
        iconColor = '#DC3545';
        break;
      default:
        iconName = 'notifications';
        iconColor = '#718096';
    }

    return (
      <TouchableOpacity 
        style={[styles.notificationItem, !item.read && styles.unreadItem]}
        onPress={() => {
          // Handle notification press - could navigate to relevant screen
          if (item.type === 'medication') {
            navigation.navigate('Medications');
          }
        }}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
          <Icon name={iconName} size={24} color={iconColor} />
        </View>
        
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        
        {!item.read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={20} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Icon name="more-vert" size={20} color="#000000" />
        </TouchableOpacity>
      </View>
      
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.notificationsList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="notifications-off" size={80} color="#E2E8F0" />
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F5F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F3F5F9',
    marginTop: 40,
  },
  backButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(2, 1, 1, 0.2)',
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  moreButton: {
    padding: 8,
  },
  notificationsList: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadItem: {
    backgroundColor: '#EBF8FF',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1167FE',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#718096',
    marginTop: 16,
  },
});

export default NotificationScreen; 