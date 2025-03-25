import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Easing,
  Dimensions,
  ActivityIndicator,
  FlatList,
  Linking,
  SafeAreaView,
  Modal,
  TextInput,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FontAwesome5, MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { useMedications } from '../../providers/MedicationProvider';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

// Simulated data for NGOs and government bodies
const supportOrganizations = [
  {
    id: '1',
    name: 'Malaysian Pharmaceutical Society',
    type: 'NGO',
    distance: '2.3 km',
    address: '16-2, Jalan Seri Semantan 1, Damansara Heights, 50490 Kuala Lumpur',
    phone: '+60312345678',
    website: 'https://www.mps.org.my',
    services: ['Medication Assistance', 'Health Counseling', 'Prescription Review'],
    rating: 4.8,
    image: require('../../../assets/images/pharmacy1.jpg')
  },
  {
    id: '2',
    name: 'Ministry of Health Clinic',
    type: 'Government',
    distance: '3.5 km',
    address: 'Jalan P9, Presint 9, 62250 Putrajaya',
    phone: '+60389112233',
    website: 'https://www.moh.gov.my',
    services: ['Subsidized Medication', 'Health Screening', 'Chronic Disease Management'],
    rating: 4.5,
    image: require('../../../assets/images/clinic1.jpg')
  },
  {
    id: '3',
    name: 'Diabetes Malaysia',
    type: 'NGO',
    distance: '5.1 km',
    address: 'No. 2, Lorong 11/4E, 46200 Petaling Jaya, Selangor',
    phone: '+60378765432',
    website: 'https://www.diabetes.org.my',
    services: ['Diabetes Medication Support', 'Education Programs', 'Support Groups'],
    rating: 4.7,
    image: require('../../../assets/images/ngo1.jpg')
  },
  {
    id: '4',
    name: 'National Cancer Society Malaysia',
    type: 'NGO',
    distance: '6.8 km',
    address: '66, Jalan Raja Muda Abdul Aziz, 50300 Kuala Lumpur',
    phone: '+60326987300',
    website: 'https://www.cancer.org.my',
    services: ['Cancer Medication Assistance', 'Patient Navigation', 'Support Services'],
    rating: 4.9,
    image: require('../../../assets/images/ngo2.jpg')
  },
  {
    id: '5',
    name: 'Social Security Organization (SOCSO)',
    type: 'Government',
    distance: '4.2 km',
    address: 'Menara PERKESO, 281, Jalan Ampang, 50538 Kuala Lumpur',
    phone: '+60342645555',
    website: 'https://www.perkeso.gov.my',
    services: ['Medical Benefits', 'Disability Support', 'Return to Work Program'],
    rating: 4.3,
    image: require('../../../assets/images/govt1.jpg')
  }
];

