# LoadingSpinner Component

## Overview

The LoadingSpinner component provides themed loading animations for API calls and async operations in ClassMate. It offers two nostalgic variants that match the school-themed aesthetic: a chalk writing spinner and a paper flip loader.

## Purpose

- Display visual feedback during API calls to Claude
- Provide themed loading states that enhance the nostalgic experience
- Support accessibility with proper ARIA labels and reduced motion preferences
- Maintain consistent loading UX across the application

## Variants

### Chalk Spinner (Default)
- Circular spinning animation
- Chalk-white color on dark backgrounds
- Best for chalkboard-themed sections
- Simulates chalk writing motion

### Paper Flip Loader
- 3D flip animation
- Paper-cream colored element
- Best for paper-themed sections
- Simulates notebook page flipping

## Props

### LoadingSpinner

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'chalk' \| 'paper'` | `'chalk'` | Animation type to display |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the spinner |
| `text` | `string` | `undefined` | Optional loading text below spinner |
| `className` | `string` | `''` | Additional CSS classes |

### ChalkSpinner

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the spinner |
| `text` | `string` | `undefined` | Optional loading text |
| `className` | `string` | `''` | Additional CSS classes |

### PaperFlipLoader

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the loader |
| `text` | `string` | `undefined` | Optional loading text |
| `className` | `string` | `''` | Additional CSS classes |

## Size Reference

- **Small (sm)**: 24px - For inline loading states
- **Medium (md)**: 40px - Default, for most use cases
- **Large (lg)**: 60px - For full-screen loading states

## Usage Examples

### Basic Usage

```tsx
import LoadingSpinner from '@/components/LoadingSpinner';

// Default chalk spinner
<LoadingSpinner />

// Paper flip loader
<LoadingSpinner variant="paper" />

// With size
<LoadingSpinner variant="chalk" size="lg" />

// With loading text
<LoadingSpinner 
  variant="chalk" 
  size="md" 
  text="Writing on the chalkboard..."
/>
```

### In API Call States

```tsx
function ExplanationDisplay({ isLoading, explanation }) {
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner 
          variant="chalk" 
          size="lg" 
          text="Generating explanation..."
        />
      </div>
    );
  }
  
  return <div>{explanation}</div>;
}
```

### Direct Component Usage

```tsx
import ChalkSpinner from '@/components/ChalkSpinner';
import PaperFlipLoader from '@/components/PaperFlipLoader';

// Use specific components directly
<ChalkSpinner size="lg" text="Loading..." />
<PaperFlipLoader size="md" text="Please wait..." />
```

### Conditional Rendering

```tsx
{isLoading && (
  <LoadingSpinner 
    variant="chalk" 
    size="md" 
    text="Loading content..."
  />
)}
```

## Accessibility

### ARIA Support
- `role="status"` for screen reader announcements
- `aria-live="polite"` for non-intrusive updates
- `aria-hidden="true"` on decorative elements
- Screen reader text with `sr-only` class

### Reduced Motion
- Automatically detects `prefers-reduced-motion` preference
- Falls back to static emoji indicators when motion is reduced
- Maintains functionality without animation

### Keyboard Navigation
- No keyboard interaction required (status indicator only)
- Does not trap focus
- Properly announced by screen readers

## Design Guidelines

### When to Use Chalk Spinner
- API calls to Claude for explanations
- Loading states on chalkboard backgrounds
- Dark-themed sections
- When simulating "teacher writing" metaphor

### When to Use Paper Flip Loader
- Content loading on paper backgrounds
- Light-themed sections
- When simulating "page turning" metaphor
- Session history loading

### Loading Text Guidelines
- Keep text short and descriptive (2-4 words)
- Use present continuous tense ("Loading...", "Writing...")
- Match the metaphor to the variant:
  - Chalk: "Writing on the chalkboard..."
  - Paper: "Flipping through pages..."
- Be encouraging and age-appropriate

## Technical Details

### Animation Performance
- Uses CSS animations (GPU-accelerated)
- No JavaScript animation loops
- Minimal performance impact
- Smooth 60fps animations

### CSS Classes Used
- `.chalk-spinner` - Chalk writing animation
- `.paper-loader` - Paper flip animation
- `.chalk-text` - Chalk-styled text
- `.sr-only` - Screen reader only text

### Dependencies
- React 18+
- Tailwind CSS
- Custom CSS animations in `globals.css`

## Requirements Validation

**Validates: Requirements 8.2**
- ✅ Displays themed loading animations (chalk writing, paper flipping)
- ✅ Shows during Claude API responses
- ✅ Provides visual feedback for async operations
- ✅ Maintains nostalgic school theme

## Related Components

- **ExplanationDisplay**: Uses LoadingSpinner during API calls
- **TopicInput**: Has inline spinner in submit button
- **ChalkboardSection**: Common container for chalk spinner
- **NotebookTextarea**: Common container for paper loader

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- [ ] Add sound effects (optional chalk scratching, page rustling)
- [ ] Add more animation variants (eraser wiping, pencil writing)
- [ ] Support custom colors for different themes
- [ ] Add progress indicator variant for long operations
