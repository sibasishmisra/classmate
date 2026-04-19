# ChalkDustCanvas Component

Canvas overlay component for rendering chalk dust particle effects with nostalgic school theme.

## Overview

The ChalkDustCanvas component provides a canvas-based particle animation system that creates whimsical chalk dust effects on user interactions. It's designed to enhance the nostalgic school experience while respecting user preferences for reduced motion.

## Features

- ✅ Canvas-based particle rendering for smooth 60fps animations
- ✅ Automatic particle lifecycle management
- ✅ Respects `prefers-reduced-motion` user preference
- ✅ Responsive particle count (8 on desktop, 4 on mobile)
- ✅ Physics-based particle movement with gravity
- ✅ Automatic cleanup when particles fade out

## Usage

### Basic Usage with Hook

```tsx
import { useChalkDust } from '@/lib/hooks/useChalkDust';

function MyComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { canvasRef, triggerChalkDust } = useChalkDust();

  const handleClick = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      triggerChalkDust(x, y);
    }
  };

  return (
    <div ref={containerRef} onClick={handleClick} className="relative">
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <div>Your content here</div>
    </div>
  );
}
```

### Using ChalkDustButton

```tsx
import ChalkDustButton from '@/components/ChalkDustButton';

function MyForm() {
  return (
    <ChalkDustButton
      className="submit-button"
      onClick={() => console.log('Clicked!')}
    >
      Submit
    </ChalkDustButton>
  );
}
```

### Custom Particle Options

```tsx
const { triggerChalkDust } = useChalkDust();

// Trigger with custom options
triggerChalkDust(x, y, {
  particleCount: 12,
  minSize: 2,
  maxSize: 4,
  velocityRange: 3,
});
```

## API

### useChalkDust Hook

Returns an object with:

- `canvasRef`: React ref to attach to a canvas element
- `triggerChalkDust(x, y, options?)`: Function to create particles at position

#### Options

```typescript
interface ChalkDustOptions {
  particleCount?: number;  // Default: 8 (desktop) or 4 (mobile)
  color?: string;          // Default: '#f5f5dc' (chalk white)
  minSize?: number;        // Default: 1
  maxSize?: number;        // Default: 3
  velocityRange?: number;  // Default: 2
}
```

### ChalkDustButton Component

Props extend standard HTML button attributes:

```typescript
interface ChalkDustButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}
```

## Implementation Details

### Particle Physics

Each particle has:
- Position (x, y)
- Velocity (vx, vy)
- Life (0-1, decreases over time)
- Size (random within range)

Particles are affected by:
- Initial random velocity
- Gravity (0.1 units per frame)
- Life decay (based on deltaTime)

### Performance

- Uses `requestAnimationFrame` for smooth 60fps animation
- Automatically stops animation when no particles remain
- Canvas is only updated when particles are active
- Particles are removed from memory when life reaches 0

### Accessibility

- Canvas has `aria-hidden="true"` (decorative only)
- Respects `prefers-reduced-motion` media query
- No particles created when reduced motion is preferred
- Does not interfere with keyboard navigation or screen readers

## Requirements Validation

- **Requirement 6.3**: Smooth transition effects within 50ms on hover
- **Requirement 10.7**: Animations respect prefers-reduced-motion user preferences

## Browser Support

Works in all modern browsers that support:
- HTML5 Canvas
- requestAnimationFrame
- CSS custom properties

## Examples

See the test page at `/chalk-dust-test` for interactive demonstrations.

## Related Components

- `LevelCard` - Uses chalk dust on hover and click
- `ChalkDustButton` - Button with built-in chalk dust effect
- `QuestionCard` - Uses chalk dust on click
