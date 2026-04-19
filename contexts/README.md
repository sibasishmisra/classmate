# Context Providers

This directory contains React Context providers for managing global state in ClassMate.info.

## SessionContext

Manages learning session state including:
- Current learning level (1-6)
- Topic history (max 10 entries)
- Current topic with explanation and follow-up questions
- Loading and error states
- API interactions for submitting topics and answering follow-up questions

### Usage

```tsx
import { useSession } from '@/contexts';

function MyComponent() {
  const { 
    level, 
    setLevel, 
    submitTopic, 
    answerFollowUp,
    currentTopic,
    history,
    isLoading,
    error 
  } = useSession();

  // Select a learning level
  const handleLevelSelect = (level: LearningLevel) => {
    setLevel(level);
  };

  // Submit a topic for explanation
  const handleSubmit = async (topic: string) => {
    await submitTopic(topic);
  };

  // Answer a follow-up question
  const handleAnswerQuestion = async (questionId: string) => {
    await answerFollowUp(questionId);
  };

  return (
    // Your component JSX
  );
}
```

### Features

- **Automatic Persistence**: Session data is automatically saved to localStorage
- **History Management**: Maintains last 10 topics automatically
- **Error Handling**: Provides error messages for failed API calls
- **Loading States**: Tracks loading state for async operations

## SettingsContext

Manages user preferences including:
- Sound effects enabled/disabled
- Animations enabled/disabled
- Reduced motion detection (from system preferences)

### Usage

```tsx
import { useSettings } from '@/contexts';

function MyComponent() {
  const { 
    soundEnabled, 
    animationsEnabled, 
    reducedMotion,
    toggleSound,
    toggleAnimations 
  } = useSettings();

  return (
    <div>
      <button onClick={toggleSound}>
        Sound: {soundEnabled ? 'ON' : 'OFF'}
      </button>
      <button onClick={toggleAnimations}>
        Animations: {animationsEnabled ? 'ON' : 'OFF'}
      </button>
      {reducedMotion && <p>Reduced motion is enabled</p>}
    </div>
  );
}
```

### Features

- **Automatic Persistence**: Settings are saved to localStorage
- **System Preferences**: Detects and respects `prefers-reduced-motion`
- **Reactive Updates**: Automatically updates when system preferences change

## Setup

The providers are already integrated in `app/layout.tsx`:

```tsx
<SettingsProvider>
  <SessionProvider>
    {children}
  </SessionProvider>
</SettingsProvider>
```

## Testing

To test the context providers, navigate to `/context-test` in your browser. This page provides:
- Level selection demo
- Session history tracking
- Settings toggles
- Sound manager integration

## Requirements Validated

- **SessionContext**: Requirements 1.2, 1.6, 11.1, 11.2, 11.3
- **SettingsContext**: Requirements 6.7, 10.7
