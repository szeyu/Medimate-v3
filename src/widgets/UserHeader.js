import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const UserHeader = () => {
  return (
    <View style={styles.userHeader}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>👤</Text>
      </View>
      <View style={styles.userInfo}>
        <View style={styles.userNameRow}>
          <Text style={styles.userName}>Hi, Dekomoril</Text>
          <Icon name="verified" size={18} color="#FFC107" />
        </View>
        <View style={styles.userStatsRow}>
          <Text style={styles.userStatsText}>88</Text>
          <Icon name="star" size={14} color="#FFC107" style={styles.starIcon} />
          <Text style={styles.userStatsText}>Pro Member</Text>
        </View>
      </View>
      <Icon name="chevron-right" size={24} color="#FFFFFF" />
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
});

export default UserHeader; 