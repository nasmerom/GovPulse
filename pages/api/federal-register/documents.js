export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      search, 
      agency, 
      document_type, 
      publication_date_start, 
      publication_date_end,
      effective_date_start,
      effective_date_end,
      limit = 50,
      page = 1
    } = req.query;

    console.log(`[Federal Register API] Fetching documents with params:`, { 
      search, agency, document_type, publication_date_start, publication_date_end 
    });

    // Build Federal Register API URL
    let url = 'https://www.federalregister.gov/api/v1/documents.json';
    const params = new URLSearchParams({
      per_page: limit,
      page: page,
      order: 'newest'
    });

    if (search) params.append('conditions[term]', search);
    if (agency) params.append('conditions[agencies][]', agency);
    if (document_type) params.append('conditions[type][]', document_type);
    if (publication_date_start) params.append('conditions[publication_date][gte]', publication_date_start);
    if (publication_date_end) params.append('conditions[publication_date][lte]', publication_date_end);
    if (effective_date_start) params.append('conditions[effective_date][gte]', effective_date_start);
    if (effective_date_end) params.append('conditions[effective_date][lte]', effective_date_end);

    url += `?${params.toString()}`;

    console.log(`[Federal Register API] Requesting: ${url}`);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'GovPulse/1.0'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Federal Register API] Error:', errorText);
      throw new Error(`Federal Register API error: ${response.status}`);
    }

    const data = await response.json();
    
    console.log(`[Federal Register API] Found ${data.results?.length || 0} documents`);

    // Transform the data to match our app's format
    const transformedDocuments = (data.results || []).map(doc => ({
      id: doc.document_number,
      title: doc.title,
      abstract: doc.abstract,
      document_type: doc.document_type,
      agency_names: doc.agency_names,
      publication_date: doc.publication_date,
      effective_date: doc.effective_date,
      comment_date: doc.comment_date,
      docket_ids: doc.docket_ids || [],
      regulation_id_numbers: doc.regulation_id_numbers || [],
      page_length: doc.page_length,
      pdf_url: doc.pdf_url,
      html_url: doc.html_url,
      // Calculate derived fields
      days_until_effective: doc.effective_date ? 
        Math.ceil((new Date(doc.effective_date) - new Date()) / (1000 * 60 * 60 * 24)) : null,
      days_until_comment: doc.comment_date ? 
        Math.ceil((new Date(doc.comment_date) - new Date()) / (1000 * 60 * 60 * 24)) : null,
      is_recent: doc.publication_date ? 
        (new Date() - new Date(doc.publication_date)) / (1000 * 60 * 60 * 24) <= 30 : false,
      has_comments: doc.comment_date ? true : false
    }));

    res.status(200).json({
      success: true,
      documents: transformedDocuments,
      pagination: data.count,
      total: data.count || 0,
      page: parseInt(page),
      limit: parseInt(limit)
    });

  } catch (error) {
    console.error('[Federal Register API] Error fetching documents:', error);
    
    // Return fallback data if API fails
    const fallbackData = generateFallbackDocuments();
    
    res.status(200).json({
      success: true,
      documents: fallbackData,
      pagination: fallbackData.length,
      total: fallbackData.length,
      page: parseInt(page),
      limit: parseInt(limit),
      note: 'Using fallback data due to API error',
      apiStatus: 'fallback'
    });
  }
}

