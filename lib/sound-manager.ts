/**
 * SoundManager utility for ClassMate.info
 * Handles sound effect preloading, playback, and volume control
 * Validates: Requirements 6.2, 6.7
 */

interface SoundEffect {
  id: string;
  src: string;
  volume: number;
  category: 'feedback' | 'transition' | 'celebration';
}

const sounds: SoundEffect[] = [
  {
    id: 'bell-soft',
    src: '/sounds/bell-soft.mp3',
    volume: 0.3,
    category: 'feedback'
  },
  {
    id: 'page-turn',
    src: '/sounds/page-turn.mp3',
    volume: 0.2,
    category: 'transition'
  },
  {
    id: 'chalk-tap',
    src: '/sounds/chalk-tap.mp3',
    volume: 0.15,
    category: 'feedback'
  },
  {
    id: 'success-chime',
    src: '/sounds/success-chime.mp3',
    volume: 0.25,
    category: 'celebration'
  }
];

class SoundManager {
  private sounds: Map<string, HTMLAudioElement>;
  private enabled: boolean;
  private preloaded: boolean;

  constructor() {
    this.sounds = new Map();
    this.enabled = true;
    this.preloaded = false;
  }

  /**
   * Preload all sound effects
   * Should be called once during app initialization
   */
  preloadSounds(): void {
    if (this.preloaded || typeof window === 'undefined') return;

    console.log('[SoundManager] Starting to preload sounds...');

    sounds.forEach(sound => {
      try {
        const audio = new Audio(sound.src);
        audio.volume = sound.volume;
        audio.preload = 'auto';
        
        // Handle loading success
        audio.addEventListener('canplaythrough', () => {
          console.log(`[SoundManager] ✓ Loaded: ${sound.id}`);
        });
        
        // Handle loading errors gracefully
        audio.addEventListener('error', (e) => {
          console.error(`[SoundManager] ✗ Failed to load sound: ${sound.id}`, e);
        });

        this.sounds.set(sound.id, audio);
      } catch (error) {
        console.error(`[SoundManager] Error preloading sound ${sound.id}:`, error);
      }
    });

    this.preloaded = true;
    console.log(`[SoundManager] Preloaded ${this.sounds.size} sounds`);
  }

  /**
   * Play a sound effect by ID
   * Handles autoplay restrictions gracefully
   */
  play(soundId: string): void {
    if (!this.enabled) {
      console.debug(`[SoundManager] Sound disabled, not playing: ${soundId}`);
      return;
    }

    const sound = this.sounds.get(soundId);
    if (!sound) {
      console.warn(`[SoundManager] Sound not found: ${soundId}`);
      return;
    }

    try {
      // Reset to beginning if already playing
      sound.currentTime = 0;
      
      console.log(`[SoundManager] Playing: ${soundId}`);
      
      // Play and handle autoplay restrictions
      const playPromise = sound.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log(`[SoundManager] ✓ Successfully played: ${soundId}`);
          })
          .catch(error => {
            // Autoplay was prevented
            console.warn(`[SoundManager] Playback prevented for ${soundId}:`, error.message);
          });
      }
    } catch (error) {
      console.error(`[SoundManager] Error playing sound ${soundId}:`, error);
    }
  }

  /**
   * Toggle sound on/off
   */
  toggle(): void {
    this.enabled = !this.enabled;
  }

  /**
   * Enable sounds
   */
  enable(): void {
    this.enabled = true;
  }

  /**
   * Disable sounds
   */
  disable(): void {
    this.enabled = false;
  }

  /**
   * Check if sounds are enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Set volume for a specific sound
   */
  setVolume(soundId: string, volume: number): void {
    const sound = this.sounds.get(soundId);
    if (sound) {
      sound.volume = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Set master volume for all sounds
   */
  setMasterVolume(volume: number): void {
    const normalizedVolume = Math.max(0, Math.min(1, volume));
    
    sounds.forEach(soundDef => {
      const audio = this.sounds.get(soundDef.id);
      if (audio) {
        audio.volume = soundDef.volume * normalizedVolume;
      }
    });
  }

  /**
   * Stop all currently playing sounds
   */
  stopAll(): void {
    this.sounds.forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    this.stopAll();
    this.sounds.clear();
    this.preloaded = false;
  }
}

// Export singleton instance
export const soundManager = new SoundManager();

// Export sound IDs for type safety
export const SOUND_IDS = {
  BELL_SOFT: 'bell-soft',
  PAGE_TURN: 'page-turn',
  CHALK_TAP: 'chalk-tap',
  SUCCESS_CHIME: 'success-chime'
} as const;

export type SoundId = typeof SOUND_IDS[keyof typeof SOUND_IDS];
