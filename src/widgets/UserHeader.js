import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const UserHeader = () => {
  const navigation = useNavigation();

  const handleNotificationPress = () => {
    navigation.navigate('NotificationScreen');
  };

  return (
    <View style={styles.userHeader}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>👤</Text>
      </View>
      <View style={styles.userInfo}>
        <View style={styles.userNameRow}>
          <Text style={styles.userName}>Hi, SSYOK</Text>
          <Icon name="verified" size={18} color="#FFC107" />
        </View>
        <View style={styles.userStatsRow}>
          <Text style={styles.userStatsText}>88</Text>
          <Icon name="star" size={14} color="#FFC107" style={styles.starIcon} />
          <Text style={styles.userStatsText}>Pro Member</Text>
        </View>
      </View>
      <View style={styles.rightIcons}>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={handleNotificationPress}
        >
          <Icon name="notifications" size={24} color="#FFFFFF" />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
        <Icon name="chevron-right" size={24} color="#FFFFFF" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userHeader: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#2D3748',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#9E9E9E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 4,
  },
  userStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userStatsText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  starIcon: {
    marginHorizontal: 8,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    marginRight: 12,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF4757',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default UserHeader; 