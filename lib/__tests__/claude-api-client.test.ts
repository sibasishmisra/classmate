/**
 * Unit tests for Claude API client with retry logic and circuit breaker
 * Validates: Requirements 9.7, 14.7
 */

import { callClaudeAPI, getClaudeErrorMessage, isClaudeAPIError, isCircuitBreakerError, getCircuitBreaker } from '../claude-api-client';
import { ClaudeRequest, ClaudeResponse } from '@/types';

describe('callClaudeAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    // Reset circuit breaker before each test
    getCircuitBreaker().reset();
  });

  const mockRequest: ClaudeRequest = {
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [{ role: 'user', content: 'Test question' }]
  };

  const mockResponse: ClaudeResponse = {
    id: 'msg_123',
    content: [{ type: 'text', text: 'Test response' }],
    model: 'claude-3-5-sonnet-20241022',
    stop_reason: 'end_turn'
  };

  it('should successfully call Claude API on first attempt', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockResponse
    });

    const result = await callClaudeAPI(mockRequest, {
      apiKey: 'test-key'
    });

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.anthropic.com/v1/messages',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'x-api-key': 'test-key'
        })
      })
    );
  });

  it('should retry on 503 Service Unavailable', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable'
      })
      .mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

    const result = await callClaudeAPI(mockRequest, {
      apiKey: 'test-key',
      maxRetries: 3
    });

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should retry on network timeout', async () => {
    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';

    (global.fetch as jest.Mock)
      .mockRejectedValueOnce(abortError)
      .mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

    const result = await callClaudeAPI(mockRequest, {
      apiKey: 'test-key',
      timeoutMs: 30000
    });

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should not retry on 401 Unauthorized', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized'
    });

    await expect(
      callClaudeAPI(mockRequest, { apiKey: 'invalid-key' })
    ).rejects.toThrow('Claude API error: 401 Unauthorized');

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should not retry on 400 Bad Request', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request'
    });

    await expect(
      callClaudeAPI(mockRequest, { apiKey: 'test-key' })
    ).rejects.toThrow('Claude API error: 400 Bad Request');

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should call onRetry callback on retry attempts', async () => {
    const onRetry = jest.fn();

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable'
      })
      .mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

    await callClaudeAPI(mockRequest, {
      apiKey: 'test-key',
      onRetry
    });

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onRetry).toHaveBeenCalledWith(1, expect.any(Error));
  });

  it('should exhaust retries and throw error', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 503,
      statusText: 'Service Unavailable'
    });

    await expect(
      callClaudeAPI(mockRequest, {
        apiKey: 'test-key',
        maxRetries: 2
      })
    ).rejects.toThrow('Claude API error: 503 Service Unavailable');

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  describe('circuit breaker integration', () => {
    it('should open circuit after multiple failures', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      // Make 5 failed requests to open the circuit (default threshold)
      for (let i = 0; i < 5; i++) {
        await expect(
          callClaudeAPI(mockRequest, { apiKey: 'test-key', maxRetries: 1 })
        ).rejects.toThrow();
      }

      expect(getCircuitBreaker().getState()).toBe('open');

      // Next request should fail immediately without calling fetch
      const fetchCallCount = (global.fetch as jest.Mock).mock.calls.length;
      await expect(
        callClaudeAPI(mockRequest, { apiKey: 'test-key' })
      ).rejects.toThrow('Circuit breaker is open');
      
      // Fetch should not have been called again
      expect((global.fetch as jest.Mock).mock.calls.length).toBe(fetchCallCount);
    });

    it('should reset circuit on successful request', async () => {
      // First, cause some failures
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      }).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(
        callClaudeAPI(mockRequest, { apiKey: 'test-key', maxRetries: 1 })
      ).rejects.toThrow();
      await expect(
        callClaudeAPI(mockRequest, { apiKey: 'test-key', maxRetries: 1 })
      ).rejects.toThrow();

      expect(getCircuitBreaker().getFailureCount()).toBe(2);

      // Now succeed
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

      await callClaudeAPI(mockRequest, { apiKey: 'test-key' });

      expect(getCircuitBreaker().getFailureCount()).toBe(0);
      expect(getCircuitBreaker().getState()).toBe('closed');
    });
  });
});

describe('isClaudeAPIError', () => {
  it('should return true for errors with status code', () => {
    const error = new Error('API error');
    (error as any).status = 503;
    
    expect(isClaudeAPIError(error)).toBe(true);
  });

  it('should return false for errors without status code', () => {
    const error = new Error('Generic error');
    
    expect(isClaudeAPIError(error)).toBe(false);
  });

  it('should return false for null or undefined', () => {
    expect(isClaudeAPIError(null)).toBe(false);
    expect(isClaudeAPIError(undefined)).toBe(false);
  });
});

describe('isCircuitBreakerError', () => {
  it('should return true for circuit breaker errors', () => {
    const error = new Error('Circuit breaker is open');
    expect(isCircuitBreakerError(error)).toBe(true);
  });

  it('should return false for other errors', () => {
    const error = new Error('Some other error');
    expect(isCircuitBreakerError(error)).toBe(false);
  });

  it('should return false for null or undefined', () => {
    expect(isCircuitBreakerError(null)).toBe(false);
    expect(isCircuitBreakerError(undefined)).toBe(false);
  });
});

describe('getClaudeErrorMessage', () => {
  it('should return message for circuit breaker error', () => {
    const error = new Error('Circuit breaker is open');
    
    expect(getClaudeErrorMessage(error)).toBe(
      "The classroom is experiencing technical difficulties. We're taking a short break to fix things. Please try again in a minute!"
    );
  });

  it('should return message for 401 error', () => {
    const error = new Error('Unauthorized');
    (error as any).status = 401;
    
    expect(getClaudeErrorMessage(error)).toBe(
      'The teacher needs to check in. Please try again later.'
    );
  });

  it('should return message for 429 error', () => {
    const error = new Error('Too Many Requests');
    (error as any).status = 429;
    
    expect(getClaudeErrorMessage(error)).toBe(
      'The classroom is full right now. Try again in a moment.'
    );
  });

  it('should return message for 503 error', () => {
    const error = new Error('Service Unavailable');
    (error as any).status = 503;
    
    expect(getClaudeErrorMessage(error)).toBe(
      "School's temporarily closed. Check back soon!"
    );
  });

  it('should return message for 504 error', () => {
    const error = new Error('Gateway Timeout');
    (error as any).status = 504;
    
    expect(getClaudeErrorMessage(error)).toBe(
      'The explanation is taking too long. Please try again!'
    );
  });

  it('should return default message for unknown status', () => {
    const error = new Error('Unknown error');
    (error as any).status = 500;
    
    expect(getClaudeErrorMessage(error)).toBe(
      'The teacher stepped out for a moment. Please try again!'
    );
  });

  it('should return default message for non-API errors', () => {
    const error = new Error('Generic error');
    
    expect(getClaudeErrorMessage(error)).toBe(
      'Something went wrong. Please try again!'
    );
  });
});
