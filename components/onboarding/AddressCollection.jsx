import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { User } from '../../entities/User';
import { MapPin, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { getZipPopulation, getZipMedianIncome } from '../../utils/census';

// Mapping of state codes to number of congressional districts
const stateDistricts = {
  'AL': 7, 'AK': 1, 'AZ': 9, 'AR': 4, 'CA': 52, 'CO': 8, 'CT': 5, 'DE': 1, 'FL': 28, 'GA': 14,
  'HI': 2, 'ID': 2, 'IL': 17, 'IN': 9, 'IA': 4, 'KS': 4, 'KY': 6, 'LA': 6, 'ME': 2, 'MD': 8,
  'MA': 9, 'MI': 13, 'MN': 8, 'MS': 4, 'MO': 8, 'MT': 2, 'NE': 3, 'NV': 4, 'NH': 2, 'NJ': 12,
  'NM': 3, 'NY': 26, 'NC': 14, 'ND': 1, 'OH': 15, 'OK': 5, 'OR': 6, 'PA': 17, 'RI': 2, 'SC': 7,
  'SD': 1, 'TN': 9, 'TX': 38, 'UT': 4, 'VT': 1, 'VA': 11, 'WA': 10, 'WV': 2, 'WI': 8, 'WY': 1,
  'D.C.': 1
};

// Common ZIP code to district mappings (partial - can be expanded)
const zipToDistrict = {
  // California examples
  '90210': { state: 'CA', district: 30 },
  '94102': { state: 'CA', district: 12 },
  '90001': { state: 'CA', district: 37 },
  // New York examples
  '10001': { state: 'NY', district: 12 },
  '10002': { state: 'NY', district: 7 },
  '10003': { state: 'NY', district: 7 },
  // Texas examples
  '77001': { state: 'TX', district: 18 },
  '77002': { state: 'TX', district: 18 },
  '75001': { state: 'TX', district: 3 },
  // Florida examples
  '33101': { state: 'FL', district: 27 },
  '33102': { state: 'FL', district: 27 },
  '32801': { state: 'FL', district: 10 },
  // Illinois examples
  '60601': { state: 'IL', district: 7 },
  '60602': { state: 'IL', district: 7 },
  '60603': { state: 'IL', district: 7 },
  // Pennsylvania examples
  '19101': { state: 'PA', district: 3 },
  '19102': { state: 'PA', district: 3 },
  '15201': { state: 'PA', district: 18 },
  // Ohio examples
  '43201': { state: 'OH', district: 3 },
  '43202': { state: 'OH', district: 3 },
  '44101': { state: 'OH', district: 11 },
  // Michigan examples
  '48201': { state: 'MI', district: 13 },
  '48202': { state: 'MI', district: 13 },
  '48101': { state: 'MI', district: 12 },
  // Georgia examples
  '30301': { state: 'GA', district: 5 },
  '30302': { state: 'GA', district: 5 },
  '30303': { state: 'GA', district: 5 },
  // North Carolina examples
  '28201': { state: 'NC', district: 12 },
  '28202': { state: 'NC', district: 12 },
  '27601': { state: 'NC', district: 2 },
  // Virginia examples
  '22201': { state: 'VA', district: 8 },
  '22202': { state: 'VA', district: 8 },
  '23219': { state: 'VA', district: 4 },
  // Washington examples
  '98101': { state: 'WA', district: 7 },
  '98102': { state: 'WA', district: 7 },
  '98103': { state: 'WA', district: 7 },
  // Colorado examples
  '80201': { state: 'CO', district: 1 },
  '80202': { state: 'CO', district: 1 },
  '80203': { state: 'CO', district: 1 },
  // Oregon examples
  '97201': { state: 'OR', district: 3 },
  '97202': { state: 'OR', district: 3 },
  '97203': { state: 'OR', district: 3 },
  // Nevada examples
  '89101': { state: 'NV', district: 1 },
  '89102': { state: 'NV', district: 1 },
  '89103': { state: 'NV', district: 1 },
  // Arizona examples
  '85001': { state: 'AZ', district: 7 },
  '85002': { state: 'AZ', district: 7 },
  '85003': { state: 'AZ', district: 7 },
  // Utah examples
  '84101': { state: 'UT', district: 2 },
  '84102': { state: 'UT', district: 2 },
  '84103': { state: 'UT', district: 2 },
  // New Mexico examples
  '87101': { state: 'NM', district: 1 },
  '87102': { state: 'NM', district: 1 },
  '87103': { state: 'NM', district: 1 },
  // Montana examples
  '59101': { state: 'MT', district: 1 },
  '59102': { state: 'MT', district: 1 },
  '59801': { state: 'MT', district: 1 },
  // Wyoming examples
  '82001': { state: 'WY', district: 1 },
  '82002': { state: 'WY', district: 1 },
  '82003': { state: 'WY', district: 1 },
  // South Dakota examples
  '57101': { state: 'SD', district: 1 },
  '57102': { state: 'SD', district: 1 },
  '57103': { state: 'SD', district: 1 },
  // North Dakota examples
  '58101': { state: 'ND', district: 1 },
  '58102': { state: 'ND', district: 1 },
  '58103': { state: 'ND', district: 1 },
  // Alaska examples
  '99501': { state: 'AK', district: 1 },
  '99502': { state: 'AK', district: 1 },
  '99503': { state: 'AK', district: 1 },
  // Vermont examples
  '05401': { state: 'VT', district: 1 },
  '05402': { state: 'VT', district: 1 },
  '05403': { state: 'VT', district: 1 },
  // Delaware examples
  '19801': { state: 'DE', district: 1 },
  '19802': { state: 'DE', district: 1 },
  '19803': { state: 'DE', district: 1 },
  // Rhode Island examples
  '02901': { state: 'RI', district: 1 },
  '02902': { state: 'RI', district: 1 },
  '02903': { state: 'RI', district: 1 },
  // Hawaii examples
  '96801': { state: 'HI', district: 1 },
  '96802': { state: 'HI', district: 1 },
  '96803': { state: 'HI', district: 1 },
  // Maine examples
  '04101': { state: 'ME', district: 1 },
  '04102': { state: 'ME', district: 1 },
  '04103': { state: 'ME', district: 1 },
  // New Hampshire examples
  '03101': { state: 'NH', district: 1 },
  '03102': { state: 'NH', district: 1 },
  '03103': { state: 'NH', district: 1 },
  // West Virginia examples
  '25301': { state: 'WV', district: 2 },
  '25302': { state: 'WV', district: 2 },
  '25303': { state: 'WV', district: 2 },
  // Nebraska examples
  '68101': { state: 'NE', district: 2 },
  '68102': { state: 'NE', district: 2 },
  '68103': { state: 'NE', district: 2 },
  // Kansas examples
  '66101': { state: 'KS', district: 3 },
  '66102': { state: 'KS', district: 3 },
  '66103': { state: 'KS', district: 3 },
  // Iowa examples
  '50301': { state: 'IA', district: 3 },
  '50302': { state: 'IA', district: 3 },
  '50303': { state: 'IA', district: 3 },
  // Arkansas examples
  '72201': { state: 'AR', district: 2 },
  '72202': { state: 'AR', district: 2 },
  '72203': { state: 'AR', district: 2 },
  // Mississippi examples
  '39201': { state: 'MS', district: 2 },
  '39202': { state: 'MS', district: 2 },
  '39203': { state: 'MS', district: 2 },
  // Louisiana examples
  '70101': { state: 'LA', district: 2 },
  '70102': { state: 'LA', district: 2 },
  '70103': { state: 'LA', district: 2 },
  // Alabama examples
  '35201': { state: 'AL', district: 7 },
  '35202': { state: 'AL', district: 7 },
  '35203': { state: 'AL', district: 7 },
  // Tennessee examples
  '37201': { state: 'TN', district: 5 },
  '37202': { state: 'TN', district: 5 },
  '37203': { state: 'TN', district: 5 },
  // Kentucky examples
  '40201': { state: 'KY', district: 3 },
  '40202': { state: 'KY', district: 3 },
  '40203': { state: 'KY', district: 3 },
  // Indiana examples
  '46201': { state: 'IN', district: 7 },
  '46202': { state: 'IN', district: 7 },
  '46203': { state: 'IN', district: 7 },
  // Wisconsin examples
  '53201': { state: 'WI', district: 4 },
  '53202': { state: 'WI', district: 4 },
  '53203': { state: 'WI', district: 4 },
  // Minnesota examples
  '55401': { state: 'MN', district: 5 },
  '55402': { state: 'MN', district: 5 },
  '55403': { state: 'MN', district: 5 },
  // Missouri examples
  '63101': { state: 'MO', district: 1 },
  '63102': { state: 'MO', district: 1 },
  '63103': { state: 'MO', district: 1 },
  // Oklahoma examples
  '73101': { state: 'OK', district: 5 },
  '73102': { state: 'OK', district: 5 },
  '73103': { state: 'OK', district: 5 },
  // Idaho examples
  '83701': { state: 'ID', district: 1 },
  '83702': { state: 'ID', district: 1 },
  '83703': { state: 'ID', district: 1 },
  // D.C. examples
  '20001': { state: 'D.C.', district: 1 },
  '20002': { state: 'D.C.', district: 1 },
  '20003': { state: 'D.C.', district: 1 },
};

export default function AddressCollection({ onComplete }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    district: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [geocodingStatus, setGeocodingStatus] = useState(null);
  const [representatives, setRepresentatives] = useState([]);
  const [autoFilled, setAutoFilled] = useState(false);
  const [censusData, setCensusData] = useState(null);
  const [censusLoading, setCensusLoading] = useState(false);
  const [censusError, setCensusError] = useState(null);

  const states = [
    'D.C.','AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const fetchCensusData = async (zip) => {
    setCensusLoading(true);
    setCensusError(null);
    try {
      const [pop, income] = await Promise.all([
        getZipPopulation(zip),
        getZipMedianIncome(zip)
      ]);
      setCensusData({
        population: pop ? pop.population : null,
        medianIncome: income ? income.medianIncome : null,
        name: pop ? pop.name : income ? income.name : null
      });
    } catch (err) {
      setCensusError('Could not load Census data.');
      setCensusData(null);
    } finally {
      setCensusLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-fill state and district when ZIP code is entered
    if (field === 'zipCode' && value.length === 5) {
      const zipInfo = zipToDistrict[value];
      if (zipInfo) {
        setFormData(prev => ({
          ...prev,
          state: zipInfo.state,
          district: zipInfo.district.toString()
        }));
        setAutoFilled(true);
        setTimeout(() => setAutoFilled(false), 3000);
      }
      // Fetch Census data for this ZIP
      fetchCensusData(value);
    }
  };

  // Get the number of districts for the selected state
  const districtCount = stateDistricts[formData.state] || 0;
  const districtOptions = districtCount
    ? Array.from({ length: districtCount }, (_, i) => (i + 1).toString())
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setGeocodingStatus(null);
    setRepresentatives([]);

    try {
      // Construct full address
      const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`;
      
      console.log('[Onboarding] Submitting address:', fullAddress);

      // First, update user with basic info
      const updateResult = await User.update({
        name: formData.name,
        address: fullAddress,
        state: formData.state,
        district: formData.district
      });

      if (!updateResult || !updateResult.success) {
        throw new Error('Failed to update user data');
      }

      // Instant lookup using ZIP code mapping (no API call)
      let mockRepresentatives = [];
      if (formData.state && formData.district) {
        // No loading state needed - it's instant!
        setGeocodingStatus('success');
        
        // Create mock representative data based on state/district
        mockRepresentatives = [
          {
            bioguideId: `sen-${formData.state}-1`,
            name: `Senator 1 (${formData.state})`,
            chamber: 'senate',
            party: 'D',
            district: null
          },
          {
            bioguideId: `sen-${formData.state}-2`,
            name: `Senator 2 (${formData.state})`,
            chamber: 'senate',
            party: 'R',
            district: null
          }
        ];
        
        // Add House representative if district is specified
        if (formData.district) {
          mockRepresentatives.push({
            bioguideId: `rep-${formData.state}-${formData.district}`,
            name: `Representative (${formData.state} District ${formData.district})`,
            chamber: 'house',
            party: 'D',
            district: parseInt(formData.district)
          });
        }
        
        setRepresentatives(mockRepresentatives);
        
        // Update user with location info and followed politicians
        const currentUser = User.loadFromStorage();
        if (currentUser) {
          const followResult = await User.update({
            state: formData.state,
            district: formData.district,
            followed_politicians: [
              ...new Set([...currentUser.followed_politicians, ...mockRepresentatives.map(r => r.bioguideId)])
            ]
          });

          if (!followResult || !followResult.success) {
            console.warn('[Onboarding] Failed to update followed politicians, but continuing...');
          }
        }
        
        console.log('[Onboarding] Instant lookup successful:', mockRepresentatives);
      }

      // Optional: Full geocoding in background for enhanced data (only 10% of the time to reduce load)
      if (formData.address && formData.city && formData.zipCode && Math.random() < 0.1) {
        setTimeout(async () => {
          try {
            console.log('[Onboarding] Starting background geocoding...');
            
            const fullResponse = await fetch('/api/geocode', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ address: fullAddress }),
            });

            if (fullResponse.ok) {
              const fullResult = await fullResponse.json();
              
              if (fullResult.success && fullResult.method === 'full_geocoding') {
                // Update user with enhanced location data
                const currentUser = User.loadFromStorage();
                if (currentUser) {
                  await User.update({
                    location_coordinates: fullResult.location.coordinates,
                    full_address: fullResult.location.fullAddress
                  });
                }
                
                console.log('[Onboarding] Background geocoding completed');
              }
            }
          } catch (error) {
            console.error('[Onboarding] Background geocoding failed:', error);
            // Silent fail - this is just enhancement
          }
        }, 2000); // Start after 2 seconds to be less intrusive
      }

      // Proceed to next step immediately (no artificial delay)
      onComplete({ 
        name: formData.name,
        representatives: mockRepresentatives, // Use the local variable instead of state
        geocodingSuccess: geocodingStatus === 'success'
      });
    } catch (error) {
      console.error('[Onboarding] Error updating address:', error);
      alert('Error saving address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.name && formData.address && formData.city && formData.state && formData.zipCode.length === 5;

  return (
    <Card className="terminal-surface border-gray-700 terminal-glow w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl terminal-text">Where are you located?</CardTitle>
        <p className="text-center terminal-muted mt-2">
          This helps us show you your representatives.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="terminal-text">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="terminal-input border-gray-600 bg-gray-800 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="address" className="terminal-text">Street Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="123 Main Street"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="terminal-input border-gray-600 bg-gray-800 text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="terminal-text">City</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="terminal-input border-gray-600 bg-gray-800 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state" className="terminal-text">State</Label>
                <select
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className={`terminal-input border-gray-600 bg-gray-800 text-white w-full h-10 px-3 py-2 rounded-md ${
                    autoFilled ? 'border-green-500 bg-green-900/20' : ''
                  }`}
                >
                  <option value="">Select state</option>
                  {states.map(state => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {autoFilled && (
                  <p className="text-xs text-green-400 mt-1">✓ Auto-filled from ZIP code</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zipCode" className="terminal-text">ZIP Code</Label>
                <Input
                  id="zipCode"
                  type="text"
                  placeholder="12345"
                  value={formData.zipCode}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={5}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9]/g, '');
                    if (value.length > 5) value = value.slice(0, 5);
                    handleInputChange('zipCode', value);
                  }}
                  className="terminal-input border-gray-600 bg-gray-800 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="district" className="terminal-text">Congressional District</Label>
                <select
                  id="district"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  className={`terminal-input border-gray-600 bg-gray-800 text-white w-full h-10 px-3 py-2 rounded-md ${
                    autoFilled ? 'border-green-500 bg-green-900/20' : ''
                  }`}
                  disabled={!formData.state || !districtOptions.length}
                >
                  <option value="">{formData.state ? 'Select district' : 'Select state first'}</option>
                  {districtOptions.map(district => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                {autoFilled && (
                  <p className="text-xs text-green-400 mt-1">✓ Auto-filled from ZIP code</p>
                )}
              </div>
            </div>
          </div>

          {censusLoading && (
            <div className="text-blue-400 text-sm mt-2">Loading Census data...</div>
          )}
          {censusError && (
            <div className="text-red-400 text-sm mt-2">{censusError}</div>
          )}
          {censusData && (
            <div className="bg-gray-800 border border-blue-700 rounded-lg p-4 mt-4">
              <div className="text-blue-300 font-semibold mb-1">Community Snapshot (Census)</div>
              <div className="text-sm text-gray-200">{censusData.name}</div>
              <div className="text-sm text-gray-200">Population: {censusData.population ? censusData.population.toLocaleString() : 'N/A'}</div>
              <div className="text-sm text-gray-200">Median Household Income: {censusData.medianIncome ? `$${parseInt(censusData.medianIncome).toLocaleString()}` : 'N/A'}</div>
            </div>
          )}

          {/* Geocoding Status */}
          {geocodingStatus && (
            <div className={`p-4 rounded-md border ${
              geocodingStatus === 'geocoding' ? 'border-blue-500 bg-blue-900/20' :
              geocodingStatus === 'success' ? 'border-green-500 bg-green-900/20' :
              'border-red-500 bg-red-900/20'
            }`}>
              <div className="flex items-center space-x-2">
                {geocodingStatus === 'geocoding' && (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                    <span className="text-blue-300">Finding your representatives...</span>
                  </>
                )}
                {geocodingStatus === 'success' && (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-300">
                      Found {representatives.length} representative{representatives.length !== 1 ? 's' : ''}!
                    </span>
                  </>
                )}
                {geocodingStatus === 'error' && (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-300">Could not automatically find representatives</span>
                  </>
                )}
              </div>
              {geocodingStatus === 'success' && representatives.length > 0 && (
                <div className="mt-2 text-sm text-gray-300">
                  <p>Auto-following:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    {representatives.map((rep, index) => (
                      <li key={index}>
                        {rep.name} ({rep.chamber === 'senate' ? 'Senator' : 'Representative'})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                // Go back to role selection
                window.location.reload();
              }}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Setting up...
                </div>
              ) : (
                <div className="flex items-center">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 