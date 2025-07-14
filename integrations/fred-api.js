// FRED (Federal Reserve Economic Data) API Client
class FREDAPI {
  constructor() {
    this.apiKey = process.env.FRED_API_KEY;
    this.baseUrl = 'https://api.stlouisfed.org/fred';
    
    if (!this.apiKey) {
      console.warn('FRED API key not found. Some economic data may be limited.');
    }
  }

  async request(endpoint, params = {}) {
    if (!this.apiKey) {
      throw new Error('FRED API key not configured');
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.append('api_key', this.apiKey);
    url.searchParams.append('file_type', 'json');
    
    // Add other parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(url.toString(), {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
    
    if (!response.ok) {
        throw new Error(`FRED API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('FRED API request failed:', error);
      throw error;
    }
  }

  // Get economic indicators
  async getEconomicIndicators() {
    const indicators = [
      { id: 'CPIAUCSL', name: 'Consumer Price Index (CPI)', type: 'inflation', unit: '%' },
      { id: 'CPILFESL', name: 'Core CPI (Excluding Food & Energy)', type: 'inflation', unit: '%' },
      { id: 'UNRATE', name: 'Unemployment Rate', type: 'employment', unit: '%' },
      { id: 'PAYEMS', name: 'Non-Farm Payrolls', type: 'employment', unit: 'jobs' },
      { id: 'FEDFUNDS', name: 'Federal Funds Rate', type: 'interest_rates', unit: '%' },
      { id: 'GDP', name: 'GDP Growth Rate', type: 'gdp', unit: '%' },
      { id: 'PPIACO', name: 'Producer Price Index (PPI)', type: 'inflation', unit: '%' },
      { id: 'AWHMAN', name: 'Average Hourly Earnings', type: 'employment', unit: '$' },
      { id: 'PRIME', name: 'Prime Rate', type: 'interest_rates', unit: '%' },
      { id: 'RSAFS', name: 'Retail Sales', type: 'consumption', unit: 'B' },
      { id: 'INDPRO', name: 'Industrial Production', type: 'production', unit: 'index' },
      { id: 'HOUST', name: 'Housing Starts', type: 'construction', unit: 'M' },
      { id: 'UMCSENT', name: 'Consumer Confidence Index', type: 'sentiment', unit: 'index' }
    ];

    const results = await Promise.allSettled(
      indicators.map(async (indicator) => {
        try {
          const data = await this.request('/series/observations', {
            series_id: indicator.id,
            limit: 2,
            sort_order: 'desc'
          });

          if (!data.observations || data.observations.length < 2) {
            return null;
          }

          const current = data.observations[0];
          const previous = data.observations[1];

          return {
            id: indicator.id,
            indicator_name: indicator.name,
            indicator_type: indicator.type,
            value: parseFloat(current.value),
            unit: indicator.unit,
            previous_value: parseFloat(previous.value),
            measurement_date: current.date,
            trend: parseFloat(current.value) > parseFloat(previous.value) ? 'up' : 'down',
            source: 'Federal Reserve Economic Data (FRED)',
            significance: 'high',
            sector: 'general',
            description: this.getDescription(indicator.id)
          };
        } catch (error) {
          console.warn(`Failed to fetch ${indicator.name}:`, error.message);
          return null;
        }
      })
    );

    return results
      .map((result, index) => result.status === 'fulfilled' ? result.value : null)
      .filter(Boolean);
  }

  getDescription(seriesId) {
    const descriptions = {
      'CPIAUCSL': 'Measures changes in the price level of a weighted average market basket of consumer goods and services',
      'CPILFESL': 'CPI excluding volatile food and energy prices, considered a better measure of underlying inflation',
      'UNRATE': 'Percentage of the labor force that is unemployed and actively seeking employment',
      'PAYEMS': 'Total number of paid U.S. workers excluding farm workers, government employees, and non-profit organization employees',
      'FEDFUNDS': 'The interest rate at which depository institutions trade federal funds with each other overnight',
      'GDP': 'Annualized rate of growth in the gross domestic product',
      'PPIACO': 'Measures the average change over time in the selling prices received by domestic producers for their output',
      'AWHMAN': 'Average hourly earnings of all employees on private nonfarm payrolls',
      'PRIME': 'The interest rate that commercial banks charge their most creditworthy customers',
      'RSAFS': 'Total receipts at stores that sell merchandise and related services to final consumers',
      'INDPRO': 'Measures the real output of all manufacturing, mining, and electric and gas utility establishments',
      'HOUST': 'Number of new residential construction projects that have begun during any particular month',
      'UMCSENT': 'Measures the degree of optimism that consumers feel about the overall state of the economy'
    };

    return descriptions[seriesId] || 'Economic indicator from Federal Reserve Economic Data';
  }
}

export const fredAPI = new FREDAPI(); 