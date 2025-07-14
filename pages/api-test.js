import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export default function APITest() {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function testAPI() {
      try {
        setLoading(true);
        
        // Test the API directly from the browser
        const response = await fetch('/api/test-congress');
        const data = await response.json();
        
        setApiData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    testAPI();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">API Test Page</h1>
        
        {loading && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <p className="text-white">Testing API connection...</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="bg-red-900 border-red-700">
            <CardContent className="p-6">
              <h2 className="text-red-300 font-bold mb-2">API Error</h2>
              <p className="text-red-200">{error}</p>
            </CardContent>
          </Card>
        )}

        {apiData && (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">API Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">API Key Found:</span>
                    <Badge className="ml-2" variant={apiData.hasApiKey ? "default" : "destructive"}>
                      {apiData.hasApiKey ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-400">API Call Success:</span>
                    <Badge className="ml-2" variant={apiData.success ? "default" : "destructive"}>
                      {apiData.success ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-400">Bills Count:</span>
                    <span className="text-white ml-2">{apiData.billsCount || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Response Time:</span>
                    <span className="text-white ml-2">{apiData.responseTime || 0}ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {apiData.bills && apiData.bills.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Sample Bills (Real API Data)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {apiData.bills.slice(0, 5).map((bill, index) => (
                      <div key={index} className="p-4 bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                            {bill.bill_number}
                          </Badge>
                          <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30">
                            {bill.chamber}
                          </Badge>
                        </div>
                        <h3 className="text-white font-medium mb-1">{bill.title}</h3>
                        <p className="text-gray-300 text-sm">{bill.last_action}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {apiData.error && (
              <Card className="bg-red-900 border-red-700">
                <CardHeader>
                  <CardTitle className="text-red-300">API Error Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-200">{apiData.error}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 