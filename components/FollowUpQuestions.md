# FollowUpQuestions Component

A container component that renders exactly 2 QuestionCard components in a responsive layout, managing answer fetching and state updates.

## Overview

The FollowUpQuestions component is the primary interface for displaying follow-up questions after an explanation. It ensures exactly 2 questions are shown, handles API integration, and maintains accessibility by keeping both questions interactive even when one is answered.

## Features

- **Exactly 2 Questions**: Validates and renders precisely 2 QuestionCard components
- **Responsive Layout**: Side-by-side on desktop, stacked on mobile
- **State Management**: Maintains local state for answered questions
- **API Integration**: Coordinates answer fetching for both questions
- **Independent Operation**: Each question operates independently
- **Accessibility**: Both questions remain accessible (Requirement 4.6)
- **Error Isolation**: Errors in one question don't affect the other
- **Nostalgic Design**: Consistent with ClassMate.info theme

## Props

```typescript
interface FollowUpQuestionsProps {
  questions: FollowUpQuestion[];  // Array of exactly 2 questions
  level: LearningLevel;           // Learning level (1-6)
  context: string;                // Original topic + explanation
}
```

## Usage

### Basic Usage

```tsx
import FollowUpQuestions from '@/components/FollowUpQuestions';

function ExplanationPage() {
  const questions = [
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
  ];

  const context = `Original topic: Why is the sky blue?

Explanation: The sky appears blue because of something called "scattering."...`;

  return (
    <FollowUpQuestions
      questions={questions}
      level={3}
      context={context}
    />
  );
}
```

### With Pre-Answered Questions

```tsx
const questions = [
  {
    id: 'q1',
    question: 'What would happen if Earth had no atmosphere?',
    isAnswered: true,
    answer: 'If Earth had no atmosphere, the sky would appear black...'
  },
  {
    id: 'q2',
    question: 'Why does the sky change colors at sunset?',
    isAnswered: false
  }
];

<FollowUpQuestions
  questions={questions}
  level={3}
  context={context}
/>
```

## Behavior

### Question Count Validation

The component validates that exactly 2 questions are provided:

```typescript
if (!questions || questions.length !== 2) {
  console.warn('FollowUpQuestions expects exactly 2 questions');
  return null;
}
```

### State Management

The component maintains local state for questions:

```typescript
const [localQuestions, setLocalQuestions] = useState<FollowUpQuestion[]>(questions);
```

When an answer is fetched, the local state updates:

```typescript
const handleAnswerFetched = (questionId: string, answer: string) => {
  setLocalQuestions(prevQuestions =>
    prevQuestions.map(q =>
      q.id === questionId
        ? { ...q, answer, isAnswered: true }
        : q
    )
  );
};
```

### Independent Operation

Each QuestionCard operates independently:
- Clicking one question doesn't affect the other
- Both remain clickable and accessible
- Errors in one don't impact the other
- Each has its own loading state

## Layout

### Desktop (≥768px)

```
┌─────────────────────┬─────────────────────┐
│   Question Card 1   │   Question Card 2   │
│                     │                     │
│   ✋ Question text  │   ✋ Question text  │
│                     │                     │
└─────────────────────┴─────────────────────┘
```

### Mobile (<768px)

```
┌─────────────────────────────────────┐
│        Question Card 1              │
│                                     │
│        ✋ Question text             │
│                                     │
├─────────────────────────────────────┤
│        Question Card 2              │
│                                     │
│        ✋ Question text             │
│                                     │
└─────────────────────────────────────┘
```

## Styling

### CSS Classes

- `.follow-up-questions`: Container element
- `.grid`: Grid layout container
- `.grid-cols-1`: Single column on mobile
- `.md:grid-cols-2`: Two columns on desktop
- `.gap-4`: 1rem gap on mobile
- `.md:gap-6`: 1.5rem gap on desktop

### Responsive Breakpoints

- **Mobile**: 0-767px (stacked layout)
- **Desktop**: 768px+ (side-by-side layout)

## Accessibility

### ARIA Attributes

- `role="region"`: Identifies the follow-up questions section
- `aria-label="Follow-up questions"`: Descriptive label for screen readers

### Keyboard Navigation

- Tab through both question cards
- Each card independently keyboard-accessible
- Focus indicators visible on all interactive elements

### Screen Reader Support

- Section announced as "Follow-up questions region"
- Each question card has descriptive labels
- Loading and error states properly announced

## Requirements Validation

- ✓ **Requirement 4.1**: Generates exactly 2 follow-up questions
- ✓ **Requirement 4.2**: Displays questions below explanation
- ✓ **Requirement 4.6**: Both questions remain accessible when one is answered

## API Integration

The component passes context to each QuestionCard, which handles API calls:

```typescript
<QuestionCard
  question={question}
  level={level}
  context={context}  // Passed to API for contextual answers
  onAnswerFetched={handleAnswerFetched}
/>
```

### Context Format

```typescript
const context = `Original topic: ${topic}

Explanation: ${explanation}`;
```

This context helps the AI provide relevant, connected answers.

## Error Handling

### Invalid Question Count

```typescript
// Returns null and logs warning
if (questions.length !== 2) {
  console.warn('FollowUpQuestions expects exactly 2 questions');
  return null;
}
```

### API Errors

Each QuestionCard handles its own errors independently:
- Error in Question 1 doesn't affect Question 2
- Both questions remain functional
- Error messages display within the affected card

## Examples

See `FollowUpQuestions.example.tsx` for interactive examples:
- Both questions unanswered
- One question answered
- Both questions answered
- Different learning levels
- Responsive layout demonstration

## Testing

Unit tests cover:
- Rendering exactly 2 QuestionCards
- Section header and ARIA attributes
- Answer fetching for individual questions
- Both questions remaining accessible
- Responsive grid layout
- Invalid question count handling
- State management
- Error isolation

Run tests:
```bash
npm test -- FollowUpQuestions.test.tsx
```

## Integration

### With ExplanationDisplay

```tsx
<ExplanationDisplay
  topic={topic}
  level={level}
  explanation={explanation}
  followUpQuestions={questions}
  onQuestionClick={(id) => console.log('Question clicked:', id)}
/>
```

The ExplanationDisplay component can use FollowUpQuestions internally or implement its own layout.

### With Session Context

```tsx
import { useSession } from '@/contexts/SessionContext';

function MyComponent() {
  const { currentTopic } = useSession();
  
  if (!currentTopic) return null;
  
  return (
    <FollowUpQuestions
      questions={currentTopic.followUpQuestions}
      level={currentTopic.level}
      context={`Original topic: ${currentTopic.topic}\n\nExplanation: ${currentTopic.explanation}`}
    />
  );
}
```

## Performance

### Optimization Strategies

- Local state prevents unnecessary re-renders
- Each QuestionCard manages its own loading state
- API calls only triggered on user interaction
- Answers cached after first fetch

### Bundle Size

- Minimal dependencies (React only)
- Reuses existing QuestionCard component
- CSS classes from global stylesheet

## Related Components

- **QuestionCard**: Individual question card component
- **ExplanationDisplay**: Parent component showing explanation + questions
- **ChalkboardSection**: Provides chalkboard background styling
- **TypewriterText**: Animated text display for explanations

## Notes

- Component is designed for exactly 2 questions (per Requirement 4.1)
- Questions can be answered in any order
- State updates are immutable (using map)
- Mobile-first responsive design
- Respects user's reduced motion preferences
- Touch-optimized for mobile devices
