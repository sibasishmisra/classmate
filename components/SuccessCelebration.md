# SuccessCelebration Component

## Overview

The `SuccessCelebration` component displays a confetti-style celebration animation with school-themed elements when students complete viewing both follow-up questions. It provides positive reinforcement and encouragement for learning engagement.

## Props

```typescript
interface SuccessCelebrationProps {
  /** Whether to trigger the celebration animation */
  trigger: boolean;
  /** Callback when animation completes */
  onComplete?: () => void;
}
```

## Features

- **School-themed confetti**: Uses emojis (⭐📚✏️🎓) that evoke nostalgic school memories
- **Automatic animation**: Runs for 2 seconds with fade-out effect
- **Sound effect**: Plays optional success-chime sound (respects user settings)
- **Accessibility**: Respects `prefers-reduced-motion` user preference
- **Non-blocking**: Uses `pointer-events-none` to not interfere with user interactions
- **Layering**: Appears above all content with `z-50`

## Usage

### Basic Usage

```tsx
import SuccessCelebration from '@/components/SuccessCelebration';

function MyComponent() {
  const [celebrate, setCelebrate] = useState(false);

  const handleBothQuestionsAnswered = () => {
    setCelebrate(true);
  };

  return (
    <div>
      {/* Your content */}
      <SuccessCelebration 
        trigger={celebrate}
        onComplete={() => console.log('Celebration complete!')}
      />
    </div>
  );
}
```

### Integration with FollowUpQuestions

The component is automatically integrated into the `FollowUpQuestions` component and triggers when both follow-up questions have been answered:

```tsx
// In FollowUpQuestions.tsx
const [triggerCelebration, setTriggerCelebration] = useState(false);

useEffect(() => {
  const bothAnswered = localQuestions.every(q => q.isAnswered);
  if (bothAnswered && !triggerCelebration) {
    setTriggerCelebration(true);
  }
}, [localQuestions, triggerCelebration]);

return (
  <div>
    {/* Question cards */}
    <SuccessCelebration trigger={triggerCelebration} />
  </div>
);
```

## Animation Details

### Confetti Elements

- **Count**: 20 confetti pieces
- **Emojis**: ⭐ (star), 📚 (books), ✏️ (pencil), 🎓 (graduation cap)
- **Movement**: Falls from top with random horizontal drift
- **Rotation**: Each element rotates at different speeds
- **Scale**: Random sizes between 0.5x and 1.0x
- **Duration**: 2 seconds with fade-out

### Physics

```typescript
{
  x: Math.random() * 100,           // Random horizontal position (%)
  y: -10,                            // Start above viewport
  vx: (Math.random() - 0.5) * 2,    // Horizontal velocity
  vy: Math.random() * 2 + 1,        // Vertical velocity (downward)
  rotation: Math.random() * 360,     // Initial rotation
  rotationSpeed: (Math.random() - 0.5) * 10  // Rotation speed
}
```

## Accessibility

### Reduced Motion Support

The component automatically detects and respects the `prefers-reduced-motion` user preference:

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Animation is not rendered
  return null;
}
```

### ARIA Attributes

```html
<div
  aria-live="polite"
  aria-label="Celebration animation"
  data-testid="success-celebration"
>
  <!-- Confetti elements with aria-hidden="true" -->
</div>
```

## Sound Integration

The component plays the success-chime sound when triggered:

```typescript
import { soundManager, SOUND_IDS } from '@/lib/sound-manager';

// In useEffect when trigger is true
soundManager.play(SOUND_IDS.SUCCESS_CHIME);
```

The sound respects the user's sound settings and handles autoplay restrictions gracefully.

## Styling

### CSS Classes

- `fixed inset-0`: Full-screen overlay
- `pointer-events-none`: Doesn't block interactions
- `z-50`: Appears above other content
- `text-3xl`: Large emoji size

### Inline Styles

Each confetti element uses inline styles for animation:

```typescript
style={{
  left: `${el.x}%`,
  top: `${el.y}%`,
  transform: `rotate(${el.rotation}deg) scale(${el.scale})`,
  opacity: el.opacity,
  transition: 'none'  // Smooth animation via requestAnimationFrame
}}
```

## Performance

- Uses `requestAnimationFrame` for smooth 60fps animation
- Cleans up animation frame on unmount
- Minimal DOM elements (20 confetti pieces)
- No heavy computations during animation

## Testing

### Unit Tests

```typescript
// Test that celebration triggers
it('should render celebration elements when triggered', () => {
  render(<SuccessCelebration trigger={true} />);
  expect(screen.getByTestId('success-celebration')).toBeInTheDocument();
});

// Test reduced motion
it('should not render when prefers-reduced-motion is enabled', () => {
  mockMatchMedia(true);
  render(<SuccessCelebration trigger={true} />);
  expect(screen.queryByTestId('success-celebration')).not.toBeInTheDocument();
});

// Test sound
it('should play success chime sound when triggered', () => {
  render(<SuccessCelebration trigger={true} />);
  expect(soundManager.play).toHaveBeenCalledWith('success-chime');
});
```

## Requirements Validated

- **Requirement 6.1**: "WHEN a Student completes a Session, THE ClassMate_App SHALL display a subtle encouraging animation"

## Browser Compatibility

- Modern browsers with `requestAnimationFrame` support
- Gracefully degrades if animation APIs are unavailable
- Respects user preferences via `matchMedia`

## Future Enhancements

Potential improvements for future versions:

1. **Customizable duration**: Allow passing animation duration as prop
2. **Custom emojis**: Allow passing custom emoji set
3. **Intensity levels**: Different celebration intensities (subtle, medium, enthusiastic)
4. **Haptic feedback**: Add mobile haptic feedback on celebration
5. **Particle trails**: Add motion trails to confetti elements
