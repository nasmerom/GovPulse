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
  Users, 
  MessageSquare, 
  TrendingUp, 
  FileText,
  Activity,
  Target,
  AlertTriangle,
  BarChart3,
  Calendar,
  Mail,
  Star,
  UserPlus,
  Vote,
  FileText as BillIcon,
  Award,
  Clock,
  Settings,
  Bell,
  Eye,
  Plus,
  Edit,
  Trash2,
  Send,
  Archive,
  Flag,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  MapPin,
  Phone,
  Globe,
  Building,
  Users2,
  Briefcase,
  BookOpen,
  Brain,
  Zap,
  Shield,
  TrendingDown,
  Minus,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Download,
  Upload,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  ClipboardList,
  Workflow,
  GitBranch
} from 'lucide-react';
import { getZipPopulation, getZipMedianIncome, getStatePopulation } from '../../utils/census';

export default function RepresentativeDashboard({ user }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [politicians, setPoliticians] = useState([]);
  const [bills, setBills] = useState([]);
  const [polls, setPolls] = useState([]);
  const [followedPoliticians, setFollowedPoliticians] = useState([]);
  const [followedPoliticiansData, setFollowedPoliticiansData] = useState([]);
  const [politicianUpdates, setPoliticianUpdates] = useState({});
  const [constituentCorrespondence, setConstituentCorrespondence] = useState([]);
  const [publicCalendar, setPublicCalendar] = useState([]);
  const [upcomingVotes, setUpcomingVotes] = useState([]);
  const [billAnalysis, setBillAnalysis] = useState([]);
  const [constituentMetrics, setConstituentMetrics] = useState({});
  const [partyCommunications, setPartyCommunications] = useState([]);
  const [districtData, setDistrictData] = useState({});
  const [censusData, setCensusData] = useState(null);
  const [censusLoading, setCensusLoading] = useState(false);
  const [censusError, setCensusError] = useState(null);
  // Add new state for section loading and errors
  const [repMetricsLoading, setRepMetricsLoading] = useState(true);
  const [repMetricsError, setRepMetricsError] = useState(null);
  const [constituentCorrespondenceLoading, setConstituentCorrespondenceLoading] = useState(true);
  const [constituentCorrespondenceError, setConstituentCorrespondenceError] = useState(null);
  const [upcomingVotesLoading, setUpcomingVotesLoading] = useState(true);
  const [upcomingVotesError, setUpcomingVotesError] = useState(null);
  const [followedLoading, setFollowedLoading] = useState(true);
  const [followedError, setFollowedError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setRepMetricsLoading(true);
    setConstituentCorrespondenceLoading(true);
    setUpcomingVotesLoading(true);
    setFollowedLoading(true);
    // Fetch Census data for district ZIP or state
    setCensusLoading(true);
    setCensusError(null);
    const fetchCensus = async () => {
      try {
        let data = null;
        if (user?.zipCode && user.zipCode.length === 5) {
          const [pop, income] = await Promise.all([
            getZipPopulation(user.zipCode),
            getZipMedianIncome(user.zipCode)
          ]);
          data = {
            name: pop ? pop.name : income ? income.name : null,
            population: pop ? pop.population : null,
            medianIncome: income ? income.medianIncome : null
          };
        } else if (user?.state) {
          // Optionally, map state abbreviation to FIPS code for getStatePopulation
          // For now, just skip if no ZIP
          data = null;
        }
        setCensusData(data);
      } catch (err) {
        setCensusError('Could not load Census data.');
        setCensusData(null);
      } finally {
        setCensusLoading(false);
      }
    };
    fetchCensus();
    setTimeout(() => {
      setEvents([
        {
          title: "Committee Hearing on Infrastructure",
          impact_level: "high",
          date: "2024-01-15",
          market_impact: 15
        },
        {
          title: "Floor Vote on Budget Bill",
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
          question: "Constituent support for infrastructure bill?",
          date_conducted: "2024-01-10",
          yes_percentage: 58
        }
      ]);
      
      setIsLoading(false);
    }, 1000);
    
    loadRepresentativeData();
  }, []);

  const loadRepresentativeData = async () => {
    await Promise.all([
      loadFollowedPoliticians(),
      loadConstituentCorrespondence(),
      loadPublicCalendar(),
      loadUpcomingVotes(),
      loadBillAnalysis(),
      loadConstituentMetrics(),
      loadPartyCommunications(),
      loadDistrictData()
    ]);
  };

  const loadFollowedPoliticians = async () => {
    setFollowedLoading(true);
    setFollowedError(null);
    try {
      const followedIds = await User.getFollowedPoliticians();
      setFollowedPoliticians(followedIds || []);
      
      if (followedIds && followedIds.length > 0) {
        await loadFollowedPoliticiansData(followedIds);
        await loadPoliticianUpdates(followedIds);
      }
      setFollowedLoading(false);
    } catch (error) {
      console.error('Error loading followed politicians:', error);
      setFollowedPoliticians([]);
      setFollowedError('Failed to load followed politicians.');
      setFollowedLoading(false);
    }
  };

  const loadFollowedPoliticiansData = async (politicianIds) => {
    try {
      const response = await fetch('/api/congress/member?congress=119&chamber=both');
      if (response.ok) {
        const data = await response.json();
        const allPoliticians = data.members || [];
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
      const updates = {};
      politicianIds.forEach(id => {
        updates[id] = generateMockUpdates();
      });
      setPoliticianUpdates(updates);
    } catch (error) {
      console.error('Error loading politician updates:', error);
    }
  };

  const loadConstituentCorrespondence = async () => {
    setConstituentCorrespondenceLoading(true);
    setConstituentCorrespondenceError(null);
    try {
      setConstituentCorrespondence([
        {
          id: 1,
          constituent: "Sarah Johnson",
          subject: "Healthcare Reform Support",
          category: "Healthcare",
          priority: "High",
          sentiment: "positive",
          received: "2024-01-15",
          status: "pending",
          aiSummary: "Constituent strongly supports healthcare reform legislation and shares personal story about insurance costs."
        },
        {
          id: 2,
          constituent: "Mike Chen",
          subject: "Climate Change Concerns",
          category: "Environment",
          priority: "Medium",
          sentiment: "negative",
          received: "2024-01-14",
          status: "in_progress",
          aiSummary: "Constituent expresses concerns about climate policy and requests stronger environmental protections."
        },
        {
          id: 3,
          constituent: "Lisa Rodriguez",
          subject: "Education Funding",
          category: "Education",
          priority: "High",
          sentiment: "neutral",
          received: "2024-01-13",
          status: "completed",
          aiSummary: "Constituent asks about education funding allocation and local school district support."
        }
      ]);
      setConstituentCorrespondenceLoading(false);
    } catch (error) {
      console.error('Error loading constituent correspondence:', error);
      setConstituentCorrespondence([]);
      setConstituentCorrespondenceError('Failed to load constituent correspondence.');
      setConstituentCorrespondenceLoading(false);
    }
  };

  const loadPublicCalendar = async () => {
    setPublicCalendar([
      {
        id: 1,
        title: "Town Hall Meeting",
        date: "2024-01-25",
        time: "7:00 PM",
        location: "Community Center",
        type: "town_hall",
        status: "published",
        rsvpCount: 45,
        maxCapacity: 100
      },
      {
        id: 2,
        title: "Infrastructure Site Visit",
        date: "2024-01-28",
        time: "10:00 AM",
        location: "Bridge Construction Site",
        type: "site_visit",
        status: "draft",
        rsvpCount: 12,
        maxCapacity: 25
      },
      {
        id: 3,
        title: "Small Business Roundtable",
        date: "2024-02-01",
        time: "2:00 PM",
        location: "Chamber of Commerce",
        type: "business_meeting",
        status: "published",
        rsvpCount: 28,
        maxCapacity: 50
      }
    ]);
  };

  const loadUpcomingVotes = async () => {
    setUpcomingVotesLoading(true);
    setUpcomingVotesError(null);
    try {
      setUpcomingVotes([
        {
          bill: "H.R. 5678 - Climate Action Act",
          date: "2024-01-25",
          status: "Scheduled",
          priority: "high",
          aiRecommendation: "Vote YES - Aligns with district priorities and has strong constituent support",
          talkingPoints: [
            "Supports local green energy initiatives",
            "Creates jobs in renewable energy sector",
            "Addresses constituent climate concerns"
          ]
        },
        {
          bill: "S. 9012 - Healthcare Reform",
          date: "2024-01-28",
          status: "Pending",
          priority: "medium",
          aiRecommendation: "Consider amendments - Support with modifications for cost control",
          talkingPoints: [
            "Improves healthcare access",
            "Needs cost containment measures",
            "Supports rural healthcare providers"
          ]
        }
      ]);
      setUpcomingVotesLoading(false);
    } catch (error) {
      console.error('Error loading upcoming votes:', error);
      setUpcomingVotes([]);
      setUpcomingVotesError('Failed to load upcoming votes.');
      setUpcomingVotesLoading(false);
    }
  };

  const loadBillAnalysis = async () => {
    setBillAnalysis([
      {
        bill: "H.R. 1234 - Infrastructure Bill",
        status: "Analysis Complete",
        keySections: [
          "Section 3: Highway funding allocation",
          "Section 7: Broadband infrastructure",
          "Section 12: Environmental impact review"
        ],
        districtImpact: "High - $15M in local projects",
        constituentSentiment: "78% support",
        aiRecommendation: "Strong support recommended"
      }
    ]);
  };

  const loadConstituentMetrics = async () => {
    setRepMetricsLoading(true);
    setRepMetricsError(null);
    try {
      setConstituentMetrics({
        totalCorrespondence: 247,
        responseRate: 94,
        averageResponseTime: "2.3 days",
        topIssues: [
          { issue: "Healthcare", count: 45, sentiment: "mixed" },
          { issue: "Education", count: 32, sentiment: "positive" },
          { issue: "Infrastructure", count: 28, sentiment: "positive" },
          { issue: "Environment", count: 25, sentiment: "negative" }
        ],
        approvalRating: 67,
        constituentSatisfaction: 8.2
      });
      setRepMetricsLoading(false);
    } catch (error) {
      console.error('Error loading constituent metrics:', error);
      setConstituentMetrics({});
      setRepMetricsError('Failed to load representative metrics.');
      setRepMetricsLoading(false);
    }
  };

  const loadPartyCommunications = async () => {
    setPartyCommunications([
      {
        id: 1,
        from: "Party Leadership",
        subject: "Vote Whip Alert - Infrastructure Bill",
        priority: "High",
        date: "2024-01-15",
        status: "unread",
        action: "Vote YES required"
      },
      {
        id: 2,
        from: "Committee Chair",
        subject: "Hearing Preparation - Healthcare",
        priority: "Medium",
        date: "2024-01-14",
        status: "read",
        action: "Review materials"
      }
    ]);
  };

  const loadDistrictData = async () => {
    setDistrictData({
      population: 750000,
      registeredVoters: 520000,
      voterTurnout: 68,
      demographics: {
        age: { "18-35": 25, "36-50": 30, "51-65": 28, "65+": 17 },
        party: { "Democratic": 45, "Republican": 40, "Independent": 15 }
      },
      keyIndustries: ["Technology", "Healthcare", "Manufacturing"],
      unemploymentRate: 3.2,
      medianIncome: 75000
    });
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
      }
    ];
    
    const numUpdates = Math.floor(Math.random() * 2) + 1;
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'Low': return 'bg-green-500/10 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'draft': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'pending': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const handleNewEvent = () => {
    router.push('/events');
  };

  const handleNewCorrespondence = () => {
    router.push('/correspondence');
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'schedule_event':
        router.push('/events');
        break;
      case 'review_correspondence':
        router.push('/correspondence');
        break;
      case 'case_management':
        router.push('/case-management');
        break;
      case 'committee_collaboration':
        router.push('/committee-collaboration');
        break;
      case 'bill_analysis':
        router.push('/congress');
        break;
      case 'party_communications':
        router.push('/party-communications');
        break;
      case 'legislative_scorecard':
        router.push('/legislative-scorecard');
        break;
      default:
        break;
    }
  };

  const repMetrics = [
    {
      title: "Constituent Correspondence",
      value: constituentMetrics.totalCorrespondence || "247",
      change: "+12%",
      icon: Mail,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Approval Rating",
      value: `${constituentMetrics.approvalRating || 67}%`,
      change: "+3%",
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Response Rate",
      value: `${constituentMetrics.responseRate || 94}%`,
      change: "+2%",
      icon: CheckCircle,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "Avg Response Time",
      value: constituentMetrics.averageResponseTime || "2.3 days",
      change: "-0.5 days",
      icon: Clock,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10"
    }
  ];

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
            Representative Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your district, constituents, and legislative priorities
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

      {/* District Economic Snapshot (Census) */}
      {censusLoading && (
        <div className="text-blue-400 text-sm mt-2">Loading Census data...</div>
      )}
      {censusError && (
        <div className="text-red-400 text-sm mt-2">{censusError}</div>
      )}
      {censusData && (
        <div className="bg-gray-800 border border-blue-700 rounded-lg p-4 mt-4">
          <div className="text-blue-300 font-semibold mb-1">District Economic Snapshot (Census)</div>
          <div className="text-sm text-gray-200">{censusData.name}</div>
          <div className="text-sm text-gray-200">Population: {censusData.population ? parseInt(censusData.population).toLocaleString() : 'N/A'}</div>
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

      {/* Representative Metrics */}
      {repMetricsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
      ) : repMetricsError ? (
        <div className="col-span-4 text-red-400 text-center">{repMetricsError}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {repMetrics.map((metric, index) => (
            <Card key={index} className={`terminal-surface border-gray-700 ${metric.bgColor} hover:shadow-lg transition-all duration-300`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between h-full">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <metric.icon className={`w-8 h-8 ${metric.color}`} />
                      <span className={`text-sm font-medium ${metric.color}`}>
                        {metric.change}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold terminal-text mb-3">{metric.title}</h3>
                    <p className={`text-3xl font-bold ${metric.color}`}>{metric.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Constituent Correspondence */}
      {constituentCorrespondenceLoading ? (
        <Skeleton className="h-32 w-full mt-6" />
      ) : constituentCorrespondenceError ? (
        <div className="text-red-400 text-center mt-6">{constituentCorrespondenceError}</div>
      ) : (
        <Card className="terminal-surface border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="terminal-text flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-400" />
                Constituent Correspondence
              </CardTitle>
              <Button 
                onClick={handleNewCorrespondence}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Response
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {constituentCorrespondence.map((correspondence) => (
                <div key={correspondence.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-blue-400 rounded-full" />
                    <div>
                      <div className="font-medium terminal-text">{correspondence.constituent}</div>
                      <div className="text-sm text-gray-400">{correspondence.subject}</div>
                      <div className="text-xs text-gray-500 mt-1">{correspondence.aiSummary}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className={getPriorityColor(correspondence.priority)}>
                      {correspondence.priority}
                    </Badge>
                    <Badge className={getStatusColor(correspondence.status)}>
                      {correspondence.status.replace('_', ' ')}
                    </Badge>
                    <div className="text-sm text-gray-400">{correspondence.received}</div>
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}



      {/* Upcoming Votes with AI Recommendations */}
      {upcomingVotesLoading ? (
        <Skeleton className="h-32 w-full mt-6" />
      ) : upcomingVotesError ? (
        <div className="text-red-400 text-center mt-6">{upcomingVotesError}</div>
      ) : (
        <Card className="terminal-surface border-gray-700">
          <CardHeader>
            <CardTitle className="terminal-text flex items-center">
              <Vote className="w-5 h-5 mr-2 text-purple-400" />
              Upcoming Votes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingVotes.map((vote, index) => (
                <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold terminal-text">{vote.bill}</h4>
                      <div className="text-sm text-gray-400">Vote Date: {vote.date}</div>
                    </div>
                    <Badge className={getPriorityColor(vote.priority)}>
                      {vote.priority} Priority
                    </Badge>
                  </div>
                  <div className="mb-3">
                    <div className="text-sm font-medium text-purple-400 mb-1">AI Recommendation:</div>
                    <div className="text-sm text-gray-300">{vote.aiRecommendation}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-blue-400 mb-1">Talking Points:</div>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {vote.talkingPoints.map((point, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <div className="w-1 h-1 bg-blue-400 rounded-full" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}



      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button 
          onClick={() => handleQuickAction('schedule_event')}
          variant="outline" 
          className="h-20 border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <Calendar className="w-6 h-6 mr-2" />
          Schedule Event
        </Button>
        <Button 
          onClick={() => handleQuickAction('review_correspondence')}
          variant="outline" 
          className="h-20 border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <Mail className="w-6 h-6 mr-2" />
          Review Mail
        </Button>
        <Button 
          onClick={() => handleQuickAction('case_management')}
          variant="outline" 
          className="h-20 border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <ClipboardList className="w-6 h-6 mr-2" />
          Case Management
        </Button>
        <Button 
          onClick={() => handleQuickAction('committee_collaboration')}
          variant="outline" 
          className="h-20 border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <GitBranch className="w-6 h-6 mr-2" />
          Committee Collaboration
        </Button>
        <Button 
          onClick={() => handleQuickAction('legislative_scorecard')}
          variant="outline" 
          className="h-20 border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <BarChart3 className="w-6 h-6 mr-2" />
          Scorecard
        </Button>
      </div>
    </div>
  );
} 