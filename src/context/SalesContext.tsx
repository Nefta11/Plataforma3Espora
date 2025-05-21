import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SalesStage {
  id: number;
  name: string;
  completed: boolean;
  current: boolean;
}

interface SalesContextType {
  stages: SalesStage[];
  currentStage: number;
  updateStage: (stageId: number) => void;
  completeStage: (stageId: number) => void;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

const STORAGE_KEY = 'sales_pipeline_state';

const getInitialState = (): SalesStage[] => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Error loading sales state:', error);
  }
  
  return [
    { id: 1, name: 'Contacto Inicial', completed: false, current: true },
    { id: 2, name: 'Calificación', completed: false, current: false },
    { id: 3, name: 'Propuesta', completed: false, current: false },
    { id: 4, name: 'Negociación', completed: false, current: false },
    { id: 5, name: 'Documentación', completed: false, current: false },
    { id: 6, name: 'Revisión Legal', completed: false, current: false },
    { id: 7, name: 'Aprobación', completed: false, current: false },
    { id: 8, name: 'Cierre', completed: false, current: false },
  ];
};

export const SalesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stages, setStages] = useState<SalesStage[]>(getInitialState);
  
  const [currentStage, setCurrentStage] = useState(() => {
    const currentStage = stages.find(stage => stage.current);
    return currentStage ? currentStage.id : 1;
  });

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stages));
    } catch (error) {
      console.error('Error saving sales state:', error);
    }
  }, [stages]);

  const updateStage = (stageId: number) => {
    setStages(prev => {
      const newStages = prev.map(stage => ({
        ...stage,
        current: stage.id === stageId,
        completed: stage.id < stageId
      }));
      return newStages;
    });
    setCurrentStage(stageId);
  };

  const completeStage = (stageId: number) => {
    setStages(prev => {
      const newStages = prev.map(stage => ({
        ...stage,
        completed: stage.id <= stageId,
        current: stage.id === stageId + 1
      }));
      return newStages;
    });
    setCurrentStage(stageId + 1);
  };

  return (
    <SalesContext.Provider value={{ stages, currentStage, updateStage, completeStage }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};