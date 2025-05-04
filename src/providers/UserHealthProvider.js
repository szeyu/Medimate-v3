import React, { createContext, useState, useContext } from 'react';

// Create a context for user health data
export const UserHealthContext = createContext(null);

// Custom hook to use the user health context
export const useUserHealth = () => useContext(UserHealthContext);

export const UserHealthProvider = ({ children }) => {
  // State to store user health data
  const [healthData, setHealthData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: '',
    allergies: '',
    bloodType: '',
    chronicConditions: '',
    medications: '',
    // Add more health-related fields as needed
  });

  // Function to update health data
  const updateHealthData = (newData) => {
    setHealthData(prevData => ({
      ...prevData,
      ...newData
    }));
  };

  // Prepare user context as a formatted string for the chatbot
  const getUserHealthContext = () => {
    if (!healthData.weight && !healthData.height) {
      return '';
    }

    let contextStr = 'User Health Information:\n';
    
    if (healthData.age) contextStr += `- Age: ${healthData.age} years\n`;
    if (healthData.gender) contextStr += `- Gender: ${healthData.gender}\n`;
    if (healthData.weight) contextStr += `- Weight: ${healthData.weight} kg\n`;
    if (healthData.height) contextStr += `- Height: ${healthData.height} cm\n`;
    if (healthData.bloodType) contextStr += `- Blood Type: ${healthData.bloodType}\n`;
    
    if (healthData.medications) {
      contextStr += `- Current Medications: ${healthData.medications}\n`;
    } else {
      contextStr += `- Current Medications: None reported\n`;
    }
    
    if (healthData.allergies) {
      contextStr += `- Allergies: ${healthData.allergies}\n`;
    } else {
      contextStr += `- No known allergies\n`;
    }
    
    if (healthData.chronicConditions) {
      contextStr += `- Chronic Conditions: ${healthData.chronicConditions}\n`;
    } else {
      contextStr += `- No chronic conditions reported\n`;
    }

    return contextStr;
  };

  // The value to be provided to consuming components
  const value = {
    healthData,
    updateHealthData,
    getUserHealthContext
  };

  return (
    <UserHealthContext.Provider value={value}>
      {children}
    </UserHealthContext.Provider>
  );
}; 