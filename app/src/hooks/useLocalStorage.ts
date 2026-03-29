import { useState, useEffect, useCallback } from 'react';
import type { AppState, UserProfile, DailyAdvice } from '@/types';

const STORAGE_KEY = 'love-yourself-app-state';

const defaultState: AppState = {
  user: null,
  dailyAdvices: [],
  currentAdvice: null,
  lastGeneratedDate: null,
};

export function useLocalStorage() {
  const [state, setState] = useState<AppState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState({ ...defaultState, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load state from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save state to localStorage:', error);
      }
    }
  }, [state, isLoaded]);

  const setUser = useCallback((user: UserProfile | null) => {
    setState(prev => ({ ...prev, user }));
  }, []);

  const addAdvice = useCallback((advice: DailyAdvice) => {
    setState(prev => ({
      ...prev,
      dailyAdvices: [advice, ...prev.dailyAdvices],
      currentAdvice: advice,
      lastGeneratedDate: new Date().toISOString(),
    }));
  }, []);

  const completeAdvice = useCallback((adviceId: string) => {
    setState(prev => ({
      ...prev,
      dailyAdvices: prev.dailyAdvices.map(advice =>
        advice.id === adviceId
          ? { ...advice, completed: true, completedAt: new Date().toISOString() }
          : advice
      ),
      currentAdvice: prev.currentAdvice?.id === adviceId
        ? { ...prev.currentAdvice, completed: true, completedAt: new Date().toISOString() }
        : prev.currentAdvice,
    }));
  }, []);

  const updateAdvice = useCallback((advice: DailyAdvice) => {
    setState(prev => ({
      ...prev,
      currentAdvice: advice,
      dailyAdvices: prev.dailyAdvices.map(a => a.id === advice.id ? advice : a),
    }));
  }, []);

  const clearHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      dailyAdvices: [],
      currentAdvice: null,
      lastGeneratedDate: null,
    }));
  }, []);

  const resetAll = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    state,
    isLoaded,
    setUser,
    addAdvice,
    completeAdvice,
    updateAdvice,
    clearHistory,
    resetAll,
  };
}
