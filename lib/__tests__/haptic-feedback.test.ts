/**
 * Unit tests for HapticFeedback utility
 * Validates: Requirements 6.6
 */

import { 
  hapticFeedback, 
  triggerHaptic, 
  triggerLightHaptic, 
  triggerMediumHaptic, 
  triggerHeavyHaptic 
} from '../haptic-feedback';

describe('HapticFeedback', () => {
  let vibrateSpy: jest.Mock;
  let originalVibrate: any;

  beforeEach(() => {
    // Save original vibrate if it exists
    originalVibrate = (navigator as any).vibrate;
    
    // Mock navigator.vibrate
    vibrateSpy = jest.fn();
    Object.defineProperty(navigator, 'vibrate', {
      value: vibrateSpy,
      writable: true,
      configurable: true
    });

    // Create a new instance to pick up the mocked vibrate
    // We need to reset the singleton's internal state
    (hapticFeedback as any).supported = true;
    hapticFeedback.enable();
  });

  afterEach(() => {
    // Restore original vibrate
    if (originalVibrate !== undefined) {
      Object.defineProperty(navigator, 'vibrate', {
        value: originalVibrate,
        writable: true,
        configurable: true
      });
    } else {
      // @ts-ignore
      delete navigator.vibrate;
    }
    jest.restoreAllMocks();
  });

  describe('Support Detection', () => {
    it('should detect vibration API support', () => {
      expect(hapticFeedback.isSupported()).toBe(true);
    });

    it('should handle missing vibration API gracefully', () => {
      // Remove vibrate from navigator
      const originalVibrate = navigator.vibrate;
      // @ts-ignore
      delete navigator.vibrate;

      // Create new instance to test support detection
      const testManager = new (hapticFeedback.constructor as any)();
      expect(testManager.isSupported()).toBe(false);

      // Restore
      Object.defineProperty(navigator, 'vibrate', {
        value: originalVibrate,
        writable: true,
        configurable: true
      });
    });
  });

  describe('Haptic Patterns', () => {
    it('should trigger light haptic with 10ms vibration', () => {
      hapticFeedback.light();
      expect(vibrateSpy).toHaveBeenCalledWith([10]);
    });

    it('should trigger medium haptic with 20ms vibration', () => {
      hapticFeedback.medium();
      expect(vibrateSpy).toHaveBeenCalledWith([20]);
    });

    it('should trigger heavy haptic with pattern [30, 50, 30]', () => {
      hapticFeedback.heavy();
      expect(vibrateSpy).toHaveBeenCalledWith([30, 50, 30]);
    });

    it('should trigger correct pattern for each type', () => {
      hapticFeedback.trigger('light');
      expect(vibrateSpy).toHaveBeenCalledWith([10]);

      hapticFeedback.trigger('medium');
      expect(vibrateSpy).toHaveBeenCalledWith([20]);

      hapticFeedback.trigger('heavy');
      expect(vibrateSpy).toHaveBeenCalledWith([30, 50, 30]);
    });
  });

  describe('Enable/Disable', () => {
    it('should be enabled by default', () => {
      expect(hapticFeedback.isEnabled()).toBe(true);
    });

    it('should not trigger haptic when disabled', () => {
      hapticFeedback.disable();
      
      // Clear the spy after disable (which calls vibrate(0))
      vibrateSpy.mockClear();
      
      hapticFeedback.light();
      expect(vibrateSpy).not.toHaveBeenCalled();
    });

    it('should trigger haptic when re-enabled', () => {
      hapticFeedback.disable();
      hapticFeedback.enable();
      hapticFeedback.light();
      expect(vibrateSpy).toHaveBeenCalledWith([10]);
    });

    it('should toggle enabled state', () => {
      expect(hapticFeedback.isEnabled()).toBe(true);
      
      hapticFeedback.toggle();
      expect(hapticFeedback.isEnabled()).toBe(false);
      
      hapticFeedback.toggle();
      expect(hapticFeedback.isEnabled()).toBe(true);
    });

    it('should cancel vibration when disabled', () => {
      hapticFeedback.disable();
      expect(vibrateSpy).toHaveBeenCalledWith(0);
    });
  });

  describe('Cancel Vibration', () => {
    it('should cancel ongoing vibration', () => {
      hapticFeedback.cancel();
      expect(vibrateSpy).toHaveBeenCalledWith(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle vibration API errors gracefully', () => {
      vibrateSpy.mockImplementation(() => {
        throw new Error('Vibration not allowed');
      });

      // Should not throw
      expect(() => hapticFeedback.light()).not.toThrow();
    });

    it('should not trigger when vibration API is not supported', () => {
      // Remove vibrate from navigator
      const originalVibrate = navigator.vibrate;
      // @ts-ignore
      delete navigator.vibrate;

      const testManager = new (hapticFeedback.constructor as any)();
      testManager.light();

      // Should not have been called since it doesn't exist
      expect(vibrateSpy).not.toHaveBeenCalled();

      // Restore
      Object.defineProperty(navigator, 'vibrate', {
        value: originalVibrate,
        writable: true,
        configurable: true
      });
    });
  });

  describe('Convenience Functions', () => {
    it('should trigger haptic via triggerHaptic function', () => {
      triggerHaptic('light');
      expect(vibrateSpy).toHaveBeenCalledWith([10]);
    });

    it('should trigger light haptic via triggerLightHaptic', () => {
      triggerLightHaptic();
      expect(vibrateSpy).toHaveBeenCalledWith([10]);
    });

    it('should trigger medium haptic via triggerMediumHaptic', () => {
      triggerMediumHaptic();
      expect(vibrateSpy).toHaveBeenCalledWith([20]);
    });

    it('should trigger heavy haptic via triggerHeavyHaptic', () => {
      triggerHeavyHaptic();
      expect(vibrateSpy).toHaveBeenCalledWith([30, 50, 30]);
    });

    it('should default to light haptic when no type specified', () => {
      triggerHaptic();
      expect(vibrateSpy).toHaveBeenCalledWith([10]);
    });
  });

  describe('Multiple Triggers', () => {
    it('should handle rapid successive triggers', () => {
      hapticFeedback.light();
      hapticFeedback.medium();
      hapticFeedback.heavy();

      expect(vibrateSpy).toHaveBeenCalledTimes(3);
      expect(vibrateSpy).toHaveBeenNthCalledWith(1, [10]);
      expect(vibrateSpy).toHaveBeenNthCalledWith(2, [20]);
      expect(vibrateSpy).toHaveBeenNthCalledWith(3, [30, 50, 30]);
    });
  });
});