function generateFallbackDocuments() {
  return [
    {
      id: '2024-12345',
      title: 'Standards for the Growing, Harvesting, Packing, and Holding of Produce for Human Consumption',
      abstract: 'The Food and Drug Administration (FDA) is proposing to amend the agricultural water provisions of the produce safety regulation.',
      document_type: 'Proposed Rule',
      agency_names: ['Food and Drug Administration'],
      publication_date: '2024-01-15',
      effective_date: '2024-03-15',
      comment_date: '2024-03-15',
      docket_ids: ['FDA-2024-N-1234'],
      regulation_id_numbers: ['0910-AH00'],
      page_length: 45,
      pdf_url: 'https://www.federalregister.gov/documents/2024/01/15/2024-12345.pdf',
      html_url: 'https://www.federalregister.gov/documents/2024/01/15/2024-12345',
      days_until_effective: 60,
      days_until_comment: 60,
      is_recent: true,
      has_comments: true
    },
    {
      id: '2024-12346',
      title: 'Energy Conservation Program: Energy Conservation Standards for Consumer Conventional Cooking Products',
      abstract: 'The Department of Energy (DOE) is proposing energy conservation standards for consumer conventional cooking products.',
      document_type: 'Proposed Rule',
      agency_names: ['Energy Department'],
      publication_date: '2024-01-14',
      effective_date: '2024-04-14',
      comment_date: '2024-03-14',
      docket_ids: ['EERE-2023-BT-STD-0023'],
      regulation_id_numbers: ['1904-AD00'],
      page_length: 32,
      pdf_url: 'https://www.federalregister.gov/documents/2024/01/14/2024-12346.pdf',
      html_url: 'https://www.federalregister.gov/documents/2024/01/14/2024-12346',
      days_until_effective: 90,
      days_until_comment: 60,
      is_recent: true,
      has_comments: true
    },
    {
      id: '2024-12347',
      title: 'Air Plan Approval; California; San Joaquin Valley Unified Air Pollution Control District',
      abstract: 'The Environmental Protection Agency (EPA) is proposing to approve a revision to the San Joaquin Valley Unified Air Pollution Control District portion of the California State Implementation Plan.',
      document_type: 'Proposed Rule',
      agency_names: ['Environmental Protection Agency'],
      publication_date: '2024-01-13',
      effective_date: '2024-02-13',
      comment_date: '2024-02-13',
      docket_ids: ['EPA-R09-OAR-2023-1234'],
      regulation_id_numbers: ['2060-AU00'],
      page_length: 28,
      pdf_url: 'https://www.federalregister.gov/documents/2024/01/13/2024-12347.pdf',
      html_url: 'https://www.federalregister.gov/documents/2024/01/13/2024-12347',
      days_until_effective: 30,
      days_until_comment: 30,
      is_recent: true,
      has_comments: true
    },
    {
      id: '2024-12348',
      title: 'Cybersecurity Maturity Model Certification (CMMC) Program',
      abstract: 'The Department of Defense (DoD) is establishing the CMMC Program to assess and enhance the cybersecurity posture of the Defense Industrial Base.',
      document_type: 'Final Rule',
      agency_names: ['Defense Department'],
      publication_date: '2024-01-12',
      effective_date: '2024-02-12',
      comment_date: null,
      docket_ids: ['DARS-2023-0001'],
      regulation_id_numbers: ['0750-AK00'],
      page_length: 56,
      pdf_url: 'https://www.federalregister.gov/documents/2024/01/12/2024-12348.pdf',
      html_url: 'https://www.federalregister.gov/documents/2024/01/12/2024-12348',
      days_until_effective: 30,
      days_until_comment: null,
      is_recent: true,
      has_comments: false
    },
    {
      id: '2024-12349',
      title: 'Patient Protection and Affordable Care Act; HHS Notice of Benefit and Payment Parameters for 2025',
      abstract: 'This final rule sets forth payment parameters and provisions related to the risk adjustment and risk adjustment data validation programs.',
      document_type: 'Final Rule',
      agency_names: ['Health and Human Services Department'],
      publication_date: '2024-01-11',
      effective_date: '2024-02-11',
      comment_date: null,
      docket_ids: ['CMS-2024-0001'],
      regulation_id_numbers: ['0938-AU00'],
      page_length: 89,
      pdf_url: 'https://www.federalregister.gov/documents/2024/01/11/2024-12349.pdf',
      html_url: 'https://www.federalregister.gov/documents/2024/01/11/2024-12349',
      days_until_effective: 30,
      days_until_comment: null,
      is_recent: true,
      has_comments: false
    }
  ];
} 