/**
 * Geocoding utilities for converting addresses to congressional districts
 * and finding representatives
 */

// Cache for geocoding results to avoid repeated API calls
const geocodeCache = new Map();

/**
 * Convert an address to congressional district using U.S. Census Geocoding API
 * @param {string} address - Full address (street, city, state, zip)
 * @returns {Promise<Object>} - Object with state, district, and coordinates
 */
export async function geocodeAddress(address) {
  try {
    console.log('[GEOCODE] Geocoding address:', address);
    
    // Check cache first
    const cacheKey = address.toLowerCase().trim();
    if (geocodeCache.has(cacheKey)) {
      console.log('[GEOCODE] Using cached result');
      return geocodeCache.get(cacheKey);
    }
    
    // Clean and encode the address
    const cleanAddress = address.trim().replace(/\s+/g, ' ');
    const encodedAddress = encodeURIComponent(cleanAddress);
    
    // U.S. Census Geocoding API endpoint
    const url = `https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=${encodedAddress}&benchmark=2020&vintage=2020&format=json`;
    
    console.log('[GEOCODE] Making request to:', url);
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('[GEOCODE] Raw response:', JSON.stringify(data, null, 2));
    
    if (!data.result || !data.result.addressMatches || data.result.addressMatches.length === 0) {
      throw new Error('No address matches found');
    }
    
    const match = data.result.addressMatches[0];
    const geographies = match.geographies;
    
    // Extract state and congressional district
    const state = geographies['States (TIGER/Line)']?.[0]?.NAME;
    const congressionalDistrict = geographies['Congressional Districts (116th Congress)']?.[0];
    
    if (!state) {
      throw new Error('Could not determine state from address');
    }
    
    const result = {
      state: state,
      district: null,
      coordinates: {
        lat: match.coordinates.y,
        lng: match.coordinates.x
      },
      fullAddress: match.matchedAddress
    };
    
    // Extract congressional district number
    if (congressionalDistrict) {
      const districtName = congressionalDistrict.NAME;
      const districtMatch = districtName.match(/District (\d+)/);
      if (districtMatch) {
        result.district = parseInt(districtMatch[1]);
      }
    }
    
    // Cache the result
    geocodeCache.set(cacheKey, result);
    
    console.log('[GEOCODE] Successfully geocoded:', result);
    return result;
    
  } catch (error) {
    console.error('[GEOCODE] Error geocoding address:', error);
    throw error;
  }
}

/**
 * Find representatives for a given state and district
 * @param {string} state - State name
 * @param {number} district - Congressional district number (null for senators)
 * @param {Array} allMembers - Array of all congressional members
 * @returns {Array} - Array of matching representatives
 */
export function findRepresentatives(state, district, allMembers) {
  console.log('[GEOCODE] Finding representatives for:', { state, district });
  
  const matches = allMembers.filter(member => {
    // Check if member is from the specified state
    if (member.state !== state) {
      return false;
    }
    
    // For senators (district is null), return both senators
    if (district === null) {
      return member.chamber === 'senate';
    }
    
    // For representatives, check district and chamber
    if (member.chamber === 'house' && member.district === district) {
      return true;
    }
    
    return false;
  });
  
  console.log('[GEOCODE] Found representatives:', matches.map(m => `${m.name} (${m.chamber})`));
  return matches;
}

/**
 * Auto-follow representatives based on address (non-blocking version)
 * @param {string} address - User's address
 * @param {Array} allMembers - Array of all congressional members
 * @returns {Promise<Object>} - Object with followed politicians and location info
 */
export async function autoFollowRepresentatives(address, allMembers) {
  try {
    console.log('[GEOCODE] Starting auto-follow for address:', address);
    
    // Geocode the address
    const location = await geocodeAddress(address);
    
    // Find representatives for the state
    const stateRepresentatives = findRepresentatives(location.state, null, allMembers); // Senators
    const districtRepresentatives = location.district ? 
      findRepresentatives(location.state, location.district, allMembers) : []; // House member
    
    const allRepresentatives = [...stateRepresentatives, ...districtRepresentatives];
    
    if (allRepresentatives.length === 0) {
      throw new Error(`No representatives found for ${location.state}${location.district ? ` District ${location.district}` : ''}`);
    }
    
    const result = {
      followedPoliticians: allRepresentatives.map(rep => rep.bioguideId),
      location: {
        state: location.state,
        district: location.district,
        coordinates: location.coordinates,
        fullAddress: location.fullAddress
      },
      representatives: allRepresentatives.map(rep => ({
        bioguideId: rep.bioguideId,
        name: rep.name,
        chamber: rep.chamber,
        party: rep.party,
        district: rep.district
      }))
    };
    
    console.log('[GEOCODE] Auto-follow result:', result);
    return result;
    
  } catch (error) {
    console.error('[GEOCODE] Error in auto-follow:', error);
    throw error;
  }
}

/**
 * Quick representative lookup using state and district (no geocoding)
 * @param {string} state - State name
 * @param {number} district - Congressional district number
 * @param {Array} allMembers - Array of all congressional members
 * @returns {Object} - Object with representatives and location info
 */
export function quickRepresentativeLookup(state, district, allMembers) {
  console.log('[GEOCODE] Quick lookup for:', { state, district });
  
  // Find representatives for the state
  const stateRepresentatives = findRepresentatives(state, null, allMembers); // Senators
  const districtRepresentatives = district ? 
    findRepresentatives(state, district, allMembers) : []; // House member
  
  const allRepresentatives = [...stateRepresentatives, ...districtRepresentatives];
  
  const result = {
    followedPoliticians: allRepresentatives.map(rep => rep.bioguideId),
    location: {
      state: state,
      district: district,
      coordinates: null,
      fullAddress: null
    },
    representatives: allRepresentatives.map(rep => ({
      bioguideId: rep.bioguideId,
      name: rep.name,
      chamber: rep.chamber,
      party: rep.party,
      district: rep.district
    }))
  };
  
  console.log('[GEOCODE] Quick lookup result:', result);
  return result;
}

/**
 * Validate an address format
 * @param {string} address - Address to validate
 * @returns {boolean} - Whether address is valid
 */
export function validateAddress(address) {
  if (!address || typeof address !== 'string') {
    return false;
  }
  
  const cleanAddress = address.trim();
  if (cleanAddress.length < 10) {
    return false;
  }
  
  // Basic validation - should contain street, city, state, and zip
  const hasStreet = /\d+\s+[A-Za-z\s]+/.test(cleanAddress);
  const hasState = /[A-Z]{2}|[A-Za-z\s]+/.test(cleanAddress);
  const hasZip = /\d{5}(-\d{4})?/.test(cleanAddress);
  
  return hasStreet && hasState && hasZip;
} 