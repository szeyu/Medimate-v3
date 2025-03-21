// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const FitnessTracker = () => {
//   return (
//     <View>
//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>Fitness & Activity Tracker</Text>
//         <Icon name="more-horiz" size={24} color="#000000" />
//       </View>
//       <View style={styles.card}>
//         {buildProgressBar('Calories Burned', '1500', '2000', 0.75, '#F44336', 'local-fire-department')}
//         <View style={styles.divider} />
//         {buildProgressBar('Steps Taken', '7500', '10000', 0.75, '#2196F3', 'directions-walk', true)}
//       </View>
//     </View>
//   );
// };

// const buildProgressBar = (title, current, target, progress, color, iconName, isCompleted = false) => {
//   return (
//     <View style={styles.progressBarContainer}>
//       <View style={styles.progressBarHeader}>
//         <View style={styles.progressBarTitleContainer}>
//           <Icon name={iconName} size={20} color={color} />
//           <Text style={styles.progressBarTitle}>{title}</Text>
//           {isCompleted && <Icon name="check-circle" size={16} color="#4CAF50" style={styles.checkIcon} />}
//         </View>
//       </View>
//       <View style={styles.progressBarBackground}>
//         <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
//       </View>
//       <View style={styles.progressBarLabels}>
//         <Text style={styles.progressBarCurrentLabel}>You've reached {current}</Text>
//         <Text style={styles.progressBarTargetLabel}>{target}cal</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   card: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   progressBarContainer: {
//     marginBottom: 16,
//   },
//   progressBarHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   progressBarTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   progressBarTitle: {
//     fontWeight: 'bold',
//     marginLeft: 8,
//   },
//   checkIcon: {
//     marginLeft: 8,
//   },
//   progressBarBackground: {
//     height: 8,
//     backgroundColor: '#EEEEEE',
//     borderRadius: 4,
//   },
//   progressBarFill: {
//     height: 8,
//     borderRadius: 4,
//   },
//   progressBarLabels: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 8,
//   },
//   progressBarCurrentLabel: {
//     fontSize: 12,
//     color: '#9E9E9E',
//   },
//   progressBarTargetLabel: {
//     fontSize: 12,
//     color: '#9E9E9E',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#EEEEEE',
//     marginVertical: 16,
//   },
// });

// export default FitnessTracker; 

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons'

const FitnessTrackerCard = () => {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Fitness & Activity Tracker</Text>
        <Icon name="more-horiz" size={24} color="#9E9E9E" />
      </View>
      
      {/* Calories Burned */}
      <View style={styles.metricCard}>
        <View style={styles.metricIconContainer}>
          <MaterialComIcon name="dumbbell" size={24} color="#333" />
        </View>
        <View style={styles.metricContent}>
          <Text style={styles.metricTitle}>Calories Burned</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: '50%', backgroundColor: '#FF5A5A' }]} />
          </View>
          <View style={styles.metricValues}>
            <Text style={styles.metricCurrentValue}>500kcal</Text>
            <Text style={styles.metricTargetValue}>2000kcal</Text>
          </View>
        </View>
      </View>
      
      {/* Steps Taken */}
      <View style={styles.metricCard}>
        <View style={styles.metricIconContainer}>
          <Icon name="directions-walk" size={24} color="#333" />
        </View>
        <View style={styles.metricContent}>
          <Text style={styles.metricTitle}>Steps Taken</Text>
          <Text style={styles.metricDescription}>You've taken 1000 steps.</Text>
        </View>
        <View style={styles.checkmarkContainer}>
          <Icon name="check" size={24} color="#1167FE" />
        </View>
      </View>
      
      {/* Nutrition */}
      <View style={styles.metricCard}>
        <View style={styles.metricIconContainer}>
          <Icon name="apple" size={24} color="#333" />
        </View>
        <View style={styles.metricContent}>
          <Text style={styles.metricTitle}>Nutrition</Text>
          <View style={styles.pillsContainer}>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Vitamin A</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Ibuprofen</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>2+</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Sleep */}
      <View style={styles.metricCard}>
        <View style={styles.metricIconContainer}>
          <Icon name="hotel" size={24} color="#333" />
        </View>
        <View style={styles.metricContent}>
          <Text style={styles.metricTitle}>Sleep</Text>
          <Text style={styles.metricDescription}>11/36 Monthly Circadian</Text>
        </View>
        <View style={styles.circleProgressContainer}>
          <View style={styles.circleProgress}>
            <Text style={styles.circleProgressText}>75%</Text>
          </View>
        </View>
      </View>
      
      {/* Hydration */}
      <View style={styles.metricCard}>
        <View style={styles.metricIconContainer}>
          <Icon name="opacity" size={24} color="#333" />
        </View>
        <View style={styles.metricContent}>
          <Text style={styles.metricTitle}>Hydration</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: '35%', backgroundColor: '#1167FE' }]} />
          </View>
          <View style={styles.metricValues}>
            <Text style={styles.metricCurrentValue}>700ml</Text>
            <Text style={styles.metricTargetValue}>2000ml</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  metricCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#E8ECF4',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  metricContent: {
    flex: 1,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  metricDescription: {
    fontSize: 14,
    color: '#9E9E9E',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E8ECF4',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  metricValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricCurrentValue: {
    fontSize: 14,
    color: '#9E9E9E',
  },
  metricTargetValue: {
    fontSize: 14,
    color: '#9E9E9E',
  },
  checkmarkContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#E8ECF4',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pill: {
    backgroundColor: '#E8FFF8',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  pillText: {
    color: '#20C997',
    fontSize: 14,
  },
  circleProgressContainer: {
    marginLeft: 'auto',
  },
  circleProgress: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: '#893FFC',
    borderLeftColor: '#E8ECF4',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
  },
  circleProgressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    transform: [{ rotate: '315deg' }],
  },
});

export default FitnessTrackerCard;