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
  FileText,
  Download,
  Share2,
  Eye,
  Calendar,
  Building,
  MapPin,
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart,
  ScatterChart,
  AreaChart,
  Radar,
  Hexagon,
  Circle,
  Square,
  Triangle,
  Diamond,
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
  Target,
  Gauge,
  TrendingUp as TrendingUpIcon,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  Filter,
  Search,
  Settings,
  Bell,
  Activity,
  ChartLine,
  Shield,
  Globe,
  Brain,
  Zap
} from 'lucide-react';

export default function BusinessReports() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('reports');
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState('technology');
  const [selectedState, setSelectedState] = useState('CA');
  const [timeRange, setTimeRange] = useState('30d');
  const [reportType, setReportType] = useState('comprehensive_report');

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

  const reportTypes = [
    { value: 'executive_summary', label: 'Executive Summary', icon: FileText },
    { value: 'comprehensive_report', label: 'Comprehensive Report', icon: BarChart3 },
    { value: 'performance_report', label: 'Performance Report', icon: Gauge },
    { value: 'competitive_analysis', label: 'Competitive Analysis', icon: Users },
    { value: 'risk_assessment', label: 'Risk Assessment', icon: Shield },
    { value: 'opportunity_report', label: 'Opportunity Report', icon: Rocket },
    { value: 'quarterly_report', label: 'Quarterly Report', icon: Calendar }
  ];

  const generateReport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/business/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: reportType,
          industry: selectedIndustry,
          state: selectedState,
          timeRange: timeRange,
          format: 'json'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setReportData(data.report);
        setSelectedReport(data.report);
      }
    } catch (error) {
      console.error('Error generating report:', error);
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
            <h1 className="text-3xl font-bold terminal-text">Business Reports</h1>
            <p className="text-gray-400 mt-2">Professional political intelligence reports and analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={generateReport} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <FileText className="w-4 h-4 mr-2" />
              )}
              Generate Report
            </Button>
          </div>
        </div>

        {/* Report Configuration */}
        <Card className="terminal-surface border-gray-700 terminal-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 terminal-text">
              <Settings className="w-5 h-5" />
              <span>Report Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm text-gray-400">Report Type</Label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="terminal-input border-gray-600 bg-gray-800 text-white px-3 py-2 rounded-md w-full mt-1"
                >
                  {reportTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-sm text-gray-400">Industry</Label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="terminal-input border-gray-600 bg-gray-800 text-white px-3 py-2 rounded-md w-full mt-1"
                >
                  {industries.map(industry => (
                    <option key={industry} value={industry}>
                      {industry.charAt(0).toUpperCase() + industry.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-sm text-gray-400">State</Label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="terminal-input border-gray-600 bg-gray-800 text-white px-3 py-2 rounded-md w-full mt-1"
                >
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-sm text-gray-400">Time Range</Label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="terminal-input border-gray-600 bg-gray-800 text-white px-3 py-2 rounded-md w-full mt-1"
                >
                  {timeRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
            <TabsTrigger value="reports" className="terminal-text">Reports</TabsTrigger>
            <TabsTrigger value="templates" className="terminal-text">Templates</TabsTrigger>
          </TabsList>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            {reportData ? (
              <div className="space-y-6">
                {/* Report Header */}
                <Card className="terminal-surface border-blue-700 terminal-glow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold terminal-text">{reportData.title}</h2>
                        <p className="text-gray-400 mt-1">{reportData.subtitle}</p>
                        <p className="text-sm text-gray-500 mt-1">Generated: {reportData.date}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button className="bg-green-600 hover:bg-green-700">
                          <Download className="w-4 h-4 mr-2" />
                          Export PDF
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Executive Summary */}
                {reportData.executiveSummary && (
                  <Card className="terminal-surface border-gray-700 terminal-glow">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 terminal-text">
                        <Star className="w-5 h-5" />
                        <span>Executive Summary</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                          <p className="text-gray-300 mb-4">{reportData.executiveSummary.overview}</p>
                          <div className="space-y-3">
                            {reportData.executiveSummary.keyFindings?.map((finding, index) => (
                              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-md">
                                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                <span className="terminal-text">{finding}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="text-center p-4 bg-gray-800 rounded-md">
                            <p className="text-3xl font-bold text-blue-400">
                              {reportData.executiveSummary.performance?.score || '8.5'}
                            </p>
                            <p className="text-sm text-gray-400">Performance Score</p>
                            <div className="flex items-center justify-center mt-2">
                              {getTrendIcon(0.8)}
                              <span className="text-sm text-green-400 ml-1">+0.8</span>
                            </div>
                          </div>
                          <div className="text-center p-4 bg-gray-800 rounded-md">
                            <p className={`text-2xl font-bold ${getRiskColor(reportData.executiveSummary.risks?.score || 5)}`}>
                              {reportData.executiveSummary.risks?.level || 'Medium'}
                            </p>
                            <p className="text-sm text-gray-400">Risk Level</p>
                          </div>
                          <div className="text-center p-4 bg-gray-800 rounded-md">
                            <p className="text-2xl font-bold text-green-400">
                              {reportData.executiveSummary.opportunities?.level || 'High'}
                            </p>
                            <p className="text-sm text-gray-400">Opportunity Level</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Key Metrics */}
                {reportData.performanceMetrics && (
                  <Card className="terminal-surface border-gray-700 terminal-glow">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 terminal-text">
                        <BarChart3 className="w-5 h-5" />
                        <span>Key Metrics</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Object.entries(reportData.performanceMetrics.keyMetrics || {}).map(([category, metrics]) => (
                          <div key={category} className="p-4 bg-gray-800 rounded-md">
                            <h4 className="font-medium terminal-text capitalize mb-3">
                              {category.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            <div className="space-y-2">
                              {Object.entries(metrics).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="text-sm text-gray-400 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                                  </span>
                                  <span className="text-sm terminal-text">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recommendations */}
                {reportData.strategicRecommendations && (
                  <Card className="terminal-surface border-gray-700 terminal-glow">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 terminal-text">
                        <Target className="w-5 h-5" />
                        <span>Strategic Recommendations</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(reportData.strategicRecommendations).map(([timeline, recommendations]) => (
                          <div key={timeline} className="p-4 bg-gray-800 rounded-md">
                            <div className="flex items-center space-x-2 mb-3">
                              {timeline === 'immediate' && <Zap className="w-4 h-4 text-red-400" />}
                              {timeline === 'shortTerm' && <Clock className="w-4 h-4 text-yellow-400" />}
                              {timeline === 'longTerm' && <Globe className="w-4 h-4 text-green-400" />}
                              <h4 className="font-medium terminal-text capitalize">
                                {timeline.replace(/([A-Z])/g, ' $1').trim()}
                              </h4>
                            </div>
                            <div className="space-y-2">
                              {recommendations.map((rec, index) => (
                                <div key={index} className="flex items-start space-x-2">
                                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                                  <span className="text-sm terminal-text">{rec}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Risk Assessment */}
                {reportData.riskAssessment && (
                  <Card className="terminal-surface border-gray-700 terminal-glow">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 terminal-text">
                        <Shield className="w-5 h-5" />
                        <span>Risk Assessment</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <div className="text-center p-4 bg-gray-800 rounded-md mb-4">
                            <p className={`text-3xl font-bold ${getRiskColor(reportData.riskAssessment.overallRisk?.score || 5)}`}>
                              {reportData.riskAssessment.overallRisk?.level || 'Medium'}
                            </p>
                            <p className="text-sm text-gray-400">Overall Risk Level</p>
                          </div>
                          <div className="space-y-3">
                            {reportData.riskAssessment.overallRisk?.recommendations?.map((rec, index) => (
                              <div key={index} className="flex items-center space-x-2 p-3 bg-gray-800 rounded-md">
                                <AlertCircle className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm terminal-text">{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium terminal-text mb-3">Risk Categories</h4>
                          <div className="space-y-3">
                            {Object.entries(reportData.riskAssessment.riskCategories || {}).map(([category, data]) => (
                              <div key={category} className="p-3 bg-gray-800 rounded-md">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm terminal-text capitalize">
                                    {category.replace(/([A-Z])/g, ' $1').trim()}
                                  </span>
                                  <Badge className={`${
                                    data.level === 'High' ? 'bg-red-600' :
                                    data.level === 'Medium' ? 'bg-yellow-600' : 'bg-green-600'
                                  }`}>
                                    {data.level}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-400">Score: {data.score}/10</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Opportunity Analysis */}
                {reportData.opportunityAnalysis && (
                  <Card className="terminal-surface border-gray-700 terminal-glow">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 terminal-text">
                        <Rocket className="w-5 h-5" />
                        <span>Opportunity Analysis</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <div className="text-center p-4 bg-gray-800 rounded-md mb-4">
                            <p className="text-3xl font-bold text-green-400">
                              {reportData.opportunityAnalysis.overallOpportunity?.level || 'High'}
                            </p>
                            <p className="text-sm text-gray-400">Opportunity Level</p>
                          </div>
                          <div className="space-y-3">
                            {reportData.opportunityAnalysis.overallOpportunity?.recommendations?.map((rec, index) => (
                              <div key={index} className="flex items-center space-x-2 p-3 bg-gray-800 rounded-md">
                                <Rocket className="w-4 h-4 text-green-400" />
                                <span className="text-sm terminal-text">{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium terminal-text mb-3">Opportunity Categories</h4>
                          <div className="space-y-3">
                            {Object.entries(reportData.opportunityAnalysis.opportunityCategories || {}).map(([category, data]) => (
                              <div key={category} className="p-3 bg-gray-800 rounded-md">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm terminal-text capitalize">
                                    {category.replace(/([A-Z])/g, ' $1').trim()}
                                  </span>
                                  <Badge className="bg-green-600">
                                    {data.level}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-400">Score: {data.score}/10</p>
                                <div className="mt-2 space-y-1">
                                  {data.opportunities?.slice(0, 2).map((opp, index) => (
                                    <div key={index} className="text-xs text-gray-400">
                                      • {opp.name}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium terminal-text mb-2">No Report Generated</h3>
                  <p className="text-gray-400 mb-6">Configure your report settings and click "Generate Report" to create your first report.</p>
                  <Button onClick={generateReport} className="bg-blue-600 hover:bg-blue-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportTypes.map((type) => (
                <Card key={type.value} className="terminal-surface border-gray-700 terminal-glow hover:border-blue-600 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <type.icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-medium terminal-text">{type.label}</h3>
                        <p className="text-sm text-gray-400">Professional template</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Pages:</span>
                        <span className="terminal-text">8-15</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Charts:</span>
                        <span className="terminal-text">5-10</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Analysis:</span>
                        <span className="terminal-text">Comprehensive</span>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          setReportType(type.value);
                          setActiveTab('reports');
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" className="bg-gray-600 hover:bg-gray-700">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </AppLayout>
  );
}