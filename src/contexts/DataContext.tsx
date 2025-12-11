/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { SprintData } from '../types';
import { getSprintData, getDataSourceInfo } from '../services/dataProvider';
import { mockSprintData } from '../data/mockJiraData';

interface DataContextType {
  sprintData: SprintData[];
  isLoading: boolean;
  error: string | null;
  isLiveData: boolean;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [sprintData, setSprintData] = useState<SprintData[]>(mockSprintData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiveData, setIsLiveData] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const dataSourceInfo = getDataSourceInfo();
      setIsLiveData(dataSourceInfo.isLive && dataSourceInfo.isConfigured);
      
      const data = await getSprintData();
      setSprintData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
      console.error('Error loading sprint data:', err);
      // Fallback to mock data
      setSprintData(mockSprintData);
      setIsLiveData(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshData = async () => {
    await loadData();
  };

  return (
    <DataContext.Provider value={{ sprintData, isLoading, error, isLiveData, refreshData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useSprintData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useSprintData must be used within a DataProvider');
  }
  return context;
}
