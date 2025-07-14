// Storage keys for localStorage
const USER_STORAGE_KEY = 'govpulse_user';
const SESSION_STORAGE_KEY = 'govpulse_session';

// Default mock user data
const defaultUserData = {
  id: 1,
  email: 'user@example.com',
  name: 'John Doe',
  account_type: null,
  address: null,
  state: null,
  district: null,
  verification_status: null,
  followed_politicians: [], // Array of politician bioguideIds
  policy_preferences: [], // Array of policy interests
  topic_preferences: [], // Array of topic IDs for personalization
  onboarding_completed: false, // Track if user has completed onboarding
  // Business-specific fields
  company_name: null,
  industry: null,
  subcategory: null,
  company_size: null,
  business_model: null,
  website: null,
  contact_email: null,
  contact_phone: null,
  contact_title: null,
  founded_year: null,
  revenue: null,
  regulatory_exposure: null,
  compliance_history: null,
  data_handling: [],
  geographic_operations: [],
  primary_products: null,
  target_markets: null,
  key_competitors: null,
  major_challenges: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Helper functions for localStorage
const saveUserToStorage = (userData) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
        isAuthenticated: true,
        lastActivity: new Date().toISOString()
      }));
    }
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
  }
};

const loadUserFromStorage = () => {
  try {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(USER_STORAGE_KEY);
      const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
      
      if (userData && sessionData) {
        const session = JSON.parse(sessionData);
        const lastActivity = new Date(session.lastActivity);
        const now = new Date();
        
        // Check if session is still valid (24 hours)
        if (now.getTime() - lastActivity.getTime() < 24 * 60 * 60 * 1000) {
          return JSON.parse(userData);
        } else {
          // Session expired, clear storage
          clearUserFromStorage();
          return null;
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
    return null;
  }
};

const clearUserFromStorage = () => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error clearing user from localStorage:', error);
  }
};

const updateSessionActivity = () => {
  try {
    if (typeof window !== 'undefined') {
      const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        session.lastActivity = new Date().toISOString();
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      }
    }
  } catch (error) {
    console.error('Error updating session activity:', error);
  }
};

import { autoFollowRepresentatives, validateAddress } from '../utils/geocode.js';

export class User {
  constructor(data = {}) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.account_type = data.account_type; // 'Citizen', 'Organizations', 'Representative'
    this.address = data.address;
    this.state = data.state;
    this.district = data.district;
    this.verification_status = data.verification_status;
    this.followed_politicians = data.followed_politicians || [];
    this.policy_preferences = data.policy_preferences || [];
    this.topic_preferences = data.topic_preferences || [];
    this.onboarding_completed = data.onboarding_completed || false;
    // Business-specific fields
    this.company_name = data.company_name;
    this.industry = data.industry;
    this.subcategory = data.subcategory;
    this.company_size = data.company_size;
    this.business_model = data.business_model;
    this.website = data.website;
    this.contact_email = data.contact_email;
    this.contact_phone = data.contact_phone;
    this.contact_title = data.contact_title;
    this.founded_year = data.founded_year;
    this.revenue = data.revenue;
    this.regulatory_exposure = data.regulatory_exposure;
    this.compliance_history = data.compliance_history;
    this.data_handling = data.data_handling || [];
    this.geographic_operations = data.geographic_operations || [];
    this.primary_products = data.primary_products;
    this.target_markets = data.target_markets;
    this.key_competitors = data.key_competitors;
    this.major_challenges = data.major_challenges;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async me() {
    try {
      // Try to load user from localStorage first
      const storedUser = loadUserFromStorage();
      if (storedUser) {
        updateSessionActivity();
        // If admin, override account_type with view_as for UI
        if (storedUser.account_type === 'Admin') {
          const viewAs = localStorage.getItem('govpulse_admin_view_as');
          if (viewAs && viewAs !== 'Admin') {
            return new User({ ...storedUser, account_type: viewAs, _true_account_type: 'Admin' });
          }
        }
        return new User(storedUser);
      }
      // If no stored user, return default (unauthenticated state)
      return new User(defaultUserData);
    } catch (error) {
      console.error('Error in User.me():', error);
      // Return default user even if there's an error
      return new User(defaultUserData);
    }
  }

