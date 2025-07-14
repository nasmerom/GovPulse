export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { search, limit = 100, offset = 0, year = 2024, historical = false } = req.query;
    
    // Try multiple lobbyist disclosure API endpoints
    const apiEndpoints = [
      'https://lda.senate.gov/api/v1/lobbying-disclosures',
      'https://lda.senate.gov/api/v1/disclosures',
      'https://lda.senate.gov/api/v1/filings',
      'https://disclosures.house.gov/api/v1/lobbying',
      'https://disclosures.house.gov/api/v1/disclosures'
    ];

    let data = null;
    let successfulEndpoint = null;

    // Try each endpoint until one works
    for (const baseUrl of apiEndpoints) {
      try {
        let apiUrl = `${baseUrl}?limit=${limit}&offset=${offset}`;
        
        if (search) {
          apiUrl += `&search=${encodeURIComponent(search)}`;
        }

        console.log('Trying lobbyist disclosure API endpoint:', apiUrl);

        const response = await fetch(apiUrl, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'GovPulse/1.0',
            'Authorization': `Bearer ${process.env.LDA_API_KEY}`,
            'x-api-key': process.env.LDA_API_KEY
          },
          timeout: 5000
        });

        if (response.ok) {
          data = await response.json();
          successfulEndpoint = apiUrl;
          console.log('Successfully connected to:', apiUrl);
          break;
        } else {
          console.log(`Endpoint ${apiUrl} returned status: ${response.status}`);
        }
      } catch (error) {
        console.log(`Endpoint ${baseUrl} failed:`, error.message);
      }
    }

    // If no real API worked, use fallback data
    if (!data) {
      console.log('No real API endpoints worked, using fallback data');
      const fallbackData = generateFallbackLobbyingData();
      
      return res.status(200).json({
        success: true,
        disclosures: fallbackData,
        total: fallbackData.length,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: false
        },
        note: 'Using fallback data - real lobbyist disclosure APIs are not accessible',
        apiStatus: 'fallback'
      });
    }
    
    // Transform the API response to match our expected format
    console.log('Raw API response structure:', JSON.stringify(data.results?.[0], null, 2));
    console.log('Number of results:', data.results?.length);
    console.log('First result keys:', Object.keys(data.results?.[0] || {}));
    
    const transformedDisclosures = data.results?.map((disclosure, index) => {
      // Extract client name from nested object
      const clientName = disclosure.client?.name || disclosure.client_name?.name || disclosure.client_name || 'Unknown Client';
      
      // Extract registrant name from nested object  
      const registrantName = disclosure.registrant?.name || disclosure.registrant_name?.name || disclosure.registrant_name || 'Unknown Firm';

      // Get filing date for filtering
      const filingDate = disclosure.dt_posted || disclosure.filing_date || disclosure.period_begin || disclosure.created_date || disclosure.date_filed;
      
      // Temporarily disable date filtering to see what data we're getting
      // Filter to show only recent disclosures (last year)
      if (filingDate) {
        const date = new Date(filingDate);
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        
        console.log(`Disclosure date: ${filingDate} (${date.toISOString()}) for ${clientName}`);
        
        if (date < oneYearAgo) {
          console.log(`Filtering out old disclosure from ${filingDate} for ${clientName} (older than 1 year)`);
          return null; // Skip this disclosure
        }
      } else {
        // If no filing date, include it but log it
        console.log(`No filing date found for ${clientName}, including disclosure`);
      }

      console.log(`Transforming disclosure ${index}:`, {
        originalClient: disclosure.client,
        extractedClient: clientName,
        originalRegistrant: disclosure.registrant,
        extractedRegistrant: registrantName,
        filingDate: filingDate,
        allKeys: Object.keys(disclosure)
      });

      return {
        id: disclosure.filing_uuid || disclosure.id || disclosure.filing_id || `disclosure-${index}`,
        client_company: clientName,
        lobbying_firm_hired: registrantName,
        contract_value: disclosure.income || disclosure.expenses || disclosure.amount || disclosure.receipts || 0,
        contract_date: filingDate || new Date().toISOString().split('T')[0],
        filing_type: disclosure.filing_type_display || disclosure.filing_type || disclosure.type || 'Lobbying Disclosure',
        issues: disclosure.lobbying_activities?.map(activity => activity.general_issue_area?.name || activity.issue_area || 'General Lobbying') || [],
        registrant: registrantName,
        lobbyists: disclosure.lobbying_activities?.flatMap(activity => 
          activity.lobbyists?.map(lobbyist => 
            `${lobbyist.first_name || ''} ${lobbyist.last_name || ''}`.trim()
          ) || []
        ) || [],
        ai_motive_analysis: generateMotiveAnalysis(disclosure, clientName),
        period_begin: disclosure.filing_period_display || disclosure.period_begin || disclosure.reporting_period_start,
        period_end: disclosure.termination_date || disclosure.period_end || disclosure.reporting_period_end,
        status: disclosure.termination_date ? 'Terminated' : 'Active'
      };
    }).filter(disclosure => disclosure !== null) || []; // Remove null entries (filtered out old disclosures)

    console.log(`Successfully fetched ${transformedDisclosures.length} lobbyist disclosures from ${successfulEndpoint}`);

    res.status(200).json({
      success: true,
      disclosures: transformedDisclosures,
      total: data.count || transformedDisclosures.length,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: data.next ? true : false
      },
      apiStatus: 'real',
      source: successfulEndpoint
    });

  } catch (error) {
    console.error('Error fetching lobbyist disclosures:', error);
    
    // Return fallback data if API fails
    const fallbackData = generateFallbackLobbyingData();
    
    res.status(200).json({
      success: true,
      disclosures: fallbackData,
      total: fallbackData.length,
      pagination: {
        limit: parseInt(req.query.limit || 100),
        offset: parseInt(req.query.offset || 0),
        hasMore: false
      },
      note: 'Using fallback data due to API error',
      apiStatus: 'fallback',
      error: error.message
    });
  }
}

