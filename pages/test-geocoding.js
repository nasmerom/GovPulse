import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { MapPin, CheckCircle, AlertCircle, Users } from 'lucide-react';

export default function TestGeocoding() {
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testAddresses = [
    '1600 Pennsylvania Avenue NW, Washington, DC 20500',
    '1 Apple Park Way, Cupertino, CA 95014',
    '350 Fifth Avenue, New York, NY 10118',
    '123 Main Street, Austin, TX 78701'
  ];

  const handleTest = async (testAddress) => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      console.log('[Test] Testing geocoding for:', testAddress);
      
      const response = await fetch('/api/geocode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: testAddress }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to geocode address');
      }

      const data = await response.json();
      setResult(data);
      console.log('[Test] Geocoding result:', data);
      
    } catch (err) {
      setError(err.message);
      console.error('[Test] Geocoding error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomTest = async (e) => {
    e.preventDefault();
    if (!address.trim()) return;
    await handleTest(address);
  };

  return (
    <div className="w-full min-h-screen political-terminal p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-3 mb-8">
          <MapPin className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold terminal-text">Geocoding Test</h1>
        </div>

        <Card className="terminal-surface border-gray-700 terminal-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 terminal-text">
              <MapPin className="w-5 h-5" />
              <span>Test Address Geocoding</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Custom Address Test */}
            <form onSubmit={handleCustomTest} className="space-y-4">
              <div>
                <Label htmlFor="address" className="terminal-text">Custom Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter a full address to test"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="terminal-input border-gray-600 bg-gray-800 text-white"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !address.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Testing...' : 'Test Custom Address'}
              </Button>
            </form>

            {/* Predefined Test Addresses */}
            <div>
              <Label className="terminal-text">Quick Test Addresses</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {testAddresses.map((testAddr, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleTest(testAddr)}
                    disabled={isLoading}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 text-left justify-start h-auto p-3"
                  >
                    <div className="text-sm">
                      <div className="font-medium">{testAddr.split(',')[0]}</div>
                      <div className="text-gray-400 text-xs">{testAddr.split(',').slice(1).join(',')}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading && (
          <Card className="terminal-surface border-gray-700 terminal-glow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                <span className="text-blue-300">Geocoding address and finding representatives...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="terminal-surface border-red-700 terminal-glow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span>Error</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-300">{error}</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <div className="space-y-4">
            {/* Location Information */}
            <Card className="terminal-surface border-gray-700 terminal-glow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 terminal-text">
                  <MapPin className="w-5 h-5" />
                  <span>Location Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="terminal-text">State</Label>
                    <p className="text-gray-300 mt-1">{result.location.state}</p>
                  </div>
                  <div>
                    <Label className="terminal-text">District</Label>
                    <p className="text-gray-300 mt-1">{result.location.district || 'N/A (Senators only)'}</p>
                  </div>
                  <div>
                    <Label className="terminal-text">Coordinates</Label>
                    <p className="text-gray-300 mt-1">
                      {result.location.coordinates.lat.toFixed(6)}, {result.location.coordinates.lng.toFixed(6)}
                    </p>
                  </div>
                  <div>
                    <Label className="terminal-text">Matched Address</Label>
                    <p className="text-gray-300 mt-1">{result.location.fullAddress}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Representatives Found */}
            <Card className="terminal-surface border-gray-700 terminal-glow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 terminal-text">
                  <Users className="w-5 h-5" />
                  <span>Representatives Found ({result.representatives.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.representatives.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.representatives.map((rep, index) => (
                      <div key={index} className="p-4 bg-gray-800 rounded-md border border-gray-600">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            rep.party === 'Democratic' ? 'bg-blue-600' : 'bg-red-600'
                          }`}>
                            <span className="text-white text-sm font-medium">
                              {rep.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium terminal-text">{rep.name}</p>
                            <p className="text-sm text-gray-400">
                              {rep.chamber === 'senate' ? 'Senator' : `Representative (District ${rep.district})`}
                            </p>
                            <p className="text-xs text-gray-500">{rep.party}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No representatives found for this address.</p>
                )}
              </CardContent>
            </Card>

            {/* Success Summary */}
            <Card className="terminal-surface border-green-700 terminal-glow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-green-300 font-medium">
                      Successfully found {result.followedCount} representative{result.followedCount !== 1 ? 's' : ''}!
                    </p>
                    <p className="text-green-400 text-sm">
                      These representatives would be auto-followed for this address.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 