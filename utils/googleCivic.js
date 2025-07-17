// Google Civic Information API utility
// Docs: https://developers.google.com/civic-information/docs/v2/representatives

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_CIVIC_API_KEY;
const BASE_URL = 'https://www.googleapis.com/civicinfo/v2/representatives';

/**
 * Fetch representatives for a given address or ZIP code.
 * @param {string} address - Full address or ZIP code
 * @returns {Promise<Object>} - API response with officials and offices
 */
export async function getRepresentatives(address) {
  if (!API_KEY) throw new Error('Google Civic API key not set');
  const url = `${BASE_URL}?key=${API_KEY}&address=${encodeURIComponent(address)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch from Google Civic API');
  return res.json();
} 