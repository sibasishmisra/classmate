# Retry Logic Integration Example

This document shows how to integrate the retry logic with exponential backoff into the existing API routes.

## Overview

The retry logic has been implemented in two layers:

1. **`lib/retry.ts`**: Core retry utility with exponential backoff
2. **`lib/claude-api-client.ts`**: Claude API client wrapper with built-in retry logic

## Integration Options

### Option 1: Use the Claude API Client (Recommended)

The simplest way to add retry logic is to use the `callClaudeAPI` function which wraps all Claude API calls with automatic retry.

#### Before (without retry):

```typescript
// app/api/explain/route.ts
const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify(claudeRequest),
  signal: controller.signal
});

if (!claudeResponse.ok) {
  // Handle error
}

const claudeData = await claudeResponse.json();
```

#### After (with retry):

```typescript
// app/api/explain/route.ts
import { callClaudeAPI, getClaudeErrorMessage } from '@/lib/claude-api-client';

try {
  const claudeData = await callClaudeAPI(claudeRequest, {
    apiKey: apiKey,
    timeoutMs: 30000,
    maxRetries: 3,
    onRetry: (attempt, error) => {
      console.log(`Retrying Claude API call (attempt ${attempt}):`, error.message);
    }
  });
  
  // Use claudeData...
} catch (error) {
  const errorMessage = getClaudeErrorMessage(error);
  return NextResponse.json({ error: errorMessage }, { status: 500 });
}
```

### Option 2: Use retryWithBackoff Directly

For more control, you can use the `retryWithBackoff` function directly:

```typescript
import { retryWithBackoff, RetryableError } from '@/lib/retry';

const claudeData = await retryWithBackoff(async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(claudeRequest),
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
    console.log(`Retry attempt ${attempt}:`, error.message);
  }
});
```

### Option 3: Use retryableFetch

For simple fetch calls without custom timeout handling:

```typescript
import { retryableFetch } from '@/lib/retry';

const response = await retryableFetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify(claudeRequest)
}, {
  maxAttempts: 3,
  initialDelayMs: 1000
});

const data = await response.json();
```

## Complete Example: Updated /api/explain Route

Here's how to update the `/api/explain` route to use retry logic:

```typescript
/**
 * POST /api/explain - Generate age-appropriate explanation for a topic
 * WITH RETRY LOGIC
 */

import { NextRequest, NextResponse } from 'next/server';
import { ExplainRequest, ExplainResponse, ClaudeRequest } from '@/types';
import { processTopicInput } from '@/lib/validation';
import { withRateLimit } from '@/lib/rate-limiter';
import { callClaudeAPI, getClaudeErrorMessage } from '@/lib/claude-api-client';

const AGE_MAP = {
  1: '9-year-old',
  2: '10-year-old',
  3: '11-year-old',
  4: '12-year-old',
  5: '13-year-old',
  6: '14-year-old'
};

async function handlePOST(request: NextRequest) {
  try {
    const body: ExplainRequest = await request.json();
    const { topic, level } = body;

    // Validate level
    if (!level || level < 1 || level > 6) {
      return NextResponse.json(
        { error: 'Invalid learning level. Please select a level between 1 and 6.' },
        { status: 400 }
      );
    }

    // Validate and sanitize topic
    const validation = processTopicInput(topic);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid topic input' },
        { status: 400 }
      );
    }

    const sanitizedTopic = validation.sanitized;
    const apiKey = process.env.CLAUDE_API_KEY;
    
    if (!apiKey) {
      console.error('CLAUDE_API_KEY not configured');
      return NextResponse.json(
        { error: 'The teacher needs to check in. Please try again later.' },
        { status: 500 }
      );
    }

    // Format Claude API request for explanation
    const age = AGE_MAP[level];
    const systemPrompt = `You are a patient, encouraging teacher explaining concepts to a ${age} student.

Provide a clear, engaging explanation using:
- Simple, age-appropriate language
- Culturally universal examples
- Encouraging tone
- 2-3 paragraphs maximum
- No jargon unless explained

