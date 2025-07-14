import { congressAPI } from '../integrations/congress-api';
import { fetchWithError } from '../utils/fetchWithError';

/**
 * Politician entity represents a member of Congress or other political figure.
 * Handles fetching member lists, details, and related data from the API.
 * Uses fetchWithError for robust error handling.
 */
export class Politician {
  /**
   * Fetch a list of politicians (members of Congress).
   * @returns {Promise<Array>} List of politicians
   */
  static async list(sortBy = '-approval_rating', limit = 100) {
    try {
      
      // Use relative URLs for browser compatibility
      const response = await fetchWithError('/api/congress/member?congress=119&chamber=both');
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.members || data.members.length === 0) {
        console.warn('[Politician] No members data received, using fallback');
        return this.getFallbackData();
      }

      // Transform API data to match our expected format
      const politicians = data.members.map((member, index) => {
        try {
          console.log(`[Politician] Processing member ${index + 1}:`, member.name, member.party, member.state);
          
          // Use the transformed data from the API
          const isHouse = member.office_type === 'House' || member.office_type === 'House of Representatives';
          
          const politician = {
            id: member.id || `politician-${Math.random().toString(36).substr(2, 9)}`,
            name: member.name || 'Unknown Member',
            position: member.position || (isHouse ? 'U.S. Representative' : 'U.S. Senator'),
            party: this.normalizeParty(member.party),
            office_type: member.office_type || (isHouse ? 'House' : 'Senate'),
            state: member.state || 'Unknown',
            district: member.district || null,
            approval_rating: member.approval_rating || this.generateApprovalRating(member),
            years_in_office: this.calculateYearsFromTerm(member),
            campaign_funds: this.generateCampaignFunds(member),
            dc_phone: member.contact_info?.phone || this.generatePhone(member, 'dc'),
            district_phone: this.generatePhone(member, 'district'),
            dc_office: this.generateOffice(member, 'dc'),
            district_offices: this.generateDistrictOffices(member),
            website: member.contact_info?.website || this.generateWebsite(member),
            photo_url: this.generatePhotoUrl(member),
            bio: member.biography || this.generateBio(member),
            key_issues: this.generateKeyIssues(member),
            caucuses: this.generateCaucuses(member),
            recent_votes: this.generateRecentVotes(member),
            social_media: member.social_media || this.generateSocialMedia(member),
            website_content: this.generateWebsiteContent(member),
            committee_memberships: this.generateCommitteeMemberships(member),
            // Additional fields from API
            term_start: member.term_start,
            term_end: member.term_end,
            voting_record: member.voting_record,
            committee_assignments: member.committee_assignments,
            source: member.source || 'Congress.gov'
          };
          
          console.log(`[Politician] Created politician:`, politician.name, politician.party, politician.office_type);
          return politician;
        } catch (error) {
          console.error(`[Politician] Error processing member ${index + 1}:`, error, member);
          return null; // Return null for failed members
        }
      }).filter(Boolean); // Remove null entries

      // Apply sorting
      if (sortBy === '-approval_rating') {
        politicians.sort((a, b) => b.approval_rating - a.approval_rating);
      } else if (sortBy === 'name') {
        politicians.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === 'state') {
        politicians.sort((a, b) => a.state.localeCompare(b.state));
      }

      // Apply limit
      const limitedPoliticians = politicians.slice(0, limit);
      
      return limitedPoliticians;
      
    } catch (error) {
      console.error('[Politician] Error fetching politicians:', error);
      console.log('[Politician] Using fallback data');
      return this.getFallbackData();
    }
  }

  static normalizeParty(party) {
    if (!party) return 'Unknown';
    if (party === 'Democratic') return 'Democrat';
    if (party === 'Republican') return 'Republican';
    return party;
  }

  static calculateYearsFromTerm(member) {
    if (member.term_start) {
      const currentYear = new Date().getFullYear();
      return Math.max(1, currentYear - member.term_start);
    }
    return Math.floor(Math.random() * 20) + 1;
  }

  static getChamber(member) {
    // Get chamber from the most recent term
    if (member.terms?.item && member.terms.item.length > 0) {
      // Sort terms by startYear descending to get the most recent
      const terms = [...member.terms.item].sort((a, b) => (b.startYear || 0) - (a.startYear || 0));
      const mostRecentTerm = terms[0];
      
      // Only return chamber if this is a current term (no endYear or endYear >= current year)
      const currentYear = new Date().getFullYear();
      if (!mostRecentTerm.endYear || mostRecentTerm.endYear >= currentYear) {
        return mostRecentTerm.chamber;
      }
    }
    return null;
  }

  static formatMemberName(member) {
    const chamber = this.getChamber(member);
    
    const prefix = chamber === 'House of Representatives' ? 'Rep.' : 'Sen.';
    
    // Use firstName/lastName if available (from validated sources)
    if (member.firstName && member.lastName) {
      const formattedName = `${prefix} ${member.firstName} ${member.lastName}`;
      return formattedName;
    }
    
    // Fallback to parsing from name field
    const name = member.name || 'Unknown Member';
    
    // Handle "LastName, FirstName" format
    if (name.includes(',')) {
      const parts = name.split(',');
      const lastName = parts[0].trim();
      const firstName = parts[1]?.trim() || '';
      const formattedName = `${prefix} ${firstName} ${lastName}`.trim();
      return formattedName;
    }
    
    const formattedName = `${prefix} ${name}`;
    return formattedName;
  }

  static getPosition(member) {
    const chamber = this.getChamber(member);
    
    if (chamber === 'House of Representatives') {
      return 'U.S. Representative';
    } else if (chamber === 'Senate') {
      return 'U.S. Senator';
    }
    return 'Unknown Position';
  }

  static getParty(member) {
    // Convert 'Democratic' to 'Democrat' to match frontend expectations
    if (member.partyName === 'Democratic') {
      return 'Democrat';
    }
    return member.partyName || 'Unknown';
  }

  static getPartyCode(partyName) {
    if (!partyName) return null;
    
    const partyMap = {
      'Democratic': 'D',
      'Republican': 'R',
      'Independent': 'I',
      'Independent Democrat': 'ID'
    };
    
    return partyMap[partyName] || partyName;
  }

  static generateApprovalRating(member) {
    // NOTE: This is generated data for demonstration purposes
    // Real approval ratings would need to be sourced from polling organizations
    // like Gallup, Pew Research, or other polling data providers
    
    // Generate realistic approval ratings based on party
    const party = member.party || member.partyName;
    const baseRating = party === 'Democratic' || party === 'Democrat' ? 55 : 45;
    const variation = Math.floor(Math.random() * 30) - 15;
    return Math.max(20, Math.min(85, baseRating + variation));
  }

  static generateCampaignFunds(member) {
    // NOTE: This is generated data for demonstration purposes
    // Real campaign finance data would need to be sourced from FEC.gov
    // or other campaign finance reporting systems
    
    // Generate realistic campaign fund amounts
    const chamber = this.getChamber(member);
    const baseAmount = chamber === 'Senate' ? 3000000 : 1500000;
    const variation = Math.floor(Math.random() * 2000000) - 1000000;
    return Math.max(500000, baseAmount + variation);
  }

  static generatePhone(member, type) {
    // NOTE: Congress.gov API doesn't provide phone numbers in the basic member response
    // These are generated numbers for demonstration purposes only
    // Real contact information would need to be sourced from official congressional websites
    
    if (type === 'dc') {
      // DC office - use 202 area code for congressional offices
      const prefixes = ['225', '226', '227', '228', '229', '230', '231', '232', '233', '234', '235', '236', '237', '238', '239', '240', '241', '242', '243', '244', '245', '246', '247', '248', '249', '250', '251', '252', '253', '254', '255', '256', '257', '258', '259', '260', '261', '262', '263', '264', '265', '266', '267', '268', '269', '270', '271', '272', '273', '274', '275', '276', '277', '278', '279', '280', '281', '282', '283', '284', '285', '286', '287', '288', '289', '290', '291', '292', '293', '294', '295', '296', '297', '298', '299'];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = Math.floor(Math.random() * 9000) + 1000;
      return `(202) ${prefix}-${suffix}`;
    } else {
      // District office - use state-appropriate area codes
      const stateAreaCodes = {
        'CA': ['213', '310', '323', '408', '415', '510', '530', '559', '562', '619', '626', '650', '661', '707', '714', '760', '805', '818', '831', '858', '909', '916', '925', '949', '951'],
        'TX': ['210', '214', '254', '281', '325', '361', '409', '430', '432', '469', '512', '682', '713', '726', '737', '806', '817', '830', '832', '903', '915', '936', '940', '945', '956', '972', '979'],
        'NY': ['212', '315', '332', '347', '516', '518', '585', '607', '631', '646', '680', '716', '718', '838', '845', '914', '917', '929', '934'],
        'FL': ['239', '305', '321', '352', '386', '407', '561', '689', '727', '754', '772', '776', '813', '850', '863', '904', '941', '954', '941'],
        'IL': ['217', '224', '309', '312', '331', '447', '464', '618', '630', '708', '773', '779', '815', '847', '872', '930'],
        'PA': ['215', '223', '267', '272', '412', '445', '484', '570', '582', '610', '717', '724', '814', '835', '878'],
        'OH': ['216', '220', '234', '283', '330', '380', '419', '440', '513', '567', '614', '740', '937'],
        'MI': ['231', '248', '269', '313', '517', '586', '616', '679', '734', '810', '906', '947', '989'],
        'NC': ['252', '336', '704', '743', '828', '910', '919', '980', '984'],
        'GA': ['229', '404', '470', '478', '678', '706', '762', '770', '912']
      };
      
      const state = member.state;
      const areaCodes = stateAreaCodes[state] || ['555']; // Use 555 for unknown states (fictional)
      const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
      const prefix = Math.floor(Math.random() * 900) + 100;
      const suffix = Math.floor(Math.random() * 9000) + 1000;
      
      return `(${areaCode}) ${prefix}-${suffix}`;
    }
  }

  static generateOffice(member, type) {
    // NOTE: Congress.gov API doesn't provide office information in the basic member response
    // These are generated office locations for demonstration purposes only
    
    const chamber = this.getChamber(member);
    const buildings = chamber === 'House of Representatives'
      ? ['Cannon', 'Longworth', 'Rayburn', 'Ford', 'O\'Neill']
      : ['Russell', 'Dirksen', 'Hart'];
    
    const building = buildings[Math.floor(Math.random() * buildings.length)];
    const room = Math.floor(Math.random() * 500) + 100;
    
    return `${building} House Office Building, Room ${room}`;
  }

  static generateDistrictOffices(member) {
    const stateOffices = {
      'CA': ['San Francisco', 'Los Angeles', 'San Diego'],
      'TX': ['Houston', 'Dallas', 'Austin'],
      'NY': ['New York', 'Buffalo', 'Albany'],
      'FL': ['Miami', 'Orlando', 'Tampa'],
      'IL': ['Chicago', 'Springfield', 'Peoria']
    };
    
    const state = member.state;
    const cities = stateOffices[state] || ['Main Office'];
    const numOffices = Math.floor(Math.random() * 3) + 1;
    
    return cities.slice(0, numOffices).map(city => {
      const street = Math.floor(Math.random() * 9999) + 1;
      const zip = Math.floor(Math.random() * 90000) + 10000;
      return `${street} ${city} Street, Suite ${Math.floor(Math.random() * 500) + 100}, ${city}, ${state} ${zip}`;
    });
  }

  static generateWebsite(member) {
    if (member.url) return member.url;
    
    const lastName = member.name?.split(',')[0]?.toLowerCase() || 'member';
    const chamber = this.getChamber(member);
    if (chamber === 'House of Representatives') {
      return `https://${lastName}.house.gov`;
    } else {
      return `https://www.${lastName}.senate.gov`;
    }
  }

  static generatePhotoUrl(member) {
    // Generate party-colored SVG profile pictures
    const party = member.partyName;
    const chamber = this.getChamber(member);
    
    // Generate colors based on party
    let primaryColor, secondaryColor;
    if (party === 'Democratic') {
      primaryColor = '#1e40af'; // Blue
      secondaryColor = '#3b82f6';
    } else if (party === 'Republican') {
      primaryColor = '#dc2626'; // Red
      secondaryColor = '#ef4444';
    } else {
      primaryColor = '#6b7280'; // Gray
      secondaryColor = '#9ca3af';
    }
    
    // Create a simple SVG profile picture
    const svg = `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="100" fill="url(#grad)"/>
        <circle cx="100" cy="80" r="35" fill="white" opacity="0.9"/>
        <path d="M 50 140 Q 100 180 150 140" stroke="white" stroke-width="8" fill="none" opacity="0.9"/>
        <text x="100" y="195" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">
          ${chamber === 'House of Representatives' ? 'H' : 'S'}
        </text>
      </svg>
    `;
    
    // Use Buffer for server-side base64 encoding
    if (typeof window === 'undefined') {
      // Server-side
      return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
    } else {
      // Client-side
      return `data:image/svg+xml;base64,${btoa(svg)}`;
    }
  }

  static generateBio(member) {
    const name = member.name || 'This member';
    const state = member.state || 'their state';
    const isHouse = member.office_type === 'House';
    const chamberName = isHouse ? 'House of Representatives' : 'Senate';
    
    return `${name} represents ${state} in the ${chamberName}. ${name} has been a strong advocate for their constituents and has worked on various legislative initiatives.`;
  }

  static generateKeyIssues(member) {
    const allIssues = ['Healthcare', 'Education', 'Economy', 'National Security', 'Environment', 'Immigration', 'Tax Reform', 'Infrastructure'];
    const numIssues = Math.floor(Math.random() * 3) + 2;
    const shuffled = allIssues.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numIssues);
  }

  static generateCaucuses(member) {
    const party = member.party || member.partyName;
    const isHouse = member.office_type === 'House';
    
    const caucuses = [];
    if (party === 'Democratic' || party === 'Democrat') {
      if (isHouse) {
        caucuses.push('Democratic Caucus');
        caucuses.push('Progressive Caucus');
      } else {
        caucuses.push('Democratic Caucus');
      }
    } else if (party === 'Republican') {
      if (isHouse) {
        caucuses.push('Republican Conference');
        caucuses.push('Freedom Caucus');
      } else {
        caucuses.push('Republican Conference');
      }
    }
    
    // Add some bipartisan caucuses
    const bipartisanCaucuses = ['Congressional Black Caucus', 'Congressional Hispanic Caucus', 'Congressional Asian Pacific American Caucus'];
    if (Math.random() > 0.7) {
      caucuses.push(bipartisanCaucuses[Math.floor(Math.random() * bipartisanCaucuses.length)]);
    }
    
    return caucuses;
  }

  static generateRecentVotes(member) {
    const votes = [];
    const voteTypes = ['Yea', 'Nay', 'Present', 'Not Voting'];
    const bills = ['HR 1234', 'S 5678', 'HR 9012', 'S 3456'];
    
    for (let i = 0; i < 5; i++) {
      votes.push({
        bill: bills[Math.floor(Math.random() * bills.length)],
        vote: voteTypes[Math.floor(Math.random() * voteTypes.length)],
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }
    
    return votes;
  }

  static generateSocialMedia(member) {
    const name = member.name || 'member';
    const lastName = name.split(' ').pop()?.toLowerCase() || 'member';
    return {
      twitter: `@${lastName}`,
      facebook: `facebook.com/${lastName}`,
      instagram: `instagram.com/${lastName}`,
      youtube: `youtube.com/${lastName}`
    };
  }

  static generateWebsiteContent(member) {
    const name = member.name || 'this member';
    return `Welcome to the official website of ${name}. Here you can find information about legislation, constituent services, and how to get involved.`;
  }

  static generateCommitteeMemberships(member) {
    const committees = [];
    const committeeTypes = ['Standing', 'Select', 'Joint'];
    const committeeNames = [
      'Judiciary', 'Appropriations', 'Energy and Commerce', 'Ways and Means',
      'Foreign Affairs', 'Armed Services', 'Homeland Security', 'Finance',
      'Banking', 'Agriculture', 'Education', 'Transportation'
    ];
    
    const numCommittees = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numCommittees; i++) {
      committees.push({
        name: committeeNames[Math.floor(Math.random() * committeeNames.length)],
        type: committeeTypes[Math.floor(Math.random() * committeeTypes.length)],
        role: Math.random() > 0.8 ? 'Chair' : 'Member'
      });
    }
    
    return committees;
  }

  static getFallbackData() {
    return [
      {
        id: 'pelosi-nancy',
        name: 'Rep. Nancy Pelosi',
        position: 'U.S. Representative (District 11)',
        party: 'Democrat',
        office_type: 'House',
        state: 'CA',
        district: '11',
        approval_rating: 65,
        years_in_office: 35,
        campaign_funds: 2500000,
        dc_phone: '(202) 225-4965',
        district_phone: '(415) 556-4862',
        dc_office: 'Cannon House Office Building, Room 123',
        district_offices: ['90 7th Street, Suite 2-800, San Francisco, CA 94103'],
        website: 'https://pelosi.house.gov',
        photo_url: 'https://example.com/pelosi.jpg',
        bio: 'Nancy Pelosi represents California\'s 11th District in the House of Representatives. She has been a strong advocate for her constituents and has worked on various legislative initiatives.',
        key_issues: ['Healthcare', 'Education', 'Economy'],
        caucuses: ['Democratic Caucus', 'Progressive Caucus'],
        recent_votes: [
          { bill: 'HR 1234', vote: 'Yea', date: '2024-01-15' },
          { bill: 'S 5678', vote: 'Nay', date: '2024-01-10' }
        ],
        social_media: {
          twitter: '@SpeakerPelosi',
          facebook: 'facebook.com/SpeakerPelosi',
          instagram: 'instagram.com/speakerpelosi'
        },
        website_content: 'Welcome to the official website of Rep. Nancy Pelosi.',
        committee_memberships: [
          { name: 'Appropriations', type: 'Standing', role: 'Member' }
        ]
      },
      {
        id: 'mcconnell-mitch',
        name: 'Sen. Mitch McConnell',
        position: 'U.S. Senator',
        party: 'Republican',
        office_type: 'Senate',
        state: 'KY',
        district: null,
        approval_rating: 45,
        years_in_office: 38,
        campaign_funds: 3500000,
        dc_phone: '(202) 224-2541',
        district_phone: '(502) 582-6304',
        dc_office: 'Russell Senate Office Building, Room 317',
        district_offices: ['601 West Broadway, Room 630, Louisville, KY 40202'],
        website: 'https://www.mcconnell.senate.gov',
        photo_url: 'https://example.com/mcconnell.jpg',
        bio: 'Mitch McConnell represents Kentucky in the United States Senate. He has been a strong advocate for his constituents and has worked on various legislative initiatives.',
        key_issues: ['National Security', 'Economy', 'Tax Reform'],
        caucuses: ['Republican Conference'],
        recent_votes: [
          { bill: 'HR 1234', vote: 'Nay', date: '2024-01-15' },
          { bill: 'S 5678', vote: 'Yea', date: '2024-01-10' }
        ],
        social_media: {
          twitter: '@McConnellPress',
          facebook: 'facebook.com/mitchmcconnell',
          instagram: 'instagram.com/mitchmcconnell'
        },
        website_content: 'Welcome to the official website of Sen. Mitch McConnell.',
        committee_memberships: [
          { name: 'Appropriations', type: 'Standing', role: 'Member' }
        ]
      }
    ];
  }

  /**
   * Fetch details for a specific politician.
   * @param {string} id - Politician identifier
   * @returns {Promise<Object>} Politician details
   */
  static async get(id) {
    console.log('[Politician.get] Looking for politician with ID:', id);
    const politicians = await this.list();
    console.log('[Politician.get] Total politicians loaded:', politicians.length);
    console.log('[Politician.get] Sample IDs:', politicians.slice(0, 5).map(p => p.id));
    
    const found = politicians.find(politician => politician.id === id);
    console.log('[Politician.get] Found politician:', found ? 'YES' : 'NO');
    return found;
  }

  static async search(query, limit = 20) {
    const politicians = await this.list();
    const searchTerm = query.toLowerCase();
    
    return politicians
      .filter(politician => 
        politician.name.toLowerCase().includes(searchTerm) ||
        politician.state.toLowerCase().includes(searchTerm) ||
        politician.party.toLowerCase().includes(searchTerm)
      )
      .slice(0, limit);
  }
}