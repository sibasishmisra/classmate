/**
 * Claude API client with retry logic and circuit breaker
 * Validates: Requirements 9.7, 14.7
 */

import Anthropic from '@anthropic-ai/sdk';
import { ClaudeRequest, ClaudeResponse } from '@/types';
import { retryWithBackoff, RetryableError } from './retry';
import { CircuitBreaker } from './circuit-breaker';

// Global circuit breaker instance for Claude API
// Prevents cascading failures by temporarily stopping requests to a failing service
const claudeCircuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeoutMs: 60000, // 1 minute
  onStateChange: (state) => {
    console.log(`[CircuitBreaker] Claude API circuit breaker state changed to: ${state}`);
  }
});

// Initialize Anthropic client
let anthropicClient: Anthropic | null = null;

function getAnthropicClient(apiKey: string): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey: apiKey,
    });
  }
  return anthropicClient;
}

export interface ClaudeAPIOptions {
  apiKey: string;
  timeoutMs?: number;
  maxRetries?: number;
  onRetry?: (attempt: number, error: any) => void;
}

/**
 * Call Claude API with automatic retry on transient failures and circuit breaker protection
 * 
 * This function wraps Claude API calls with:
 * - Circuit breaker pattern to prevent cascading failures
 * - Timeout handling (default 30s)
 * - Automatic retry on network timeouts and 503 errors
 * - Exponential backoff between retries
 * 
 * @param request - Claude API request payload
 * @param options - API client options including API key and retry config
 * @returns Claude API response
 * @throws Error if all retry attempts fail, circuit is open, or on non-retryable errors
 * 
 * @example
 * ```typescript
 * const response = await callClaudeAPI(
 *   {
 *     model: 'claude-3-5-sonnet-20241022',
 *     max_tokens: 1024,
 *     messages: [{ role: 'user', content: 'Explain photosynthesis' }]
 *   },
 *   {
 *     apiKey: process.env.CLAUDE_API_KEY!,
 *     maxRetries: 3,
 *     onRetry: (attempt) => console.log(`Retry attempt ${attempt}`)
 *   }
 * );
 * ```
 */
export async function callClaudeAPI(
  request: ClaudeRequest,
  options: ClaudeAPIOptions
): Promise<ClaudeResponse> {
  const {
    apiKey,
    timeoutMs = 30000,
    maxRetries = 3,
    onRetry
  } = options;

  // Wrap the entire API call in circuit breaker
  return claudeCircuitBreaker.execute(async () => {
    return retryWithBackoff(async () => {
      try {
        const client = getAnthropicClient(apiKey);
        
        // Call Claude API using the SDK
        const response = await client.messages.create({
          model: request.model,
          max_tokens: request.max_tokens,
          messages: request.messages,
          system: request.system,
          temperature: 1,
        }, {
          timeout: timeoutMs,
        });

        // Convert SDK response to our ClaudeResponse type
        const data: ClaudeResponse = {
          id: response.id,
          content: response.content.map((block: any) => ({
            type: 'text' as const,
            text: block.type === 'text' ? block.text : ''
          })),
          model: response.model,
          stop_reason: response.stop_reason || 'end_turn'
        };

        return data;

      } catch (error: any) {
        // Handle SDK errors
        if (error.status) {
          const apiError: RetryableError = new Error(
            `Claude API error: ${error.status} ${error.message}`
          );
          apiError.status = error.status;
          throw apiError;
        }
        
        // Handle timeout errors
        if (error.name === 'AbortError' || error.message?.includes('timeout')) {
          const timeoutError: RetryableError = new Error(
            `Claude API request timed out after ${timeoutMs}ms`
          );
          timeoutError.name = 'AbortError';
          throw timeoutError;
        }
        
        // Re-throw other errors
        throw error;
      }
    }, {
      maxAttempts: maxRetries,
      initialDelayMs: 1000,
      maxDelayMs: 10000,
      backoffMultiplier: 2,
      retryableStatuses: [408, 429, 500, 502, 503, 504],
      onRetry
    });
  });
}

/**
 * Helper to check if an error is a Claude API error
 */
export function isClaudeAPIError(error: any): error is RetryableError {
  return error != null && typeof error.status === 'number';
}

/**
 * Helper to check if an error is a circuit breaker error
 */
export function isCircuitBreakerError(error: any): boolean {
  return error?.message === 'Circuit breaker is open';
}

/**
 * Helper to get user-friendly error message for Claude API errors
 */
export function getClaudeErrorMessage(error: any): string {
  // Check for circuit breaker error first
  if (isCircuitBreakerError(error)) {
    return "The classroom is experiencing technical difficulties. We're taking a short break to fix things. Please try again in a minute!";
  }

  if (!isClaudeAPIError(error)) {
    return 'Something went wrong. Please try again!';
  }

  switch (error.status) {
    case 401:
      return 'The teacher needs to check in. Please try again later.';
    case 429:
      return 'The classroom is full right now. Try again in a moment.';
    case 503:
      return "School's temporarily closed. Check back soon!";
    case 504:
      return 'The explanation is taking too long. Please try again!';
    default:
      return 'The teacher stepped out for a moment. Please try again!';
  }
}

/**
 * Get the circuit breaker instance for testing/monitoring
 */
export function getCircuitBreaker(): CircuitBreaker {
  return claudeCircuitBreaker;
}
