import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface DogProfile {
  id: string;
  name: string;
  nickname: string;
  breed: string;
  age: string;
  photo: string | null;
}

interface DogContextType {
  dogs: DogProfile[];
  addDogs: (dogs: DogProfile[]) => Promise<void>;
  selectedDogId: string | null;
  setSelectedDogId: (id: string | null) => void;
}

const DogContext = createContext<DogContextType | undefined>(undefined);

const DOGS_STORAGE_KEY = "@barkwell_dogs";
const SELECTED_DOG_STORAGE_KEY = "@barkwell_selected_dog";

export function DogProvider({ children }: { children: React.ReactNode }) {
  const [dogs, setDogs] = useState<DogProfile[]>([]);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load dogs from storage on mount
  useEffect(() => {
    loadDogs();
  }, []);

  const loadDogs = async () => {
    try {
      const [storedDogs, storedSelectedId] = await Promise.all([
        AsyncStorage.getItem(DOGS_STORAGE_KEY),
        AsyncStorage.getItem(SELECTED_DOG_STORAGE_KEY),
      ]);

      if (storedDogs) {
        const parsedDogs = JSON.parse(storedDogs);
        setDogs(parsedDogs);
      }

      if (storedSelectedId) {
        setSelectedDogId(storedSelectedId);
      }
    } catch (error) {
      console.error("Failed to load dogs from storage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveDogs = async (dogsToSave: DogProfile[]) => {
    try {
      await AsyncStorage.setItem(DOGS_STORAGE_KEY, JSON.stringify(dogsToSave));
    } catch (error) {
      console.error("Failed to save dogs to storage:", error);
    }
  };

  const saveSelectedDogId = async (id: string | null) => {
    try {
      if (id) {
        await AsyncStorage.setItem(SELECTED_DOG_STORAGE_KEY, id);
      } else {
        await AsyncStorage.removeItem(SELECTED_DOG_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Failed to save selected dog ID:", error);
    }
  };

  const addDogs = async (newDogs: DogProfile[]) => {
    const updatedDogs = [...dogs, ...newDogs];
    setDogs(updatedDogs);
    await saveDogs(updatedDogs);

    if (newDogs.length > 0 && !selectedDogId) {
      const newSelectedId = newDogs[0].id;
      setSelectedDogId(newSelectedId);
      await saveSelectedDogId(newSelectedId);
    }
  };

  const updateSelectedDogId = async (id: string | null) => {
    setSelectedDogId(id);
    await saveSelectedDogId(id);
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <DogContext.Provider
      value={{
        dogs,
        addDogs,
        selectedDogId,
        setSelectedDogId: updateSelectedDogId,
      }}
    >
      {children}
    </DogContext.Provider>
  );
}

export function useDogs() {
  const context = useContext(DogContext);
  if (!context) {
    throw new Error("useDogs must be used within DogProvider");
  }
  return context;
}
