import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated, 
  PanResponder,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import YoutubePlayer from 'react-native-youtube-iframe';
import Icon from'react-native-vector-icons/MaterialIcons';

import NutritionGuidanceAppBar from '../../../components/NutritionGuidanceAppBar';

const NutritionGuidanceScreen = () => {
  const navigation = useNavigation();
  const [playing, setPlaying] = useState(false);


    // Get screen width for swipe calculations
  const screenWidth = Dimensions.get('window').width;
  
  // Create animated value for swipe button
  const swipeAnim = useRef(new Animated.Value(0)).current;
  
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
            // Navigate to the next screen
            navigation.navigate('HealthScore'); // Change to your desired screen
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
  
  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  return (
    <>
        <ScrollView style={styles.container}>
            <View style={{ flex: 1, backgroundColor: '#F3F5F9' }}>
                <NutritionGuidanceAppBar navigation={navigation} />
            </View>
         {/* Suggested Nutrition Section */}
         <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Suggested Nutrition</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                </View>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScrollView}>
                    {/* Vitamin D Card */}
                    <View style={styles.nutritionCard}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="bandage" size={24} color="#4A5568" />
                        </View>
                        <Text style={styles.nutritionName}>Vitamin D</Text>
                        <Text style={styles.nutritionDosage}>180mg</Text>
                    </View>
                    
                    {/* Thiamine Card */}
                    <View style={styles.nutritionCard}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="pill" size={24} color="#4A5568" />
                        </View>
                        <Text style={styles.nutritionName}>Thiamine</Text>
                        <Text style={styles.nutritionDosage}>20mg</Text>
                    </View>
                    
                    {/* Riboflavin Card */}
                    <View style={styles.nutritionCard}>
                        <View style={styles.iconContainer}>
                            <Icon name="medication" size={24} color="#4A5568" />
                        </View>
                        <Text style={styles.nutritionName}>Riboflavin</Text>
                        <Text style={styles.nutritionDosage}>70mg</Text>
                    </View>
                </ScrollView>
            </View>
             {/* How to Take Nutrition Section */}
             <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>How to Take Nutrition</Text>
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-horizontal" size={24} color="#718096" />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.stepsCard}>
                    {/* Step 1 */}
                    <View style={styles.stepRow}>
                        <View style={styles.stepIconContainer}>
                            <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                        </View>
                        <View style={styles.stepLine} />
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Step 1</Text>
                            <Text style={styles.stepDescription}>
                                Include a mix of fruits, veggies, whole grains, lean proteins
                            </Text>
                        </View>
                    </View>
                    
                    {/* Step 2 */}
                    <View style={styles.stepRow}>
                        <View style={styles.stepIconContainer}>
                            <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                        </View>
                        <View style={styles.stepLine} />
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Step 2</Text>
                            <Text style={styles.stepDescription}>
                                Keep portion sizes in check to avoid overeating and maintain
                            </Text>
                        </View>
                    </View>
                    
                    {/* Step 3 */}
                    <View style={styles.stepRow}>
                        <View style={[styles.stepIconContainer, styles.stepIconRed]}>
                            <Ionicons name="square" size={14} color="#FFFFFF" />
                        </View>
                        <View style={styles.stepLine} />
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Step 3</Text>
                            <Text style={styles.stepDescription}>
                                Drink enough water throughout the day to support digestion
                            </Text>
                        </View>
                    </View>
                    
                    {/* Step 4 */}
                    <View style={styles.stepRow}>
                        <View style={[styles.stepIconContainer, styles.stepIconEmpty]}>
                            <View style={styles.emptySquare} />
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Step 4</Text>
                            <Text style={styles.stepDescription}>
                                Stick to a routine with balanced meals to ensure a steady supply
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Nutrition Resources</Text>
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-horizontal" size={24} color="#718096" />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.videoCard}>
                    <View style={styles.videoContainer}>
                         <YoutubePlayer
                            height={220}
                            play={playing}
                            videoId="5znuV7Iyrzs"
                            onChangeState={onStateChange}
                        />
                    </View>
                    
                    <View style={styles.videoContent}>
                        <Text style={styles.videoTitle}>Nutrition Guidance 101</Text>
                        <Text style={styles.videoDescription}>
                            Embark on a transformative journey with Nutrition Guidance 101, your essential companion for understanding...
                        </Text>
                        
                        <View style={styles.videoStats}>
                            <View style={styles.statItem}>
                                <Ionicons name="eye-outline" size={18} color="#718096" />
                                <Text style={styles.statText}>11,874</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Ionicons name="heart" size={18} color="#F87171" />
                                <Text style={styles.statText}>22</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Ionicons name="chatbubble-outline" size={18} color="#1167FE" />
                                <Text style={styles.statText}>197</Text>
                            </View>
                            <TouchableOpacity style={styles.saveButton}>
                                <Ionicons name="bookmark-outline" size={18} color="#2D3748" />
                                <Text style={styles.saveText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
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
                        <Ionicons name="chevron-forward-outline" size={24} color="#2D3748" />
                        <Ionicons name="chevron-forward-outline" size={24} color="#2D3748" style={styles.secondChevron} />
                    </Animated.View>
                    <Text style={styles.swipeText}>Swipe to resolve</Text>
                </View>
            </View>
        </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F5F9',
    },
    sectionContainer: {
        marginTop: 10,
        paddingHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
        marginTop: 14, // Adjust this value to move the section up or down in the app b
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3748',
    },
    seeAllText: {
        fontSize: 14,
        color: '#1167FE',
        fontWeight: '500',
    },
    cardsScrollView: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    nutritionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginRight: 12,
        width: 150,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#F7FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    nutritionName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3748',
        marginBottom: 4,
    },
    nutritionDosage: {
        fontSize: 16,
        color: '#718096',
    },
    stepsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    stepRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    stepIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: '#1167FE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    stepIconRed: {
        backgroundColor: '#FA4E5E',
    },
    stepIconEmpty: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    emptySquare: {
        width: 10,
        height: 10,
        backgroundColor: '#E2E8F0',
    },
    stepLine: {
        position: 'absolute',
        left: 14,
        top: 35,
        width: 3,
        height: 45,
        backgroundColor: '#E2E8F0',
        zIndex: -1,
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3748',
        marginBottom: 4,
    },
    stepDescription: {
        fontSize: 16,
        color: '#718096',
        lineHeight: 22,
    },
    videoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    videoContainer: {
        width: '100%',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: 'hidden',
    },
    videoThumbnail: {
        height: 200,
        backgroundColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
        // Add a background image here if you have one
        backgroundImage: 'url(https://example.com/vegetables.jpg)',
        backgroundSize: 'cover',
    },
    playButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#1167FE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoProgressContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    videoControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBar: {
        flex: 1,
        height: 4,
        backgroundColor: '#E2E8F0',
        borderRadius: 2,
        marginHorizontal: 10,
    },
    progressFill: {
        width: '75%',
        height: 4,
        backgroundColor: '#F87171',
        borderRadius: 2,
    },
    videoDuration: {
        fontSize: 14,
        color: '#2D3748',
        fontWeight: '500',
    },
    videoContent: {
        padding: 16,
    },
    videoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2D3748',
        marginBottom: 8,
    },
    videoDescription: {
        fontSize: 16,
        color: '#718096',
        lineHeight: 22,
        marginBottom: 16,
    },
    videoStats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    statText: {
        fontSize: 14,
        color: '#718096',
        marginLeft: 4,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto',
        backgroundColor: '#F7FAFC',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    saveText: {
        fontSize: 14,
        color: '#2D3748',
        fontWeight: '500',
        marginLeft: 4,
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
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
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
})

export default NutritionGuidanceScreen;