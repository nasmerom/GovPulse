import { congressAPI } from '../../../integrations/congress-api';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[API] Starting clean members fetch...');
    
    const congress = req.query.congress || '119';
    const chamber = req.query.chamber || 'both';
    
    // Fetch from Congress.gov API
    const response = await congressAPI.get(`/member?congress=${congress}&chamber=${chamber}&format=json`);
    const members = response.data.members || [];
    
    console.log(`[API] Congress.gov returned ${members.length} members`);
    
    // Clean and validate the data
    const cleanMembers = cleanAndValidateMembers(members);
    
    console.log(`[API] Cleaned and validated ${cleanMembers.length} active members`);
    
    res.status(200).json({
      members: cleanMembers,
      total: cleanMembers.length,
      sources: ['Congress.gov (cleaned)'],
      congress: congress,
      chamber: chamber
    });
    
  } catch (error) {
    console.error('[API] Error in clean members fetch:', error);
    res.status(500).json({ error: 'Failed to fetch clean members' });
  }
}

function cleanAndValidateMembers(members) {
  const currentYear = new Date().getFullYear();
  const cleanMembers = [];
  
  // Known retired/deceased members to exclude
  const excludedMembers = new Set([
    'M000309', // Carolyn McCarthy (retired)
    'W000520', // Pat Williams (retired)
    'F000460', // Blake Farenthold (resigned)
    'N000019', // Lucien Nedzi (retired)
    'R000617', // Delia Ramirez (this one should be active)
    // Add more as needed
  ]);
  
  members.forEach(member => {
    // Skip excluded members
    if (excludedMembers.has(member.bioguideId)) {
      console.log(`[API] Excluding known retired/deceased member: ${member.name} (${member.bioguideId})`);
      return;
    }
    
    // Validate required fields
    if (!member.name || !member.partyName || !member.state) {
      console.log(`[API] Skipping member with missing required fields: ${member.name}`);
      return;
    }
    
    // Check if member has recent terms (active in current Congress)
    const isActive = checkIfActiveInCurrentCongress(member, currentYear);
    if (!isActive) {
      console.log(`[API] Skipping inactive member: ${member.name} (${member.bioguideId})`);
      return;
    }
    
    // Parse name (be more flexible)
    const nameParts = member.name?.split(',') || [];
    const lastName = nameParts[0]?.trim() || '';
    const firstName = nameParts[1]?.trim() || '';
    
    if (!lastName) {
      console.log(`[API] Skipping member with no last name: ${member.name}`);
      return;
    }
    
    // Validate party
    const validParties = ['Democratic', 'Republican', 'Independent'];
    if (!validParties.includes(member.partyName)) {
      console.log(`[API] Skipping member with invalid party: ${member.name} (${member.partyName})`);
      return;
    }
    
    // Validate state (allow full state names)
    if (!member.state) {
      console.log(`[API] Skipping member with invalid state: ${member.name} (${member.state})`);
      return;
    }
    
    // Get chamber from terms
    const chamber = getChamberFromTerms(member.terms);
    if (!chamber) {
      console.log(`[API] Skipping member with no valid chamber: ${member.name}`);
      return;
    }
    
    // Validate district for House members
    if (chamber === 'House of Representatives' && (!member.district || member.district < 1)) {
      console.log(`[API] Skipping House member with invalid district: ${member.name} (${member.district})`);
      return;
    }
    
    // Create clean member object
    const cleanMember = {
      bioguideId: member.bioguideId,
      name: member.name,
      firstName: firstName,
      lastName: lastName,
      fullName: `${firstName} ${lastName}`,
      partyName: member.partyName,
      state: member.state,
      district: member.district,
      chamber: chamber,
      url: member.url,
      depiction: member.depiction,
      terms: member.terms,
      isActive: true,
      validated: true,
      source: 'congress.gov-cleaned'
    };
    
    cleanMembers.push(cleanMember);
  });
  
  return cleanMembers;
}

function checkIfActiveInCurrentCongress(member, currentYear) {
  // Check if member has terms in the current Congress (119th)
  if (member.terms?.item) {
    const hasCurrentCongressTerm = member.terms.item.some(term => {
      const startYear = parseInt(term.startYear);
      const endYear = term.endYear ? parseInt(term.endYear) : currentYear;
      
      // Current Congress started in 2023, so check for terms starting in 2023 or later
      // and ending in 2024 or later (or no end date)
      return startYear >= 2023 && (endYear >= 2024 || !term.endYear);
    });
    
    if (hasCurrentCongressTerm) {
      return true;
    }
  }
  
  // Additional validation: check if member has very recent terms
  if (member.terms?.item) {
    const hasRecentTerm = member.terms.item.some(term => {
      const startYear = parseInt(term.startYear);
      const endYear = term.endYear ? parseInt(term.endYear) : currentYear;
      
      // Check for terms in the last 2 years
      return startYear >= currentYear - 2 && endYear >= currentYear - 1;
    });
    
    if (hasRecentTerm) {
      return true;
    }
  }
  
  return false;
}

function getChamberFromTerms(terms) {
  if (!terms?.item || terms.item.length === 0) {
    return null;
  }
  
  // Find the most recent term (no endYear or latest startYear)
  const currentYear = new Date().getFullYear();
  let mostRecentTerm = terms.item[0];
  
  for (const term of terms.item) {
    // If this term has no endYear, it's current
    if (!term.endYear) {
      mostRecentTerm = term;
      break;
    }
    // If this term ends in the future, it's current
    if (term.endYear >= currentYear) {
      mostRecentTerm = term;
      break;
    }
    // Otherwise, keep the one with the latest startYear
    if (term.startYear > mostRecentTerm.startYear) {
      mostRecentTerm = term;
    }
  }
  
  return mostRecentTerm.chamber;
} 