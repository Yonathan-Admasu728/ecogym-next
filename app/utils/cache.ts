// app/utils/cache.ts

const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

interface CacheItem<T> {
  value: T;
  timestamp: number;
}

export const cacheGet = <T>(key: string): T | null => {
  const item = localStorage.getItem(key);
  if (!item) return null;

  const parsedItem: CacheItem<T> = JSON.parse(item);
  if (Date.now() - parsedItem.timestamp > CACHE_DURATION) {
    localStorage.removeItem(key);
    return null;
  }

  return parsedItem.value;
};

export const cacheSet = <T>(key: string, value: T): void => {
  const item: CacheItem<T> = {
    value,
    timestamp: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(item));
};
