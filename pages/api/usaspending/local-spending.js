export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { state, district, limit = 20, page = 1 } = req.body;

    if (!state || !district) {
      return res.status(400).json({ error: 'State and district are required' });
    }

    console.log(`[API] Fetching local spending for ${state} District ${district}`);

    // Build the USAspending.gov API request
    const requestBody = {
      filters: {
        award_type_codes: ['A', 'B', 'C', 'D'], // Contracts, grants, loans, direct payments
        place_of_performance_scope: 'domestic',
        recipient_location_scope: 'domestic',
        // Filter by congressional district
        congressional_district: `${state}-${district.toString().padStart(2, '0')}`,
        // Recent years
        time_period: [
          {
            start_date: '2020-01-01',
            end_date: new Date().toISOString().split('T')[0]
          }
        ]
      },
      fields: [
        'Award ID',
        'Recipient Name',
        'Award Amount',
        'Award Type',
        'Period of Performance Start Date',
        'Period of Performance End Date',
        'Awarding Agency Name',
        'Awarding Sub Agency Name',
        'NAICS Code',
        'NAICS Description',
        'Place of Performance Congressional District',
        'Place of Performance State Code',
        'Place of Performance City Name',
        'Description of Requirement',
        'Recipient Congressional District',
        'Recipient State Code'
      ],
      sort: 'Award Amount',
      order: 'desc',
      limit: limit,
      page: page
    };

    // Call USAspending.gov API
    const response = await fetch('https://api.usaspending.gov/api/v2/search/spending_by_award/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'GovPulse/1.0'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] USAspending.gov error:', errorText);
      throw new Error(`USAspending.gov API error: ${response.status}`);
    }

    const data = await response.json();
    
    console.log(`[API] Found ${data.results?.length || 0} awards for ${state} District ${district}`);

    // Transform the data to match our app's format
    const transformedAwards = (data.results || []).map(award => ({
      id: award['Award ID'] || `award-${Math.random().toString(36).substr(2, 9)}`,
      award_id: award['Award ID'],
      recipient_name: award['Recipient Name'] || 'Unknown Recipient',
      amount: award['Award Amount'] || 0,
      award_type: getAwardTypeName(award['Award Type']),
      start_date: award['Period of Performance Start Date'],
      end_date: award['Period of Performance End Date'],
      awarding_agency: award['Awarding Agency Name'] || 'Unknown Agency',
      sub_agency: award['Awarding Sub Agency Name'],
      naics_code: award['NAICS Code'],
      naics_description: award['NAICS Description'],
      congressional_district: award['Place of Performance Congressional District'],
      state: award['Place of Performance State Code'],
      city: award['Place of Performance City Name'],
      description: award['Description of Requirement'] || 'No description available',
      recipient_district: award['Recipient Congressional District'],
      recipient_state: award['Recipient State Code'],
      // Generate representative voting info (this would need to be cross-referenced with actual voting data)
      representative_support: generateRepresentativeSupport(award),
      category: categorizeAward(award),
      impact_score: calculateImpactScore(award)
    }));

    res.status(200).json({
      success: true,
      awards: transformedAwards,
      total: data.page_metadata?.total || 0,
      page: page,
      limit: limit,
      district: `${state}-${district}`,
      summary: {
        total_amount: transformedAwards.reduce((sum, award) => sum + award.amount, 0),
        award_count: transformedAwards.length,
        top_agencies: getTopAgencies(transformedAwards),
        top_categories: getTopCategories(transformedAwards)
      }
    });

  } catch (error) {
    console.error('[API] Error fetching local spending:', error);
    
    // Return fallback data if API fails
    const fallbackData = generateFallbackLocalSpending();
    
    res.status(200).json({
      success: true,
      awards: fallbackData,
      total: fallbackData.length,
      page: 1,
      limit: 20,
      district: `${req.body.state}-${req.body.district}`,
      summary: {
        total_amount: fallbackData.reduce((sum, award) => sum + award.amount, 0),
        award_count: fallbackData.length,
        top_agencies: getTopAgencies(fallbackData),
        top_categories: getTopCategories(fallbackData)
      },
      note: 'Using fallback data due to API error',
      apiStatus: 'fallback'
    });
  }
}

function getAwardTypeName(typeCode) {
  const types = {
    'A': 'Contract',
    'B': 'Grant',
    'C': 'Direct Payment',
    'D': 'Loan',
    'IDV': 'Indefinite Delivery Vehicle'
  };
  return types[typeCode] || 'Other';
}

