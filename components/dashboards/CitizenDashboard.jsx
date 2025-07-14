// TODO: This dashboard uses mock data for events and possibly other sections. Replace with real API integration.
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import KeyMetrics from '../dashboard/KeyMetrics';
import { User } from '../../entities/User';
import { 
  MapPin, 
  Calendar, 
  TrendingUp, 
  Users,
  FileText,
  Activity,
  Star,
  UserPlus,
  MessageSquare,
  Vote,
  FileText as BillIcon,
  Award,
  Clock,
  DollarSign,
  BarChart3,
  Target,
  Bell,
  Eye,
  Heart,
  Share2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Minus,
  TrendingDown,
  Building,
  Car,
  GraduationCap,
  Shield,
  Globe,
  Settings
} from 'lucide-react';
import { formatFullName } from '../../utils/formatName';
import { getZipPopulation, getZipMedianIncome } from '../../utils/census';

export default function CitizenDashboard({ user }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [politicians, setPoliticians] = useState([]);
  const [bills, setBills] = useState([]);
  const [polls, setPolls] = useState([]);
  const [followedPoliticians, setFollowedPoliticians] = useState([]);
  const [followedPoliticiansData, setFollowedPoliticiansData] = useState([]);
  const [politicianUpdates, setPoliticianUpdates] = useState({});
  const [localIssues, setLocalIssues] = useState([]);
  const [campaignFinance, setCampaignFinance] = useState({});
  const [votingHistory, setVotingHistory] = useState({});
  const [districtSpending, setDistrictSpending] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [censusData, setCensusData] = useState(null);
  const [censusLoading, setCensusLoading] = useState(false);
  const [censusError, setCensusError] = useState(null);
  // Add new state for section loading and errors
  const [localIssuesLoading, setLocalIssuesLoading] = useState(true);
  const [localIssuesError, setLocalIssuesError] = useState(null);
  const [campaignFinanceLoading, setCampaignFinanceLoading] = useState(true);
  const [campaignFinanceError, setCampaignFinanceError] = useState(null);
  const [votingHistoryLoading, setVotingHistoryLoading] = useState(true);
  const [votingHistoryError, setVotingHistoryError] = useState(null);
  const [districtSpendingLoading, setDistrictSpendingLoading] = useState(true);
  const [districtSpendingError, setDistrictSpendingError] = useState(null);
  const [upcomingEventsLoading, setUpcomingEventsLoading] = useState(true);
  const [upcomingEventsError, setUpcomingEventsError] = useState(null);
  const [followedLoading, setFollowedLoading] = useState(true);
  const [followedError, setFollowedError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setLocalIssuesLoading(true);
    setCampaignFinanceLoading(true);
    setVotingHistoryLoading(true);
    setDistrictSpendingLoading(true);
    setUpcomingEventsLoading(true);
    setFollowedLoading(true);
    setTimeout(() => {
      setEvents([
        {
          title: "Senate Vote on Infrastructure Bill",
          impact_level: "high",
          date: "2024-01-15",
          market_impact: 15
        },
        {
          title: "Federal Reserve Interest Rate Decision",
          impact_level: "critical",
          date: "2024-01-20",
          market_impact: 25
        }
      ]);
      
      setPoliticians([
        {
          name: "Sen. John Smith",
          party: "Democrat",
          state: "CA",
          approval_rating: 65
        }
      ]);
      
      setBills([
        {
          title: "H.R. 1234 - Infrastructure Investment Act",
          status: "floor_vote",
          sponsor: "Rep. Jane Doe"
        }
      ]);
      
      setPolls([
        {
          question: "Do you support the infrastructure bill?",
          date_conducted: "2024-01-10",
          yes_percentage: 58
        }
      ]);
      
      setIsLoading(false);
    }, 1000);
    
    // Load followed politicians
    loadFollowedPoliticians();
    loadLocalIssues();
    loadCampaignFinance();
    loadVotingHistory();
    loadDistrictSpending();
    loadUpcomingEvents();

    // Fetch Census data for user's ZIP code if available
    if (user?.zipCode && user.zipCode.length === 5) {
      setCensusLoading(true);
      setCensusError(null);
      Promise.all([
        getZipPopulation(user.zipCode),
        getZipMedianIncome(user.zipCode)
      ]).then(([pop, income]) => {
        setCensusData({
          population: pop ? pop.population : null,
          medianIncome: income ? income.medianIncome : null,
          name: pop ? pop.name : income ? income.name : null
        });
      }).catch(() => {
        setCensusError('Could not load Census data.');
        setCensusData(null);
      }).finally(() => {
        setCensusLoading(false);
      });
    }
  }, [user?.zipCode]);

  const loadFollowedPoliticians = async () => {
    setFollowedLoading(true);
    setFollowedError(null);
    try {
      const followedIds = await User.getFollowedPoliticians();
      setFollowedPoliticians(followedIds || []);
      
      if (followedIds && followedIds.length > 0) {
        // Load detailed data for followed politicians
        await loadFollowedPoliticiansData(followedIds);
        // Load recent updates for each politician
        await loadPoliticianUpdates(followedIds);
      }
    } catch (error) {
      console.error('Error loading followed politicians:', error);
      setFollowedPoliticians([]);
      setFollowedError('Failed to load followed politicians.');
    } finally {
      setFollowedLoading(false);
    }
  };

  const loadFollowedPoliticiansData = async (politicianIds) => {
    try {
      // Fetch detailed data for followed politicians
      const response = await fetch('/api/congress/member?congress=119&chamber=both');
      if (response.ok) {
        const data = await response.json();
        const allPoliticians = data.members || [];
        
        // Filter to only followed politicians
        const followedData = allPoliticians.filter(p => 
          politicianIds.includes(p.bioguideId)
        );
        
        setFollowedPoliticiansData(followedData);
      }
    } catch (error) {
      console.error('Error loading followed politicians data:', error);
    }
  };

  const loadPoliticianUpdates = async (politicianIds) => {
    try {
      // Generate mock updates for each politician
      const updates = {};
      
      politicianIds.forEach(id => {
        updates[id] = generateMockUpdates();
      });
      
      setPoliticianUpdates(updates);
    } catch (error) {
      console.error('Error loading politician updates:', error);
    }
  };

  const loadLocalIssues = async () => {
    setLocalIssuesLoading(true);
    setLocalIssuesError(null);
    try {
      // Mock local issues data - replace with real API calls
      setLocalIssues([
        {
          title: "Local Infrastructure Projects",
          description: "Federal funds allocated for road repairs and bridge maintenance",
          icon: Building,
          count: 5,
          impact: "high",
          status: "funded"
        },
        {
          title: "Education Funding",
          description: "School district improvements and technology upgrades",
          icon: GraduationCap,
          count: 3,
          impact: "medium",
          status: "pending"
        },
        {
          title: "Healthcare Access",
          description: "Expansion of community health centers",
          icon: Shield,
          count: 2,
          impact: "high",
          status: "approved"
        },
        {
          title: "Environmental Protection",
          description: "Local conservation and clean energy initiatives",
          icon: Globe,
          count: 4,
          impact: "medium",
          status: "in_progress"
        }
      ]);
    } catch (error) {
      setLocalIssues([]);
      setLocalIssuesError('Failed to load local issues.');
    } finally {
      setLocalIssuesLoading(false);
    }
  };

  const loadCampaignFinance = async () => {
    setCampaignFinanceLoading(true);
    setCampaignFinanceError(null);
    try {
      // Mock campaign finance data - replace with OpenSecrets API
      setCampaignFinance({
        totalRaised: 2500000,
        totalSpent: 2100000,
        topDonors: [
          { name: "Tech Industry PAC", amount: 150000, industry: "Technology" },
          { name: "Healthcare Association", amount: 120000, industry: "Healthcare" },
          { name: "Labor Union PAC", amount: 95000, industry: "Labor" }
        ],
        industryBreakdown: {
          "Technology": 25,
          "Healthcare": 20,
          "Finance": 15,
          "Labor": 12,
          "Energy": 8,
          "Other": 20
        }
      });
    } catch (error) {
      setCampaignFinance({});
      setCampaignFinanceError('Failed to load campaign finance data.');
    } finally {
      setCampaignFinanceLoading(false);
    }
  };

  const loadVotingHistory = async () => {
    setVotingHistoryLoading(true);
    setVotingHistoryError(null);
    try {
      // Mock voting history - replace with real API data
      setVotingHistory({
        totalVotes: 245,
        partyLineVotes: 180,
        bipartisanVotes: 65,
        keyVotes: [
          {
            bill: "H.R. 1234 - Infrastructure Bill",
            vote: "YES",
            partyPosition: "support",
            impact: "high",
            date: "2024-01-15"
          },
          {
            bill: "S. 5678 - Healthcare Reform",
            vote: "NO",
            partyPosition: "oppose",
            impact: "critical",
            date: "2024-01-10"
          }
        ]
      });
    } catch (error) {
      setVotingHistory({});
      setVotingHistoryError('Failed to load voting history.');
    } finally {
      setVotingHistoryLoading(false);
    }
  };

  const loadDistrictSpending = async () => {
    setDistrictSpendingLoading(true);
    setDistrictSpendingError(null);
    try {
      // Mock district spending data - replace with USAspending API
      setDistrictSpending([
        {
          category: "Infrastructure",
          amount: 15000000,
          projects: 5,
          status: "active"
        },
        {
          category: "Education",
          amount: 8500000,
          projects: 3,
          status: "approved"
        },
        {
          category: "Healthcare",
          amount: 6200000,
          projects: 2,
          status: "pending"
        }
      ]);
    } catch (error) {
      setDistrictSpending([]);
      setDistrictSpendingError('Failed to load district spending.');
    } finally {
      setDistrictSpendingLoading(false);
    }
  };

  const loadUpcomingEvents = async () => {
    setUpcomingEventsLoading(true);
    setUpcomingEventsError(null);
    try {
      // Mock upcoming events - replace with real calendar data
      setUpcomingEvents([
        {
          title: "Town Hall Meeting",
          date: "2024-01-25",
          time: "7:00 PM",
          location: "Community Center",
          type: "town_hall",
          rsvpRequired: true
        },
        {
          title: "Infrastructure Site Visit",
          date: "2024-01-28",
          time: "10:00 AM",
          location: "Bridge Construction Site",
          type: "site_visit",
          rsvpRequired: false
        },
        {
          title: "Small Business Roundtable",
          date: "2024-02-01",
          time: "2:00 PM",
          location: "Chamber of Commerce",
          type: "business_meeting",
          rsvpRequired: true
        }
      ]);
    } catch (error) {
      setUpcomingEvents([]);
      setUpcomingEventsError('Failed to load upcoming events.');
    } finally {
      setUpcomingEventsLoading(false);
    }
  };

  const generateMockUpdates = () => {
    const updateTypes = [
      {
        type: 'vote',
        icon: Vote,
        title: 'Voted on H.R. 1234 - Infrastructure Bill',
        description: 'Voted YES on infrastructure investment legislation',
        time: '2 hours ago',
        color: 'text-green-400'
      },
      {
        type: 'statement',
        icon: MessageSquare,
        title: 'Released statement on climate policy',
        description: 'Issued public statement supporting renewable energy initiatives',
        time: '1 day ago',
        color: 'text-blue-400'
      },
      {
        type: 'bill',
        icon: BillIcon,
        title: 'Introduced H.R. 5678 - Education Reform',
        description: 'Sponsored new legislation for education funding',
        time: '3 days ago',
        color: 'text-purple-400'
      },
      {
        type: 'award',
        icon: Award,
        title: 'Received Environmental Leadership Award',
        description: 'Recognized for work on environmental protection',
        time: '1 week ago',
        color: 'text-yellow-400'
      }
    ];
    
    // Return 1-3 random updates
    const numUpdates = Math.floor(Math.random() * 3) + 1;
    return updateTypes.slice(0, numUpdates);
  };

  const getPartyColor = (party) => {
    switch (party) {
      case 'Democratic': return 'from-blue-500 to-blue-600';
      case 'Republican': return 'from-red-500 to-red-600';
      case 'Independent': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const cleanPoliticianName = (name) => {
    return name?.replace(/^(Rep\.|Sen\.)\s+/, '') || '';
  };

  const getVoteIcon = (vote) => {
    switch (vote) {
      case 'YES': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'NO': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'PRESENT': return <Minus className="w-4 h-4 text-yellow-400" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'funded': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'approved': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'in_progress': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // In the return, add global skeleton for isLoading
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/2 mb-4" />
        <Skeleton className="h-8 w-1/3 mb-2" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
        <Skeleton className="h-32 w-full mt-6" />
        <Skeleton className="h-32 w-full mt-6" />
        <Skeleton className="h-32 w-full mt-6" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold terminal-text">
            Welcome back, {user?.name ? user.name : 'Citizen'}
          </h1>
          <p className="text-gray-400 mt-2">
            Stay informed about issues that matter to you in {user?.state || 'your state'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Community Snapshot (Census) */}
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

      <KeyMetrics 
        events={events}
        politicians={politicians}
        bills={bills}
        polls={polls}
        isLoading={isLoading}
      />

      {/* Enhanced Local Issues Section */}
      {localIssuesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
      ) : localIssuesError ? (
        <div className="col-span-4 text-red-400 text-center">{localIssuesError}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {localIssues.map((issue, index) => (
            <Card key={index} className="terminal-surface border-gray-700 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <issue.icon className="w-6 h-6 text-blue-400" />
                    <CardTitle className="text-lg terminal-text">{issue.title}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(issue.status)}>
                    {issue.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">{issue.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-400">{issue.count}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-gray-600 text-gray-300"
                    onClick={() => router.push(`/local-issues/${index}`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Followed Politicians */}
      {followedLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
      ) : followedError ? (
        <div className="text-red-400 text-center mb-12">{followedError}</div>
      ) : followedPoliticiansData.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold terminal-text mb-6">Your Representatives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {followedPoliticiansData.map((politician, index) => (
              <Card key={index} className="terminal-surface border-gray-700">
                <CardHeader>
                  <CardTitle className="terminal-text flex items-center">
                    <span className="mr-2">{formatFullName(politician)}</span>
                    <Badge className="ml-2">{politician.party}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Recent Activity */}
                  <div>
                    <h4 className="text-sm font-semibold terminal-text mb-2">Recent Activity</h4>
                    <div className="space-y-2">
                      {politicianUpdates[politician.bioguideId]?.slice(0, 2).map((update, updateIndex) => (
                        <div key={updateIndex} className="flex items-center space-x-2 text-sm">
                          <update.icon className={`w-4 h-4 ${update.color}`} />
                          <span className="text-gray-300">{update.title}</span>
                          <span className="text-gray-500 text-xs">{update.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Campaign Finance Overview for this rep (if available) */}
                  {politician.campaignFinance && Object.keys(politician.campaignFinance).length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold terminal-text mb-2 flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-green-400" />
                        Campaign Finance Overview
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">
                            {formatCurrency(politician.campaignFinance.totalRaised)}
                          </div>
                          <div className="text-sm text-gray-400">Total Raised</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-400">
                            {formatCurrency(politician.campaignFinance.totalSpent)}
                          </div>
                          <div className="text-sm text-gray-400">Total Spent</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">
                            {formatCurrency(politician.campaignFinance.totalRaised - politician.campaignFinance.totalSpent)}
                          </div>
                          <div className="text-sm text-gray-400">Cash on Hand</div>
                        </div>
                      </div>
                      {/* Top Donors */}
                      <div className="mt-4">
                        <h5 className="text-xs font-semibold terminal-text mb-1">Top Donors</h5>
                        <div className="space-y-1">
                          {politician.campaignFinance.topDonors?.slice(0, 3).map((donor, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <span className="text-gray-300">{donor.name}</span>
                              <span className="text-green-400">{formatCurrency(donor.amount)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Voting History for this rep (if available) */}
                  {politician.votingHistory && Object.keys(politician.votingHistory).length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold terminal-text mb-2 flex items-center">
                        <Vote className="w-4 h-4 mr-2 text-purple-400" />
                        Recent Voting History
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">
                            {politician.votingHistory.totalVotes}
                          </div>
                          <div className="text-sm text-gray-400">Total Votes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">
                            {politician.votingHistory.partyLineVotes}
                          </div>
                          <div className="text-sm text-gray-400">Party Line Votes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">
                            {politician.votingHistory.bipartisanVotes}
                          </div>
                          <div className="text-sm text-gray-400">Bipartisan Votes</div>
                        </div>
                      </div>
                      {/* Key Votes */}
                      <div>
                        <h5 className="text-xs font-semibold terminal-text mb-1">Key Recent Votes</h5>
                        <div className="space-y-2">
                          {politician.votingHistory.keyVotes?.map((vote, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                              <div className="flex items-center space-x-2">
                                {getVoteIcon(vote.vote)}
                                <div>
                                  <div className="text-xs font-medium terminal-text">{vote.bill}</div>
                                  <div className="text-xs text-gray-400">{vote.date}</div>
                                </div>
                              </div>
                              <Badge className={vote.impact === 'critical' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'}>
                                {vote.impact}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-6">
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 flex-1">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Contact
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* District Spending */}
      {districtSpendingLoading ? (
        <Skeleton className="h-32 w-full mt-6" />
      ) : districtSpendingError ? (
        <div className="text-red-400 text-center mt-6">{districtSpendingError}</div>
      ) : districtSpending.length > 0 && (
        <Card className="terminal-surface border-gray-700">
          <CardHeader>
            <CardTitle className="terminal-text flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-orange-400" />
              Federal Spending in Your District
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {districtSpending.map((spending, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-orange-400">
                    {formatCurrency(spending.amount)}
                  </div>
                  <div className="text-sm text-gray-400">{spending.category}</div>
                  <div className="text-xs text-gray-500">{spending.projects} projects</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Events */}
      {upcomingEventsLoading ? (
        <Skeleton className="h-32 w-full mt-6" />
      ) : upcomingEventsError ? (
        <div className="text-red-400 text-center mt-6">{upcomingEventsError}</div>
      ) : upcomingEvents.length > 0 && (
        <Card className="terminal-surface border-gray-700">
          <CardHeader>
            <CardTitle className="terminal-text flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-400" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <div>
                      <div className="text-sm font-medium terminal-text">{event.title}</div>
                      <div className="text-xs text-gray-400">
                        {event.date} at {event.time} • {event.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {event.rsvpRequired && (
                      <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
                        RSVP Required
                      </Badge>
                    )}
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                      <Eye className="w-4 h-4 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 