// Simulated data for pharmacy price comparisons
const pharmacyPrices = [
  {
    id: '1',
    name: 'Guardian Pharmacy',
    distance: '1.2 km',
    address: 'Lot G-25, Ground Floor, Mid Valley Megamall, 59200 Kuala Lumpur',
    phone: '+60322829385',
    rating: 4.6,
    // image: require('../../../assets/images/pharmacy2.jpg'),
    prices: [
      { medication: 'Vitamin C 100mg', price: 25.50, discount: '0%', stock: 'In Stock' },
      { medication: 'Painexal 500mg', price: 87.18, discount: '0%', stock: 'In Stock' },
      { medication: 'Metformin 500mg', price: 45.60, discount: '0%', stock: 'In Stock' },
      { medication: 'Atorvastatin 20mg', price: 120.30, discount: '0%', stock: 'In Stock' }
    ]
  },
  {
    id: '2',
    name: 'Watsons',
    distance: '2.5 km',
    address: 'Lot 1F-18, 1st Floor, Suria KLCC, 50088 Kuala Lumpur',
    phone: '+60323822828',
    rating: 4.5,
    // image: require('../../../assets/images/pharmacy3.jpg'),
    prices: [
      { medication: 'Vitamin C 100mg', price: 22.90, discount: '10%', stock: 'In Stock' },
      { medication: 'Painexal 500mg', price: 82.50, discount: '5%', stock: 'Limited Stock' },
      { medication: 'Metformin 500mg', price: 42.30, discount: '7%', stock: 'In Stock' },
      { medication: 'Atorvastatin 20mg', price: 115.80, discount: '4%', stock: 'In Stock' }
    ]
  },
  {
    id: '3',
    name: 'Caring Pharmacy',
    distance: '3.8 km',
    address: 'G-13, Ground Floor, Pavilion KL, 168, Jalan Bukit Bintang, 55100 Kuala Lumpur',
    phone: '+60321418822',
    rating: 4.7,
    // image: require('../../../assets/images/pharmacy4.jpg'),
    prices: [
      { medication: 'Vitamin C 100mg', price: 20.80, discount: '15%', stock: 'In Stock' },
      { medication: 'Painexal 500mg', price: 79.90, discount: '8%', stock: 'In Stock' },
      { medication: 'Metformin 500mg', price: 40.50, discount: '12%', stock: 'In Stock' },
      { medication: 'Atorvastatin 20mg', price: 110.40, discount: '8%', stock: 'Limited Stock' }
    ]
  },
  {
    id: '4',
    name: 'AA Pharmacy',
    distance: '4.5 km',
    address: 'Lot 1.67, Level 1, Sunway Pyramid Shopping Mall, 47500 Petaling Jaya, Selangor',
    phone: '+60356371388',
    rating: 4.4,
    // image: require('../../../assets/images/pharmacy5.jpg'),
    prices: [
      { medication: 'Vitamin C 100mg', price: 23.40, discount: '5%', stock: 'In Stock' },
      { medication: 'Painexal 500mg', price: 85.30, discount: '2%', stock: 'In Stock' },
      { medication: 'Metformin 500mg', price: 43.80, discount: '4%', stock: 'Limited Stock' },
      { medication: 'Atorvastatin 20mg', price: 118.50, discount: '2%', stock: 'In Stock' }
    ]
  },
  {
    id: '5',
    name: 'Health Lane Family Pharmacy',
    distance: '5.2 km',
    address: 'G-12, Ground Floor, The Gardens Mall, 59200 Kuala Lumpur',
    phone: '+60322876366',
    rating: 4.8,
    // image: require('../../../assets/images/pharmacy6.jpg'),
    prices: [
      { medication: 'Vitamin C 100mg', price: 21.20, discount: '12%', stock: 'In Stock' },
      { medication: 'Painexal 500mg', price: 78.40, discount: '10%', stock: 'In Stock' },
      { medication: 'Metformin 500mg', price: 39.90, discount: '15%', stock: 'In Stock' },
      { medication: 'Atorvastatin 20mg', price: 108.70, discount: '10%', stock: 'In Stock' }
    ]
  }
];

