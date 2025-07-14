export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      industry, 
      state, 
      naics_codes = [], 
      limit = 50, 
      page = 1,
      timeRange = '1y',
      analysisType = 'opportunities'
    } = req.body;

    if (!industry || !state) {
      return res.status(400).json({ error: 'Industry and state are required' });
    }

    console.log(`[API] Fetching federal spending for ${industry} industry in ${state}`);

    // Map industries to NAICS codes for better filtering
    const industryNAICSMap = {
      'technology': ['511210', '541511', '541512', '541519', '518210', '541330'],
      'healthcare': ['621111', '621112', '621210', '621310', '621320', '621330', '621340', '621350', '621391', '621399'],
      'finance': ['522110', '522120', '522130', '522190', '522210', '522220', '522291', '522292', '522298', '522310', '522320', '522390'],
      'energy': ['221111', '221112', '221113', '221114', '221115', '221116', '221117', '221118', '221119', '221121', '221122'],
      'manufacturing': ['311', '312', '313', '314', '315', '316', '321', '322', '323', '324', '325', '326', '327', '331', '332', '333', '334', '335', '336', '337', '339'],
      'agriculture': ['111', '112', '113', '114', '115', '116'],
      'transportation': ['481', '482', '483', '484', '485', '486', '487', '488', '491', '492', '493'],
      'defense': ['332996', '332997', '332998', '332999', '333415', '333511', '333512', '333513', '333514', '333515', '333516', '333517', '333518', '333519'],
      'real_estate': ['531110', '531120', '531130', '531190', '531210', '531311', '531312', '531320', '531390'],
      'retail': ['441', '442', '443', '444', '445', '446', '447', '448', '451', '452', '453', '454']
    };

    const relevantNAICS = industryNAICSMap[industry] || [];
    const allNAICS = [...relevantNAICS, ...naics_codes];

    // Build the USAspending.gov API request
    const requestBody = {
      filters: {
        award_type_codes: ['A', 'B', 'C', 'D'], // Contracts, grants, loans, direct payments
        place_of_performance_scope: 'domestic',
        recipient_location_scope: 'domestic',
        // Filter by state
        place_of_performance_state_code: state,
        // Filter by NAICS codes if available
        ...(allNAICS.length > 0 && { naics_codes: allNAICS }),
        // Recent years based on timeRange
        time_period: [
          {
            start_date: getStartDate(timeRange),
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
        'Recipient State Code',
        'Contract Award Type',
        'Contract Pricing Type',
        'Contract Type'
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
    
    console.log(`[API] Found ${data.results?.length || 0} awards for ${industry} in ${state}`);

    // Transform the data for business intelligence
    const transformedAwards = (data.results || []).map(award => ({
      id: award['Award ID'] || `award-${Math.random().toString(36).substr(2, 9)}`,
      award_id: award['Award ID'],
      recipient_name: award['Recipient Name'] || 'Unknown Recipient',
      amount: award['Award Amount'] || 0,
      award_type: getAwardTypeName(award['Award Type']),
      contract_type: award['Contract Type'] || 'N/A',
      pricing_type: award['Contract Pricing Type'] || 'N/A',
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
      opportunity_score: calculateOpportunityScore(award, industry),
      competition_level: assessCompetitionLevel(award),
      market_trend: assessMarketTrend(award, industry)
    }));

    // Generate business intelligence insights
    const insights = generateBusinessInsights(transformedAwards, industry, state);

    res.status(200).json({
      success: true,
      awards: transformedAwards,
      total: data.page_metadata?.total || 0,
      page: page,
      limit: limit,
      industry: industry,
      state: state,
      insights: insights,
      summary: {
        total_amount: transformedAwards.reduce((sum, award) => sum + award.amount, 0),
        award_count: transformedAwards.length,
        top_agencies: getTopAgencies(transformedAwards),
        top_contractors: getTopContractors(transformedAwards),
        opportunity_distribution: getOpportunityDistribution(transformedAwards),
        market_trends: getMarketTrends(transformedAwards)
      }
    });

  } catch (error) {
    console.error('[API] Error fetching federal spending:', error);
    
    // Return fallback data if API fails
    const fallbackData = generateFallbackFederalSpending(req.body.industry, req.body.state);
    
    res.status(200).json({
      success: true,
      awards: fallbackData,
      total: fallbackData.length,
      page: 1,
      limit: 50,
      industry: req.body.industry,
      state: req.body.state,
      insights: generateBusinessInsights(fallbackData, req.body.industry, req.body.state),
      summary: {
        total_amount: fallbackData.reduce((sum, award) => sum + award.amount, 0),
        award_count: fallbackData.length,
        top_agencies: getTopAgencies(fallbackData),
        top_contractors: getTopContractors(fallbackData),
        opportunity_distribution: getOpportunityDistribution(fallbackData),
        market_trends: getMarketTrends(fallbackData)
      },
      note: 'Using fallback data due to API error',
      apiStatus: 'fallback'
    });
  }
}

function getStartDate(timeRange) {
  const now = new Date();
  switch (timeRange) {
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    case '1y':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    default:
      return '2020-01-01';
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

function calculateOpportunityScore(award, industry) {
  const amount = award['Award Amount'] || 0;
  const naics = (award['NAICS Description'] || '').toLowerCase();
  const description = (award['Description of Requirement'] || '').toLowerCase();
  
  let score = 0;
  
  // Amount factor (higher amounts = higher opportunity)
  if (amount > 10000000) score += 5;
  else if (amount > 1000000) score += 4;
  else if (amount > 100000) score += 3;
  else if (amount > 10000) score += 2;
  else score += 1;
  
  // Industry relevance
  const industryKeywords = {
    'technology': ['software', 'technology', 'digital', 'computer', 'information', 'data', 'system'],
    'healthcare': ['health', 'medical', 'clinical', 'patient', 'hospital', 'pharmaceutical'],
    'finance': ['financial', 'banking', 'investment', 'insurance', 'accounting', 'audit'],
    'energy': ['energy', 'power', 'electric', 'renewable', 'solar', 'wind', 'fossil'],
    'manufacturing': ['manufacturing', 'production', 'assembly', 'industrial', 'factory'],
    'agriculture': ['agriculture', 'farming', 'crop', 'livestock', 'food', 'agricultural'],
    'transportation': ['transportation', 'logistics', 'shipping', 'freight', 'transit'],
    'defense': ['defense', 'military', 'weapon', 'security', 'intelligence'],
    'real_estate': ['real estate', 'property', 'construction', 'development', 'housing'],
    'retail': ['retail', 'commerce', 'merchandise', 'store', 'sales']
  };
  
  const keywords = industryKeywords[industry] || [];
  const relevanceScore = keywords.reduce((score, keyword) => {
    if (naics.includes(keyword) || description.includes(keyword)) {
      return score + 2;
    }
    return score;
  }, 0);
  
  score += Math.min(5, relevanceScore);
  
  return Math.min(10, score);
}

function assessCompetitionLevel(award) {
  const amount = award['Award Amount'] || 0;
  const contractType = award['Contract Type'] || '';
  
  if (amount > 10000000) return 'High Competition';
  if (amount > 1000000) return 'Medium Competition';
  if (contractType.includes('Sole Source')) return 'Low Competition';
  return 'Medium Competition';
}

function assessMarketTrend(award, industry) {
  const amount = award['Award Amount'] || 0;
  const date = award['Period of Performance Start Date'];
  
  // Simple trend analysis based on amount and recency
  if (amount > 1000000 && date && new Date(date) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)) {
    return 'Growing';
  } else if (amount > 500000) {
    return 'Stable';
  } else {
    return 'Declining';
  }
}

function generateBusinessInsights(awards, industry, state) {
  const totalAmount = awards.reduce((sum, award) => sum + award.amount, 0);
  const avgAmount = totalAmount / awards.length || 0;
  const highOpportunityAwards = awards.filter(a => a.opportunity_score >= 7);
  
  return {
    market_size: {
      total_spending: totalAmount,
      average_award: avgAmount,
      award_count: awards.length
    },
    opportunities: {
      high_opportunity_count: highOpportunityAwards.length,
      high_opportunity_amount: highOpportunityAwards.reduce((sum, a) => sum + a.amount, 0),
      top_opportunities: highOpportunityAwards.slice(0, 5)
    },
    competition: {
      low_competition_awards: awards.filter(a => a.competition_level === 'Low Competition').length,
      medium_competition_awards: awards.filter(a => a.competition_level === 'Medium Competition').length,
      high_competition_awards: awards.filter(a => a.competition_level === 'High Competition').length
    },
    trends: {
      growing_market: awards.filter(a => a.market_trend === 'Growing').length,
      stable_market: awards.filter(a => a.market_trend === 'Stable').length,
      declining_market: awards.filter(a => a.market_trend === 'Declining').length
    },
    recommendations: generateRecommendations(awards, industry, state)
  };
}

function generateRecommendations(awards, industry, state) {
  const recommendations = [];
  
  const highValueAwards = awards.filter(a => a.amount > 1000000);
  if (highValueAwards.length > 0) {
    recommendations.push({
      type: 'opportunity',
      title: 'High-Value Contract Opportunities',
      description: `${highValueAwards.length} contracts over $1M available in ${state}`,
      priority: 'high'
    });
  }
  
  const lowCompetitionAwards = awards.filter(a => a.competition_level === 'Low Competition');
  if (lowCompetitionAwards.length > 0) {
    recommendations.push({
      type: 'strategy',
      title: 'Low Competition Entry Points',
      description: `${lowCompetitionAwards.length} awards with reduced competition`,
      priority: 'medium'
    });
  }
  
  const growingTrend = awards.filter(a => a.market_trend === 'Growing').length;
  if (growingTrend > awards.length * 0.3) {
    recommendations.push({
      type: 'trend',
      title: 'Growing Market Segment',
      description: 'Market showing positive growth trends',
      priority: 'high'
    });
  }
  
  return recommendations;
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

function getTopContractors(awards) {
  const contractorCounts = {};
  awards.forEach(award => {
    const contractor = award.recipient_name;
    contractorCounts[contractor] = (contractorCounts[contractor] || 0) + 1;
  });
  
  return Object.entries(contractorCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([contractor, count]) => ({ contractor, count }));
}

function getOpportunityDistribution(awards) {
  const distribution = {
    'High Opportunity (8-10)': awards.filter(a => a.opportunity_score >= 8).length,
    'Medium Opportunity (5-7)': awards.filter(a => a.opportunity_score >= 5 && a.opportunity_score < 8).length,
    'Low Opportunity (1-4)': awards.filter(a => a.opportunity_score < 5).length
  };
  
  return distribution;
}

function getMarketTrends(awards) {
  const trends = {
    'Growing': awards.filter(a => a.market_trend === 'Growing').length,
    'Stable': awards.filter(a => a.market_trend === 'Stable').length,
    'Declining': awards.filter(a => a.market_trend === 'Declining').length
  };
  
  return trends;
}

function generateFallbackFederalSpending(industry, state) {
  const fallbackAwards = [
    {
      id: 'fallback-1',
      award_id: 'FAKE-001',
      recipient_name: 'Tech Solutions Inc.',
      amount: 2500000,
      award_type: 'Contract',
      contract_type: 'Fixed Price',
      pricing_type: 'Firm Fixed Price',
      start_date: '2024-01-15',
      end_date: '2025-01-15',
      awarding_agency: 'Department of Defense',
      sub_agency: 'Defense Information Systems Agency',
      naics_code: '541511',
      naics_description: 'Custom Computer Programming Services',
      congressional_district: 'CA-12',
      state: state,
      city: 'San Francisco',
      description: 'Software development and system integration services',
      opportunity_score: 8,
      competition_level: 'Medium Competition',
      market_trend: 'Growing'
    },
    {
      id: 'fallback-2',
      award_id: 'FAKE-002',
      recipient_name: 'Healthcare Systems LLC',
      amount: 1800000,
      award_type: 'Contract',
      contract_type: 'Cost Plus',
      pricing_type: 'Cost Plus Fixed Fee',
      start_date: '2024-02-01',
      end_date: '2025-02-01',
      awarding_agency: 'Department of Health and Human Services',
      sub_agency: 'Centers for Medicare & Medicaid Services',
      naics_code: '621111',
      naics_description: 'Offices of Physicians (except Mental Health Specialists)',
      congressional_district: 'CA-12',
      state: state,
      city: 'Los Angeles',
      description: 'Healthcare management and patient care coordination',
      opportunity_score: 7,
      competition_level: 'Low Competition',
      market_trend: 'Stable'
    }
  ];
  
  return fallbackAwards;
} 