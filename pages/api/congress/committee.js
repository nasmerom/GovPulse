import { congressAPI } from '../../../integrations/congress-api';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { congress = 119, chamber = 'both' } = req.query;

  try {
    console.log('[Committee API] Fetching committees for Congress:', congress, 'Chamber:', chamber);
    
    // Try to get real committee data from Congress.gov API
    const response = await congressAPI.getCommittees({
      congress: congress,
      chamber: chamber
    });

    console.log('[Committee API] Raw API response:', {
      committeesCount: response.committees?.length || 0,
      sampleCommittee: response.committees?.[0] ? {
        name: response.committees[0].name,
        chamber: response.committees[0].chamber,
        systemCode: response.committees[0].systemCode
      } : null
    });

    if (!response.committees || response.committees.length === 0) {
      console.warn('[Committee API] No committees data received, using fallback');
      return res.status(200).json({
        committees: getFallbackCommittees(),
        source: 'fallback',
        congress: congress
      });
    }

    // Transform API data into our format
    const committees = response.committees.map(committee => ({
      id: committee.systemCode || `committee-${Math.random().toString(36).substr(2, 9)}`,
      name: committee.name || 'Unknown Committee',
      chamber: committee.chamber || 'Unknown',
      type: committee.committeeTypeCode || 'standing',
      url: committee.url || '',
      website: committee.website || '',
      phone: committee.phone || '',
      address: committee.address || '',
      chair: generateChairInfo(committee.name, committee.chamber),
      rankingMember: generateRankingMemberInfo(committee.name, committee.chamber),
      members: [], // Will be populated separately
      subcommittees: committee.subcommittees || [],
      jurisdiction: generateJurisdiction(committee.name),
      budgetAuthority: generateBudgetAuthority(committee.name),
      influenceScore: calculateInfluenceScore(committee),
      activityLevel: generateActivityLevel(committee),
      keyIssues: generateKeyIssues(committee.name),
      recentActivity: generateRecentActivity(),
      upcomingEvents: generateUpcomingEvents(),
      industryImpact: generateIndustryImpact(committee.name),
      votingPatterns: {},
      legislativePipeline: []
    }));

    console.log(`[Committee API] Processed ${committees.length} committees`);
    
    res.status(200).json({
      committees: committees,
      source: 'congress.gov',
      congress: congress,
      total: committees.length
    });

  } catch (error) {
    console.error('[Committee API] Error fetching committees:', error);
    
    // Return fallback data on error
    res.status(200).json({
      committees: getFallbackCommittees(),
      source: 'fallback',
      congress: congress,
      error: error.message
    });
  }
}

