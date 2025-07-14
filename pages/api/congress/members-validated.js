import { congressAPI } from '../../../integrations/congress-api';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[API] Starting validated members fetch...');
    
    // Get current Congress (119th)
    const congress = req.query.congress || '119';
    const chamber = req.query.chamber || 'both';
    
    // Fetch from Congress.gov API
    const congressData = await fetchCongressData(congress, chamber);
    console.log(`[API] Congress.gov returned ${congressData.length} members`);
    
    // Fetch from ProPublica API for validation
    const propublicaData = await fetchPropublicaData(congress, chamber);
    console.log(`[API] ProPublica returned ${propublicaData.length} members`);
    
    // Cross-reference and validate data
    const validatedMembers = crossReferenceMembers(congressData, propublicaData);
    console.log(`[API] Validated ${validatedMembers.length} active members`);
    
    res.status(200).json({
      members: validatedMembers,
      total: validatedMembers.length,
      sources: ['Congress.gov', 'ProPublica'],
      congress: congress,
      chamber: chamber
    });
    
  } catch (error) {
    console.error('[API] Error in validated members fetch:', error);
    res.status(500).json({ error: 'Failed to fetch validated members' });
  }
}

async function fetchCongressData(congress, chamber) {
  try {
    const response = await congressAPI.get(`/member?congress=${congress}&chamber=${chamber}&format=json`);
    return response.data.members || [];
  } catch (error) {
    console.error('[API] Congress.gov API error:', error);
    return [];
  }
}

async function fetchPropublicaData(congress, chamber) {
  try {
    const propublicaKey = process.env.PROPUBLICA_API_KEY;
    if (!propublicaKey) {
      console.warn('[API] No ProPublica API key found, skipping validation');
      return [];
    }
    
    const chambers = chamber === 'both' ? ['house', 'senate'] : [chamber === 'House of Representatives' ? 'house' : 'senate'];
    let allMembers = [];
    
    for (const ch of chambers) {
      const response = await fetch(`https://api.propublica.org/congress/v1/${congress}/${ch}/members.json`, {
        headers: {
          'X-API-Key': propublicaKey,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const members = data.results?.[0]?.members || [];
        allMembers.push(...members);
      }
    }
    
    return allMembers;
  } catch (error) {
    console.error('[API] ProPublica API error:', error);
    return [];
  }
}

function crossReferenceMembers(congressMembers, propublicaMembers) {
  const validated = [];
  const propublicaMap = new Map();
  
  // Create map of ProPublica members by name and state
  propublicaMembers.forEach(member => {
    const key = `${member.first_name} ${member.last_name} ${member.state}`.toLowerCase();
    propublicaMap.set(key, member);
  });
  
  congressMembers.forEach(member => {
    // Parse name from Congress.gov format "LastName, FirstName"
    const nameParts = member.name?.split(',') || [];
    if (nameParts.length < 2) return;
    
    const lastName = nameParts[0].trim();
    const firstName = nameParts[1].trim();
    const fullName = `${firstName} ${lastName}`;
    const key = `${firstName} ${lastName} ${member.state}`.toLowerCase();
    
    // Check if member exists in ProPublica (active)
    const propublicaMember = propublicaMap.get(key);
    
    if (propublicaMember) {
      // Validate and enhance data
      const validatedMember = {
        bioguideId: member.bioguideId,
        name: member.name,
        firstName: firstName,
        lastName: lastName,
        fullName: fullName,
        partyName: propublicaMember.party || member.partyName,
        state: member.state,
        district: member.district,
        chamber: member.chamber,
        url: member.url,
        depiction: member.depiction,
        terms: member.terms,
        // ProPublica validation
        isActive: true,
        propublicaId: propublicaMember.id,
        votesWithParty: propublicaMember.votes_with_party_pct,
        missedVotes: propublicaMember.missed_votes_pct,
        // Additional validation
        validated: true,
        source: 'cross-referenced'
      };
      
      validated.push(validatedMember);
    } else {
      // Check if member is actually active by other means
      const isActive = checkIfActive(member);
      if (isActive) {
        const validatedMember = {
          ...member,
          firstName: firstName,
          lastName: lastName,
          fullName: fullName,
          isActive: true,
          validated: false,
          source: 'congress.gov-only'
        };
        validated.push(validatedMember);
      }
    }
  });
  
  return validated;
}

function checkIfActive(member) {
  // Check if member has recent terms (within last 2 years)
  if (member.terms?.item) {
    const currentYear = new Date().getFullYear();
    const hasRecentTerm = member.terms.item.some(term => {
      const startYear = parseInt(term.startYear);
      const endYear = term.endYear ? parseInt(term.endYear) : currentYear;
      return startYear >= currentYear - 2 && endYear >= currentYear - 1;
    });
    
    if (hasRecentTerm) {
      return true;
    }
  }
  
  // Additional checks could be added here
  return false;
} 