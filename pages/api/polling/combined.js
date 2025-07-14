import { getCachedData, CACHE_KEYS, CACHE_TTLS } from '../../../utils/cache';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { pollType = 'presidential', state, candidate, limit = '20' } = req.query;

  try {
    // Create a unique cache key based on parameters
    const cacheKey = `${CACHE_KEYS.POLLING_DATA}_${pollType}_${state || 'all'}_${candidate || 'all'}_${limit}`;
    
    // Use cached data or fetch fresh data
    const data = await getCachedData(
      cacheKey,
      async () => {
        console.log(`[Polling API] Fetching fresh polling data for type: ${pollType}`);
        
        const allPolls = [];
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 180); // Last 6 months
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 180); // Next 6 months

        // Fetch from VoteHub
        try {
          const votehubUrl = `https://api.votehub.com/v1/polls/${pollType}?start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}`;
          console.log(`Fetching from VoteHub: ${votehubUrl}`);
          
          const votehubResponse = await fetch(votehubUrl, { timeout: 5000 });
          if (votehubResponse.ok) {
            const votehubData = await votehubResponse.json();
            if (votehubData.polls && Array.isArray(votehubData.polls)) {
              const votehubPolls = votehubData.polls.map(poll => ({
                ...poll,
                source: 'VoteHub',
                source_url: votehubUrl
              }));
              allPolls.push(...votehubPolls);
            }
          }
        } catch (error) {
          console.log('VoteHub API not available, returning mock data');
        }

        // Fetch from Pollster
        try {
          const pollsterUrls = [
            `https://elections.huffingtonpost.com/pollster/api/v2/polls.json?topic=2024-${pollType}`,
            `https://elections.huffingtonpost.com/pollster/api/v2/polls.json?topic=2016-${pollType}`,
            `https://elections.huffingtonpost.com/pollster/api/v2/polls.json`
          ];

          for (const url of pollsterUrls) {
            console.log(`Trying Pollster URL: ${url}`);
            try {
              const pollsterResponse = await fetch(url, { timeout: 5000 });
              if (pollsterResponse.ok) {
                const pollsterData = await pollsterResponse.json();
                if (pollsterData && Array.isArray(pollsterData)) {
                  const pollsterPolls = pollsterData.map(poll => ({
                    ...poll,
                    source: 'Pollster',
                    source_url: url
                  }));
                  allPolls.push(...pollsterPolls);
                  break; // Use first successful response
                }
              }
            } catch (error) {
              console.log(`Pollster URL failed: ${url}`);
            }
          }
        } catch (error) {
          console.log('All Pollster endpoints failed, returning mock data');
        }

        // If no real data, return mock data
        if (allPolls.length === 0) {
          const mockPolls = generateMockPolls(pollType, parseInt(limit));
          allPolls.push(...mockPolls);
        }

        // Filter and sort polls
        let filteredPolls = allPolls;
        
        if (state) {
          filteredPolls = filteredPolls.filter(poll => 
            poll.state === state || poll.location === state
          );
        }
        
        if (candidate) {
          filteredPolls = filteredPolls.filter(poll => 
            poll.candidates?.some(c => 
              c.name?.toLowerCase().includes(candidate.toLowerCase()) ||
              c.party?.toLowerCase().includes(candidate.toLowerCase())
            )
          );
        }

        // Sort by date (newest first)
        filteredPolls.sort((a, b) => {
          const dateA = new Date(a.end_date || a.date || a.created_at);
          const dateB = new Date(b.end_date || b.date || b.created_at);
          return dateB - dateA;
        });

        // Limit results
        const limitedPolls = filteredPolls.slice(0, parseInt(limit));

        return {
          success: true,
          polls: limitedPolls,
          total: limitedPolls.length,
          pollType: pollType,
          filters: { state, candidate },
          sources: [...new Set(limitedPolls.map(poll => poll.source))],
          timestamp: new Date().toISOString()
        };
      },
      CACHE_TTLS.POLLING_DATA
    );

    res.status(200).json(data);
  } catch (error) {
    console.error('[Polling API] Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch polling data',
      details: error.message 
    });
  }
}

function generateMockPolls(pollType, count = 20) {
  const pollsters = ['Quinnipiac', 'Marist', 'Monmouth', 'Gallup', 'Pew Research', 'YouGov', 'Ipsos', 'Harris'];
  const candidates = {
    presidential: [
      { name: 'Joe Biden', party: 'Democratic' },
      { name: 'Donald Trump', party: 'Republican' },
      { name: 'Robert F. Kennedy Jr.', party: 'Independent' }
    ],
    congressional: [
      { name: 'Generic Democrat', party: 'Democratic' },
      { name: 'Generic Republican', party: 'Republican' }
    ]
  };

  const polls = [];
  const currentCandidates = candidates[pollType] || candidates.presidential;

  for (let i = 0; i < count; i++) {
    const pollster = pollsters[Math.floor(Math.random() * pollsters.length)];
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - Math.floor(Math.random() * 30));
    
    const poll = {
      id: `mock-poll-${i + 1}`,
      pollster: pollster,
      end_date: endDate.toISOString().split('T')[0],
      sample_size: Math.floor(Math.random() * 1000) + 500,
      margin_of_error: (Math.random() * 4 + 2).toFixed(1),
      source: 'Mock Data',
      pollType: pollType,
      candidates: currentCandidates.map(candidate => ({
        name: candidate.name,
        party: candidate.party,
        percentage: Math.floor(Math.random() * 40) + 20
      }))
    };

    // Normalize percentages to sum to 100
    const total = poll.candidates.reduce((sum, c) => sum + c.percentage, 0);
    poll.candidates.forEach(candidate => {
      candidate.percentage = Math.round((candidate.percentage / total) * 100);
    });

    polls.push(poll);
  }

  return polls;
} 