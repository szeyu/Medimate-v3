import React from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar, StyleSheet, TextInput } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import UserHeader from '../src/widgets/UserHeader';

const HomeAppBar = ({ navigation, username = "SSYOK" }) => {
  // Get current date
  const today = new Date();
  const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options).replace(',', '');

  const handleNotificationPress = () => {
    navigation.navigate('NotificationScreen');
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#242E49" />
      <LinearGradient
        colors={['#2A3A5F', '#242E49']}
        style={styles.appBar}
      >
        {/* Date Display */}
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={20} color="#8D9BB5" />
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>

        {/* User Header */}
        <UserHeader username={username} />

        {/* Cat Image in the Middle */}
        <View style={styles.catImageContainer}>
          <Image 
            source={require('../assets/cat.png')} 
            style={styles.catImage}
            resizeMode="contain"
          />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarWrapper}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: '88%' }]} />
            </View>
            <View style={styles.percentageIndicator}>
              <View style={styles.percentageArrow} />
              <View style={styles.percentageBubble}>
                <Text style={styles.percentageText}>88%</Text>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" style={styles.checkIcon} />
              </View>
            </View>
          </View>
        </View>

        {/* Health Score Card */}
        <View style={styles.healthScoreCardContainer}>
          <TouchableOpacity 
            style={styles.healthScoreCard}
            onPress={() => navigation.navigate('HealthScore')}
          >
            <View style={styles.scoreBox}>
              <Text style={styles.scoreNumber}>88</Text>
            </View>
            <View style={styles.scoreInfo}>
              <Text style={styles.scoreTitle}>Medimate Score</Text>
              <Text style={styles.scoreDescription}>
                Based on the data, we think your health status is above average.
              </Text>
              <Ionicons name="chevron-forward" size={24} color="#8D9BB5" style={styles.scoreArrow} />
            </View>
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
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={handleNotificationPress}
        >
          <Ionicons name="notifications" size={24} color="white" />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  appBar: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    position: 'relative',
    alignSelf: 'center',
    overflow: 'hidden',
    width: '100%',
    height: 520,
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
  catImageContainer: {
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  catImage: {
    width: 100,
    height: 100,
    // Apply a light glow effect to make the cat stand out against the dark background
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  progressBarContainer: {
    marginBottom: 15,
  },
  progressBarWrapper: {
    position: 'relative',
    height: 20,
    marginBottom: 30,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8A3FFC',
    borderRadius: 5,
  },
  percentageIndicator: {
    position: 'absolute',
    top: 0,
    right: '6%',
    transform: [{translateX: 12}],
    alignItems: 'center',
  },
  percentageArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFFFFF',
    marginBottom: -1,
  },
  percentageBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentageText: {
    color: '#333333',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 5,
  },
  checkIcon: {
    marginLeft: 2,
  },
  healthScoreCardContainer: {
    marginBottom: 25,
  },
  healthScoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreBox: {
    width: 70,
    height: 70,
    backgroundColor: '#8A3FFC',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreNumber: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  scoreInfo: {
    flex: 1,
    marginLeft: 16,
    position: 'relative',
    paddingRight: 20,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  scoreDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  scoreArrow: {
    position: 'absolute',
    right: 0,
    top: '50%',
    marginTop: -12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
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
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
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

export default HomeAppBar;