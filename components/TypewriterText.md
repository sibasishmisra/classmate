# TypewriterText Component

A React component that displays text with a typewriter animation effect, simulating chalk writing on a chalkboard. The component respects accessibility preferences and provides a skip functionality.

## Features

- **Character-by-character animation**: Text appears one character at a time at 30ms intervals
- **Skip animation**: Click anywhere on the text to instantly display the full content
- **Reduced motion support**: Automatically displays full text instantly when `prefers-reduced-motion` is enabled
- **Chalk text styling**: Applies cream color (#f5f5dc) with text shadow for authentic chalkboard appearance
- **Lora serif font**: Uses the Lora font family for body text readability
- **Accessibility**: Includes proper ARIA attributes and semantic HTML

## Usage

```tsx
import TypewriterText from '@/components/TypewriterText';

function ExplanationDisplay() {
  const handleComplete = () => {
    console.log('Animation completed!');
  };

  return (
    <div className="chalkboard p-8">
      <TypewriterText
        text="The sky appears blue because of a phenomenon called Rayleigh scattering..."
        speed={30}
        onComplete={handleComplete}
        className="text-lg"
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | *required* | The text content to display with typewriter effect |
| `speed` | `number` | `30` | Animation speed in milliseconds per character |
| `onComplete` | `() => void` | `undefined` | Callback function called when animation completes |
| `className` | `string` | `''` | Additional CSS classes to apply to the container |

## Behavior

### Animation

- Text appears character by character at the specified speed (default 30ms)
- A blinking cursor appears during animation
- The cursor disappears when animation completes

### Skip Functionality

- Click anywhere on the text during animation to skip to the end
- The full text appears immediately
- The `onComplete` callback is triggered if provided

### Reduced Motion

When the user has `prefers-reduced-motion: reduce` enabled:
- Text appears instantly without animation
- No cursor is displayed
- The `onComplete` callback is triggered immediately

## Styling

The component applies the following CSS classes:

- `chalk-text`: Cream color (#f5f5dc), text shadow, and Lora serif font
- `typewriter`: Base typewriter styling with proper text wrapping
- `typewriter-cursor`: Blinking cursor animation (only during animation)
- `cursor-pointer`: Applied during animation to indicate clickability

## Accessibility

- **Role**: `article` for semantic meaning
- **ARIA Label**: "Explanation text" for screen readers
- **ARIA Live**: `polite` for dynamic content updates
- **Cursor**: Hidden from screen readers with `aria-hidden="true"`

## Requirements Validation

This component validates the following requirements:

- **Requirement 3.7**: Lora serif font for body text
- **Requirement 3.8**: Chalk-style text with cream color and text shadow
- **Requirement 6.5**: Typewriter animation at 30ms per character
- **Requirement 10.7**: Respects prefers-reduced-motion preference

## Examples

### Basic Usage

```tsx
<TypewriterText text="Hello, World!" />
```

### Custom Speed

```tsx
<TypewriterText text="Slower animation" speed={50} />
```

### With Completion Callback

```tsx
<TypewriterText
  text="Watch me type!"
  onComplete={() => console.log('Done!')}
/>
```

### With Custom Styling

```tsx
<TypewriterText
  text="Custom styled text"
  className="text-2xl leading-relaxed"
/>
```

### Multi-line Text

```tsx
<TypewriterText
  text={`Line 1
Line 2
Line 3`}
/>
```

## Notes

- The component uses `setInterval` for animation, which is cleaned up on unmount
- Text wrapping is handled with `pre-wrap` to preserve line breaks
- The component resets animation when the `text` prop changes
- Clicking after animation completes has no effect