const GetAssistanceScreen = ({ navigation }) => {
  const { medications } = useMedications();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('support');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    distance: 10, // km
    rating: 4,    // minimum rating
    services: []  // selected services
  });
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const detailPanelAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Start pulse animation for "best deal" indicators
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Start animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        })
      ]).start();
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleTabChange = (tab) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
    setSelectedItem(null);
    setShowDetailPanel(false);
  };
  
  const handleItemSelect = (item) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedItem(item);
    
    // Animate detail panel
    setShowDetailPanel(true);
    Animated.timing(detailPanelAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  };
  
  const handleCloseDetailPanel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Animate detail panel closing
    Animated.timing(detailPanelAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
      easing: Easing.in(Easing.cubic),
    }).start(() => {
      setShowDetailPanel(false);
      setSelectedItem(null);
    });
  };
  
  const handleCall = (phone) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(`tel:${phone}`);
  };
  
  const handleVisitWebsite = (website) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(website);
  };
  
  const handleGetDirections = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // In a real app, this would open maps with directions
    alert('Opening maps with directions...');
  };
  
  const renderOrganizationItem = ({ item }) => {
    const isSelected = selectedItem && selectedItem.id === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.organizationCard,
          isSelected && styles.selectedCard
        ]}
        onPress={() => handleItemSelect(item)}
        activeOpacity={0.9}
      >
        <Image 
          source={item.image}
          style={styles.organizationImage}
          resizeMode="cover"
        />
        <View style={styles.organizationContent}>
          <View style={styles.organizationHeader}>
            <Text style={styles.organizationName} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={[
              styles.organizationType,
              item.type === 'NGO' ? styles.ngoType : styles.govType
            ]}>
              <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' }}>
                {item.type}
              </Text>
            </View>
          </View>
          
          <View style={styles.organizationInfo}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.organizationInfoText} numberOfLines={1}>
              {item.distance} • {item.address}
            </Text>
          </View>
          
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= Math.floor(item.rating) ? "star" : star <= item.rating ? "star-half" : "star-outline"}
                size={14}
                color="#FFB400"
                style={{ marginRight: 2 }}
              />
            ))}
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          
          <View style={styles.organizationActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleCall(item.phone)}
            >
              <Ionicons name="call-outline" size={14} color="#8A3FFC" />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>
            
            <View style={styles.actionDivider} />
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleVisitWebsite(item.website)}
            >
              <Ionicons name="globe-outline" size={14} color="#8A3FFC" />
              <Text style={styles.actionButtonText}>Website</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderPharmacyItem = ({ item }) => {
    const isSelected = selectedItem && selectedItem.id === item.id;
    
    // Find the best price for each medication
    const bestPrices = {};
    pharmacyPrices.forEach(pharmacy => {
      pharmacy.prices.forEach(price => {
        if (!bestPrices[price.medication] || price.price < bestPrices[price.medication]) {
          bestPrices[price.medication] = price.price;
        }
      });
    });
    
    return (
      <TouchableOpacity
        style={[
          styles.pharmacyCard,
          isSelected && styles.selectedCard
        ]}
        onPress={() => handleItemSelect(item)}
        activeOpacity={0.9}
      >
        <Image 
          source={item.image}
          style={styles.pharmacyImage}
          resizeMode="cover"
        />
        <View style={styles.pharmacyContent}>
          <Text style={styles.pharmacyName} numberOfLines={1}>
            {item.name}
          </Text>
          
          <View style={styles.pharmacyInfo}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.pharmacyInfoText} numberOfLines={1}>
              {item.distance} • {item.address}
            </Text>
          </View>
          
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= Math.floor(item.rating) ? "star" : star <= item.rating ? "star-half" : "star-outline"}
                size={14}
                color="#FFB400"
                style={{ marginRight: 2 }}
              />
            ))}
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          
          <View style={styles.medicationPriceContainer}>
            {item.prices.slice(0, 2).map((price, index) => (
              <View key={index} style={styles.medicationPriceRow}>
                <Text style={styles.medicationName} numberOfLines={1}>
                  {price.medication}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[
                    styles.medicationPrice,
                    price.price === bestPrices[price.medication] && styles.bestPriceCell
                  ]}>
                    RM {price.price.toFixed(2)}
                  </Text>
                  
                  {price.discount !== '0%' && (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>{price.discount}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
            
            <Text style={{ fontSize: 12, color: '#8A3FFC', marginTop: 8, textAlign: 'center' }}>
              View all prices →
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderDetailPanel = () => {
    if (!showDetailPanel || !selectedItem) return null;
    
    const detailTranslateY = detailPanelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [300, 0],
    });
    
    const detailOpacity = detailPanelAnim;
    
    if (activeTab === 'support') {
      // Render organization details
      return (
        <Animated.View
          style={[
            styles.detailPanel,
            {
              opacity: detailOpacity,
              transform: [{ translateY: detailTranslateY }]
            }
          ]}
        >
          <View style={styles.detailHeader}>
            <Text style={styles.detailTitle}>{selectedItem.name}</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={handleCloseDetailPanel}
            >
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>ADDRESS</Text>
              <Text style={styles.detailText}>{selectedItem.address}</Text>
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>SERVICES</Text>
              <View style={styles.servicesList}>
                {selectedItem.services.map((service, index) => (
                  <View key={index} style={styles.serviceTag}>
                    <Text style={styles.serviceTagText}>{service}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>ABOUT</Text>
              <Text style={styles.detailText}>
                {selectedItem.type === 'NGO' 
                  ? `${selectedItem.name} is a non-governmental organization dedicated to providing healthcare support and medication assistance to those in need. They offer various services to help patients manage their health conditions effectively.`
                  : `${selectedItem.name} is a government healthcare facility that provides subsidized medical services and medication assistance programs for eligible citizens. They offer comprehensive healthcare services and support for various health conditions.`
                }
              </Text>
            </View>
            
            <View style={styles.contactButtons}>
              <TouchableOpacity 
                style={[styles.contactButton, styles.secondaryButton]}
                onPress={() => handleCall(selectedItem.phone)}
              >
                <Ionicons name="call-outline" size={18} color="#8A3FFC" />
                <Text style={[styles.contactButtonText, styles.secondaryButtonText]}>Call</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.contactButton, styles.primaryButton]}
                onPress={() => handleVisitWebsite(selectedItem.website)}
              >
                <Ionicons name="globe-outline" size={18} color="#FFFFFF" />
                <Text style={[styles.contactButtonText, styles.primaryButtonText]}>Website</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.getDirectionsButton}
              onPress={handleGetDirections}
            >
              <Ionicons name="navigate-outline" size={18} color="#FFFFFF" />
              <Text style={styles.getDirectionsText}>Get Directions</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      );
    } else {
      // Render pharmacy details with price comparison
      // Calculate potential savings
      const regularPrices = {
        'Vitamin C 100mg': 25.50,
        'Painexal 500mg': 87.18,
        'Metformin 500mg': 45.60,
        'Atorvastatin 20mg': 120.30
      };
      
      let totalSavings = 0;
      selectedItem.prices.forEach(price => {
        const regularPrice = regularPrices[price.medication] || 0;
        totalSavings += regularPrice - price.price;
      });
      
      return (
        <Animated.View
          style={[
            styles.detailPanel,
            {
              opacity: detailOpacity,
              transform: [{ translateY: detailTranslateY }]
            }
          ]}
        >
          <View style={styles.detailHeader}>
            <Text style={styles.detailTitle}>{selectedItem.name}</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={handleCloseDetailPanel}
            >
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>ADDRESS</Text>
              <Text style={styles.detailText}>{selectedItem.address}</Text>
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>PRICE COMPARISON</Text>
              
              <View style={styles.priceComparisonTable}>
                <View style={styles.priceTableHeader}>
                  <Text style={[styles.priceTableHeaderText, styles.medicationCol]}>Medication</Text>
                  <Text style={[styles.priceTableHeaderText, styles.priceCol]}>Price</Text>
                  <Text style={[styles.priceTableHeaderText, styles.discountCol]}>Discount</Text>
                  <Text style={[styles.priceTableHeaderText, styles.stockCol]}>Stock</Text>
                </View>
                
                {selectedItem.prices.map((price, index) => {
                  // Find the best price for this medication across all pharmacies
                  const bestPrice = Math.min(...pharmacyPrices.map(p => 
                    p.prices.find(pr => pr.medication === price.medication)?.price || Infinity
                  ));
                  
                  const isBestPrice = price.price === bestPrice;
                  
                  return (
                    <View key={index} style={styles.priceTableRow}>
                      <Text style={[styles.priceTableCell, styles.medicationCol]}>
                        {price.medication}
                      </Text>
                      <Text style={[
                        styles.priceTableCell, 
                        styles.priceCol,
                        isBestPrice && styles.bestPriceCell
                      ]}>
                        RM {price.price.toFixed(2)}
                        {isBestPrice && ' ✓'}
                      </Text>
                      <Text style={[styles.priceTableCell, styles.discountCol]}>
                        {price.discount}
                      </Text>
                      <Text style={[
                        styles.priceTableCell, 
                        styles.stockCol,
                        price.stock === 'Limited Stock' && styles.limitedStockText
                      ]}>
                        {price.stock}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
            
            <View style={styles.savingsContainer}>
              <Text style={styles.savingsTitle}>POTENTIAL SAVINGS</Text>
              <Text style={styles.savingsAmount}>RM {totalSavings.toFixed(2)}</Text>
              <Text style={styles.savingsText}>
                Compared to average retail prices at other pharmacies
              </Text>
            </View>
            
            <View style={styles.contactButtons}>
              <TouchableOpacity 
                style={[styles.contactButton, styles.secondaryButton]}
                onPress={() => handleCall(selectedItem.phone)}
              >
                <Ionicons name="call-outline" size={18} color="#8A3FFC" />
                <Text style={[styles.contactButtonText, styles.secondaryButtonText]}>Call</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.contactButton, styles.primaryButton]}
                onPress={handleGetDirections}
              >
                <Ionicons name="navigate-outline" size={18} color="#FFFFFF" />
                <Text style={[styles.contactButtonText, styles.primaryButtonText]}>Directions</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      );
    }
  };
  
  // Add this new function to render a filter modal
  const renderFilterModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Options</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <Text style={styles.filterSectionTitle}>Maximum Distance</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={20}
                step={1}
                value={filters.distance}
                onValueChange={(value) => setFilters({...filters, distance: value})}
                minimumTrackTintColor="#8A3FFC"
                maximumTrackTintColor="#E5E7EB"
                thumbTintColor="#8A3FFC"
              />
              <Text style={styles.sliderValue}>{filters.distance} km</Text>
              
              <Text style={styles.filterSectionTitle}>Minimum Rating</Text>
              <View style={styles.ratingSelector}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <TouchableOpacity 
                    key={rating}
                    style={[
                      styles.ratingOption,
                      filters.rating >= rating && styles.selectedRating
                    ]}
                    onPress={() => setFilters({...filters, rating})}
                  >
                    <Text style={[
                      styles.ratingOptionText,
                      filters.rating >= rating && styles.selectedRatingText
                    ]}>
                      {rating}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.filterSectionTitle}>Services</Text>
              <View style={styles.servicesSelector}>
                {['Medication Assistance', 'Health Counseling', 'Prescription Review', 
                  'Subsidized Medication', 'Health Screening', 'Support Groups'].map((service) => (
                  <TouchableOpacity 
                    key={service}
                    style={[
                      styles.serviceOption,
                      filters.services.includes(service) && styles.selectedService
                    ]}
                    onPress={() => {
                      const updatedServices = filters.services.includes(service)
                        ? filters.services.filter(s => s !== service)
                        : [...filters.services, service];
                      setFilters({...filters, services: updatedServices});
                    }}
                  >
                    <Text style={[
                      styles.serviceOptionText,
                      filters.services.includes(service) && styles.selectedServiceText
                    ]}>
                      {service}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={() => setFilters({
                  distance: 10,
                  rating: 4,
                  services: []
                })}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={() => {
                  // Apply filters logic would go here
                  setFilterModalVisible(false);
                  // Simulate loading with new filters
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 800);
                }}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  
  // Add a search and filter bar to the render function
  const renderSearchAndFilterBar = () => {
    return (
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={activeTab === 'support' ? "Search organizations..." : "Search pharmacies..."}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="options-outline" size={22} color="#8A3FFC" />
        </TouchableOpacity>
      </View>
    );
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8A3FFC" />
        <Text style={styles.loadingText}>Finding assistance options near you...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Get Assistance</Text>
        <TouchableOpacity style={styles.helpButton} onPress={() => alert('Help information would be shown here')}>
          <Ionicons name="help-circle-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      {/* Add the search and filter bar */}
      {!isLoading && renderSearchAndFilterBar()}
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[
            styles.tabButton,
            activeTab === 'support' && styles.activeTabButton
          ]}
          onPress={() => handleTabChange('support')}
        >
          <FontAwesome5 
            name="hands-helping" 
            size={16} 
            color={activeTab === 'support' ? '#8A3FFC' : '#666'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'support' && styles.activeTabText
          ]}>
            Support Organizations
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton,
            activeTab === 'prices' && styles.activeTabButton
          ]}
          onPress={() => handleTabChange('prices')}
        >
          <MaterialCommunityIcons 
            name="pill" 
            size={18} 
            color={activeTab === 'prices' ? '#8A3FFC' : '#666'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'prices' && styles.activeTabText
          ]}>
            Price Comparison
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.mapContainer}>
          <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: '#E5E7EB' 
          }}>
            <Text style={{ fontSize: 16, color: '#666' }}>Map View</Text>
            <Text style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
              (Map would be displayed here in a real app)
            </Text>
          </View>
        </View>
        
        <View style={styles.listContainer}>
          <Animated.View 
            style={[
              styles.listContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {activeTab === 'support' ? (
              <FlatList
                data={supportOrganizations}
                renderItem={renderOrganizationItem}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContentContainer}
              />
            ) : (
              <FlatList
                data={pharmacyPrices}
                renderItem={renderPharmacyItem}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContentContainer}
              />
            )}
          </Animated.View>
        </View>
        
        {renderDetailPanel()}
      </View>
      
      {/* Add the filter modal */}
      {renderFilterModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFC',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  helpButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: 40,
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    marginLeft: 12,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
  },
  activeTabButton: {
    backgroundColor: '#F0E6FF',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#8A3FFC',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
  },
  mapContainer: {
    height: height * 0.25,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#F9FAFC',
  },
  listContent: {
    flex: 1,
  },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  organizationCard: {
    width: width * 0.75,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#8A3FFC',
  },
  organizationImage: {
    width: '100%',
    height: 120,
  },
  organizationContent: {
    padding: 12,
  },
  organizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  organizationName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  organizationType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ngoType: {
    backgroundColor: '#8A3FFC',
  },
  govType: {
    backgroundColor: '#0066CC',
  },
  organizationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  organizationInfoText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  organizationActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#8A3FFC',
  },
  actionDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  pharmacyCard: {
    width: width * 0.75,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  pharmacyImage: {
    width: '100%',
    height: 100,
  },
  pharmacyContent: {
    padding: 12,
  },
  pharmacyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  pharmacyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pharmacyInfoText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  medicationPriceContainer: {
    marginTop: 8,
    backgroundColor: '#F9FAFC',
    borderRadius: 8,
    padding: 8,
  },
  medicationPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  medicationName: {
    flex: 1,
    fontSize: 12,
    color: '#333',
    marginRight: 8,
  },
  medicationPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  bestPriceCell: {
    color: '#00875A',
    fontWeight: 'bold',
  },
  discountBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#FFEDD5',
    borderRadius: 4,
  },
  discountText: {
    fontSize: 10,
    color: '#C2410C',
    fontWeight: 'bold',
  },
  detailPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  detailContent: {
    flex: 1,
    padding: 20,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceTag: {
    backgroundColor: '#F0E6FF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  serviceTagText: {
    fontSize: 12,
    color: '#8A3FFC',
  },
  contactButtons: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  primaryButton: {
    backgroundColor: '#8A3FFC',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#8A3FFC',
  },
  contactButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#8A3FFC',
  },
  getDirectionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00875A',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  getDirectionsText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  priceComparisonTable: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  priceTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFC',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  priceTableHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  priceTableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  priceTableCell: {
    fontSize: 12,
    color: '#333',
  },
  medicationCol: {
    flex: 2,
  },
  priceCol: {
    flex: 1,
    textAlign: 'right',
  },
  discountCol: {
    flex: 1,
    textAlign: 'center',
  },
  stockCol: {
    flex: 1,
    textAlign: 'center',
  },
  limitedStockText: {
    color: '#F59E0B',
  },
  savingsContainer: {
    backgroundColor: '#F0FFF4',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  savingsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00875A',
    marginBottom: 8,
  },
  savingsAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00875A',
    marginBottom: 4,
  },
  savingsText: {
    fontSize: 12,
    color: '#00875A',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginTop: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    textAlign: 'center',
    fontSize: 16,
    color: '#8A3FFC',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  ratingSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  ratingOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  selectedRating: {
    backgroundColor: '#8A3FFC',
    borderColor: '#8A3FFC',
  },
  ratingOptionText: {
    fontSize: 16,
    color: '#666',
  },
  selectedRatingText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  servicesSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  serviceOption: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  selectedService: {
    backgroundColor: '#F0E6FF',
    borderColor: '#8A3FFC',
  },
  serviceOptionText: {
    fontSize: 14,
    color: '#666',
  },
  selectedServiceText: {
    color: '#8A3FFC',
    fontWeight: '500',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#666',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 12,
    backgroundColor: '#8A3FFC',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  // Add these new styles for the enhanced features
  bestDealBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#00875A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bestDealText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  medicationMatchBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(138, 63, 252, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  medicationMatchText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
    opacity: 0.7,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  tryAgainButton: {
    backgroundColor: '#8A3FFC',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  tryAgainButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default GetAssistanceScreen;