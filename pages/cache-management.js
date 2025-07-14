import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { User } from '../entities/User';
import { getCacheStats, clearAllCache, invalidateCache, CACHE_KEYS, CACHE_TTLS } from '../utils/cache';

export default function CacheManagement() {
  const [user, setUser] = useState(null);
  const [cacheStats, setCacheStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (user) {
      loadCacheStats();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
      setUser(null);
    }
  };

  const loadCacheStats = async () => {
    try {
      setLoading(true);
      const stats = getCacheStats();
      setCacheStats(stats);
    } catch (error) {
      console.error('Error loading cache stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshStats = async () => {
    setRefreshing(true);
    await loadCacheStats();
    setRefreshing(false);
  };

  const handleClearAllCache = async () => {
    if (confirm('Are you sure you want to clear all cache? This will force fresh data to be fetched on next request.')) {
      clearAllCache();
      await loadCacheStats();
    }
  };

  const handleClearSpecificCache = async (key) => {
    if (confirm(`Are you sure you want to clear the cache for "${key}"?`)) {
      invalidateCache(key);
      await loadCacheStats();
    }
  };

  const formatTTL = (ttl) => {
    const minutes = Math.floor(ttl / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  const getCacheKeyInfo = (key) => {
    const keyInfo = {
      [CACHE_KEYS.CONGRESS_MEMBERS]: { name: 'Congress Members', description: 'Elected officials data from Congress.gov' },
      [CACHE_KEYS.POLITICIANS]: { name: 'Politicians', description: 'Transformed politicians data' },
      [CACHE_KEYS.ECONOMIC_DATA]: { name: 'Economic Data', description: 'FRED economic indicators' },
      [CACHE_KEYS.POLLING_DATA]: { name: 'Polling Data', description: 'Election polling data from multiple sources' },
      [CACHE_KEYS.FEC_CANDIDATES]: { name: 'FEC Candidates', description: 'Federal Election Commission candidate data' },
      [CACHE_KEYS.FEC_COMMITTEES]: { name: 'FEC Committees', description: 'Federal Election Commission committee data' },
      [CACHE_KEYS.FEC_CONTRIBUTIONS]: { name: 'FEC Contributions', description: 'Federal Election Commission contribution data' },
      [CACHE_KEYS.SCOTUS_CASES]: { name: 'SCOTUS Cases', description: 'Supreme Court cases and decisions' },
      [CACHE_KEYS.REGULATIONS]: { name: 'Regulations', description: 'Federal regulations and rulemaking' },
      [CACHE_KEYS.EVENTS]: { name: 'Events', description: 'Political events and calendar data' },
      [CACHE_KEYS.COMMITTEES]: { name: 'Committees', description: 'Congressional committee information' },
      [CACHE_KEYS.LOBBYING_DISCLOSURES]: { name: 'Lobbying Disclosures', description: 'Lobbying disclosure reports' }
    };
    
    return keyInfo[key] || { name: key, description: 'Unknown cache entry' };
  };

  if (!user) {
    return (
      <AppLayout user={user}>
        <div className="px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold terminal-text">Loading...</h1>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Restrict to admin users only
  if (user.account_type !== 'Admin') {
    return (
      <AppLayout user={user}>
        <div className="px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold terminal-text">You do not have permission to view this page.</h1>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user}>
      <div className="px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold terminal-text">Cache Management</h1>
              <p className="text-gray-400 mt-2">Monitor and manage data caching</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleRefreshStats}
                disabled={refreshing}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {refreshing ? 'Refreshing...' : 'Refresh Stats'}
              </button>
              <button
                onClick={handleClearAllCache}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Clear All Cache
              </button>
            </div>
          </div>

          {/* Cache Overview */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold terminal-text mb-4">Cache Overview</h2>
            
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-800 rounded w-1/4"></div>
                <div className="h-32 bg-gray-800 rounded"></div>
              </div>
            ) : cacheStats ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-400">{cacheStats.size}</div>
                  <div className="text-gray-400">Total Cache Entries</div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-400">
                    {new Date(cacheStats.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="text-gray-400">Last Updated</div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-400">
                    {cacheStats.keys.length > 0 ? 'Active' : 'Empty'}
                  </div>
                  <div className="text-gray-400">Cache Status</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">Unable to load cache statistics</p>
              </div>
            )}
          </div>

          {/* Cache Entries */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold terminal-text mb-4">Cache Entries</h2>
            
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-800 h-16 rounded"></div>
                ))}
              </div>
            ) : cacheStats && cacheStats.keys.length > 0 ? (
              <div className="space-y-4">
                {cacheStats.keys.map(key => {
                  const keyInfo = getCacheKeyInfo(key);
                  const ttl = CACHE_TTLS[key] || 5 * 60 * 1000; // Default 5 minutes
                  
                  return (
                    <div key={key} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold terminal-text">{keyInfo.name}</h3>
                        <p className="text-gray-400 text-sm">{keyInfo.description}</p>
                        <p className="text-gray-500 text-xs mt-1">TTL: {formatTTL(ttl)}</p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">Cached</span>
                        <button
                          onClick={() => handleClearSpecificCache(key)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No cache entries found</p>
              </div>
            )}
          </div>

          {/* Cache Configuration */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold terminal-text mb-4">Cache Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium terminal-text mb-3">Cache TTL Settings</h3>
                <div className="space-y-2">
                  {Object.entries(CACHE_TTLS).map(([key, ttl]) => {
                    const keyInfo = getCacheKeyInfo(key);
                    return (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-gray-700">
                        <span className="text-gray-300">{keyInfo.name}</span>
                        <span className="text-gray-400 text-sm">{formatTTL(ttl)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium terminal-text mb-3">Cache Benefits</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Faster page load times</li>
                  <li>• Reduced API calls</li>
                  <li>• Better user experience</li>
                  <li>• Lower server costs</li>
                  <li>• Automatic cleanup of expired data</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 