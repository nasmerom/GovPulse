export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { pollType, state, candidate } = req.query;
    
    try {
      // Try multiple Pollster endpoints since the API structure may have changed
      let pollsterUrls = [];
      
      if (pollType === 'presidential') {
        pollsterUrls = [
          'https://elections.huffingtonpost.com/pollster/api/v2/polls.json?topic=2024-president',
          'https://elections.huffingtonpost.com/pollster/api/v2/polls.json?topic=2016-president',
          'https://elections.huffingtonpost.com/pollster/api/v2/polls.json'
        ];
      } else if (pollType === 'congressional' || pollType === 'generic_ballot') {
        pollsterUrls = [
          'https://elections.huffingtonpost.com/pollster/api/v2/polls.json?topic=2024-house-national',
          'https://elections.huffingtonpost.com/pollster/api/v2/polls.json?topic=2016-house-national',
          'https://elections.huffingtonpost.com/pollster/api/v2/polls.json'
        ];
      } else {
        pollsterUrls = ['https://elections.huffingtonpost.com/pollster/api/v2/polls.json'];
      }

      let data = null;
      let workingUrl = null;

      // Try each URL until one works
      for (const url of pollsterUrls) {
        try {
          console.log('Trying Pollster URL:', url);
          
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'GovPulse/1.0 (Political Intelligence Platform)',
              'Accept': 'application/json'
            },
            timeout: 5000
          });

          if (response.ok) {
            data = await response.json();
            workingUrl = url;
            console.log('Successfully fetched from Pollster:', url);
            break;
          }
        } catch (error) {
          console.log('Failed to fetch from:', url, error.message);
          continue;
        }
      }

      // If no API worked, return mock data
      if (!data) {
        console.log('All Pollster endpoints failed, returning mock data');
        return res.status(200).json({
          polls: getMockPollsterData(pollType, state),
          source: 'Pollster (Mock)',
          total_polls: 20,
          last_updated: new Date().toISOString(),
          note: 'Using mock data - Pollster API endpoints may need configuration'
        });
      }
      
      // Transform Pollster data to our format
      const transformedPolls = data.polls?.map(poll => ({
        id: poll.id,
        pollster: poll.pollster,
        poll_type: pollType || 'presidential',
        state: poll.state || null,
        date_conducted: poll.end_date,
        sample_size: poll.sample_size,
        margin_of_error: poll.margin_of_error,
        methodology: poll.methodology,
        results: poll.questions?.[0]?.subpopulations?.[0]?.responses?.map(response => ({
          candidate: response.choice,
          percentage: response.value,
          party: getPartyFromCandidate(response.choice)
        })) || [],
        url: poll.url,
        source: 'Pollster (HuffPost)'
      })) || [];

      res.status(200).json({
        polls: transformedPolls,
        source: 'Pollster',
        total_polls: transformedPolls.length,
        last_updated: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error fetching from Pollster:', error);
      
      // Return mock data as fallback
      res.status(200).json({
        polls: getMockPollsterData(pollType, state),
        source: 'Pollster (Mock)',
        total_polls: 20,
        last_updated: new Date().toISOString(),
        note: 'Using mock data due to API error'
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

// Mock data for Pollster when API is not available
function getMockPollsterData(pollType, state) {
  const mockPolls = [];
  const pollsters = ['Quinnipiac University', 'Marist College', 'Monmouth University', 'Siena College', 'Emerson College', 'YouGov', 'Ipsos', 'Gallup'];
  
  for (let i = 0; i < 20; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 180)); // Random date in last 6 months
    
    let results = [];
    
    if (pollType === 'presidential') {
      results = [
        { candidate: 'Joe Biden', percentage: 45 + Math.random() * 10, party: 'Democrat' },
        { candidate: 'Donald Trump', percentage: 40 + Math.random() * 10, party: 'Republican' },
        { candidate: 'Robert F. Kennedy Jr.', percentage: 5 + Math.random() * 5, party: 'Independent' }
      ];
    } else if (pollType === 'congressional' || pollType === 'generic_ballot') {
      results = [
        { candidate: 'Democratic Candidate', percentage: 48 + Math.random() * 8, party: 'Democrat' },
        { candidate: 'Republican Candidate', percentage: 45 + Math.random() * 8, party: 'Republican' }
      ];
    } else if (pollType === 'senate') {
      results = [
        { candidate: 'Democratic Candidate', percentage: 47 + Math.random() * 10, party: 'Democrat' },
        { candidate: 'Republican Candidate', percentage: 46 + Math.random() * 10, party: 'Republican' }
      ];
    }

    // Normalize percentages to sum to 100
    const total = results.reduce((sum, r) => sum + r.percentage, 0);
    results.forEach(r => r.percentage = parseFloat((r.percentage / total * 100).toFixed(1)));

    mockPolls.push({
      id: `pollster_mock_${i}`,
      pollster: pollsters[Math.floor(Math.random() * pollsters.length)],
      poll_type: pollType || 'presidential',
      state: state === 'national' ? null : state,
      date_conducted: date.toISOString().split('T')[0],
      sample_size: 800 + Math.floor(Math.random() * 400),
      margin_of_error: (3 + Math.random() * 2).toFixed(1),
      methodology: ['Live Phone', 'Online Panel', 'Mixed Mode'][Math.floor(Math.random() * 3)],
      results: results,
      url: 'https://elections.huffingtonpost.com/pollster',
      source: 'Pollster (HuffPost)'
    });
  }

  return mockPolls.sort((a, b) => new Date(b.date_conducted) - new Date(a.date_conducted));
}

// Helper function to determine party from candidate name
function getPartyFromCandidate(candidateName) {
  const candidateNameLower = candidateName.toLowerCase();
  
  // 2024 Presidential candidates
  if (candidateNameLower.includes('biden') || candidateNameLower.includes('democrat')) {
    return 'Democrat';
  }
  if (candidateNameLower.includes('trump') || candidateNameLower.includes('republican')) {
    return 'Republican';
  }
  if (candidateNameLower.includes('kennedy') || candidateNameLower.includes('independent')) {
    return 'Independent';
  }
  
  // Generic party detection
  if (candidateNameLower.includes('dem') || candidateNameLower.includes('democrat')) {
    return 'Democrat';
  }
  if (candidateNameLower.includes('rep') || candidateNameLower.includes('republican')) {
    return 'Republican';
  }
  if (candidateNameLower.includes('ind') || candidateNameLower.includes('independent')) {
    return 'Independent';
  }
  
  return 'Unknown';
} 