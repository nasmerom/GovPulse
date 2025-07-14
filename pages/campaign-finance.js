import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { User } from '../entities/User';
import AppLayout from '../components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  DollarSign, 
  Users, 
  Building, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter, 
  Calendar,
  MapPin,
  UserCheck,
  Award,
  Activity,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  Download,
  Share2,
  Eye,
  Target,
  Shield,
  Briefcase
} from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { formatFullName } from '../utils/formatName';
import { getStatePopulation, getZipPopulation, getZipMedianIncome } from '../utils/census';

export default function CampaignFinance() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('candidates');
  const [candidates, setCandidates] = useState([]);
  const [committees, setCommittees] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [partyFilter, setPartyFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [officeFilter, setOfficeFilter] = useState('all');
  const [cycleFilter, setCycleFilter] = useState('2024');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [censusData, setCensusData] = useState({});
  const [censusLoading, setCensusLoading] = useState(false);
  const [censusError, setCensusError] = useState(null);

  const parties = ['Democratic Party', 'Republican Party', 'Independent', 'Green Party', 'Libertarian Party'];
  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];
  const offices = ['President', 'Senate', 'House'];
  const cycles = ['2024', '2022', '2020', '2018'];

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
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, activeTab, cycleFilter]);

  useEffect(() => {
    if (activeTab === 'candidates' && candidates.length > 0) {
      setCensusLoading(true);
      setCensusError(null);
      const fetchCensus = async () => {
        try {
          const uniqueStates = [...new Set(candidates.map(c => c.state).filter(Boolean))];
          const censusResults = {};
          for (const state of uniqueStates) {
            // Map state abbreviation to FIPS code if needed, or use ZIP if available
            // For now, just skip ZIP and use state
            // You may want to add a state-to-FIPS mapping utility for getStatePopulation
            // For demo, skip FIPS and just set null
            censusResults[state] = { population: null, medianIncome: null };
          }
          setCensusData(censusResults);
        } catch (err) {
          setCensusError('Could not load Census data.');
          setCensusData({});
        } finally {
          setCensusLoading(false);
        }
      };
      fetchCensus();
    }
  }, [candidates, activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'candidates') {
        await loadCandidates();
      } else if (activeTab === 'committees') {
        await loadCommittees();
      } else if (activeTab === 'contributions') {
        await loadContributions();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCandidates = async () => {
    const params = new URLSearchParams({
      cycle: cycleFilter,
      limit: 50
    });
    if (partyFilter !== 'all') params.append('party', partyFilter);
    if (stateFilter !== 'all') params.append('state', stateFilter);
    if (officeFilter !== 'all') params.append('office', officeFilter);

    const response = await fetch(`/api/fec/candidates?${params.toString()}`);
    if (response.ok) {
      const data = await response.json();
      setCandidates(data.candidates || []);
    }
  };

  const loadCommittees = async () => {
    const params = new URLSearchParams({
      cycle: cycleFilter,
      limit: 50
    });
    if (partyFilter !== 'all') params.append('party', partyFilter);
    if (stateFilter !== 'all') params.append('state', stateFilter);

    const response = await fetch(`/api/fec/committees?${params.toString()}`);
    if (response.ok) {
      const data = await response.json();
      setCommittees(data.committees || []);
    }
  };

  const loadContributions = async () => {
    const params = new URLSearchParams({
      cycle: cycleFilter,
      limit: 50
    });
    if (minAmount) params.append('min_amount', minAmount);
    if (maxAmount) params.append('max_amount', maxAmount);

    const response = await fetch(`/api/fec/contributions?${params.toString()}`);
    if (response.ok) {
      const data = await response.json();
      setContributions(data.contributions || []);
    }
  };

  const formatAmount = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getTrendIcon = (value) => {
    if (value > 0) return <ArrowUpRight className="w-4 h-4 text-green-400" />;
    if (value < 0) return <ArrowDownRight className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getPartyColor = (party) => {
    if (party?.includes('Democratic')) return 'bg-blue-500/20 text-blue-400';
    if (party?.includes('Republican')) return 'bg-red-500/20 text-red-400';
    if (party?.includes('Independent')) return 'bg-gray-500/20 text-gray-400';
    return 'bg-purple-500/20 text-purple-400';
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <AppLayout user={user}>
      <div className="p-6 space-y-6 min-h-screen political-terminal">
        <div className="w-full">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 md:mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold terminal-text mb-2">Campaign Finance</h1>
              <p className="terminal-muted text-sm md:text-base">
                Federal Election Commission data and campaign finance intelligence
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={loadData} className="bg-blue-600 hover:bg-blue-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="terminal-surface border-gray-700 mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 terminal-muted" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-600 terminal-text"
                  />
                </div>
                
                <Select value={partyFilter} onValueChange={setPartyFilter}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 terminal-text">
                    <SelectValue placeholder="All Parties" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all">All Parties</SelectItem>
                    {parties.map(party => (
                      <SelectItem key={party} value={party}>{party}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={stateFilter} onValueChange={setStateFilter}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 terminal-text">
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all">All States</SelectItem>
                    {states.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={officeFilter} onValueChange={setOfficeFilter}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 terminal-text">
                    <SelectValue placeholder="All Offices" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all">All Offices</SelectItem>
                    {offices.map(office => (
                      <SelectItem key={office} value={office}>{office}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={cycleFilter} onValueChange={setCycleFilter}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 terminal-text">
                    <SelectValue placeholder="Election Cycle" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {cycles.map(cycle => (
                      <SelectItem key={cycle} value={cycle}>{cycle}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Additional filters for contributions */}
              {activeTab === 'contributions' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Input
                    placeholder="Min Amount"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    className="bg-gray-800 border-gray-600 terminal-text"
                  />
                  <Input
                    placeholder="Max Amount"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    className="bg-gray-800 border-gray-600 terminal-text"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
              <TabsTrigger value="candidates" className="terminal-text">Candidates</TabsTrigger>
              <TabsTrigger value="committees" className="terminal-text">Committees</TabsTrigger>
              <TabsTrigger value="contributions" className="terminal-text">Contributions</TabsTrigger>
            </TabsList>

            {/* Candidates Tab */}
            <TabsContent value="candidates" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoading ? (
                  Array(6).fill(0).map((_, i) => (
                    <Card key={i} className="terminal-surface border-gray-700">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <Skeleton className="h-6 w-3/4 bg-gray-700" />
                          <Skeleton className="h-4 w-1/2 bg-gray-700" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-full bg-gray-700" />
                            <Skeleton className="h-4 w-2/3 bg-gray-700" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  candidates.map((candidate) => (
                    <Card key={candidate.id} className="terminal-surface border-gray-700 hover:bg-gray-800/30 transition-all duration-300 terminal-glow">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold terminal-text text-lg mb-1">
                                {formatFullName(candidate)}
                              </h3>
                              <p className="text-sm terminal-muted">
                                {candidate.office} • {candidate.state}
                                {candidate.district && ` • District ${candidate.district}`}
                              </p>
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-2xl font-bold text-green-400">
                                {formatAmount(candidate.receipts)}
                              </p>
                              <p className="text-xs terminal-muted">Total Raised</p>
                            </div>
                          </div>

                          {/* Badges */}
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className={getPartyColor(candidate.party)}>
                              {candidate.party}
                            </Badge>
                            <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
                              {candidate.incumbent_challenge}
                            </Badge>
                            {candidate.fundraising_efficiency > 0 && (
                              <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                                {candidate.fundraising_efficiency.toFixed(1)}% Efficiency
                              </Badge>
                            )}
                          </div>

                          {/* Financial Details */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="terminal-muted">Disbursements</p>
                              <p className="terminal-text font-medium">{formatAmount(candidate.disbursements)}</p>
                            </div>
                            <div>
                              <p className="terminal-muted">Cash on Hand</p>
                              <p className="terminal-text font-medium">{formatAmount(candidate.cash_on_hand)}</p>
                            </div>
                            <div>
                              <p className="terminal-muted">Net Contributions</p>
                              <p className="terminal-text font-medium">{formatAmount(candidate.net_contributions)}</p>
                            </div>
                            <div>
                              <p className="terminal-muted">Debt</p>
                              <p className="terminal-text font-medium">{formatAmount(candidate.debt)}</p>
                            </div>
                          </div>

                          {/* Status */}
                          <div className="pt-2 border-t border-gray-700">
                            <p className="text-xs terminal-muted">
                              Last Updated: {formatDate(candidate.last_updated)} • Status: {candidate.status}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Committees Tab */}
            <TabsContent value="committees" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoading ? (
                  Array(6).fill(0).map((_, i) => (
                    <Card key={i} className="terminal-surface border-gray-700">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <Skeleton className="h-6 w-3/4 bg-gray-700" />
                          <Skeleton className="h-4 w-1/2 bg-gray-700" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-full bg-gray-700" />
                            <Skeleton className="h-4 w-2/3 bg-gray-700" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  committees.map((committee) => (
                    <Card key={committee.id} className="terminal-surface border-gray-700 hover:bg-gray-800/30 transition-all duration-300 terminal-glow">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold terminal-text text-lg mb-1">
                                {formatFullName(committee)}
                              </h3>
                              <p className="text-sm terminal-muted">
                                {committee.type} • {committee.state}
                              </p>
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-2xl font-bold text-green-400">
                                {formatAmount(committee.receipts)}
                              </p>
                              <p className="text-xs terminal-muted">Total Receipts</p>
                            </div>
                          </div>

                          {/* Badges */}
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className={getPartyColor(committee.party)}>
                              {committee.party}
                            </Badge>
                            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                              {committee.designation}
                            </Badge>
                            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                              {committee.organization_type}
                            </Badge>
                          </div>

                          {/* Financial Details */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="terminal-muted">Disbursements</p>
                              <p className="terminal-text font-medium">{formatAmount(committee.disbursements)}</p>
                            </div>
                            <div>
                              <p className="terminal-muted">Cash on Hand</p>
                              <p className="terminal-text font-medium">{formatAmount(committee.cash_on_hand)}</p>
                            </div>
                            <div>
                              <p className="terminal-muted">Net Contributions</p>
                              <p className="terminal-text font-medium">{formatAmount(committee.net_contributions)}</p>
                            </div>
                            <div>
                              <p className="terminal-muted">Debt</p>
                              <p className="terminal-text font-medium">{formatAmount(committee.debt)}</p>
                            </div>
                          </div>

                          {/* Treasurer */}
                          {committee.treasurer_name && (
                            <div className="pt-2 border-t border-gray-700">
                              <p className="text-xs terminal-muted">
                                Treasurer: {committee.treasurer_name}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Contributions Tab */}
            <TabsContent value="contributions" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {isLoading ? (
                  Array(6).fill(0).map((_, i) => (
                    <Card key={i} className="terminal-surface border-gray-700">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <Skeleton className="h-6 w-3/4 bg-gray-700" />
                          <Skeleton className="h-4 w-1/2 bg-gray-700" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-full bg-gray-700" />
                            <Skeleton className="h-4 w-2/3 bg-gray-700" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  contributions.map((contribution) => (
                    <Card key={contribution.id} className="terminal-surface border-gray-700 hover:bg-gray-800/30 transition-all duration-300 terminal-glow">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold terminal-text text-lg mb-1">
                                {contribution.contributor_name}
                              </h3>
                              <p className="text-sm terminal-muted">
                                {contribution.contributor_city}, {contribution.contributor_state}
                                {contribution.contributor_employer && ` • ${contribution.contributor_employer}`}
                              </p>
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-2xl font-bold text-green-400">
                                {formatAmount(contribution.contribution_amount)}
                              </p>
                              <p className="text-xs terminal-muted">Contribution</p>
                            </div>
                          </div>

                          {/* Badges */}
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                              {contribution.contribution_type}
                            </Badge>
                            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                              {contribution.receipt_type}
                            </Badge>
                            {contribution.is_individual && (
                              <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                                Individual
                              </Badge>
                            )}
                            {contribution.is_corporate && (
                              <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
                                Corporate
                              </Badge>
                            )}
                          </div>

                          {/* Details */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="terminal-muted">Committee</p>
                              <p className="terminal-text font-medium">{contribution.committee_name}</p>
                            </div>
                            <div>
                              <p className="terminal-muted">Candidate</p>
                              <p className="terminal-text font-medium">{contribution.candidate_name}</p>
                            </div>
                            <div>
                              <p className="terminal-muted">Date</p>
                              <p className="terminal-text font-medium">{formatDate(contribution.contribution_date)}</p>
                            </div>
                            <div>
                              <p className="terminal-muted">Occupation</p>
                              <p className="terminal-text font-medium">{contribution.contributor_occupation || 'N/A'}</p>
                            </div>
                          </div>

                          {/* Memo */}
                          {contribution.memo_text && (
                            <div className="pt-2 border-t border-gray-700">
                              <p className="text-xs terminal-muted">
                                Memo: {contribution.memo_text}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
} 