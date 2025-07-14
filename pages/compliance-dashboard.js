import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { User } from '../entities/User';
import AppLayout from '../components/AppLayout';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  FileText,
  Search,
  Filter,
  Download,
  Share2,
  Bell,
  Eye,
  Zap,
  Brain,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Scale,
  Globe,
  Factory,
  Truck,
  Heart,
  Leaf,
  Wrench,
  Car,
  Home,
  Plane,
  Ship,
  Monitor,
  Smartphone,
  Pill,
  Stethoscope,
  Banknote,
  Calculator,
  Lightbulb,
  Droplets,
  Flame,
  Wind,
  Sun,
  BatteryFull,
  Gauge,
  ShoppingBag,
  Database,
  Cpu,
  Wifi,
  Lock,
  Network,
  Key,
  Unlock,
  Server,
  Cloud,
  HardDrive,
  UserCheck,
  FileCheck,
  Award,
  Star,
  Minus,
  Plus,
  XCircle,
  Info,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Target,
  AlertCircle,
  Settings,
  MessageCircle,
  ClipboardList,
  GitBranch,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Clock as ClockIcon
} from 'lucide-react';

export default function ComplianceDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [complianceAlerts, setComplianceAlerts] = useState([]);
  const [regulatoryUpdates, setRegulatoryUpdates] = useState([]);
  const [riskAssessment, setRiskAssessment] = useState({});
  const [complianceScore, setComplianceScore] = useState(0);
  const [pendingActions, setPendingActions] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [legislationWatch, setLegislationWatch] = useState([]);
  const [complianceCalendar, setComplianceCalendar] = useState([]);
  const [industryBenchmarks, setIndustryBenchmarks] = useState({});
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('all');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      // Load compliance data based on user profile
      await loadComplianceData(currentUser);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadComplianceData = async (userData) => {
    // Generate personalized compliance data based on company profile
    const alerts = generateComplianceAlerts(userData);
    const updates = generateRegulatoryUpdates(userData);
    const risk = generateRiskAssessment(userData);
    const score = calculateComplianceScore(userData);
    const actions = generatePendingActions(userData);
    const insights = generateAiInsights(userData);
    const watch = generateLegislationWatch(userData);
    const calendar = generateComplianceCalendar(userData);
    const benchmarks = generateIndustryBenchmarks(userData);

    setComplianceAlerts(alerts);
    setRegulatoryUpdates(updates);
    setRiskAssessment(risk);
    setComplianceScore(score);
    setPendingActions(actions);
    setAiInsights(insights);
    setLegislationWatch(watch);
    setComplianceCalendar(calendar);
    setIndustryBenchmarks(benchmarks);
  };

  const generateComplianceAlerts = (userData) => {
    const alerts = [];
    const industry = userData.industry;
    const exposure = userData.regulatory_exposure;

    // Generate alerts based on industry and regulatory exposure
    if (industry === 'Healthcare') {
      alerts.push({
        id: 1,
        type: 'critical',
        title: 'FDA Drug Approval Process Changes',
        description: 'New FDA guidelines for drug approval process may affect your pharmaceutical operations.',
        impact: 'High',
        deadline: '2024-02-15',
        category: 'Healthcare Regulations',
        action_required: 'Review and update drug approval procedures'
      });
    }

    if (industry === 'Finance') {
      alerts.push({
        id: 2,
        type: 'high',
        title: 'Dodd-Frank Compliance Updates',
        description: 'Updated Dodd-Frank regulations require new reporting procedures for financial institutions.',
        impact: 'Medium',
        deadline: '2024-03-01',
        category: 'Financial Regulations',
        action_required: 'Implement new reporting systems'
      });
    }

    if (userData.data_handling?.includes('Health data (HIPAA)')) {
      alerts.push({
        id: 3,
        type: 'high',
        title: 'HIPAA Privacy Rule Updates',
        description: 'New HIPAA privacy rule changes affect how you handle patient data.',
        impact: 'High',
        deadline: '2024-02-28',
        category: 'Data Privacy',
        action_required: 'Update privacy policies and procedures'
      });
    }

    if (exposure === 'Critical') {
      alerts.push({
        id: 4,
        type: 'critical',
        title: 'Enhanced Regulatory Monitoring',
        description: 'Your company is under enhanced regulatory monitoring due to critical exposure level.',
        impact: 'Critical',
        deadline: '2024-01-31',
        category: 'Regulatory Oversight',
        action_required: 'Schedule compliance audit'
      });
    }

    return alerts;
  };

  const generateRegulatoryUpdates = (userData) => {
    const updates = [];
    const industry = userData.industry;

    // Generate industry-specific regulatory updates
    if (industry === 'Technology') {
      updates.push({
        id: 1,
        title: 'AI Ethics Guidelines Released',
        source: 'White House Office of Science and Technology Policy',
        date: '2024-01-20',
        impact: 'Medium',
        summary: 'New guidelines for responsible AI development and deployment',
        relevance: 'High',
        action_needed: 'Review AI development practices'
      });
    }

    if (industry === 'Energy') {
      updates.push({
        id: 2,
        title: 'EPA Clean Energy Standards',
        source: 'Environmental Protection Agency',
        date: '2024-01-18',
        impact: 'High',
        summary: 'Updated clean energy standards for power plants',
        relevance: 'High',
        action_needed: 'Assess compliance with new standards'
      });
    }

    return updates;
  };

  const generateRiskAssessment = (userData) => {
    const risk = {
      overall: 'Medium',
      score: 65,
      categories: {
        regulatory: { score: 70, level: 'Medium-High' },
        operational: { score: 60, level: 'Medium' },
        financial: { score: 55, level: 'Medium' },
        reputational: { score: 75, level: 'High' }
      },
      trends: {
        regulatory: 'increasing',
        operational: 'stable',
        financial: 'decreasing',
        reputational: 'increasing'
      }
    };

    // Adjust based on company profile
    if (userData.regulatory_exposure === 'Critical') {
      risk.overall = 'High';
      risk.score = 85;
      risk.categories.regulatory.score = 90;
      risk.categories.regulatory.level = 'Critical';
    }

    if (userData.compliance_history?.includes('Major violations')) {
      risk.categories.reputational.score = 90;
      risk.categories.reputational.level = 'Critical';
    }

    return risk;
  };

  const calculateComplianceScore = (userData) => {
    let score = 75; // Base score

    // Adjust based on compliance history
    if (userData.compliance_history === 'No previous compliance issues') {
      score += 15;
    } else if (userData.compliance_history?.includes('Major violations')) {
      score -= 20;
    }

    // Adjust based on regulatory exposure
    if (userData.regulatory_exposure === 'Low') {
      score += 10;
    } else if (userData.regulatory_exposure === 'Critical') {
      score -= 15;
    }

    return Math.max(0, Math.min(100, score));
  };

  const generatePendingActions = (userData) => {
    const actions = [];

    if (userData.regulatory_exposure === 'Critical') {
      actions.push({
        id: 1,
        title: 'Schedule Regulatory Audit',
        priority: 'High',
        deadline: '2024-02-15',
        category: 'Audit',
        description: 'Required quarterly audit due to critical regulatory exposure'
      });
    }

    if (userData.data_handling?.includes('Health data (HIPAA)')) {
      actions.push({
        id: 2,
        title: 'Update HIPAA Policies',
        priority: 'Medium',
        deadline: '2024-03-01',
        category: 'Policy Update',
        description: 'Review and update HIPAA compliance policies'
      });
    }

    return actions;
  };

  const generateAiInsights = (userData) => {
    const insights = [];

    insights.push({
      id: 1,
      type: 'risk',
      title: 'Regulatory Risk Trend Analysis',
      description: 'AI analysis shows increasing regulatory scrutiny in your industry sector',
      confidence: 85,
      recommendation: 'Consider proactive compliance measures',
      impact: 'Medium'
    });

    insights.push({
      id: 2,
      type: 'opportunity',
      title: 'Compliance Efficiency Opportunity',
      description: 'Automated compliance monitoring could reduce your compliance costs by 30%',
      confidence: 78,
      recommendation: 'Explore compliance automation solutions',
      impact: 'High'
    });

    return insights;
  };

  const generateLegislationWatch = (userData) => {
    const watch = [];

    if (userData.industry === 'Technology') {
      watch.push({
        id: 1,
        bill: 'H.R. 1234 - AI Accountability Act',
        status: 'In Committee',
        sponsor: 'Rep. Smith',
        relevance: 'High',
        impact: 'Medium',
        summary: 'Regulates AI development and deployment practices',
        last_updated: '2024-01-20'
      });
    }

    if (userData.industry === 'Healthcare') {
      watch.push({
        id: 2,
        bill: 'S. 567 - Healthcare Transparency Act',
        status: 'Floor Vote',
        sponsor: 'Sen. Johnson',
        relevance: 'High',
        impact: 'High',
        summary: 'Requires healthcare providers to disclose pricing information',
        last_updated: '2024-01-18'
      });
    }

    return watch;
  };

  const generateComplianceCalendar = (userData) => {
    const calendar = [];

    // Add recurring compliance events
    calendar.push({
      id: 1,
      title: 'Quarterly Compliance Review',
      date: '2024-02-15',
      type: 'recurring',
      priority: 'High',
      category: 'Review'
    });

    calendar.push({
      id: 2,
      title: 'Annual Regulatory Training',
      date: '2024-03-01',
      type: 'training',
      priority: 'Medium',
      category: 'Training'
    });

    return calendar;
  };

  const generateIndustryBenchmarks = (userData) => {
    return {
      industry: userData.industry || 'General',
      average_score: 72,
      top_performers: 88,
      your_score: 75,
      percentile: 65,
      recommendations: [
        'Implement automated compliance monitoring',
        'Enhance employee training programs',
        'Consider third-party compliance audits'
      ]
    };
  };

  const getRiskColor = (level) => {
    switch (level.toLowerCase()) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'high': return <AlertCircle className="w-5 h-5 text-orange-400" />;
      case 'medium': return <Info className="w-5 h-5 text-yellow-400" />;
      case 'low': return <CheckCircle className="w-5 h-5 text-green-400" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getComplianceScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (isLoading) {
    return (
      <AppLayout user={user}>
        <div className="px-8 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64 bg-gray-700" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="h-48 bg-gray-700" />
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user}>
      <div className="px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold terminal-text">Compliance Dashboard</h1>
              <p className="text-gray-400 mt-2">
                AI-powered compliance monitoring for {user?.company_name || 'your business'}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="border-gray-600 text-gray-300">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Bell className="w-4 h-4 mr-2" />
                Set Alerts
              </Button>
            </div>
          </div>

          {/* Compliance Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="terminal-surface border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm terminal-muted">Compliance Score</p>
                    <p className={`text-3xl font-bold ${getComplianceScoreColor(complianceScore)}`}>
                      {complianceScore}%
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-green-400">+5% this month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="terminal-surface border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm terminal-muted">Active Alerts</p>
                    <p className="text-3xl font-bold text-orange-400">
                      {complianceAlerts.filter(a => a.type === 'critical' || a.type === 'high').length}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-yellow-400">3 require attention</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="terminal-surface border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm terminal-muted">Risk Level</p>
                    <p className={`text-3xl font-bold ${getRiskColor(riskAssessment.overall)}`}>
                      {riskAssessment.overall}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                    <Activity className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-red-400 mr-1" />
                    <span className="text-red-400">Increasing trend</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="terminal-surface border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm terminal-muted">Pending Actions</p>
                    <p className="text-3xl font-bold text-blue-400">
                      {pendingActions.length}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <ClipboardList className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 text-blue-400 mr-1" />
                    <span className="text-blue-400">Next due: Feb 15</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Compliance Alerts */}
              <Card className="terminal-surface border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-orange-400 mr-2" />
                    Critical Compliance Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complianceAlerts.map(alert => (
                      <div key={alert.id} className="border border-gray-600 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            {getAlertIcon(alert.type)}
                            <div>
                              <h4 className="font-medium terminal-text">{alert.title}</h4>
                              <p className="text-sm terminal-muted mt-1">{alert.description}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <Badge variant="outline" className="border-gray-600">
                                  {alert.category}
                                </Badge>
                                <span className="text-sm terminal-muted">
                                  Due: {alert.deadline}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Take Action
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card className="terminal-surface border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 text-blue-400 mr-2" />
                    AI Compliance Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiInsights.map(insight => (
                      <div key={insight.id} className="border border-gray-600 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium terminal-text">{insight.title}</h4>
                            <p className="text-sm terminal-muted mt-1">{insight.description}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <Badge variant="outline" className="border-gray-600">
                                {insight.confidence}% confidence
                              </Badge>
                              <span className="text-sm terminal-muted">
                                Impact: {insight.impact}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm terminal-muted">Recommendation:</p>
                            <p className="text-sm terminal-text">{insight.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Legislation Watch */}
              <Card className="terminal-surface border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 text-green-400 mr-2" />
                    Legislation Watch
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {legislationWatch.map(bill => (
                      <div key={bill.id} className="border border-gray-600 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium terminal-text">{bill.bill}</h4>
                            <p className="text-sm terminal-muted mt-1">{bill.summary}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <Badge variant="outline" className="border-gray-600">
                                {bill.status}
                              </Badge>
                              <span className="text-sm terminal-muted">
                                Sponsor: {bill.sponsor}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={`${
                              bill.relevance === 'High' ? 'bg-red-600' : 'bg-yellow-600'
                            }`}>
                              {bill.relevance} Relevance
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Risk Assessment */}
              <Card className="terminal-surface border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 text-red-400 mr-2" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(riskAssessment.categories).map(([category, data]) => (
                      <div key={category} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm terminal-text capitalize">{category}</p>
                          <p className={`text-xs ${getRiskColor(data.level)}`}>
                            {data.level}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${data.score}%` }}
                            />
                          </div>
                          <span className="text-sm terminal-muted">{data.score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pending Actions */}
              <Card className="terminal-surface border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ClipboardList className="w-5 h-5 text-blue-400 mr-2" />
                    Pending Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingActions.map(action => (
                      <div key={action.id} className="border border-gray-600 rounded-lg p-3">
                        <h4 className="font-medium terminal-text text-sm">{action.title}</h4>
                        <p className="text-xs terminal-muted mt-1">{action.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="border-gray-600 text-xs">
                            {action.category}
                          </Badge>
                          <span className="text-xs terminal-muted">
                            Due: {action.deadline}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Industry Benchmarks */}
              <Card className="terminal-surface border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 text-green-400 mr-2" />
                    Industry Benchmarks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold terminal-text">{industryBenchmarks.your_score}%</p>
                      <p className="text-sm terminal-muted">Your Score</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="terminal-muted">Industry Average</span>
                        <span className="terminal-text">{industryBenchmarks.average_score}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="terminal-muted">Top Performers</span>
                        <span className="terminal-text">{industryBenchmarks.top_performers}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="terminal-muted">Percentile</span>
                        <span className="terminal-text">{industryBenchmarks.percentile}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 