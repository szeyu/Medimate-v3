import React from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar, StyleSheet, TextInput } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const HomeAppBar = ({ navigation, username = "Guest 1" }) => {
  // Get current date
  const today = new Date();
  const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options).replace(',', '');

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#242E49" />
      <View style={styles.appBar}>
        {/* Date Display */}
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={20} color="#8D9BB5" />
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>

        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileLeft}>
            <Image 
              source={require('../assets/user-icon.png')} 
              style={styles.profileImage}
              defaultSource={require('../assets/user-icon.png')}
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
          <TouchableOpacity style={styles.profileRight} onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="chevron-forward" size={24} color="#8D9BB5" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8D9BB5" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search ..."
            placeholderTextColor="#8D9BB5"
          />
        </View>

        {/* Notification Bell */}
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
appBar: {
    backgroundColor: '#242E49',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    position: 'relative',
    alignSelf: 'center',
    overflow: 'hidden',
    width: '100%',
    height: 260,
    
},
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingTop: 10,
  },
  dateText: {
    color: '#8D9BB5',
    fontSize: 16,
    marginLeft: 8,
  },
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  profileRight: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  notificationButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 15,
    zIndex: 1,
  },
});

export default HomeAppBar;