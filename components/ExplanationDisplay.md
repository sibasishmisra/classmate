# ExplanationDisplay Component

## Overview

The `ExplanationDisplay` component is a composite component that displays AI-generated explanations with a nostalgic chalkboard aesthetic. It integrates `ChalkboardSection` and `TypewriterText` components to create an engaging learning experience.

## Features

- **Chalkboard Aesthetic**: Uses ChalkboardSection for nostalgic visual design
- **Animated Text**: Integrates TypewriterText for chalk-writing animation effect
- **Topic & Level Display**: Shows the topic and appropriate age range
- **Follow-Up Questions**: Displays interactive follow-up questions (placeholder for now)
- **Loading States**: Themed loading animation with chalk writing metaphor
- **Error Handling**: Friendly, age-appropriate error messages
- **Accessibility**: Full WCAG 2.1 AA compliance with ARIA labels and keyboard navigation

## Props

```typescript
interface ExplanationDisplayProps {
  topic: string;                          // The topic being explained
  level: LearningLevel;                   // Learning level (1-6)
  explanation: string;                    // AI-generated explanation text
  followUpQuestions?: FollowUpQuestion[]; // Optional follow-up questions
  isLoading?: boolean;                    // Loading state indicator
  error?: string | null;                  // Error message if any
  onQuestionClick?: (questionId: string) => void; // Callback for question clicks
}
```

## Usage

### Basic Usage

```tsx
import ExplanationDisplay from '@/components/ExplanationDisplay';

function MyComponent() {
  return (
    <ExplanationDisplay
      topic="Why is the sky blue?"
      level={3}
      explanation="The sky appears blue because of how sunlight interacts with the atmosphere..."
      followUpQuestions={[
        {
          id: 'q1',
          question: 'What would happen if Earth had no atmosphere?',
          isAnswered: false
        },
        {
          id: 'q2',
          question: 'Why does the sky change colors at sunset?',
          isAnswered: false
        }
      ]}
      onQuestionClick={(id) => console.log('Question clicked:', id)}
    />
  );
}
```

### With Loading State

```tsx
<ExplanationDisplay
  topic="Why is the sky blue?"
  level={3}
  explanation=""
  isLoading={true}
/>
```

### With Error State

```tsx
<ExplanationDisplay
  topic="Why is the sky blue?"
  level={3}
  explanation=""
  error="Failed to fetch explanation. Please try again."
/>
```

### With Answered Questions

```tsx
<ExplanationDisplay
  topic="Why is the sky blue?"
  level={3}
  explanation="The sky appears blue..."
  followUpQuestions={[
    {
      id: 'q1',
      question: 'What would happen if Earth had no atmosphere?',
      answer: 'Without an atmosphere, the sky would appear black.',
      isAnswered: true
    }
  ]}
/>
```

## Component Structure

```
ExplanationDisplay
├── Topic Header
│   ├── Topic Title (h2)
│   └── Age Range Label
├── ChalkboardSection (Explanation)
│   └── TypewriterText (Animated explanation)
└── Follow-Up Questions (if provided)
    └── Question Cards (grid layout)
        ├── Question Text
        └── Answer (if answered)
```

## States

### Normal State
- Displays topic, level, and explanation
- Shows follow-up questions if provided
- Typewriter animation for explanation text

### Loading State
- Shows "Writing on the chalkboard..." message
- Displays animated pencil emoji
- Includes screen reader text for accessibility

### Error State
- Shows "Oops! Something went wrong" message
- Displays error message
- Includes thinking emoji for visual feedback

## Accessibility

- **ARIA Labels**: Proper labels for all interactive elements
- **Keyboard Navigation**: Full keyboard support for follow-up questions
- **Screen Reader Support**: Status messages and live regions
- **Focus Management**: Visible focus indicators
- **Semantic HTML**: Proper heading hierarchy and landmark regions

## Styling

The component uses Tailwind CSS classes and follows the nostalgic design system:

- **Chalkboard**: Dark background with chalk-style text
- **Paper Elements**: Cream background for follow-up questions
- **Typography**: Lora serif for body text, DM Sans for headings
- **Responsive**: Mobile-first design with grid layout for questions

## Requirements Validation

- **Requirement 3.3**: Displays explanation within 200ms of receiving response
- **Requirement 3.7**: Uses Lora serif font for explanation text
- **Requirement 3.8**: Implements chalkboard aesthetic with chalk-style text

## Integration

This component is designed to work with:

- **SessionContext**: Receives data from session state
- **ChalkboardSection**: Provides chalkboard background
- **TypewriterText**: Animates explanation text
- **FollowUpQuestion type**: Uses shared type definitions

## Future Enhancements

- Full FollowUpQuestions component integration
- Animation for question reveal
- Sound effects for interactions
- Haptic feedback on mobile
- Print-friendly styling