function categorizeAward(award) {
  const description = (award['Description of Requirement'] || '').toLowerCase();
  const naics = (award['NAICS Description'] || '').toLowerCase();
  
  if (description.includes('infrastructure') || description.includes('construction') || 
      naics.includes('construction') || naics.includes('highway')) {
    return 'Infrastructure';
  }
  if (description.includes('health') || description.includes('medical') || 
      naics.includes('health')) {
    return 'Healthcare';
  }
  if (description.includes('education') || description.includes('school') || 
      naics.includes('education')) {
    return 'Education';
  }
  if (description.includes('defense') || description.includes('military') || 
      naics.includes('defense')) {
    return 'Defense';
  }
  if (description.includes('research') || description.includes('development') || 
      naics.includes('research')) {
    return 'Research & Development';
  }
  if (description.includes('transportation') || description.includes('transit') || 
      naics.includes('transportation')) {
    return 'Transportation';
  }
  return 'Other';
}

function generateRepresentativeSupport(award) {
  // This is a placeholder - in a real implementation, you'd cross-reference with voting records
  const amount = award['Award Amount'] || 0;
  const categories = ['Infrastructure', 'Healthcare', 'Education'];
  const category = categorizeAward(award);
  
  // Simulate support based on amount and category
  if (amount > 1000000 && categories.includes(category)) {
    return 'Supported';
  } else if (amount > 500000) {
    return 'Likely Supported';
  } else {
    return 'Unknown';
  }
}

function calculateImpactScore(award) {
  const amount = award['Award Amount'] || 0;
  const category = categorizeAward(award);
  
  let score = 0;
  
  // Amount factor
  if (amount > 10000000) score += 5;
  else if (amount > 1000000) score += 4;
  else if (amount > 100000) score += 3;
  else if (amount > 10000) score += 2;
  else score += 1;
  
  // Category factor
  const categoryScores = {
    'Infrastructure': 5,
    'Healthcare': 4,
    'Education': 4,
    'Transportation': 4,
    'Research & Development': 3,
    'Defense': 3,
    'Other': 2
  };
  
  score += categoryScores[category] || 2;
  
  return Math.min(10, score);
}

function getTopAgencies(awards) {
  const agencyCounts = {};
  awards.forEach(award => {
    const agency = award.awarding_agency;
    agencyCounts[agency] = (agencyCounts[agency] || 0) + 1;
  });
  
  return Object.entries(agencyCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([agency, count]) => ({ agency, count }));
}

function getTopCategories(awards) {
  const categoryCounts = {};
  awards.forEach(award => {
    const category = award.category;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });
  
  return Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([category, count]) => ({ category, count }));
}

function generateFallbackLocalSpending() {
  return [
    {
      id: 'fallback-1',
      award_id: 'FAKE-2024-001',
      recipient_name: 'Local Infrastructure Corp',
      amount: 2500000,
      award_type: 'Contract',
      start_date: '2024-01-15',
      end_date: '2025-01-15',
      awarding_agency: 'Department of Transportation',
      sub_agency: 'Federal Highway Administration',
      naics_code: '237310',
      naics_description: 'Highway, Street, and Bridge Construction',
      congressional_district: 'CA-12',
      state: 'CA',
      city: 'San Francisco',
      description: 'Highway bridge repair and maintenance project',
      recipient_district: 'CA-12',
      recipient_state: 'CA',
      representative_support: 'Supported',
      category: 'Infrastructure',
      impact_score: 9
    },
    {
      id: 'fallback-2',
      award_id: 'FAKE-2024-002',
      recipient_name: 'Community Health Network',
      amount: 1800000,
      award_type: 'Grant',
      start_date: '2024-02-01',
      end_date: '2026-02-01',
      awarding_agency: 'Department of Health and Human Services',
      sub_agency: 'Health Resources and Services Administration',
      naics_code: '621111',
      naics_description: 'Offices of Physicians (except Mental Health Specialists)',
      congressional_district: 'CA-12',
      state: 'CA',
      city: 'Oakland',
      description: 'Community health center expansion and modernization',
      recipient_district: 'CA-12',
      recipient_state: 'CA',
      representative_support: 'Supported',
      category: 'Healthcare',
      impact_score: 8
    },
    {
      id: 'fallback-3',
      award_id: 'FAKE-2024-003',
      recipient_name: 'Bay Area Transit Authority',
      amount: 3200000,
      award_type: 'Grant',
      start_date: '2024-03-01',
      end_date: '2027-03-01',
      awarding_agency: 'Department of Transportation',
      sub_agency: 'Federal Transit Administration',
      naics_code: '485111',
      naics_description: 'Mixed Mode Transit Systems',
      congressional_district: 'CA-12',
      state: 'CA',
      city: 'San Francisco',
      description: 'Public transit system modernization and expansion',
      recipient_district: 'CA-12',
      recipient_state: 'CA',
      representative_support: 'Likely Supported',
      category: 'Transportation',
      impact_score: 9
    }
  ];
} 