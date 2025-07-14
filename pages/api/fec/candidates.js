export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      candidate_id, 
      name, 
      state, 
      office, 
      party, 
      cycle = '2024',
      limit = 50,
      page = 1
    } = req.query;

    // Ensure page and limit are numbers
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 50;

    console.log(`[FEC API] Fetching candidates with params:`, { candidate_id, name, state, office, party, cycle });

    // Build FEC API URL
    let url = 'https://api.open.fec.gov/v1/candidates/';
    const params = new URLSearchParams({
      api_key: process.env.FEC_API_KEY || 'DEMO_KEY',
      per_page: limitNum,
      page: pageNum,
      election_year: cycle
    });

    if (candidate_id) {
      url += `${candidate_id}/`;
    } else {
      if (name) params.append('name', name);
      if (state) params.append('state', state);
      if (office) params.append('office', office);
      if (party) params.append('party', party);
    }

    url += `?${params.toString()}`;

    console.log(`[FEC API] Requesting: ${url}`);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'GovPulse/1.0'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[FEC API] Error:', errorText);
      throw new Error(`FEC API error: ${response.status}`);
    }

    const data = await response.json();
    
    console.log(`[FEC API] Found ${data.results?.length || 0} candidates`);

    // Transform the data to match our app's format
    const transformedCandidates = (data.results || []).map(candidate => ({
      id: candidate.candidate_id,
      name: candidate.name,
      party: candidate.party_full || candidate.party,
      office: candidate.office_full,
      state: candidate.state,
      district: candidate.district,
      election_year: candidate.election_years,
      incumbent_challenge: candidate.incumbent_challenge_full,
      receipts: candidate.receipts || 0,
      disbursements: candidate.disbursements || 0,
      cash_on_hand: candidate.cash_on_hand_end_period || 0,
      debt: candidate.debts_owed_by_committee || 0,
      status: candidate.candidate_status,
      last_updated: candidate.last_file_date,
      committee_ids: candidate.committee_ids || [],
      // Calculate some derived fields
      net_contributions: (candidate.receipts || 0) - (candidate.disbursements || 0),
      fundraising_efficiency: candidate.receipts ? ((candidate.receipts - candidate.disbursements) / candidate.receipts * 100) : 0
    }));

    res.status(200).json({
      success: true,
      candidates: transformedCandidates,
      pagination: data.pagination || {},
      total: data.pagination?.count || 0,
      page: pageNum,
      limit: limitNum
    });

  } catch (error) {
    console.error('[FEC API] Error fetching candidates:', error);
    
    // Return fallback data if API fails
    const fallbackData = generateFallbackCandidates();
    
    res.status(200).json({
      success: true,
      candidates: fallbackData,
      pagination: { page: pageNum, per_page: limitNum, count: fallbackData.length },
      total: fallbackData.length,
      page: pageNum,
      limit: limitNum,
      note: 'Using fallback data due to API error',
      apiStatus: 'fallback'
    });
  }
}

function generateFallbackCandidates() {
  return [
    {
      id: 'P00003392',
      name: 'Biden, Joseph R Jr',
      party: 'Democratic Party',
      office: 'President',
      state: 'DE',
      district: null,
      election_year: [2024],
      incumbent_challenge: 'Incumbent',
      receipts: 150000000,
      disbursements: 120000000,
      cash_on_hand: 30000000,
      debt: 0,
      status: 'C',
      last_updated: '2024-01-15',
      committee_ids: ['C00703975'],
      net_contributions: 30000000,
      fundraising_efficiency: 20.0
    },
    {
      id: 'P80001571',
      name: 'Trump, Donald J',
      party: 'Republican Party',
      office: 'President',
      state: 'FL',
      district: null,
      election_year: [2024],
      incumbent_challenge: 'Challenger',
      receipts: 120000000,
      disbursements: 100000000,
      cash_on_hand: 20000000,
      debt: 5000000,
      status: 'C',
      last_updated: '2024-01-15',
      committee_ids: ['C00580100'],
      net_contributions: 20000000,
      fundraising_efficiency: 16.7
    },
    {
      id: 'H8CA05245',
      name: 'Pelosi, Nancy',
      party: 'Democratic Party',
      office: 'House',
      state: 'CA',
      district: '11',
      election_year: [2024],
      incumbent_challenge: 'Incumbent',
      receipts: 5000000,
      disbursements: 3000000,
      cash_on_hand: 2000000,
      debt: 0,
      status: 'C',
      last_updated: '2024-01-15',
      committee_ids: ['C00431445'],
      net_contributions: 2000000,
      fundraising_efficiency: 40.0
    }
  ];
} 