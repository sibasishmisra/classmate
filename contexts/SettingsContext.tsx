'use client';

/**
 * SettingsContext provider for ClassMate.info
 * Manages user preferences for sound, animations, and accessibility
 * Validates: Requirements 6.7, 10.7
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface SettingsContextValue {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  reducedMotion: boolean;
  toggleSound: () => void;
  toggleAnimations: () => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

const SETTINGS_KEY = 'classmate_settings';

interface StoredSettings {
  soundEnabled: boolean;
  animationsEnabled: boolean;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed: StoredSettings = JSON.parse(stored);
        setSoundEnabled(parsed.soundEnabled ?? true);
        setAnimationsEnabled(parsed.animationsEnabled ?? true);
      }
    } catch (error) {
      console.warn('Failed to load settings:', error);
    }

    // Detect prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      // If user prefers reduced motion, disable animations
      if (e.matches) {
        setAnimationsEnabled(false);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Persist settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const settings: StoredSettings = {
        soundEnabled,
        animationsEnabled
      };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to persist settings:', error);
    }
  }, [soundEnabled, animationsEnabled]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  const toggleAnimations = useCallback(() => {
    setAnimationsEnabled(prev => !prev);
  }, []);

  const value: SettingsContextValue = {
    soundEnabled,
    animationsEnabled,
    reducedMotion,
    toggleSound,
    toggleAnimations
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
