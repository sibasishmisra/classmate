/**
 * Rate limiting middleware for API routes
 * Validates: Requirement 14.4
 * Property 12: Rate Limiting Enforcement
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
// In production, use Redis or similar distributed cache
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
const RATE_LIMIT_REQUESTS = parseInt(process.env.RATE_LIMIT_REQUESTS || '10', 10);
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);

/**
 * Get client identifier from request
 * Uses IP address or fallback to a header
 */
function getClientId(request: NextRequest): string {
  // Try to get real IP from headers (for proxied requests)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to a generic identifier
  return 'unknown';
}

/**
 * Clean up expired entries from the rate limit store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Check if request should be rate limited
 * Returns null if allowed, or NextResponse with 429 status if rate limited
 */
export function checkRateLimit(request: NextRequest): NextResponse | null {
  const clientId = getClientId(request);
  const now = Date.now();

  // Clean up old entries periodically (every 100 requests)
  if (Math.random() < 0.01) {
    cleanupExpiredEntries();
  }

  // Get or create rate limit entry
  let entry = rateLimitStore.get(clientId);

  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired entry
    entry = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS
    };
    rateLimitStore.set(clientId, entry);
    return null; // Allow request
  }

  // Increment count
  entry.count++;

  // Check if limit exceeded
  if (entry.count > RATE_LIMIT_REQUESTS) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    
    return NextResponse.json(
      { 
        error: `The classroom is full right now. Try again in ${retryAfter} seconds.`,
        retryAfter 
      },
      { 
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': RATE_LIMIT_REQUESTS.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': entry.resetTime.toString()
        }
      }
    );
  }

  // Allow request
  return null;
}

/**
 * Get rate limit headers for successful requests
 */
export function getRateLimitHeaders(request: NextRequest): Record<string, string> {
  const clientId = getClientId(request);
  const entry = rateLimitStore.get(clientId);

  if (!entry) {
    return {
      'X-RateLimit-Limit': RATE_LIMIT_REQUESTS.toString(),
      'X-RateLimit-Remaining': RATE_LIMIT_REQUESTS.toString()
    };
  }

  const remaining = Math.max(0, RATE_LIMIT_REQUESTS - entry.count);

  return {
    'X-RateLimit-Limit': RATE_LIMIT_REQUESTS.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': entry.resetTime.toString()
  };
}

/**
 * Wrapper function to apply rate limiting to API route handlers
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Check rate limit
    const rateLimitResponse = checkRateLimit(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Execute handler
    const response = await handler(request);

    // Add rate limit headers to successful responses
    const headers = getRateLimitHeaders(request);
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  };
}
