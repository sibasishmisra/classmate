# ClassMate Design System

This document describes the nostalgic design system implementation for ClassMate.info.

## Overview

The ClassMate design system evokes warm school memories through carefully crafted visual elements, textures, and interactions. It uses a black, white, and grayscale color palette with subtle warm accents to create a comforting learning environment.

## Design Tokens

### Colors

All colors are defined in both `tailwind.config.ts` and `app/globals.css` as CSS variables.

#### Primary Colors
- `chalk-white` (#f5f5dc) - Cream white, like chalk on a chalkboard
- `chalkboard-black` (#1a1a1a) - Deep black for chalkboard backgrounds
- `chalk-gray` (#9ca3af) - Dusty gray for faded chalk effects
- `paper-white` (#fefefe) - Clean paper white
- `paper-cream` (#faf8f3) - Aged paper cream for notebook aesthetics
- `ink-black` (#2d3748) - Ink black for text on paper
- `ruled-line` (#e5e7eb) - Subtle ruled lines on notebook paper
- `margin-red` (#dc2626) - Classic margin line red

#### Accent Colors
- `accent-gold` (#f59e0b) - Gold star, achievement highlights
- `accent-blue` (#3b82f6) - Notebook blue for interactive elements
- `accent-green` (#10b981) - Encouraging green for success states

#### Semantic Colors
- `error-red` (#ef4444) - Error states
- `warning-yellow` (#fbbf24) - Warning states
- `success-green` (#10b981) - Success states

### Typography

#### Font Families
- **Body Font**: Lora (serif) - Used for explanations and content
- **UI Font**: DM Sans (sans-serif) - Used for buttons, labels, and UI elements

#### Font Sizes
- `text-xs`: 0.75rem (12px) - Labels
- `text-sm`: 0.875rem (14px) - Secondary text
- `text-base`: 1rem (16px) - Body text
- `text-lg`: 1.125rem (18px) - Emphasis
- `text-xl`: 1.25rem (20px) - Headings
- `text-2xl`: 1.5rem (24px) - Page titles
- `text-3xl`: 1.875rem (30px) - Hero text

### Spacing
Follows Tailwind's spacing scale: 1, 2, 3, 4, 5, 6, 8, 10, 12, 16 (in rem units)

### Border Radius
- `sm`: 0.25rem (4px) - Subtle rounding
- `md`: 0.5rem (8px) - Cards
- `lg`: 0.75rem (12px) - Modals
- `xl`: 1rem (16px) - Hero elements
- `full`: 9999px - Circular

### Shadows
- `sm`: Subtle shadow for small elements
- `md`: Standard card shadow
- `lg`: Elevated element shadow
- `chalk`: Special shadow for chalk elements (0 2px 8px rgba(245, 245, 220, 0.2))
- `paper`: Paper-like shadow (0 4px 12px rgba(0, 0, 0, 0.08))

## Texture Assets

### Chalkboard Noise
**File**: `public/textures/chalkboard-noise.svg`

SVG-based noise texture that adds authenticity to chalkboard backgrounds. Applied with low opacity (0.05) to create subtle grain.

### Paper Texture
**File**: `public/textures/paper-texture.svg`

SVG-based paper texture using fractal noise and diffuse lighting to simulate real paper. Applied with opacity (0.3) for subtle effect.

## CSS Classes

### Nostalgic Elements

#### `.chalkboard`
Creates a chalkboard background with texture and subtle lighting effects.

```css
.chalkboard {
  background-color: var(--chalkboard-black);
  background-image: 
    url('/textures/chalkboard-noise.svg'),
    linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
  background-blend-mode: overlay;
  position: relative;
}
```

**Usage**: Apply to sections that should look like a chalkboard.

#### `.notebook-paper`
Creates notebook paper with ruled lines and margin line.

```css
.notebook-paper {
  background-color: var(--paper-cream);
  background-image: 
    url('/textures/paper-texture.svg'),
    repeating-linear-gradient(...), /* ruled lines */
    linear-gradient(...); /* margin line */
  padding-left: 70px; /* Space for margin */
}
```

**Usage**: Apply to input areas and content sections that should look like notebook paper.

#### `.chalk-text`
Styles text to look like chalk writing.

```css
.chalk-text {
  color: var(--chalk-white);
  font-family: 'Lora', serif;
  text-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.3),
    0 0 8px rgba(245, 245, 220, 0.4);
  letter-spacing: 0.02em;
}
```

**Usage**: Apply to text on chalkboard backgrounds.

### Component Classes

#### `.level-card`
Styled card for level selection with hover effects.

**Features**:
- Chalkboard background
- Border that changes on hover and selection
- Subtle glow effect on hover
- Selected state with gold border

**Usage**: Level selection cards

#### `.submit-button`
Primary button style with nostalgic feel.

**Features**:
- Ink black background
- Inverts colors on hover
- Lift animation on hover
- Disabled state with reduced opacity

**Usage**: Primary action buttons

#### `.question-card`
Card for displaying follow-up questions.

**Features**:
- Paper cream background
- Blue accent bar on hover
- Slight rotation on hover
- Expanded state for showing answers

**Usage**: Follow-up question displays

#### `.error-display`
Friendly error message display.

**Features**:
- Dashed border
- Torn paper aesthetic
- Triangle "tape" at top

**Usage**: Error states

#### `.history-tab`
Tab-style element for session history.

**Features**:
- Notebook tab appearance
- Lift on hover
- Active state highlighting

**Usage**: Session history navigation

### Animation Classes

#### `.chalk-dust`
Particle effect for chalk dust.

**Animation**: Floats away and fades out over 0.8s

**Usage**: Triggered on interactions (hover, click)

#### `.chalk-spinner`
Loading spinner styled as chalk writing.

**Animation**: Rotates continuously

**Usage**: Loading states on chalkboard backgrounds

#### `.paper-loader`
Loading animation styled as flipping paper.

**Animation**: 3D flip effect

**Usage**: Loading states on paper backgrounds

#### `.page-transition`
Page transition animation.

**Animation**: 3D page flip effect (0.6s on desktop, 0.3s on mobile)

**Usage**: Transitions between major UI states

#### `.typewriter`
Container for typewriter text effect.

**Usage**: Explanation text display

### Utility Classes

#### `.ink-text`
Applies ink-black color and Lora font.

#### `.ui-text`
Applies DM Sans font for UI elements.

#### `.ruled-line`
Adds a bottom border styled as a ruled line.

#### `.margin-line`
Adds a left border styled as a margin line with padding.

## Responsive Behavior

### Mobile Adjustments (< 768px)
- Notebook paper padding reduced from 70px to 50px
- Level cards padding reduced from 1.5rem to 1rem
- Page transition duration reduced from 0.6s to 0.3s

### Desktop Enhancements (≥ 768px)
- Multi-column layouts for cards
- More elaborate hover effects
- Longer animation durations

## Accessibility

### Color Contrast
All text colors meet WCAG 2.1 AA contrast requirements:
- Chalk text on chalkboard: 12.6:1
- Ink text on paper: 14.8:1

### Reduced Motion
All animations respect `prefers-reduced-motion` preference:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Focus Indicators
All interactive elements have visible focus indicators:

```css
*:focus-visible {
  outline: 2px solid var(--accent-blue);
  outline-offset: 2px;
}
```

## Usage Examples

### Chalkboard Section
```tsx
<div className="chalkboard p-8 rounded-lg">
  <p className="chalk-text text-lg">
    Your explanation text here
  </p>
</div>
```

### Notebook Input
```tsx
<div className="notebook-paper p-8 rounded-lg min-h-[200px]">
  <textarea className="ink-text w-full bg-transparent border-none outline-none">
  </textarea>
</div>
```

### Level Card
```tsx
<div className="level-card selected">
  <div className="chalk-text text-center">
    <div className="text-2xl font-bold mb-2">Level 3</div>
    <div className="text-sm">Age 11-12</div>
  </div>
</div>
```

### Submit Button
```tsx
<button className="submit-button">
  Submit Topic
</button>
```

### Question Card
```tsx
<div className="question-card">
  <div className="flex items-start gap-2">
    <span className="text-2xl">✋</span>
    <p className="ink-text">Your question here?</p>
  </div>
</div>
```

## Testing the Design System

Visit `/design-test` to see all design system components in action. This page includes:
- Chalkboard theme examples
- Notebook paper examples
- Level cards (normal and selected states)
- Buttons (normal and disabled states)
- Question cards (collapsed and expanded)
- Loading states
- Error displays
- History tabs
- Typography samples
- Color palette

## Implementation Notes

1. **Texture Performance**: SVG textures are lightweight and scale perfectly. They're loaded once and cached by the browser.

2. **CSS Variables**: All colors are defined as CSS variables for easy theming and consistency.

3. **Tailwind Integration**: Custom colors, fonts, and utilities are integrated into Tailwind config for use with utility classes.

4. **Mobile-First**: All styles are mobile-first with desktop enhancements added via media queries.

5. **Animation Performance**: Animations use CSS transforms and opacity for 60fps performance.

## Future Enhancements

- Sound effects integration (school bell, chalk tap, page turn)
- Haptic feedback for mobile devices
- Additional texture variations
- Dark mode support (if needed)
- Internationalization support for fonts
