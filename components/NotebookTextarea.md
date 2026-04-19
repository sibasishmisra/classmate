# NotebookTextarea Component

## Overview

The `NotebookTextarea` component is a themed textarea input that evokes the nostalgic feeling of writing on notebook paper. It features ruled lines, a red margin line, handwriting-style placeholder text, and a real-time character counter.

## Features

- **Notebook Paper Aesthetic**: Background with ruled lines and red margin line
- **Character Counter**: Real-time counter showing current/max characters (e.g., "0/500")
- **Visual Feedback**: Warning color when approaching character limit (>90%)
- **Auto-resize**: Textarea height adjusts automatically based on content
- **Accessibility**: Proper ARIA labels and keyboard navigation support
- **Handwriting-style Placeholder**: Italic font for placeholder text

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | Required | Current value of the textarea |
| `onChange` | `(value: string) => void` | Required | Callback when value changes |
| `maxLength` | `number` | `500` | Maximum character limit |
| `placeholder` | `string` | `"What would you like to learn about today?"` | Placeholder text |
| `disabled` | `boolean` | `false` | Whether the textarea is disabled |

## Usage

### Basic Usage

```tsx
import NotebookTextarea from '@/components/NotebookTextarea';

function MyComponent() {
  const [topic, setTopic] = useState('');

  return (
    <NotebookTextarea
      value={topic}
      onChange={setTopic}
    />
  );
}
```

### Custom Configuration

```tsx
<NotebookTextarea
  value={text}
  onChange={setText}
  maxLength={200}
  placeholder="Enter your question here..."
  disabled={isLoading}
/>
```

## Styling

The component uses the following CSS classes from the global design system:

- `.notebook-paper` - Applies notebook paper background with ruled lines and margin
- `.font-body` - Lora serif font for body text
- `.font-ui` - DM Sans font for UI elements (character counter)
- `.text-ink-black` - Ink black color for text
- `.text-chalk-gray` - Gray color for placeholder and counter
- `.text-warning-yellow` - Warning color when near character limit

## Accessibility

- **ARIA Labels**: Textarea has `aria-label="Enter your topic"`
- **ARIA Described By**: Character counter is linked via `aria-describedby`
- **Live Region**: Character counter uses `aria-live="polite"` for screen reader updates
- **Keyboard Navigation**: Full keyboard support for textarea interaction
- **Focus Indicators**: Visual feedback when textarea is focused

## Visual Design

### Notebook Paper Background

The component inherits the `.notebook-paper` class styling which includes:
- Paper cream background color (#faf8f3)
- Horizontal ruled lines (repeating every 32px)
- Red vertical margin line at 60px from left
- Left padding of 70px to accommodate margin area

### Character Counter

- Positioned in bottom-right corner
- Shows format: `{current}/{max}`
- Changes to warning yellow when >90% of limit
- Font weight increases when near limit

### Focus State

- Adds subtle shadow effect when focused
- Smooth transition animation (200ms)

## Requirements Validated

This component validates the following requirements:

- **Requirement 2.1**: Topic input field display
- **Requirement 2.3**: Visual feedback for active field
- **Requirement 2.6**: Nostalgic elements (notebook paper texture, handwriting placeholder)
- **Requirement 5.3**: Notebook paper aesthetics in content areas

## Testing

The component includes comprehensive unit tests covering:
- Rendering with default and custom props
- Character counter display and updates
- Input validation and maxLength enforcement
- Focus state management
- Accessibility features
- Styling classes

Run tests with:
```bash
npm test -- NotebookTextarea.test.tsx
```

## Example Integration

```tsx
import { useState } from 'react';
import NotebookTextarea from '@/components/NotebookTextarea';

export default function TopicInput() {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (topic.length === 0 || topic.length > 500) return;
    
    setIsLoading(true);
    // Submit topic...
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <NotebookTextarea
        value={topic}
        onChange={setTopic}
        disabled={isLoading}
      />
      
      <button
        onClick={handleSubmit}
        disabled={topic.length === 0 || topic.length > 500 || isLoading}
        className="submit-button mt-4"
      >
        Submit Topic
      </button>
    </div>
  );
}
```

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Graceful degradation for older browsers
- Respects `prefers-reduced-motion` for animations
