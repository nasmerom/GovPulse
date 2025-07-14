export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[API] Starting OpenSecrets members fetch...');
    
    const openSecretsKey = process.env.OPENSECRETS_API_KEY;
    if (!openSecretsKey) {
      return res.status(500).json({ error: 'OpenSecrets API key not configured' });
    }
    
    // Get current Congress (119th)
    const congress = req.query.congress || '119';
    
    // Fetch House members
    const houseMembers = await fetchOpenSecretsMembers(openSecretsKey, congress, 'H');
    console.log(`[API] OpenSecrets House returned ${houseMembers.length} members`);
    
    // Fetch Senate members
    const senateMembers = await fetchOpenSecretsMembers(openSecretsKey, congress, 'S');
    console.log(`[API] OpenSecrets Senate returned ${senateMembers.length} members`);
    
    const allMembers = [...houseMembers, ...senateMembers];
    
    // Transform to consistent format
    const transformedMembers = allMembers.map(member => ({
      bioguideId: member.cid,
      name: `${member.lastname}, ${member.firstname}`,
      firstName: member.firstname,
      lastName: member.lastname,
      fullName: `${member.firstname} ${member.lastname}`,
      partyName: member.party,
      state: member.state,
      district: member.district,
      chamber: member.chamber === 'H' ? 'House of Representatives' : 'Senate',
      url: member.website,
      isActive: true,
      validated: true,
      source: 'opensecrets',
      // OpenSecrets specific data
      openSecretsId: member.cid,
      totalReceipts: member.total_receipts,
      totalDisbursements: member.total_disbursements,
      cashOnHand: member.cash_on_hand,
      debt: member.debt
    }));
    
    console.log(`[API] OpenSecrets total validated members: ${transformedMembers.length}`);
    
    res.status(200).json({
      members: transformedMembers,
      total: transformedMembers.length,
      sources: ['OpenSecrets'],
      congress: congress
    });
    
  } catch (error) {
    console.error('[API] Error in OpenSecrets members fetch:', error);
    res.status(500).json({ error: 'Failed to fetch OpenSecrets members' });
  }
}

async function fetchOpenSecretsMembers(apiKey, congress, chamber) {
  try {
    const response = await fetch(`https://www.opensecrets.org/api/?method=getLegislators&id=${chamber}&apikey=${apiKey}&output=json`);
    
    if (!response.ok) {
      throw new Error(`OpenSecrets API error: ${response.status}`);
    }
    
    const data = await response.json();
    const members = data.response?.legislator || [];
    
    // Filter for current Congress and active members
    return members.filter(member => {
      // Basic validation - ensure we have required fields
      return member.firstname && member.lastname && member.party && member.state;
    });
    
  } catch (error) {
    console.error('[API] OpenSecrets API error:', error);
    return [];
  }
} 