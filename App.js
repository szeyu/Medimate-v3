import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

// Enable screens for better performance
enableScreens();

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import MedicationScreen from './src/screens/MedicationScreen';
import AddMedicationScreen from './src/screens/AddMedicationScreen';
import MedicationDetailScreen from './src/screens/MedicationDetailScreen';
import MedicationScheduleScreen from './src/screens/MedicationScheduleScreen';
import TestGlucoseLevelScreen from './src/screens/TestGlucoseLevelScreen';
import WellnessAIChatbotScreen from './src/screens/WellnessAIChatbotScreen';
import PillTakenScreen from './src/screens/PillTakenScreen';
import ScanScreen from './src/screens/ScanScreen';
import ScanMedicationScreen from './src/screens/ScanMedicationScreen';
import MedicationDescriptionScreen from './src/screens/MedicationDescriptionScreen';
import VoiceAssistanceScreen from './src/screens/VoiceAssistanceScreen';
import TranscribeAIScreen from './src/screens/TranscribeAIScreen';

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
        name="MedicationSchedule"
        component={MedicationScheduleScreen}
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
      {/* Add other screens accessible from Home here */}
    </Stack.Navigator>
  );
};

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
      <Stack.Screen 
        name="MedicationSchedule" 
        component={MedicationScheduleScreen} 
        options={{ headerShown: false }}
      />
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
        name="HomeScreen" 
        component={HomeScreen} 
      />
      <Stack.Screen
        name="MedicationDescription"
        component={MedicationDescriptionScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <MedicationProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Home') {
                  iconName = 'home';
                } else if (route.name === 'Medications') {
                  iconName = 'message';
                } else if (route.name === 'Stats') {
                  iconName = 'bar-chart';
                } else if (route.name === 'Add') {
                  iconName = 'add-circle';
                } else if (route.name === 'Profile') {
                  iconName = 'person';
                }
                return <Icon name={iconName} size={size} color={color} />;
              },
              headerShown: false // Hide all headers in Tab.Navigator
            })}
            tabBarOptions={{
              activeTintColor: '#1167FE',
              inactiveTintColor: 'gray',
            }}
          >
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="Stats" component={HomeScreen} />
            <Tab.Screen name="Add" component={HomeScreen} options={{ tabBarLabel: '',}}  />
            <Tab.Screen name="Medications" component={MedicationStack}/>
            <Tab.Screen name="Profile" component={HomeScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </MedicationProvider>
    </SafeAreaProvider>
  );
};

export default App;