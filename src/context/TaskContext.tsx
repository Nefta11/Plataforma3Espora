import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TaskFile {
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface TaskData {
  id: number;
  notes: string;
  files: TaskFile[];
  completed: boolean;
  lastModified: string;
}

interface TaskContextType {
  tasks: Record<number, TaskData>;
  saveTask: (taskId: number, data: Partial<TaskData>) => void;
  getTask: (taskId: number) => TaskData | undefined;
}

const STORAGE_KEY = 'task_data';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const getInitialState = (): Record<number, TaskData> => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Error loading task state:', error);
  }
  return {};
};

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Record<number, TaskData>>(getInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving task state:', error);
    }
  }, [tasks]);

  const saveTask = (taskId: number, data: Partial<TaskData>) => {
    setTasks(prev => ({
      ...prev,
      [taskId]: {
        id: taskId,
        notes: '',
        files: [],
        completed: false,
        ...prev[taskId], // Keep existing data if any
        ...data,
        lastModified: new Date().toISOString()
      }
    }));
  };

  const getTask = (taskId: number) => tasks[taskId];

  return (
    <TaskContext.Provider value={{ tasks, saveTask, getTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};