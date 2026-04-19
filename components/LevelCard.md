# LevelCard Component

A nostalgic, chalkboard-themed card component for selecting learning levels in the ClassMate.info application.

## Features

- **Chalkboard Aesthetic**: Dark background with chalk-style text rendering
- **Interactive Hover Effects**: Subtle lift animation and chalk dust particles
- **Selected State**: Gold border (#f59e0b) to indicate active selection
- **Accessibility**: 
  - Minimum 44x44px touch target for mobile
  - Proper ARIA labels and attributes
  - Keyboard navigation support
  - Respects `prefers-reduced-motion` preference
- **Responsive**: Works seamlessly on mobile and desktop

## Props

```typescript
interface LevelCardProps {
  level: LearningLevel;        // 1-6, representing the learning level
  ageRange: string;            // Age range display (e.g., "9-10", "14+")
  selected?: boolean;          // Whether this card is currently selected
  onClick: (level: LearningLevel) => void;  // Callback when card is clicked
}

type LearningLevel = 1 | 2 | 3 | 4 | 5 | 6;
```

## Usage

```tsx
import LevelCard from '@/components/LevelCard';
import type { LearningLevel } from '@/types';

function LevelSelector() {
  const [selectedLevel, setSelectedLevel] = useState<LearningLevel | null>(null);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <LevelCard
        level={1}
        ageRange="9-10"
        selected={selectedLevel === 1}
        onClick={setSelectedLevel}
      />
      <LevelCard
        level={2}
        ageRange="10-11"
        selected={selectedLevel === 2}
        onClick={setSelectedLevel}
      />
      {/* ... more levels */}
    </div>
  );
}
```

## Design Specifications

### Visual Design
- **Background**: Chalkboard black (#1a1a1a) with texture overlay
- **Text Color**: Chalk white (#f5f5dc) with subtle text shadow
- **Border**: 2px solid chalk gray (#9ca3af)
- **Border Radius**: 0.75rem (12px)
- **Padding**: 1.5rem (24px)

### Hover Effects
- **Transform**: `translateY(-4px)` - subtle lift
- **Shadow**: Chalk-style glow (`0 2px 8px rgba(245, 245, 220, 0.2)`)
- **Border**: Changes to chalk white
- **Particles**: 6 chalk dust particles animate outward

### Selected State
- **Border**: Gold (#f59e0b) with 3px box-shadow
- **Background**: Gradient from #1a1a1a to #2d2d2d

### Animations
- **Transition**: All properties animate over 0.2s with ease timing
- **Particles**: Float away over 0.8s with fade-out
- **Reduced Motion**: Animations disabled when user prefers reduced motion

## Accessibility

The component follows WCAG 2.1 Level AA guidelines:

- **Touch Target**: Minimum 44x44px for mobile devices
- **ARIA Labels**: Descriptive labels for screen readers
- **ARIA Pressed**: Indicates selected state
- **Keyboard Navigation**: Fully keyboard accessible
- **Focus Indicators**: Visible focus states
- **Motion Preferences**: Respects `prefers-reduced-motion`

## Requirements Validation

This component validates the following requirements from the ClassMate.info spec:

- **Requirement 1.1**: Display six Learning_Level options (ages 9-14)
- **Requirement 1.4**: Display Nostalgic_Elements in the interface
- **Requirement 1.5**: Provide visual feedback within 50ms on hover
- **Requirement 7.5**: Ensure 44x44px minimum touch target on mobile

## Testing

The component includes comprehensive unit tests covering:
- Display requirements (age range, level number, styling)
- Selected state styling (classes, gold border)
- Interaction requirements (onClick, hover effects, particles)
- Accessibility requirements (touch targets, ARIA, keyboard)
- Requirements validation

Run tests with:
```bash
npm test -- LevelCard.test.tsx
```

## Dependencies

- React 19+
- TypeScript
- Tailwind CSS (for utility classes)
- Custom CSS (defined in `app/globals.css`)

## Related Components

- `LevelSelector`: Parent component that manages multiple LevelCards
- `SessionContext`: Provides level selection state management

## Notes

- The component uses client-side rendering (`'use client'`) for interactive features
- Chalk dust particles are created dynamically on hover and click
- The component checks for `window.matchMedia` to respect motion preferences
- All animations are CSS-based for optimal performance
