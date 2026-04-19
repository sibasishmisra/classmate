/**
 * Unit tests for CircuitBreaker
 * Validates: Requirements 9.7
 */

import { CircuitBreaker, CircuitState } from '../circuit-breaker';

describe('CircuitBreaker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should start in closed state', () => {
      const breaker = new CircuitBreaker();
      expect(breaker.getState()).toBe('closed');
      expect(breaker.getFailureCount()).toBe(0);
    });

    it('should accept custom options', () => {
      const breaker = new CircuitBreaker({
        failureThreshold: 3,
        resetTimeoutMs: 30000
      });
      expect(breaker.getState()).toBe('closed');
    });

    it('should call onStateChange callback when provided', async () => {
      const onStateChange = jest.fn();
      const breaker = new CircuitBreaker({
        failureThreshold: 2,
        onStateChange
      });

      // Trigger failures to open circuit
      const failingFn = jest.fn().mockRejectedValue(new Error('Test error'));
      
      await expect(breaker.execute(failingFn)).rejects.toThrow('Test error');
      await expect(breaker.execute(failingFn)).rejects.toThrow('Test error');

      expect(onStateChange).toHaveBeenCalledWith('open');
    });
  });

  describe('closed state', () => {
    it('should execute function successfully', async () => {
      const breaker = new CircuitBreaker();
      const successFn = jest.fn().mockResolvedValue('success');

      const result = await breaker.execute(successFn);

      expect(result).toBe('success');
      expect(successFn).toHaveBeenCalledTimes(1);
      expect(breaker.getState()).toBe('closed');
    });

    it('should track failures without opening circuit below threshold', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 5 });
      const failingFn = jest.fn().mockRejectedValue(new Error('Test error'));

      // Fail 4 times (below threshold of 5)
      for (let i = 0; i < 4; i++) {
        await expect(breaker.execute(failingFn)).rejects.toThrow('Test error');
      }

      expect(breaker.getState()).toBe('closed');
      expect(breaker.getFailureCount()).toBe(4);
    });

    it('should open circuit after reaching failure threshold', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 5 });
      const failingFn = jest.fn().mockRejectedValue(new Error('Test error'));

      // Fail 5 times (at threshold)
      for (let i = 0; i < 5; i++) {
        await expect(breaker.execute(failingFn)).rejects.toThrow('Test error');
      }

      expect(breaker.getState()).toBe('open');
      expect(breaker.getFailureCount()).toBe(5);
    });

    it('should reset failure count on success', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 5 });
      const failingFn = jest.fn().mockRejectedValue(new Error('Test error'));
      const successFn = jest.fn().mockResolvedValue('success');

      // Fail 3 times
      for (let i = 0; i < 3; i++) {
        await expect(breaker.execute(failingFn)).rejects.toThrow('Test error');
      }
      expect(breaker.getFailureCount()).toBe(3);

      // Succeed once
      await breaker.execute(successFn);

      expect(breaker.getFailureCount()).toBe(0);
      expect(breaker.getState()).toBe('closed');
    });
  });

  describe('open state', () => {
    it('should reject requests immediately when circuit is open', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 2 });
      const failingFn = jest.fn().mockRejectedValue(new Error('Test error'));

      // Open the circuit
      await expect(breaker.execute(failingFn)).rejects.toThrow('Test error');
      await expect(breaker.execute(failingFn)).rejects.toThrow('Test error');
      expect(breaker.getState()).toBe('open');

      // Next request should be rejected without calling function
      const anotherFn = jest.fn().mockResolvedValue('success');
      await expect(breaker.execute(anotherFn)).rejects.toThrow('Circuit breaker is open');
      expect(anotherFn).not.toHaveBeenCalled();
    });

    it('should transition to half-open after reset timeout', async () => {
      jest.useFakeTimers();
      
      const breaker = new CircuitBreaker({
        failureThreshold: 2,
        resetTimeoutMs: 60000
      });
      const failingFn = jest.fn().mockRejectedValue(new Error('Test error'));

      // Open the circuit
      await expect(breaker.execute(failingFn)).rejects.toThrow('Test error');
      await expect(breaker.execute(failingFn)).rejects.toThrow('Test error');
      expect(breaker.getState()).toBe('open');

      // Advance time past reset timeout
      jest.advanceTimersByTime(60000);

      // Next request should transition to half-open
      const successFn = jest.fn().mockResolvedValue('success');
      await breaker.execute(successFn);
      
      expect(breaker.getState()).toBe('closed');
      expect(successFn).toHaveBeenCalled();

      jest.useRealTimers();
    });

    it('should remain open if reset timeout has not elapsed', async () => {
      jest.useFakeTimers();
      
      const breaker = new CircuitBreaker({
        failureThreshold: 2,
        resetTimeoutMs: 60000
      });
      const failingFn = jest.fn().mockRejectedValue(new Error('Test error'));

      // Open the circuit
      await expect(breaker.execute(failingFn)).rejects.toThrow('Test error');
      await expect(breaker.execute(failingFn)).rejects.toThrow('Test error');
      expect(breaker.getState()).toBe('open');

      // Advance time but not past reset timeout
      jest.advanceTimersByTime(30000);

      // Request should still be rejected
      const anotherFn = jest.fn().mockResolvedValue('success');
      await expect(breaker.execute(anotherFn)).rejects.toThrow('Circuit breaker is open');
      expect(anotherFn).not.toHaveBeenCalled();

      jest.useRealTimers();
    });
  });

  describe('half-open state', () => {
    it('should close circuit on successful request in half-open state', async () => {
      jest.useFakeTimers();
      
      const breaker = new CircuitBreaker({
        failureThreshold: 2,
        resetTimeoutMs: 60000
      });
      const failingFn = jest.fn().mockRejectedValue(new Error('Test error'));

      // Open the circuit
      await expect(breaker.execute(failingFn)).rejects.toThrow('Test error');
      await expect(breaker.execute(failingFn)).rejects.toThrow('Test error');
      expect(breaker.getState()).toBe('open');

      // Advance time to trigger half-open
      jest.advanceTimersByTime(60000);

      // Successful request should close circuit
      const successFn = jest.fn().mockResolvedValue('success');
      await breaker.execute(successFn);
      
      expect(breaker.getState()).toBe('closed');
      expect(breaker.getFailureCount()).toBe(0);

      jest.useRealTimers();
    });

    it('should reopen circuit on failed request in half-open state', async () => {
      jest.useFakeTimers();
      
      const breaker = new CircuitBreaker({
        failureThreshold: 2,
        resetTimeoutMs: 60000
      });
      const failingFn = jest.fn().mockRejectedValue(new Error('Test error'));

      // Open the circuit
      await expect(breaker.execute(failingFn)).rejects.toThrow('Test error');
      await expect(breaker.execute(failingFn)).rejects.toThrow('Test error');
      expect(breaker.getState()).toBe('open');

      // Advance time to trigger half-open
      jest.advanceTimersByTime(60000);

      // Failed request should reopen circuit
      await expect(breaker.execute(failingFn)).rejects.toThrow('Test error');
      
      // Circuit should be open again after reaching threshold
      const anotherFn = jest.fn().mockResolvedValue('success');
      await expect(breaker.execute(anotherFn)).rejects.toThrow('Circuit breaker is open');

      jest.useRealTimers();
    });
  });

  describe('reset', () => {
    it('should manually reset circuit to closed state', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 2 });
      const failingFn = jest.fn().mockRejectedValue(new Error('Test error'));

      // Open the circuit
      await expect(breaker.execute(failingFn)).rejects.toThrow('Test error');
      await expect(breaker.execute(failingFn)).rejects.toThrow('Test error');
      expect(breaker.getState()).toBe('open');

      // Manually reset
      breaker.reset();

      expect(breaker.getState()).toBe('closed');
      expect(breaker.getFailureCount()).toBe(0);

      // Should accept requests again
      const successFn = jest.fn().mockResolvedValue('success');
      const result = await breaker.execute(successFn);
      expect(result).toBe('success');
    });
  });

  describe('edge cases', () => {
    it('should handle synchronous errors', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 2 });
      const throwingFn = jest.fn(() => {
        throw new Error('Sync error');
      });

      await expect(breaker.execute(throwingFn as any)).rejects.toThrow('Sync error');
      expect(breaker.getFailureCount()).toBe(1);
    });

    it('should handle different error types', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 3 });
      
      const error1 = jest.fn().mockRejectedValue(new Error('Error 1'));
      const error2 = jest.fn().mockRejectedValue(new TypeError('Error 2'));
      const error3 = jest.fn().mockRejectedValue('String error');

      await expect(breaker.execute(error1)).rejects.toThrow('Error 1');
      await expect(breaker.execute(error2)).rejects.toThrow('Error 2');
      await expect(breaker.execute(error3)).rejects.toBe('String error');

      expect(breaker.getState()).toBe('open');
    });

    it('should work with custom failure threshold of 1', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 1 });
      const failingFn = jest.fn().mockRejectedValue(new Error('Test error'));

      await expect(breaker.execute(failingFn)).rejects.toThrow('Test error');
      expect(breaker.getState()).toBe('open');
    });
  });
});
