import { fetchWithError } from '../utils/fetchWithError';

/**
 * LocalSpending entity represents government spending at the local level.
 * Handles fetching local spending data from the API.
 * Uses fetchWithError for robust error handling.
 */
export class LocalSpending {
  /**
   * Fetch local spending data for a given state and district.
   * @param {string} state - State code
   * @param {string|number} district - Congressional district
   * @param {number} limit - Number of records to fetch
   * @param {number} page - Page number
   * @returns {Promise<Object>} Local spending data
   */
  static async getLocalSpending(state, district, limit = 20, page = 1) {
    try {
      console.log('[LocalSpending] Fetching data for:', state, district);
      
      const response = await fetchWithError('/api/usaspending/local-spending', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state,
          district,
          limit,
          page
        })
      });

      const data = response.data;
      console.log('[LocalSpending] Received data:', data);
      
      return data;
    } catch (error) {
      console.error('[LocalSpending] Error fetching data:', error);
      throw error;
    }
  }

  static formatAmount(amount) {
    if (!amount || amount === 0) return '$0';
    
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  }

  static formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  }

  static getCategoryColor(category) {
    const colors = {
      'Infrastructure': 'bg-blue-500/20 text-blue-400',
      'Healthcare': 'bg-green-500/20 text-green-400',
      'Education': 'bg-purple-500/20 text-purple-400',
      'Transportation': 'bg-orange-500/20 text-orange-400',
      'Research & Development': 'bg-indigo-500/20 text-indigo-400',
      'Defense': 'bg-red-500/20 text-red-400',
      'Other': 'bg-gray-500/20 text-gray-400'
    };
    return colors[category] || colors['Other'];
  }

  static getSupportColor(support) {
    const colors = {
      'Supported': 'bg-green-500/20 text-green-400',
      'Likely Supported': 'bg-yellow-500/20 text-yellow-400',
      'Unknown': 'bg-gray-500/20 text-gray-400'
    };
    return colors[support] || colors['Unknown'];
  }

  static getSupportIcon(support) {
    switch (support) {
      case 'Supported':
        return '✓';
      case 'Likely Supported':
        return '⏳';
      default:
        return '?';
    }
  }

  static getImpactLevel(score) {
    if (score >= 8) return 'High';
    if (score >= 5) return 'Medium';
    return 'Low';
  }

  static getImpactColor(score) {
    if (score >= 8) return 'text-green-400';
    if (score >= 5) return 'text-yellow-400';
    return 'text-red-400';
  }
} 