function generateMotiveAnalysis(disclosure, clientName) {
  const issues = disclosure.issues || disclosure.lobbying_issues || disclosure.subjects || disclosure.issue_areas || [];
  
  if (issues.length > 0) {
    const mainIssue = issues[0];
    return `${clientName} is lobbying on ${mainIssue.toLowerCase()} issues, likely seeking favorable policy outcomes or regulatory changes.`;
  }
  
  return `${clientName} has filed lobbying disclosures, indicating active engagement with federal policymakers on various legislative and regulatory matters.`;
}

function generateFallbackLobbyingData() {
  return [
    {
      id: 1,
      client_company: "TechCorp Industries",
      lobbying_firm_hired: "Washington Strategies LLC",
      contract_value: 250000,
      contract_date: "2024-01-15",
      filing_type: "Lobbying Disclosure",
      issues: ["AI Regulation", "Tech Policy", "Data Privacy"],
      registrant: "Washington Strategies LLC",
      lobbyists: ["John Smith", "Sarah Johnson"],
      ai_motive_analysis: "TechCorp is lobbying for favorable AI regulation to maintain market dominance in emerging technologies.",
      period_begin: "2024-01-01",
      period_end: "2024-03-31",
      status: "Active"
    },
    {
      id: 2,
      client_company: "BigPharma Inc",
      lobbying_firm_hired: "Healthcare Partners Group",
      contract_value: 450000,
      contract_date: "2024-01-10",
      filing_type: "Lobbying Disclosure",
      issues: ["Drug Pricing", "Patent Law", "Healthcare Reform"],
      registrant: "Healthcare Partners Group",
      lobbyists: ["Michael Brown", "Lisa Davis"],
      ai_motive_analysis: "BigPharma seeks to influence drug pricing policies and patent protection laws.",
      period_begin: "2024-01-01",
      period_end: "2024-03-31",
      status: "Active"
    },
    {
      id: 3,
      client_company: "Energy Solutions Co",
      lobbying_firm_hired: "Green Energy Advocates",
      contract_value: 320000,
      contract_date: "2024-01-08",
      filing_type: "Lobbying Disclosure",
      issues: ["Renewable Energy", "Carbon Tax", "Climate Policy"],
      registrant: "Green Energy Advocates",
      lobbyists: ["Robert Wilson", "Emily Chen"],
      ai_motive_analysis: "Energy Solutions is pushing for renewable energy subsidies and carbon tax exemptions.",
      period_begin: "2024-01-01",
      period_end: "2024-03-31",
      status: "Active"
    },
    {
      id: 4,
      client_company: "Defense Dynamics",
      lobbying_firm_hired: "National Security Consultants",
      contract_value: 680000,
      contract_date: "2024-01-05",
      filing_type: "Lobbying Disclosure",
      issues: ["Defense Spending", "Military Contracts", "National Security"],
      registrant: "National Security Consultants",
      lobbyists: ["David Miller", "Jennifer Lee"],
      ai_motive_analysis: "Defense Dynamics aims to secure military contracts and influence defense spending priorities.",
      period_begin: "2024-01-01",
      period_end: "2024-03-31",
      status: "Active"
    },
    {
      id: 5,
      client_company: "Banking Consortium",
      lobbying_firm_hired: "Financial Policy Group",
      contract_value: 520000,
      contract_date: "2024-01-03",
      filing_type: "Lobbying Disclosure",
      issues: ["Financial Regulation", "Banking Policy", "Consumer Protection"],
      registrant: "Financial Policy Group",
      lobbyists: ["Thomas Anderson", "Rachel Green"],
      ai_motive_analysis: "Banking Consortium is lobbying against stricter financial regulations and for favorable banking policies.",
      period_begin: "2024-01-01",
      period_end: "2024-03-31",
      status: "Active"
    }
  ];
} 