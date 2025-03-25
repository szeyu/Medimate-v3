import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const UserHeader = ({ username = "SSYOK" }) => {
  const navigation = useNavigation();
  const [isPressed, setIsPressed] = useState(false);
  
  // Handle the press with a slight delay
  const handlePress = () => {
    setIsPressed(true);
    
    // Add a slight delay before navigation
    setTimeout(() => {
      navigation.navigate('Profile');
      setIsPressed(false);
    }, 50); // 50ms delay for a natural feel
  };

  return (
    <TouchableOpacity 
      style={[
        styles.userHeader,
        isPressed && styles.userHeaderPressed
      ]}
      activeOpacity={0.7}
      onPress={handlePress}
    >
      <View style={styles.profileLeft}>
        <Image 
          source={require('../../assets/user-icon.png')} 
          style={styles.profileImage}
          defaultSource={require('../../assets/user-icon.png')}
        />
        <View style={styles.userInfo}>
          <Text style={styles.greeting}>Hi, {username} <Text style={styles.waveEmoji}>👋</Text></Text>
          <View style={styles.membershipRow}>
            <View style={styles.percentageContainer}>
              <Ionicons name="add" size={16} color="#1167FE" />
              <Text style={styles.percentageText}>88%</Text>
            </View>
            <View style={styles.proMemberContainer}>
              <FontAwesome name="star" size={16} color="#FFD700" />
              <Text style={styles.proMemberText}>Pro Member</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.rightIcons}>
        <Ionicons 
          name="chevron-forward" 
          size={24} 
          color="#FFFFFF" 
          style={isPressed && styles.arrowPressed}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  userHeader: {
    padding: 16,
    backgroundColor: '#2D3748',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  userHeaderPressed: {
    backgroundColor: '#253040', // Slightly darker when pressed
    transform: [{ scale: 0.98 }], // Slight scale down effect
  },
  arrowPressed: {
    transform: [{ translateX: 3 }], // Move arrow slightly right when pressed
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#8D9BB5',
  },
  userInfo: {
    marginLeft: 15,
  },
  greeting: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  waveEmoji: {
    fontSize: 22,
  },
  membershipRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  percentageText: {
    color: '#1167FE',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  proMemberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  proMemberText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    marginRight: 12,
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
    borderRadius: 12,
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