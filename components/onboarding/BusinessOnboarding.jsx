import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { User } from '../../entities/User';
import { 
  Building, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  Shield,
  Globe,
  Briefcase,
  Target,
  FileText,
  Database,
  Cpu,
  Wifi,
  Lock,
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
  Zap,
  Brain,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Settings,
  Bell,
  Eye,
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
  Database as DatabaseIcon,
  Server,
  Cloud,
  HardDrive,
  Shield as ShieldIcon,
  Lock as LockIcon,
  Eye as EyeIcon,
  UserCheck,
  FileCheck,
  Award,
  Star,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown,
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
  Scale
} from 'lucide-react';
import { getZipPopulation, getZipMedianIncome } from '../../utils/census';

// Business industries with subcategories
const industries = [
  {
    name: 'Technology',
    icon: Monitor,
    subcategories: ['Software Development', 'Hardware Manufacturing', 'Cloud Services', 'Cybersecurity', 'AI/ML', 'Fintech', 'Healthtech', 'E-commerce', 'Social Media', 'Gaming']
  },
  {
    name: 'Healthcare',
    icon: Heart,
    subcategories: ['Pharmaceuticals', 'Medical Devices', 'Healthcare Services', 'Health Insurance', 'Biotechnology', 'Telemedicine', 'Medical Research', 'Mental Health', 'Dental Care', 'Veterinary']
  },
  {
    name: 'Finance',
    icon: Banknote,
    subcategories: ['Banking', 'Investment Management', 'Insurance', 'Credit Cards', 'Mortgage Services', 'Cryptocurrency', 'Payment Processing', 'Financial Advisory', 'Real Estate Investment', 'Venture Capital']
  },
  {
    name: 'Manufacturing',
    icon: Factory,
    subcategories: ['Automotive', 'Aerospace', 'Electronics', 'Chemicals', 'Food & Beverage', 'Textiles', 'Machinery', 'Steel & Metals', 'Plastics', 'Furniture']
  },
  {
    name: 'Retail',
    icon: ShoppingBag,
    subcategories: ['E-commerce', 'Department Stores', 'Specialty Retail', 'Grocery', 'Fashion', 'Electronics Retail', 'Home & Garden', 'Sporting Goods', 'Jewelry', 'Convenience Stores']
  },
  {
    name: 'Energy',
          icon: BatteryFull,
    subcategories: ['Oil & Gas', 'Renewable Energy', 'Nuclear Power', 'Electric Utilities', 'Energy Storage', 'Energy Trading', 'Energy Services', 'Solar', 'Wind', 'Hydroelectric']
  },
  {
    name: 'Transportation',
    icon: Truck,
    subcategories: ['Logistics', 'Freight', 'Passenger Transport', 'Airlines', 'Railways', 'Shipping', 'Ride Sharing', 'Car Rental', 'Public Transit', 'Infrastructure']
  },
  {
    name: 'Real Estate',
    icon: Home,
    subcategories: ['Commercial Real Estate', 'Residential Development', 'Property Management', 'Real Estate Investment', 'Construction', 'Architecture', 'Facilities Management', 'Land Development', 'Real Estate Services', 'Mortgage Lending']
  },
  {
    name: 'Agriculture',
    icon: Leaf,
    subcategories: ['Crop Farming', 'Livestock', 'Agricultural Technology', 'Food Processing', 'Agricultural Chemicals', 'Seed Production', 'Organic Farming', 'Agricultural Equipment', 'Aquaculture', 'Forestry']
  },
  {
    name: 'Education',
    icon: BookOpen,
    subcategories: ['K-12 Education', 'Higher Education', 'Online Learning', 'Corporate Training', 'Educational Technology', 'Student Services', 'Educational Publishing', 'Test Preparation', 'Special Education', 'Vocational Training']
  },
  {
    name: 'Entertainment',
    icon: Star,
    subcategories: ['Film & Television', 'Music', 'Gaming', 'Publishing', 'Live Events', 'Streaming Services', 'Theme Parks', 'Sports', 'Digital Media', 'Broadcasting']
  },
  {
    name: 'Consulting',
    icon: Briefcase,
    subcategories: ['Management Consulting', 'IT Consulting', 'Financial Consulting', 'Legal Consulting', 'HR Consulting', 'Strategy Consulting', 'Operations Consulting', 'Technology Consulting', 'Risk Consulting', 'Environmental Consulting']
  },
  {
    name: 'Legal Services',
    icon: Scale,
    subcategories: ['Corporate Law', 'Litigation', 'Intellectual Property', 'Employment Law', 'Environmental Law', 'Tax Law', 'Real Estate Law', 'Criminal Law', 'Family Law', 'Immigration Law']
  },
  {
    name: 'Non-Profit',
    icon: Heart,
    subcategories: ['Healthcare Non-Profit', 'Education Non-Profit', 'Environmental Non-Profit', 'Human Rights', 'Animal Welfare', 'Religious Organizations', 'Community Development', 'Arts & Culture', 'International Aid', 'Research Institutes']
  },
  {
    name: 'Other',
    icon: Settings,
    subcategories: ['Government Contracting', 'Defense', 'Space', 'Mining', 'Waste Management', 'Telecommunications', 'Media', 'Advertising', 'Market Research', 'Custom']
  }
];

