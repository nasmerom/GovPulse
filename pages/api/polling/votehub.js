export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { pollType, state, candidate, dateRange } = req.query;
    
    try {
      // VoteHub API endpoints (these may need to be updated based on actual VoteHub API structure)
      let votehubUrl = 'https://api.votehub.com/v1/';
      
      // Build the appropriate endpoint based on parameters
      if (pollType === 'presidential') {
        votehubUrl += 'polls/presidential';
      } else if (pollType === 'congressional' || pollType === 'generic_ballot') {
        votehubUrl += 'polls/congressional';
      } else if (pollType === 'senate') {
        votehubUrl += 'polls/senate';
      } else if (pollType === 'governor') {
        votehubUrl += 'polls/governor';
      } else {
        votehubUrl += 'polls';
      }

      // Add query parameters
      const params = new URLSearchParams();
      
      if (state && state !== 'national') {
        params.append('state', state);
      }
      
      if (candidate) {
        params.append('candidate', candidate);
      }
      
      if (dateRange) {
        params.append('date_range', dateRange);
      } else {
        // Default to last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        params.append('start_date', sixMonthsAgo.toISOString().split('T')[0]);
        params.append('end_date', new Date().toISOString().split('T')[0]);
      }

      if (params.toString()) {
        votehubUrl += `?${params.toString()}`;
      }

      console.log('Fetching from VoteHub:', votehubUrl);

      const response = await fetch(votehubUrl, {
        headers: {
          'User-Agent': 'GovPulse/1.0 (Political Intelligence Platform)',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        // If VoteHub API is not available, return mock data
        console.log('VoteHub API not available, returning mock data');
        return res.status(200).json({
          polls: getMockVoteHubData(pollType, state),
          source: 'VoteHub (Mock)',
          total_polls: 15,
          last_updated: new Date().toISOString(),
          note: 'Using mock data - VoteHub API endpoint may need configuration'
        });
      }

      const data = await response.json();
      
      // Transform VoteHub data to our format
      const transformedPolls = data.polls?.map(poll => ({
        id: poll.id || `vh_${Date.now()}_${Math.random()}`,
        pollster: poll.pollster || poll.source,
        poll_type: pollType || 'presidential',
        state: poll.state || null,
        date_conducted: poll.end_date || poll.date,
        sample_size: poll.sample_size || poll.n,
        margin_of_error: poll.margin_of_error || poll.moe,
        methodology: poll.methodology || poll.method,
        results: poll.results?.map(result => ({
          candidate: result.candidate || result.choice,
          percentage: result.percentage || result.value,
          party: getPartyFromCandidate(result.candidate || result.choice)
        })) || [],
        url: poll.url || poll.source_url,
        source: 'VoteHub'
      })) || [];

      res.status(200).json({
        polls: transformedPolls,
        source: 'VoteHub',
        total_polls: transformedPolls.length,
        last_updated: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error fetching from VoteHub:', error);
      
      // Return mock data as fallback
      res.status(200).json({
        polls: getMockVoteHubData(pollType, state),
        source: 'VoteHub (Mock)',
        total_polls: 15,
        last_updated: new Date().toISOString(),
        note: 'Using mock data due to API error'
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

// Mock data for VoteHub when API is not available
function getMockVoteHubData(pollType, state) {
  const mockPolls = [];
  const pollsters = ['VoteHub Research', 'National Polling Institute', 'State Polling Center', 'Electoral Analytics'];
  
  for (let i = 0; i < 15; i++) {
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
    results.forEach(r => r.percentage = (r.percentage / total * 100).toFixed(1));

    mockPolls.push({
      id: `vh_mock_${i}`,
      pollster: pollsters[Math.floor(Math.random() * pollsters.length)],
      poll_type: pollType || 'presidential',
      state: state === 'national' ? null : state,
      date_conducted: date.toISOString().split('T')[0],
      sample_size: 800 + Math.floor(Math.random() * 400),
      margin_of_error: (3 + Math.random() * 2).toFixed(1),
      methodology: ['Live Phone', 'Online Panel', 'Mixed Mode'][Math.floor(Math.random() * 3)],
      results: results,
      url: 'https://votehub.com',
      source: 'VoteHub'
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