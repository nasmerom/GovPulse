export default async function handler(req, res) {
  const startTime = Date.now();
  
  try {
    // Check if API key exists
    const apiKey = process.env.CONGRESS_API_KEY;
    const hasApiKey = !!apiKey;
    
    if (!hasApiKey) {
      return res.status(200).json({
        hasApiKey: false,
        success: false,
        error: 'No API key found in environment variables',
        responseTime: Date.now() - startTime
      });
    }

    // Test the Congress.gov API
    const baseUrl = 'https://api.congress.gov/v3';
    const url = `${baseUrl}/bill?api_key=${apiKey}&limit=10`;
    
    const response = await fetch(url);
    const responseTime = Date.now() - startTime;
    
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(200).json({
        hasApiKey: true,
        success: false,
        error: `API call failed: ${response.status} ${response.statusText} - ${errorText}`,
        responseTime
      });
    }

    const data = await response.json();
    
    // Map the data to match our app's format
    const bills = data.bills?.map(bill => ({
      id: bill.number || `bill-${Math.random().toString(36).substr(2, 9)}`,
      bill_number: bill.number || 'Unknown',
      title: bill.title || 'No title available',
      status: bill.latestAction?.text?.toLowerCase().includes('committee') ? 'committee' : 'introduced',
      chamber: bill.originChamber || 'Unknown',
      last_action: bill.latestAction?.text || 'No recent action',
      last_action_date: bill.latestAction?.actionDate
    })) || [];

    return res.status(200).json({
      hasApiKey: true,
      success: true,
      billsCount: bills.length,
      bills: bills,
      responseTime,
      rawData: {
        totalBills: data.bills?.length || 0,
        pagination: data.pagination,
        sampleBill: data.bills?.[0] ? {
          number: data.bills[0].number,
          title: data.bills[0].title?.substring(0, 50) + '...',
          latestAction: data.bills[0].latestAction?.text?.substring(0, 50) + '...'
        } : null
      }
    });

  } catch (error) {
    return res.status(200).json({
      hasApiKey: !!process.env.CONGRESS_API_KEY,
      success: false,
      error: error.message,
      responseTime: Date.now() - startTime
    });
  }
} 