// Company sizes with revenue ranges
const companySizes = [
  { label: '1-10 employees', revenue: 'Under $1M', risk: 'low' },
  { label: '11-50 employees', revenue: '$1M - $10M', risk: 'low-medium' },
  { label: '51-200 employees', revenue: '$10M - $100M', risk: 'medium' },
  { label: '201-1000 employees', revenue: '$100M - $1B', risk: 'medium-high' },
  { label: '1000+ employees', revenue: '$1B+', risk: 'high' }
];

// Business models
const businessModels = [
  'B2B (Business to Business)',
  'B2C (Business to Consumer)',
  'B2B2C (Business to Business to Consumer)',
  'Marketplace',
  'SaaS (Software as a Service)',
  'E-commerce',
  'Manufacturing',
  'Services',
  'Consulting',
  'Franchise',
  'Non-Profit',
  'Government Contractor',
  'Other'
];

// Regulatory exposure levels
const regulatoryExposure = [
  {
    level: 'Low',
    description: 'Minimal regulatory oversight, primarily local business licenses',
    examples: ['Small retail shops', 'Local services', 'Basic consulting']
  },
  {
    level: 'Medium',
    description: 'Moderate regulatory requirements, industry-specific rules',
    examples: ['Manufacturing', 'Technology', 'Professional services']
  },
  {
    level: 'High',
    description: 'Heavy regulatory oversight, multiple agencies involved',
    examples: ['Healthcare', 'Finance', 'Energy', 'Transportation']
  },
  {
    level: 'Critical',
    description: 'Extensive regulatory framework, constant compliance monitoring',
    examples: ['Pharmaceuticals', 'Banking', 'Nuclear power', 'Defense']
  }
];

// Compliance history options
const complianceHistory = [
  'No previous compliance issues',
  'Minor violations (resolved)',
  'Moderate violations (resolved)',
  'Major violations (resolved)',
  'Currently under investigation',
  'Previous enforcement actions',
  'Voluntary compliance programs',
  'Industry best practices certified'
];

// Data handling practices
const dataHandling = [
  'No personal data collected',
  'Basic customer data (name, email)',
  'Financial data (credit cards, banking)',
  'Health data (HIPAA)',
  'Government data (FISMA)',
  'Educational data (FERPA)',
  'Children\'s data (COPPA)',
  'EU data (GDPR)',
  'California data (CCPA)',
  'Biometric data',
  'Location data',
  'Behavioral data'
];

// Geographic operations
const geographicOperations = [
  'Local (single city/region)',
  'State-wide',
  'Multi-state',
  'National',
  'North America',
  'Europe',
  'Asia-Pacific',
  'Global'
];

