/**
 * Simple sliding-window rate limiter for client-side API throttling.
 *
 * Tracks request timestamps in memory and rejects requests that would exceed
 * the configured limit within the sliding window. Used as a pre-check in the
 * Axios request interceptor (see ADR-004).
 *
 * @example
 * const limiter = new RateLimiter(60, 60_000) // 60 req/min
 * if (limiter.canProceed()) {
 *   await axios.get('/api/data')
 * } else {
 *   const retryMs = limiter.getRetryAfterMs()
 *   console.log(`Rate limited. Retry in ${retryMs}ms`)
 * }
 */
class RateLimiter {
  private timestamps: number[] = []
  private maxRequests: number
  private windowMs: number

  /**
   * @param maxRequests - Maximum number of requests allowed within the window.
   * @param windowMs - Sliding window duration in milliseconds.
   */
  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  /**
   * Check whether a new request can be made without exceeding the rate limit.
   * If allowed, the current timestamp is recorded in the window.
   *
   * @returns `true` if the request is allowed, `false` if the limit is reached.
   */
  canProceed(): boolean {
    const now = Date.now()
    this.timestamps = this.timestamps.filter((t) => now - t < this.windowMs)
    if (this.timestamps.length >= this.maxRequests) {
      return false
    }
    this.timestamps.push(now)
    return true
  }

  /**
   * Calculate how many milliseconds the caller should wait before the oldest
   * request in the window expires and a new slot becomes available.
   *
   * @returns Milliseconds until a new request can proceed (`0` if the window is empty).
   */
  getRetryAfterMs(): number {
    const oldest = this.timestamps[0]
    if (oldest === undefined) return 0
    return Math.max(0, this.windowMs - (Date.now() - oldest))
  }
}

/** General API: 60 requests per minute */
export const apiRateLimiter = new RateLimiter(60, 60_000)

/** Auth endpoints: 5 attempts per minute */
export const authRateLimiter = new RateLimiter(5, 60_000)

export default RateLimiter
