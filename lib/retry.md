# Retry Logic with Exponential Backoff

This module provides retry logic with exponential backoff for handling transient failures gracefully.

## Overview

The retry utility automatically retries failed operations with increasing delays between attempts, helping to handle:
- Network timeouts
- Temporary service unavailability (503 errors)
- Rate limiting (429 errors)
- Other transient failures (500, 502, 504 errors)

## Features

- **Exponential Backoff**: Delays increase exponentially between retries (e.g., 1s, 2s, 4s)
- **Jitter**: Random variation added to delays to prevent thundering herd
- **Configurable**: Customize max attempts, delays, and retryable status codes
- **Smart Detection**: Automatically identifies retryable errors
- **Callbacks**: Optional callback for retry events

## Usage

### Basic Retry

```typescript
import { retryWithBackoff } from '@/lib/retry';

const result = await retryWithBackoff(async () => {
  const response = await fetch('/api/data');
  if (!response.ok) {
    const error = new Error('API error');
    error.status = response.status;
    throw error;
  }
  return response.json();
});
```

### With Options

```typescript
const result = await retryWithBackoff(
  async () => {
    // Your async operation
  },
  {
    maxAttempts: 3,           // Maximum retry attempts (default: 3)
    initialDelayMs: 1000,     // Initial delay in ms (default: 1000)
    maxDelayMs: 10000,        // Maximum delay cap (default: 10000)
    backoffMultiplier: 2,     // Delay multiplier (default: 2)
    retryableStatuses: [408, 429, 500, 502, 503, 504], // HTTP status codes to retry
    onRetry: (attempt, error) => {
      console.log(`Retry attempt ${attempt}:`, error.message);
    }
  }
);
```

### Retryable Fetch Wrapper

```typescript
import { retryableFetch } from '@/lib/retry';

// Automatically retries on network errors and 5xx responses
const response = await retryableFetch('/api/explain', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ topic: 'photosynthesis', level: 3 })
}, {
  maxAttempts: 3,
  onRetry: (attempt) => console.log(`Retrying... attempt ${attempt}`)
});

const data = await response.json();
```

## Retryable Errors

The following errors are automatically retried:

### Network Errors
- `AbortError`: Request timeout
- `TypeError` with "fetch": Network failure

### HTTP Status Codes (default)
- `408`: Request Timeout
- `429`: Too Many Requests (Rate Limit)
- `500`: Internal Server Error
- `502`: Bad Gateway
- `503`: Service Unavailable
- `504`: Gateway Timeout

### Explicit Flag
```typescript
const error = new Error('Custom error');
error.retryable = true;
throw error;
```

## Non-Retryable Errors

The following errors are NOT retried:
- `400`: Bad Request (client error)
- `401`: Unauthorized (authentication issue)
- `403`: Forbidden (authorization issue)
- `404`: Not Found (resource doesn't exist)
- Any error with `retryable: false`

## Exponential Backoff Calculation

Delays are calculated as:
```
delay = min(initialDelay * (multiplier ^ (attempt - 1)), maxDelay) + jitter
```

Example with defaults (initialDelay=1000ms, multiplier=2):
- Attempt 1 → Delay: ~1000ms (1s + jitter)
- Attempt 2 → Delay: ~2000ms (2s + jitter)
- Attempt 3 → Delay: ~4000ms (4s + jitter)

Jitter adds 0-20% random variation to prevent synchronized retries.

## Integration with API Routes

### Example: Retry Claude API Calls

```typescript
import { retryWithBackoff, RetryableError } from '@/lib/retry';

async function callClaudeAPI(request: ClaudeRequest) {
  return retryWithBackoff(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.CLAUDE_API_KEY!,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(request),
        signal: controller.signal
      });
      
      if (!response.ok) {
        const error: RetryableError = new Error(`HTTP ${response.status}`);
        error.status = response.status;
        throw error;
      }
      
      return response.json();
    } finally {
      clearTimeout(timeoutId);
    }
  }, {
    maxAttempts: 3,
    initialDelayMs: 1000,
    onRetry: (attempt, error) => {
      console.log(`Retrying Claude API call (attempt ${attempt}):`, error.message);
    }
  });
}
```

## Best Practices

1. **Use for Transient Failures Only**: Don't retry client errors (4xx) or authentication issues
2. **Set Reasonable Limits**: Default 3 attempts is usually sufficient
3. **Log Retry Attempts**: Use `onRetry` callback for monitoring
4. **Respect Rate Limits**: The utility automatically handles 429 responses
5. **Set Timeouts**: Always use timeouts with AbortController for network requests
6. **Cap Maximum Delay**: Prevent excessively long waits with `maxDelayMs`

## Requirements Validation

This module validates **Requirement 9.7**:
> WHEN an error occurs, THE ClassMate_App SHALL maintain the current Session state and allow recovery

The retry logic enables graceful recovery from transient failures without losing user state.
