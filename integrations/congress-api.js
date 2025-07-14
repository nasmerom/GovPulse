// Congress.gov API Client
class CongressAPI {
  constructor() {
    // Check if we're in a browser environment
    const isBrowser = typeof window !== 'undefined';
    
    if (isBrowser) {
      // In browser, we can't access server-side env vars directly
      // We'll need to make API calls through our Next.js API routes
      this.apiKey = null;
      this.baseUrl = '/api/congress'; // Use our API route instead
      this.isBrowser = true;
    } else {
      // Server-side, we can access env vars directly
      this.apiKey = process.env.CONGRESS_API_KEY;
      this.baseUrl = process.env.CONGRESS_API_BASE_URL || 'https://api.congress.gov/v3';
      this.isBrowser = false;
    }
    
    if (!this.apiKey && !this.isBrowser) {
      console.warn('Congress.gov API key not found. Using mock data.');
    }
  }

  async request(endpoint, params = {}) {
    if (this.isBrowser) {
      // In browser, route through our Next.js API
      const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);
      
      // Add parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value);
        }
      });

      try {
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(url.toString(), {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Congress.gov API error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Congress.gov API request failed:', error);
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        throw error;
      }
    } else {
      // Server-side direct API call
      if (!this.apiKey) {
        throw new Error('Congress.gov API key not configured');
      }

      const url = new URL(`${this.baseUrl}${endpoint}`);
      url.searchParams.append('api_key', this.apiKey);
      
      // Add other parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value);
        }
      });

      try {
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(url.toString(), {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Congress.gov API error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Congress.gov API request failed:', error);
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        throw error;
      }
    }
  }

  // Bills API
  async getBills(params = {}) {
    return this.request('/bill', params);
  }

  async getBill(billId) {
    return this.request(`/bill/${billId}`);
  }

  // Committees API
  async getCommittees(params = {}) {
    return this.request('/committee', params);
  }

  async getCommittee(committeeId, congress = 119) {
    return this.request(`/committee-detail`, { committeeId, congress });
  }

  async getCommitteeMembers(committeeId, congress = 119) {
    return this.request(`/committee-members`, { committeeId, congress });
  }

  async getCommitteeLeadership(committeeId, congress = 119) {
    return this.request(`/committee-leadership`, { committeeId, congress });
  }

  // Members API
  async getMembers(params = {}) {
    return this.request('/member', params);
  }

  async getMember(memberId) {
    return this.request(`/member/${memberId}`);
  }

  // Congressional Record API
  async getCongressionalRecord(params = {}) {
    return this.request('/congressional-record', params);
  }

  // Votes API
  async getVotes(params = {}) {
    return this.request('/vote', params);
  }

  async getVote(voteId) {
    return this.request(`/vote/${voteId}`);
  }
}

// Export singleton instance
export const congressAPI = new CongressAPI(); 