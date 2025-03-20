import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart } from 'react-native-chart-kit';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {buildUserHeader()}
        <View style={styles.spacer} />
        {buildHealthScoreCard()}
        <View style={styles.spacer} />
        {buildSmartHealthMetrics()}
        <View style={styles.spacer} />
        {buildFitnessTracker()}
        <View style={styles.spacer} />
        {buildNutritionCard()}
        <View style={styles.spacer} />
        {buildSleepCard()}
        <View style={styles.spacer} />
        {buildHydrationCard()}
        <View style={styles.spacer} />
        {buildWellnessAIChatbot()}
        <View style={styles.spacer} />
        {buildMedicationManagement(navigation)}
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
};

const buildUserHeader = () => {
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

const buildHealthScoreCard = () => {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Health Score</Text>
        <Icon name="more-horiz" size={24} color="#000000" />
      </View>
      <View style={styles.card}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreText}>88</Text>
        </View>
        <View style={styles.scoreInfo}>
          <Text style={styles.scoreTitle}>Asklepios Score</Text>
          <Text style={styles.scoreDescription}>
            Asklepios predicts, optimize your health with our AI-driven insights
          </Text>
        </View>
      </View>
    </View>
  );
};

const buildSmartHealthMetrics = () => {
  const screenWidth = Dimensions.get('window').width;
  
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Smart Health Metrics</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={[styles.metricCard, { backgroundColor: 'rgba(33, 150, 243, 0.1)' }]}>
          <View style={styles.metricHeader}>
            <Icon name="favorite" size={16} color="#2196F3" />
            <Text style={[styles.metricTitle, { color: '#2196F3' }]}>Heart Rate</Text>
          </View>
          <View style={styles.metricValueContainer}>
            <Text style={[styles.metricValue, { color: '#2196F3' }]}>78.2</Text>
            <Text style={[styles.metricUnit, { color: 'rgba(33, 150, 243, 0.7)' }]}>BPM</Text>
          </View>
          <LineChart
            data={{
              labels: [],
              datasets: [{ data: [60, 70, 65, 80, 75, 85, 78] }]
            }}
            width={screenWidth * 0.4 - 20}
            height={40}
            chartConfig={{
              backgroundGradientFrom: 'rgba(33, 150, 243, 0.0)',
              backgroundGradientTo: 'rgba(33, 150, 243, 0.0)',
              color: () => '#2196F3',
              strokeWidth: 2,
              decimalPlaces: 0,
            }}
            bezier
            withDots={false}
            withInnerLines={false}
            withOuterLines={false}
            withHorizontalLabels={false}
            withVerticalLabels={false}
            style={styles.chart}
          />
        </View>
        
        <View style={[styles.metricCard, { backgroundColor: 'rgba(244, 67, 54, 0.1)' }]}>
          <View style={styles.metricHeader}>
            <Icon name="speed" size={16} color="#F44336" />
            <Text style={[styles.metricTitle, { color: '#F44336' }]}>Blood Pressure</Text>
          </View>
          <View style={styles.metricValueContainer}>
            <Text style={[styles.metricValue, { color: '#F44336' }]}>120</Text>
            <Text style={[styles.metricUnit, { color: 'rgba(244, 67, 54, 0.7)' }]}>NORMAL</Text>
          </View>
        </View>
        
        <View style={[styles.metricCard, { backgroundColor: 'rgba(33, 150, 243, 0.1)' }]}>
          <View style={styles.metricHeader}>
            <Icon name="nightlight-round" size={16} color="#64B5F6" />
            <Text style={[styles.metricTitle, { color: '#64B5F6' }]}>Sleep</Text>
          </View>
          <View style={styles.metricValueContainer}>
            <Text style={[styles.metricValue, { color: '#64B5F6' }]}>87</Text>
            <Text style={[styles.metricUnit, { color: 'rgba(100, 181, 246, 0.7)' }]}>%</Text>
          </View>
          <LineChart
            data={{
              labels: [],
              datasets: [{ data: [60, 80, 85, 75, 90, 87] }]
            }}
            width={screenWidth * 0.4 - 20}
            height={40}
            chartConfig={{
              backgroundGradientFrom: 'rgba(100, 181, 246, 0.0)',
              backgroundGradientTo: 'rgba(100, 181, 246, 0.0)',
              color: () => '#64B5F6',
              strokeWidth: 2,
              decimalPlaces: 0,
            }}
            bezier
            withDots={false}
            withInnerLines={false}
            withOuterLines={false}
            withHorizontalLabels={false}
            withVerticalLabels={false}
            style={styles.chart}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const buildFitnessTracker = () => {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Fitness & Activity Tracker</Text>
        <Icon name="more-horiz" size={24} color="#000000" />
      </View>
      <View style={styles.card}>
        {buildProgressBar('Calories Burned', '1500', '2000', 0.75, '#F44336', 'local-fire-department')}
        <View style={styles.divider} />
        {buildProgressBar('Steps Taken', '7500', '10000', 0.75, '#2196F3', 'directions-walk', true)}
      </View>
    </View>
  );
};