  static loadFromStorage() {
    return loadUserFromStorage();
  }

  static async update(updates) {
    // Load current user data
    const currentUser = loadUserFromStorage() || defaultUserData;
    
    // Update the user data
    const updatedUser = {
      ...currentUser,
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    // Save to localStorage
    saveUserToStorage(updatedUser);
    
    console.log('Updating user with:', updates);
    return { success: true };
  }

  static async create(data) {
    // Create new user and save to localStorage
    const newUser = {
      id: Math.floor(Math.random() * 1000),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    saveUserToStorage(newUser);
    return new User(newUser);
  }

  static async authenticate(email, password) {
    // Mock implementation - replace with actual API call
    if (email && password) {
      // Check if there's an existing user
      const existingUser = loadUserFromStorage();
      
      // If user exists, return the existing user data
      if (existingUser && existingUser.email === email) {
        const authenticatedUser = {
          ...existingUser,
          updated_at: new Date().toISOString()
        };
        
        // Save authenticated user to localStorage
        saveUserToStorage(authenticatedUser);
        
        return new User(authenticatedUser);
      }
      
      // For demo purposes, create a new user if none exists
      const authenticatedUser = {
        id: Math.floor(Math.random() * 1000),
        email,
        name: existingUser?.name || 'New User',
        account_type: existingUser?.account_type || null,
        address: existingUser?.address || null,
        state: existingUser?.state || null,
        district: existingUser?.district || null,
        verification_status: existingUser?.verification_status || null,
        followed_politicians: existingUser?.followed_politicians || [],
        policy_preferences: existingUser?.policy_preferences || [],
        topic_preferences: existingUser?.topic_preferences || [],
        onboarding_completed: existingUser?.onboarding_completed || false,
        // Business-specific fields
        company_name: existingUser?.company_name || null,
        industry: existingUser?.industry || null,
        subcategory: existingUser?.subcategory || null,
        company_size: existingUser?.company_size || null,
        business_model: existingUser?.business_model || null,
        website: existingUser?.website || null,
        contact_email: existingUser?.contact_email || null,
        contact_phone: existingUser?.contact_phone || null,
        contact_title: existingUser?.contact_title || null,
        founded_year: existingUser?.founded_year || null,
        revenue: existingUser?.revenue || null,
        regulatory_exposure: existingUser?.regulatory_exposure || null,
        compliance_history: existingUser?.compliance_history || null,
        data_handling: existingUser?.data_handling || [],
        geographic_operations: existingUser?.geographic_operations || [],
        primary_products: existingUser?.primary_products || null,
        target_markets: existingUser?.target_markets || null,
        key_competitors: existingUser?.key_competitors || null,
        major_challenges: existingUser?.major_challenges || null,
        created_at: existingUser?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Save authenticated user to localStorage
      saveUserToStorage(authenticatedUser);
      
      return new User(authenticatedUser);
    }
    throw new Error('Invalid credentials');
  }

  static async logout() {
    // Clear user data from localStorage
    clearUserFromStorage();
    console.log('Logging out user');
    return { success: true };
  }

  static async followPolitician(bioguideId) {
    const currentUser = loadUserFromStorage() || defaultUserData;
    console.log('[User] Current user followed_politicians:', currentUser.followed_politicians);
    console.log('[User] Checking if already following:', bioguideId);
    
    if (!currentUser.followed_politicians.includes(bioguideId)) {
      const updatedUser = {
        ...currentUser,
        followed_politicians: [...currentUser.followed_politicians, bioguideId],
        updated_at: new Date().toISOString()
      };
      
      saveUserToStorage(updatedUser);
      console.log(`[User] Following politician: ${bioguideId}`);
      console.log('[User] Updated followed_politicians:', updatedUser.followed_politicians);
      return { success: true, followed: true };
    }
    
    console.log(`[User] Already following politician: ${bioguideId}`);
    return { success: true, followed: false, message: 'Already following' };
  }

  static async unfollowPolitician(bioguideId) {
    const currentUser = loadUserFromStorage() || defaultUserData;
    
    const updatedUser = {
      ...currentUser,
      followed_politicians: currentUser.followed_politicians.filter(id => id !== bioguideId),
      updated_at: new Date().toISOString()
    };
    
    saveUserToStorage(updatedUser);
    console.log(`Unfollowing politician: ${bioguideId}`);
    return { success: true, unfollowed: true };
  }

  static async isFollowingPolitician(bioguideId) {
    const currentUser = loadUserFromStorage() || defaultUserData;
    return currentUser.followed_politicians.includes(bioguideId);
  }

  static async getFollowedPoliticians() {
    const currentUser = loadUserFromStorage() || defaultUserData;
    console.log('[User] Getting followed politicians:', currentUser.followed_politicians);
    return currentUser.followed_politicians;
  }

  static async updatePolicyPreferences(preferences) {
    const currentUser = loadUserFromStorage() || defaultUserData;
    
    const updatedUser = {
      ...currentUser,
      policy_preferences: preferences,
      updated_at: new Date().toISOString()
    };
    
    saveUserToStorage(updatedUser);
    console.log('[User] Updated policy preferences:', preferences);
    return { success: true, preferences };
  }

  static async getPolicyPreferences() {
    const currentUser = loadUserFromStorage() || defaultUserData;
    console.log('[User] Getting policy preferences:', currentUser.policy_preferences);
    return currentUser.policy_preferences;
  }

  static async hasPolicyPreference(policy) {
    const currentUser = loadUserFromStorage() || defaultUserData;
    return currentUser.policy_preferences.includes(policy);
  }

  static async updateTopicPreferences(topics) {
    const currentUser = loadUserFromStorage() || defaultUserData;
    
    const updatedUser = {
      ...currentUser,
      topic_preferences: topics,
      onboarding_completed: true,
      updated_at: new Date().toISOString()
    };
    
    saveUserToStorage(updatedUser);
    console.log('[User] Updated topic preferences:', topics);
    return { success: true, topics };
  }

  static async getTopicPreferences() {
    const currentUser = loadUserFromStorage() || defaultUserData;
    console.log('[User] Getting topic preferences:', currentUser.topic_preferences);
    return currentUser.topic_preferences;
  }

  static async hasTopicPreference(topic) {
    const currentUser = loadUserFromStorage() || defaultUserData;
    return currentUser.topic_preferences.includes(topic);
  }

  static async isOnboardingCompleted() {
    const currentUser = loadUserFromStorage();
    // If no user in storage, they haven't completed onboarding
    if (!currentUser) {
      return false;
    }
    return currentUser.onboarding_completed || false;
  }

  static async autoFollowRepresentatives() {
    const currentUser = loadUserFromStorage() || defaultUserData;
    
    if (!currentUser.state || !currentUser.district) {
      console.log('No state/district set, skipping auto-follow');
      return { success: false, message: 'No state/district set' };
    }

    try {
      // Get politicians for the user's state and district
      const response = await fetch(`/api/congress/member?congress=119&chamber=both`);
      if (!response.ok) {
        throw new Error('Failed to fetch politicians');
      }
      
      const data = await response.json();
      const politicians = data.members || [];
      
      // Find the user's representatives
      const userRepresentatives = politicians.filter(politician => {
        if (!politician.terms?.item) return false;
        
        // Sort terms by startYear descending
        const terms = [...politician.terms.item].sort((a, b) => (b.startYear || 0) - (a.startYear || 0));
        const mostRecentTerm = terms[0];
        
        // Check if they're currently serving
        const currentYear = new Date().getFullYear();
        if (mostRecentTerm.endYear && mostRecentTerm.endYear < currentYear) return false;
        
        const isHouse = mostRecentTerm.chamber === 'House of Representatives';
        const isSenate = mostRecentTerm.chamber === 'Senate';
        
        // Match House representative by state and district
        if (isHouse && politician.state === currentUser.state && 
            politician.district?.toString() === currentUser.district?.toString()) {
          return true;
        }
        
        // Match Senators by state (both senators represent the entire state)
        if (isSenate && politician.state === currentUser.state) {
          return true;
        }
        
        return false;
      });

      // Add their bioguideIds to followed politicians
      const newFollowedIds = userRepresentatives
        .map(p => p.bioguideId)
        .filter(id => !currentUser.followed_politicians.includes(id));

      if (newFollowedIds.length > 0) {
        const updatedUser = {
          ...currentUser,
          followed_politicians: [...currentUser.followed_politicians, ...newFollowedIds],
          updated_at: new Date().toISOString()
        };
        
        saveUserToStorage(updatedUser);
        console.log(`Auto-followed ${newFollowedIds.length} representatives:`, newFollowedIds);
        return { success: true, followed: newFollowedIds };
      }
      
      return { success: true, followed: [], message: 'Already following all representatives' };
      
    } catch (error) {
      console.error('Error auto-following representatives:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Auto-follow representatives based on user's address
   * @param {string} address - User's full address
   * @returns {Promise<Object>} - Result with followed politicians and location info
   */
  async autoFollowRepresentativesFromAddress(address) {
    try {
      console.log('[User] Auto-following representatives for address:', address);
      
      // Validate address format
      if (!validateAddress(address)) {
        throw new Error('Invalid address format. Please provide a complete address with street, city, state, and ZIP code.');
      }
      
      // Fetch all current congressional members
      const response = await fetch('/api/congress/member?congress=119&chamber=both');
      if (!response.ok) {
        throw new Error('Failed to fetch congressional members');
      }
      
      const data = await response.json();
      const allMembers = data.members || [];
      
      if (allMembers.length === 0) {
        throw new Error('No congressional members available');
      }
      
      // Use geocoding utility to find and follow representatives
      const result = await autoFollowRepresentatives(address, allMembers);
      
      // Update user's location and followed politicians
      this.state = result.location.state;
      this.district = result.location.district;
      this.followed_politicians = [...new Set([...this.followed_politicians, ...result.followedPoliticians])];
      
      // Save updated user data
      await this.save();
      
      console.log('[User] Successfully auto-followed representatives:', result.representatives.length);
      
      return {
        success: true,
        followedCount: result.followedPoliticians.length,
        representatives: result.representatives,
        location: result.location
      };
      
    } catch (error) {
      console.error('[User] Error auto-following representatives:', error);
      throw error;
    }
  }

  static async setAccountType(type) {
    // Load current user data
    const currentUser = loadUserFromStorage() || defaultUserData;
    // Only allow if admin
    if (currentUser.account_type === 'Admin') {
      const updatedUser = {
        ...currentUser,
        account_type: type,
        updated_at: new Date().toISOString()
      };
      saveUserToStorage(updatedUser);
      return { success: true };
    }
    return { success: false, error: 'Not an admin user' };
  }

  static isAdmin() {
    const currentUser = loadUserFromStorage() || defaultUserData;
    return currentUser.account_type === 'Admin';
  }

  static isAuthenticated() {
    if (typeof window === 'undefined') {
      return false;
    }
    const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        const lastActivity = new Date(session.lastActivity);
        const now = new Date();
        
        // Check if session is still valid (24 hours)
        return now.getTime() - lastActivity.getTime() < 24 * 60 * 60 * 1000;
      } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
      }
    }
    return false;
  }
}

// Helper function to get chamber from terms
function getChamberFromTerms(terms) {
  if (!terms?.item || terms.item.length === 0) {
    return null;
  }
  
  const currentYear = new Date().getFullYear();
  let mostRecentTerm = terms.item[0];
  
  for (const term of terms.item) {
    if (!term.endYear) {
      mostRecentTerm = term;
      break;
    }
    if (term.endYear >= currentYear) {
      mostRecentTerm = term;
      break;
    }
    if (term.startYear > mostRecentTerm.startYear) {
      mostRecentTerm = term;
    }
  }
  
  return mostRecentTerm.chamber;
} 