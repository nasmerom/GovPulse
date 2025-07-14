export default async function handler(req, res) {
  const { method, query } = req;
  
  if (method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.CONGRESS_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Congress.gov API key not configured' });
    }

    const baseUrl = 'https://api.congress.gov/v3';
    const url = new URL(`${baseUrl}/bill`);
    url.searchParams.append('api_key', apiKey);
    
    // Add query parameters
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ 
        error: `Congress.gov API error: ${response.status} ${response.statusText}`,
        details: errorText
      });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Congress.gov API request failed:', error);
    res.status(500).json({ error: error.message });
  }
} 