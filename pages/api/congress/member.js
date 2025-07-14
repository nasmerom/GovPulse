import { getCachedData, CACHE_KEYS, CACHE_TTLS } from '../../../utils/cache';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { congress = '119', chamber = 'both', limit = '100' } = req.query;
  const apiKey = process.env.CONGRESS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Congress API key not configured' });
  }

  // Function to format name from "Last, First" to "First Last"
  function formatName(name) {
    if (!name) return 'Unknown Member';
    
    // Handle "Last, First" format
    if (name.includes(',')) {
      const parts = name.split(',');
      const lastName = parts[0].trim();
      const firstName = parts[1]?.trim() || '';
      return `${firstName} ${lastName}`.trim();
    }
    
    return name;
  }

  try {
    // Create a unique cache key based on parameters
    const cacheKey = `${CACHE_KEYS.CONGRESS_MEMBERS}_${congress}_${chamber}_${limit}`;
    
    // Use cached data or fetch fresh data
    const data = await getCachedData(
      cacheKey,
      async () => {
        console.log(`[Congress API] Fetching fresh data for Congress ${congress}, chamber: ${chamber}`);
        
        const members = [];
        const currentYear = new Date().getFullYear();

        if (chamber === 'both' || chamber === 'house') {
          console.log(`[Congress API] Fetching ${limit} house members for Congress ${congress}...`);
          const houseResponse = await fetch(
            `https://api.congress.gov/v3/member?congress=${congress}&chamber=House&limit=${limit}&api_key=${apiKey}`
          );
          
          if (houseResponse.ok) {
            const houseData = await houseResponse.json();
            const houseMembers = houseData.members || [];
            console.log(`[Congress API] Got ${houseMembers.length} house members from Congress ${congress}`);
            members.push(...houseMembers);
          }
        }

        if (chamber === 'both' || chamber === 'senate') {
          console.log(`[Congress API] Fetching ${limit} senate members for Congress ${congress}...`);
          const senateResponse = await fetch(
            `https://api.congress.gov/v3/member?congress=${congress}&chamber=Senate&limit=${limit}&api_key=${apiKey}`
          );
          
          if (senateResponse.ok) {
            const senateData = await senateResponse.json();
            const senateMembers = senateData.members || [];
            console.log(`[Congress API] Got ${senateMembers.length} senate members from Congress ${congress}`);
            members.push(...senateMembers);
          }
        }

        console.log(`[Congress API] Total members fetched from Congress ${congress}: ${members.length}`);

        // Filter to only current term members and transform data
        const currentMembers = members.filter(member => {
          if (!member.terms?.item) return false;
          
          // Sort terms by startYear descending
          const terms = [...member.terms.item].sort((a, b) => (b.startYear || 0) - (a.startYear || 0));
          const mostRecentTerm = terms[0];
          
          // Check if they're currently serving
          if (mostRecentTerm.endYear && mostRecentTerm.endYear < currentYear) return false;
          
          return true;
        });

        console.log(`[Congress API] After current term filtering: ${currentMembers.length} members`);

        // Transform the data
        const transformedMembers = currentMembers.map(member => {
          const terms = member.terms?.item || [];
          const sortedTerms = [...terms].sort((a, b) => (b.startYear || 0) - (a.startYear || 0));
          const mostRecentTerm = sortedTerms[0];
          
          return {
            bioguideId: member.bioguideId,
            name: formatName(member.name),
            state: member.state,
            district: member.district,
            party: member.party,
            office_type: mostRecentTerm?.chamber || 'Unknown',
            term_start: mostRecentTerm?.startYear,
            term_end: mostRecentTerm?.endYear,
            terms: member.terms,
            url: member.url,
            imageUrl: member.depiction?.imageUrl || null
          };
        });

        return {
          success: true,
          members: transformedMembers,
          total: transformedMembers.length,
          congress: parseInt(congress),
          chamber: chamber
        };
      },
      CACHE_TTLS.CONGRESS_MEMBERS
    );

    res.status(200).json(data);
  } catch (error) {
    console.error('[Congress API] Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch congressional members',
      details: error.message 
    });
  }
} 