import { logger } from './logger';

type CacheItem<T> = {
  data: T;
  timestamp: number;
  ttl: number;
};

class LocalStorageCache {
  private prefix: string;

  constructor(prefix = 'ecogym_') {
    this.prefix = prefix;
  }

  private getFullKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  set<T>(key: string, data: T, ttlInSeconds = 300): void {
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttlInSeconds * 1000,
      };
      localStorage.setItem(this.getFullKey(key), JSON.stringify(item));
      logger.debug('Cache set', { key: this.getFullKey(key), ttlInSeconds });
    } catch (error) {
      logger.error('Error setting cache', { error, key: this.getFullKey(key) });
      // If localStorage is full, clear old items
      this.clearExpired();
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getFullKey(key));
      if (!item) {
        logger.debug('Cache miss', { key: this.getFullKey(key) });
        return null;
      }

      const { data, timestamp, ttl }: CacheItem<T> = JSON.parse(item);
      const now = Date.now();

      if (now - timestamp > ttl) {
        logger.debug('Cache expired', { key: this.getFullKey(key) });
        this.delete(key);
        return null;
      }

      logger.debug('Cache hit', { key: this.getFullKey(key) });
      return data;
    } catch (error) {
      logger.error('Error getting cache', { error, key: this.getFullKey(key) });
      return null;
    }
  }

  delete(key: string): void {
    localStorage.removeItem(this.getFullKey(key));
    logger.debug('Cache deleted', { key: this.getFullKey(key) });
  }

  clearExpired(): void {
    try {
      const now = Date.now();
      const keys = Object.keys(localStorage);
      let clearedCount = 0;
      
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          const item = localStorage.getItem(key);
          if (item) {
            const { timestamp, ttl } = JSON.parse(item);
            if (now - timestamp > ttl) {
              localStorage.removeItem(key);
              clearedCount++;
            }
          }
        }
      });

      if (clearedCount > 0) {
        logger.debug('Cleared expired cache items', { count: clearedCount });
      }
    } catch (error) {
      logger.error('Error clearing expired cache', { error });
    }
  }

  clear(): void {
    const keys = Object.keys(localStorage);
    let clearedCount = 0;
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
        clearedCount++;
      }
    });
    logger.debug('Cache cleared', { prefix: this.prefix, count: clearedCount });
  }
}

// Cache instances for different types of data
export const programCache = new LocalStorageCache('program_');
export const sessionCache = new LocalStorageCache('session_');
export const userCache = new LocalStorageCache('user_');

// Cache keys
export const CACHE_KEYS = {
  FEATURED_PROGRAMS: 'featured_programs',
  RECOMMENDED_PROGRAMS: 'recommended_programs',
  PROGRAM_DETAILS: (id: string) => `program_${id}`,
  USER_PROGRAMS: 'user_programs',
  USER_FAVORITES: 'user_favorites',
  USER_WATCH_LATER: 'user_watch_later',
  SESSION_PROGRESS: (sessionId: string) => `progress_${sessionId}`,
} as const;

// Cache TTLs (in seconds)
export const CACHE_TTL = {
  FEATURED_PROGRAMS: 300, // 5 minutes
  RECOMMENDED_PROGRAMS: 300,
  PROGRAM_DETAILS: 600, // 10 minutes
  USER_PROGRAMS: 300,
  USER_FAVORITES: 300,
  USER_WATCH_LATER: 300,
  SESSION_PROGRESS: 60, // 1 minute
} as const;

// Helper function to generate cache key with parameters
export type CacheKeyParams = Record<string, string | number | boolean | undefined>;

export function toCacheKeyParams<T extends { [key: string]: unknown }>(obj: T): CacheKeyParams {
  const result: CacheKeyParams = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value != null) {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        result[key] = value;
      } else {
        result[key] = String(value);
      }
    }
  }
  return result;
}

export function generateCacheKey(base: string, params?: CacheKeyParams): string {
  if (!params) return base;
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  return `${base}_${sortedParams}`;
}

// Helper function to invalidate related caches
export function invalidateRelatedCaches(type: 'program' | 'session' | 'user', id?: string): void {
  logger.debug('Invalidating related caches', { type, id });
  switch (type) {
    case 'program':
      programCache.delete(CACHE_KEYS.FEATURED_PROGRAMS);
      programCache.delete(CACHE_KEYS.RECOMMENDED_PROGRAMS);
      if (id) {
        programCache.delete(CACHE_KEYS.PROGRAM_DETAILS(id));
      }
      break;
    case 'session':
      if (id) {
        sessionCache.delete(CACHE_KEYS.SESSION_PROGRESS(id));
      }
      break;
    case 'user':
      userCache.delete(CACHE_KEYS.USER_PROGRAMS);
      userCache.delete(CACHE_KEYS.USER_FAVORITES);
      userCache.delete(CACHE_KEYS.USER_WATCH_LATER);
      break;
  }
}
