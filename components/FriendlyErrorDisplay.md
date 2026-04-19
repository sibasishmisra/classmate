# FriendlyErrorDisplay Component

## Overview

The `FriendlyErrorDisplay` component displays age-appropriate error messages with a nostalgic torn paper note aesthetic. It provides themed icons based on error type and includes retry/go back action buttons.

## Features

- **Torn Paper Aesthetic**: Dashed border with torn paper tab effect
- **Age-Appropriate Messages**: Friendly, encouraging error messages suitable for students
- **Themed Icons**: Emoji icons that match the error type (📡, 🔑, ⏰, 🚪, 🔧, ✏️, 📚)
- **Action Buttons**: Configurable retry and go back actions
- **Accessible**: Proper ARIA labels and roles for screen readers
- **Responsive**: Touch-friendly with minimum 44x44px touch targets

## Props

```typescript
interface ErrorAction {
  label: string;
  onClick: () => void;
}

interface FriendlyErrorDisplayProps {
  title: string;              // Error title (age-appropriate)
  message: string;            // Error message (encouraging and clear)
  icon?: string;              // Optional emoji icon (default: '📝')
  actions?: ErrorAction[];    // Array of action buttons
  style?: 'default' | 'gentle-redirect'; // Visual style variant
}
```

## Usage Examples

### Network Error

```tsx
<FriendlyErrorDisplay
  title="Can't reach the classroom right now"
  message="Check your internet connection and try again."
  icon="📡"
  actions={[
    { label: 'Try Again', onClick: handleRetry },
    { label: 'Go Back', onClick: handleGoBack }
  ]}
/>
```

### Rate Limit Error

```tsx
<FriendlyErrorDisplay
  title="The classroom is full right now"
  message="Too many students learning at once! Try again in 60 seconds."
  icon="⏰"
  actions={[
    { label: 'Try Again', onClick: handleRetry }
  ]}
/>
```

### Service Unavailable

```tsx
<FriendlyErrorDisplay
  title="School's temporarily closed"
  message="The service is under maintenance. Check back soon!"
  icon="🔧"
/>
```

### Content Safety Error (Gentle Redirect)

```tsx
<FriendlyErrorDisplay
  title="Let's learn about something else"
  message="That topic isn't quite right for our classroom. Try asking about something different!"
  icon="📚"
  style="gentle-redirect"
  actions={[
    { label: 'Try Another Topic', onClick: handleClearAndFocus }
  ]}
/>
```

### Validation Error

```tsx
<FriendlyErrorDisplay
  title="Oops! That's a bit too long"
  message="Try to keep your topic under 500 characters so we can help you better!"
  icon="✏️"
  style="gentle-redirect"
  actions={[
    { label: 'Edit Topic', onClick: handleEdit }
  ]}
/>
```

### Generic Error

```tsx
<FriendlyErrorDisplay
  title="Oops! Something unexpected happened"
  message="Don't worry, let's start fresh!"
  icon="🔄"
  actions={[
    { label: 'Start Over', onClick: handleStartOver }
  ]}
/>
```

## Error Icon Guide

Use these themed icons for different error types:

- **📡** - Network/connectivity errors
- **🔑** - Authentication/configuration errors
- **⏰** - Rate limiting/timeout errors
- **🚪** - Server errors (teacher stepped out)
- **🔧** - Maintenance/service unavailable
- **✏️** - Validation/input errors
- **📚** - Content safety/inappropriate content
- **🔄** - Generic/unexpected errors

## Styling

The component uses two style variants:

### Default Style
- Red dashed border (`var(--error-red)`)
- Used for errors that need attention (network, API, validation)

### Gentle Redirect Style
- Blue dashed border (`var(--accent-blue)`)
- Used for non-critical redirects (content safety, suggestions)
- More encouraging, less alarming

## Accessibility

- Uses `role="alert"` for screen reader announcements
- `aria-live="assertive"` ensures immediate announcement
- `aria-atomic="true"` reads entire message
- Buttons have minimum 44x44px touch targets
- Keyboard navigable with visible focus indicators

## Design Principles

1. **Age-Appropriate Language**: Use simple, encouraging words
2. **School Metaphors**: Frame errors in classroom context
3. **Non-Punitive**: Never blame the student
4. **Clear Actions**: Provide obvious next steps
5. **Nostalgic Styling**: Torn paper note aesthetic

## Requirements Validation

This component validates the following requirements:

- **9.1**: Display friendly error message with retry option for API unavailability
- **9.2**: Display offline message with nostalgic styling for network loss
- **9.3**: Display gentle redirection for inappropriate content
- **9.4**: Display themed message for rate limits
- **9.6**: Provide clear, age-appropriate error messages for all error states

## Integration with Error Handlers

### Network Error Handler

```typescript
function handleNetworkError(error: NetworkError): void {
  displayFriendlyError({
    title: "Can't reach the classroom right now",
    message: "Check your internet connection and try again.",
    icon: "📡",
    actions: [
      { label: "Try Again", onClick: retryRequest },
      { label: "Go Back", onClick: resetToInput }
    ]
  });
}
```

### Claude API Error Handler

```typescript
function handleClaudeError(error: ClaudeAPIError): void {
  const errorMessages = {
    429: {
      title: "The classroom is full right now",
      message: `Too many students learning at once! Try again in ${error.retryAfter || 60} seconds.`,
      icon: "⏰"
    },
    503: {
      title: "School's temporarily closed",
      message: "The service is under maintenance. Check back soon!",
      icon: "🔧"
    }
  };
  
  const config = errorMessages[error.statusCode];
  displayFriendlyError(config);
}
```

### Content Safety Error Handler

```typescript
function handleContentSafetyError(error: ContentSafetyError): void {
  displayFriendlyError({
    title: "Let's learn about something else",
    message: "That topic isn't quite right for our classroom. Try asking about something different!",
    icon: "📚",
    style: "gentle-redirect",
    actions: [
      { label: "Try Another Topic", onClick: clearAndFocus }
    ]
  });
}
```

## Testing

The component includes comprehensive tests covering:

- Rendering with title and message
- Custom and default icons
- Action button rendering and click handlers
- ARIA attributes for accessibility
- Style variants (default and gentle-redirect)
- Minimum touch target sizes
- Various error scenarios (network, API, content safety)

Run tests with:

```bash
npm test FriendlyErrorDisplay
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Respects `prefers-reduced-motion` for animations
- Graceful degradation for older browsers
