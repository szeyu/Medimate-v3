import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MedicationContext = createContext();

export const MedicationProvider = ({ children }) => {
  const [medications, setMedications] = useState([]);
  const [totalCost, setTotalCost] = useState(112.68);
  const [isLoading, setIsLoading] = useState(true);

  // Clear AsyncStorage data
  const clearStorage = async () => {
    try {
      await AsyncStorage.multiRemove(['medications', 'totalCost']);
      console.log('Storage cleared successfully');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

  // Load medications from AsyncStorage on app start
  useEffect(() => {
    const loadMedications = async () => {
      try {
        setIsLoading(true);
        
        // Uncomment the next line to clear storage on each app start
        // await clearStorage();

        const storedMedications = await AsyncStorage.getItem('medications');
        const storedCost = await AsyncStorage.getItem('totalCost');
        
        if (storedMedications) {
          setMedications(JSON.parse(storedMedications));
        } else {
          // Default medications if none exist
          const defaultMedications = [
            {
              id: '1',
              name: 'Vitamin C',
              dosage: '100mg',
              frequency: '1x Per Day',
              time: '7:00 AM',
              instructions: 'Before Breakfast',
              isActive: true,
              isChecked: false,
              cost: 25.50
            },
            {
              id: '2',
              name: 'Painexal',
              dosage: '500mg',
              frequency: '2x Per Day',
              time: '10:00 AM',
              instructions: 'After Breakfast',
              isActive: true,
              isChecked: false,
              cost: 87.18
            }
          ];
          setMedications(defaultMedications);
          await AsyncStorage.setItem('medications', JSON.stringify(defaultMedications));
        }
        
        if (storedCost) {
          setTotalCost(parseFloat(storedCost));
        } else {
          await AsyncStorage.setItem('totalCost', totalCost.toString());
        }
      } catch (error) {
        console.error('Error loading medications:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMedications();
  }, []);

  // Save medications to AsyncStorage whenever they change
  useEffect(() => {
    const saveMedications = async () => {
      try {
        await AsyncStorage.setItem('medications', JSON.stringify(medications));
      } catch (error) {
        console.error('Error saving medications:', error);
      }
    };
    
    if (!isLoading) {
      saveMedications();
    }
  }, [medications, isLoading]);

  // Save total cost to AsyncStorage whenever it changes
  useEffect(() => {
    const saveTotalCost = async () => {
      try {
        await AsyncStorage.setItem('totalCost', totalCost.toString());
      } catch (error) {
        console.error('Error saving total cost:', error);
      }
    };
    
    if (!isLoading) {
      saveTotalCost();
    }
  }, [totalCost, isLoading]);

  // Add a new medication
  const addMedication = async (newMedication) => {
    try {
      const updatedMedications = [
        ...medications,
        {
          ...newMedication,
          id: String(medications.length + 1),
          isChecked: false
        }
      ];
      setMedications(updatedMedications);
      
      // Update total cost
      if (newMedication.cost) {
        const newTotal = totalCost + parseFloat(newMedication.cost);
        setTotalCost(parseFloat(newTotal.toFixed(2)));
      }
      
      return true;
    } catch (error) {
      console.error('Error adding medication:', error);
      return false;
    }
  };

  // Mark medication as taken
  const markMedicationAsTaken = async (id) => {
    try {
      const updatedMedications = medications.map(med => 
        med.id === id ? {...med, isChecked: true} : med
      );
      setMedications(updatedMedications);
      return true;
    } catch (error) {
      console.error('Error marking medication as taken:', error);
      return false;
    }
  };

  // Edit an existing medication
  const editMedication = async (id, updatedMedication) => {
    try {
      const medicationToUpdate = medications.find(med => med.id === id);
      const oldCost = medicationToUpdate.cost || 0;
      const newCost = updatedMedication.cost || 0;
      
      const updatedMedications = medications.map(med => 
        med.id === id ? {...med, ...updatedMedication} : med
      );
      setMedications(updatedMedications);
      
      // Update total cost if cost changed
      if (oldCost !== newCost) {
        const costDifference = newCost - oldCost;
        const newTotal = totalCost + costDifference;
        setTotalCost(parseFloat(newTotal.toFixed(2)));
      }
      
      return true;
    } catch (error) {
      console.error('Error editing medication:', error);
      return false;
    }
  };

  // Delete a medication
  const deleteMedication = async (id) => {
    try {
      const medicationToDelete = medications.find(med => med.id === id);
      const costToRemove = medicationToDelete.cost || 0;
      
      const updatedMedications = medications.filter(med => med.id !== id);
      setMedications(updatedMedications);
      
      // Update total cost
      if (costToRemove > 0) {
        const newTotal = totalCost - costToRemove;
        setTotalCost(parseFloat(newTotal.toFixed(2)));
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting medication:', error);
      return false;
    }
  };

  return (
    <MedicationContext.Provider
      value={{
        medications,
        totalCost,
        isLoading,
        addMedication,
        markMedicationAsTaken,
        editMedication,
        deleteMedication,
        clearStorage
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedications = () => useContext(MedicationContext);