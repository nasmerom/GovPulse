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
  ChartLine,
  PieChart,
  Calendar,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  FileText,
  RefreshCw,
  Brain,
  Target as TargetIcon,
  Gauge,
  TrendingUp as TrendingUpIcon,
  AlertCircle,
  Star,
  Award,
  Crown,
  Rocket,
  Lightbulb,
  Briefcase,
  Network,
  Database,
  Cpu,
  Wifi,
  Lock,
  Unlock,
  Key,
  Scale,
  Balance,
  Calculator,
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

export default function MarketIntelligence() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [marketData, setMarketData] = useState(null);
  const [federalSpending, setFederalSpending] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState('technology');
  const [selectedState, setSelectedState] = useState('CA');
  const [timeRange, setTimeRange] = useState('30d');

  const industries = [
    'technology', 'healthcare', 'finance', 'energy', 'manufacturing', 
    'agriculture', 'transportation', 'defense', 'real_estate', 'retail'
  ];

  const states = [
    'CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI',
    'NJ', 'VA', 'WA', 'AZ', 'MA', 'TN', 'IN', 'MD', 'CO', 'WI'
  ];

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
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
      loadMarketData();
      loadFederalSpending();
    }
  }, [user, selectedIndustry, selectedState, timeRange]);

  const loadMarketData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/business/market-intelligence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'comprehensive',
          industry: selectedIndustry,
          state: selectedState,
          timeRange: timeRange,
          analysisType: 'comprehensive'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMarketData(data.marketIntelligence);
      }
    } catch (error) {
      console.error('Error loading market data:', error);
    } finally {
      setIsLoading(false);
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
          timeRange: timeRange,
          limit: 20
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
            <h1 className="text-3xl font-bold terminal-text">Market Intelligence</h1>
            <p className="text-gray-400 mt-2">Comprehensive market analysis and competitive landscape insights</p>
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
              <MapPin className="w-5 h-4 text-blue-400" />
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
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="terminal-input border-gray-600 bg-gray-800 text-white px-3 py-2 rounded-md"
              >
                {timeRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>
            <Button onClick={loadMarketData} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Market Overview */}
        <Card className="terminal-surface border-blue-700 terminal-glow">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold terminal-text mb-2">
                  {selectedIndustry.charAt(0).toUpperCase() + selectedIndustry.slice(1).replace('_', ' ')} Industry
                </h2>
                <p className="text-gray-400">Market Intelligence Overview</p>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-400 mb-2">
                  ${(marketData?.summary?.marketSize / 1000000000).toFixed(1)}B
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">
                    {(marketData?.summary?.growthRate * 100).toFixed(1)}% Growth
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-gray-800 border-gray-700">
            <TabsTrigger value="overview" className="terminal-text">Overview</TabsTrigger>
            <TabsTrigger value="industry" className="terminal-text">Industry</TabsTrigger>
            <TabsTrigger value="trends" className="terminal-text">Trends</TabsTrigger>
            <TabsTrigger value="competitive" className="terminal-text">Competitive</TabsTrigger>
            <TabsTrigger value="opportunities" className="terminal-text">Opportunities</TabsTrigger>
            <TabsTrigger value="federal" className="terminal-text">Federal</TabsTrigger>
            <TabsTrigger value="forecast" className="terminal-text">Forecast</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Market Metrics */}
              <div className="lg:col-span-2">
                <Card className="terminal-surface border-gray-700 terminal-glow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 terminal-text">
                      <BarChart3 className="w-5 h-5" />
                      <span>Market Metrics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-800 rounded-md">
                        <p className="text-2xl font-bold terminal-text">
                          ${(marketData?.summary?.marketSize / 1000000000).toFixed(1)}B
                        </p>
                        <p className="text-sm text-gray-400">Market Size</p>
                      </div>
                      <div className="text-center p-4 bg-gray-800 rounded-md">
                        <p className="text-2xl font-bold text-green-400">
                          {(marketData?.summary?.growthRate * 100).toFixed(1)}%
                        </p>
                        <p className="text-sm text-gray-400">Growth Rate</p>
                      </div>
                      <div className="text-center p-4 bg-gray-800 rounded-md">
                        <p className="text-2xl font-bold terminal-text">
                          {marketData?.summary?.marketMaturity || 'Growing'}
                        </p>
                        <p className="text-sm text-gray-400">Maturity</p>
                      </div>
                      <div className="text-center p-4 bg-gray-800 rounded-md">
                        <p className="text-2xl font-bold text-yellow-400">
                          {marketData?.summary?.competitiveIntensity || 'High'}
                        </p>
                        <p className="text-sm text-gray-400">Competition</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Key Insights */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <Lightbulb className="w-5 h-5" />
                    <span>Key Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {marketData?.summary?.keyInsights?.slice(0, 4).map((insight, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 bg-gray-800 rounded-md">
                        <Brain className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <span className="text-sm terminal-text">{insight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Strategic Recommendations */}
            <Card className="terminal-surface border-gray-700 terminal-glow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 terminal-text">
                  <Target className="w-5 h-5" />
                  <span>Strategic Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {marketData?.strategicRecommendations?.slice(0, 3).map((rec, index) => (
                    <div key={index} className="p-4 bg-gray-800 rounded-md border-l-4 border-blue-500">
                      <div className="flex items-center space-x-2 mb-2">
                        <Rocket className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-400">Strategic</span>
                      </div>
                      <p className="text-sm terminal-text">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Industry Tab */}
          <TabsContent value="industry" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Market Overview */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <Building className="w-5 h-5" />
                    <span>Market Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium terminal-text mb-2">Key Drivers</h4>
                      <div className="space-y-2">
                        {marketData?.industryAnalysis?.marketOverview?.keyDrivers?.map((driver, index) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-gray-800 rounded-md">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <span className="text-sm terminal-text">{driver}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium terminal-text mb-2">Key Challenges</h4>
                      <div className="space-y-2">
                        {marketData?.industryAnalysis?.marketOverview?.keyChallenges?.map((challenge, index) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-gray-800 rounded-md">
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm terminal-text">{challenge}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Market Segments */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <PieChart className="w-5 h-5" />
                    <span>Market Segments</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {marketData?.industryAnalysis?.marketSegments?.map((segment, index) => (
                      <div key={index} className="p-3 bg-gray-800 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium terminal-text">{segment.name}</h4>
                          <Badge className={`${
                            segment.competitiveIntensity === 'Very High' ? 'bg-red-600' :
                            segment.competitiveIntensity === 'High' ? 'bg-yellow-600' : 'bg-green-600'
                          }`}>
                            {segment.competitiveIntensity}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-400">Size:</span>
                            <span className="ml-2 terminal-text">${(segment.size / 1000000000).toFixed(1)}B</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Growth:</span>
                            <span className="ml-2 terminal-text">{(segment.growthRate * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Market Trends */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <TrendingUpIcon className="w-5 h-5" />
                    <span>Market Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-800 rounded-md">
                      <h4 className="font-medium terminal-text mb-2">Growth Trends</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Current Growth</span>
                        <span className="text-sm terminal-text">
                          {(marketData?.marketTrends?.growthTrends?.current * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Forecast</span>
                        <span className="text-sm terminal-text">
                          {(marketData?.marketTrends?.growthTrends?.forecast * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-md">
                      <h4 className="font-medium terminal-text mb-2">Innovation Trends</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Pace</span>
                        <span className="text-sm terminal-text">
                          {marketData?.marketTrends?.innovationTrends?.pace}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Investment</span>
                        <span className="text-sm terminal-text">
                          ${(marketData?.marketTrends?.innovationTrends?.investment / 1000000000).toFixed(1)}B
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Regulatory Trends */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <Shield className="w-5 h-5" />
                    <span>Regulatory Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-800 rounded-md">
                      <h4 className="font-medium terminal-text mb-2">Regulatory Environment</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Intensity</span>
                        <Badge className={`${
                          marketData?.marketTrends?.regulatoryTrends?.intensity === 'Very High' ? 'bg-red-600' :
                          marketData?.marketTrends?.regulatoryTrends?.intensity === 'High' ? 'bg-yellow-600' : 'bg-green-600'
                        }`}>
                          {marketData?.marketTrends?.regulatoryTrends?.intensity}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Trend</span>
                        <span className="text-sm terminal-text">
                          {marketData?.marketTrends?.regulatoryTrends?.trend}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-md">
                      <h4 className="font-medium terminal-text mb-2">Focus Areas</h4>
                      <div className="space-y-1">
                        {marketData?.marketTrends?.regulatoryTrends?.focus?.map((focus, index) => (
                          <div key={index} className="text-sm text-gray-400">• {focus}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Competitive Tab */}
          <TabsContent value="competitive" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Market Leaders */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <Crown className="w-5 h-5" />
                    <span>Market Leaders</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketData?.competitiveLandscape?.marketLeaders?.map((leader, index) => (
                      <div key={index} className="p-4 bg-gray-800 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium terminal-text">{leader.name}</h4>
                          <Badge className="bg-blue-600">
                            {(leader.marketShare * 100).toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-400">Revenue:</span>
                            <span className="ml-2 terminal-text">${(leader.revenue / 1000000000).toFixed(1)}B</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Employees:</span>
                            <span className="ml-2 terminal-text">{leader.employees.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Competitive Position */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <Target className="w-5 h-5" />
                    <span>Competitive Position</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gray-800 rounded-md">
                      <p className="text-3xl font-bold terminal-text">
                        {((marketData?.competitiveLandscape?.summary?.competitivePosition || 0) * 100).toFixed(0)}%
                      </p>
                      <p className="text-sm text-gray-400">Competitive Position</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-md">
                      <h4 className="font-medium terminal-text mb-2">Relative Strengths</h4>
                      <div className="space-y-1">
                        {marketData?.competitiveLandscape?.summary?.relativeStrengths?.map((strength, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-sm terminal-text">{strength}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Market Opportunities */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <Rocket className="w-5 h-5" />
                    <span>Market Opportunities</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketData?.marketOpportunities?.opportunities?.map((opportunity, index) => (
                      <div key={index} className="p-4 bg-gray-800 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium terminal-text">{opportunity.name}</h4>
                          <Badge className="bg-green-600">
                            {(opportunity.probability * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-400">Size:</span>
                            <span className="ml-2 terminal-text">${(opportunity.size / 1000000000).toFixed(1)}B</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Timeline:</span>
                            <span className="ml-2 terminal-text">{opportunity.timeline}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">{opportunity.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Opportunity Summary */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <Target className="w-5 h-5" />
                    <span>Opportunity Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gray-800 rounded-md">
                      <p className="text-3xl font-bold text-green-400">
                        ${(marketData?.marketOpportunities?.summary?.totalOpportunity / 1000000000).toFixed(1)}B
                      </p>
                      <p className="text-sm text-gray-400">Total Opportunity</p>
                    </div>
                    <div className="text-center p-4 bg-gray-800 rounded-md">
                      <p className="text-2xl font-bold terminal-text">
                        {(marketData?.marketOpportunities?.summary?.averageGrowthRate * 100).toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-400">Average Growth Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Federal Spending Tab */}
          <TabsContent value="federal" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Federal Spending Overview */}
              <div className="lg:col-span-2">
                <Card className="terminal-surface border-gray-700 terminal-glow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 terminal-text">
                      <DollarSign className="w-5 h-5" />
                      <span>Federal Contract Opportunities</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {federalSpending ? (
                      <div className="space-y-4">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="text-center p-4 bg-gray-800 rounded-md">
                            <p className="text-2xl font-bold terminal-text">
                              ${(federalSpending.summary?.total_amount / 1000000).toFixed(1)}M
                            </p>
                            <p className="text-sm text-gray-400">Total Spending</p>
                          </div>
                          <div className="text-center p-4 bg-gray-800 rounded-md">
                            <p className="text-2xl font-bold text-green-400">
                              {federalSpending.summary?.award_count || 0}
                            </p>
                            <p className="text-sm text-gray-400">Contracts</p>
                          </div>
                          <div className="text-center p-4 bg-gray-800 rounded-md">
                            <p className="text-2xl font-bold text-blue-400">
                              {federalSpending.insights?.opportunities?.high_opportunity_count || 0}
                            </p>
                            <p className="text-sm text-gray-400">High Opportunity</p>
                          </div>
                          <div className="text-center p-4 bg-gray-800 rounded-md">
                            <p className="text-2xl font-bold text-yellow-400">
                              {federalSpending.insights?.competition?.low_competition_awards || 0}
                            </p>
                            <p className="text-sm text-gray-400">Low Competition</p>
                          </div>
                        </div>

                        {/* Top Opportunities */}
                        <div>
                          <h4 className="font-medium terminal-text mb-3">Top Contract Opportunities</h4>
                          <div className="space-y-3">
                            {federalSpending.awards?.slice(0, 5).map((award, index) => (
                              <div key={award.id} className="p-4 bg-gray-800 rounded-md">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-medium terminal-text">{award.recipient_name}</h5>
                                  <div className="flex items-center space-x-2">
                                    <Badge className={`${
                                      award.opportunity_score >= 8 ? 'bg-green-600' :
                                      award.opportunity_score >= 5 ? 'bg-yellow-600' : 'bg-gray-600'
                                    }`}>
                                      {award.opportunity_score}/10
                                    </Badge>
                                    <Badge className="bg-blue-600">
                                      ${(award.amount / 1000000).toFixed(1)}M
                                    </Badge>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-400 mb-2">{award.description}</p>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-400">{award.awarding_agency}</span>
                                  <span className="text-gray-400">{award.contract_type}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-400">Loading federal spending data...</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Business Insights */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <Brain className="w-5 h-5" />
                    <span>Business Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {federalSpending?.insights ? (
                    <div className="space-y-4">
                      {/* Market Trends */}
                      <div className="p-4 bg-gray-800 rounded-md">
                        <h4 className="font-medium terminal-text mb-2">Market Trends</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Growing</span>
                            <span className="text-sm terminal-text">{federalSpending.insights.trends.growing_market}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Stable</span>
                            <span className="text-sm terminal-text">{federalSpending.insights.trends.stable_market}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Declining</span>
                            <span className="text-sm terminal-text">{federalSpending.insights.trends.declining_market}</span>
                          </div>
                        </div>
                      </div>

                      {/* Competition Analysis */}
                      <div className="p-4 bg-gray-800 rounded-md">
                        <h4 className="font-medium terminal-text mb-2">Competition Level</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Low</span>
                            <span className="text-sm terminal-text">{federalSpending.insights.competition.low_competition_awards}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Medium</span>
                            <span className="text-sm terminal-text">{federalSpending.insights.competition.medium_competition_awards}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">High</span>
                            <span className="text-sm terminal-text">{federalSpending.insights.competition.high_competition_awards}</span>
                          </div>
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="p-4 bg-gray-800 rounded-md">
                        <h4 className="font-medium terminal-text mb-2">Recommendations</h4>
                        <div className="space-y-2">
                          {federalSpending.insights.recommendations?.map((rec, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                rec.priority === 'high' ? 'bg-red-400' :
                                rec.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                              }`} />
                              <div>
                                <p className="text-sm font-medium terminal-text">{rec.title}</p>
                                <p className="text-xs text-gray-400">{rec.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-400">Loading insights...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Forecast Tab */}
          <TabsContent value="forecast" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Short Term Forecast */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <Clock className="w-5 h-5" />
                    <span>Short Term</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gray-800 rounded-md">
                      <p className="text-2xl font-bold terminal-text">
                        {(marketData?.marketForecast?.forecasts?.shortTerm?.growth * 100).toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-400">Growth Forecast</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-md">
                      <h4 className="font-medium terminal-text mb-2">Key Drivers</h4>
                      <div className="space-y-1">
                        {marketData?.marketForecast?.forecasts?.shortTerm?.keyDrivers?.map((driver, index) => (
                          <div key={index} className="text-sm text-gray-400">• {driver}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Medium Term Forecast */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <Calendar className="w-5 h-5" />
                    <span>Medium Term</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gray-800 rounded-md">
                      <p className="text-2xl font-bold terminal-text">
                        {(marketData?.marketForecast?.forecasts?.mediumTerm?.growth * 100).toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-400">Growth Forecast</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-md">
                      <h4 className="font-medium terminal-text mb-2">Key Drivers</h4>
                      <div className="space-y-1">
                        {marketData?.marketForecast?.forecasts?.mediumTerm?.keyDrivers?.map((driver, index) => (
                          <div key={index} className="text-sm text-gray-400">• {driver}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Long Term Forecast */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <Globe className="w-5 h-5" />
                    <span>Long Term</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gray-800 rounded-md">
                      <p className="text-2xl font-bold terminal-text">
                        {(marketData?.marketForecast?.forecasts?.longTerm?.growth * 100).toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-400">Growth Forecast</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-md">
                      <h4 className="font-medium terminal-text mb-2">Key Drivers</h4>
                      <div className="space-y-1">
                        {marketData?.marketForecast?.forecasts?.longTerm?.keyDrivers?.map((driver, index) => (
                          <div key={index} className="text-sm text-gray-400">• {driver}</div>
                        ))}
                      </div>
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