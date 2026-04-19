/**
 * Circuit Breaker Pattern Implementation
 * Validates: Requirements 9.7
 * 
 * Prevents cascading failures by temporarily stopping requests to a failing service.
 * 
 * States:
 * - CLOSED: Normal operation, requests pass through
 * - OPEN: Service is failing, requests are rejected immediately
 * - HALF_OPEN: Testing if service has recovered
 * 
 * @example
 * ```typescript
 * const breaker = new CircuitBreaker({ failureThreshold: 5, resetTimeoutMs: 60000 });
 * 
 * try {
 *   const result = await breaker.execute(async () => {
 *     return await fetch('https://api.example.com');
 *   });
 * } catch (error) {
 *   if (error.message === 'Circuit breaker is open') {
 *     // Handle circuit open state
 *   }
 * }
 * ```
 */

export type CircuitState = 'closed' | 'open' | 'half-open';

export interface CircuitBreakerOptions {
  /**
   * Number of consecutive failures before opening the circuit
   * @default 5
   */
  failureThreshold?: number;

  /**
   * Time in milliseconds to wait before attempting to close the circuit
   * @default 60000 (1 minute)
   */
  resetTimeoutMs?: number;

  /**
   * Optional callback when circuit state changes
   */
  onStateChange?: (state: CircuitState) => void;
}

export class CircuitBreaker {
  private failures: number = 0;
  private lastFailureTime: number = 0;
  private state: CircuitState = 'closed';
  private readonly failureThreshold: number;
  private readonly resetTimeoutMs: number;
  private readonly onStateChange?: (state: CircuitState) => void;

  constructor(options: CircuitBreakerOptions = {}) {
    this.failureThreshold = options.failureThreshold ?? 5;
    this.resetTimeoutMs = options.resetTimeoutMs ?? 60000;
    this.onStateChange = options.onStateChange;
  }

  /**
   * Execute a function with circuit breaker protection
   * 
   * @param fn - Async function to execute
   * @returns Promise resolving to the function's result
   * @throws Error if circuit is open or function fails
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Check if circuit should transition from open to half-open
    if (this.state === 'open') {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime;
      if (timeSinceLastFailure >= this.resetTimeoutMs) {
        this.transitionTo('half-open');
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  /**
   * Handle successful execution
   */
  private onSuccess(): void {
    this.failures = 0;
    if (this.state === 'half-open') {
      this.transitionTo('closed');
    }
  }

  /**
   * Handle failed execution
   */
  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.failureThreshold) {
      this.transitionTo('open');
    }
  }

  /**
   * Transition to a new circuit state
   */
  private transitionTo(newState: CircuitState): void {
    if (this.state !== newState) {
      this.state = newState;
      this.onStateChange?.(newState);
    }
  }

  /**
   * Get current circuit state
   */
  getState(): CircuitState {
    return this.state;
  }

  /**
   * Get current failure count
   */
  getFailureCount(): number {
    return this.failures;
  }

  /**
   * Manually reset the circuit breaker to closed state
   */
  reset(): void {
    this.failures = 0;
    this.lastFailureTime = 0;
    this.transitionTo('closed');
  }
}
