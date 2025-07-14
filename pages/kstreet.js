import React, { useState, useEffect } from "react";
import { User } from "../entities/User";
import { LobbyingContract } from "../entities/LobbyingContract";
import AppLayout from "../components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Briefcase, Building2, FileText, Cpu, Search, Users, Calendar, DollarSign } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";

export default function KStreet() {
  const [user, setUser] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('unknown');
  const [showHistorical, setShowHistorical] = useState(false);
  const [stats, setStats] = useState({
    totalDisclosures: 0,
    totalValue: 0,
    activeFirms: 0,
    recentFilings: 0
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
    loadContracts();
  }, []);

  useEffect(() => {
    loadContracts();
  }, [showHistorical]);

  useEffect(() => {
    let filtered = contracts;
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = contracts.filter(c =>
        c.client_company?.toLowerCase().includes(lowercasedTerm) ||
        c.lobbying_firm_hired?.toLowerCase().includes(lowercasedTerm) ||
        c.issues?.some(issue => issue.toLowerCase().includes(lowercasedTerm)) ||
        c.lobbyists?.some(lobbyist => lobbyist.toLowerCase().includes(lowercasedTerm))
      );
    }
    setFilteredContracts(filtered);
  }, [searchTerm, contracts]);

  const loadContracts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Loading lobbying contracts...');
      const params = new URLSearchParams({
        limit: '100',
        ...(showHistorical && { historical: 'true' })
      });
      const response = await fetch(`/api/lobbying-disclosures?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setContracts(data.disclosures);
        setFilteredContracts(data.disclosures);
        setApiStatus(data.apiStatus || 'unknown');
        
        // Calculate stats
        const totalValue = data.disclosures.reduce((sum, contract) => sum + (contract.contract_value || 0), 0);
        const uniqueFirms = new Set(data.disclosures.map(c => c.lobbying_firm_hired)).size;
        const recentFilings = data.disclosures.filter(c => {
          const filingDate = new Date(c.contract_date);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return filingDate >= thirtyDaysAgo;
        }).length;
        
        setStats({
          totalDisclosures: data.disclosures.length,
          totalValue,
          activeFirms: uniqueFirms,
          recentFilings
        });
        
        console.log('Successfully loaded lobbying contracts:', data.disclosures.length);
        console.log('API Status:', data.apiStatus);
        if (data.note) {
          console.log('Note:', data.note);
        }
      } else {
        throw new Error(data.message || 'Failed to load data');
      }
    } catch (error) {
      console.error("Error loading lobbying contracts:", error);
      setError("Failed to load lobbying data. Please try again later.");
    }
    setIsLoading(false);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <AppLayout user={user}>
      <div className="p-6 space-y-6 min-h-screen political-terminal">
        <div className="w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold terminal-text mb-2 flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-amber-400" />
              K Street Intelligence
            </h1>
            <p className="terminal-muted">Tracking corporate influence and lobbying in Washington.</p>
            
            {/* API Status Indicator */}
            {apiStatus === 'fallback' && (
              <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Cpu className="w-4 h-4" />
                  <span className="text-sm">
                    <strong>Demo Mode:</strong> Showing sample data. Real lobbyist disclosure APIs are not currently accessible.
                  </span>
                </div>
              </div>
            )}
            {apiStatus === 'real' && (
              <div className="mt-4 p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
                <div className="flex items-center gap-2 text-green-400">
                  <Cpu className="w-4 h-4" />
                  <span className="text-sm">
                    <strong>Live Data:</strong> Connected to real lobbyist disclosure database. 
                    {showHistorical ? ' Showing historical data from the LDA archive.' : ' Showing recent filings from the last year.'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Historical Data Toggle */}
          {apiStatus === 'real' && (
            <Card className="terminal-surface border-gray-700 mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="historical-toggle"
                      checked={showHistorical}
                      onChange={(e) => setShowHistorical(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label htmlFor="historical-toggle" className="text-sm terminal-text cursor-pointer">
                      Show Historical Data
                    </label>
                  </div>
                  <div className="text-xs terminal-muted">
                    {showHistorical ? 'Showing all available historical disclosures' : 'Showing only recent disclosures (last year)'}
                  </div>
                </div>
                <div className="mt-2 text-xs terminal-muted">
                  <strong>Note:</strong> The LDA API contains primarily historical data. Recent filings may be limited.
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="terminal-surface border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm terminal-muted">Total Disclosures</p>
                    <p className="text-xl font-bold terminal-text">{stats.totalDisclosures.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="terminal-surface border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm terminal-muted">Total Value</p>
                    <p className="text-xl font-bold terminal-text">{formatCurrency(stats.totalValue)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="terminal-surface border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm terminal-muted">Active Firms</p>
                    <p className="text-xl font-bold terminal-text">{stats.activeFirms}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="terminal-surface border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="text-sm terminal-muted">Recent Filings</p>
                    <p className="text-xl font-bold terminal-text">{stats.recentFilings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="terminal-surface border-gray-700 mb-6">
            <CardContent className="p-4">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 terminal-muted" />
                  <Input
                    placeholder="Search companies, lobbying firms, issues, or lobbyists..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-600 terminal-text"
                  />
                </div>
            </CardContent>
          </Card>

          {error && (
            <Card className="terminal-surface border-red-600 mb-6">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 text-red-400">
                  <Cpu className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="terminal-surface border-gray-700 terminal-glow">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="terminal-muted">Client / Firm</TableHead>
                    <TableHead className="terminal-muted">Contract Details</TableHead>
                    <TableHead className="terminal-muted">Lobbyists</TableHead>
                    <TableHead className="terminal-muted">AI Motive Analysis</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={4}><Skeleton className="h-20 bg-gray-800/50" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    filteredContracts.map(contract => (
                      <TableRow key={contract.id} className="border-gray-700 hover:bg-gray-800/50">
                        <TableCell>
                          <div className="font-bold terminal-text flex items-center gap-2">
                             <Building2 className="w-4 h-4" /> {contract.client_company}
                          </div>
                          <div className="text-sm terminal-muted flex items-center gap-2">
                             <Briefcase className="w-4 h-4" /> {contract.lobbying_firm_hired}
                          </div>
                          <div className="text-xs terminal-muted mt-1">
                            Filed: {formatDate(contract.contract_date)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-mono text-green-400 font-bold">{formatCurrency(contract.contract_value)}</div>
                          <div className="text-xs terminal-muted">{contract.filing_type}</div>
                          {contract.period_begin && contract.period_end && (
                            <div className="text-xs terminal-muted">
                              {formatDate(contract.period_begin)} - {formatDate(contract.period_end)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-400" />
                            <div className="text-sm terminal-text">
                              {contract.lobbyists && contract.lobbyists.length > 0 ? (
                                <div className="space-y-1">
                                  {contract.lobbyists.slice(0, 2).map((lobbyist, index) => (
                                    <div key={index} className="text-xs">{lobbyist}</div>
                                  ))}
                                  {contract.lobbyists.length > 2 && (
                                    <div className="text-xs terminal-muted">+{contract.lobbyists.length - 2} more</div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-xs terminal-muted">Not specified</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-start gap-2">
                            <Cpu className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                            <div>
                              <p className="text-sm terminal-text mb-2 line-clamp-3">{contract.ai_motive_analysis}</p>
                              <div className="flex flex-wrap gap-1">
                                {contract.issues?.slice(0, 3).map(issue => (
                                  <Badge key={issue} variant="outline" className="text-xs bg-gray-800 border-gray-600 text-gray-300">
                                    {issue}
                                  </Badge>
                                ))}
                                {contract.issues && contract.issues.length > 3 && (
                                  <Badge variant="outline" className="text-xs bg-gray-800 border-gray-600 text-gray-300">
                                    +{contract.issues.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {filteredContracts.length === 0 && !isLoading && !error && (
                <div className="text-center py-12 terminal-muted">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg">No Results Found</h3>
                  <p>Try a different search term.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
} 