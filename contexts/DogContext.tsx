import React, { createContext, useContext, useState } from "react";

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

export function DogProvider({ children }: { children: React.ReactNode }) {
  const [dogs, setDogs] = useState<DogProfile[]>([]);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);

  const addDogs = async (newDogs: DogProfile[]) => {
    setDogs((prevDogs) => [...prevDogs, ...newDogs]);
    if (newDogs.length > 0) {
      setSelectedDogId(newDogs[0].id);
    }
  };

  return (
    <DogContext.Provider
      value={{ dogs, addDogs, selectedDogId, setSelectedDogId }}
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