// Business policy interests with compliance focus
const businessInterests = [
  {
    category: 'Regulatory Compliance',
    icon: Shield,
    description: 'Stay ahead of regulatory changes and compliance requirements',
    topics: [
      'Environmental Regulations (EPA)',
      'Data Privacy & Security (GDPR, CCPA, HIPAA)',
      'Financial Regulations (Dodd-Frank, SOX)',
      'Healthcare Regulations (FDA, CMS)',
      'Labor & Employment Laws (FLSA, OSHA)',
      'Industry-Specific Rules',
      'International Trade Compliance',
      'Anti-Money Laundering (AML)',
      'Export Controls (ITAR, EAR)',
      'Consumer Protection Laws'
    ]
  },
  {
    category: 'Economic Policy Impact',
    icon: DollarSign,
    description: 'Monitor economic policies affecting your business',
    topics: [
      'Tax Policy Changes',
      'Trade & Tariffs',
      'Economic Stimulus Programs',
      'Inflation & Interest Rates',
      'Supply Chain Disruptions',
      'Labor & Employment Policy',
      'Infrastructure Investment',
      'Energy Policy',
      'Technology Policy',
      'Small Business Programs'
    ]
  },
  {
    category: 'Market Intelligence',
    icon: TrendingUp,
    description: 'Track market trends and competitive landscape',
    topics: [
      'Market Trends & Analysis',
      'Competitive Intelligence',
      'Consumer Behavior Changes',
      'Economic Indicators',
      'Industry Reports',
      'Investment Opportunities',
      'Merger & Acquisition Activity',
      'Market Entry Strategies',
      'Pricing Trends',
      'Supply Chain Intelligence'
    ]
  },
  {
    category: 'Government Relations',
    icon: Building,
    description: 'Navigate government relationships and policy advocacy',
    topics: [
      'Lobbying Activities',
      'Political Contributions',
      'Policy Advocacy',
      'Government Contracts',
      'Regulatory Affairs',
      'Public Affairs',
      'Stakeholder Engagement',
      'Crisis Management',
      'Reputation Management',
      'Industry Associations'
    ]
  },
  {
    category: 'Risk Management',
    icon: AlertTriangle,
    description: 'Identify and mitigate business risks',
    topics: [
      'Regulatory Risk Assessment',
      'Compliance Risk Monitoring',
      'Operational Risk Management',
      'Financial Risk Analysis',
      'Reputational Risk',
      'Cybersecurity Risk',
      'Supply Chain Risk',
      'Legal Risk Management',
      'Environmental Risk',
      'Geopolitical Risk'
    ]
  },
  {
    category: 'Technology & Innovation',
    icon: Cpu,
    description: 'Track technology policy and innovation opportunities',
    topics: [
      'AI & Machine Learning Policy',
      'Cybersecurity Regulations',
      'Digital Transformation',
      'Blockchain & Cryptocurrency',
      '5G & Telecommunications',
      'Quantum Computing',
      'Biotechnology Policy',
      'Clean Energy Technology',
      'Space Technology',
      'Emerging Tech Regulations'
    ]
  }
];

