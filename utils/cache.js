// Cache utility for storing API responses
class Cache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL
  }

  // Set a value in cache with optional TTL
  set(key, value, ttl = this.defaultTTL) {
    this.cache.set(key, value);
    this.timestamps.set(key, Date.now() + ttl);
  }

  // Get a value from cache if it exists and is not expired
  get(key) {
    if (!this.cache.has(key)) {
      return null;
    }

    const expiry = this.timestamps.get(key);
    if (Date.now() > expiry) {
      this.delete(key);
      return null;
    }

    return this.cache.get(key);
  }

  // Delete a specific key
  delete(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
  }

  // Clear all cache
  clear() {
    this.cache.clear();
    this.timestamps.clear();
  }

  // Check if a key exists and is not expired
  has(key) {
    return this.get(key) !== null;
  }

  // Get cache size
  size() {
    return this.cache.size;
  }

  // Get cache keys
  keys() {
    return Array.from(this.cache.keys());
  }

  // Clean expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, expiry] of this.timestamps.entries()) {
      if (now > expiry) {
        this.delete(key);
      }
    }
  }
}

// Global cache instance
const globalCache = new Cache();

// Cache keys for different data types
export const CACHE_KEYS = {
  CONGRESS_MEMBERS: 'congress_members',
  POLITICIANS: 'politicians',
  ECONOMIC_DATA: 'economic_data',
  POLLING_DATA: 'polling_data',
  FEC_CANDIDATES: 'fec_candidates',
  FEC_COMMITTEES: 'fec_committees',
  FEC_CONTRIBUTIONS: 'fec_contributions',
  SCOTUS_CASES: 'scotus_cases',
  REGULATIONS: 'regulations',
  EVENTS: 'events',
  COMMITTEES: 'committees',
  LOBBYING_DISCLOSURES: 'lobbying_disclosures'
};

// Cache TTLs in milliseconds
export const CACHE_TTLS = {
  CONGRESS_MEMBERS: 30 * 60 * 1000, // 30 minutes
  POLITICIANS: 30 * 60 * 1000, // 30 minutes
  ECONOMIC_DATA: 15 * 60 * 1000, // 15 minutes
  POLLING_DATA: 10 * 60 * 1000, // 10 minutes
  FEC_DATA: 60 * 60 * 1000, // 1 hour
  SCOTUS_CASES: 24 * 60 * 60 * 1000, // 24 hours
  REGULATIONS: 60 * 60 * 1000, // 1 hour
  EVENTS: 5 * 60 * 1000, // 5 minutes
  COMMITTEES: 60 * 60 * 1000, // 1 hour
  LOBBYING_DISCLOSURES: 60 * 60 * 1000 // 1 hour
};

// Helper function to get cached data or fetch and cache
export async function getCachedData(key, fetchFunction, ttl = null) {
  // Check cache first
  const cached = globalCache.get(key);
  if (cached) {
    console.log(`[Cache] Hit for key: ${key}`);
    return cached;
  }

  console.log(`[Cache] Miss for key: ${key}, fetching...`);
  
  try {
    // Fetch fresh data
    const data = await fetchFunction();
    
    // Cache the result
    const cacheTTL = ttl || CACHE_TTLS[key] || globalCache.defaultTTL;
    globalCache.set(key, data, cacheTTL);
    
    console.log(`[Cache] Stored data for key: ${key} with TTL: ${cacheTTL}ms`);
    return data;
  } catch (error) {
    console.error(`[Cache] Error fetching data for key: ${key}:`, error);
    throw error;
  }
}

// Helper function to invalidate cache
export function invalidateCache(key) {
  globalCache.delete(key);
  console.log(`[Cache] Invalidated key: ${key}`);
}

// Helper function to clear all cache
export function clearAllCache() {
  globalCache.clear();
  console.log('[Cache] Cleared all cache');
}

// Helper function to get cache stats
export function getCacheStats() {
  return {
    size: globalCache.size(),
    keys: globalCache.keys(),
    timestamp: Date.now()
  };
}

// Auto-cleanup expired entries every 5 minutes
setInterval(() => {
  globalCache.cleanup();
}, 5 * 60 * 1000);

export default globalCache; 