import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { View, StyleSheet, Text, Animated, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Enable screens for better performance
enableScreens();

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import MedicationScreen from './src/screens/medication/MedicationScreen';
import AddMedicationScreen from './src/screens/medication/AddMedicationScreen';
import MedicationDetailScreen from './src/screens/medication/MedicationDetailScreen';
import MedicationScheduleScreen from './src/screens/medication/MedicationScheduleScreen';
import TestGlucoseLevelScreen from './src/screens/TestGlucoseLevelScreen';
import WellnessAIChatbotScreen from './src/screens/WellnessAIChatbotScreen';
import PillTakenScreen from './src/screens/medication/PillTakenScreen';
import ScanScreen from './src/screens/medication/ScanScreen';
import ScanMedicationScreen from './src/screens/medication/ScanMedicationScreen';
import MedicationDescriptionScreen from './src/screens/medication/MedicationDescriptionScreen';
import VoiceAssistanceScreen from './src/screens/VoiceAssistanceScreen';
import TranscribeAIScreen from './src/screens/TranscribeAIScreen';
import ProfileScreen from './src/screens/ProfileSettingsScreen';
import PersonalInfoScreen from './src/screens/profile/PersonalInfoScreen';
import NotificationSettingsScreen from './src/screens/profile/NotificationSettingsScreen';
import PreferencesScreen from './src/screens/profile/PreferencesScreen';
import SecurityScreen from './src/screens/profile/SecurityScreen';
import LanguageSettingsScreen from './src/screens/profile/LanguageSettingsScreen';
import AboutScreen from './src/screens/profile/AboutScreen';
import HelpCenterScreen from './src/screens/profile/HelpCenterScreen';
import ContactUsScreen from './src/screens/profile/ContactUsScreen';
import HealthScoreScreen from './src/screens/health/HealthScoreScreen';
import AiHealthSuggestionScreen from './src/screens/health/AiHealthSuggestionScreen';
import NutritionGuidanceScreen from './src/screens/health/NutritionGuidanceScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import AIToolsScreen from './src/screens/AIToolsScreen';
import GetAssistanceScreen from './src/screens/medication/GetAssistanceScreen';

// Import providers
import { MedicationProvider } from './src/providers/MedicationProvider';
import { Pill } from 'lucide-react-native';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Create a stack navigator for the Home tab
const HomeStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
      />
      <Stack.Screen 
        name="TestGlucoseLevel" 
        component={TestGlucoseLevelScreen} 
      />
      <Stack.Screen 
        name="WellnessAIChatbot" 
        component={WellnessAIChatbotScreen} 
      />
      <Stack.Screen
        name="AddMedication"
        component={AddMedicationScreen}
      />
      <Stack.Screen
        name="MedicationList"
        component={MedicationScreen}
      />
      <Stack.Screen
        name="MedicationDetail"
        component={MedicationDetailScreen}
      />
      <Stack.Screen
        name="PillTaken"
        component={PillTakenScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MedicationDescription"
        component={MedicationDescriptionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="VoiceAssistance" 
        component={VoiceAssistanceScreen} 
      />
      <Stack.Screen 
        name="TranscribeAI" 
        component={TranscribeAIScreen} 
      />
      <Stack.Screen
        name="HealthScore"
        component={HealthScoreScreen}
      />
      <Stack.Screen
        name="AIHealthSuggestion"
        component={AiHealthSuggestionScreen}
      />
      <Stack.Screen
        name="NutritionGuidance"
        component={NutritionGuidanceScreen}
      />
      <Stack.Screen 
        name="NotificationScreen" 
        component={NotificationScreen} 
      />
      <Stack.Screen
        name="GetAssistance"
        component={GetAssistanceScreen}
        options={{ headerShown: false }}
      />
      {/* Add other screens accessible from Home here */}
    </Stack.Navigator>
  );
};

// Create a stack navigator for the Medication tab
const MedicationStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false // Hide the stack navigator headers
      }}
    >
      <Stack.Screen 
        name="MedicationList" 
        component={MedicationScreen} 
        options={{ headerShown: false}}
      />
      <Stack.Screen 
        name="AddMedication" 
        component={AddMedicationScreen} 
        options={{ 
          title: "Add Medication",
          headerShown: false,
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#1167FE',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen 
        name="MedicationDetail" 
        component={MedicationDetailScreen} 
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen 
        name="MedicationSchedule" 
        component={MedicationScheduleScreen} 
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name="Scan"
        component={ScanScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PillTaken"
        component={PillTakenScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ScanMedication"
        component={ScanMedicationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GetAssistance"
        component={GetAssistanceScreen}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="MedicationDescription"
        component={MedicationDescriptionScreen}
        options={{ headerShown: false }}
      /> */}
    </Stack.Navigator>
  );
};

// Create a stack navigator for the Profile tab
const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen 
        name="ProfileScreen" 
        component={ProfileScreen} 
      />
      <Stack.Screen 
        name="PersonalInfo" 
        component={PersonalInfoScreen} 
      />
      <Stack.Screen 
        name="NotificationSettings" 
        component={NotificationSettingsScreen} 
      />
      <Stack.Screen 
        name="Preferences" 
        component={PreferencesScreen} 
      />
      <Stack.Screen 
        name="Security" 
        component={SecurityScreen} 
      />
      <Stack.Screen 
        name="LanguageSettings" 
        component={LanguageSettingsScreen} 
      />
      <Stack.Screen 
        name="About" 
        component={AboutScreen} 
      />
      <Stack.Screen 
        name="HelpCenter" 
        component={HelpCenterScreen} 
      />
      <Stack.Screen 
        name="ContactUs" 
        component={ContactUsScreen} 
      />
    </Stack.Navigator>
  );
};

