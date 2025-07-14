import { useState, useEffect } from 'react';
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

export default function BusinessIntelligence() {
  const [activeTab, setActiveTab] = useState('overview');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
    loadAnalyticsData();
  }, [selectedIndustry, selectedState, timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/business/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'comprehensive',
          industry: selectedIndustry,
          state: selectedState,
          timeRange: timeRange,
          metrics: 'all'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data.analytics);
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="w-full min-h-screen political-terminal p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen political-terminal p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold terminal-text">Business Intelligence Platform</h1>
            <p className="text-gray-400 mt-2">Professional-grade political intelligence and strategic analytics</p>
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
            <Button onClick={loadAnalyticsData} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Intelligence Score */}
        <Card className="terminal-surface border-blue-700 terminal-glow">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold terminal-text mb-2">Intelligence Score</h2>
                <p className="text-gray-400">Comprehensive assessment of your political intelligence capabilities</p>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-400 mb-2">
                  {analyticsData?.summary?.overallScore?.toFixed(1) || '8.5'}
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">Professional Grade</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-gray-800 border-gray-700">
            <TabsTrigger value="overview" className="terminal-text">Overview</TabsTrigger>
            <TabsTrigger value="performance" className="terminal-text">Performance</TabsTrigger>
            <TabsTrigger value="trends" className="terminal-text">Trends</TabsTrigger>
            <TabsTrigger value="competitive" className="terminal-text">Competitive</TabsTrigger>
            <TabsTrigger value="risk" className="terminal-text">Risk</TabsTrigger>
            <TabsTrigger value="opportunity" className="terminal-text">Opportunity</TabsTrigger>
            <TabsTrigger value="predictive" className="terminal-text">Predictive</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Key Insights */}
              <div className="lg:col-span-2">
                <Card className="terminal-surface border-gray-700 terminal-glow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 terminal-text">
                      <Lightbulb className="w-5 h-5" />
                      <span>Key Insights</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analyticsData?.summary?.keyInsights?.map((insight, index) => (
                      <div key={index} className="flex items-center space-x-3 p-4 bg-gray-800 rounded-md">
                        <Brain className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <span className="terminal-text">{insight}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Strategic Recommendations */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <TargetIcon className="w-5 h-5" />
                    <span>Strategic Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData?.summary?.strategicRecommendations?.map((rec, index) => (
                      <div key={index} className="p-3 bg-gray-800 rounded-md border-l-4 border-blue-500">
                        <p className="text-sm terminal-text">{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Legislative Success</p>
                      <p className="text-2xl font-bold terminal-text">
                        {((analyticsData?.performance?.metrics?.legislative?.successRate || 0) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(0.12)}
                    <span className="text-sm text-green-400 ml-1">+12% from last period</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Regulatory Compliance</p>
                      <p className="text-2xl font-bold terminal-text">
                        {((analyticsData?.performance?.metrics?.regulatory?.complianceRate || 0) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(0.05)}
                    <span className="text-sm text-green-400 ml-1">+5% from last period</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Competitive Position</p>
                      <p className="text-2xl font-bold terminal-text">
                        {((analyticsData?.competitive?.summary?.competitivePosition || 0) * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(0.08)}
                    <span className="text-sm text-green-400 ml-1">+8% from last period</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">ROI</p>
                      <p className="text-2xl font-bold terminal-text">
                        {(analyticsData?.performance?.metrics?.financial?.roi || 0).toFixed(1)}x
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(0.15)}
                    <span className="text-sm text-green-400 ml-1">+15% from last period</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Performance Details */}
              <div className="lg:col-span-2">
                <Card className="terminal-surface border-gray-700 terminal-glow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 terminal-text">
                      <Gauge className="w-5 h-5" />
                      <span>Performance Metrics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Legislative Performance */}
                      <div className="p-4 bg-gray-800 rounded-md">
                        <h4 className="font-medium terminal-text mb-3">Legislative Performance</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-400">Bills Tracked</p>
                            <p className="text-lg font-bold terminal-text">
                              {analyticsData?.performance?.metrics?.legislative?.billsTracked || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Success Rate</p>
                            <p className="text-lg font-bold terminal-text">
                              {((analyticsData?.performance?.metrics?.legislative?.successRate || 0) * 100).toFixed(1)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Processing Time</p>
                            <p className="text-lg font-bold terminal-text">
                              {analyticsData?.performance?.metrics?.legislative?.averageProcessingTime || 0} days
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Influence Score</p>
                            <p className="text-lg font-bold terminal-text">
                              {analyticsData?.performance?.metrics?.legislative?.influenceScore?.toFixed(1) || 0}/10
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Regulatory Performance */}
                      <div className="p-4 bg-gray-800 rounded-md">
                        <h4 className="font-medium terminal-text mb-3">Regulatory Performance</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-400">Actions Tracked</p>
                            <p className="text-lg font-bold terminal-text">
                              {analyticsData?.performance?.metrics?.regulatory?.actionsTracked || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Compliance Rate</p>
                            <p className="text-lg font-bold terminal-text">
                              {((analyticsData?.performance?.metrics?.regulatory?.complianceRate || 0) * 100).toFixed(1)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Response Time</p>
                            <p className="text-lg font-bold terminal-text">
                              {analyticsData?.performance?.metrics?.regulatory?.averageResponseTime || 0} days
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Cost Savings</p>
                            <p className="text-lg font-bold terminal-text">
                              ${(analyticsData?.performance?.metrics?.regulatory?.costSavings || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Financial Performance */}
                      <div className="p-4 bg-gray-800 rounded-md">
                        <h4 className="font-medium terminal-text mb-3">Financial Performance</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-400">Lobbying Efficiency</p>
                            <p className="text-lg font-bold terminal-text">
                              {((analyticsData?.performance?.metrics?.financial?.lobbyingEfficiency || 0) * 100).toFixed(1)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">ROI</p>
                            <p className="text-lg font-bold terminal-text">
                              {(analyticsData?.performance?.metrics?.financial?.roi || 0).toFixed(1)}x
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Cost per Action</p>
                            <p className="text-lg font-bold terminal-text">
                              ${(analyticsData?.performance?.metrics?.financial?.costPerAction || 0).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Budget Utilization</p>
                            <p className="text-lg font-bold terminal-text">
                              {((analyticsData?.performance?.metrics?.financial?.budgetUtilization || 0) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Summary */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <BarChart3 className="w-5 h-5" />
                    <span>Performance Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-gray-800 rounded-md">
                    <p className="text-3xl font-bold terminal-text">
                      {analyticsData?.performance?.summary?.overallScore?.toFixed(1) || '8.5'}
                    </p>
                    <p className="text-sm text-gray-400">Overall Score</p>
                  </div>
                  <div className="text-center p-4 bg-gray-800 rounded-md">
                    <p className="text-2xl font-bold text-green-400">
                      {analyticsData?.performance?.summary?.topPerformingArea?.name || 'Legislative'}
                    </p>
                    <p className="text-sm text-gray-400">Top Performing Area</p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-md">
                    <h4 className="font-medium terminal-text mb-2">Improvement Areas</h4>
                    <div className="space-y-2">
                      {analyticsData?.performance?.summary?.improvementAreas?.map((area, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm terminal-text">{area.name}</span>
                          <span className="text-sm text-red-400">{area.score.toFixed(1)}/10</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Trend Analysis */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <TrendingUpIcon className="w-5 h-5" />
                    <span>Trend Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData?.trends?.summary?.keyTrends?.map((trend, index) => (
                      <div key={index} className="p-4 bg-gray-800 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium terminal-text">{trend.area}</h4>
                          <Badge className={
                            trend.trend === 'Improving' ? 'bg-green-600' : 'bg-red-600'
                          }>
                            {trend.trend}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-400">
                          <p>Magnitude: {(trend.magnitude * 100).toFixed(1)}%</p>
                          <p>Impact: {trend.impact}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Trend Direction */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <ChartLine className="w-5 h-5" />
                    <span>Trend Direction</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analyticsData?.trends?.summary?.trendDirection || {}).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
                        <span className="text-sm terminal-text capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(value)}
                          <span className={`text-sm ${value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                            {value > 0 ? 'Positive' : value < 0 ? 'Negative' : 'Neutral'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Forecasting */}
            <Card className="terminal-surface border-gray-700 terminal-glow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 terminal-text">
                  <CrystalBall className="w-5 h-5" />
                  <span>Forecasting</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-gray-800 rounded-md">
                    <h4 className="font-medium terminal-text mb-2">Short Term</h4>
                    <p className="text-sm text-gray-400">{analyticsData?.trends?.summary?.forecasting?.shortTerm || 'Continued regulatory pressure with moderate legislative activity'}</p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-md">
                    <h4 className="font-medium terminal-text mb-2">Medium Term</h4>
                    <p className="text-sm text-gray-400">{analyticsData?.trends?.summary?.forecasting?.mediumTerm || 'Increased competitive intensity driving innovation in government relations'}</p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-md">
                    <h4 className="font-medium terminal-text mb-2">Long Term</h4>
                    <p className="text-sm text-gray-400">{analyticsData?.trends?.summary?.forecasting?.longTerm || 'Industry consolidation leading to more sophisticated advocacy strategies'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Competitive Tab */}
          <TabsContent value="competitive" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Competitor Analysis */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <Users className="w-5 h-5" />
                    <span>Competitor Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData?.competitive?.competitors?.map((competitor, index) => (
                      <div key={index} className="p-4 bg-gray-800 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium terminal-text">{competitor.name}</h4>
                          <Badge className={`${
                            competitor.influenceScore >= 8 ? 'bg-red-600' :
                            competitor.influenceScore >= 6 ? 'bg-yellow-600' : 'bg-green-600'
                          }`}>
                            {competitor.influenceScore}/10
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Market Share:</span>
                            <span className="ml-2 terminal-text">{(competitor.marketShare * 100).toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Lobbying Spend:</span>
                            <span className="ml-2 terminal-text">${competitor.lobbyingSpend.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Response Time:</span>
                            <span className="ml-2 terminal-text">{competitor.responseTime}h</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Success Rate:</span>
                            <span className="ml-2 terminal-text">{(competitor.successRate * 100).toFixed(1)}%</span>
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
                        {((analyticsData?.competitive?.summary?.competitivePosition || 0) * 100).toFixed(0)}%
                      </p>
                      <p className="text-sm text-gray-400">Competitive Position</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-md">
                      <h4 className="font-medium terminal-text mb-2">Relative Strengths</h4>
                      <div className="space-y-1">
                        {analyticsData?.competitive?.summary?.relativeStrengths?.map((strength, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-sm terminal-text">{strength}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-md">
                      <h4 className="font-medium terminal-text mb-2">Relative Weaknesses</h4>
                      <div className="space-y-1">
                        {analyticsData?.competitive?.summary?.relativeWeaknesses?.map((weakness, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-red-400" />
                            <span className="text-sm terminal-text">{weakness}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Risk Tab */}
          <TabsContent value="risk" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Assessment */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Risk Assessment</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData?.risk?.summary?.topRisks?.map((risk, index) => (
                      <div key={index} className="p-4 bg-gray-800 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium terminal-text">{risk.name}</h4>
                          <Badge className={`${
                            risk.score >= 8 ? 'bg-red-600' :
                            risk.score >= 5 ? 'bg-yellow-600' : 'bg-green-600'
                          }`}>
                            {risk.score.toFixed(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">Risk level: {getRiskLabel(risk.score)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Risk Summary */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <Shield className="w-5 h-5" />
                    <span>Risk Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gray-800 rounded-md">
                      <p className={`text-3xl font-bold ${getRiskColor(analyticsData?.risk?.summary?.overallRisk || 5)}`}>
                        {analyticsData?.risk?.summary?.riskLevel || 'Medium'}
                      </p>
                      <p className="text-sm text-gray-400">Overall Risk Level</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-md">
                      <h4 className="font-medium terminal-text mb-2">Risk Mitigation</h4>
                      <div className="space-y-2">
                        {analyticsData?.risk?.mitigation?.legislative?.slice(0, 2).map((strategy, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-blue-400" />
                            <span className="text-sm terminal-text">{strategy}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Opportunity Tab */}
          <TabsContent value="opportunity" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Opportunity Analysis */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <Rocket className="w-5 h-5" />
                    <span>Opportunity Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData?.opportunity?.summary?.topOpportunities?.map((opp, index) => (
                      <div key={index} className="p-4 bg-gray-800 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium terminal-text">{opp.name}</h4>
                          <Badge className="bg-green-600">
                            {opp.score.toFixed(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">High potential opportunity</p>
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
                        {analyticsData?.opportunity?.summary?.opportunityLevel || 'High'}
                      </p>
                      <p className="text-sm text-gray-400">Opportunity Level</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-md">
                      <h4 className="font-medium terminal-text mb-2">Strategy</h4>
                      <div className="space-y-2">
                        {analyticsData?.opportunity?.strategy?.legislative?.slice(0, 2).map((strategy, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Rocket className="w-4 h-4 text-green-400" />
                            <span className="text-sm terminal-text">{strategy}</span>
                          </div>
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
              {/* Predictive Models */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 terminal-text">
                    <Brain className="w-5 h-5" />
                    <span>Predictive Models</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analyticsData?.predictive?.predictions || {}).map(([key, prediction]) => (
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
                    <Gauge className="w-5 h-5" />
                    <span>Confidence Scores</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analyticsData?.predictive?.confidenceScores || {}).map(([key, score]) => (
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
        </Tabs>
      </div>
    </div>
  );
}

// Custom icon component for crystal ball
function CrystalBall(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a10 10 0 0 1 10 10" />
      <path d="M12 2a10 10 0 0 0-10 10" />
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
    </svg>
  );
} 