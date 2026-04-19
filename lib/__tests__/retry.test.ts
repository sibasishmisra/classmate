/**
 * Unit tests for retry logic with exponential backoff
 * Validates: Requirement 9.7
 */

import { retryWithBackoff, retryableFetch, RetryableError } from '../retry';

describe('retryWithBackoff', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should succeed on first attempt', async () => {
    const fn = jest.fn().mockResolvedValue('success');
    
    const result = await retryWithBackoff(fn);
    
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry on network timeout (AbortError)', async () => {
    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';
    
    const fn = jest.fn()
      .mockRejectedValueOnce(abortError)
      .mockResolvedValue('success');
    
    const onRetry = jest.fn();
    
    const result = await retryWithBackoff(fn, {
      maxAttempts: 3,
      initialDelayMs: 10, // Use small delay for tests
      onRetry
    });
    
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
    expect(onRetry).toHaveBeenCalledWith(1, abortError);
  });

  it('should retry on 503 Service Unavailable', async () => {
    const error503: RetryableError = new Error('Service Unavailable');
    error503.status = 503;
    
    const fn = jest.fn()
      .mockRejectedValueOnce(error503)
      .mockResolvedValue('success');
    
    const result = await retryWithBackoff(fn, {
      maxAttempts: 3,
      initialDelayMs: 10
    });
    
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should retry on 500 Internal Server Error', async () => {
    const error500: RetryableError = new Error('Internal Server Error');
    error500.status = 500;
    
    const fn = jest.fn()
      .mockRejectedValueOnce(error500)
      .mockResolvedValue('success');
    
    const result = await retryWithBackoff(fn, {
      initialDelayMs: 10
    });
    
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should retry on 429 Rate Limit', async () => {
    const error429: RetryableError = new Error('Too Many Requests');
    error429.status = 429;
    
    const fn = jest.fn()
      .mockRejectedValueOnce(error429)
      .mockResolvedValue('success');
    
    const result = await retryWithBackoff(fn, {
      initialDelayMs: 10
    });
    
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should not retry on 400 Bad Request', async () => {
    const error400: RetryableError = new Error('Bad Request');
    error400.status = 400;
    
    const fn = jest.fn().mockRejectedValue(error400);
    
    await expect(retryWithBackoff(fn)).rejects.toThrow('Bad Request');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should not retry on 401 Unauthorized', async () => {
    const error401: RetryableError = new Error('Unauthorized');
    error401.status = 401;
    
    const fn = jest.fn().mockRejectedValue(error401);
    
    await expect(retryWithBackoff(fn)).rejects.toThrow('Unauthorized');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should exhaust all retry attempts', async () => {
    const error503: RetryableError = new Error('Service Unavailable');
    error503.status = 503;
    
    const fn = jest.fn().mockRejectedValue(error503);
    
    await expect(retryWithBackoff(fn, {
      maxAttempts: 3,
      initialDelayMs: 10
    })).rejects.toThrow('Service Unavailable');
    
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should use exponential backoff', async () => {
    const error: RetryableError = new Error('Timeout');
    error.name = 'AbortError';
    
    const fn = jest.fn().mockRejectedValue(error);
    const retryAttempts: number[] = [];
    
    await expect(retryWithBackoff(fn, {
      maxAttempts: 3,
      initialDelayMs: 10,
      backoffMultiplier: 2,
      onRetry: (attempt) => {
        retryAttempts.push(attempt);
      }
    })).rejects.toThrow('Timeout');
    
    expect(fn).toHaveBeenCalledTimes(3);
    expect(retryAttempts).toEqual([1, 2]);
  });

  it('should respect maxDelayMs cap', async () => {
    const error: RetryableError = new Error('Timeout');
    error.name = 'AbortError';
    
    const fn = jest.fn().mockRejectedValue(error);
    
    await expect(retryWithBackoff(fn, {
      maxAttempts: 5,
      initialDelayMs: 10,
      maxDelayMs: 30,
      backoffMultiplier: 2
    })).rejects.toThrow('Timeout');
    
    expect(fn).toHaveBeenCalledTimes(5);
  });

  it('should call onRetry callback with attempt number', async () => {
    const error: RetryableError = new Error('Timeout');
    error.name = 'AbortError';
    
    const fn = jest.fn()
      .mockRejectedValueOnce(error)
      .mockRejectedValueOnce(error)
      .mockResolvedValue('success');
    
    const onRetry = jest.fn();
    
    await retryWithBackoff(fn, {
      maxAttempts: 3,
      initialDelayMs: 10,
      onRetry
    });
    
    expect(onRetry).toHaveBeenCalledTimes(2);
    expect(onRetry).toHaveBeenNthCalledWith(1, 1, error);
    expect(onRetry).toHaveBeenNthCalledWith(2, 2, error);
  });

  it('should retry on fetch TypeError (network failure)', async () => {
    const fetchError = new TypeError('Failed to fetch');
    
    const fn = jest.fn()
      .mockRejectedValueOnce(fetchError)
      .mockResolvedValue('success');
    
    const result = await retryWithBackoff(fn, {
      initialDelayMs: 10
    });
    
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should respect explicit retryable flag', async () => {
    const error: RetryableError = new Error('Custom error');
    error.retryable = true;
    
    const fn = jest.fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValue('success');
    
    const result = await retryWithBackoff(fn, {
      initialDelayMs: 10
    });
    
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should not retry when retryable flag is false', async () => {
    const error: RetryableError = new Error('Non-retryable error');
    error.retryable = false;
    
    const fn = jest.fn().mockRejectedValue(error);
    
    await expect(retryWithBackoff(fn)).rejects.toThrow('Non-retryable error');
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('retryableFetch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('should succeed on first fetch attempt', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => ({ data: 'success' })
    } as Response;
    
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    
    const result = await retryableFetch('/api/test');
    
    expect(result).toBe(mockResponse);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should retry on 503 response', async () => {
    const error503Response = {
      ok: false,
      status: 503,
      statusText: 'Service Unavailable'
    } as Response;
    
    const successResponse = {
      ok: true,
      status: 200,
      json: async () => ({ data: 'success' })
    } as Response;
    
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce(error503Response)
      .mockResolvedValue(successResponse);
    
    const result = await retryableFetch('/api/test', {}, {
      maxAttempts: 3,
      initialDelayMs: 10
    });
    
    expect(result).toBe(successResponse);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should retry on network timeout', async () => {
    const timeoutError = new Error('The operation was aborted');
    timeoutError.name = 'AbortError';
    
    const successResponse = {
      ok: true,
      status: 200,
      json: async () => ({ data: 'success' })
    } as Response;
    
    (global.fetch as jest.Mock)
      .mockRejectedValueOnce(timeoutError)
      .mockResolvedValue(successResponse);
    
    const result = await retryableFetch('/api/test', {}, {
      initialDelayMs: 10
    });
    
    expect(result).toBe(successResponse);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should not retry on 400 Bad Request', async () => {
    const error400Response = {
      ok: false,
      status: 400,
      statusText: 'Bad Request'
    } as Response;
    
    (global.fetch as jest.Mock).mockResolvedValue(error400Response);
    
    await expect(retryableFetch('/api/test')).rejects.toThrow('HTTP 400: Bad Request');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should pass fetch options correctly', async () => {
    const mockResponse = {
      ok: true,
      status: 200
    } as Response;
    
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    
    const fetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'data' })
    };
    
    await retryableFetch('/api/test', fetchOptions);
    
    expect(global.fetch).toHaveBeenCalledWith('/api/test', fetchOptions);
  });
});
