import React, { useRef, useCallback } from 'react';
import {   
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView, 
    StyleSheet, 
    Image, 
    Animated, 
    PanResponder,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';


const BloodPressureScreen = ({ navigation }) => {
  // Get screen width for swipe calculations
  const screenWidth = Dimensions.get('window').width;
  
  // Create animated value for swipe button
  const swipeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      // Reset the button position when screen is focused
      Animated.timing(swipeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      return () => {};
    }, [])
  );
  
  // Create pan responder for swipe gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Only allow movement to the right and limit to button width
        if (gestureState.dx > 0) {
          const maxMove = screenWidth - 150; // Limit how far it can slide
          const move = Math.min(gestureState.dx, maxMove);
          swipeAnim.setValue(move);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        // If swiped more than 40% of the screen width, navigate
        if (gestureState.dx > screenWidth * 0.4) {
          // Animate to the end
          Animated.timing(swipeAnim, {
            toValue: screenWidth - 150,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            // Reset position before navigating
            swipeAnim.setValue(0);
            // Navigate to the next screen
            navigation.navigate('BloodPressureStats'); // Change to your desired screen
          });
        } else {
          // Reset to start position
          Animated.spring(swipeAnim, {
            toValue: 0,
            friction: 5,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <>
      <View style={styles.appBar}>
        {/* Background Decorations */}
        <View style={styles.content}>
          {/* Back Button */}
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={20} color="black" />
            </TouchableOpacity>
                <View style={styles.headerTopTitle}>
                    <Text style={styles.headerTitle}>Blood Pressure</Text>
                    <Icon name="more-horiz" size={24} color="#9E9E9E" />
                </View>
          </View>

        <View style={styles.imageContainer}>
            <Image source={require('../../../assets/BloodPressureDashboard.png')} style={styles.image} />
        </View>
        
        </View>
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Main Overview</Text>
            <Icon name="more-horiz" size={24} color="#9E9E9E" />
        </View>

        {/* Health Metrics Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsContainer}>
          {/* Oxygen Card */}
          <View style={styles.metricCard}>
            <View style={[styles.iconContainer, {backgroundColor: '#FFEFEF'}]}>
              <FontAwesome5 name="heart" size={24} color="#FF5757" />
            </View>
            <Text style={styles.metricLabel}>Oxygen</Text>
            <View style={styles.metricValueContainer}>
              <Text style={styles.metricValue}>70</Text>
              <Text style={styles.metricUnit}>spO2</Text>
            </View>
          </View>
          
          {/* Cholesterol Card */}
          <View style={styles.metricCard}>
            <View style={[styles.iconContainer, {backgroundColor: '#F2EFFF'}]}>
              <MaterialCommunityIcons name="water" size={24} color="#8B6BFF" />
            </View>
            <Text style={styles.metricLabel}>Cholesterol</Text>
            <View style={styles.metricValueContainer}>
              <Text style={styles.metricValue}>50</Text>
              <Text style={styles.metricUnit}>mg</Text>
            </View>
          </View>
        </ScrollView>
        {/* Swipe to Resolve Button */}
        <View style={styles.sectionContainer}>
                <View style={styles.swipeButton}>
                    <Animated.View 
                        style={[
                            styles.swipeIconContainer, 
                            { transform: [{ translateX: swipeAnim }] }
                        ]}
                        {...panResponder.panHandlers}
                    >
                        <Ionicons name="chevron-forward-outline" size={24} color="#ffffff" />
                        <Ionicons name="chevron-forward-outline" size={24} color="#ffffff" style={styles.secondChevron} />
                    </Animated.View>
                    <Text style={styles.swipeText}>Swipe to start reading ...</Text>
                </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  appBar: {
    flex: 1,
    backgroundColor: '#F3F5F9',
  },
  content: {
    paddingTop: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(14, 2, 2, 0.3)',
    width: 40,
    alignItems: 'center',
    marginTop: 12,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  headerTopTitle:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width:'83%',
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: -30,
  },
  image: {
    width: 310,
    height: 310,
    resizeMode: 'contain',
  },
  cardsContainer: {
    paddingHorizontal: 16,
    marginTop: -14,
  },
  metricCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: 160,
    height: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  metricValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1E2A47',
    marginRight: 4,
  },
  metricUnit: {
    fontSize: 16,
    color: '#9E9E9E',
    marginBottom: 8,
  },
  swipeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    height: 80, // Fixed height for better control
    position: 'relative', // For absolute positioning of text
    overflow: 'hidden', // Keep the sliding icon within bounds
  },
swipeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#3E4B66',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    flexDirection: 'row',
    zIndex: 2, // Ensure it stays above the text
  },
secondChevron: {
    marginLeft: -15,
  },
swipeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    position: 'absolute',
    left: 82, // Position text to appear after the icon
    zIndex: 1,
  },
  sectionContainer: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
});

export default BloodPressureScreen;
