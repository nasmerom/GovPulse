import { congressAPI } from '../integrations/congress-api';
import { fetchWithError } from '../utils/fetchWithError';

/**
 * Committee entity represents a congressional committee.
 * Handles fetching committee lists, details, members, and leadership from the API.
 * Uses fetchWithError for robust error handling.
 */
export class Committee {
  constructor(data = {}) {
    this.id = data.id || data.committeeId || '';
    this.name = data.name || data.committeeName || '';
    this.chamber = data.chamber || '';
    this.type = data.type || data.committeeType || '';
    this.url = data.url || '';
    this.website = data.website || '';
    this.phone = data.phone || '';
    this.address = data.address || '';
    this.chair = data.chair || null;
    this.rankingMember = data.rankingMember || null;
    this.members = data.members || [];
    this.subcommittees = data.subcommittees || [];
    this.jurisdiction = data.jurisdiction || '';
    this.budgetAuthority = data.budgetAuthority || 0;
    this.influenceScore = data.influenceScore || 0;
    this.activityLevel = data.activityLevel || 'medium';
    this.recentActivity = data.recentActivity || [];
    this.upcomingEvents = data.upcomingEvents || [];
    this.keyIssues = data.keyIssues || [];
    this.industryImpact = data.industryImpact || {};
    this.votingPatterns = data.votingPatterns || {};
    this.legislativePipeline = data.legislativePipeline || [];
  }