export default function BusinessOnboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic company info
    companyName: '',
    industry: '',
    subcategory: '',
    companySize: '',
    businessModel: '',
    website: '',
    
    // Location
    businessAddress: '',
    city: '',
    state: '',
    zipCode: '',
    geographicOperations: [],
    
    // Contact
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    contactTitle: '',
    
    // Business details
    foundedYear: '',
    revenue: '',
    regulatoryExposure: '',
    complianceHistory: '',
    dataHandling: [],
    
    // Operations
    primaryProducts: '',
    targetMarkets: '',
    keyCompetitors: '',
    majorChallenges: '',
    
    // Interests
    selectedInterests: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [censusData, setCensusData] = useState(null);
  const [censusLoading, setCensusLoading] = useState(false);
  const [censusError, setCensusError] = useState(null);

  const fetchCensusData = async (zip) => {
    setCensusLoading(true);
    setCensusError(null);
    try {
      const [pop, income] = await Promise.all([
        getZipPopulation(zip),
        getZipMedianIncome(zip)
      ]);
      setCensusData({
        population: pop ? pop.population : null,
        medianIncome: income ? income.medianIncome : null,
        name: pop ? pop.name : income ? income.name : null
      });
    } catch (err) {
      setCensusError('Could not load Census data.');
      setCensusData(null);
    } finally {
      setCensusLoading(false);
    }
  };

  const states = [
    'D.C.','AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Fetch Census data for ZIP code in Step 2
    if (field === 'zipCode' && value.length === 5) {
      fetchCensusData(value);
    }
  };

  const handleArrayToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleInterestToggle = (topic) => {
    setFormData(prev => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(topic)
        ? prev.selectedInterests.filter(t => t !== topic)
        : [...prev.selectedInterests, topic]
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (formData.companyName && formData.industry && formData.companySize) {
        setStep(2);
      }
    } else if (step === 2) {
      if (formData.businessAddress && formData.city && formData.state && formData.zipCode) {
        setStep(3);
      }
    } else if (step === 3) {
      if (formData.contactPerson && formData.contactEmail) {
        setStep(4);
      }
    } else if (step === 4) {
      if (formData.regulatoryExposure && formData.complianceHistory) {
        setStep(5);
      }
    } else if (step === 5) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Update user with comprehensive business information
      await User.update({
        name: formData.contactPerson,
        company_name: formData.companyName,
        industry: formData.industry,
        subcategory: formData.subcategory,
        company_size: formData.companySize,
        business_model: formData.businessModel,
        address: `${formData.businessAddress}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        state: formData.state,
        website: formData.website,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone,
        contact_title: formData.contactTitle,
        founded_year: formData.foundedYear,
        revenue: formData.revenue,
        regulatory_exposure: formData.regulatoryExposure,
        compliance_history: formData.complianceHistory,
        data_handling: formData.dataHandling,
        geographic_operations: formData.geographicOperations,
        primary_products: formData.primaryProducts,
        target_markets: formData.targetMarkets,
        key_competitors: formData.keyCompetitors,
        major_challenges: formData.majorChallenges,
        topic_preferences: formData.selectedInterests
      });

      // Complete onboarding
      onComplete({
        companyName: formData.companyName,
        contactPerson: formData.contactPerson,
        industry: formData.industry,
        regulatoryExposure: formData.regulatoryExposure,
        interests: formData.selectedInterests
      });
    } catch (error) {
      console.error('Error updating business info:', error);
      alert('Error saving business information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isStepValid = () => {
    if (step === 1) {
      return formData.companyName && formData.industry && formData.companySize;
    } else if (step === 2) {
      return formData.businessAddress && formData.city && formData.state && formData.zipCode;
    } else if (step === 3) {
      return formData.contactPerson && formData.contactEmail;
    } else if (step === 4) {
      return formData.regulatoryExposure && formData.complianceHistory;
    }
    return true;
  };

  const getSelectedIndustry = () => {
    return industries.find(ind => ind.name === formData.industry);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="companyName" className="terminal-text">Company Name *</Label>
        <Input
          id="companyName"
          type="text"
          placeholder="Your company name"
          value={formData.companyName}
          onChange={(e) => handleInputChange('companyName', e.target.value)}
          className="terminal-input border-gray-600 bg-gray-800 text-white"
          required
        />
      </div>

      <div>
        <Label htmlFor="industry" className="terminal-text">Primary Industry *</Label>
        <select
          id="industry"
          value={formData.industry}
          onChange={(e) => {
            handleInputChange('industry', e.target.value);
            handleInputChange('subcategory', '');
          }}
          className="terminal-input border-gray-600 bg-gray-800 text-white w-full h-10 px-3 py-2 rounded-md"
          required
        >
          <option value="">Select your primary industry</option>
          {industries.map(industry => (
            <option key={industry.name} value={industry.name}>
              {industry.name}
            </option>
          ))}
        </select>
      </div>

      {formData.industry && (
        <div>
          <Label htmlFor="subcategory" className="terminal-text">Industry Subcategory</Label>
          <select
            id="subcategory"
            value={formData.subcategory}
            onChange={(e) => handleInputChange('subcategory', e.target.value)}
            className="terminal-input border-gray-600 bg-gray-800 text-white w-full h-10 px-3 py-2 rounded-md"
          >
            <option value="">Select subcategory (optional)</option>
            {getSelectedIndustry()?.subcategories.map(sub => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <Label htmlFor="companySize" className="terminal-text">Company Size *</Label>
        <select
          id="companySize"
          value={formData.companySize}
          onChange={(e) => handleInputChange('companySize', e.target.value)}
          className="terminal-input border-gray-600 bg-gray-800 text-white w-full h-10 px-3 py-2 rounded-md"
          required
        >
          <option value="">Select company size</option>
          {companySizes.map(size => (
            <option key={size.label} value={size.label}>
              {size.label} ({size.revenue})
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="businessModel" className="terminal-text">Business Model</Label>
        <select
          id="businessModel"
          value={formData.businessModel}
          onChange={(e) => handleInputChange('businessModel', e.target.value)}
          className="terminal-input border-gray-600 bg-gray-800 text-white w-full h-10 px-3 py-2 rounded-md"
        >
          <option value="">Select business model</option>
          {businessModels.map(model => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="website" className="terminal-text">Website (Optional)</Label>
        <Input
          id="website"
          type="url"
          placeholder="https://yourcompany.com"
          value={formData.website}
          onChange={(e) => handleInputChange('website', e.target.value)}
          className="terminal-input border-gray-600 bg-gray-800 text-white"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="businessAddress" className="terminal-text">Business Address *</Label>
        <Input
          id="businessAddress"
          type="text"
          placeholder="123 Business Street"
          value={formData.businessAddress}
          onChange={(e) => handleInputChange('businessAddress', e.target.value)}
          className="terminal-input border-gray-600 bg-gray-800 text-white"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city" className="terminal-text">City *</Label>
          <Input
            id="city"
            type="text"
            placeholder="City"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="terminal-input border-gray-600 bg-gray-800 text-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="state" className="terminal-text">State *</Label>
          <select
            id="state"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className="terminal-input border-gray-600 bg-gray-800 text-white w-full h-10 px-3 py-2 rounded-md"
            required
          >
            <option value="">Select state</option>
            {states.map(state => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="zipCode" className="terminal-text">ZIP Code *</Label>
        <Input
          id="zipCode"
          type="text"
          placeholder="12345"
          value={formData.zipCode}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={5}
          onChange={(e) => {
            let value = e.target.value.replace(/[^0-9]/g, '');
            if (value.length > 5) value = value.slice(0, 5);
            handleInputChange('zipCode', value);
          }}
          className="terminal-input border-gray-600 bg-gray-800 text-white"
          required
        />
      </div>
      {censusLoading && (
        <div className="text-blue-400 text-sm mt-2">Loading Census data...</div>
      )}
      {censusError && (
        <div className="text-red-400 text-sm mt-2">{censusError}</div>
      )}
      {censusData && (
        <div className="bg-gray-800 border border-blue-700 rounded-lg p-4 mt-4">
          <div className="text-blue-300 font-semibold mb-1">Community Snapshot (Census)</div>
          <div className="text-sm text-gray-200">{censusData.name}</div>
          <div className="text-sm text-gray-200">Population: {censusData.population ? censusData.population.toLocaleString() : 'N/A'}</div>
          <div className="text-sm text-gray-200">Median Household Income: {censusData.medianIncome ? `$${parseInt(censusData.medianIncome).toLocaleString()}` : 'N/A'}</div>
        </div>
      )}

      <div>
        <Label className="terminal-text mb-4 block">Geographic Operations (Select all that apply)</Label>
        <div className="grid grid-cols-2 gap-2">
          {geographicOperations.map(geo => (
            <label key={geo} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.geographicOperations.includes(geo)}
                onChange={() => handleArrayToggle('geographicOperations', geo)}
                className="rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm terminal-muted">{geo}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="contactPerson" className="terminal-text">Primary Contact Name *</Label>
        <Input
          id="contactPerson"
          type="text"
          placeholder="John Smith"
          value={formData.contactPerson}
          onChange={(e) => handleInputChange('contactPerson', e.target.value)}
          className="terminal-input border-gray-600 bg-gray-800 text-white"
          required
        />
      </div>

      <div>
        <Label htmlFor="contactTitle" className="terminal-text">Contact Title</Label>
        <Input
          id="contactTitle"
          type="text"
          placeholder="Compliance Officer, CEO, etc."
          value={formData.contactTitle}
          onChange={(e) => handleInputChange('contactTitle', e.target.value)}
          className="terminal-input border-gray-600 bg-gray-800 text-white"
        />
      </div>

      <div>
        <Label htmlFor="contactEmail" className="terminal-text">Business Email *</Label>
        <Input
          id="contactEmail"
          type="email"
          placeholder="john@company.com"
          value={formData.contactEmail}
          onChange={(e) => handleInputChange('contactEmail', e.target.value)}
          className="terminal-input border-gray-600 bg-gray-800 text-white"
          required
        />
      </div>

      <div>
        <Label htmlFor="contactPhone" className="terminal-text">Business Phone (Optional)</Label>
        <Input
          id="contactPhone"
          type="tel"
          placeholder="(555) 123-4567"
          value={formData.contactPhone}
          onChange={(e) => handleInputChange('contactPhone', e.target.value)}
          className="terminal-input border-gray-600 bg-gray-800 text-white"
        />
      </div>

      <div>
        <Label htmlFor="foundedYear" className="terminal-text">Year Founded</Label>
        <Input
          id="foundedYear"
          type="number"
          placeholder="2020"
          min="1800"
          max={new Date().getFullYear()}
          value={formData.foundedYear}
          onChange={(e) => handleInputChange('foundedYear', e.target.value)}
          className="terminal-input border-gray-600 bg-gray-800 text-white"
        />
      </div>

      <div>
        <Label htmlFor="revenue" className="terminal-text">Annual Revenue Range</Label>
        <select
          id="revenue"
          value={formData.revenue}
          onChange={(e) => handleInputChange('revenue', e.target.value)}
          className="terminal-input border-gray-600 bg-gray-800 text-white w-full h-10 px-3 py-2 rounded-md"
        >
          <option value="">Select revenue range</option>
          <option value="Under $1M">Under $1M</option>
          <option value="$1M - $10M">$1M - $10M</option>
          <option value="$10M - $50M">$10M - $50M</option>
          <option value="$50M - $100M">$50M - $100M</option>
          <option value="$100M - $500M">$100M - $500M</option>
          <option value="$500M - $1B">$500M - $1B</option>
          <option value="$1B+">$1B+</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="regulatoryExposure" className="terminal-text">Regulatory Exposure Level *</Label>
        <select
          id="regulatoryExposure"
          value={formData.regulatoryExposure}
          onChange={(e) => handleInputChange('regulatoryExposure', e.target.value)}
          className="terminal-input border-gray-600 bg-gray-800 text-white w-full h-10 px-3 py-2 rounded-md"
          required
        >
          <option value="">Select regulatory exposure level</option>
          {regulatoryExposure.map(level => (
            <option key={level.level} value={level.level}>
              {level.level} - {level.description}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="complianceHistory" className="terminal-text">Compliance History *</Label>
        <select
          id="complianceHistory"
          value={formData.complianceHistory}
          onChange={(e) => handleInputChange('complianceHistory', e.target.value)}
          className="terminal-input border-gray-600 bg-gray-800 text-white w-full h-10 px-3 py-2 rounded-md"
          required
        >
          <option value="">Select compliance history</option>
          {complianceHistory.map(history => (
            <option key={history} value={history}>
              {history}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label className="terminal-text mb-4 block">Data Handling Practices (Select all that apply)</Label>
        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
          {dataHandling.map(data => (
            <label key={data} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.dataHandling.includes(data)}
                onChange={() => handleArrayToggle('dataHandling', data)}
                className="rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm terminal-muted">{data}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="primaryProducts" className="terminal-text">Primary Products/Services</Label>
        <textarea
          id="primaryProducts"
          placeholder="Describe your main products or services..."
          value={formData.primaryProducts}
          onChange={(e) => handleInputChange('primaryProducts', e.target.value)}
          className="terminal-input border-gray-600 bg-gray-800 text-white w-full h-20 px-3 py-2 rounded-md resize-none"
        />
      </div>

      <div>
        <Label htmlFor="targetMarkets" className="terminal-text">Target Markets</Label>
        <textarea
          id="targetMarkets"
          placeholder="Describe your target markets or customer segments..."
          value={formData.targetMarkets}
          onChange={(e) => handleInputChange('targetMarkets', e.target.value)}
          className="terminal-input border-gray-600 bg-gray-800 text-white w-full h-20 px-3 py-2 rounded-md resize-none"
        />
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div>
        <Label className="terminal-text mb-4 block">Policy Interests & Compliance Focus (Select all that apply)</Label>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {businessInterests.map((category) => {
            const IconComponent = category.icon;
            return (
              <div key={category.category} className="border border-gray-600 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <IconComponent className="w-5 h-5 text-blue-400 mr-2" />
                  <h4 className="font-medium terminal-text">{category.category}</h4>
                </div>
                <p className="text-sm terminal-muted mb-3">{category.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {category.topics.map((topic) => (
                    <label key={topic} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.selectedInterests.includes(topic)}
                        onChange={() => handleInterestToggle(topic)}
                        className="rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-sm terminal-muted">{topic}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <Label htmlFor="keyCompetitors" className="terminal-text">Key Competitors</Label>
        <textarea
          id="keyCompetitors"
          placeholder="List your main competitors..."
          value={formData.keyCompetitors}
          onChange={(e) => handleInputChange('keyCompetitors', e.target.value)}
          className="terminal-input border-gray-600 bg-gray-800 text-white w-full h-20 px-3 py-2 rounded-md resize-none"
        />
      </div>

      <div>
        <Label htmlFor="majorChallenges" className="terminal-text">Major Business Challenges</Label>
        <textarea
          id="majorChallenges"
          placeholder="Describe your biggest business challenges, especially related to compliance..."
          value={formData.majorChallenges}
          onChange={(e) => handleInputChange('majorChallenges', e.target.value)}
          className="terminal-input border-gray-600 bg-gray-800 text-white w-full h-20 px-3 py-2 rounded-md resize-none"
        />
      </div>
    </div>
  );

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Company Information';
      case 2: return 'Business Location';
      case 3: return 'Contact & Business Details';
      case 4: return 'Compliance Profile';
      case 5: return 'Policy Interests & Challenges';
      default: return 'Business Setup';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return 'Tell us about your company';
      case 2: return 'Where do you operate?';
      case 3: return 'Who should we contact and basic business info';
      case 4: return 'Help us understand your compliance needs';
      case 5: return 'What policy areas matter most to your business?';
      default: return 'Complete your business profile';
    }
  };

  return (
    <Card className="terminal-surface border-gray-700 terminal-glow w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl terminal-text">{getStepTitle()}</CardTitle>
        <p className="text-center terminal-muted mt-2">
          {getStepDescription()}
        </p>
        
        {/* Progress indicator */}
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`w-3 h-3 rounded-full ${
                  stepNumber <= step ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}

          <div className="flex justify-between items-center pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Back
            </Button>
            
            <Button
              type="submit"
              disabled={!isStepValid() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Setting up...
                </div>
              ) : step === 5 ? (
                <div className="flex items-center">
                  Complete Setup
                  <CheckCircle className="w-4 h-4 ml-2" />
                </div>
              ) : (
                <div className="flex items-center">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 