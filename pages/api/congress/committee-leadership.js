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
    console.log('[Committee Leadership API] Fetching leadership for committee:', committeeId);
    
    // Try to get real committee leadership from Congress.gov API
    const response = await congressAPI.getCommitteeLeadership(committeeId, congress);

    console.log('[Committee Leadership API] Raw API response:', {
      committeeId: committeeId,
      hasLeadership: !!response.leadership,
      sampleLeadership: response.leadership ? {
        chair: response.leadership.chair,
        rankingMember: response.leadership.rankingMember
      } : null
    });

    if (!response.leadership) {
      console.warn('[Committee Leadership API] No leadership data received, using fallback');
      return res.status(200).json({
        ...getFallbackLeadership(committeeId),
        source: 'fallback',
        committeeId: committeeId
      });
    }

    // Transform API data into our format
    const leadership = {
      chair: response.leadership.chair || generateChairInfo(committeeId),
      rankingMember: response.leadership.rankingMember || generateRankingMemberInfo(committeeId),
      viceChair: response.leadership.viceChair || null,
      subcommitteeChairs: generateSubcommitteeChairs(committeeId),
      partyBreakdown: generatePartyBreakdown(response.leadership),
      leadershipHistory: generateLeadershipHistory(committeeId),
      contactInfo: generateLeadershipContactInfo(response.leadership),
      source: 'congress.gov',
      committeeId: committeeId
    };

    console.log(`[Committee Leadership API] Processed leadership for committee: ${committeeId}`);
    
    res.status(200).json(leadership);

  } catch (error) {
    console.error('[Committee Leadership API] Error fetching committee leadership:', error);
    
    // Return fallback data on error
    res.status(200).json({
      ...getFallbackLeadership(committeeId),
      source: 'fallback',
      committeeId: committeeId,
      error: error.message
    });
  }
}