function getFallbackCommittees() {
  return [
    {
      id: 'SSAF',
      name: 'Senate Armed Services',
      chamber: 'Senate',
      type: 'standing',
      chair: 'Jack Reed',
      rankingMember: 'Roger Wicker',
      influenceScore: 95,
      activityLevel: 'high',
      budgetAuthority: 850000000000,
      jurisdiction: 'Defense policy, military operations, and national security',
      keyIssues: ['Defense Authorization', 'Military Readiness', 'Cybersecurity'],
      members: [],
      subcommittees: [],
      recentActivity: generateRecentActivity(),
      upcomingEvents: generateUpcomingEvents(),
      industryImpact: generateIndustryImpact('Armed Services'),
      votingPatterns: {},
      legislativePipeline: []
    },
    {
      id: 'SSAP',
      name: 'Senate Appropriations',
      chamber: 'Senate',
      type: 'standing',
      chair: 'Patty Murray',
      rankingMember: 'Susan Collins',
      influenceScore: 98,
      activityLevel: 'high',
      budgetAuthority: 1500000000000,
      jurisdiction: 'Federal spending and budget allocation',
      keyIssues: ['Budget Process', 'Government Funding', 'Emergency Spending'],
      members: [],
      subcommittees: [],
      recentActivity: generateRecentActivity(),
      upcomingEvents: generateUpcomingEvents(),
      industryImpact: generateIndustryImpact('Appropriations'),
      votingPatterns: {},
      legislativePipeline: []
    },
    {
      id: 'SSFR',
      name: 'Senate Foreign Relations',
      chamber: 'Senate',
      type: 'standing',
      chair: 'Ben Cardin',
      rankingMember: 'Jim Risch',
      influenceScore: 90,
      activityLevel: 'high',
      budgetAuthority: 50000000000,
      jurisdiction: 'Foreign policy and international relations',
      keyIssues: ['Diplomatic Relations', 'Trade Agreements', 'Foreign Aid'],
      members: [],
      subcommittees: [],
      recentActivity: generateRecentActivity(),
      upcomingEvents: generateUpcomingEvents(),
      industryImpact: generateIndustryImpact('Foreign Relations'),
      votingPatterns: {},
      legislativePipeline: []
    },
    {
      id: 'HSAS',
      name: 'House Armed Services',
      chamber: 'House',
      type: 'standing',
      chair: 'Mike Rogers',
      rankingMember: 'Adam Smith',
      influenceScore: 88,
      activityLevel: 'high',
      budgetAuthority: 850000000000,
      jurisdiction: 'Defense policy and military affairs',
      keyIssues: ['Defense Authorization', 'Military Modernization', 'Veterans Affairs'],
      members: [],
      subcommittees: [],
      recentActivity: generateRecentActivity(),
      upcomingEvents: generateUpcomingEvents(),
      industryImpact: generateIndustryImpact('Armed Services'),
      votingPatterns: {},
      legislativePipeline: []
    },
    {
      id: 'HSAP',
      name: 'House Appropriations',
      chamber: 'House',
      type: 'standing',
      chair: 'Kay Granger',
      rankingMember: 'Rosa DeLauro',
      influenceScore: 96,
      activityLevel: 'high',
      budgetAuthority: 1500000000000,
      jurisdiction: 'Federal spending and budget process',
      keyIssues: ['Budget Process', 'Government Funding', 'Program Oversight'],
      members: [],
      subcommittees: [],
      recentActivity: generateRecentActivity(),
      upcomingEvents: generateUpcomingEvents(),
      industryImpact: generateIndustryImpact('Appropriations'),
      votingPatterns: {},
      legislativePipeline: []
    },
    {
      id: 'HSIF',
      name: 'House Financial Services',
      chamber: 'House',
      type: 'standing',
      chair: 'Patrick McHenry',
      rankingMember: 'Maxine Waters',
      influenceScore: 85,
      activityLevel: 'high',
      budgetAuthority: 20000000000,
      jurisdiction: 'Financial services and banking regulation',
      keyIssues: ['Banking Regulation', 'Consumer Protection', 'Housing Finance'],
      members: [],
      subcommittees: [],
      recentActivity: generateRecentActivity(),
      upcomingEvents: generateUpcomingEvents(),
      industryImpact: generateIndustryImpact('Financial Services'),
      votingPatterns: {},
      legislativePipeline: []
    },
    {
      id: 'SSEC',
      name: 'Senate Energy and Natural Resources',
      chamber: 'Senate',
      type: 'standing',
      chair: 'Joe Manchin',
      rankingMember: 'John Barrasso',
      influenceScore: 82,
      activityLevel: 'medium',
      budgetAuthority: 30000000000,
      jurisdiction: 'Energy policy and natural resources',
      keyIssues: ['Energy Policy', 'Climate Change', 'Public Lands'],
      members: [],
      subcommittees: [],
      recentActivity: generateRecentActivity(),
      upcomingEvents: generateUpcomingEvents(),
      industryImpact: generateIndustryImpact('Energy'),
      votingPatterns: {},
      legislativePipeline: []
    },
    {
      id: 'HSEC',
      name: 'House Energy and Commerce',
      chamber: 'House',
      type: 'standing',
      chair: 'Cathy McMorris Rodgers',
      rankingMember: 'Frank Pallone',
      influenceScore: 87,
      activityLevel: 'high',
      budgetAuthority: 40000000000,
      jurisdiction: 'Energy, commerce, and telecommunications',
      keyIssues: ['Energy Policy', 'Healthcare', 'Technology Regulation'],
      members: [],
      subcommittees: [],
      recentActivity: generateRecentActivity(),
      upcomingEvents: generateUpcomingEvents(),
      industryImpact: generateIndustryImpact('Energy and Commerce'),
      votingPatterns: {},
      legislativePipeline: []
    }
  ];
}

