import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const MedicalCard = ({ totalCost, onFlip, isFlipped }) => {
  const flipAnimation = useRef(new Animated.Value(isFlipped ? 1 : 0)).current;
  const floatingAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(0)).current;
  const shimmerAnimation = useRef(new Animated.Value(0)).current;
  
  // Update flip animation when isFlipped prop changes
  useEffect(() => {
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }).start();
  }, [isFlipped]);
  
  // Floating animation for cards
  useEffect(() => {
    const floatSequence = Animated.sequence([
      Animated.timing(floatingAnimation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.sin),
      }),
      Animated.timing(floatingAnimation, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.sin),
      }),
    ]);
    
    Animated.loop(floatSequence).start();
  }, []);
  
  // Pulse animation for the card
  useEffect(() => {
    const pulseSequence = Animated.sequence([
      Animated.timing(pulseAnimation, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.sin),
      }),
      Animated.timing(pulseAnimation, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.sin),
      }),
    ]);
    
    Animated.loop(pulseSequence).start();
  }, []);
  
  // Shimmer animation for card elements
  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnimation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, []);
  
  const handleFlip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onFlip();
  };

  // Interpolate for the flip animation
  const frontAnimatedStyle = {
    transform: [
      { rotateY: flipAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg']
      })},
      { 
        translateY: floatingAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -8]
        })
      }
    ],
    opacity: flipAnimation.interpolate({
      inputRange: [0.5, 0.5],
      outputRange: [1, 0]
    }),
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
  };

  const backAnimatedStyle = {
    transform: [
      { rotateY: flipAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg']
      })},
      { 
        translateY: floatingAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -8]
        })
      }
    ],
    opacity: flipAnimation.interpolate({
      inputRange: [0.5, 0.5],
      outputRange: [0, 1]
    }),
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
  };

  // Shadow animation
  const shadowOpacity = pulseAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.5],
  });
  
  // Shimmer effect for card elements
  const shimmerTranslate = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <Animated.View 
      style={[
        styles.cardContainer,
        {
          shadowOpacity: shadowOpacity,
        }
      ]}
    >
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={handleFlip}
        style={styles.cardWrapper}
      >
        <View style={styles.cardInner}>
          {/* Front of the card (Financial) */}
          <Animated.View style={[styles.cardFace, frontAnimatedStyle]}>
            <LinearGradient
              colors={['#8A3FFC', '#6F3FF7', '#5A3FF0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            >
              {/* Shimmer effect */}
              <Animated.View
                style={[
                  styles.shimmerContainer,
                  {
                    transform: [{ translateX: shimmerTranslate }],
                  },
                ]}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(255, 255, 255, 0.1)', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.shimmer}
                />
              </Animated.View>
              
              <View style={styles.cardPattern}>
                <MaterialCommunityIcons name="pill" size={120} color="rgba(255, 255, 255, 0.05)" style={styles.patternIcon} />
              </View>
              
              <View style={styles.cardHeader}>
                <Text style={styles.cardLabel}>ESTIMATED MONTHLY EXPENSES</Text>
                <MaterialCommunityIcons name="wallet" size={24} color="rgba(255, 255, 255, 0.8)" />
              </View>
              
              <View style={styles.amountContainer}>
                <Text style={styles.cardAmount}>RM {totalCost.toFixed(2)}</Text>
                <View style={styles.amountBadge}>
                  <Text style={styles.amountBadgeText}>MEDICATIONS</Text>
                </View>
              </View>
              
              <View style={styles.cardFooter}>
                <Text style={styles.cardSubtext}>Tap to view medical card</Text>
                <View style={styles.flipIconContainer}>
                  <MaterialCommunityIcons name="rotate-3d-variant" size={16} color="rgba(255, 255, 255, 0.8)" />
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
          
          {/* Back of the card (Medical Card) */}
          <Animated.View style={[styles.cardFace, backAnimatedStyle]}>
            <LinearGradient
              colors={['#6F3FF7', '#8A3FFC', '#9A4FFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            >
              {/* Shimmer effect */}
              <Animated.View
                style={[
                  styles.shimmerContainer,
                  {
                    transform: [{ translateX: shimmerTranslate }],
                  },
                ]}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(255, 255, 255, 0.1)', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.shimmer}
                />
              </Animated.View>
              
              <View style={styles.cardPattern}>
                <MaterialCommunityIcons name="hospital-building" size={120} color="rgba(255, 255, 255, 0.05)" style={styles.patternIcon} />
              </View>
              
              <View style={styles.cardHeader}>
                <Text style={styles.cardLabel}>MEDICAL CARD</Text>
                <MaterialCommunityIcons name="medical-bag" size={24} color="rgba(255, 255, 255, 0.8)" />
              </View>
              
              <View style={styles.medicalCardInfo}>
                <View style={styles.chipContainer}>
                  <Image 
                    source={require('../../assets/chip.png')} 
                    style={styles.chipImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.medicalCardNumber}>1234 5678 9012 3456</Text>
                <View style={styles.cardholderInfo}>
                  <View>
                    <Text style={styles.cardholderLabel}>CARDHOLDER</Text>
                    <Text style={styles.medicalCardName}>SSYOK</Text>
                  </View>
                  <View>
                    <Text style={styles.cardholderLabel}>VALID THRU</Text>
                    <Text style={styles.medicalCardExpiry}>12/25</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.cardFooter}>
                <Text style={styles.cardSubtext}>Tap to view expenses</Text>
                <View style={styles.flipIconContainer}>
                  <MaterialCommunityIcons name="rotate-3d-variant" size={16} color="rgba(255, 255, 255, 0.8)" />
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 20,
    shadowColor: '#8A3FFC',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardWrapper: {
    height: 200,
    width: '100%',
    borderRadius: 20,
  },
  cardInner: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  cardFace: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
    height: '100%',
    justifyContent: 'space-between',
    borderRadius: 20,
  },
  shimmerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  shimmer: {
    width: '100%',
    height: '100%',
    transform: [{ skewX: '-20deg' }],
  },
  cardPattern: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    opacity: 0.1,
  },
  patternIcon: {
    transform: [{ rotate: '15deg' }]
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  amountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  amountBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  flipIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicalCardInfo: {
    marginVertical: 8,
  },
  chipContainer: {
    marginBottom: 12,
  },
  chipImage: {
    width: 40,
    height: 30,
  },
  medicalCardNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 12,
  },
  cardholderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardholderLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    marginBottom: 4,
  },
  medicalCardName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  medicalCardExpiry: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MedicalCard; 