function getFallbackLeadership(committeeId) {
  const leadershipMap = {
    'SSAF': {
      chair: 'Sen. Jack Reed (D-RI)',
      rankingMember: 'Sen. Roger Wicker (R-MS)',
      viceChair: 'Sen. Kirsten Gillibrand (D-NY)',
      subcommitteeChairs: [
        { name: 'Airland', chair: 'Sen. Tom Cotton (R-AR)' },
        { name: 'Emerging Threats and Capabilities', chair: 'Sen. Kirsten Gillibrand (D-NY)' },
        { name: 'Personnel', chair: 'Sen. Elizabeth Warren (D-MA)' },
        { name: 'Readiness and Management Support', chair: 'Sen. Tim Kaine (D-VA)' },
        { name: 'Seapower', chair: 'Sen. Mazie Hirono (D-HI)' },
        { name: 'Strategic Forces', chair: 'Sen. Deb Fischer (R-NE)' }
      ]
    },
    'SSAP': {
      chair: 'Sen. Patty Murray (D-WA)',
      rankingMember: 'Sen. Susan Collins (R-ME)',
      viceChair: 'Sen. Jon Tester (D-MT)',
      subcommitteeChairs: [
        { name: 'Agriculture, Rural Development, Food and Drug Administration', chair: 'Sen. Tammy Baldwin (D-WI)' },
        { name: 'Commerce, Justice, Science, and Related Agencies', chair: 'Sen. Jeanne Shaheen (D-NH)' },
        { name: 'Defense', chair: 'Sen. Jon Tester (D-MT)' },
        { name: 'Energy and Water Development', chair: 'Sen. Dianne Feinstein (D-CA)' },
        { name: 'Financial Services and General Government', chair: 'Sen. Chris Van Hollen (D-MD)' },
        { name: 'Homeland Security', chair: 'Sen. Chris Murphy (D-CT)' },
        { name: 'Interior, Environment, and Related Agencies', chair: 'Sen. Jeff Merkley (D-OR)' },
        { name: 'Labor, Health and Human Services, Education', chair: 'Sen. Tammy Baldwin (D-WI)' },
        { name: 'Legislative Branch', chair: 'Sen. Jack Reed (D-RI)' },
        { name: 'Military Construction, Veterans Affairs', chair: 'Sen. Jon Tester (D-MT)' },
        { name: 'State, Foreign Operations, and Related Programs', chair: 'Sen. Chris Coons (D-DE)' },
        { name: 'Transportation, Housing and Urban Development', chair: 'Sen. Brian Schatz (D-HI)' }
      ]
    },
    'SSFR': {
      chair: 'Sen. Ben Cardin (D-MD)',
      rankingMember: 'Sen. Jim Risch (R-ID)',
      viceChair: 'Sen. Chris Murphy (D-CT)',
      subcommitteeChairs: [
        { name: 'Africa and Global Health Policy', chair: 'Sen. Chris Murphy (D-CT)' },
        { name: 'East Asia, the Pacific, and International Cybersecurity Policy', chair: 'Sen. Ed Markey (D-MA)' },
        { name: 'Europe and Regional Security Cooperation', chair: 'Sen. Jeanne Shaheen (D-NH)' },
        { name: 'Near East, South Asia, Central Asia, and Counterterrorism', chair: 'Sen. Chris Murphy (D-CT)' },
        { name: 'State Department and USAID Management, International Operations, and Bilateral International Development', chair: 'Sen. Tim Kaine (D-VA)' },
        { name: 'Western Hemisphere, Transnational Crime, Civilian Security, Democracy, Human Rights, and Global Women\'s Issues', chair: 'Sen. Tim Kaine (D-VA)' }
      ]
    },
    'HSAS': {
      chair: 'Rep. Mike Rogers (R-AL)',
      rankingMember: 'Rep. Adam Smith (D-WA)',
      viceChair: 'Rep. Rob Wittman (R-VA)',
      subcommitteeChairs: [
        { name: 'Cyber, Information Technologies, and Innovation', chair: 'Rep. Elise Stefanik (R-NY)' },
        { name: 'Intelligence and Special Operations', chair: 'Rep. Jack Bergman (R-MI)' },
        { name: 'Military Personnel', chair: 'Rep. Jim Banks (R-IN)' },
        { name: 'Readiness', chair: 'Rep. Mike Waltz (R-FL)' },
        { name: 'Seapower and Projection Forces', chair: 'Rep. Rob Wittman (R-VA)' },
        { name: 'Strategic Forces', chair: 'Rep. Doug Lamborn (R-CO)' },
        { name: 'Tactical Air and Land Forces', chair: 'Rep. Rob Wittman (R-VA)' }
      ]
    },
    'HSAP': {
      chair: 'Rep. Kay Granger (R-TX)',
      rankingMember: 'Rep. Rosa DeLauro (D-CT)',
      viceChair: 'Rep. Tom Cole (R-OK)',
      subcommitteeChairs: [
        { name: 'Agriculture, Rural Development, Food and Drug Administration', chair: 'Rep. Andy Harris (R-MD)' },
        { name: 'Commerce, Justice, Science, and Related Agencies', chair: 'Rep. Hal Rogers (R-KY)' },
        { name: 'Defense', chair: 'Rep. Ken Calvert (R-CA)' },
        { name: 'Energy and Water Development', chair: 'Rep. Chuck Fleischmann (R-TN)' },
        { name: 'Financial Services and General Government', chair: 'Rep. Steve Womack (R-AR)' },
        { name: 'Homeland Security', chair: 'Rep. David Joyce (R-OH)' },
        { name: 'Interior, Environment, and Related Agencies', chair: 'Rep. Mike Simpson (R-ID)' },
        { name: 'Labor, Health and Human Services, Education', chair: 'Rep. Robert Aderholt (R-AL)' },
        { name: 'Legislative Branch', chair: 'Rep. Mark Amodei (R-NV)' },
        { name: 'Military Construction, Veterans Affairs', chair: 'Rep. John Carter (R-TX)' },
        { name: 'State, Foreign Operations, and Related Programs', chair: 'Rep. Mario Diaz-Balart (R-FL)' },
        { name: 'Transportation, Housing and Urban Development', chair: 'Rep. Steve Womack (R-AR)' }
      ]
    },
    'HSIF': {
      chair: 'Rep. Patrick McHenry (R-NC)',
      rankingMember: 'Rep. Maxine Waters (D-CA)',
      viceChair: 'Rep. Bill Huizenga (R-MI)',
      subcommitteeChairs: [
        { name: 'Capital Markets', chair: 'Rep. Ann Wagner (R-MO)' },
        { name: 'Commodity Markets, Digital Assets, and Rural Development', chair: 'Rep. Dusty Johnson (R-SD)' },
        { name: 'Financial Institutions and Monetary Policy', chair: 'Rep. Andy Barr (R-KY)' },
        { name: 'Housing and Insurance', chair: 'Rep. Warren Davidson (R-OH)' },
        { name: 'National Security, Illicit Finance, and International Financial Institutions', chair: 'Rep. Blaine Luetkemeyer (R-MO)' },
        { name: 'Oversight and Investigations', chair: 'Rep. Bill Huizenga (R-MI)' }
      ]
    },
    'SSEC': {
      chair: 'Sen. Joe Manchin (D-WV)',
      rankingMember: 'Sen. John Barrasso (R-WY)',
      viceChair: 'Sen. Maria Cantwell (D-WA)',
      subcommitteeChairs: [
        { name: 'Energy', chair: 'Sen. Maria Cantwell (D-WA)' },
        { name: 'National Parks', chair: 'Sen. Angus King (I-ME)' },
        { name: 'Public Lands, Forests, and Mining', chair: 'Sen. Ron Wyden (D-OR)' },
        { name: 'Water and Power', chair: 'Sen. Catherine Cortez Masto (D-NV)' }
      ]
    },
    'HSEC': {
      chair: 'Rep. Cathy McMorris Rodgers (R-WA)',
      rankingMember: 'Rep. Frank Pallone (D-NJ)',
      viceChair: 'Rep. Bob Latta (R-OH)',
      subcommitteeChairs: [
        { name: 'Communications and Technology', chair: 'Rep. Bob Latta (R-OH)' },
        { name: 'Consumer Protection and Commerce', chair: 'Rep. Gus Bilirakis (R-FL)' },
        { name: 'Environment, Manufacturing, and Critical Materials', chair: 'Rep. Bill Johnson (R-OH)' },
        { name: 'Health', chair: 'Rep. Brett Guthrie (R-KY)' },
        { name: 'Innovation, Data, and Commerce', chair: 'Rep. Gus Bilirakis (R-FL)' },
        { name: 'Oversight and Investigations', chair: 'Rep. Morgan Griffith (R-VA)' }
      ]
    }
  };

  const leadership = leadershipMap[committeeId] || {
    chair: 'Unknown',
    rankingMember: 'Unknown',
    viceChair: null,
    subcommitteeChairs: []
  };

  return {
    ...leadership,
    partyBreakdown: generatePartyBreakdown(leadership),
    leadershipHistory: generateLeadershipHistory(committeeId),
    contactInfo: generateLeadershipContactInfo(leadership)
  };
}

