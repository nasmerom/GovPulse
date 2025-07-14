import React, { useState, useEffect } from 'react';
import { User } from '../entities/User';
import { Committee } from '../entities/Committee';
import AppLayout from '../components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Skeleton } from '../components/ui/skeleton';
import { 
  Search, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Activity,
  Target,
  BarChart3,
  Eye,
  Star,
  Building,
  Shield,
  Zap,
  Globe,
  Briefcase,
  Scale,
  Heart,
  Car,
  Leaf,
  GraduationCap,
  Factory,
  Plane,
  Ship,
  Train,
  Wifi,
  Database,
  Cpu,
  Lock,
  Unlock,
  Key,
  Calculator,
  Gauge,
  AlertTriangle,
  CheckCircle,
  Clock,
  Bell,
  ChartLine,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  Filter,
  Download,
  Share2,
  MessageCircle,
  ChevronRight,
  ChevronDown,
  Play,
  Pause,
  Square,
  Circle,
  Triangle
} from 'lucide-react';

export default function CommitteesPage() {
  const [user, setUser] = useState(null);
  const [committees, setCommittees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [chamberFilter, setChamberFilter] = useState('all');
  const [activityFilter, setActivityFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('influence');
  const [selectedCommittee, setSelectedCommittee] = useState(null);
  const [expandedCommittees, setExpandedCommittees] = useState(new Set());

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
    const loadCommittees = async () => {
      try {
        setIsLoading(true);
        const committeesData = await Committee.getAll();
        setCommittees(committeesData);
      } catch (error) {
        console.error('Error loading committees:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCommittees();
  }, []);

  const filteredCommittees = committees.filter(committee => {
    const matchesSearch = committee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         committee.chair?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         committee.jurisdiction?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesChamber = chamberFilter === 'all' || committee.chamber === chamberFilter;
    const matchesActivity = activityFilter === 'all' || committee.activityLevel === activityFilter;
    
    let matchesIndustry = true;
    if (industryFilter !== 'all') {
      const impact = committee.getIndustryImpact(industryFilter);
      matchesIndustry = impact.relevance === 'high';
    }

    // For Representatives, filter to show only their committees and subcommittees
    let matchesUserCommittee = true;
    if (user?.account_type === 'Representative') {
      // Mock data - in real implementation, this would come from the user's profile
      const userCommittees = [
        'House Transportation and Infrastructure',
        'House Transportation and Infrastructure - Subcommittee on Highways and Transit',
        'House Small Business Committee'
      ];
      matchesUserCommittee = userCommittees.some(userCommittee => 
        committee.name.includes(userCommittee) || 
        userCommittee.includes(committee.name)
      );
    }
    
    return matchesSearch && matchesChamber && matchesActivity && matchesIndustry && matchesUserCommittee;
  });

  const sortedCommittees = [...filteredCommittees].sort((a, b) => {
    switch (sortBy) {
      case 'influence':
        return b.influenceScore - a.influenceScore;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'chamber':
        return a.chamber.localeCompare(b.chamber);
      case 'activity':
        const activityOrder = { high: 3, medium: 2, low: 1 };
        return activityOrder[b.activityLevel] - activityOrder[a.activityLevel];
      case 'budget':
        return b.budgetAuthority - a.budgetAuthority;
      default:
        return 0;
    }
  });

  const toggleCommitteeExpansion = (committeeId) => {
    const newExpanded = new Set(expandedCommittees);
    if (newExpanded.has(committeeId)) {
      newExpanded.delete(committeeId);
    } else {
      newExpanded.add(committeeId);
    }
    setExpandedCommittees(newExpanded);
  };

  const getChamberIcon = (chamber) => {
    return chamber === 'Senate' ? <Building className="w-4 h-4" /> : <Users className="w-4 h-4" />;
  };

  const getActivityColor = (level) => {
    const colors = {
      high: 'text-green-400 bg-green-400/20',
      medium: 'text-yellow-400 bg-yellow-400/20',
      low: 'text-red-400 bg-red-400/20'
    };
    return colors[level] || colors.medium;
  };

  const getInfluenceColor = (score) => {
    if (score >= 90) return 'text-purple-400 bg-purple-400/20';
    if (score >= 80) return 'text-blue-400 bg-blue-400/20';
    if (score >= 70) return 'text-green-400 bg-green-400/20';
    if (score >= 60) return 'text-yellow-400 bg-yellow-400/20';
    return 'text-red-400 bg-red-400/20';
  };

  const getIndustryIcon = (industry) => {
    const icons = {
      defense: <Shield className="w-4 h-4" />,
      healthcare: <Heart className="w-4 h-4" />,
      finance: <DollarSign className="w-4 h-4" />,
      energy: <Zap className="w-4 h-4" />,
      technology: <Cpu className="w-4 h-4" />,
      transportation: <Car className="w-4 h-4" />,
      environment: <Leaf className="w-4 h-4" />,
      education: <GraduationCap className="w-4 h-4" />,
      agriculture: <Factory className="w-4 h-4" />,
      foreign: <Globe className="w-4 h-4" />
    };
    return icons[industry] || <Briefcase className="w-4 h-4" />;
  };

  const formatCurrency = (amount) => {
    if (amount >= 1e12) return `$${(amount / 1e12).toFixed(1)}T`;
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
    return `$${amount.toLocaleString()}`;
  };

  const getCommitteeStats = () => {
    const total = committees.length;
    const senate = committees.filter(c => c.chamber === 'Senate').length;
    const house = committees.filter(c => c.chamber === 'House').length;
    const highActivity = committees.filter(c => c.activityLevel === 'high').length;
    const avgInfluence = Math.round(committees.reduce((sum, c) => sum + c.influenceScore, 0) / total);
    
    return { total, senate, house, highActivity, avgInfluence };
  };

  const stats = getCommitteeStats();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <AppLayout user={user}>
      <div className="p-6 space-y-6 min-h-screen political-terminal">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold terminal-text mb-2">Committee Intelligence</h1>
            <p className="terminal-muted text-sm md:text-base">
              {user?.account_type === 'Representative' 
                ? 'Your committees and subcommittees' 
                : 'Advanced committee analytics and influence tracking'
              }
            </p>
          </div>
          <div className="text-xl md:text-2xl font-mono terminal-text">
            {filteredCommittees.length} committees
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card className="terminal-surface border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm terminal-muted">Total Committees</p>
                  <p className="text-2xl font-bold terminal-text">{stats.total}</p>
                </div>
                <Building className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="terminal-surface border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm terminal-muted">Senate</p>
                  <p className="text-2xl font-bold terminal-text">{stats.senate}</p>
                </div>
                <Building className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="terminal-surface border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm terminal-muted">House</p>
                  <p className="text-2xl font-bold terminal-text">{stats.house}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="terminal-surface border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm terminal-muted">High Activity</p>
                  <p className="text-2xl font-bold terminal-text">{stats.highActivity}</p>
                </div>
                <Activity className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="terminal-surface border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm terminal-muted">Avg Influence</p>
                  <p className="text-2xl font-bold terminal-text">{stats.avgInfluence}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="terminal-surface border-gray-700 mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 terminal-muted" />
                <Input
                  placeholder="Search committees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 terminal-text"
                />
              </div>
              
              <Select value={chamberFilter} onValueChange={setChamberFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-600 terminal-text">
                  <SelectValue placeholder="All Chambers" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all">All Chambers</SelectItem>
                  <SelectItem value="Senate">Senate</SelectItem>
                  <SelectItem value="House">House</SelectItem>
                </SelectContent>
              </Select>

              <Select value={activityFilter} onValueChange={setActivityFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-600 terminal-text">
                  <SelectValue placeholder="All Activity" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all">All Activity</SelectItem>
                  <SelectItem value="high">High Activity</SelectItem>
                  <SelectItem value="medium">Medium Activity</SelectItem>
                  <SelectItem value="low">Low Activity</SelectItem>
                </SelectContent>
              </Select>

              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-600 terminal-text">
                  <SelectValue placeholder="All Industries" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="defense">Defense</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="energy">Energy</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-gray-800 border-gray-600 terminal-text">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="influence">Influence Score</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="chamber">Chamber</SelectItem>
                  <SelectItem value="activity">Activity Level</SelectItem>
                  <SelectItem value="budget">Budget Authority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Committees Grid */}
        <div className="space-y-4">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <Card key={i} className="terminal-surface border-gray-700">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-3/4 bg-gray-700" />
                    <Skeleton className="h-4 w-1/2 bg-gray-700" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20 bg-gray-700" />
                      <Skeleton className="h-6 w-24 bg-gray-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            sortedCommittees.map((committee) => {
              const isExpanded = expandedCommittees.has(committee.id);
              const votingPatterns = committee.getVotingPatterns();
              const recentActivity = committee.getRecentActivity();
              const upcomingEvents = committee.getUpcomingEvents();
              
              return (
                <Card key={committee.id} className="terminal-surface border-gray-700 hover:bg-gray-800/30 transition-all duration-300">
                  <CardContent className="p-6">
                    {/* Main Committee Info */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold terminal-text">{committee.name}</h3>
                          {getChamberIcon(committee.chamber)}
                          <Badge variant="secondary" className={getInfluenceColor(committee.influenceScore)}>
                            {committee.influenceScore} Influence
                          </Badge>
                          <Badge variant="secondary" className={getActivityColor(committee.activityLevel)}>
                            {committee.activityLevel} Activity
                          </Badge>
                        </div>
                        
                        <p className="text-sm terminal-muted mb-3">{committee.jurisdiction}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {committee.keyIssues.slice(0, 3).map((issue, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-gray-800/50 text-gray-300 border-gray-600">
                              {issue}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm terminal-muted">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>{formatCurrency(committee.budgetAuthority)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{committee.members.length || 'N/A'} members</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{recentActivity.length} recent activities</span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => toggleCommitteeExpansion(committee.id)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    {/* Leadership */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-800/30 rounded-lg">
                      <div>
                        <p className="text-sm terminal-muted mb-1">Chair</p>
                        <p className="text-sm terminal-text font-medium">{committee.chair}</p>
                      </div>
                      <div>
                        <p className="text-sm terminal-muted mb-1">Ranking Member</p>
                        <p className="text-sm terminal-text font-medium">{committee.rankingMember}</p>
                      </div>
                    </div>
                    
                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="space-y-6 pt-4 border-t border-gray-700">
                        {/* Industry Impact */}
                        <div>
                          <h4 className="text-sm font-semibold terminal-text mb-3 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Industry Impact
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {Object.entries(committee.industryImpact).map(([industry, score]) => (
                              <div key={industry} className="flex items-center gap-2 p-2 bg-gray-800/50 rounded">
                                {getIndustryIcon(industry)}
                                <div>
                                  <p className="text-xs terminal-text capitalize">{industry}</p>
                                  <p className="text-xs terminal-muted">{score}%</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Recent Activity */}
                        <div>
                          <h4 className="text-sm font-semibold terminal-text mb-3 flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Recent Activity
                          </h4>
                          <div className="space-y-2">
                            {recentActivity.map((activity, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-2 bg-gray-800/30 rounded">
                                <div className={`w-2 h-2 rounded-full ${
                                  activity.type === 'hearing' ? 'bg-blue-400' :
                                  activity.type === 'markup' ? 'bg-green-400' :
                                  'bg-yellow-400'
                                }`} />
                                <div className="flex-1">
                                  <p className="text-sm terminal-text">{activity.title}</p>
                                  <p className="text-xs terminal-muted">
                                    {activity.date.toLocaleDateString()} • {activity.type}
                                  </p>
                                </div>
                                <Badge variant="secondary" className="text-xs bg-green-400/20 text-green-400">
                                  {activity.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Upcoming Events */}
                        <div>
                          <h4 className="text-sm font-semibold terminal-text mb-3 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Upcoming Events
                          </h4>
                          <div className="space-y-2">
                            {upcomingEvents.map((event, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-2 bg-gray-800/30 rounded">
                                <div className={`w-2 h-2 rounded-full ${
                                  event.type === 'hearing' ? 'bg-blue-400' : 'bg-green-400'
                                }`} />
                                <div className="flex-1">
                                  <p className="text-sm terminal-text">{event.title}</p>
                                  <p className="text-xs terminal-muted">
                                    {event.date.toLocaleDateString()} • {event.type}
                                  </p>
                                </div>
                                <Badge variant="secondary" className="text-xs bg-blue-400/20 text-blue-400">
                                  Scheduled
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Voting Patterns */}
                        {votingPatterns.partyBreakdown && Object.keys(votingPatterns.partyBreakdown).length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold terminal-text mb-3 flex items-center gap-2">
                              <BarChart3 className="w-4 h-4" />
                              Voting Patterns
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {Object.entries(votingPatterns.partyBreakdown).map(([party, count]) => (
                                <div key={party} className="flex items-center gap-2 p-2 bg-gray-800/50 rounded">
                                  <div className={`w-3 h-3 rounded-full ${
                                    party === 'Democratic' ? 'bg-blue-400' :
                                    party === 'Republican' ? 'bg-red-400' :
                                    'bg-gray-400'
                                  }`} />
                                  <div>
                                    <p className="text-xs terminal-text">{party}</p>
                                    <p className="text-xs terminal-muted">{count} members</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {filteredCommittees.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Building className="w-16 h-16 mx-auto mb-4 terminal-muted opacity-50" />
            <h3 className="text-xl font-medium terminal-text mb-2">No committees found</h3>
            <p className="terminal-muted">Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
} 