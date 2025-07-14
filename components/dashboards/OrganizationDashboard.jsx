// TODO: This dashboard uses mock data for some sections. Replace with real API integration.
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import KeyMetrics from '../dashboard/KeyMetrics';
import { User } from '../../entities/User';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  Building,
  Activity,
  Target,
  AlertTriangle,
  Star,
  UserPlus,
  MessageSquare,
  Vote,
  FileText as BillIcon,
  Award,
  Clock,
  Shield,
  Zap,
  Brain,
  Database,
  Cpu,
  Wifi,
  Lock,
  Settings,
  Bell,
  Eye,
  Search,
  Filter,
  Download,
  Share2,
  BarChart,
  PieChart,
  LineChart,
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
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Minus,
  Plus,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Calendar,
  MapPin,
  Users,
  Briefcase,
  FileText,
  BookOpen,
  AlertCircle,
  Info,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShoppingBag
} from 'lucide-react';

export default function OrganizationDashboard({ user }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [politicians, setPoliticians] = useState([]);
  const [bills, setBills] = useState([]);
  const [polls, setPolls] = useState([]);
  const [followedPoliticians, setFollowedPoliticians] = useState([]);
  const [followedPoliticiansData, setFollowedPoliticiansData] = useState([]);
  const [politicianUpdates, setPoliticianUpdates] = useState({});
  const [regulations, setRegulations] = useState([]);
  const [marketImpact, setMarketImpact] = useState({});
  const [industryTrends, setIndustryTrends] = useState([]);
  const [competitiveIntelligence, setCompetitiveIntelligence] = useState([]);
  const [regulatoryAlerts, setRegulatoryAlerts] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [companyProfile, setCompanyProfile] = useState({});
  const [riskAssessment, setRiskAssessment] = useState({});
  // Add new state for section loading and errors
  const [companyProfileLoading, setCompanyProfileLoading] = useState(true);
  const [companyProfileError, setCompanyProfileError] = useState(null);
  const [aiInsightsLoading, setAiInsightsLoading] = useState(true);
  const [aiInsightsError, setAiInsightsError] = useState(null);
  const [regulatoryAlertsLoading, setRegulatoryAlertsLoading] = useState(true);
  const [regulatoryAlertsError, setRegulatoryAlertsError] = useState(null);
  const [marketImpactLoading, setMarketImpactLoading] = useState(true);
  const [marketImpactError, setMarketImpactError] = useState(null);
  const [industryTrendsLoading, setIndustryTrendsLoading] = useState(true);
  const [industryTrendsError, setIndustryTrendsError] = useState(null);
  const [competitiveIntelligenceLoading, setCompetitiveIntelligenceLoading] = useState(true);
  const [competitiveIntelligenceError, setCompetitiveIntelligenceError] = useState(null);
  const [riskAssessmentLoading, setRiskAssessmentLoading] = useState(true);
  const [riskAssessmentError, setRiskAssessmentError] = useState(null);
  const [followedLoading, setFollowedLoading] = useState(true);
  const [followedError, setFollowedError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setCompanyProfileLoading(true);
    setAiInsightsLoading(true);
    setRegulatoryAlertsLoading(true);
    setMarketImpactLoading(true);
    setIndustryTrendsLoading(true);
    setCompetitiveIntelligenceLoading(true);
    setRiskAssessmentLoading(true);
    setFollowedLoading(true);
    setTimeout(() => {
      setEvents([
        {
          title: "Federal Reserve Policy Change",
          impact_level: "critical",
          date: "2024-01-15",
          market_impact: 35
        },
        {
          title: "New Regulatory Framework Announced",
          impact_level: "high",
          date: "2024-01-18",
          market_impact: 20
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
          question: "Business confidence in current economic policy?",
          date_conducted: "2024-01-10",
          yes_percentage: 42
        }
      ]);
      
      setIsLoading(false);
    }, 1000);
    
    // Load business-specific data
    loadFollowedPoliticians();
    loadRegulations();
    loadMarketImpact();
    loadIndustryTrends();
    loadCompetitiveIntelligence();
    loadRegulatoryAlerts();
    loadAiInsights();
    loadCompanyProfile();
    loadRiskAssessment();
  }, []);

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

  const loadRegulations = async () => {
    try {
      const response = await fetch('/api/regulations?limit=10');
      if (response.ok) {
        const data = await response.json();
        setRegulations(data.regulations || []);
      }
    } catch (error) {
      console.error('Error loading regulations:', error);
      // Fallback to mock data
      setRegulations(generateMockRegulations());
    }
  };

  const loadMarketImpact = async () => {
    setMarketImpactLoading(true);
    setMarketImpactError(null);
    // Mock market impact data - replace with real API
    try {
      setMarketImpact({
        overallScore: 78,
        sectorPerformance: {
          "Technology": { change: 2.3, impact: "positive" },
          "Healthcare": { change: -1.2, impact: "negative" },
          "Finance": { change: 0.8, impact: "neutral" },
          "Energy": { change: -3.1, impact: "negative" }
        },
        regulatoryRisk: "Medium",
        complianceCosts: 1250000,
        marketOpportunities: [
          { title: "Green Energy Tax Credits", value: 500000, probability: 0.7 },
          { title: "Digital Infrastructure Grants", value: 750000, probability: 0.6 },
          { title: "Supply Chain Resilience Program", value: 300000, probability: 0.8 }
        ]
      });
    } catch (error) {
      setMarketImpact({});
      setMarketImpactError('Failed to load market impact.');
    } finally {
      setMarketImpactLoading(false);
    }
  };

  const loadIndustryTrends = async () => {
    setIndustryTrendsLoading(true);
    setIndustryTrendsError(null);
    setIndustryTrends([
      {
        sector: "Technology",
        impact: "High",
        sentiment: "positive",
        keyIssues: ["AI Regulation", "Data Privacy", "Antitrust"],
        marketCap: 2500000000000,
        growthRate: 12.5,
        regulatoryExposure: "Medium"
      },
      {
        sector: "Healthcare",
        impact: "Medium",
        sentiment: "neutral",
        keyIssues: ["Drug Pricing", "Medicare", "FDA Approval"],
        marketCap: 1800000000000,
        growthRate: 8.2,
        regulatoryExposure: "High"
      },
      {
        sector: "Energy",
        impact: "Critical",
        sentiment: "negative",
        keyIssues: ["Climate Policy", "Subsidies", "Infrastructure"],
        marketCap: 1200000000000,
        growthRate: -2.1,
        regulatoryExposure: "Very High"
      }
    ]);
    setIndustryTrendsLoading(false);
  };

  const loadCompetitiveIntelligence = async () => {
    setCompetitiveIntelligenceLoading(true);
    setCompetitiveIntelligenceError(null);
    setCompetitiveIntelligence([
      {
        competitor: "TechCorp Industries",
        action: "Lobbying for AI regulation",
        impact: "High",
        date: "2024-01-15",
        details: "Increased lobbying spending by 40% on AI-related legislation"
      },
      {
        competitor: "HealthTech Solutions",
        action: "FDA approval for new drug",
        impact: "Medium",
        date: "2024-01-12",
        details: "Received approval for breakthrough therapy designation"
      },
      {
        competitor: "GreenEnergy Corp",
        action: "Climate policy advocacy",
        impact: "Critical",
        date: "2024-01-10",
        details: "Joined industry coalition supporting carbon pricing"
      }
    ]);
    setCompetitiveIntelligenceLoading(false);
  };

  const loadRegulatoryAlerts = async () => {
    setRegulatoryAlertsLoading(true);
    setRegulatoryAlertsError(null);
    setRegulatoryAlerts([
      {
        title: "New EPA Emissions Standards",
        agency: "Environmental Protection Agency",
        impact: "Critical",
        deadline: "2024-03-15",
        complianceCost: 2500000,
        status: "pending"
      },
      {
        title: "Cybersecurity Framework Update",
        agency: "Department of Homeland Security",
        impact: "High",
        deadline: "2024-02-28",
        complianceCost: 800000,
        status: "in_progress"
      },
      {
        title: "Labor Standards Revision",
        agency: "Department of Labor",
        impact: "Medium",
        deadline: "2024-04-01",
        complianceCost: 450000,
        status: "monitoring"
      }
    ]);
    setRegulatoryAlertsLoading(false);
  };

  const loadAiInsights = async () => {
    setAiInsightsLoading(true);
    setAiInsightsError(null);
    setAiInsights([
      {
        type: "market_prediction",
        title: "Regulatory Impact on Q2 Earnings",
        confidence: 87,
        prediction: "Expected 15-20% increase in compliance costs",
        reasoning: "Based on recent regulatory changes and industry trends"
      },
      {
        type: "risk_assessment",
        title: "Supply Chain Vulnerability",
        confidence: 92,
        prediction: "High risk of disruption in semiconductor supply",
        reasoning: "Geopolitical tensions and regulatory changes affecting trade"
      },
      {
        type: "opportunity",
        title: "Green Energy Investment Opportunity",
        confidence: 78,
        prediction: "Potential $2M tax credit opportunity",
        reasoning: "New legislation supporting renewable energy projects"
      }
    ]);
    setAiInsightsLoading(false);
  };

  const loadCompanyProfile = async () => {
    setCompanyProfileLoading(true);
    setCompanyProfileError(null);
    setCompanyProfile({
      name: "InnovationTech Corp",
      industry: "Technology",
      size: "Mid-cap",
      revenue: 850000000,
      employees: 2500,
      locations: ["CA", "TX", "NY", "WA"],
      regulatoryExposure: "Medium",
      complianceScore: 87,
      riskTolerance: "Moderate",
      keyRegulations: ["GDPR", "CCPA", "SOX", "HIPAA"],
      lobbyingBudget: 450000,
      politicalContributions: 125000
    });
    setCompanyProfileLoading(false);
  };

  const loadRiskAssessment = async () => {
    setRiskAssessmentLoading(true);
    setRiskAssessmentError(null);
    setRiskAssessment({
      overallRisk: "Medium",
      riskFactors: [
        { category: "Regulatory", score: 7, trend: "increasing" },
        { category: "Market", score: 5, trend: "stable" },
        { category: "Operational", score: 3, trend: "decreasing" },
        { category: "Financial", score: 4, trend: "stable" }
      ],
      mitigationStrategies: [
        "Enhanced compliance monitoring",
        "Diversified supply chain",
        "Increased lobbying efforts",
        "Technology investment"
      ]
    });
    setRiskAssessmentLoading(false);
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
      }
    ];
    
    const numUpdates = Math.floor(Math.random() * 3) + 1;
    return updateTypes.slice(0, numUpdates);
  };

  const generateMockRegulations = () => {
    return [
      {
        id: 1,
        title: "Cybersecurity Standards for Critical Infrastructure",
        agency: "Department of Homeland Security",
        impact: "High",
        deadline: "2024-03-15",
        status: "Proposed Rule"
      },
      {
        id: 2,
        title: "Environmental Protection Standards",
        agency: "Environmental Protection Agency",
        impact: "Critical",
        deadline: "2024-04-01",
        status: "Final Rule"
      }
    ];
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

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'Critical': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'High': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'Low': return 'bg-green-500/10 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      case 'neutral': return 'text-yellow-400';
      default: return 'text-gray-400';
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

  const formatLargeNumber = (num) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getIndustryIcon = (industry) => {
    const icons = {
      'Technology': Monitor,
      'Healthcare': Stethoscope,
      'Energy': Flame,
      'Finance': Banknote,
      'Manufacturing': Factory,
      'Transportation': Truck,
      'Retail': ShoppingBag,
      'Real Estate': Home,
      'Aerospace': Plane,
      'Maritime': Ship
    };
    return icons[industry] || Building;
  };

  const handleGenerateReport = () => {
    router.push('/business-reports');
  };

  const handleChatInterface = () => {
    router.push('/ai-search');
  };

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
            Business Intelligence Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            {companyProfile.name} • {companyProfile.industry} Industry
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
            <Bell className="w-4 h-4 mr-2" />
            Alerts
          </Button>
          <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <KeyMetrics 
        events={events}
        politicians={politicians}
        bills={bills}
        polls={polls}
        isLoading={isLoading}
      />

      {/* Company Profile Overview */}
      {companyProfileLoading ? (
        <Skeleton className="h-32 w-full mt-6" />
      ) : companyProfileError ? (
        <div className="text-red-400 text-center mt-6">{companyProfileError}</div>
      ) : (
        <Card className="terminal-surface border-gray-700">
          <CardHeader>
            <CardTitle className="terminal-text flex items-center">
              <Building className="w-5 h-5 mr-2 text-blue-400" />
              Company Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {formatCurrency(companyProfile.revenue)}
                </div>
                <div className="text-sm text-gray-400">Annual Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {companyProfile.employees?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Employees</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {companyProfile.complianceScore}%
                </div>
                <div className="text-sm text-gray-400">Compliance Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">
                  {companyProfile.regulatoryExposure}
                </div>
                <div className="text-sm text-gray-400">Regulatory Exposure</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI-Powered Insights */}
      {aiInsightsLoading ? (
        <Skeleton className="h-32 w-full mt-6" />
      ) : aiInsightsError ? (
        <div className="text-red-400 text-center mt-6">{aiInsightsError}</div>
      ) : (
        <Card className="terminal-surface border-gray-700">
          <CardHeader>
            <CardTitle className="terminal-text flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-400" />
              AI-Powered Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {aiInsights.map((insight, index) => (
                <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold terminal-text">{insight.title}</h4>
                    <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                      {insight.confidence}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{insight.prediction}</p>
                  <p className="text-xs text-gray-400">{insight.reasoning}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Regulatory Alerts */}
      {regulatoryAlertsLoading ? (
        <Skeleton className="h-32 w-full mt-6" />
      ) : regulatoryAlertsError ? (
        <div className="text-red-400 text-center mt-6">{regulatoryAlertsError}</div>
      ) : (
        <Card className="terminal-surface border-gray-700">
          <CardHeader>
            <CardTitle className="terminal-text flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
              Regulatory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {regulatoryAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                    <div>
                      <div className="font-medium terminal-text">{alert.title}</div>
                      <div className="text-sm text-gray-400">{alert.agency}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className={getImpactColor(alert.impact)}>
                      {alert.impact}
                    </Badge>
                    <div className="text-right">
                      <div className="text-sm font-medium text-red-400">
                        {formatCurrency(alert.complianceCost)}
                      </div>
                      <div className="text-xs text-gray-400">Compliance Cost</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-yellow-400">
                        {alert.deadline}
                      </div>
                      <div className="text-xs text-gray-400">Deadline</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Impact Analysis */}
      {marketImpactLoading ? (
        <Skeleton className="h-32 w-full mt-6" />
      ) : marketImpactError ? (
        <div className="text-red-400 text-center mt-6">{marketImpactError}</div>
      ) : (
        <Card className="terminal-surface border-gray-700">
          <CardHeader>
            <CardTitle className="terminal-text flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-green-400" />
              Market Impact Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold terminal-text mb-4">Sector Performance</h4>
                <div className="space-y-3">
                  {Object.entries(marketImpact.sectorPerformance || {}).map(([sector, data]) => (
                    <div key={sector} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{sector}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${data.impact === 'positive' ? 'text-green-400' : data.impact === 'negative' ? 'text-red-400' : 'text-yellow-400'}`}>
                          {data.change > 0 ? '+' : ''}{data.change}%
                        </span>
                        {data.change > 0 ? (
                          <TrendingUpIcon className="w-4 h-4 text-green-400" />
                        ) : data.change < 0 ? (
                          <TrendingDownIcon className="w-4 h-4 text-red-400" />
                        ) : (
                          <Minus className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold terminal-text mb-4">Market Opportunities</h4>
                <div className="space-y-3">
                  {marketImpact.marketOpportunities?.map((opportunity, index) => (
                    <div key={index} className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium terminal-text">{opportunity.title}</span>
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                          {Math.round(opportunity.probability * 100)}%
                        </Badge>
                      </div>
                      <div className="text-sm text-green-400">
                        {formatCurrency(opportunity.value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Industry Trends */}
      {industryTrendsLoading ? (
        <Skeleton className="h-32 w-full mt-6" />
      ) : industryTrendsError ? (
        <div className="text-red-400 text-center mt-6">{industryTrendsError}</div>
      ) : (
        <Card className="terminal-surface border-gray-700">
          <CardHeader>
            <CardTitle className="terminal-text flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
              Industry Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {industryTrends.map((trend, index) => {
                const IndustryIcon = getIndustryIcon(trend.sector);
                return (
                  <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                    <div className="flex items-center space-x-3 mb-3">
                      <IndustryIcon className="w-6 h-6 text-blue-400" />
                      <div>
                        <h4 className="font-semibold terminal-text">{trend.sector}</h4>
                        <Badge className={getImpactColor(trend.impact)}>
                          {trend.impact} Impact
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Market Cap:</span>
                        <span className="text-gray-300">{formatLargeNumber(trend.marketCap)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Growth Rate:</span>
                        <span className={getSentimentColor(trend.sentiment)}>
                          {trend.growthRate > 0 ? '+' : ''}{trend.growthRate}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Regulatory Exposure:</span>
                        <span className="text-gray-300">{trend.regulatoryExposure}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Competitive Intelligence */}
      {competitiveIntelligenceLoading ? (
        <Skeleton className="h-32 w-full mt-6" />
      ) : competitiveIntelligenceError ? (
        <div className="text-red-400 text-center mt-6">{competitiveIntelligenceError}</div>
      ) : (
        <Card className="terminal-surface border-gray-700">
          <CardHeader>
            <CardTitle className="terminal-text flex items-center">
              <Target className="w-5 h-5 mr-2 text-orange-400" />
              Competitive Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {competitiveIntelligence.map((intel, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-orange-400 rounded-full" />
                    <div>
                      <div className="font-medium terminal-text">{intel.competitor}</div>
                      <div className="text-sm text-gray-400">{intel.action}</div>
                      <div className="text-xs text-gray-500">{intel.details}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className={getImpactColor(intel.impact)}>
                      {intel.impact}
                    </Badge>
                    <div className="text-sm text-gray-400">{intel.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Assessment */}
      {riskAssessmentLoading ? (
        <Skeleton className="h-32 w-full mt-6" />
      ) : riskAssessmentError ? (
        <div className="text-red-400 text-center mt-6">{riskAssessmentError}</div>
      ) : (
        <Card className="terminal-surface border-gray-700">
          <CardHeader>
            <CardTitle className="terminal-text flex items-center">
              <Shield className="w-5 h-5 mr-2 text-yellow-400" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold terminal-text mb-4">Risk Factors</h4>
                <div className="space-y-3">
                  {riskAssessment.riskFactors?.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{factor.category}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full" 
                            style={{ width: `${factor.score * 10}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-400">{factor.score}/10</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold terminal-text mb-4">Mitigation Strategies</h4>
                <div className="space-y-2">
                  {riskAssessment.mitigationStrategies?.map((strategy, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">{strategy}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button 
          onClick={handleGenerateReport}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
        <Button 
          onClick={handleChatInterface}
          variant="outline" 
          className="border-gray-600 text-gray-300"
        >
          <Brain className="w-4 h-4 mr-2" />
          AI Chat Interface
        </Button>
        <Button 
          variant="outline" 
          className="border-gray-600 text-gray-300"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>
    </div>
  );
} 