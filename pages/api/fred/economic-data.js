import { getCachedData, CACHE_KEYS, CACHE_TTLS } from '../../../utils/cache';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.FRED_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'FRED API key not configured' });
  }

  try {
    // Use cached data or fetch fresh data
    const data = await getCachedData(
      CACHE_KEYS.ECONOMIC_DATA,
      async () => {
        console.log('[FRED API] Fetching economic indicators...');
        
        const indicators = [
          { id: 'GDP', name: 'Gross Domestic Product', series: 'GDP' },
          { id: 'UNRATE', name: 'Unemployment Rate', series: 'UNRATE' },
          { id: 'CPIAUCSL', name: 'Consumer Price Index', series: 'CPIAUCSL' },
          { id: 'FEDFUNDS', name: 'Federal Funds Rate', series: 'FEDFUNDS' },
          { id: 'DGS10', name: '10-Year Treasury Rate', series: 'DGS10' },
          { id: 'DEXUSEU', name: 'US/Euro Exchange Rate', series: 'DEXUSEU' },
          { id: 'DCOILWTICO', name: 'Crude Oil Prices', series: 'DCOILWTICO' },
          { id: 'PAYEMS', name: 'Total Nonfarm Payrolls', series: 'PAYEMS' },
          { id: 'INDPRO', name: 'Industrial Production', series: 'INDPRO' },
          { id: 'RSAFS', name: 'Retail Sales', series: 'RSAFS' },
          { id: 'HOUST', name: 'Housing Starts', series: 'HOUST' },
          { id: 'M2SL', name: 'M2 Money Supply', series: 'M2SL' },
          { id: 'DEXCHUS', name: 'China/US Exchange Rate', series: 'DEXCHUS' }
        ];

        const results = [];
        const currentDate = new Date();
        const endDate = currentDate.toISOString().split('T')[0];
        const startDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate()).toISOString().split('T')[0];

        for (const indicator of indicators) {
          try {
            const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${indicator.series}&api_key=${apiKey}&file_type=json&observation_start=${startDate}&observation_end=${endDate}&sort_order=desc&limit=2`;
            
            const response = await fetch(url);
            if (!response.ok) {
              console.warn(`[FRED API] Failed to fetch ${indicator.name}: ${response.status}`);
              continue;
            }

            const seriesData = await response.json();
            const observations = seriesData.observations || [];
            
            if (observations.length > 0) {
              const latest = observations[0];
              const previous = observations[1];
              
              const currentValue = parseFloat(latest.value);
              const previousValue = parseFloat(previous?.value || 0);
              const change = currentValue - previousValue;
              const changePercent = previousValue !== 0 ? (change / previousValue) * 100 : 0;
              
              results.push({
                id: indicator.id,
                name: indicator.name,
                series: indicator.series,
                currentValue: currentValue,
                previousValue: previousValue,
                change: change,
                changePercent: changePercent,
                date: latest.date,
                direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
                trend: Math.abs(changePercent) > 5 ? 'significant' : Math.abs(changePercent) > 2 ? 'moderate' : 'stable'
              });
            }
          } catch (error) {
            console.error(`[FRED API] Error fetching ${indicator.name}:`, error);
          }
        }

        console.log(`[FRED API] Successfully fetched indicators: ${results.length}`);
        
        return {
          success: true,
          indicators: results,
          timestamp: new Date().toISOString(),
          source: 'Federal Reserve Economic Data (FRED)'
        };
      },
      CACHE_TTLS.ECONOMIC_DATA
    );

    res.status(200).json(data);
  } catch (error) {
    console.error('[FRED API] Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch economic data',
      details: error.message 
    });
  }
} 