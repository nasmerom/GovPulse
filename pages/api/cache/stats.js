import { getCacheStats, clearAllCache, invalidateCache } from '../../../utils/cache';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const stats = getCacheStats();
      res.status(200).json({
        success: true,
        stats: stats
      });
    } catch (error) {
      console.error('[Cache Stats API] Error:', error);
      res.status(500).json({ 
        error: 'Failed to get cache statistics',
        details: error.message 
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { key } = req.query;
      
      if (key === 'all') {
        clearAllCache();
        res.status(200).json({
          success: true,
          message: 'All cache cleared successfully'
        });
      } else if (key) {
        invalidateCache(key);
        res.status(200).json({
          success: true,
          message: `Cache cleared for key: ${key}`
        });
      } else {
        res.status(400).json({
          error: 'Missing key parameter'
        });
      }
    } catch (error) {
      console.error('[Cache Stats API] Error:', error);
      res.status(500).json({ 
        error: 'Failed to clear cache',
        details: error.message 
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 