/**
 * Per-IP flood protection for the abusable POST endpoints (/classify, /mcp),
 * backed by a Cloudflare Workers rate-limit binding. Fails OPEN: an absent
 * binding or a missing client IP (local dev, tests) skips the check — a
 * misconfiguration can only remove the protection, never take the endpoints
 * down.
 */

/** Minimal shape of a Cloudflare Workers rate-limit binding. */
export interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

/** Returns a 429 Response when the caller is over the limit, else null to proceed. */
export async function rateLimit(
  limiter: RateLimiter | undefined,
  request: Request
): Promise<Response | null> {
  if (!limiter) return null;
  const ip = request.headers.get("CF-Connecting-IP");
  if (!ip) return null;
  const { success } = await limiter.limit({ key: ip });
  if (success) return null;
  return new Response("Too many requests — slow down and retry shortly.\n", {
    status: 429,
    headers: {
      "Retry-After": "10",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