Keep the explanation under 400 words.`;

    const claudeRequest: ClaudeRequest = {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Topic: ${sanitizedTopic}\n\nPlease explain this topic.`
        }
      ],
      system: systemPrompt
    };

    // Call Claude API with automatic retry on transient failures
    let claudeData;
    try {
      claudeData = await callClaudeAPI(claudeRequest, {
        apiKey,
        timeoutMs: 30000,
        maxRetries: 3,
        onRetry: (attempt, error) => {
          console.log(`Retrying explanation generation (attempt ${attempt}):`, error.message);
        }
      });
    } catch (error) {
      console.error('Error calling Claude API:', error);
      const errorMessage = getClaudeErrorMessage(error);
      
      // Determine appropriate status code
      const statusCode = (error as any).status === 429 ? 429 : 500;
      
      return NextResponse.json(
        { error: errorMessage },
        { status: statusCode }
      );
    }

    // Validate response structure
    if (!claudeData.content || !Array.isArray(claudeData.content) || claudeData.content.length === 0) {
      console.error('Invalid Claude response structure:', claudeData);
      return NextResponse.json(
        { error: 'Received an unexpected response. Please try again!' },
        { status: 500 }
      );
    }

    const explanation = claudeData.content[0].text;

    // Generate follow-up questions (with retry)
    const followUpPrompt = `Based on this explanation about "${sanitizedTopic}":

${explanation}

Generate exactly 2 thought-provoking follow-up questions that:
- Encourage critical thinking appropriate for a ${age}
- Build on the explanation
- Are open-ended and engaging
- Use simple language

Format your response as a JSON array with exactly 2 questions, like this:
["Question 1 here?", "Question 2 here?"]

Only return the JSON array, nothing else.`;

    const followUpRequest: ClaudeRequest = {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: followUpPrompt
        }
      ]
    };

    let followUpQuestions = [];
    
    try {
      const followUpData = await callClaudeAPI(followUpRequest, {
        apiKey,
        timeoutMs: 30000,
        maxRetries: 2 // Fewer retries for follow-ups
      });
      
      const followUpText = followUpData.content[0].text;
      const questionsArray = JSON.parse(followUpText.trim());
      
      if (Array.isArray(questionsArray) && questionsArray.length >= 2) {
        followUpQuestions = questionsArray.slice(0, 2).map((q, i) => ({
          id: `fq_${Date.now()}_${i}`,
          question: q,
          isAnswered: false
        }));
      }
    } catch (error) {
      console.error('Follow-up generation failed:', error);
      // Continue without follow-up questions
    }

    // Return successful response
    const response: ExplainResponse = {
      explanation,
      followUpQuestions
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in /api/explain:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again!' },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(handlePOST);
```

## Benefits

1. **Automatic Retry**: Network timeouts and 503 errors are automatically retried
2. **Exponential Backoff**: Delays increase between retries to avoid overwhelming the server
3. **Jitter**: Random variation prevents thundering herd problem
4. **Configurable**: Easy to adjust retry behavior per endpoint
5. **Logging**: Optional callbacks for monitoring retry attempts
6. **User-Friendly Errors**: Consistent error messages across the app

## Testing

The retry logic includes comprehensive unit tests:

```bash
# Run retry logic tests
npm test -- lib/__tests__/retry.test.ts

# Run Claude API client tests
npm test -- lib/__tests__/claude-api-client.test.ts

# Run both
npm test -- lib/__tests__/retry.test.ts lib/__tests__/claude-api-client.test.ts
```

## Configuration Recommendations

### For Explanation Generation (Critical Path)
```typescript
{
  maxRetries: 3,
  timeoutMs: 30000,
  initialDelayMs: 1000
}
```

### For Follow-Up Questions (Non-Critical)
```typescript
{
  maxRetries: 2,
  timeoutMs: 30000,
  initialDelayMs: 1000
}
```

### For Answer Generation
```typescript
{
  maxRetries: 3,
  timeoutMs: 30000,
  initialDelayMs: 1000
}
```

## Monitoring

Add logging to track retry behavior in production:

```typescript
onRetry: (attempt, error) => {
  console.log({
    event: 'api_retry',
    attempt,
    error: error.message,
    status: error.status,
    timestamp: new Date().toISOString()
  });
}
```

This helps identify:
- Frequency of transient failures
- Which endpoints need retry most often
- Whether retry limits are appropriate
