import { LRUCache } from 'lru-cache';

export interface RateLimitConfig {
  uniqueTokenPerInterval?: number;
  interval?: number;
}

export interface RateLimiter {
  check: (limit: number, token: string) => Promise<void>;
}

export function rateLimit(options: RateLimitConfig): RateLimiter {
  const cache = new LRUCache<string, number[]>({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  });

  return {
    check: (limit: number, token: string) =>
      new Promise((resolve, reject) => {
        const tokenCount = (cache.get(token) as number[]) || [0];
        if (tokenCount[0] === 0) {
          cache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;
        
        if (isRateLimited) {
          reject();
        } else {
          resolve();
        }
      }),
  };
}
