# ChalkboardSection Component

## Overview

The `ChalkboardSection` component provides a nostalgic chalkboard aesthetic container for displaying educational content. It applies the signature chalkboard texture, noise overlay, and radial gradient to create an authentic classroom feel while maintaining WCAG 2.1 AA accessibility standards.

## Features

- **Chalkboard Background**: Deep black (#1a1a1a) background with authentic texture
- **Noise Overlay**: Subtle noise pattern for realistic chalkboard appearance
- **Radial Gradient**: Adds depth and visual interest to the background
- **Accessibility**: Ensures proper contrast ratios for text readability
- **Semantic HTML**: Uses proper ARIA labels for screen readers

## Usage

```tsx
import ChalkboardSection from '@/components/ChalkboardSection';

export default function ExplanationPage() {
  return (
    <ChalkboardSection>
      <div className="p-8">
        <h1 className="chalk-text text-2xl mb-4">Why is the sky blue?</h1>
        <p className="chalk-text">
          The sky appears blue because of how sunlight interacts with Earth's atmosphere...
        </p>
      </div>
    </ChalkboardSection>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | Required | Content to be displayed on the chalkboard |
| `className` | `string` | `''` | Additional CSS classes for customization |

## Styling

The component uses the `.chalkboard` CSS class defined in `app/globals.css`, which includes:

- Background color: `#1a1a1a` (chalkboard-black)
- Noise texture overlay from `/textures/chalkboard-noise.svg`
- Linear gradient for depth (180deg, #1a1a1a to #0f0f0f)
- Radial gradient overlay for subtle lighting effect

## Accessibility

- **WCAG 2.1 AA Compliance**: The chalkboard background (#1a1a1a) with chalk-white text (#f5f5dc) provides a contrast ratio of 13.6:1, exceeding the 4.5:1 requirement
- **Semantic HTML**: Uses `<section>` element with proper ARIA labels
- **Screen Reader Support**: Includes `aria-label` for context

## Content Guidelines

When using ChalkboardSection, ensure content follows these guidelines:

1. **Text Color**: Use `.chalk-text` class for proper chalk-white color and text shadow
2. **Font**: Use Lora serif font (`.font-body`) for body text
3. **Padding**: Add appropriate padding to prevent content from touching edges
4. **Contrast**: Maintain sufficient contrast for all text and interactive elements

## Examples

### Basic Usage

```tsx
<ChalkboardSection>
  <div className="p-6">
    <p className="chalk-text">Your content here</p>
  </div>
</ChalkboardSection>
```

### With Custom Styling

```tsx
<ChalkboardSection className="min-h-screen flex items-center justify-center">
  <div className="max-w-4xl mx-auto p-8">
    <h1 className="chalk-text text-3xl font-bold mb-6">
      Today's Lesson
    </h1>
    <p className="chalk-text text-lg leading-relaxed">
      Let's explore an exciting topic together!
    </p>
  </div>
</ChalkboardSection>
```

### With TypewriterText

```tsx
<ChalkboardSection>
  <div className="p-8">
    <TypewriterText
      text="The sky appears blue because of Rayleigh scattering..."
      speed={30}
      className="text-lg"
    />
  </div>
</ChalkboardSection>
```

## Design Specifications

- **Background**: Chalkboard black (#1a1a1a)
- **Texture**: SVG noise overlay for authenticity
- **Gradient**: Radial gradient at 30% 40% for depth
- **Text Color**: Chalk white (#f5f5dc) with text shadow
- **Contrast Ratio**: 13.6:1 (exceeds WCAG AA requirement)

## Related Components

- `TypewriterText` - Animated text display for chalkboard content
- `LevelCard` - Uses chalkboard styling for level selection
- `FollowUpQuestions` - Can be displayed within ChalkboardSection

## Requirements Validation

This component validates the following requirements:

- **Requirement 3.8**: Nostalgic chalkboard aesthetic for explanations
- **Requirement 5.2**: Chalkboard texture in background elements
- **Requirement 10.1**: WCAG 2.1 AA contrast compliance
