import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Building, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Zap,
  Brain,
  Database,
  Cpu,
  Globe,
  Users,
  DollarSign,
  BarChart3,
  FileText,
  Award,
  Star,
  Clock,
  Calendar,
  MapPin,
  Briefcase,
  Target,
  Activity,
  Bell,
  Search,
  Filter,
  Download,
  Share2,
  MessageCircle,
  ClipboardList,
  GitBranch,
  Network,
  Key,
  Unlock,
  Server,
  HardDrive,
  UserCheck,
  FileCheck,
  Info,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Scale,
  AlertCircle,
  Settings,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown,
  Minus,
  Plus,
  XCircle,
  Clock as ClockIcon,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  RotateCw,
  SkipBack,
  SkipForward,
  FastForward,
  Rewind,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Cross,
  Check,
  X,
  Minus as MinusIcon,
  Plus as PlusIcon,
  Divide,
  Percent,
  Hash,
  AtSign,
  DollarSign as DollarSignIcon,
  Euro,
  PoundSterling,
  Yen,
  Bitcoin,
  CreditCard,
  Wallet,
  PiggyBank,
  Banknote,
  Coins,
  Receipt,
  Calculator,
  TrendingUp as TrendingUpIcon2,
  TrendingDown as TrendingDownIcon2,
  BarChart,
  PieChart,
  LineChart,
  ScatterChart,
  AreaChart,
  CandlestickChart,
  RadarChart,
  PolarAreaChart,
  DoughnutChart,
  FunnelChart,
  Gauge,
  Thermometer,
  Droplets,
  Flame,
  Wind,
  Sun,
  Moon,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudDrizzle,
  CloudHail,
  CloudSleet,
  CloudHaze,
  CloudMist,
  CloudSmog,
  CloudDust,
  CloudSand,
  CloudAsh,
  CloudSmoke,
  CloudFog2,
  CloudRain2,
  CloudSnow2,
  CloudLightning2,
  CloudDrizzle2,
  CloudHail2,
  CloudSleet2,
  CloudHaze2,
  CloudMist2,
  CloudSmog2,
  CloudDust2,
  CloudSand2,
  CloudAsh2,
  CloudSmoke2,
  BatteryFull,
  Truck
} from 'lucide-react';

