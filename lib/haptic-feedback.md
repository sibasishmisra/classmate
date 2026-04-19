# Haptic Feedback Utility

## Overview

The `haptic-feedback` utility provides tactile feedback on mobile devices to enhance the user experience. It implements the Vibration API to deliver different intensity levels of haptic feedback based on user interactions.

**Validates: Requirements 6.6**

## Features

- **Three intensity levels**: light, medium, and heavy haptic feedback
- **Automatic support detection**: Gracefully handles devices without vibration support
- **Enable/disable control**: Users can toggle haptic feedback on/off
- **Error handling**: Silently fails if vibration API is unavailable or throws errors
- **Singleton pattern**: Single instance manages all haptic feedback
- **Convenience functions**: Easy-to-use exported functions for common use cases

## Haptic Patterns

| Type | Duration/Pattern | Use Case |
|------|-----------------|----------|
| **Light** | 10ms | Button presses, general interactions |
| **Medium** | 20ms | Level selection, important actions |
| **Heavy** | [30ms, 50ms, 30ms] | Errors, warnings, critical feedback |

## Usage

### Basic Usage

```typescript
import { triggerLightHaptic, triggerMediumHaptic, triggerHeavyHaptic } from '@/lib/haptic-feedback';

// Light haptic for button press
function handleButtonClick() {
  triggerLightHaptic();
  // ... button logic
}

// Medium haptic for level selection
function handleLevelSelect(level: number) {
  triggerMediumHaptic();
  // ... level selection logic
}

// Heavy haptic for error display
function showError(message: string) {
  triggerHeavyHaptic();
  // ... error display logic
}
```

### Using the Manager Instance

```typescript
import { hapticFeedback } from '@/lib/haptic-feedback';

// Trigger specific intensity
hapticFeedback.light();
hapticFeedback.medium();
hapticFeedback.heavy();

// Or use the generic trigger method
hapticFeedback.trigger('light');
hapticFeedback.trigger('medium');
hapticFeedback.trigger('heavy');

// Check support
if (hapticFeedback.isSupported()) {
  console.log('Haptic feedback is supported');
}

// Enable/disable
hapticFeedback.enable();
hapticFeedback.disable();
hapticFeedback.toggle();

// Check if enabled
if (hapticFeedback.isEnabled()) {
  console.log('Haptic feedback is enabled');
}

// Cancel ongoing vibration
hapticFeedback.cancel();
```

### In React Components

```typescript
import { useEffect } from 'react';
import { triggerHeavyHaptic } from '@/lib/haptic-feedback';

function ErrorDisplay({ error }: { error: string }) {
  // Trigger haptic on mount
  useEffect(() => {
    triggerHeavyHaptic();
  }, []);

  return <div>{error}</div>;
}
```

## Implementation Details

### Support Detection

The utility automatically detects if the Vibration API is available:

```typescript
private checkSupport(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  return 'vibrate' in navigator;
}
```

### Error Handling

All vibration calls are wrapped in try-catch blocks to handle:
- Devices without vibration support
- Browser security restrictions
- API errors

Errors are logged to console in debug mode but don't interrupt the user experience.

### Pattern Implementation

```typescript
const HAPTIC_PATTERNS: Record<HapticType, number | number[]> = {
  light: 10,              // Single short pulse
  medium: 20,             // Single medium pulse
  heavy: [30, 50, 30]     // Vibrate-pause-vibrate pattern
};
```

## Browser Compatibility

The Vibration API is supported in:
- Chrome for Android
- Firefox for Android
- Samsung Internet
- Opera Mobile

Not supported in:
- iOS Safari (all versions)
- Desktop browsers

The utility gracefully handles unsupported browsers by detecting support and silently failing.

## Best Practices

1. **Use appropriate intensity**: Match haptic intensity to the importance of the interaction
   - Light: Regular buttons, links, cards
   - Medium: Important selections, confirmations
   - Heavy: Errors, warnings, critical alerts

2. **Don't overuse**: Too much haptic feedback can be annoying
   - Avoid haptic on every hover or minor interaction
   - Reserve for meaningful user actions

3. **Respect user preferences**: Always provide a way to disable haptic feedback
   - Check `prefers-reduced-motion` if implementing motion-sensitive haptics
   - Provide settings toggle for users

4. **Test on real devices**: Haptic feedback feels different on different devices
   - Test on various Android devices
   - Verify patterns feel appropriate

5. **Combine with other feedback**: Haptic works best with visual and audio feedback
   - Use alongside animations
   - Pair with sound effects (when enabled)

## Integration Points

The haptic feedback utility is integrated in:

1. **LevelSelector** (`components/LevelSelector.tsx`)
   - Medium haptic on level selection

2. **LevelCard** (`components/LevelCard.tsx`)
   - Light haptic on button press

3. **ChalkDustButton** (`components/ChalkDustButton.tsx`)
   - Light haptic on button press

4. **QuestionCard** (`components/QuestionCard.tsx`)
   - Light haptic on question click

5. **FriendlyErrorDisplay** (`components/FriendlyErrorDisplay.tsx`)
   - Heavy haptic pattern on error display

## Testing

The utility includes comprehensive unit tests covering:
- Support detection
- All haptic patterns
- Enable/disable functionality
- Error handling
- Convenience functions
- Multiple triggers

Run tests:
```bash
npm test -- lib/__tests__/haptic-feedback.test.ts
```

## Future Enhancements

Potential improvements:
1. Custom pattern support for advanced use cases
2. Integration with settings context for global enable/disable
3. Haptic feedback intensity customization
4. Pattern presets for common scenarios (success, warning, info)
5. Analytics tracking for haptic usage patterns

## Related

- **Sound Manager** (`lib/sound-manager.ts`): Audio feedback companion
- **Settings Context** (`contexts/SettingsContext.tsx`): User preference management
- **Design System** (`DESIGN_SYSTEM.md`): Micro-interaction guidelines
