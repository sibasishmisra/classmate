/**
 * HapticFeedback utility for ClassMate.info
 * Provides tactile feedback on mobile devices to enhance user experience
 * Validates: Requirements 6.6
 */

/**
 * Haptic feedback intensity types
 * - light: Brief, subtle vibration (10ms) for button presses
 * - medium: Moderate vibration (20ms) for level selection
 * - heavy: Strong vibration pattern for errors
 */
export type HapticType = 'light' | 'medium' | 'heavy';

/**
 * Vibration patterns for different haptic types
 * Values are in milliseconds
 */
const HAPTIC_PATTERNS: Record<HapticType, number | number[]> = {
  light: 10,      // Single short pulse for button press
  medium: 20,     // Single medium pulse for level selection
  heavy: [30, 50, 30]  // Pattern: vibrate-pause-vibrate for errors
};

class HapticFeedbackManager {
  private enabled: boolean;
  private supported: boolean;

  constructor() {
    this.enabled = true;
    this.supported = this.checkSupport();
  }

  /**
   * Check if haptic feedback is supported by the device
   */
  private checkSupport(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return false;
    }

    return 'vibrate' in navigator;
  }

  /**
   * Trigger haptic feedback with specified intensity
   * @param type - The intensity type: 'light', 'medium', or 'heavy'
   */
  trigger(type: HapticType = 'light'): void {
    // Don't trigger if disabled or not supported
    if (!this.enabled || !this.supported) {
      return;
    }

    try {
      const pattern = HAPTIC_PATTERNS[type];
      
      // Trigger vibration
      if (Array.isArray(pattern)) {
        navigator.vibrate(pattern);
      } else {
        navigator.vibrate([pattern]);
      }
    } catch (error) {
      // Silently fail if vibration API throws an error
      console.debug('Haptic feedback error:', error);
    }
  }

  /**
   * Trigger light haptic feedback (button press)
   */
  light(): void {
    this.trigger('light');
  }

  /**
   * Trigger medium haptic feedback (level selection)
   */
  medium(): void {
    this.trigger('medium');
  }

  /**
   * Trigger heavy haptic feedback pattern (errors)
   */
  heavy(): void {
    this.trigger('heavy');
  }

  /**
   * Enable haptic feedback
   */
  enable(): void {
    this.enabled = true;
  }

  /**
   * Disable haptic feedback
   */
  disable(): void {
    this.enabled = false;
    
    // Cancel any ongoing vibration
    if (this.supported) {
      try {
        navigator.vibrate(0);
      } catch (error) {
        console.debug('Error canceling vibration:', error);
      }
    }
  }

  /**
   * Toggle haptic feedback on/off
   */
  toggle(): void {
    if (this.enabled) {
      this.disable();
    } else {
      this.enable();
    }
  }

  /**
   * Check if haptic feedback is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Check if haptic feedback is supported by the device
   */
  isSupported(): boolean {
    return this.supported;
  }

  /**
   * Cancel any ongoing vibration
   */
  cancel(): void {
    if (this.supported) {
      try {
        navigator.vibrate(0);
      } catch (error) {
        console.debug('Error canceling vibration:', error);
      }
    }
  }
}

// Export singleton instance
export const hapticFeedback = new HapticFeedbackManager();

// Export convenience functions for common use cases
export const triggerHaptic = (type: HapticType = 'light'): void => {
  hapticFeedback.trigger(type);
};

export const triggerLightHaptic = (): void => {
  hapticFeedback.light();
};

export const triggerMediumHaptic = (): void => {
  hapticFeedback.medium();
};

export const triggerHeavyHaptic = (): void => {
  hapticFeedback.heavy();
};
