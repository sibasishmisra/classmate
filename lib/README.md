# Utility Functions

This directory contains core utility functions for ClassMate.info.

## Validation Utilities (`validation.ts`)

### `validateTopicInput(input: string): boolean`
Validates that topic input is between 1-500 characters.

**Example:**
```typescript
validateTopicInput('Why is the sky blue?'); // true
validateTopicInput(''); // false
validateTopicInput('a'.repeat(501)); // false
```

### `sanitizeInput(input: string): string`
Removes/escapes potentially harmful content from user input.

**Example:**
```typescript
sanitizeInput('<script>alert("xss")</script>Hello'); // 'Hello'
sanitizeInput('<div>Test</div>'); // '&lt;div&gt;Test&lt;/div&gt;'
```

### `validateContentSafety(input: string): { isValid: boolean; reason?: string }`
Checks input for inappropriate content patterns.

**Example:**
```typescript
validateContentSafety('Why is the sky blue?'); // { isValid: true }
validateContentSafety('How to make a weapon'); // { isValid: false, reason: 'inappropriate_content' }
```

### `processTopicInput(input: string): { isValid: boolean; sanitized: string; error?: string }`
Combined validation and sanitization for topic input.

**Example:**
```typescript
processTopicInput('Why is the sky blue?');
// { isValid: true, sanitized: 'Why is the sky blue?' }

processTopicInput('');
// { isValid: false, sanitized: '', error: 'Please enter a topic to learn about!' }

processTopicInput('<script>alert()</script>Valid question?');
// { isValid: true, sanitized: 'Valid question?' }
```

## Session Storage Utilities (`session-storage.ts`)

### `persistSession(session: LearningSession): void`
Saves session to localStorage (keeps last 10 topics only).

**Example:**
```typescript
const session: LearningSession = {
  id: 'session-1',
  level: 3,
  topics: [...],
  createdAt: new Date(),
  settings: { soundEnabled: true, animationsEnabled: true, reducedMotion: false }
};

persistSession(session);
```

### `loadSession(): LearningSession | null`
Loads and validates session from localStorage.

**Example:**
```typescript
const session = loadSession();
if (session) {
  console.log('Loaded session with level:', session.level);
} else {
  console.log('No session found or invalid session');
}
```

### `clearSession(): void`
Removes session from localStorage.

**Example:**
```typescript
clearSession();
```

### `isStorageAvailable(): boolean`
Checks if localStorage is available.

**Example:**
```typescript
if (isStorageAvailable()) {
  persistSession(session);
} else {
  console.warn('localStorage not available, using in-memory storage');
}
```

### `getStorageInfo(): { available: boolean; hasSession: boolean; sessionSize?: number }`
Gets information about storage availability and usage.

**Example:**
```typescript
const info = getStorageInfo();
console.log('Storage available:', info.available);
console.log('Has session:', info.hasSession);
console.log('Session size:', info.sessionSize, 'bytes');
```

## Error Handling Utilities (`error-handlers.ts`)

### `handleNetworkError(error: NetworkError): FriendlyErrorConfig`
Handles network errors with friendly, age-appropriate messages.

**Example:**
```typescript
const error = createNetworkError('Connection failed', true);
const config = handleNetworkError(error);
// {
//   title: "Can't reach the classroom right now",
//   message: "Check your internet connection and try again.",
//   icon: "📡",
//   retryable: true
// }
```

### `handleClaudeError(error: ClaudeAPIError): FriendlyErrorConfig`
Handles Claude API errors with status code mapping to friendly messages.

**Example:**
```typescript
const error = createClaudeError(429, 'Rate limited', 60);
const config = handleClaudeError(error);
// {
//   title: "The classroom is full right now",
//   message: "Too many students learning at once! Try again in 60 seconds.",
//   icon: "⏰",
//   retryable: true,
//   retryAfter: 60
// }
```

**Supported Status Codes:**
- `401`: Configuration issue (not retryable)
- `429`: Rate limit exceeded (retryable with countdown)
- `500`: Internal server error (retryable)
- `503`: Service unavailable (retryable)
- Other codes default to 500 behavior

