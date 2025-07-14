import { fredAPI } from '../integrations/fred-api';
import { fetchWithError } from '../utils/fetchWithError';

/**
 * EconomicIndicator entity represents a key economic metric (e.g., GDP, unemployment).
 * Handles fetching economic data from the API and provides fallback to sample data.
 * Uses fetchWithError for robust error handling.
 */
export class EconomicIndicator {
  /**
   * Fetch a list of economic indicators.
   * @returns {Promise<Array>} List of economic indicators
   */
  static async list(sortBy = '-measurement_date', limit = 100) {
    try {
      console.log('📊 EconomicIndicator.list() - Fetching economic data...');
      
      const response = await fetchWithError('/api/fred/economic-data');
      if (!response.ok) {
        throw new Error(`Economic API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('✅ EconomicIndicator.list() - Economic data loaded:', {
        count: data.indicators?.length || 0,
        source: data.source,
        sample: data.indicators?.slice(0, 3).map(i => ({
          name: i.indicator_name,
          value: i.value,
          trend: i.trend
        }))
      });
      
      // Transform API data to match our expected format
      const indicators = (data.indicators || []).map(indicator => ({
        id: indicator.id,
        indicator_name: indicator.indicator_name,
        indicator_type: indicator.indicator_type,
        value: indicator.value,
        unit: indicator.unit,
        previous_value: indicator.previous_value,
        measurement_date: indicator.measurement_date,
        next_release_date: indicator.next_release_date || this.getNextReleaseDate(indicator.measurement_date),
        trend: indicator.trend,
        source: indicator.source,
        significance: indicator.significance || 'medium',
        sector: indicator.sector || 'general',
        description: indicator.description || this.getDescription(indicator.indicator_name)
      }));
      
      // Sort indicators
      let sortedIndicators = [...indicators];
      if (sortBy === '-measurement_date') {
        sortedIndicators.sort((a, b) => new Date(b.measurement_date) - new Date(a.measurement_date));
      } else if (sortBy === 'measurement_date') {
        sortedIndicators.sort((a, b) => new Date(a.measurement_date) - new Date(b.measurement_date));
      } else if (sortBy === 'indicator_name') {
        sortedIndicators.sort((a, b) => a.indicator_name.localeCompare(b.indicator_name));
      } else if (sortBy === '-value') {
        sortedIndicators.sort((a, b) => b.value - a.value);
      }
      
      return sortedIndicators.slice(0, limit);
      
    } catch (error) {
      console.warn('⚠️ EconomicIndicator.list() - Using fallback data:', error.message);
      return this.getFallbackData();
    }
  }

  static getNextReleaseDate(currentDate) {
    // Generate a reasonable next release date (usually monthly for most indicators)
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0];
  }

  static getDescription(indicatorName) {
    const descriptions = {
      'Consumer Price Index (CPI)': 'Measures changes in the price level of a weighted average market basket of consumer goods and services',
      'Unemployment Rate': 'Percentage of the labor force that is unemployed and actively seeking employment',
      'Federal Funds Rate': 'The interest rate at which depository institutions trade federal funds with each other overnight',
      'GDP Growth Rate': 'Annualized rate of growth in the gross domestic product'
    };
    
    return descriptions[indicatorName] || 'Economic indicator from Federal Reserve Economic Data';
  }

  // Fallback data for when API is unavailable
  static getFallbackData() {
    return [
      {
        id: 'CPIAUCSL',
        indicator_name: "Consumer Price Index (CPI)",
        indicator_type: "inflation",
        value: 3.2,
        unit: "%",
        previous_value: 3.1,
        measurement_date: "2024-01-15",
        next_release_date: "2024-02-13",
        trend: "up",
        source: "Federal Reserve Economic Data (FRED) - Fallback",
        significance: "high",
        sector: "general",
        description: "Measures changes in the price level of a weighted average market basket of consumer goods and services"
      },
      {
        id: 'UNRATE',
        indicator_name: "Unemployment Rate",
        indicator_type: "employment",
        value: 3.7,
        unit: "%",
        previous_value: 3.8,
        measurement_date: "2024-01-05",
        next_release_date: "2024-02-02",
        trend: "down",
        source: "Federal Reserve Economic Data (FRED) - Fallback",
        significance: "high",
        sector: "general",
        description: "Percentage of the labor force that is unemployed and actively seeking employment"
      },
      {
        id: 'FEDFUNDS',
        indicator_name: "Federal Funds Rate",
        indicator_type: "interest_rates",
        value: 5.50,
        unit: "%",
        previous_value: 5.25,
        measurement_date: "2024-01-15",
        next_release_date: "2024-02-01",
        trend: "up",
        source: "Federal Reserve Economic Data (FRED) - Fallback",
        significance: "high",
        sector: "general",
        description: "The interest rate at which depository institutions trade federal funds with each other overnight"
      },
      {
        id: 'GDP',
        indicator_name: "GDP Growth Rate",
        indicator_type: "gdp",
        value: 2.1,
        unit: "%",
        previous_value: 2.0,
        measurement_date: "2024-01-25",
        next_release_date: "2024-04-25",
        trend: "up",
        source: "Federal Reserve Economic Data (FRED) - Fallback",
        significance: "high",
        sector: "general",
        description: "Annualized rate of growth in the gross domestic product"
      }
    ];
  }
} 