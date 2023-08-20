interface CacheItem<T> {
  value: T;
  expiry: number;
}

type Cache<T> = Record<string, CacheItem<T>>;

const MEMORY_CACHE_DURATION_IN_SECONDS = 60; // 1 minutes
const LOCAL_STORAGE_CACHE_DURATION_IN_SECONDS = 86400; // 1 day
const SESSION_STORAGE_CACHE_DURATION_IN_SECONDS = 432000; // 5 days

const memoryCache: Cache<any> = {};

export default memoryCache;

export function setMemoryCache<T>(key: string, value: T): void {
  memoryCache[key] = {
    value,
    expiry: Date.now() + MEMORY_CACHE_DURATION_IN_SECONDS * 1000,
  };
}

export function getMemoryCache<T>(key: string): T | undefined {
  const item = memoryCache[key];
  if (item && item.expiry >= Date.now()) {
    return item.value as T;
  }
  delete memoryCache[key];
  return undefined;
}

export function setLocalStorageCache<T>(key: string, value: T): void {
  localStorage.setItem(
    key,
    JSON.stringify({
      value,
      expiry: Date.now() + LOCAL_STORAGE_CACHE_DURATION_IN_SECONDS * 1000,
    })
  );
}

export function getLocalStorageCache<T>(key: string): T | undefined {
  const item = localStorage.getItem(key);
  if (item) {
    const parsedItem = JSON.parse(item) as CacheItem<T>;
    if (parsedItem.expiry >= Date.now()) {
      return parsedItem.value;
    }
    localStorage.removeItem(key);
  }
  return undefined;
}

export function setSessionStorageCache<T>(key: string, value: T): void {
  sessionStorage.setItem(
    key,
    JSON.stringify({
      value,
      expiry: Date.now() + SESSION_STORAGE_CACHE_DURATION_IN_SECONDS * 1000,
    })
  );
}

export function getSessionStorageCache<T>(key: string): T | undefined {
  const item = sessionStorage.getItem(key);
  if (item) {
    const parsedItem = JSON.parse(item) as CacheItem<T>;
    if (parsedItem.expiry >= Date.now()) {
      return parsedItem.value;
    }
    sessionStorage.removeItem(key);
  }
  return undefined;
}
