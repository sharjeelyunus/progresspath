interface CacheItem<T> {
  value: T;
  expiry: number;
}

type Cache<T> = Record<string, CacheItem<T>>;

const CACHE_DURATION_IN_SECONDS = 60;

const cache: Cache<any> = {};

export default cache;

export function setCache<T>(key: string, value: T): void {
  cache[key] = {
    value,
    expiry: Date.now() + CACHE_DURATION_IN_SECONDS * 1000,
  };
}

export function getCache<T>(key: string): T | undefined {
  const item = cache[key];
  if (item && item.expiry > Date.now()) {
    return item.value as T;
  }
  delete cache[key];
  return undefined;
}