// Create a stack navigator for the AI tab
const AIStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen 
        name="AIToolsScreen" 
        component={AIToolsScreen} 
      />
      <Stack.Screen 
        name="WellnessAIChatbot" 
        component={WellnessAIChatbotScreen} 
      />
      <Stack.Screen 
        name="VoiceAssistance" 
        component={VoiceAssistanceScreen} 
      />
      <Stack.Screen 
        name="TestGlucoseLevel" 
        component={TestGlucoseLevelScreen} 
      />
      <Stack.Screen 
        name="TranscribeAI" 
        component={TranscribeAIScreen} 
      />
      <Stack.Screen
        name="AiHealthSuggestion"
        component={AiHealthSuggestionScreen}
      />
      <Stack.Screen
        name="NutritionGuidance"
        component={NutritionGuidanceScreen}
      />
    </Stack.Navigator>
  );
};

// Custom Tab Bar Component
function CustomTabBar({ state, descriptors, navigation }) {
  const [translateValue] = useState(new Animated.Value(0));
  const insets = useSafeAreaInsets();
  
  // Get screen width for more accurate positioning
  const [width, setWidth] = useState(0);
  
  // Calculate tab positions more accurately
  React.useEffect(() => {
    if (width === 0) return;
    
    const tabWidth = width / 5;
    // Calculate center position of each tab
    const targetPosition = tabWidth * state.index + (tabWidth / 2) - 30; // 30 is half the width of the circle
    
    Animated.spring(translateValue, {
      toValue: targetPosition,
      velocity: 10,
      useNativeDriver: true,
    }).start();
  }, [state.index, width]);

  return (
    <View 
      style={[styles.tabBarContainer, { paddingBottom: insets.bottom }]}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setWidth(width);
      }}
    >
      {/* Curved background */}
      <View style={styles.tabBar}>
        {/* Active Tab Indicator - Animated circle that moves between tabs */}
        <Animated.View
          style={[
            styles.activeTabCircleIndicator,
            {
              transform: [{ translateX: translateValue }],
            },
          ]}
        />

        {/* Tab Buttons */}
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Get the appropriate icon for each tab
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Stats') {
            iconName = 'bar-chart';
          } else if (route.name === 'AI') {
            iconName = 'smart-toy';
          } else if (route.name === 'Medications') {
            iconName = 'medication';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabButton}
            >
              <Animated.View
                style={[
                  styles.iconContainer,
                  isFocused && {
                    transform: [{ translateY: -10 }, { scale: 1.2 }],
                  }
                ]}
              >
                <Icon 
                  name={iconName} 
                  size={24} 
                  color={isFocused ? '#4285F4' : '#5F6368'} 
                />
              </Animated.View>
              <Text style={[
                styles.tabLabel,
                { color: isFocused ? '#4285F4' : '#5F6368' }
              ]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const App = () => {
  return (
    <SafeAreaProvider>
      <MedicationProvider>
        <NavigationContainer>
          <Tab.Navigator
            tabBar={props => <CustomTabBar {...props} />}
            screenOptions={{
              headerShown: false,
              contentStyle: {
                paddingBottom: 60,
              },
            }}
          >
            <Tab.Screen 
              name="Home" 
              component={HomeStack} 
            />
            <Tab.Screen
              name="Stats"
              component={HomeScreen}
            />
            <Tab.Screen 
              name="AI" 
              component={AIStack} 
            />
            <Tab.Screen
              name="Medications"
              component={MedicationStack}
            />
            <Tab.Screen 
              name="Profile" 
              component={ProfileStack} 
            />
          </Tab.Navigator>
        </NavigationContainer>
      </MedicationProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
    position: 'relative',
  },
  activeTabCircleIndicator: {
    position: 'absolute',
    top: -15,
    left: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    marginLeft: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 0,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
    zIndex: 1,
  },
  iconContainer: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
  },
});

export default App;