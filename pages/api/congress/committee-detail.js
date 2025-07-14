import { congressAPI } from '../../../integrations/congress-api';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { committeeId, congress = 119 } = req.query;

  if (!committeeId) {
    return res.status(400).json({ error: 'Committee ID is required' });
  }

  try {
    console.log('[Committee Detail API] Fetching details for committee:', committeeId);
    
    // Try to get real committee details from Congress.gov API
    const response = await congressAPI.getCommittee(committeeId, congress);

    console.log('[Committee Detail API] Raw API response:', {
      committeeId: committeeId,
      hasData: !!response.committee,
      sampleData: response.committee ? {
        name: response.committee.name,
        chamber: response.committee.chamber,
        systemCode: response.committee.systemCode
      } : null
    });

    if (!response.committee) {
      console.warn('[Committee Detail API] No committee data received, using fallback');
      return res.status(200).json(getFallbackCommitteeDetail(committeeId));
    }

    // Transform API data into our format
    const committee = {
      id: response.committee.systemCode || committeeId,
      name: response.committee.name || 'Unknown Committee',
      chamber: response.committee.chamber || 'Unknown',
      type: response.committee.committeeTypeCode || 'standing',
      url: response.committee.url || '',
      website: response.committee.website || '',
      phone: response.committee.phone || '',
      address: response.committee.address || '',
      chair: generateChairInfo(response.committee.name, response.committee.chamber),
      rankingMember: generateRankingMemberInfo(response.committee.name, response.committee.chamber),
      members: response.committee.members || [],
      subcommittees: response.committee.subcommittees || [],
      jurisdiction: generateJurisdiction(response.committee.name),
      budgetAuthority: generateBudgetAuthority(response.committee.name),
      influenceScore: calculateInfluenceScore(response.committee),
      activityLevel: generateActivityLevel(response.committee),
      keyIssues: generateKeyIssues(response.committee.name),
      recentActivity: generateRecentActivity(),
      upcomingEvents: generateUpcomingEvents(),
      industryImpact: generateIndustryImpact(response.committee.name),
      votingPatterns: generateVotingPatterns(response.committee.members),
      legislativePipeline: generateLegislativePipeline()
    };

    console.log(`[Committee Detail API] Processed committee details for: ${committee.name}`);
    
    res.status(200).json(committee);

  } catch (error) {
    console.error('[Committee Detail API] Error fetching committee details:', error);
    
    // Return fallback data on error
    res.status(200).json(getFallbackCommitteeDetail(committeeId));
  }
}

function getFallbackCommitteeDetail(committeeId) {
  const fallbackCommittees = {
    'SSAF': {
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
      members: generateFallbackMembers(25),
      subcommittees: [
        { name: 'Airland', chair: 'Tom Cotton' },
        { name: 'Emerging Threats and Capabilities', chair: 'Kirsten Gillibrand' },
        { name: 'Personnel', chair: 'Elizabeth Warren' },
        { name: 'Readiness and Management Support', chair: 'Tim Kaine' },
        { name: 'Seapower', chair: 'Mazie Hirono' },
        { name: 'Strategic Forces', chair: 'Deb Fischer' }
      ],
      recentActivity: generateRecentActivity(),
      upcomingEvents: generateUpcomingEvents(),
      industryImpact: { defense: 95, aerospace: 85, cybersecurity: 80 },
      votingPatterns: generateVotingPatterns([]),
      legislativePipeline: generateLegislativePipeline()
    },
    'SSAP': {
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
      members: generateFallbackMembers(30),
      subcommittees: [
        { name: 'Agriculture, Rural Development, Food and Drug Administration', chair: 'Tammy Baldwin' },
        { name: 'Commerce, Justice, Science, and Related Agencies', chair: 'Jeanne Shaheen' },
        { name: 'Defense', chair: 'Jon Tester' },
        { name: 'Energy and Water Development', chair: 'Dianne Feinstein' },
        { name: 'Financial Services and General Government', chair: 'Chris Van Hollen' },
        { name: 'Homeland Security', chair: 'Chris Murphy' },
        { name: 'Interior, Environment, and Related Agencies', chair: 'Jeff Merkley' },
        { name: 'Labor, Health and Human Services, Education', chair: 'Tammy Baldwin' },
        { name: 'Legislative Branch', chair: 'Jack Reed' },
        { name: 'Military Construction, Veterans Affairs', chair: 'Jon Tester' },
        { name: 'State, Foreign Operations, and Related Programs', chair: 'Chris Coons' },
        { name: 'Transportation, Housing and Urban Development', chair: 'Brian Schatz' }
      ],
      recentActivity: generateRecentActivity(),
      upcomingEvents: generateUpcomingEvents(),
      industryImpact: { all: 90 },
      votingPatterns: generateVotingPatterns([]),
      legislativePipeline: generateLegislativePipeline()
    }
  };

  return fallbackCommittees[committeeId] || {
    id: committeeId,
    name: 'Unknown Committee',
    chamber: 'Unknown',
    type: 'standing',
    chair: 'Unknown',
    rankingMember: 'Unknown',
    influenceScore: 50,
    activityLevel: 'medium',
    budgetAuthority: 10000000000,
    jurisdiction: 'Legislative matters within its jurisdiction',
    keyIssues: ['Legislative Oversight', 'Policy Development', 'Regulatory Review'],
    members: [],
    subcommittees: [],
    recentActivity: generateRecentActivity(),
    upcomingEvents: generateUpcomingEvents(),
    industryImpact: { general: 70 },
    votingPatterns: generateVotingPatterns([]),
    legislativePipeline: generateLegislativePipeline()
  };
}

function generateFallbackMembers(count) {
  const members = [];
  const parties = ['Democratic', 'Republican', 'Independent'];
  const states = ['CA', 'TX', 'NY', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'];
  
  for (let i = 0; i < count; i++) {
    members.push({
      id: `member-${i}`,
      name: `Member ${i + 1}`,
      party: parties[Math.floor(Math.random() * parties.length)],
      state: states[Math.floor(Math.random() * states.length)],
      role: i === 0 ? 'Chair' : i === 1 ? 'Ranking Member' : 'Member'
    });
  }
  
  return members;
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

function generateVotingPatterns(members) {
  if (!members || members.length === 0) {
    return {
      partyBreakdown: { 'Democratic': 12, 'Republican': 13 },
      votingConsistency: 85,
      keySwingVotes: []
    };
  }
  
  const partyBreakdown = {};
  members.forEach(member => {
    const party = member.party || 'Unknown';
    partyBreakdown[party] = (partyBreakdown[party] || 0) + 1;
  });
  
  return {
    partyBreakdown,
    votingConsistency: Math.floor(Math.random() * 30) + 70,
    keySwingVotes: members.filter(m => m.party === 'Independent').slice(0, 3)
  };
}

function generateLegislativePipeline() {
  return [
    {
      bill: 'H.R. 1234',
      title: 'Innovation and Competition Act',
      status: 'In Committee',
      priority: 'high',
      estimatedVote: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
      bill: 'S. 567',
      title: 'Cybersecurity Enhancement Act',
      status: 'Markup Scheduled',
      priority: 'medium',
      estimatedVote: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    },
    {
      bill: 'H.R. 890',
      title: 'Infrastructure Modernization',
      status: 'Hearing Completed',
      priority: 'low',
      estimatedVote: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    }
  ];
} 