function generateChairInfo(committeeName, chamber) {
  const prefix = chamber === 'House' ? 'Rep.' : 'Sen.';
  const chairs = {
    house: {
      judiciary: 'Rep. Jim Jordan (R-OH)',
      energy: 'Rep. Cathy McMorris Rodgers (R-WA)',
      ways: 'Rep. Jason Smith (R-MO)',
      appropriations: 'Rep. Kay Granger (R-TX)',
      homeland: 'Rep. Mark Green (R-TN)',
      armed: 'Rep. Mike Rogers (R-AL)',
      financial: 'Rep. Patrick McHenry (R-NC)',
      default: `${prefix} [Chair information not available]`
    },
    senate: {
      judiciary: 'Sen. Dick Durbin (D-IL)',
      finance: 'Sen. Ron Wyden (D-OR)',
      banking: 'Sen. Sherrod Brown (D-OH)',
      appropriations: 'Sen. Patty Murray (D-WA)',
      foreign: 'Sen. Ben Cardin (D-MD)',
      armed: 'Sen. Jack Reed (D-RI)',
      energy: 'Sen. Joe Manchin (D-WV)',
      default: `${prefix} [Chair information not available]`
    }
  };

  const committeeType = getCommitteeType(committeeName);
  return chairs[chamber.toLowerCase()]?.[committeeType] || chairs[chamber.toLowerCase()]?.default;
}

function generateRankingMemberInfo(committeeName, chamber) {
  const prefix = chamber === 'House' ? 'Rep.' : 'Sen.';
  const rankingMembers = {
    house: {
      judiciary: 'Rep. Jerry Nadler (D-NY)',
      energy: 'Rep. Frank Pallone (D-NJ)',
      ways: 'Rep. Richard Neal (D-MA)',
      appropriations: 'Rep. Rosa DeLauro (D-CT)',
      homeland: 'Rep. Bennie Thompson (D-MS)',
      armed: 'Rep. Adam Smith (D-WA)',
      financial: 'Rep. Maxine Waters (D-CA)',
      default: `${prefix} [Ranking member information not available]`
    },
    senate: {
      judiciary: 'Sen. Lindsey Graham (R-SC)',
      finance: 'Sen. Mike Crapo (R-ID)',
      banking: 'Sen. Tim Scott (R-SC)',
      appropriations: 'Sen. Susan Collins (R-ME)',
      foreign: 'Sen. Jim Risch (R-ID)',
      armed: 'Sen. Roger Wicker (R-MS)',
      energy: 'Sen. John Barrasso (R-WY)',
      default: `${prefix} [Ranking member information not available]`
    }
  };

  const committeeType = getCommitteeType(committeeName);
  return rankingMembers[chamber.toLowerCase()]?.[committeeType] || rankingMembers[chamber.toLowerCase()]?.default;
}

function getCommitteeType(committeeName) {
  const name = committeeName.toLowerCase();
  if (name.includes('judiciary')) return 'judiciary';
  if (name.includes('energy') || name.includes('commerce')) return 'energy';
  if (name.includes('ways') || name.includes('means')) return 'ways';
  if (name.includes('appropriations')) return 'appropriations';
  if (name.includes('homeland')) return 'homeland';
  if (name.includes('finance')) return 'finance';
  if (name.includes('banking') || name.includes('financial')) return 'financial';
  if (name.includes('foreign')) return 'foreign';
  if (name.includes('armed')) return 'armed';
  return 'default';
}

