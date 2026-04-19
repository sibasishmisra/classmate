# Sound Manager

A utility class for managing sound effects in ClassMate.info.

## Overview

The SoundManager handles:
- Preloading sound effects
- Playing sounds with volume control
- Enabling/disabling sounds globally
- Handling autoplay restrictions gracefully

## Sound Effects

The following sound effects are available:

| Sound ID | File | Volume | Category | Usage |
|----------|------|--------|----------|-------|
| `bell-soft` | `/sounds/school-bell-soft.mp3` | 0.3 | feedback | Level selection |
| `page-turn` | `/sounds/page-turn.mp3` | 0.2 | transition | Page transitions |
| `chalk-tap` | `/sounds/chalk-tap.mp3` | 0.15 | feedback | Button clicks |
| `success-chime` | `/sounds/success-chime.mp3` | 0.25 | celebration | Session completion |

## Usage

### Basic Usage

```tsx
import { soundManager, SOUND_IDS } from '@/lib/sound-manager';

// Preload sounds (call once during app initialization)
soundManager.preloadSounds();

// Play a sound
soundManager.play(SOUND_IDS.BELL_SOFT);

// Toggle sounds on/off
soundManager.toggle();

// Enable/disable sounds
soundManager.enable();
soundManager.disable();
```

### Integration with Settings Context

```tsx
import { useSettings } from '@/contexts';
import { soundManager } from '@/lib/sound-manager';
import { useEffect } from 'react';

function MyComponent() {
  const { soundEnabled } = useSettings();

  // Sync sound manager with settings
  useEffect(() => {
    if (soundEnabled) {
      soundManager.enable();
    } else {
      soundManager.disable();
    }
  }, [soundEnabled]);

  const handleClick = () => {
    soundManager.play(SOUND_IDS.CHALK_TAP);
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

### Volume Control

```tsx
// Set volume for a specific sound (0.0 to 1.0)
soundManager.setVolume(SOUND_IDS.BELL_SOFT, 0.5);

// Set master volume for all sounds (0.0 to 1.0)
soundManager.setMasterVolume(0.7);
```

### Advanced Usage

```tsx
// Stop all currently playing sounds
soundManager.stopAll();

// Check if sounds are enabled
if (soundManager.isEnabled()) {
  soundManager.play(SOUND_IDS.SUCCESS_CHIME);
}

// Clean up resources (call on unmount if needed)
soundManager.cleanup();
```

## Sound Files

Sound files should be placed in the `/public/sounds/` directory:

```
public/
  sounds/
    school-bell-soft.mp3
    page-turn.mp3
    chalk-tap.mp3
    success-chime.mp3
```

**Note**: Sound files are not included in the repository. You'll need to add appropriate sound effects that match the nostalgic school theme.

## Error Handling

The SoundManager handles errors gracefully:
- Missing sound files: Logs a warning and continues
- Autoplay restrictions: Catches and logs autoplay prevention
- Invalid sound IDs: Logs a warning and returns early

## Browser Compatibility

The SoundManager uses the HTML5 Audio API, which is supported in all modern browsers. Autoplay restrictions may apply on first page load - sounds will work after the first user interaction.

## Requirements Validated

- Requirements 6.2, 6.7

## Type Safety

The `SOUND_IDS` constant provides type-safe sound IDs:

```tsx
// TypeScript will autocomplete and validate sound IDs
soundManager.play(SOUND_IDS.BELL_SOFT); // ✓ Valid
soundManager.play('invalid-sound'); // ✗ Type error
```
