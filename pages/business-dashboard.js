import { useState, useEffect } from 'react';
import { User } from '../entities/User';
import AppLayout from '../components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Users,
  Target,
  BarChart3,
  Activity,
  Bell,
  Settings,
  Search,
  Filter,
  Download,
  Share2,
  Eye,
  Zap,
  Shield,
  Globe,
  Building,
  PieChart,
  Calendar,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  FileText,
  Award
} from 'lucide-react';
import { getZipPopulation, getZipMedianIncome, getStatePopulation } from '../utils/census';

export default function BusinessDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [intelligenceData, setIntelligenceData] = useState(null);
  const [federalSpending, setFederalSpending] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState('technology');
  const [selectedState, setSelectedState] = useState('CA');
  const [censusData, setCensusData] = useState(null);
  const [censusLoading, setCensusLoading] = useState(false);
  const [censusError, setCensusError] = useState(null);

  const industries = [
    'technology', 'healthcare', 'finance', 'energy', 'manufacturing', 
    'agriculture', 'transportation', 'defense', 'real_estate', 'retail'
  ];

  const states = [
    'CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI',
    'NJ', 'VA', 'WA', 'AZ', 'MA', 'TN', 'IN', 'MD', 'CO', 'WI'
  ];

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
      loadDashboardData();
      loadFederalSpending();
      loadAlerts();
      // Fetch Census data for business ZIP or state
      setCensusLoading(true);
      setCensusError(null);
      const fetchCensus = async () => {
        try {
          let data = null;
          if (user.zipCode && user.zipCode.length === 5) {
            const [pop, income] = await Promise.all([
              getZipPopulation(user.zipCode),
              getZipMedianIncome(user.zipCode)
            ]);
            data = {
              name: pop ? pop.name : income ? income.name : null,
              population: pop ? pop.population : null,
              medianIncome: income ? income.medianIncome : null
            };
          } else if (user.state) {
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
    }
  }, [user, selectedIndustry, selectedState]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/business/intelligence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'comprehensive',
          industry: selectedIndustry,
          state: selectedState,
          timeRange: '30d',
          analysisType: 'comprehensive'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIntelligenceData(data.analysis);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAlerts = async () => {
    try {
      const response = await fetch('/api/business/alerts?userId=user_123&status=active');
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.alerts);
      }
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  const loadFederalSpending = async () => {
    try {
      const response = await fetch('/api/business/federal-spending', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          industry: selectedIndustry,
          state: selectedState,
          timeRange: '30d',
          limit: 10
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFederalSpending(data);
      }
    } catch (error) {
      console.error('Error loading federal spending data:', error);
    }
  };

  const getRiskColor = (risk) => {
    if (risk >= 8) return 'text-red-400';
    if (risk >= 5) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getRiskLabel = (risk) => {
    if (risk >= 8) return 'Critical';
    if (risk >= 5) return 'High';
    if (risk >= 3) return 'Medium';
    return 'Low';
  };

  const getTrendIcon = (value) => {
    if (value > 0) return <ArrowUpRight className="w-4 h-4 text-green-400" />;
    if (value < 0) return <ArrowDownRight className="w-4 h-4 text-red-400" />;
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

    return (
    <AppLayout user={user}>
      <div className="px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold terminal-text">Business Intelligence Dashboard</h1>
            <p className="text-gray-400 mt-2">Professional-grade political intelligence for strategic decision making</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-blue-400" />
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="terminal-input border-gray-600 bg-gray-800 text-white px-3 py-2 rounded-md"
              >
                {industries.map(industry => (
                  <option key={industry} value={industry}>
                    {industry.charAt(0).toUpperCase() + industry.slice(1).replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="terminal-input border-gray-600 bg-gray-800 text-white px-3 py-2 rounded-md"
              >
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="terminal-surface border-gray-700 terminal-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Relevant Bills</p>
                  <p className="text-2xl font-bold terminal-text">
                    {intelligenceData?.legislative?.summary?.totalRelevantBills || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                {getTrendIcon(12)}
                <span className="text-sm text-green-400 ml-1">+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="terminal-surface border-gray-700 terminal-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Regulatory Actions</p>
                  <p className="text-2xl font-bold terminal-text">
                    {intelligenceData?.regulatory?.summary?.totalActions || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-red-400" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                {getTrendIcon(-5)}
                <span className="text-sm text-red-400 ml-1">-5% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="terminal-surface border-gray-700 terminal-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Competitors Active</p>
                  <p className="text-2xl font-bold terminal-text">
                    {intelligenceData?.competitive?.summary?.competitors?.length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                {getTrendIcon(3)}
                <span className="text-sm text-yellow-400 ml-1">+3 new this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="terminal-surface border-gray-700 terminal-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Risk Level</p>
                  <p className={`text-2xl font-bold ${getRiskColor(intelligenceData?.riskAssessment?.overallRisk === 'High' ? 8 : 5)}`}>
                    {intelligenceData?.riskAssessment?.overallRisk || 'Medium'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-400">Based on 15+ factors</span>
              </div>
            </CardContent>
          </Card>

          <Card className="terminal-surface border-gray-700 terminal-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Federal Contracts</p>
                  <p className="text-2xl font-bold terminal-text">
                    {federalSpending?.summary?.award_count || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-sm text-green-400">
                  ${(federalSpending?.summary?.total_amount / 1000000).toFixed(1)}M available
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Local Economic Snapshot (Census) */}
        {censusLoading && (
          <div className="text-blue-400 text-sm mt-2">Loading Census data...</div>
        )}
        {censusError && (
          <div className="text-red-400 text-sm mt-2">{censusError}</div>
        )}
        {censusData && (
          <div className="bg-gray-800 border border-blue-700 rounded-lg p-4 mt-4">
            <div className="text-blue-300 font-semibold mb-1">Local Economic Snapshot (Census)</div>
            <div className="text-sm text-gray-200">{censusData.name}</div>
            <div className="text-sm text-gray-200">Population: {censusData.population ? parseInt(censusData.population).toLocaleString() : 'N/A'}</div>
            <div className="text-sm text-gray-200">Median Household Income: {censusData.medianIncome ? `$${parseInt(censusData.medianIncome).toLocaleString()}` : 'N/A'}</div>
          </div>
        )}

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800 border-gray-700">
            <TabsTrigger value="overview" className="terminal-text">Overview</TabsTrigger>
            <TabsTrigger value="legislative" className="terminal-text">Legislative</TabsTrigger>
            <TabsTrigger value="regulatory" className="terminal-text">Regulatory</TabsTrigger>
            <TabsTrigger value="competitive" className="terminal-text">Competitive</TabsTrigger>
            <TabsTrigger value="predictive" className="terminal-text">Predictive</TabsTrigger>
            <TabsTrigger value="alerts" className="terminal-text">Alerts</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Executive Summary */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <BarChart3 className="w-5 h-5" />
                    <span>Executive Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {intelligenceData?.executiveSummary?.keyFindings?.map((finding, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-md">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm terminal-text">{finding}</span>
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-3 bg-gray-800 rounded-md">
                      <p className="text-sm text-gray-400">Risk Level</p>
                      <p className={`text-lg font-bold ${getRiskColor(intelligenceData?.executiveSummary?.riskLevel === 'High' ? 8 : 5)}`}>
                        {intelligenceData?.executiveSummary?.riskLevel || 'Medium'}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-800 rounded-md">
                      <p className="text-sm text-gray-400">Opportunity Level</p>
                      <p className="text-lg font-bold text-green-400">
                        {intelligenceData?.executiveSummary?.opportunityLevel || 'High'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <Activity className="w-5 h-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { type: 'Bill', title: 'Technology Privacy Act', status: 'Introduced', time: '2 hours ago' },
                      { type: 'Regulation', title: 'New EPA Standards', status: 'Proposed', time: '1 day ago' },
                      { type: 'Competitor', title: 'Competitor A Lobbying', status: 'New Registration', time: '3 days ago' },
                      { type: 'Vote', title: 'HR1234 Senate Vote', status: 'Passed', time: '1 week ago' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'Bill' ? 'bg-blue-400' :
                            activity.type === 'Regulation' ? 'bg-red-400' :
                            activity.type === 'Competitor' ? 'bg-yellow-400' : 'bg-green-400'
                          }`} />
                          <div>
                            <p className="text-sm font-medium terminal-text">{activity.title}</p>
                            <p className="text-xs text-gray-400">{activity.status}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card className="terminal-surface border-gray-700 terminal-glow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 terminal-text">
                  <Target className="w-5 h-5" />
                  <span>Strategic Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {intelligenceData?.recommendations?.immediate?.map((rec, index) => (
                    <div key={index} className="p-4 bg-gray-800 rounded-md border-l-4 border-blue-500">
                      <div className="flex items-center space-x-2 mb-2">
                        <Zap className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-400">Immediate</span>
                      </div>
                      <p className="text-sm terminal-text">{rec}</p>
                    </div>
                  ))}
                  {intelligenceData?.recommendations?.strategic?.map((rec, index) => (
                    <div key={index} className="p-4 bg-gray-800 rounded-md border-l-4 border-yellow-500">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-medium text-yellow-400">Strategic</span>
                      </div>
                      <p className="text-sm terminal-text">{rec}</p>
                    </div>
                  ))}
                  {intelligenceData?.recommendations?.longTerm?.map((rec, index) => (
                    <div key={index} className="p-4 bg-gray-800 rounded-md border-l-4 border-green-500">
                      <div className="flex items-center space-x-2 mb-2">
                        <Globe className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium text-green-400">Long Term</span>
                      </div>
                      <p className="text-sm terminal-text">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Federal Spending Opportunities */}
            <Card className="terminal-surface border-gray-700 terminal-glow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 terminal-text">
                  <Award className="w-5 h-5" />
                  <span>Federal Contract Opportunities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {federalSpending ? (
                  <div className="space-y-4">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-3 bg-gray-800 rounded-md">
                        <p className="text-lg font-bold terminal-text">
                          ${(federalSpending.summary?.total_amount / 1000000).toFixed(1)}M
                        </p>
                        <p className="text-xs text-gray-400">Total Available</p>
                      </div>
                      <div className="text-center p-3 bg-gray-800 rounded-md">
                        <p className="text-lg font-bold text-green-400">
                          {federalSpending.summary?.award_count || 0}
                        </p>
                        <p className="text-xs text-gray-400">Contracts</p>
                      </div>
                      <div className="text-center p-3 bg-gray-800 rounded-md">
                        <p className="text-lg font-bold text-blue-400">
                          {federalSpending.insights?.opportunities?.high_opportunity_count || 0}
                        </p>
                        <p className="text-xs text-gray-400">High Opportunity</p>
                      </div>
                      <div className="text-center p-3 bg-gray-800 rounded-md">
                        <p className="text-lg font-bold text-yellow-400">
                          {federalSpending.insights?.competition?.low_competition_awards || 0}
                        </p>
                        <p className="text-xs text-gray-400">Low Competition</p>
                      </div>
                    </div>

                    {/* Top Opportunities */}
                    <div>
                      <h4 className="font-medium terminal-text mb-3">Top Opportunities</h4>
                      <div className="space-y-2">
                        {federalSpending.awards?.slice(0, 3).map((award, index) => (
                          <div key={award.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium terminal-text text-sm truncate">{award.recipient_name}</h5>
                              <p className="text-xs text-gray-400 truncate">{award.description}</p>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <Badge className={`${
                                award.opportunity_score >= 8 ? 'bg-green-600' :
                                award.opportunity_score >= 5 ? 'bg-yellow-600' : 'bg-gray-600'
                              }`}>
                                {award.opportunity_score}/10
                              </Badge>
                              <span className="text-sm font-medium text-green-400">
                                ${(award.amount / 1000000).toFixed(1)}M
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-400">Loading federal spending data...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Legislative Tab */}
          <TabsContent value="legislative" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bill Analysis */}
              <div className="lg:col-span-2">
                <Card className="terminal-surface border-gray-700 terminal-glow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 terminal-text">
                      <FileText className="w-5 h-5" />
                      <span>Relevant Bills</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {intelligenceData?.legislative?.bills?.slice(0, 5).map((bill, index) => (
                        <div key={index} className="p-4 bg-gray-800 rounded-md">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium terminal-text">{bill.title}</h4>
                            <Badge className={`${
                              bill.riskLevel >= 8 ? 'bg-red-600' :
                              bill.riskLevel >= 5 ? 'bg-yellow-600' : 'bg-green-600'
                            }`}>
                              {getRiskLabel(bill.riskLevel)}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Impact Score:</span>
                              <span className="ml-2 terminal-text">{bill.impactScore}/10</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Probability:</span>
                              <span className="ml-2 terminal-text">{(bill.probability * 100).toFixed(0)}%</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Timeline:</span>
                              <span className="ml-2 terminal-text">{bill.timeline}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Status:</span>
                              <span className="ml-2 terminal-text">{bill.billId}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Legislative Metrics */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <ChartLine className="w-5 h-5" />
                    <span>Legislative Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-gray-800 rounded-md">
                    <p className="text-2xl font-bold terminal-text">
                      {intelligenceData?.legislative?.summary?.totalRelevantBills || 0}
                    </p>
                    <p className="text-sm text-gray-400">Relevant Bills</p>
                  </div>
                  <div className="text-center p-4 bg-gray-800 rounded-md">
                    <p className="text-2xl font-bold text-red-400">
                      {intelligenceData?.legislative?.summary?.highRiskBills || 0}
                    </p>
                    <p className="text-sm text-gray-400">High Risk Bills</p>
                  </div>
                  <div className="text-center p-4 bg-gray-800 rounded-md">
                    <p className="text-2xl font-bold terminal-text">
                      {(intelligenceData?.legislative?.summary?.averageImpactScore || 0).toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-400">Avg Impact Score</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Regulatory Tab */}
          <TabsContent value="regulatory" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Regulatory Actions */}
              <div className="lg:col-span-2">
                <Card className="terminal-surface border-gray-700 terminal-glow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 terminal-text">
                      <Shield className="w-5 h-5" />
                      <span>Regulatory Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {intelligenceData?.regulatory?.actions?.slice(0, 5).map((action, index) => (
                        <div key={index} className="p-4 bg-gray-800 rounded-md">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium terminal-text">{action.title}</h4>
                            <Badge className={`${
                              action.riskScore >= 8 ? 'bg-red-600' :
                              action.riskScore >= 5 ? 'bg-yellow-600' : 'bg-green-600'
                            }`}>
                              {getRiskLabel(action.riskScore)}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Agency:</span>
                              <span className="ml-2 terminal-text">{action.agency}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Compliance Cost:</span>
                              <span className="ml-2 terminal-text">${action.complianceCost.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Timeline:</span>
                              <span className="ml-2 terminal-text">{action.timeline}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Impact:</span>
                              <span className="ml-2 terminal-text">{action.impact}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Compliance Timeline */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <Calendar className="w-5 h-5" />
                    <span>Compliance Timeline</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { action: 'EPA Standards', deadline: '2024-03-15', status: 'Pending' },
                      { action: 'FDA Requirements', deadline: '2024-04-01', status: 'In Progress' },
                      { action: 'OSHA Updates', deadline: '2024-05-20', status: 'Completed' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
                        <div>
                          <p className="text-sm font-medium terminal-text">{item.action}</p>
                          <p className="text-xs text-gray-400">{item.deadline}</p>
                        </div>
                        <Badge className={
                          item.status === 'Completed' ? 'bg-green-600' :
                          item.status === 'In Progress' ? 'bg-yellow-600' : 'bg-gray-600'
                        }>
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Competitive Tab */}
          <TabsContent value="competitive" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Competitor Activity */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <Users className="w-5 h-5" />
                    <span>Competitor Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {intelligenceData?.competitive?.competitors?.map((competitor, index) => (
                      <div key={index} className="p-4 bg-gray-800 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium terminal-text">{competitor.name}</h4>
                          <Badge className={`${
                            competitor.influenceScore >= 8 ? 'bg-red-600' :
                            competitor.influenceScore >= 5 ? 'bg-yellow-600' : 'bg-green-600'
                          }`}>
                            Influence: {competitor.influenceScore}/10
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Lobbying Spend:</span>
                            <span className="ml-2 terminal-text">${competitor.lobbyingSpend.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Key Issues:</span>
                            <span className="ml-2 terminal-text">{competitor.keyIssues.join(', ')}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{competitor.recentActivity}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Market Position */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <Target className="w-5 h-5" />
                    <span>Market Position</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gray-800 rounded-md">
                      <p className="text-2xl font-bold terminal-text">
                        ${intelligenceData?.competitive?.summary?.totalLobbyingSpend?.toLocaleString() || 0}
                      </p>
                      <p className="text-sm text-gray-400">Total Market Lobbying</p>
                    </div>
                    <div className="text-center p-4 bg-gray-800 rounded-md">
                      <p className="text-2xl font-bold terminal-text">
                        {(intelligenceData?.competitive?.summary?.averageInfluenceScore || 0).toFixed(1)}
                      </p>
                      <p className="text-sm text-gray-400">Avg Influence Score</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-md">
                      <h4 className="font-medium terminal-text mb-2">Key Issues</h4>
                      <div className="flex flex-wrap gap-2">
                        {intelligenceData?.competitive?.summary?.keyIssues?.map((issue, index) => (
                          <Badge key={index} className="bg-blue-600">{issue}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Predictive Tab */}
          <TabsContent value="predictive" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Predictions */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <TrendingUp className="w-5 h-5" />
                    <span>Predictive Analytics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(intelligenceData?.predictive?.predictions || {}).map(([key, prediction]) => (
                      <div key={key} className="p-4 bg-gray-800 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium terminal-text capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          <Badge className="bg-blue-600">
                            {(prediction.probability * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-400">
                          <p>Timeline: {prediction.timeline}</p>
                          <p>Key Factors: {prediction.keyFactors.join(', ')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Confidence Scores */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <PieChart className="w-5 h-5" />
                    <span>Confidence Scores</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(intelligenceData?.predictive?.confidenceScores || {}).map(([key, score]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
                        <span className="text-sm terminal-text capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${score * 100}%` }}
                            />
                          </div>
                          <span className="text-sm terminal-text">{(score * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Alerts */}
              <div className="lg:col-span-2">
                <Card className="terminal-surface border-gray-700 terminal-glow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 terminal-text">
                      <Bell className="w-5 h-5" />
                      <span>Active Alerts</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {alerts.map((alert) => (
                        <div key={alert.id} className="p-4 bg-gray-800 rounded-md">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium terminal-text capitalize">
                              {alert.alertType.replace(/_/g, ' ')}
                            </h4>
                            <Badge className={`${
                              alert.priority === 'critical' ? 'bg-red-600' :
                              alert.priority === 'high' ? 'bg-yellow-600' : 'bg-green-600'
                            }`}>
                              {alert.priority}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Frequency:</span>
                              <span className="ml-2 terminal-text">{alert.frequency}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Triggers:</span>
                              <span className="ml-2 terminal-text">{alert.triggerCount}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Channels:</span>
                              <span className="ml-2 terminal-text">{alert.channels.join(', ')}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Last Triggered:</span>
                              <span className="ml-2 terminal-text">
                                {alert.lastTriggered ? new Date(alert.lastTriggered).toLocaleDateString() : 'Never'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Alert Statistics */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <BarChart3 className="w-5 h-5" />
                    <span>Alert Statistics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gray-800 rounded-md">
                      <p className="text-2xl font-bold terminal-text">{alerts.length}</p>
                      <p className="text-sm text-gray-400">Active Alerts</p>
                    </div>
                    <div className="text-center p-4 bg-gray-800 rounded-md">
                      <p className="text-2xl font-bold text-red-400">
                        {alerts.filter(a => a.priority === 'critical').length}
                      </p>
                      <p className="text-sm text-gray-400">Critical Alerts</p>
                    </div>
                    <div className="text-center p-4 bg-gray-800 rounded-md">
                      <p className="text-2xl font-bold terminal-text">
                        {alerts.reduce((sum, alert) => sum + alert.triggerCount, 0)}
                      </p>
                      <p className="text-sm text-gray-400">Total Triggers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </AppLayout>
  );
} 