/**
 * API route for geocoding addresses and auto-following representatives
 */

import { autoFollowRepresentatives, validateAddress, quickRepresentativeLookup } from '../../utils/geocode.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { address, state, district, quickLookup = false } = req.body;

    console.log('[API] Geocoding request:', { address, state, district, quickLookup });

    // Fetch all current congressional members (cache this in production)
    const congressResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/congress/member?congress=119&chamber=both`);
    if (!congressResponse.ok) {
      throw new Error('Failed to fetch congressional members');
    }

    const congressData = await congressResponse.json();
    const allMembers = congressData.members || [];

    if (allMembers.length === 0) {
      throw new Error('No congressional members available');
    }

    let result;

    if (quickLookup && state) {
      // Quick lookup using state and district (no geocoding)
      console.log('[API] Using quick lookup for state/district');
      result = quickRepresentativeLookup(state, district, allMembers);
    } else if (address) {
      // Full geocoding with address
      console.log('[API] Using full geocoding for address');
      
      // Validate address format
      if (!validateAddress(address)) {
        return res.status(400).json({ 
          error: 'Invalid address format. Please provide a complete address with street, city, state, and ZIP code.' 
        });
      }

      // Use geocoding utility to find and follow representatives
      result = await autoFollowRepresentatives(address, allMembers);
    } else {
      return res.status(400).json({ error: 'Either address or state is required' });
    }

    console.log('[API] Geocoding successful:', result);

    return res.status(200).json({
      success: true,
      followedCount: result.followedPoliticians.length,
      representatives: result.representatives,
      location: result.location,
      method: quickLookup ? 'quick_lookup' : 'full_geocoding'
    });

  } catch (error) {
    console.error('[API] Geocoding error:', error);
    
    return res.status(500).json({
      error: error.message || 'Failed to geocode address and find representatives'
    });
  }
} 