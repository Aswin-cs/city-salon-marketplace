const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Basic in-memory rate limiter for Next.js API routes.
 * 
 * @param ip Client IP address to rate limit
 * @param limit Maximum number of requests allowed in the window
 * @param windowMs Sliding window duration in milliseconds (default: 1 minute)
 */
export function rateLimit(ip: string, limit: number, windowMs: number = 60 * 1000): RateLimitResult {
  const now = Date.now();
  const clientData = rateLimitMap.get(ip) || { count: 0, lastReset: now };

  if (now - clientData.lastReset > windowMs) {
    clientData.count = 1;
    clientData.lastReset = now;
  } else {
    clientData.count++;
  }

  rateLimitMap.set(ip, clientData);

  return {
    success: clientData.count <= limit,
    limit,
    remaining: Math.max(0, limit - clientData.count),
    reset: clientData.lastReset + windowMs,
  };
}
