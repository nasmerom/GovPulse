import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { User } from '../../entities/User';
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
  Cloud,
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
  Clock as ClockIcon
} from 'lucide-react';

export default function BusinessLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isDemoMode) {
        // Demo login for business users
        const demoUser = {
          id: 1,
          email: 'demo@company.com',
          name: 'Demo User',
          account_type: 'Business',
          company_name: 'Acme Corporation',
          industry: 'Technology',
          subcategory: 'Software Development',
          company_size: '201-1000 employees',
          business_model: 'B2B (Business to Business)',
          regulatory_exposure: 'Medium',
          compliance_history: 'No previous compliance issues',
          data_handling: ['Basic customer data (name, email)', 'Financial data (credit cards, banking)'],
          geographic_operations: ['National', 'Europe'],
          topic_preferences: [
            'Data Privacy & Security (GDPR, CCPA, HIPAA)',
            'Financial Regulations (Dodd-Frank, SOX)',
            'AI & Machine Learning Policy',
            'Cybersecurity Regulations',
            'Tax Policy Changes',
            'Market Trends & Analysis'
          ],
          onboarding_completed: true
        };
        
        await User.update(demoUser);
        onLoginSuccess(demoUser);
      } else {
        // Regular login
        const user = await User.authenticate(email, password);
        if (user) {
          onLoginSuccess(user);
        } else {
          setError('Invalid credentials. Please try again.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setIsDemoMode(true);
    handleLogin({ preventDefault: () => {} });
  };

  const businessFeatures = [
    {
      icon: Shield,
      title: 'AI-Powered Compliance Monitoring',
      description: 'Stay ahead of regulatory changes with intelligent risk assessment and automated alerts'
    },
    {
      icon: Brain,
      title: 'Legislative Intelligence',
      description: 'Track bills and regulations that impact your industry with predictive analysis'
    },
    {
      icon: TrendingUp,
      title: 'Market Impact Analysis',
      description: 'Understand how policy changes affect your business and competitive landscape'
    },
    {
      icon: Database,
      title: 'Comprehensive Data Integration',
      description: 'Connect government data with your business intelligence for strategic insights'
    },
    {
      icon: Users,
      title: 'Stakeholder Management',
      description: 'Track relationships with policymakers, regulators, and industry associations'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Measure compliance effectiveness and regulatory risk exposure'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      title: 'Chief Compliance Officer',
      company: 'TechCorp Inc.',
      content: 'GovPulse has transformed our compliance monitoring. We catch regulatory changes weeks before our competitors.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      title: 'VP of Government Relations',
      company: 'Global Manufacturing Co.',
      content: 'The AI insights help us anticipate policy impacts and adjust our strategy proactively.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      title: 'Legal Counsel',
      company: 'Financial Services Group',
      content: 'Comprehensive, accurate, and saves us hours of manual research every week.',
      rating: 5
    }
  ];

  const stats = [
    { label: 'Companies Protected', value: '2,500+' },
    { label: 'Regulatory Alerts', value: '15,000+' },
    { label: 'Compliance Score Improvement', value: '85%' },
    { label: 'Time Saved', value: '20hrs/week' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10">
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
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-blue-400 text-blue-200 hover:bg-blue-600">
                <HelpCircle className="w-4 h-4 mr-2" />
                Support
              </Button>
              <Button variant="outline" className="border-blue-400 text-blue-200 hover:bg-blue-600">
                <ExternalLink className="w-4 h-4 mr-2" />
                Enterprise
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left Column - Login Form */}
          <div className="flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-4">
                  Enterprise Political Intelligence
                </h2>
                <p className="text-xl text-blue-200 mb-6">
                  Stay ahead of regulatory changes and policy impacts with AI-powered compliance monitoring
                </p>
                <div className="flex items-center justify-center space-x-6 text-sm text-blue-300">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    SOC 2 Compliant
                  </div>
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 mr-2" />
                    Enterprise Security
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    SSO Ready
                  </div>
                </div>
              </div>

              <Card className="bg-white/10 backdrop-blur-sm border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-white text-center">Sign In</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                      <Label htmlFor="email" className="text-blue-200">Business Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-blue-300" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 bg-white/10 border-blue-500/30 text-white placeholder-blue-300"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="password" className="text-blue-200">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-blue-300" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 bg-white/10 border-blue-500/30 text-white placeholder-blue-300"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-blue-300 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center space-x-2 text-red-400 bg-red-900/20 p-3 rounded-lg">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm">{error}</span>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Signing In...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          Sign In
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                      )}
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-blue-500/30"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-transparent text-blue-300">or</span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleDemoLogin}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full border-blue-500/30 text-blue-200 hover:bg-blue-600/20"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Try Demo Account
                    </Button>

                    <div className="text-center text-sm text-blue-300">
                      <p>Don't have an account? <a href="#" className="text-blue-200 hover:text-white underline">Contact Sales</a></p>
                      <p className="mt-2">Forgot password? <a href="#" className="text-blue-200 hover:text-white underline">Reset</a></p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Features & Social Proof */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-blue-500/20">
                  <div className="text-3xl font-bold text-blue-200">{stat.value}</div>
                  <div className="text-sm text-blue-300">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white mb-6">Enterprise Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {businessFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-blue-500/20">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">{feature.title}</h4>
                        <p className="text-blue-300 text-xs mt-1">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Testimonials */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white mb-6">Trusted by Industry Leaders</h3>
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-blue-500/20">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <span className="text-blue-300 text-sm">{testimonial.rating}.0</span>
                        </div>
                        <p className="text-blue-200 text-sm mb-2">"{testimonial.content}"</p>
                        <div className="text-blue-300 text-xs">
                          <span className="font-semibold">{testimonial.name}</span>
                          <span className="mx-1">•</span>
                          <span>{testimonial.title}</span>
                          <span className="mx-1">•</span>
                          <span>{testimonial.company}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-blue-500/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm text-blue-300">
            <div className="flex items-center space-x-6">
              <span>© 2024 GovPulse. All rights reserved.</span>
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Security</a>
            </div>
            <div className="flex items-center space-x-4">
              <span>Enterprise Support: support@govpulse.com</span>
              <span>|</span>
              <span>1-800-GOVPULSE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 