const buildProgressBar = (title, current, target, progress, color, iconName, isCompleted = false) => {
  return (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarHeader}>
        <View style={styles.progressBarTitleContainer}>
          <Icon name={iconName} size={20} color={color} />
          <Text style={styles.progressBarTitle}>{title}</Text>
          {isCompleted && <Icon name="check-circle" size={16} color="#4CAF50" style={styles.checkIcon} />}
        </View>
      </View>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
      </View>
      <View style={styles.progressBarLabels}>
        <Text style={styles.progressBarCurrentLabel}>You've reached {current}</Text>
        <Text style={styles.progressBarTargetLabel}>{target}cal</Text>
      </View>
    </View>
  );
};

const buildNutritionCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="restaurant-menu" size={20} color="#000000" />
        <Text style={styles.cardTitle}>Nutrition</Text>
      </View>
      <View style={styles.nutrientContainer}>
        {buildNutrientItem('Vitamin A', 2, '#FF9800')}
        {buildNutrientItem('Protein', 3, '#4CAF50')}
        {buildNutrientItem('Calcium', 2, '#2196F3')}
      </View>
    </View>
  );
};

const buildNutrientItem = (name, level, color) => {
  return (
    <View style={styles.nutrientItem}>
      <View style={styles.nutrientDots}>
        {[0, 1, 2].map((index) => (
          <View 
            key={index}
            style={[
              styles.nutrientDot, 
              { backgroundColor: index < level ? color : '#EEEEEE' }
            ]} 
          />
        ))}
      </View>
      <Text style={styles.nutrientName}>{name}</Text>
    </View>
  );
};

const buildSleepCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="nightlight-round" size={20} color="#000000" />
        <Text style={styles.cardTitle}>Sleep</Text>
      </View>
      <View style={styles.nutrientContainer}>
        {buildNutrientItem('Hours Slept', 3, '#2196F3')}
        {buildNutrientItem('Quality', 2, '#4CAF50')}
        {buildNutrientItem('Stress', 2, '#FF9800')}
      </View>
    </View>
  );
};

const buildHydrationCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="opacity" size={20} color="#000000" />
        <Text style={styles.cardTitle}>Hydration</Text>
      </View>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: '35%', backgroundColor: '#2196F3' }]} />
      </View>
      <View style={styles.progressBarLabels}>
        <Text style={styles.progressBarCurrentLabel}>700ml</Text>
        <Text style={styles.progressBarTargetLabel}>2,000ml</Text>
      </View>
    </View>
  );
};

const buildWellnessAIChatbot = () => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderWithHelp}>
        <View style={styles.cardHeader}>
          <Icon name="chat-bubble-outline" size={20} color="#000000" />
          <Text style={styles.cardTitle}>Wellness AI Chatbot</Text>
        </View>
        <Icon name="help-outline" size={20} color="#9E9E9E" />
      </View>
      <View style={styles.badgeContainer}>
        <View style={styles.basicBadge}>
          <Text style={styles.basicBadgeText}>BASIC</Text>
        </View>
      </View>
      <View style={styles.chatbotStats}>
        <View>
          <Text style={styles.chatbotStatsNumber}>1,922</Text>
          <Text style={styles.chatbotStatsLabel}>total</Text>
          <Text style={styles.chatbotStatsDescription}>
            AI Health Chatbot Conversations
          </Text>
        </View>
        <View style={styles.chatbotIconContainer}>
          <Icon name="chat-bubble-outline" size={30} color="#1167FE" />
          <View style={styles.chatbotAddButton}>
            <Icon name="add" size={16} color="#FFFFFF" />
          </View>
        </View>
      </View>
    </View>
  );
};

