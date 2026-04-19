/**
 * Retry logic with exponential backoff
 * Validates: Requirement 9.7
 */

export interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  retryableStatuses?: number[];
  onRetry?: (attempt: number, error: any) => void;
}

export interface RetryableError extends Error {
  status?: number;
  retryable?: boolean;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
  onRetry: () => {}
};

/**
 * Calculate exponential backoff delay with jitter
 */
function calculateDelay(
  attempt: number,
  initialDelay: number,
  maxDelay: number,
  multiplier: number
): number {
  const exponentialDelay = initialDelay * Math.pow(multiplier, attempt - 1);
  const cappedDelay = Math.min(exponentialDelay, maxDelay);
  
  // Add jitter (random value between 0 and 20% of delay)
  const jitter = Math.random() * 0.2 * cappedDelay;
  
  return cappedDelay + jitter;
}

/**
 * Check if an error is retryable
 */
function isRetryableError(error: any, retryableStatuses: number[]): boolean {
  // Network timeout errors
  if (error.name === 'AbortError') {
    return true;
  }
  
  // Fetch errors (network failures)
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true;
  }
  
  // HTTP status codes
  if (error.status && retryableStatuses.includes(error.status)) {
    return true;
  }
  
  // Explicit retryable flag
  if (error.retryable === true) {
    return true;
  }
  
  return false;
}

/**
 * Sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 * 
 * @param fn - The async function to retry
 * @param options - Retry configuration options
 * @returns The result of the function if successful
 * @throws The last error if all retries fail
 * 
 * @example
 * ```typescript
 * const result = await retryWithBackoff(
 *   async () => {
 *     const response = await fetch('/api/explain', { method: 'POST', body: data });
 *     if (!response.ok) {
 *       const error: RetryableError = new Error('API error');
 *       error.status = response.status;
 *       throw error;
 *     }
 *     return response.json();
 *   },
 *   {
 *     maxAttempts: 3,
 *     initialDelayMs: 1000,
 *     onRetry: (attempt) => console.log(`Retry attempt ${attempt}`)
 *   }
 * );
 * ```
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: any;
  
  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Check if we should retry
      const shouldRetry = isRetryableError(error, opts.retryableStatuses);
      const isLastAttempt = attempt === opts.maxAttempts;
      
      if (!shouldRetry || isLastAttempt) {
        throw error;
      }
      
      // Calculate delay for next attempt
      const delay = calculateDelay(
        attempt,
        opts.initialDelayMs,
        opts.maxDelayMs,
        opts.backoffMultiplier
      );
      
      // Call retry callback if provided
      if (opts.onRetry) {
        opts.onRetry(attempt, error);
      }
      
      // Wait before retrying
      await sleep(delay);
    }
  }
  
  // This should never be reached, but TypeScript needs it
  throw lastError;
}

/**
 * Create a retryable fetch wrapper
 * 
 * @example
 * ```typescript
 * const response = await retryableFetch('/api/explain', {
 *   method: 'POST',
 *   body: JSON.stringify(data)
 * }, {
 *   maxAttempts: 3,
 *   onRetry: (attempt) => console.log(`Retrying... attempt ${attempt}`)
 * });
 * ```
 */
export async function retryableFetch(
  url: string,
  init?: RequestInit,
  options?: RetryOptions
): Promise<Response> {
  return retryWithBackoff(async () => {
    const response = await fetch(url, init);
    
    // Check if response status is retryable
    if (!response.ok) {
      const error: RetryableError = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.status = response.status;
      throw error;
    }
    
    return response;
  }, options);
}
