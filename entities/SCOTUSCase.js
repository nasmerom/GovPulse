// Mock SCOTUSCase entity for now - replace with actual API calls
import { fetchWithError } from '../utils/fetchWithError';

/**
 * SCOTUSCase entity represents a Supreme Court case.
 * Handles fetching case data from the API and provides fallback to sample data.
 * Uses fetchWithError for robust error handling.
 */
export class SCOTUSCase {
  /**
   * Fetch a list of Supreme Court cases.
   * @param {string} sortBy - Sort order
   * @param {number} limit - Number of cases to fetch
   * @returns {Promise<Array>} List of cases
   */
  static async list(sortBy = '-decision_date', limit = 50) {
    try {
      console.log('⚖️ SCOTUSCase.list() - Fetching real Supreme Court data...');
      
      const response = await fetchWithError(`/api/scotus?limit=${limit}`);
      if (!response.ok) {
        throw new Error(`SCOTUS API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('✅ SCOTUSCase.list() - Real SCOTUS data loaded:', {
        count: data.cases?.length || 0,
        source: data.source,
        sample: data.cases?.slice(0, 3).map(c => ({
          name: c.case_name,
          docket: c.docket_number,
          topic: c.topic
        }))
      });
      
      // Transform API data to match our expected format
      const cases = (data.cases || []).map(caseData => ({
        id: caseData.id,
        case_name: caseData.case_name,
        docket_number: caseData.docket_number,
        term: caseData.term,
        argument_date: caseData.argument_date,
        decision_date: caseData.decision_date,
        decision: caseData.decision,
        majority_opinion: caseData.majority_opinion,
        dissenting_opinion: caseData.dissenting_opinion,
        topic: caseData.topic,
        significance: caseData.significance,
        description: caseData.description,
        source: caseData.source,
        impact_level: caseData.significance,
        market_impact: this.calculateMarketImpact(caseData)
      }));
      
      // Sort cases
      let sortedCases = [...cases];
      if (sortBy === '-decision_date') {
        sortedCases.sort((a, b) => new Date(b.decision_date || b.argument_date) - new Date(a.decision_date || a.argument_date));
      } else if (sortBy === 'decision_date') {
        sortedCases.sort((a, b) => new Date(a.decision_date || a.argument_date) - new Date(b.decision_date || b.argument_date));
      } else if (sortBy === 'case_name') {
        sortedCases.sort((a, b) => a.case_name.localeCompare(b.case_name));
      } else if (sortBy === 'significance') {
        sortedCases.sort((a, b) => this.getSignificanceWeight(b.significance) - this.getSignificanceWeight(a.significance));
      }
      
      return sortedCases.slice(0, limit);
      
    } catch (error) {
      console.warn('⚠️ SCOTUSCase.list() - Using fallback data:', error.message);
      return this.getFallbackData();
    }
  }

  static calculateMarketImpact(caseData) {
    // Calculate potential market impact based on case characteristics
    let impact = 5; // Base impact
    
    if (caseData.significance === 'critical') impact += 15;
    else if (caseData.significance === 'high') impact += 10;
    else if (caseData.significance === 'medium') impact += 5;
    
    // Add impact based on topic
    const topic = caseData.topic?.toLowerCase() || '';
    if (topic.includes('tax') || topic.includes('revenue')) impact += 8;
    if (topic.includes('administrative') || topic.includes('agency')) impact += 12;
    if (topic.includes('environmental')) impact += 6;
    if (topic.includes('healthcare')) impact += 10;
    if (topic.includes('labor')) impact += 7;
    
    return Math.min(impact, 25); // Cap at 25
  }

  static getSignificanceWeight(significance) {
    switch (significance) {
      case 'critical': return 4;
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 2;
    }
  }

  static getFallbackData() {
    return [
      {
        id: 'scotus-fallback-001',
        case_name: 'Moore v. United States',
        docket_number: '22-800',
        term: '2023',
        argument_date: '2023-12-05',
        decision_date: null,
        decision: 'Pending',
        topic: 'Tax Law',
        significance: 'high',
        description: 'Case involving constitutionality of mandatory repatriation tax',
        source: 'Supreme Court - Fallback',
        impact_level: 'high',
        market_impact: 18
      },
      {
        id: 'scotus-fallback-002',
        case_name: 'Loper Bright Enterprises v. Raimondo',
        docket_number: '22-451',
        term: '2023',
        argument_date: '2024-01-17',
        decision_date: null,
        decision: 'Pending',
        topic: 'Administrative Law',
        significance: 'critical',
        description: 'Case challenging Chevron deference doctrine',
        source: 'Supreme Court - Fallback',
        impact_level: 'critical',
        market_impact: 22
      },
      {
        id: 'scotus-fallback-003',
        case_name: 'Relentless, Inc. v. Department of Commerce',
        docket_number: '22-1219',
        term: '2023',
        argument_date: '2024-01-17',
        decision_date: null,
        decision: 'Pending',
        topic: 'Administrative Law',
        significance: 'critical',
        description: 'Related case challenging Chevron deference',
        source: 'Supreme Court - Fallback',
        impact_level: 'critical',
        market_impact: 20
      }
    ];
  }
} 