export default function BusinessLanding() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const features = [
    {
      category: 'Compliance Monitoring',
      icon: Shield,
      title: 'AI-Powered Regulatory Tracking',
      description: 'Automatically monitor and analyze regulatory changes that impact your business',
      benefits: ['Real-time alerts', 'Risk assessment', 'Compliance scoring', 'Deadline tracking']
    },
    {
      category: 'Legislative Intelligence',
      icon: Brain,
      title: 'Predictive Policy Analysis',
      description: 'Understand how proposed legislation will affect your industry and operations',
      benefits: ['Bill tracking', 'Impact analysis', 'Stakeholder mapping', 'Vote prediction']
    },
    {
      category: 'Market Intelligence',
      icon: TrendingUp,
      title: 'Economic Impact Assessment',
      description: 'Track how policy changes affect market conditions and competitive landscape',
      benefits: ['Market trends', 'Competitive analysis', 'Economic indicators', 'Investment insights']
    },
    {
      category: 'Government Relations',
      icon: Users,
      title: 'Stakeholder Management',
      description: 'Manage relationships with policymakers, regulators, and industry associations',
      benefits: ['Contact tracking', 'Meeting scheduling', 'Communication logs', 'Influence mapping']
    },
    {
      category: 'Data Integration',
      icon: Database,
      title: 'Comprehensive Data Platform',
      description: 'Connect government data with your business intelligence for strategic insights',
      benefits: ['API integration', 'Custom dashboards', 'Data export', 'Real-time updates']
    },
    {
      category: 'Risk Management',
      icon: AlertTriangle,
      title: 'Proactive Risk Assessment',
      description: 'Identify and mitigate regulatory, operational, and reputational risks',
      benefits: ['Risk scoring', 'Mitigation strategies', 'Scenario planning', 'Compliance monitoring']
    }
  ];

  const industries = [
    { name: 'Technology', icon: Cpu, companies: 450, complianceScore: 92 },
    { name: 'Healthcare', icon: Shield, companies: 380, complianceScore: 88 },
    { name: 'Finance', icon: DollarSign, companies: 320, complianceScore: 95 },
    { name: 'Manufacturing', icon: Building, companies: 280, complianceScore: 85 },
    { name: 'Energy', icon: BatteryFull, companies: 150, complianceScore: 90 },
    { name: 'Transportation', icon: Truck, companies: 120, complianceScore: 87 }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      title: 'Chief Compliance Officer',
      company: 'TechCorp Inc.',
      industry: 'Technology',
      content: 'GovPulse has transformed our compliance monitoring. We catch regulatory changes weeks before our competitors, giving us a significant competitive advantage.',
      metrics: { alerts: 150, timeSaved: '25hrs/week', complianceScore: '+15%' }
    },
    {
      name: 'Michael Chen',
      title: 'VP of Government Relations',
      company: 'Global Manufacturing Co.',
      industry: 'Manufacturing',
      content: 'The AI insights help us anticipate policy impacts and adjust our strategy proactively. It\'s like having a crystal ball for regulatory changes.',
      metrics: { bills: 45, meetings: 12, influence: '+30%' }
    },
    {
      name: 'Emily Rodriguez',
      title: 'Legal Counsel',
      company: 'Financial Services Group',
      industry: 'Finance',
      content: 'Comprehensive, accurate, and saves us hours of manual research every week. The compliance scoring feature alone has improved our audit results.',
      metrics: { violations: 0, audits: 3, savings: '$50K' }
    }
  ];

  const pricing = [
    {
      name: 'Starter',
      price: '$2,500',
      period: '/month',
      description: 'Perfect for small to medium businesses',
      features: [
        'Basic compliance monitoring',
        'Up to 5 users',
        'Email alerts',
        'Standard reports',
        'Email support'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$5,000',
      period: '/month',
      description: 'Ideal for growing organizations',
      features: [
        'Advanced AI insights',
        'Up to 25 users',
        'Real-time alerts',
        'Custom dashboards',
        'API access',
        'Priority support'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations with complex needs',
      features: [
        'Full AI-powered platform',
        'Unlimited users',
        'Custom integrations',
        'Dedicated support',
        'On-premise options',
        'White-label solutions'
      ],
      popular: false
    }
  ];

  const stats = [
    { label: 'Companies Protected', value: '2,500+', icon: Building },
    { label: 'Regulatory Alerts', value: '15,000+', icon: Bell },
    { label: 'Compliance Score Improvement', value: '85%', icon: TrendingUp },
    { label: 'Time Saved Per Week', value: '20hrs', icon: Clock },
    { label: 'Countries Covered', value: '50+', icon: Globe },
    { label: 'Data Sources', value: '200+', icon: Database }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="relative z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">GovPulse</h1>
                <p className="text-blue-200 text-sm">Enterprise Political Intelligence</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-blue-200 hover:text-white transition-colors">Features</a>
              <a href="#industries" className="text-blue-200 hover:text-white transition-colors">Industries</a>
              <a href="#pricing" className="text-blue-200 hover:text-white transition-colors">Pricing</a>
              <a href="#testimonials" className="text-blue-200 hover:text-white transition-colors">Success Stories</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-blue-400 text-blue-200 hover:bg-blue-600">
                <HelpCircle className="w-4 h-4 mr-2" />
                Demo
              </Button>
              <Button 
                onClick={() => router.push('/business-login')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-blue-600 text-white mb-4">
                <Shield className="w-3 h-3 mr-1" />
                Enterprise Grade Security
              </Badge>
              <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                Stay Ahead of
                <span className="text-blue-400"> Regulatory Changes</span>
                with AI-Powered Intelligence
              </h1>
              <p className="text-xl text-blue-200 mb-8 leading-relaxed">
                GovPulse provides enterprise organizations with real-time political intelligence, 
                compliance monitoring, and predictive analytics to navigate complex regulatory landscapes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => router.push('/business-login')}
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-blue-400 text-blue-200 hover:bg-blue-600 text-lg px-8 py-4"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center space-x-6 mt-8 text-sm text-blue-300">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  14-day free trial
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  Cancel anytime
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Live Compliance Dashboard</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm">Live</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-900/20 rounded-lg border border-red-500/30">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <div>
                        <p className="text-white font-medium">FDA Drug Approval Changes</p>
                        <p className="text-red-300 text-sm">High Impact • Due in 30 days</p>
                      </div>
                    </div>
                    <Badge className="bg-red-600">Critical</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-5 h-5 text-yellow-400" />
                      <div>
                        <p className="text-white font-medium">Tax Policy Updates</p>
                        <p className="text-yellow-300 text-sm">Medium Impact • Monitoring</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-600">High</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-900/20 rounded-lg border border-green-500/30">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-white font-medium">Compliance Score</p>
                        <p className="text-green-300 text-sm">92% • Excellent</p>
                      </div>
                    </div>
                    <div className="text-green-400 font-bold">92%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-blue-300 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Enterprise Features</h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Comprehensive political intelligence platform designed for enterprise organizations
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-blue-500/20 hover:border-blue-400/40 transition-all">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <Badge className="w-fit bg-blue-600/20 text-blue-300 border-blue-500/30">
                      {feature.category}
                    </Badge>
                    <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-200 mb-6">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center text-blue-300 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="py-20 bg-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Trusted Across Industries</h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Serving organizations across all major industries with specialized compliance monitoring
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => {
              const IconComponent = industry.icon;
              return (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-blue-500/20 hover:border-blue-400/40 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-white font-semibold">{industry.name}</h3>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">Companies</span>
                        <span className="text-white font-semibold">{industry.companies}+</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">Avg. Compliance Score</span>
                        <span className="text-white font-semibold">{industry.complianceScore}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Success Stories</h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              See how leading organizations are transforming their compliance and government relations
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-blue-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-blue-200 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{testimonial.name}</p>
                      <p className="text-blue-300 text-sm">{testimonial.title}</p>
                      <p className="text-blue-300 text-sm">{testimonial.company}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {Object.entries(testimonial.metrics).map(([key, value]) => (
                      <div key={key} className="bg-blue-600/20 rounded p-2">
                        <div className="text-white font-semibold text-sm">{value}</div>
                        <div className="text-blue-300 text-xs capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600/20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Compliance?</h2>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            Join thousands of organizations that trust GovPulse to stay ahead of regulatory changes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => router.push('/business-login')}
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-blue-500/20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold">GovPulse</h3>
                  <p className="text-blue-300 text-sm">Enterprise Political Intelligence</p>
                </div>
              </div>
              <p className="text-blue-300 text-sm mb-4">
                Stay ahead of regulatory changes with AI-powered compliance monitoring and political intelligence.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-blue-300 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-blue-300 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-blue-300 text-sm">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Sales</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-500/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-blue-300 text-sm">
              © 2024 GovPulse. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-blue-300 hover:text-white text-sm">Privacy Policy</a>
              <a href="#" className="text-blue-300 hover:text-white text-sm">Terms of Service</a>
              <a href="#" className="text-blue-300 hover:text-white text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 