  static async getAll(congress = 119) {
    try {
      console.log('[Committee] Fetching committees for Congress:', congress);
      
      const response = await fetchWithError(`/api/congress/committee?congress=${congress}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('[Committee] Raw committee data:', data);
      
      if (!data.committees || !Array.isArray(data.committees)) {
        console.warn('[Committee] No committees data found, using fallback');
        return this.getFallbackCommittees();
      }
      
      const committees = data.committees.map(committee => new Committee(committee));
      console.log('[Committee] Processed committees:', committees.length);
      
      return committees;
    } catch (error) {
      console.error('[Committee] Error fetching committees:', error);
      return this.getFallbackCommittees();
    }
  }

  /**
   * Fetch a list of committees for a given Congress session.
   * @param {number} congress - Congress session number
   * @returns {Promise<Array>} List of committees
   */
  static async list(sortBy = 'name', limit = 50, congress = 119) {
    try {
      console.log('[Committee] Fetching committees list with sort:', sortBy, 'limit:', limit);
      
      const committees = await this.getAll(congress);
      
      // Sort committees based on sortBy parameter
      let sortedCommittees = [...committees];
      switch (sortBy) {
        case 'name':
          sortedCommittees.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'influence':
          sortedCommittees.sort((a, b) => (b.influenceScore || 0) - (a.influenceScore || 0));
          break;
        case 'activity':
          sortedCommittees.sort((a, b) => {
            const activityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
            return (activityOrder[b.activityLevel] || 0) - (activityOrder[a.activityLevel] || 0);
          });
          break;
        case 'chamber':
          sortedCommittees.sort((a, b) => a.chamber.localeCompare(b.chamber));
          break;
        default:
          sortedCommittees.sort((a, b) => a.name.localeCompare(b.name));
      }
      
      // Apply limit
      const limitedCommittees = sortedCommittees.slice(0, limit);
      console.log('[Committee] Returning', limitedCommittees.length, 'committees');
      
      return limitedCommittees;
    } catch (error) {
      console.error('[Committee] Error in list method:', error);
      return this.getFallbackCommittees().slice(0, limit);
    }
  }

  /**
   * Fetch details for a specific committee.
   * @param {string} committeeId - Committee identifier
   * @param {number} congress - Congress session number
   * @returns {Promise<Object>} Committee details
   */
  static async getById(committeeId, congress = 119) {
    try {
      const response = await fetchWithError(`/api/congress/committee-detail?committeeId=${committeeId}&congress=${congress}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return new Committee(data);
    } catch (error) {
      console.error('[Committee] Error fetching committee details:', error);
      return null;
    }
  }

  /**
   * Fetch members for a specific committee.
   * @param {string} committeeId - Committee identifier
   * @param {number} congress - Congress session number
   * @returns {Promise<Array>} Committee members
   */
  static async getMembers(committeeId, congress = 119) {
    try {
      const response = await fetchWithError(`/api/congress/committee-members?committeeId=${committeeId}&congress=${congress}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.members || [];
    } catch (error) {
      console.error('[Committee] Error fetching committee members:', error);
      return [];
    }
  }

  /**
   * Fetch leadership for a specific committee.
   * @param {string} committeeId - Committee identifier
   * @param {number} congress - Congress session number
   * @returns {Promise<Array>} Committee leadership
   */
  static async getLeadership(committeeId, congress = 119) {
    try {
      const response = await fetchWithError(`/api/congress/committee-leadership?committeeId=${committeeId}&congress=${congress}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        chair: data.chair,
        rankingMember: data.rankingMember,
        viceChair: data.viceChair
      };
    } catch (error) {
      console.error('[Committee] Error fetching committee leadership:', error);
      return {};
    }
  }

  calculateInfluenceScore() {
    let score = 0;
    
    // Base score from budget authority
    if (this.budgetAuthority > 0) {
      score += Math.min(this.budgetAuthority / 1000000000, 50); // Cap at 50 points
    }
    
    // Chamber bonus (Senate committees generally have more influence)
    if (this.chamber === 'Senate') {
      score += 20;
    }
    
    // Committee type bonus
    const typeBonuses = {
      'standing': 30,
      'select': 25,
      'joint': 20,
      'special': 15
    };
    score += typeBonuses[this.type] || 10;
    
    // Member count bonus
    if (this.members && this.members.length > 0) {
      score += Math.min(this.members.length * 2, 20);
    }
    
    // Activity level bonus
    const activityBonuses = {
      'high': 25,
      'medium': 15,
      'low': 5
    };
    score += activityBonuses[this.activityLevel] || 10;
    
    this.influenceScore = Math.round(score);
    return this.influenceScore;
  }

  getIndustryImpact(industry) {
    const impactMap = {
      'defense': ['Armed Services', 'Appropriations', 'Intelligence'],
      'healthcare': ['Health, Education, Labor, and Pensions', 'Energy and Commerce', 'Ways and Means'],
      'finance': ['Banking, Housing, and Urban Affairs', 'Finance', 'Ways and Means'],
      'energy': ['Energy and Natural Resources', 'Energy and Commerce', 'Science, Space, and Technology'],
      'technology': ['Commerce, Science, and Transportation', 'Energy and Commerce', 'Science, Space, and Technology'],
      'agriculture': ['Agriculture, Nutrition, and Forestry', 'Agriculture'],
      'transportation': ['Commerce, Science, and Transportation', 'Transportation and Infrastructure'],
      'education': ['Health, Education, Labor, and Pensions', 'Education and the Workforce'],
      'environment': ['Environment and Public Works', 'Natural Resources', 'Energy and Commerce'],
      'foreign': ['Foreign Relations', 'Foreign Affairs', 'Intelligence']
    };
    
    const relevantCommittees = impactMap[industry] || [];
    const relevance = relevantCommittees.some(committee => 
      this.name.toLowerCase().includes(committee.toLowerCase())
    ) ? 'high' : 'medium';
    
    return {
      relevance,
      committees: relevantCommittees,
      impactScore: relevance === 'high' ? 85 : 50
    };
  }

  getVotingPatterns() {
    if (!this.members || this.members.length === 0) {
      return {
        partyBreakdown: {},
        votingConsistency: 0,
        keySwingVotes: []
      };
    }
    
    const partyBreakdown = {};
    this.members.forEach(member => {
      const party = member.party || 'Unknown';
      partyBreakdown[party] = (partyBreakdown[party] || 0) + 1;
    });
    
    return {
      partyBreakdown,
      votingConsistency: Math.floor(Math.random() * 30) + 70, // Mock data
      keySwingVotes: this.members.filter(m => m.party === 'Independent').slice(0, 3)
    };
  }

  getRecentActivity() {
    const activities = [
      {
        type: 'hearing',
        title: 'Oversight Hearing on Regulatory Compliance',
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        status: 'completed'
      },
      {
        type: 'markup',
        title: 'Markup of H.R. 1234 - Innovation Act',
        date: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
        status: 'completed'
      },
      {
        type: 'vote',
        title: 'Vote on Amendment to S. 567',
        date: new Date(Date.now() - Math.random() * 21 * 24 * 60 * 60 * 1000),
        status: 'completed'
      }
    ];
    
    return activities.sort((a, b) => b.date - a.date);
  }

  getUpcomingEvents() {
    const events = [
      {
        type: 'hearing',
        title: 'Future of Technology Regulation',
        date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        witnesses: ['Tech CEO', 'Regulatory Expert', 'Consumer Advocate']
      },
      {
        type: 'markup',
        title: 'Markup of Proposed Legislation',
        date: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000),
        bills: ['H.R. 2345', 'S. 678']
      }
    ];
    
    return events.sort((a, b) => a.date - b.date);
  }

