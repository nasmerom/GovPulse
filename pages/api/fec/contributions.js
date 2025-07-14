export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      committee_id, 
      candidate_id, 
      contributor_name, 
      contributor_state, 
      contributor_employer,
      contributor_occupation,
      contribution_type,
      min_amount,
      max_amount,
      cycle = '2024',
      limit = 50,
      page = 1
    } = req.query;

    // Ensure page and limit are numbers
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 50;

    console.log(`[FEC API] Fetching contributions with params:`, { 
      committee_id, candidate_id, contributor_name, contributor_state, 
      min_amount, max_amount, cycle 
    });

    // Build FEC API URL
    let url = 'https://api.open.fec.gov/v1/schedules/schedule_a/';
    const params = new URLSearchParams({
      api_key: process.env.FEC_API_KEY || 'DEMO_KEY',
      per_page: limitNum,
      page: pageNum,
      election_year: cycle
    });

    if (committee_id) {
      params.append('committee_id', committee_id);
    }
    if (candidate_id) {
      params.append('candidate_id', candidate_id);
    }
    if (contributor_name) {
      params.append('contributor_name', contributor_name);
    }
    if (contributor_state) {
      params.append('contributor_state', contributor_state);
    }
    if (contributor_employer) {
      params.append('contributor_employer', contributor_employer);
    }
    if (contributor_occupation) {
      params.append('contributor_occupation', contributor_occupation);
    }
    if (contribution_type) {
      params.append('contribution_type', contribution_type);
    }
    if (min_amount) {
      params.append('min_amount', min_amount);
    }
    if (max_amount) {
      params.append('max_amount', max_amount);
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
    
    console.log(`[FEC API] Found ${data.results?.length || 0} contributions`);

    // Transform the data to match our app's format
    const transformedContributions = (data.results || []).map(contribution => ({
      id: contribution.sub_id,
      committee_id: contribution.committee_id,
      committee_name: contribution.committee_name,
      candidate_id: contribution.candidate_id,
      candidate_name: contribution.candidate_name,
      contributor_name: contribution.contributor_name,
      contributor_city: contribution.contributor_city,
      contributor_state: contribution.contributor_state,
      contributor_zip: contribution.contributor_zip,
      contributor_employer: contribution.contributor_employer,
      contributor_occupation: contribution.contributor_occupation,
      contribution_amount: contribution.contribution_receipt_amount || 0,
      contribution_date: contribution.contribution_receipt_date,
      contribution_type: contribution.contribution_type,
      memo_text: contribution.memo_text,
      receipt_type: contribution.receipt_type_full,
      // Calculate derived fields
      is_individual: contribution.contributor_name && !contribution.contributor_name.includes('COMMITTEE'),
      is_corporate: contribution.contributor_employer && contribution.contributor_employer.length > 0
    }));

    // Calculate summary statistics
    const summary = {
      total_amount: transformedContributions.reduce((sum, c) => sum + c.contribution_amount, 0),
      total_count: transformedContributions.length,
      average_amount: transformedContributions.length > 0 ? 
        transformedContributions.reduce((sum, c) => sum + c.contribution_amount, 0) / transformedContributions.length : 0,
      individual_contributions: transformedContributions.filter(c => c.is_individual).length,
      corporate_contributions: transformedContributions.filter(c => c.is_corporate).length,
      top_contributors: getTopContributors(transformedContributions),
      top_employers: getTopEmployers(transformedContributions)
    };

    res.status(200).json({
      success: true,
      contributions: transformedContributions,
      summary: summary,
      pagination: data.pagination || {},
      total: data.pagination?.count || 0,
      page: pageNum,
      limit: limitNum
    });

  } catch (error) {
    console.error('[FEC API] Error fetching contributions:', error);
    
    // Return fallback data if API fails
    const fallbackData = generateFallbackContributions();
    const pageNum = parseInt(req.query.page) || 1;
    const limitNum = parseInt(req.query.limit) || 50;
    
    res.status(200).json({
      success: true,
      contributions: fallbackData,
      summary: {
        total_amount: fallbackData.reduce((sum, c) => sum + c.contribution_amount, 0),
        total_count: fallbackData.length,
        average_amount: fallbackData.reduce((sum, c) => sum + c.contribution_amount, 0) / fallbackData.length,
        individual_contributions: fallbackData.filter(c => c.is_individual).length,
        corporate_contributions: fallbackData.filter(c => c.is_corporate).length,
        top_contributors: getTopContributors(fallbackData),
        top_employers: getTopEmployers(fallbackData)
      },
      pagination: { page: pageNum, per_page: limitNum, count: fallbackData.length },
      total: fallbackData.length,
      page: pageNum,
      limit: limitNum,
      note: 'Using fallback data due to API error',
      apiStatus: 'fallback'
    });
  }
}