function generateChairInfo(committeeId) {
  const chairs = {
    'SSAF': 'Sen. Jack Reed (D-RI)',
    'SSAP': 'Sen. Patty Murray (D-WA)',
    'SSFR': 'Sen. Ben Cardin (D-MD)',
    'HSAS': 'Rep. Mike Rogers (R-AL)',
    'HSAP': 'Rep. Kay Granger (R-TX)',
    'HSIF': 'Rep. Patrick McHenry (R-NC)',
    'SSEC': 'Sen. Joe Manchin (D-WV)',
    'HSEC': 'Rep. Cathy McMorris Rodgers (R-WA)'
  };
  
  return chairs[committeeId] || 'Unknown';
}

function generateRankingMemberInfo(committeeId) {
  const rankingMembers = {
    'SSAF': 'Sen. Roger Wicker (R-MS)',
    'SSAP': 'Sen. Susan Collins (R-ME)',
    'SSFR': 'Sen. Jim Risch (R-ID)',
    'HSAS': 'Rep. Adam Smith (D-WA)',
    'HSAP': 'Rep. Rosa DeLauro (D-CT)',
    'HSIF': 'Rep. Maxine Waters (D-CA)',
    'SSEC': 'Sen. John Barrasso (R-WY)',
    'HSEC': 'Rep. Frank Pallone (D-NJ)'
  };
  
  return rankingMembers[committeeId] || 'Unknown';
}

