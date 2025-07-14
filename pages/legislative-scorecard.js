import React, { useState, useEffect } from 'react';
import { User } from '../entities/User';
import AppLayout from '../components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  XCircle,
  BarChart3,
  Target,
  Award,
  Users,
  MapPin,
  Calendar,
  Filter,
  Search,
  Download,
  Share2,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Building,
  Vote,
  Gavel,
  DollarSign,
  Heart,
  Shield,
  Zap,
  Globe,
  GraduationCap,
  Car,
  Leaf,
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
  Activity,
  PieChart,
  LineChart,
  ScatterChart,
  AreaChart,
  Radar,
  Hexagon,
  Circle,
  Square,
  Triangle,
  Diamond
} from 'lucide-react';

export default function LegislativeScorecard() {
  const [user, setUser] = useState(null);
  const [scorecardData, setScorecardData] = useState(null);
  const [filteredBills, setFilteredBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

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
    loadScorecardData();
  }, []);

  useEffect(() => {
    filterBills();
  }, [scorecardData, searchTerm, statusFilter, categoryFilter]);

  const loadScorecardData = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockScorecardData = {
        member: {
          name: "Rep. Sarah Johnson",
          party: "Democratic",
          state: "CA",
          district: "12",
          totalBills: 47,
          activeBills: 23,
          passedBills: 8,
          failedBills: 12,
          pendingBills: 7
        },
        performance: {
          overallScore: 78,
          partyAverage: 72,
          regionalAverage: 75,
          nationalAverage: 70,
          trend: "+6%",
          rank: "Top 15%"
        },
        bills: [
          {
            id: "hr1234",
            title: "Infrastructure Investment and Jobs Act",
            category: "infrastructure",
            status: "passed",
            introducedDate: "2024-01-15",
            passedDate: "2024-03-20",
            sponsor: "Rep. Johnson",
            cosponsors: 45,
            voteCount: "Yea: 218, Nay: 210",
            progress: 100,
            impact: "high",
            description: "Comprehensive infrastructure investment package including roads, bridges, and broadband"
          },
          {
            id: "hr2345",
            title: "Healthcare Access and Affordability Act",
            category: "healthcare",
            status: "active",
            introducedDate: "2024-02-01",
            sponsor: "Rep. Johnson",
            cosponsors: 32,
            progress: 65,
            impact: "high",
            description: "Legislation to improve healthcare access and reduce prescription drug costs"
          },
          {
            id: "hr3456",
            title: "Climate Action and Clean Energy Act",
            category: "environment",
            status: "active",
            introducedDate: "2024-02-15",
            sponsor: "Rep. Johnson",
            cosponsors: 28,
            progress: 45,
            impact: "medium",
            description: "Comprehensive climate action and renewable energy investment"
          },
          {
            id: "hr4567",
            title: "Small Business Support and Recovery Act",
            category: "economy",
            status: "failed",
            introducedDate: "2024-01-20",
            failedDate: "2024-03-15",
            sponsor: "Rep. Johnson",
            cosponsors: 18,
            voteCount: "Yea: 195, Nay: 235",
            progress: 0,
            impact: "medium",
            description: "Support package for small businesses affected by economic challenges"
          },
          {
            id: "hr5678",
            title: "Education Funding and Student Success Act",
            category: "education",
            status: "pending",
            introducedDate: "2024-03-01",
            sponsor: "Rep. Johnson",
            cosponsors: 22,
            progress: 25,
            impact: "medium",
            description: "Increased funding for public education and student support programs"
          },
          {
            id: "hr6789",
            title: "Veterans Healthcare and Benefits Improvement Act",
            category: "veterans",
            status: "passed",
            introducedDate: "2024-01-10",
            passedDate: "2024-02-28",
            sponsor: "Rep. Johnson",
            cosponsors: 38,
            voteCount: "Yea: 245, Nay: 180",
            progress: 100,
            impact: "high",
            description: "Enhanced healthcare and benefits for veterans and their families"
          }
        ],
        categories: {
          infrastructure: { count: 8, passed: 3, avgProgress: 85 },
          healthcare: { count: 12, passed: 2, avgProgress: 60 },
          environment: { count: 6, passed: 1, avgProgress: 45 },
          economy: { count: 10, passed: 1, avgProgress: 35 },
          education: { count: 5, passed: 0, avgProgress: 25 },
          veterans: { count: 3, passed: 1, avgProgress: 90 },
          defense: { count: 3, passed: 0, avgProgress: 20 }
        },
        comparisons: {
          party: {
            overallScore: 72,
            billsIntroduced: 42,
            billsPassed: 6,
            avgProgress: 58
          },
          regional: {
            overallScore: 75,
            billsIntroduced: 45,
            billsPassed: 7,
            avgProgress: 62
          },
          national: {
            overallScore: 70,
            billsIntroduced: 38,
            billsPassed: 5,
            avgProgress: 55
          }
        }
      };

      setScorecardData(mockScorecardData);
    } catch (error) {
      console.error('Error loading scorecard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBills = () => {
    if (!scorecardData) return;

    let filtered = scorecardData.bills;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(bill => 
        bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(bill => bill.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(bill => bill.category === categoryFilter);
    }

    setFilteredBills(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'active': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'failed': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/10 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'infrastructure': return Building;
      case 'healthcare': return Heart;
      case 'environment': return Leaf;
      case 'economy': return DollarSign;
      case 'education': return GraduationCap;
      case 'veterans': return Shield;
      case 'defense': return Shield;
      default: return FileText;
    }
  };

  const getTrendIcon = (trend) => {
    if (trend.includes('+')) return <ArrowUpRight className="w-4 h-4 text-green-400" />;
    if (trend.includes('-')) return <ArrowDownRight className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  if (!user) {
    return (
      <div className="w-full min-h-screen political-terminal p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  if (!scorecardData) {
    return (
      <div className="w-full min-h-screen political-terminal p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Loading legislative scorecard...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout user={user}>
      <div className="px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold terminal-text">Legislative Scorecard</h1>
              <p className="text-gray-400 mt-2">
                Track progress of bills co-sponsored by {scorecardData.member.name}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="terminal-surface border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Overall Score</p>
                    <p className="text-3xl font-bold terminal-text">{scorecardData.performance.overallScore}</p>
                    <div className="flex items-center mt-2">
                      {getTrendIcon(scorecardData.performance.trend)}
                      <span className="text-sm text-gray-400 ml-1">{scorecardData.performance.trend}</span>
                    </div>
                  </div>
                  <Award className="w-12 h-12 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="terminal-surface border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Bills</p>
                    <p className="text-3xl font-bold terminal-text">{scorecardData.member.totalBills}</p>
                    <p className="text-sm text-gray-400 mt-2">{scorecardData.member.activeBills} Active</p>
                  </div>
                  <FileText className="w-12 h-12 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="terminal-surface border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Bills Passed</p>
                    <p className="text-3xl font-bold terminal-text">{scorecardData.member.passedBills}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {((scorecardData.member.passedBills / scorecardData.member.totalBills) * 100).toFixed(1)}% Success Rate
                    </p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="terminal-surface border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Ranking</p>
                    <p className="text-3xl font-bold terminal-text">{scorecardData.performance.rank}</p>
                    <p className="text-sm text-gray-400 mt-2">Among House Members</p>
                  </div>
                  <Target className="w-12 h-12 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comparison Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="terminal-surface border-gray-700">
              <CardHeader>
                <CardTitle className="terminal-text flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-400" />
                  Party Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Your Score</span>
                      <span className="terminal-text">{scorecardData.performance.overallScore}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Party Average</span>
                      <span className="terminal-text">{scorecardData.comparisons.party.overallScore}</span>
                    </div>
                    <Progress 
                      value={scorecardData.performance.overallScore} 
                      className="h-2 bg-gray-700"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Bills Introduced</span>
                      <p className="terminal-text">{scorecardData.member.totalBills} vs {scorecardData.comparisons.party.billsIntroduced}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Bills Passed</span>
                      <p className="terminal-text">{scorecardData.member.passedBills} vs {scorecardData.comparisons.party.billsPassed}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="terminal-surface border-gray-700">
              <CardHeader>
                <CardTitle className="terminal-text flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-green-400" />
                  Regional Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Your Score</span>
                      <span className="terminal-text">{scorecardData.performance.overallScore}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Regional Average</span>
                      <span className="terminal-text">{scorecardData.comparisons.regional.overallScore}</span>
                    </div>
                    <Progress 
                      value={scorecardData.performance.overallScore} 
                      className="h-2 bg-gray-700"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Bills Introduced</span>
                      <p className="terminal-text">{scorecardData.member.totalBills} vs {scorecardData.comparisons.regional.billsIntroduced}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Bills Passed</span>
                      <p className="terminal-text">{scorecardData.member.passedBills} vs {scorecardData.comparisons.regional.billsPassed}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="terminal-surface border-gray-700">
              <CardHeader>
                <CardTitle className="terminal-text flex items-center">
                  <Building className="w-5 h-5 mr-2 text-purple-400" />
                  National Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Your Score</span>
                      <span className="terminal-text">{scorecardData.performance.overallScore}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">National Average</span>
                      <span className="terminal-text">{scorecardData.comparisons.national.overallScore}</span>
                    </div>
                    <Progress 
                      value={scorecardData.performance.overallScore} 
                      className="h-2 bg-gray-700"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Bills Introduced</span>
                      <p className="terminal-text">{scorecardData.member.totalBills} vs {scorecardData.comparisons.national.billsIntroduced}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Bills Passed</span>
                      <p className="terminal-text">{scorecardData.member.passedBills} vs {scorecardData.comparisons.national.billsPassed}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="terminal-surface border-gray-700">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Search Bills</label>
                  <input
                    type="text"
                    placeholder="Search bills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full terminal-input border-gray-600 bg-gray-800 text-white px-3 py-2 rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full terminal-input border-gray-600 bg-gray-800 text-white px-3 py-2 rounded-md"
                  >
                    <option value="all">All Status</option>
                    <option value="passed">Passed</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full terminal-input border-gray-600 bg-gray-800 text-white px-3 py-2 rounded-md"
                  >
                    <option value="all">All Categories</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="environment">Environment</option>
                    <option value="economy">Economy</option>
                    <option value="education">Education</option>
                    <option value="veterans">Veterans</option>
                    <option value="defense">Defense</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setCategoryFilter('all');
                    }}
                    variant="outline" 
                    className="w-full border-gray-600 text-gray-300"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bills List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bills List */}
            <div className="lg:col-span-2">
              <Card className="terminal-surface border-gray-700">
                <CardHeader>
                  <CardTitle className="terminal-text flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-400" />
                    Co-Sponsored Bills ({filteredBills.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredBills.map((bill) => {
                      const CategoryIcon = getCategoryIcon(bill.category);
                      return (
                        <div 
                          key={bill.id} 
                          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                            selectedBill?.id === bill.id
                              ? 'bg-blue-600/20 border-blue-500'
                              : 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50'
                          }`}
                          onClick={() => setSelectedBill(bill)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <CategoryIcon className="w-5 h-5 text-blue-400 mt-1" />
                              <div className="flex-1">
                                <h4 className="font-semibold terminal-text mb-1">{bill.title}</h4>
                                <p className="text-sm text-gray-400 mb-2 line-clamp-2">{bill.description}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>Introduced: {bill.introducedDate}</span>
                                  <span>Cosponsors: {bill.cosponsors}</span>
                                  {bill.passedDate && <span>Passed: {bill.passedDate}</span>}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <Badge className={getStatusColor(bill.status)}>
                                {bill.status}
                              </Badge>
                              <Badge className={getImpactColor(bill.impact)}>
                                {bill.impact} Impact
                              </Badge>
                              <div className="text-sm text-gray-400">
                                {bill.progress}% Complete
                              </div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <Progress value={bill.progress} className="h-2 bg-gray-700" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bill Details */}
            <div className="lg:col-span-1">
              <Card className="terminal-surface border-gray-700">
                <CardHeader>
                  <CardTitle className="terminal-text flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-green-400" />
                    Bill Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedBill ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold terminal-text mb-2">{selectedBill.title}</h3>
                        <div className="flex items-center space-x-4 mb-3">
                          <Badge className={getStatusColor(selectedBill.status)}>
                            {selectedBill.status}
                          </Badge>
                          <Badge className={getImpactColor(selectedBill.impact)}>
                            {selectedBill.impact} Impact
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-800/50 rounded-lg">
                        <h4 className="font-medium terminal-text mb-2">Description:</h4>
                        <p className="text-sm text-gray-300">{selectedBill.description}</p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-400">Bill ID:</span>
                          <p className="text-sm terminal-text">{selectedBill.id}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-400">Introduced:</span>
                          <p className="text-sm terminal-text">{selectedBill.introducedDate}</p>
                        </div>
                        {selectedBill.passedDate && (
                          <div>
                            <span className="text-sm text-gray-400">Passed:</span>
                            <p className="text-sm terminal-text">{selectedBill.passedDate}</p>
                          </div>
                        )}
                        <div>
                          <span className="text-sm text-gray-400">Cosponsors:</span>
                          <p className="text-sm terminal-text">{selectedBill.cosponsors}</p>
                        </div>
                        {selectedBill.voteCount && (
                          <div>
                            <span className="text-sm text-gray-400">Vote Count:</span>
                            <p className="text-sm terminal-text">{selectedBill.voteCount}</p>
                          </div>
                        )}
                        <div>
                          <span className="text-sm text-gray-400">Progress:</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <Progress value={selectedBill.progress} className="flex-1 h-2 bg-gray-700" />
                            <span className="text-sm terminal-text">{selectedBill.progress}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-4 border-t border-gray-600">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
                          <Eye className="w-4 h-4 mr-2" />
                          View Full Bill
                        </Button>
                        <Button variant="outline" className="border-gray-600 text-gray-300">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Eye className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">Select a bill to view details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 