# TopicInput Component

## Overview

The `TopicInput` component provides a form interface for students to enter topics they want to learn about. It integrates the `NotebookTextarea` component with validation, error handling, and a vintage school-styled submit button.

## Features

- **Character Count Validation**: Enforces 1-500 character limit
- **Real-time Validation**: Submit button enabled/disabled based on input validity
- **Inline Error Messages**: Friendly, age-appropriate error feedback
- **Loading State**: Displays themed spinner during API calls
- **Vintage School Styling**: Submit button with nostalgic classroom aesthetic
- **Accessibility**: Full keyboard navigation and ARIA support

## Props

```typescript
interface TopicInputProps {
  onSubmit: (topic: string) => void;  // Callback when valid topic is submitted
  isLoading: boolean;                  // Shows loading state during API call
  maxLength?: number;                  // Maximum character count (default: 500)
}
```

## Usage

### Basic Usage

```tsx
import TopicInput from '@/components/TopicInput';

function MyPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (topic: string) => {
    setIsLoading(true);
    try {
      // Call API with topic
      await fetchExplanation(topic);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TopicInput 
      onSubmit={handleSubmit} 
      isLoading={isLoading} 
    />
  );
}
```

### With Custom Max Length

```tsx
<TopicInput 
  onSubmit={handleSubmit} 
  isLoading={isLoading}
  maxLength={300}
/>
```

## Validation Rules

The component validates input according to these rules:

1. **Minimum Length**: 1 character (prevents empty submissions)
2. **Maximum Length**: 500 characters (configurable via `maxLength` prop)
3. **Submit Button**: Enabled only when input is valid (1-500 characters)
4. **Error Display**: Shows friendly error message for invalid submissions

## Error Messages

- **Empty Input**: "Please enter a topic to learn about!"
- **Too Long**: "Your topic is too long. Please keep it under 500 characters."

## States

### Default State
- Empty textarea with placeholder text
- Submit button disabled
- Character counter shows "0/500"

### Valid Input State
- Textarea contains 1-500 characters
- Submit button enabled with hover effects
- Character counter updates in real-time

### Error State
- Red error message displayed below textarea
- Submit button remains disabled
- Error clears when user starts typing

### Loading State
- Textarea disabled
- Submit button shows "Learning..." with spinner
- Button disabled to prevent duplicate submissions

## Styling

The component uses the following CSS classes from the design system:

- `.submit-button`: Vintage school button styling
- `.chalk-spinner`: Themed loading spinner
- `.notebook-paper`: Integrated via NotebookTextarea
- `.error-red`: Error message color

## Accessibility

- **Keyboard Navigation**: Full support for Tab and Enter keys
- **ARIA Labels**: Proper labels for textarea and button
- **ARIA Live Regions**: Error messages announced to screen readers
- **Touch Targets**: Minimum 44x44px for mobile accessibility
- **Focus Indicators**: Visible focus states for all interactive elements

## Requirements Validated

This component validates the following requirements:

- **Requirement 2.2**: Accepts text input of 1 to 500 characters
- **Requirement 2.4**: Submit button enabled when length is 1-500 characters
- **Requirement 2.5**: Displays loading state within 50ms
- **Requirement 2.7**: Displays friendly error for empty submission

## Integration

The TopicInput component integrates with:

- **NotebookTextarea**: Provides the styled input field
- **Validation Library**: Uses `validateTopicInput` from `@/lib/validation`
- **Session Context**: Typically used within SessionProvider for state management

## Testing

The component includes comprehensive unit tests covering:

- Component rendering
- Character count validation
- Inline validation errors
- Submit button styling and states
- Loading state behavior
- Form submission
- Accessibility features
- NotebookTextarea integration

Run tests with:
```bash
npm test -- TopicInput.test.tsx
```

## Design Notes

- The submit button uses the `.submit-button` class for consistent vintage school styling
- Loading spinner uses `.chalk-spinner` for thematic consistency
- Error messages use warm, encouraging language appropriate for ages 9-14
- Component maintains nostalgic classroom aesthetic throughout all states