const buildMedicationManagement = (navigation) => {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Medication Management</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Medications')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <View style={styles.medicationSummary}>
          <View style={styles.medicationSummaryItem}>
            <Text style={styles.medicationCount}>3</Text>
            <Text style={styles.medicationLabel}>Active Medications</Text>
          </View>
          <View style={styles.medicationSummaryItem}>
            <Text style={styles.medicationCount}>98%</Text>
            <Text style={styles.medicationLabel}>Adherence Rate</Text>
          </View>
        </View>
        
        <View style={styles.medicationActions}>
          <TouchableOpacity 
            style={styles.medicationActionButton}
            onPress={() => navigation.navigate('AddMedication')}
          >
            <Icon name="add-circle-outline" size={24} color="#1167FE" />
            <Text style={styles.actionButtonText}>Add Medication</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.medicationActionButton}
            onPress={() => navigation.navigate('ScanMedication')}
          >
            <Icon name="qr-code-scanner" size={24} color="#1167FE" />
            <Text style={styles.actionButtonText}>Scan Medication</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.upcomingMedication}>
          <Text style={styles.upcomingTitle}>Upcoming Medication</Text>
          <View style={styles.upcomingCard}>
            <View style={styles.upcomingIconContainer}>
              <Icon name="medication" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.upcomingDetails}>
              <Text style={styles.upcomingMedName}>Amoxicillin</Text>
              <Text style={styles.upcomingDosage}>500mg • Once daily</Text>
              <Text style={styles.upcomingTime}>Today, 8:00 PM</Text>
            </View>
            <TouchableOpacity style={styles.upcomingTakeButton}>
              <Text style={styles.upcomingTakeText}>Take</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F5F9',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80, // Extra padding for bottom nav bar
  },
  spacer: {
    height: 20,
  },
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#1167FE',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scoreBox: {
    width: 80,
    height: 80,
    backgroundColor: '#9C27B0',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  scoreInfo: {
    flex: 1,
    marginLeft: 16,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreDescription: {
    fontSize: 14,
    color: '#9E9E9E',
    marginTop: 4,
  },
  metricCard: {
    width: Dimensions.get('window').width * 0.4,
    padding: 12,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  metricUnit: {
    fontSize: 12,
    marginLeft: 4,
  },
  chart: {
    marginTop: 8,
    borderRadius: 8,
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBarTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarTitle: {
    fontWeight: 'bold',
    marginLeft: 8,
  },
  checkIcon: {
    marginLeft: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#EEEEEE',
    borderRadius: 4,
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },
  progressBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressBarCurrentLabel: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  progressBarTargetLabel: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderWithHelp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  nutrientContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutrientItem: {
    alignItems: 'center',
  },
  nutrientDots: {
    flexDirection: 'row',
  },
  nutrientDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    margin: 2,
  },
  nutrientName: {
    fontSize: 12,
    marginTop: 4,
  },
  badgeContainer: {
    marginBottom: 16,
  },
  basicBadge: {
    backgroundColor: '#1167FE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  basicBadgeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  chatbotStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatbotStatsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  chatbotStatsLabel: {
    fontSize: 14,
    color: '#9E9E9E',
  },
  chatbotStatsDescription: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 4,
  },
  chatbotIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatbotAddButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#1167FE',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medicationSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  medicationSummaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  medicationCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1167FE',
  },
  medicationAddButton: {
    backgroundColor: '#1167FE',
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicationLabel: {
    fontSize: 14,
    color: '#666666',
  },
  medicationCalendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  medicationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  medicationActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 12,
    flex: 0.48,
  },
  actionButtonText: {
    marginLeft: 8,
    color: '#1167FE',
    fontWeight: '500',
  },
  upcomingMedication: {
    marginTop: 8,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 12,
  },
  upcomingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1167FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upcomingDetails: {
    flex: 1,
    marginLeft: 12,
  },
  upcomingMedName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  upcomingDosage: {
    fontSize: 14,
    color: '#666666',
  },
  upcomingTime: {
    fontSize: 12,
    color: '#1167FE',
  },
  upcomingTakeButton: {
    backgroundColor: '#1167FE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  upcomingTakeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  calendarDay: {
    width: (Dimensions.get('window').width - 64) / 7,
    height: (Dimensions.get('window').width - 64) / 7,
    margin: 2,
    borderRadius: 4,
  },
});

export default HomeScreen;