/**
 * Rate limiting with Upstash Redis
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    })
  : null;

/**
 * Rate limiter for API routes
 */
export const rateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
      analytics: true,
      prefix: '@upstash/ratelimit',
    })
  : null;

/**
 * Strict rate limiter for expensive operations (uploads, AI)
 */
export const strictRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, '60 s'), // 3 requests per minute
      analytics: true,
      prefix: '@upstash/ratelimit:strict',
    })
  : null;

/**
 * Helper to check rate limit for a request
 */
export async function checkRateLimit(
  identifier: string,
  strict: boolean = false
): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number }> {
  const limiter = strict ? strictRateLimiter : rateLimiter;
  
  if (!limiter) {
    // No rate limiting configured, allow request
    return { success: true };
  }
  
  const result = await limiter.limit(identifier);
  
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: {
  limit?: number;
  remaining?: number;
  reset?: number;
}): Record<string, string> {
  if (!result.limit) return {};
  
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining?.toString() || '0',
    'X-RateLimit-Reset': result.reset?.toString() || '0',
  };
}