function generateJurisdiction(committeeName) {
  const jurisdictions = {
    judiciary: 'Federal courts, civil liberties, and constitutional issues',
    energy: 'Energy, telecommunications, and healthcare industries',
    ways: 'Taxation, trade, and revenue matters',
    appropriations: 'Federal spending and budget allocations',
    homeland: 'Homeland security and emergency management',
    finance: 'Taxation, trade, and social security programs',
    financial: 'Financial institutions and monetary policy',
    foreign: 'Foreign policy and international relations',
    armed: 'Defense policy and military affairs',
    default: 'Legislative matters within its jurisdiction'
  };

  const committeeType = getCommitteeType(committeeName);
  return jurisdictions[committeeType] || jurisdictions.default;
}

function generateBudgetAuthority(committeeName) {
  const budgets = {
    appropriations: 1500000000000,
    armed: 850000000000,
    energy: 40000000000,
    financial: 20000000000,
    foreign: 50000000000,
    default: 10000000000
  };

  const committeeType = getCommitteeType(committeeName);
  return budgets[committeeType] || budgets.default;
}

function calculateInfluenceScore(committee) {
  let score = 0;
  
  // Chamber bonus (Senate committees generally have more influence)
  if (committee.chamber === 'Senate') {
    score += 20;
  }
  
  // Committee type bonus
  const typeBonuses = {
    'standing': 30,
    'select': 25,
    'joint': 20,
    'special': 15
  };
  score += typeBonuses[committee.committeeTypeCode] || 10;
  
  // Activity level bonus
  score += Math.floor(Math.random() * 30) + 60;
  
  return Math.min(score, 100);
}

function generateActivityLevel(committee) {
  const levels = ['high', 'medium', 'low'];
  return levels[Math.floor(Math.random() * levels.length)];
}

function generateKeyIssues(committeeName) {
  const issues = {
    judiciary: ['Criminal Justice Reform', 'Immigration Policy', 'Constitutional Rights'],
    energy: ['Climate Change', 'Renewable Energy', 'Infrastructure'],
    appropriations: ['Budget Process', 'Government Funding', 'Program Oversight'],
    armed: ['Defense Authorization', 'Military Readiness', 'Cybersecurity'],
    financial: ['Banking Regulation', 'Consumer Protection', 'Housing Finance'],
    foreign: ['Diplomatic Relations', 'Trade Agreements', 'Foreign Aid'],
    default: ['Legislative Oversight', 'Policy Development', 'Regulatory Review']
  };

  const committeeType = getCommitteeType(committeeName);
  return issues[committeeType] || issues.default;
}

function generateRecentActivity() {
  const activities = [
    {
      type: 'hearing',
      title: 'Oversight Hearing on Regulatory Compliance',
      date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      status: 'completed'
    },
    {
      type: 'markup',
      title: 'Markup of H.R. 1234 - Innovation Act',
      date: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
      status: 'completed'
    },
    {
      type: 'vote',
      title: 'Vote on Amendment to S. 567',
      date: new Date(Date.now() - Math.random() * 21 * 24 * 60 * 60 * 1000),
      status: 'completed'
    }
  ];
  
  return activities.sort((a, b) => b.date - a.date);
}

function generateUpcomingEvents() {
  const events = [
    {
      type: 'hearing',
      title: 'Future of Technology Regulation',
      date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
      witnesses: ['Tech CEO', 'Regulatory Expert', 'Consumer Advocate']
    },
    {
      type: 'markup',
      title: 'Markup of Proposed Legislation',
      date: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000),
      bills: ['H.R. 2345', 'S. 678']
    }
  ];
  
  return events.sort((a, b) => a.date - b.date);
}

function generateIndustryImpact(committeeName) {
  const impactMap = {
    'Armed Services': { defense: 95, aerospace: 85, cybersecurity: 80 },
    'Appropriations': { all: 90 },
    'Energy and Commerce': { energy: 90, healthcare: 85, technology: 80 },
    'Financial Services': { finance: 95, banking: 90, insurance: 85 },
    'Foreign Relations': { international: 90, trade: 85, diplomacy: 80 },
    'Energy': { energy: 95, environment: 85, natural_resources: 80 },
    'Judiciary': { legal: 90, technology: 75, civil_rights: 85 }
  };

  for (const [key, impact] of Object.entries(impactMap)) {
    if (committeeName.includes(key)) {
      return impact;
    }
  }

  return { general: 70 };
} 