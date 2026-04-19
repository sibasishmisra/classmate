'use client';

import { useEffect } from 'react';
import { soundManager } from '@/lib/sound-manager';
import { useSettings } from '@/contexts/SettingsContext';

/**
 * SoundInitializer component
 * Preloads all sound effects on app mount and syncs with settings
 * Must be a client component to access browser APIs
 */
export default function SoundInitializer() {
  const { soundEnabled } = useSettings();
  
  useEffect(() => {
    // Preload sounds when component mounts
    soundManager.preloadSounds();
    
    console.log('[SoundInitializer] Sounds preloaded');
    
    // Add a one-time click handler to unlock audio on first user interaction
    // This is required by browsers' autoplay policies
    const unlockAudio = () => {
      console.log('[SoundInitializer] Audio unlocked by user interaction');
      // Play a silent sound to unlock audio context
      const audio = new Audio();
      audio.volume = 0;
      audio.play().catch(() => {
        // Ignore errors
      });
      
      // Remove the listener after first interaction
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };
    
    // Listen for first user interaction
    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);
    document.addEventListener('keydown', unlockAudio);
    
    // Cleanup on unmount
    return () => {
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
      soundManager.cleanup();
    };
  }, []);
  
  // Sync soundManager with settings
  useEffect(() => {
    if (soundEnabled) {
      soundManager.enable();
      console.log('[SoundInitializer] Sounds enabled');
    } else {
      soundManager.disable();
      console.log('[SoundInitializer] Sounds disabled');
    }
  }, [soundEnabled]);

  // This component doesn't render anything
  return null;
}