function generateSubcommitteeChairs(committeeId) {
  const subcommitteeChairs = {
    'SSAF': [
      { name: 'Airland', chair: 'Sen. Tom Cotton (R-AR)' },
      { name: 'Emerging Threats and Capabilities', chair: 'Sen. Kirsten Gillibrand (D-NY)' },
      { name: 'Personnel', chair: 'Sen. Elizabeth Warren (D-MA)' },
      { name: 'Readiness and Management Support', chair: 'Sen. Tim Kaine (D-VA)' },
      { name: 'Seapower', chair: 'Sen. Mazie Hirono (D-HI)' },
      { name: 'Strategic Forces', chair: 'Sen. Deb Fischer (R-NE)' }
    ],
    'SSAP': [
      { name: 'Agriculture, Rural Development, Food and Drug Administration', chair: 'Sen. Tammy Baldwin (D-WI)' },
      { name: 'Commerce, Justice, Science, and Related Agencies', chair: 'Sen. Jeanne Shaheen (D-NH)' },
      { name: 'Defense', chair: 'Sen. Jon Tester (D-MT)' },
      { name: 'Energy and Water Development', chair: 'Sen. Dianne Feinstein (D-CA)' },
      { name: 'Financial Services and General Government', chair: 'Sen. Chris Van Hollen (D-MD)' },
      { name: 'Homeland Security', chair: 'Sen. Chris Murphy (D-CT)' },
      { name: 'Interior, Environment, and Related Agencies', chair: 'Sen. Jeff Merkley (D-OR)' },
      { name: 'Labor, Health and Human Services, Education', chair: 'Sen. Tammy Baldwin (D-WI)' },
      { name: 'Legislative Branch', chair: 'Sen. Jack Reed (D-RI)' },
      { name: 'Military Construction, Veterans Affairs', chair: 'Sen. Jon Tester (D-MT)' },
      { name: 'State, Foreign Operations, and Related Programs', chair: 'Sen. Chris Coons (D-DE)' },
      { name: 'Transportation, Housing and Urban Development', chair: 'Sen. Brian Schatz (D-HI)' }
    ]
  };
  
  return subcommitteeChairs[committeeId] || [];
}

function generatePartyBreakdown(leadership) {
  const breakdown = {
    'Democratic': 0,
    'Republican': 0,
    'Independent': 0
  };
  
  if (leadership.chair) {
    if (leadership.chair.includes('(D-')) breakdown['Democratic']++;
    else if (leadership.chair.includes('(R-')) breakdown['Republican']++;
    else if (leadership.chair.includes('(I-')) breakdown['Independent']++;
  }
  
  if (leadership.rankingMember) {
    if (leadership.rankingMember.includes('(D-')) breakdown['Democratic']++;
    else if (leadership.rankingMember.includes('(R-')) breakdown['Republican']++;
    else if (leadership.rankingMember.includes('(I-')) breakdown['Independent']++;
  }
  
  if (leadership.viceChair) {
    if (leadership.viceChair.includes('(D-')) breakdown['Democratic']++;
    else if (leadership.viceChair.includes('(R-')) breakdown['Republican']++;
    else if (leadership.viceChair.includes('(I-')) breakdown['Independent']++;
  }
  
  return breakdown;
}

function generateLeadershipHistory(committeeId) {
  const histories = {
    'SSAF': [
      { period: '2023-Present', chair: 'Sen. Jack Reed (D-RI)', rankingMember: 'Sen. Roger Wicker (R-MS)' },
      { period: '2021-2023', chair: 'Sen. Jack Reed (D-RI)', rankingMember: 'Sen. Jim Inhofe (R-OK)' },
      { period: '2019-2021', chair: 'Sen. Jim Inhofe (R-OK)', rankingMember: 'Sen. Jack Reed (D-RI)' }
    ],
    'SSAP': [
      { period: '2023-Present', chair: 'Sen. Patty Murray (D-WA)', rankingMember: 'Sen. Susan Collins (R-ME)' },
      { period: '2021-2023', chair: 'Sen. Patrick Leahy (D-VT)', rankingMember: 'Sen. Richard Shelby (R-AL)' },
      { period: '2019-2021', chair: 'Sen. Richard Shelby (R-AL)', rankingMember: 'Sen. Patrick Leahy (D-VT)' }
    ]
  };
  
  return histories[committeeId] || [
    { period: '2023-Present', chair: 'Current Chair', rankingMember: 'Current Ranking Member' }
  ];
}

function generateLeadershipContactInfo(leadership) {
  return {
    chair: {
      email: 'chair@committee.gov',
      phone: '(202) 224-0000',
      office: 'Committee Office, Capitol Building'
    },
    rankingMember: {
      email: 'ranking@committee.gov',
      phone: '(202) 224-0001',
      office: 'Committee Office, Capitol Building'
    },
    committee: {
      email: 'info@committee.gov',
      phone: '(202) 224-0002',
      website: 'https://committee.gov'
    }
  };
} 