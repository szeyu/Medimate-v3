import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  Animated,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Easing
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useMedications } from '../../providers/MedicationProvider';
import { LinearGradient } from 'expo-linear-gradient';
import CalendarStrip from 'react-native-calendar-strip';
import * as Haptics from 'expo-haptics';
import MedicalCard from '../../components/MedicalCard';

const { width } = Dimensions.get('window');

const MedicationScreen = ({ navigation, route }) => {
  const { medications, totalCost, isLoading } = useMedications();
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Create a ref to store animated values
  const animatedValuesRef = useRef({});
  
  // Update animated values when medications change
  useEffect(() => {
    // Create new animated values for any new medications
    medications.forEach((med) => {
      if (!animatedValuesRef.current[med.id]) {
        animatedValuesRef.current[med.id] = new Animated.Value(0);
      }
    });
    
    // Start animations for new medications
    const newAnimations = medications
      .filter(med => animatedValuesRef.current[med.id].__getValue() === 0)
      .map((med, index) => {
        return Animated.timing(animatedValuesRef.current[med.id], {
          toValue: 1,
          duration: 600,
          delay: index * 150,
          useNativeDriver: true,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
      });
    
    if (newAnimations.length > 0) {
      Animated.stagger(100, newAnimations).start();
    }
  }, [medications]);
  
  // Floating animation for cards
  const floatingAnimation = useRef(new Animated.Value(0)).current;
  
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
  
  // Header animation based on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });
  
  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -20],
    extrapolate: 'clamp',
  });

  const renderMedicationItem = ({ item, index }) => {
    // Get the animation value for this medication
    const animValue = animatedValuesRef.current[item.id] || new Animated.Value(1);
    
    // Animation values for this specific card
    const translateY = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
    });
    
    const opacity = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    
    const scale = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1],
    });
    
    // Determine the pill color based on the medication name
    // This creates visual variety in the cards
    const getPillColor = (name) => {
      const colors = ['#8A3FFC', '#FF5A5A', '#00C853', '#FF9500', '#00B0FF'];
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
    };
    
    const pillColor = getPillColor(item.name);
    
    return (
      <Animated.View 
        style={[
          styles.medicationItem,
          {
            opacity,
            transform: [
              { translateY },
              { scale }
            ]
          }
        ]}
      >
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{item.time}</Text>
          <Animated.View 
            style={[
              styles.timeConnector,
              {
                transform: [
                  { scaleY: floatingAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.05]
                  })}
                ]
              }
            ]} 
          />
        </View>
        
        <View style={[
          styles.medicationDetails,
          item.isChecked && styles.medicationDetailsTaken
        ]}>
          {item.isChecked && (
            <View style={styles.takenBadge}>
              <Text style={styles.takenBadgeText}>TAKEN</Text>
            </View>
          )}
          
          <View 
            style={[
              styles.pillIconContainer,
              { backgroundColor: `${pillColor}20` }
            ]}
          >
            <MaterialCommunityIcons 
              name="pill" 
              size={24} 
              color={pillColor} 
            />
          </View>
          
          <TouchableOpacity 
            style={styles.medicationNameContainer}
            onPress={() => {
              if (!item.isChecked) {
                navigation.navigate('PillTaken', { medication: item });
              }
            }}
            disabled={item.isChecked}
          >
            <Text style={[
              styles.medicationName,
              item.isChecked && styles.medicationNameChecked
            ]}>
              {item.name} {item.dosage}
            </Text>
            <Text style={styles.medicationInstructions}>
              {item.frequency} • {item.instructions}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => {
              if (!item.isChecked) {
                navigation.navigate('PillTaken', { medication: item });
              }
            }}
            disabled={item.isChecked}
          >
            <View style={[
              styles.checkbox,
              { borderColor: pillColor },
              item.isChecked && { backgroundColor: pillColor }
            ]}>
              {item.isChecked && (
                <Icon name="check" size={16} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#8A3FFC" />
        <Text style={styles.loadingText}>Loading medications...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Medications</Text>
      </View>
      
      <Animated.ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Medical Card */}
        <MedicalCard 
          totalCost={totalCost}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(!isFlipped)}
        />
        
        {/* Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <View style={styles.actionButton}>
            <TouchableOpacity 
              style={styles.actionButtonInner}
              onPress={() => navigation.navigate('ScanMedication')}
            >
              <Icon name="add" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.actionButtonLabel}>Add Medication</Text>
          </View>
          
          <View style={styles.actionButton}>
            <TouchableOpacity style={[styles.actionButtonInner, styles.assistanceButton]}>
              <Icon name="medical-services" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.actionButtonLabel}>Get Assistance</Text>
          </View>
        </View>
        
        {/* Calendar Strip */}
        <View style={styles.calendarContainer}>
          <Text style={styles.sectionTitle}>Daily Schedule</Text>
          <Text style={styles.dateText}>
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
          
          <View style={styles.calendarWrapper}>
            <CalendarStrip
              style={styles.calendarStrip}
              calendarHeaderStyle={styles.calendarHeader}
              dateNumberStyle={styles.calendarDateNumber}
              dateNameStyle={styles.calendarDateName}
              highlightDateNumberStyle={styles.calendarHighlightNumber}
              highlightDateNameStyle={styles.calendarHighlightName}
              selectedDate={selectedDate}
              onDateSelected={date => setSelectedDate(date.toDate())}
              highlightDateContainerStyle={styles.selectedDateContainer}
              scrollable
              useIsoWeekday={false}
              showMonth={true}
              maxDayComponentSize={80}
              minDayComponentSize={70}
              dayComponentHeight={80}
              iconContainer={{flex: 0.1}}
            />
          </View>
        </View>
        
        {/* Medications List */}
        <View style={styles.medicationsContainer}>
          <Text style={styles.sectionTitle}>Today's Medications</Text>
          
          {medications.length === 0 ? (
            <View style={styles.emptyMedicationsContainer}>
              <Animated.View
                style={{
                  transform: [
                    { 
                      translateY: floatingAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -15]
                      })
                    }
                  ]
                }}
              >
                <FontAwesome5 
                  name="pills" 
                  size={60} 
                  color="#8A3FFC" 
                  style={styles.emptyIcon}
                />
              </Animated.View>
              <Text style={styles.emptyMedicationsText}>
                No medications scheduled for today.
              </Text>
              <TouchableOpacity 
                style={styles.emptyMedicationsButton}
                onPress={() => navigation.navigate('ScanMedication')}
              >
                <Text style={styles.emptyMedicationsButtonText}>
                  Add Your First Medication
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={medications}
              renderItem={renderMedicationItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.medicationsList}
            />
          )}
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFC',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    width: (width - 60) / 2,
  },
  actionButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8A3FFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#8A3FFC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  assistanceButton: {
    backgroundColor: '#FF5A5A',
    shadowColor: '#FF5A5A',
  },
  actionButtonLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  calendarWrapper: {
    marginTop: 10,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F9FAFC',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  calendarStrip: {
    height: 120,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 12,
    backgroundColor: '#F9FAFC',
  },
  calendarHeader: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  calendarDateNumber: {
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
  },
  calendarDateName: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
  calendarHighlightNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  calendarHighlightName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  selectedDateContainer: {
    backgroundColor: '#8A3FFC',
    borderRadius: 12,
    shadowColor: '#8A3FFC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    paddingVertical: 8,
  },
  medicationsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  medicationsList: {
    paddingBottom: 20,
  },
  medicationItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timeContainer: {
    alignItems: 'center',
    width: 60,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  timeConnector: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
  },
  medicationDetails: {
    flex: 1,
    backgroundColor: '#F3F5F9',
    borderRadius: 16,
    padding: 16,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medicationDetailsTaken: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  pillIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  medicationNameContainer: {
    flex: 1,
    paddingRight: 8,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  medicationNameChecked: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  medicationInstructions: {
    fontSize: 14,
    color: '#666',
  },
  takenBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  takenBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    marginLeft: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: '#8A3FFC',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyMedicationsContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyMedicationsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyMedicationsButton: {
    backgroundColor: '#8A3FFC',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#8A3FFC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyMedicationsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MedicationScreen;