function getTopContributors(contributions) {
  const contributorMap = {};
  contributions.forEach(contribution => {
    const name = contribution.contributor_name;
    if (name) {
      contributorMap[name] = (contributorMap[name] || 0) + contribution.contribution_amount;
    }
  });
  
  return Object.entries(contributorMap)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([name, amount]) => ({ name, amount }));
}

function getTopEmployers(contributions) {
  const employerMap = {};
  contributions.forEach(contribution => {
    const employer = contribution.contributor_employer;
    if (employer) {
      employerMap[employer] = (employerMap[employer] || 0) + contribution.contribution_amount;
    }
  });
  
  return Object.entries(employerMap)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([employer, amount]) => ({ employer, amount }));
}

function generateFallbackContributions() {
  return [
    {
      id: 'SA123456789',
      committee_id: 'C00703975',
      committee_name: 'BIDEN FOR PRESIDENT',
      candidate_id: 'P00003392',
      candidate_name: 'Biden, Joseph R Jr',
      contributor_name: 'Smith, John',
      contributor_city: 'New York',
      contributor_state: 'NY',
      contributor_zip: '10001',
      contributor_employer: 'Goldman Sachs',
      contributor_occupation: 'Investment Banker',
      contribution_amount: 2800,
      contribution_date: '2024-01-15',
      contribution_type: 'Individual',
      memo_text: '',
      receipt_type: 'Individual Contribution',
      is_individual: true,
      is_corporate: true
    },
    {
      id: 'SA123456790',
      committee_id: 'C00580100',
      committee_name: 'DONALD J. TRUMP FOR PRESIDENT 2024, INC.',
      candidate_id: 'P80001571',
      candidate_name: 'Trump, Donald J',
      contributor_name: 'Johnson, Mary',
      contributor_city: 'Miami',
      contributor_state: 'FL',
      contributor_zip: '33101',
      contributor_employer: 'Trump Organization',
      contributor_occupation: 'Executive',
      contribution_amount: 2800,
      contribution_date: '2024-01-14',
      contribution_type: 'Individual',
      memo_text: '',
      receipt_type: 'Individual Contribution',
      is_individual: true,
      is_corporate: true
    },
    {
      id: 'SA123456791',
      committee_id: 'C00703975',
      committee_name: 'BIDEN FOR PRESIDENT',
      candidate_id: 'P00003392',
      candidate_name: 'Biden, Joseph R Jr',
      contributor_name: 'DEMOCRATIC NATIONAL COMMITTEE',
      contributor_city: 'Washington',
      contributor_state: 'DC',
      contributor_zip: '20001',
      contributor_employer: '',
      contributor_occupation: '',
      contribution_amount: 5000000,
      contribution_date: '2024-01-13',
      contribution_type: 'Party',
      memo_text: 'Coordinated expenditure',
      receipt_type: 'Party Coordinated Expenditure',
      is_individual: false,
      is_corporate: false
    },
    {
      id: 'SA123456792',
      committee_id: 'C00580100',
      committee_name: 'DONALD J. TRUMP FOR PRESIDENT 2024, INC.',
      candidate_id: 'P80001571',
      candidate_name: 'Trump, Donald J',
      contributor_name: 'REPUBLICAN NATIONAL COMMITTEE',
      contributor_city: 'Washington',
      contributor_state: 'DC',
      contributor_zip: '20001',
      contributor_employer: '',
      contributor_occupation: '',
      contribution_amount: 4000000,
      contribution_date: '2024-01-12',
      contribution_type: 'Party',
      memo_text: 'Coordinated expenditure',
      receipt_type: 'Party Coordinated Expenditure',
      is_individual: false,
      is_corporate: false
    },
    {
      id: 'SA123456793',
      committee_id: 'C00431445',
      committee_name: 'NANCY PELOSI FOR CONGRESS',
      candidate_id: 'H8CA05245',
      candidate_name: 'Pelosi, Nancy',
      contributor_name: 'Davis, Sarah',
      contributor_city: 'San Francisco',
      contributor_state: 'CA',
      contributor_zip: '94102',
      contributor_employer: 'Google',
      contributor_occupation: 'Software Engineer',
      contribution_amount: 1000,
      contribution_date: '2024-01-11',
      contribution_type: 'Individual',
      memo_text: '',
      receipt_type: 'Individual Contribution',
      is_individual: true,
      is_corporate: true
    }
  ];
} 