### `handleValidationError(error: ValidationError): FriendlyErrorConfig`
Handles validation errors with gentle, encouraging feedback.

**Example:**
```typescript
const error = createValidationError('topic', 'required', 'Topic is required');
const config = handleValidationError(error);
// {
//   title: "Don't forget your topic!",
//   message: "Please enter a topic to learn about.",
//   icon: "✏️",
//   retryable: false
// }
```

**Supported Validation Rules:**
- `topic.required`: Empty topic
- `topic.maxLength`: Topic exceeds 500 characters
- `topic.minLength`: Topic too short
- `level.invalid`: Invalid learning level

### `handleContentSafetyError(error: ContentSafetyError): FriendlyErrorConfig`
Handles content safety errors with non-judgmental redirection.

**Example:**
```typescript
const error = createContentSafetyError('inappropriate_input', 'Content flagged');
const config = handleContentSafetyError(error);
// {
//   title: "Let's learn about something else",
//   message: "That topic isn't quite right for our classroom. Try asking about something different!",
//   icon: "📚",
//   retryable: false
// }
```

### `handleStorageError(error: StorageError): FriendlyErrorConfig`
Handles storage errors with graceful degradation messages.

**Example:**
```typescript
const error = createStorageError('quota_exceeded');
const config = handleStorageError(error);
// {
//   title: "Storage space is full",
//   message: "Your session won't be saved, but you can keep learning!",
//   icon: "💾",
//   retryable: false
// }
```

**Supported Storage Errors:**
- `quota_exceeded`: localStorage quota exceeded
- `unavailable`: localStorage not available
- `corrupted`: Session data corrupted

### `handleError(error: AppError): FriendlyErrorConfig`
Generic error handler that routes to specific handlers based on error type.

**Example:**
```typescript
const error = createNetworkError('Connection failed', true);
const config = handleError(error); // Routes to handleNetworkError
```

### `logError(error: AppError, context?: Record<string, any>): void`
Logs errors for debugging without exposing sensitive data.

**Example:**
```typescript
const error = createClaudeError(500, 'Server error');
logError(error, { hasActiveTopic: true, level: 3 });
// Logs to console in development, sends to monitoring in production
```

### Error Factory Functions

Create typed error objects:

```typescript
// Network error
const networkError = createNetworkError('Connection failed', true);

// Claude API error
const claudeError = createClaudeError(429, 'Rate limited', 60);

// Validation error
const validationError = createValidationError('topic', 'required', 'Required field');

// Content safety error
const safetyError = createContentSafetyError('inappropriate_input', 'Flagged content');

// Storage error
const storageError = createStorageError('quota_exceeded');
```

## Requirements Validated

### Validation Utilities
- **Requirement 2.2**: Accept text input of 1 to 500 characters
- **Requirement 2.4**: Enable submit button when topic length is valid
- **Requirement 14.5**: Sanitize all user input before sending to Claude API
- **Requirement 15.2**: Implement client-side content validation

### Session Storage Utilities
- **Requirement 11.4**: Store session data in browser local storage
- **Requirement 11.5**: Clear session data when browser closes (handled by browser)
- **Property 11**: Session Data Round-Trip - preserve data through localStorage

### Error Handling Utilities
- **Requirement 9.1**: Display friendly error message when Claude API is unavailable
- **Requirement 9.2**: Display offline message when network connection is lost
- **Requirement 9.3**: Display gentle redirection for inappropriate content
- **Requirement 9.4**: Display "classroom is full" message for rate limits
- **Requirement 9.5**: Log errors to browser console for debugging
- **Requirement 9.6**: Provide clear, age-appropriate error messages for all error states
- **Requirement 9.7**: Maintain session state and allow recovery when errors occur

## Error Handling Philosophy

All error handling utilities follow these principles:

- **Age-Appropriate**: Messages use school metaphors and encouraging language
- **Non-Judgmental**: Content safety errors redirect without shaming
- **Graceful Degradation**: Application continues to work even when features fail
- **Privacy-Preserving**: Error logs never include user topics or personal data
- **Retryable**: Clear indication of which errors can be retried
- **Nostalgic**: Error messages maintain the school-themed aesthetic
