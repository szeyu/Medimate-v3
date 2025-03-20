import React, { createContext, useState, useEffect, useContext } from 'react';
import { DatabaseService } from '../services/DatabaseService';

const MedicationContext = createContext();

export const useMedications = () => useContext(MedicationContext);

export const MedicationProvider = ({ children }) => {
  const [medications, setMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dbService = new DatabaseService();

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    setIsLoading(true);
    try {
      const meds = await dbService.getMedications();
      setMedications(meds);
    } catch (error) {
      console.error('Error loading medications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addMedication = async (medication) => {
    try {
      const id = await dbService.insertMedication(medication);
      const newMedication = { ...medication, id };
      setMedications([...medications, newMedication]);
    } catch (error) {
      console.error('Error adding medication:', error);
    }
  };

  const updateMedication = async (medication) => {
    try {
      await dbService.updateMedication(medication);
      setMedications(
        medications.map((med) => (med.id === medication.id ? medication : med))
      );
    } catch (error) {
      console.error('Error updating medication:', error);
    }
  };

  const deleteMedication = async (id) => {
    try {
      await dbService.deleteMedication(id);
      setMedications(medications.filter((med) => med.id !== id));
    } catch (error) {
      console.error('Error deleting medication:', error);
    }
  };

  const toggleMedicationStatus = async (id, isActive) => {
    try {
      await dbService.toggleMedicationStatus(id, isActive);
      setMedications(
        medications.map((med) =>
          med.id === id ? { ...med, isActive } : med
        )
      );
    } catch (error) {
      console.error('Error toggling medication status:', error);
    }
  };

  return (
    <MedicationContext.Provider
      value={{
        medications,
        isLoading,
        loadMedications,
        addMedication,
        updateMedication,
        deleteMedication,
        toggleMedicationStatus,
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
};