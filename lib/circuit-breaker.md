# Circuit Breaker Pattern

## Overview

The Circuit Breaker pattern prevents cascading failures by temporarily stopping requests to a failing service. This implementation is applied to Claude API calls to protect the application from repeated failures.

## How It Works

The circuit breaker has three states:

1. **CLOSED** (Normal Operation)
   - Requests pass through normally
   - Failures are counted
   - When failure count reaches threshold (default: 5), circuit opens

2. **OPEN** (Service Failing)
   - Requests are rejected immediately without calling the service
   - Prevents cascading failures and gives the service time to recover
   - After timeout period (default: 60 seconds), transitions to half-open

3. **HALF-OPEN** (Testing Recovery)
   - Allows one request through to test if service has recovered
   - If successful: circuit closes and normal operation resumes
   - If failed: circuit reopens and timeout resets

## Usage

### Basic Usage

```typescript
import { CircuitBreaker } from './circuit-breaker';

const breaker = new CircuitBreaker({
  failureThreshold: 5,      // Open after 5 failures
  resetTimeoutMs: 60000,    // Try to recover after 1 minute
  onStateChange: (state) => {
    console.log(`Circuit breaker state: ${state}`);
  }
});

// Execute a function with circuit breaker protection
try {
  const result = await breaker.execute(async () => {
    return await fetch('https://api.example.com/data');
  });
  console.log('Success:', result);
} catch (error) {
  if (error.message === 'Circuit breaker is open') {
    console.log('Service is temporarily unavailable');
  } else {
    console.log('Request failed:', error);
  }
}
```

### Integration with Claude API

The circuit breaker is automatically applied to all Claude API calls:

```typescript
import { callClaudeAPI } from './claude-api-client';

try {
  const response = await callClaudeAPI(
    {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{ role: 'user', content: 'Explain photosynthesis' }]
    },
    {
      apiKey: process.env.CLAUDE_API_KEY!
    }
  );
  console.log('Explanation:', response.content[0].text);
} catch (error) {
  // Circuit breaker errors are handled with user-friendly messages
  console.error('Error:', error.message);
}
```

### Monitoring Circuit State

```typescript
import { getCircuitBreaker } from './claude-api-client';

const breaker = getCircuitBreaker();

console.log('Current state:', breaker.getState());
console.log('Failure count:', breaker.getFailureCount());

// Manually reset if needed
breaker.reset();
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `failureThreshold` | number | 5 | Number of consecutive failures before opening circuit |
| `resetTimeoutMs` | number | 60000 | Time to wait before attempting recovery (milliseconds) |
| `onStateChange` | function | undefined | Callback when circuit state changes |

## Error Handling

When the circuit is open, requests fail immediately with:

```
Error: Circuit breaker is open
```

The `getClaudeErrorMessage()` helper provides user-friendly messages:

```typescript
import { getClaudeErrorMessage } from './claude-api-client';

try {
  await callClaudeAPI(request, options);
} catch (error) {
  const message = getClaudeErrorMessage(error);
  // "The classroom is experiencing technical difficulties. 
  //  We're taking a short break to fix things. 
  //  Please try again in a minute!"
}
```

## Benefits

1. **Prevents Cascading Failures**: Stops making requests to a failing service
2. **Fast Failure**: Returns errors immediately when circuit is open
3. **Automatic Recovery**: Attempts to resume normal operation after timeout
4. **Resource Protection**: Reduces load on failing services
5. **Better User Experience**: Provides clear feedback about service status

## Testing

The circuit breaker includes comprehensive unit tests:

```bash
npm test -- lib/__tests__/circuit-breaker.test.ts
```

Tests cover:
- State transitions (closed → open → half-open → closed)
- Failure counting and threshold
- Timeout and recovery
- Manual reset
- Edge cases

## Requirements

**Validates: Requirements 9.7**

> WHEN an error occurs, THE ClassMate_App SHALL maintain the current Session state and allow recovery

The circuit breaker ensures the application can recover gracefully from API failures without losing user session data.
