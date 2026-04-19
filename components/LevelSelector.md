# LevelSelector Component

## Overview

The `LevelSelector` component allows students to choose their learning level (ages 9-14) in the ClassMate.info application. It renders 6 `LevelCard` components in a responsive grid layout and integrates with the SoundManager for optional audio feedback.

## Props

```typescript
interface LevelSelectorProps {
  onLevelSelect: (level: LearningLevel) => void;
  selectedLevel?: LearningLevel;
}
```

- `onLevelSelect`: Callback function invoked when a level is selected, receives the selected level (1-6)
- `selectedLevel`: Optional currently selected level to highlight the active card

## Features

- **6 Learning Levels**: Renders cards for ages 9-14 (Levels 1-6)
- **Responsive Grid**: 2 columns on mobile, 3 columns on desktop
- **Audio Feedback**: Plays optional school bell sound on selection
- **Selected State**: Highlights the currently selected level
- **Accessibility**: Passes through accessibility features from LevelCard

## Usage

```tsx
import LevelSelector from '@/components/LevelSelector';
import { useState } from 'react';
import type { LearningLevel } from '@/types';

function MyComponent() {
  const [level, setLevel] = useState<LearningLevel | undefined>();

  return (
    <LevelSelector
      onLevelSelect={setLevel}
      selectedLevel={level}
    />
  );
}
```

## Layout

### Mobile (< 768px)
- 2 columns
- 3 rows
- Stacked vertically

### Desktop (≥ 768px)
- 3 columns
- 2 rows
- Horizontal layout

## Integration

### Sound Manager
The component integrates with the `SoundManager` utility to play a soft school bell sound when a level is selected. The sound can be disabled through the app's settings.

### LevelCard Component
Each level is rendered using the `LevelCard` component, which handles:
- Visual design (chalkboard aesthetic)
- Hover effects (chalk dust particles)
- Selected state styling
- Accessibility features

## Requirements Validation

This component validates the following requirements:
- **1.1**: Displays six Learning_Level options (ages 9-14)
- **1.2**: Stores level selection via callback
- **1.5**: Provides visual feedback on interaction
- **6.2**: Plays optional school bell sound on selection

## Testing

Unit tests cover:
- Rendering all 6 level cards with correct age ranges
- Callback invocation on level selection
- Sound playback on selection
- Selected state management
- Responsive grid layout
- Multiple selections handling

Run tests:
```bash
npm test -- LevelSelector.test.tsx
```

## Styling

The component uses Tailwind CSS classes for responsive layout:
- `grid grid-cols-2 md:grid-cols-3`: Responsive grid
- `gap-4 md:gap-6`: Responsive spacing
- `max-w-4xl mx-auto`: Centered container with max width

## Dependencies

- `LevelCard`: Child component for individual level cards
- `soundManager`: Audio playback utility
- `@/types`: TypeScript type definitions
