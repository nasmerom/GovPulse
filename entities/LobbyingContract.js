// Helper function to get the base URL for API calls
function getApiBaseUrl() {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Browser environment - use relative URLs
    return '';
  } else {
    // Server-side environment - use absolute URL
    return 'http://localhost:3000';
  }
}

import { fetchWithError } from '../utils/fetchWithError.js';

export class LobbyingContract {
  static async list(sortBy = '-contract_date', limit = 100, search = '') {
    try {
      console.log('LobbyingContract.list called with:', { sortBy, limit, search });
      
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: '0'
      });
      
      if (search) {
        params.append('search', search);
      }

      const baseUrl = getApiBaseUrl();
      const response = await fetchWithError(`${baseUrl}/api/lobbying-disclosures?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch lobbying disclosures');
      }
      
      console.log(`LobbyingContract.list: Successfully fetched ${data.disclosures.length} disclosures`);
      
      return data.disclosures;
    } catch (error) {
      console.error('Error in LobbyingContract.list:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      console.log('LobbyingContract.getById called with:', id);
      
      const baseUrl = getApiBaseUrl();
      const response = await fetchWithError(`${baseUrl}/api/lobbying-disclosures/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch lobbying disclosure');
      }
      
      console.log('LobbyingContract.getById: Successfully fetched disclosure:', data.disclosure);
      
      return data.disclosure;
    } catch (error) {
      console.error('Error in LobbyingContract.getById:', error);
      throw error;
    }
  }

  static async search(query, limit = 50) {
    try {
      console.log('LobbyingContract.search called with:', { query, limit });
      
      const params = new URLSearchParams({
        search: query,
        limit: limit.toString(),
        offset: '0'
      });

      const baseUrl = getApiBaseUrl();
      const response = await fetchWithError(`${baseUrl}/api/lobbying-disclosures?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to search lobbying disclosures');
      }
      
      console.log(`LobbyingContract.search: Found ${data.disclosures.length} results for query: ${query}`);
      
      return data.disclosures;
    } catch (error) {
      console.error('Error in LobbyingContract.search:', error);
      throw error;
    }
  }

  static async getByClient(clientName, limit = 50) {
    try {
      console.log('LobbyingContract.getByClient called with:', { clientName, limit });
      
      return await this.search(clientName, limit);
    } catch (error) {
      console.error('Error in LobbyingContract.getByClient:', error);
      throw error;
    }
  }

  static async getByFirm(firmName, limit = 50) {
    try {
      console.log('LobbyingContract.getByFirm called with:', { firmName, limit });
      
      return await this.search(firmName, limit);
    } catch (error) {
      console.error('Error in LobbyingContract.getByFirm:', error);
      throw error;
    }
  }

  static async getRecent(limit = 20) {
    try {
      console.log('LobbyingContract.getRecent called with:', limit);
      
      return await this.list('-contract_date', limit);
    } catch (error) {
      console.error('Error in LobbyingContract.getRecent:', error);
      throw error;
    }
  }

  static async getByIssue(issue, limit = 50) {
    try {
      console.log('LobbyingContract.getByIssue called with:', { issue, limit });
      
      return await this.search(issue, limit);
    } catch (error) {
      console.error('Error in LobbyingContract.getByIssue:', error);
      throw error;
    }
  }
} 