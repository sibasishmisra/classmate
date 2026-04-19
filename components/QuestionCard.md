# QuestionCard Component

A nostalgic, interactive card component that displays a single follow-up question with accordion-style expansion for answers.

## Overview

The QuestionCard component is part of the ClassMate.info learning experience, providing students with interactive follow-up questions after receiving an explanation. It features nostalgic school-themed styling with a raised hand icon (✋), hover effects, and smooth accordion animations.

## Features

- **Raised Hand Icon**: Displays ✋ emoji that rotates when expanded
- **Hover Effects**: Subtle rotation and scale transformations on hover
- **API Integration**: Fetches answers from `/api/answer` endpoint
- **Accordion Expansion**: Smooth animation for showing/hiding answers
- **Loading States**: Shows "Thinking..." with animated pencil during API calls
- **Error Handling**: Displays friendly error messages
- **Keyboard Navigation**: Full support for Enter and Space keys
- **Accessibility**: Proper ARIA attributes and focus management
- **Nostalgic Styling**: Chalk-style elements and paper textures

## Props

```typescript
interface QuestionCardProps {
  question: FollowUpQuestion;      // The question object
  level: LearningLevel;            // Learning level (1-6)
  context: string;                 // Original topic + explanation
  onAnswerFetched?: (              // Callback when answer is fetched
    questionId: string,
    answer: string
  ) => void;
}
```

### FollowUpQuestion Type

```typescript
interface FollowUpQuestion {
  id: string;           // Unique identifier
  question: string;     // Question text
  answer?: string;      // Answer text (if answered)
  isAnswered: boolean;  // Whether question has been answered
}
```

## Usage

### Basic Usage

```tsx
import QuestionCard from '@/components/QuestionCard';

function MyComponent() {
  const question = {
    id: 'q1',
    question: 'What would happen if Earth had no atmosphere?',
    isAnswered: false
  };

  const context = 'Original topic: Why is the sky blue?\n\nExplanation: ...';

  return (
    <QuestionCard
      question={question}
      level={3}
      context={context}
    />
  );
}
```

### With Answer Callback

```tsx
const handleAnswerFetched = (questionId: string, answer: string) => {
  console.log(`Answer for ${questionId}:`, answer);
  // Update parent state, analytics, etc.
};

<QuestionCard
  question={question}
  level={3}
  context={context}
  onAnswerFetched={handleAnswerFetched}
/>
```

### Pre-Answered Question

```tsx
const answeredQuestion = {
  id: 'q2',
  question: 'Why does the sky change colors at sunset?',
  isAnswered: true,
  answer: 'At sunset, sunlight travels through more atmosphere...'
};

<QuestionCard
  question={answeredQuestion}
  level={3}
  context={context}
/>
```

## Behavior

### Unanswered Questions

1. User clicks the card
2. Component shows loading state ("Thinking...")
3. API call to `/api/answer` with question, context, and level
4. On success: Answer displays with fade-in animation
5. On error: Friendly error message displays

### Answered Questions

1. User clicks the card
2. Answer toggles visibility (expand/collapse)
3. No API call (answer already cached)

### Keyboard Navigation

- **Tab**: Focus on the card
- **Enter**: Fetch answer or toggle expansion
- **Space**: Fetch answer or toggle expansion

## Styling

### CSS Classes

- `.question-card`: Base card styling
- `.question-card.expanded`: Applied when answer is visible
- `.animate-fade-in`: Fade-in animation for answer

### Hover Effects

- Card lifts slightly (`translateY(-2px)`)
- Subtle rotation (`rotate(0.5deg)`)
- Blue accent bar appears on left edge
- Border color changes to accent blue

### Hand Icon Animation

- Default: `rotate(0deg)`
- Expanded: `rotate(15deg)`
- Smooth transition: `duration-200`

## API Integration

### Request Format

```typescript
POST /api/answer
Content-Type: application/json

{
  "question": "What would happen if Earth had no atmosphere?",
  "context": "Original topic: Why is the sky blue?\n\nExplanation: ...",
  "level": 3
}
```

### Response Format

```typescript
{
  "answer": "If Earth had no atmosphere, the sky would appear black..."
}
```

### Error Handling

The component handles various error scenarios:

- **Network errors**: "Can't reach the classroom right now"
- **API errors**: Displays error message from API response
- **Timeout**: "The answer is taking too long"

## Accessibility

### ARIA Attributes

- `role="button"`: Indicates interactive element
- `aria-expanded`: Reflects expansion state
- `aria-label`: Descriptive label for screen readers
- `tabIndex={0}`: Keyboard focusable

### Screen Reader Support

- Loading state announced with `role="status"` and `aria-live="polite"`
- Error state announced with `role="alert"` and `aria-live="assertive"`
- Answer region labeled with `role="region"` and `aria-label="Answer"`

### Keyboard Support

Full keyboard navigation support for users who cannot use a mouse.

## Requirements Validation

- ✓ **Requirement 4.2**: Displays follow-up questions with interactive elements
- ✓ **Requirement 4.5**: Presents questions with nostalgic elements (raised hand icon, chalk style)

## Examples

See `QuestionCard.example.tsx` for interactive examples including:
- Unanswered questions
- Answered questions
- Different learning levels
- Side-by-side layouts
- Error states

## Testing

Unit tests cover:
- Rendering with correct text and icon
- ARIA attributes
- API integration
- Accordion expansion/collapse
- Error handling
- Keyboard navigation
- Loading states
- Icon rotation animation

Run tests:
```bash
npm test -- QuestionCard.test.tsx
```

## Related Components

- **FollowUpQuestions**: Container component that renders 2 QuestionCards
- **ExplanationDisplay**: Parent component that includes follow-up questions
- **ChalkboardSection**: Provides chalkboard background styling

## Notes

- Component prevents multiple simultaneous API calls while loading
- Answer is cached in local state after first fetch
- Respects `prefers-reduced-motion` for animations
- Mobile-optimized touch targets (44x44px minimum)