  static getFallbackCommittees() {
    const committees = [
      {
        id: 'SSAF',
        name: 'Senate Armed Services',
        chamber: 'Senate',
        type: 'standing',
        chair: 'Jack Reed',
        rankingMember: 'Roger Wicker',
        influenceScore: 95,
        activityLevel: 'high',
        budgetAuthority: 850000000000,
        jurisdiction: 'Defense policy, military operations, and national security',
        keyIssues: ['Defense Authorization', 'Military Readiness', 'Cybersecurity']
      },
      {
        id: 'SSAP',
        name: 'Senate Appropriations',
        chamber: 'Senate',
        type: 'standing',
        chair: 'Patty Murray',
        rankingMember: 'Susan Collins',
        influenceScore: 98,
        activityLevel: 'high',
        budgetAuthority: 1500000000000,
        jurisdiction: 'Federal spending and budget allocation',
        keyIssues: ['Budget Process', 'Government Funding', 'Emergency Spending']
      },
      {
        id: 'SSFR',
        name: 'Senate Foreign Relations',
        chamber: 'Senate',
        type: 'standing',
        chair: 'Ben Cardin',
        rankingMember: 'Jim Risch',
        influenceScore: 90,
        activityLevel: 'high',
        budgetAuthority: 50000000000,
        jurisdiction: 'Foreign policy and international relations',
        keyIssues: ['Diplomatic Relations', 'Trade Agreements', 'Foreign Aid']
      },
      {
        id: 'HSAS',
        name: 'House Armed Services',
        chamber: 'House',
        type: 'standing',
        chair: 'Mike Rogers',
        rankingMember: 'Adam Smith',
        influenceScore: 88,
        activityLevel: 'high',
        budgetAuthority: 850000000000,
        jurisdiction: 'Defense policy and military affairs',
        keyIssues: ['Defense Authorization', 'Military Modernization', 'Veterans Affairs']
      },
      {
        id: 'HSAP',
        name: 'House Appropriations',
        chamber: 'House',
        type: 'standing',
        chair: 'Kay Granger',
        rankingMember: 'Rosa DeLauro',
        influenceScore: 96,
        activityLevel: 'high',
        budgetAuthority: 1500000000000,
        jurisdiction: 'Federal spending and budget process',
        keyIssues: ['Budget Process', 'Government Funding', 'Program Oversight']
      },
      {
        id: 'HSIF',
        name: 'House Financial Services',
        chamber: 'House',
        type: 'standing',
        chair: 'Patrick McHenry',
        rankingMember: 'Maxine Waters',
        influenceScore: 85,
        activityLevel: 'high',
        budgetAuthority: 20000000000,
        jurisdiction: 'Financial services and banking regulation',
        keyIssues: ['Banking Regulation', 'Consumer Protection', 'Housing Finance']
      },
      {
        id: 'SSEC',
        name: 'Senate Energy and Natural Resources',
        chamber: 'Senate',
        type: 'standing',
        chair: 'Joe Manchin',
        rankingMember: 'John Barrasso',
        influenceScore: 82,
        activityLevel: 'medium',
        budgetAuthority: 30000000000,
        jurisdiction: 'Energy policy and natural resources',
        keyIssues: ['Energy Policy', 'Climate Change', 'Public Lands']
      },
      {
        id: 'HSEC',
        name: 'House Energy and Commerce',
        chamber: 'House',
        type: 'standing',
        chair: 'Cathy McMorris Rodgers',
        rankingMember: 'Frank Pallone',
        influenceScore: 87,
        activityLevel: 'high',
        budgetAuthority: 40000000000,
        jurisdiction: 'Energy, commerce, and telecommunications',
        keyIssues: ['Energy Policy', 'Healthcare', 'Technology Regulation']
      }
    ];
    
    return committees.map(committee => new Committee(committee));
  }
} 