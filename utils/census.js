// utils/census.js

const CENSUS_API_KEY = process.env.NEXT_PUBLIC_CENSUS_API_KEY || 'YOUR_CENSUS_API_KEY_HERE';

// Helper to fetch and parse Census API responses
async function fetchCensus(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Census API error: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Census API fetch error:', err);
    return null;
  }
}

// Get total population for a state (by FIPS code)
export async function getStatePopulation(stateFIPS) {
  const url = `https://api.census.gov/data/2022/acs/acs5?get=NAME,B01001_001E&for=state:${stateFIPS}&key=${CENSUS_API_KEY}`;
  const data = await fetchCensus(url);
  if (data && data[1]) {
    return { name: data[1][0], population: data[1][1] };
  }
  return null;
}

// Get total population for a county (by state and county FIPS)
export async function getCountyPopulation(stateFIPS, countyFIPS) {
  const url = `https://api.census.gov/data/2022/acs/acs5?get=NAME,B01001_001E&for=county:${countyFIPS}&in=state:${stateFIPS}&key=${CENSUS_API_KEY}`;
  const data = await fetchCensus(url);
  if (data && data[1]) {
    return { name: data[1][0], population: data[1][1] };
  }
  return null;
}

// Get total population for a ZIP code
export async function getZipPopulation(zip) {
  const url = `https://api.census.gov/data/2022/acs/acs5?get=NAME,B01001_001E&for=zip%20code%20tabulation%20area:${zip}&key=${CENSUS_API_KEY}`;
  const data = await fetchCensus(url);
  if (data && data[1]) {
    return { name: data[1][0], population: data[1][1] };
  }
  return null;
}

// Get median household income for a ZIP code
export async function getZipMedianIncome(zip) {
  // B19013_001E = Median household income in the past 12 months (in 2022 inflation-adjusted dollars)
  const url = `https://api.census.gov/data/2022/acs/acs5?get=NAME,B19013_001E&for=zip%20code%20tabulation%20area:${zip}&key=${CENSUS_API_KEY}`;
  const data = await fetchCensus(url);
  if (data && data[1]) {
    return { name: data[1][0], medianIncome: data[1][1] };
  }
  return null;
}

// Add more functions as needed for age, education, etc. 