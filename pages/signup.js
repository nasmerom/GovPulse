import React, { useState, useEffect } from 'react';
import { User } from '../entities/User';
import CitizenDashboard from '../components/dashboards/CitizenDashboard';
import OrganizationDashboard from '../components/dashboards/OrganizationDashboard';
import RepresentativeDashboard from '../components/dashboards/RepresentativeDashboard';
import AddressCollection from '../components/onboarding/AddressCollection';
import BusinessOnboarding from '../components/onboarding/BusinessOnboarding';
import RepresentativeSetup from '../components/onboarding/RepresentativeSetup';
import TopicSelection from '../components/onboarding/TopicSelection';
import { Skeleton } from '../components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { User as UserIcon, Building, Briefcase, ArrowRight, CheckCircle } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import Layout from '../Layout';
import Link from 'next/link';

// Step 1: Role Selection with distinct experiences
const RoleSelection = ({ onSelect }) => {
  const roles = [
    {
      name: 'Citizen',
      icon: UserIcon,
      description: 'Stay informed on issues and representatives that matter to you.',
      color: 'blue',
      bgColor: 'bg-blue-900/60',
      borderColor: 'border-blue-500',
      hoverBorderColor: 'hover:border-blue-400',
      textColor: 'text-blue-400',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      features: [
        'Personalized political news',
        'Representative tracking',
        'Local issue monitoring',
        'Community updates'
      ],
      onboardingSteps: ['Quick Setup', 'Address Collection', 'Topic Selection']
    },
    // Business and Representative roles are hidden for MVP, but code is kept for future use
    // {
    //   name: 'Business',
    //   icon: Building,
    //   description: 'Enterprise political intelligence with AI-powered compliance monitoring.',
    //   featured: true,
    //   badge: 'Enterprise',
    //   color: 'green',
    //   bgColor: 'bg-gradient-to-br from-green-900/80 to-green-800/60',
    //   borderColor: 'border-green-500',
    //   hoverBorderColor: 'hover:border-green-400',
    //   textColor: 'text-green-300',
    //   buttonColor: 'bg-green-600 hover:bg-green-700',
    //   features: [
    //     'Regulatory tracking',
    //     'Market impact analysis',
    //     'Compliance monitoring',
    //     '24/7 support'
    //   ],
    //   onboardingSteps: ['Business Profile', 'Address Collection', 'Topic Selection']
    // },
    // {
    //   name: 'Representative',
    //   icon: Briefcase,
    //   description: 'Access advanced analytics, correspondence, and strategic insights.',
    //   color: 'purple',
    //   bgColor: 'bg-purple-900/60',
    //   borderColor: 'border-purple-500',
    //   hoverBorderColor: 'hover:border-purple-400',
    //   textColor: 'text-purple-400',
    //   buttonColor: 'bg-purple-600 hover:bg-purple-700',
    //   features: [
    //     'Constituent correspondence',
    //     'Voting analytics',
    //     'Strategic insights',
    //     'Performance tracking'
    //   ],
    //   onboardingSteps: ['Verification', 'Address Collection', 'Topic Selection']
    // },
  ];

  // Clear all local/session storage before starting a new signup
  const handleRoleClick = (roleName) => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    onSelect(roleName);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900">
      <Card className="terminal-surface border-gray-700 terminal-glow w-full max-w-7xl mx-4">
        <CardHeader className="text-center mb-8">
          <CardTitle className="text-3xl terminal-text mb-2">Choose Your Experience</CardTitle>
          <p className="terminal-muted text-lg">Select the account type that best fits your needs</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {roles.map(role => (
              <div
                key={role.name}
                className={`p-8 rounded-xl transition-all cursor-pointer border-2 hover:scale-105 ${
                  role.featured
                    ? `${role.bgColor} ${role.borderColor} ${role.hoverBorderColor}`
                    : `${role.bgColor} border-gray-700 ${role.hoverBorderColor}`
                }`}
              >
                {role.badge && (
                  <div className="inline-block bg-green-600 text-white text-xs px-3 py-1 rounded-full mb-4">
                    {role.badge}
                  </div>
                )}
                <div className="text-center mb-6">
                  <role.icon className={`w-20 h-20 mx-auto mb-4 ${role.featured ? 'text-green-300' : role.textColor}`} />
                  <h3 className={`text-2xl font-bold mb-2 ${role.featured ? 'text-white' : 'terminal-text'}`}>{role.name}</h3>
                  <p className={`text-base ${role.featured ? 'text-green-200' : 'terminal-muted'}`}>{role.description}</p>
                </div>
                {/* Features */}
                <div className="mb-6">
                  <h4 className={`text-sm font-semibold mb-3 ${role.featured ? 'text-green-300' : role.textColor}`}>Key Features:</h4>
                  <ul className="space-y-2">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm terminal-muted">
                        <CheckCircle className={`w-4 h-4 mr-2 ${role.featured ? 'text-green-400' : role.textColor}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Onboarding Steps */}
                <div className="mb-6">
                  <h4 className={`text-sm font-semibold mb-3 ${role.featured ? 'text-green-300' : role.textColor}`}>Setup Process:</h4>
                  <div className="flex flex-wrap items-center gap-2">
                    {role.onboardingSteps.map((step, index) => (
                      <div key={index} className="flex items-center">
                        <div className={`text-xs px-2 py-1 rounded ${
                          role.featured
                            ? 'bg-green-800 text-green-200'
                            : role.color === 'blue'
                              ? 'bg-blue-800 text-blue-200'
                              : role.color === 'purple'
                                ? 'bg-purple-800 text-purple-200'
                                : 'bg-gray-800 text-gray-200'
                        }`}>
                          {step}
                        </div>
                        {index < role.onboardingSteps.length - 1 && (
                          <ArrowRight className={`w-3 h-3 mx-1 ${role.featured ? 'text-green-400' : role.textColor}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Single CTA Button */}
                <Button
                  className={`w-full ${role.buttonColor} text-white`}
                  onClick={() => handleRoleClick(role.name)}
                >
                  Get Started as {role.name}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Step 2: Account Creation Form (simplified for Citizen, enhanced for others)
const SignupForm = ({ onSignup, accountType, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Create new user account
      const user = await User.create({
        name: formData.name,
        email: formData.email,
        account_type: accountType,
        onboarding_completed: false
      });

      // Authenticate the user
      const authenticatedUser = await User.authenticate(formData.email, formData.password);
      onSignup(authenticatedUser);
    } catch (error) {
      setError('Error creating account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getAccountTypeInfo = () => {
    switch (accountType) {
      case 'Business':
        return {
          title: 'Business Account Setup',
          description: 'Create your enterprise political intelligence account',
          icon: Building,
          color: 'green',
          bgColor: 'bg-green-600',
          buttonColor: 'bg-green-600 hover:bg-green-700',
          subtitle: 'Next: Complete your business profile'
        };
      case 'Representative':
        return {
          title: 'Representative Account Setup',
          description: 'Create your representative account for advanced analytics',
          icon: Briefcase,
          color: 'purple',
          bgColor: 'bg-purple-600',
          buttonColor: 'bg-purple-600 hover:bg-purple-700',
          subtitle: 'Next: Complete verification process'
        };
      default:
        return {
          title: 'Citizen Account Setup',
          description: 'Create your citizen account for personalized insights',
          icon: UserIcon,
          color: 'blue',
          bgColor: 'bg-blue-600',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
          subtitle: 'Next: Add your address and preferences'
        };
    }
  };

  const accountInfo = getAccountTypeInfo();
  const IconComponent = accountInfo.icon;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
      <Card className="terminal-surface border-gray-700 terminal-glow w-full max-w-md mx-4">
        <CardHeader className="text-center mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-gray-400 hover:text-white"
            >
              ← Back to Selection
            </Button>
          </div>
          <div className={`w-16 h-16 ${accountInfo.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl terminal-text mb-2">{accountInfo.title}</CardTitle>
          <p className="terminal-muted mb-2">{accountInfo.description}</p>
          <p className={`text-sm ${
            accountInfo.color === 'blue' ? 'text-blue-400' :
            accountInfo.color === 'green' ? 'text-green-400' :
            'text-purple-400'
          }`}>{accountInfo.subtitle}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium terminal-text mb-2">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                className="bg-gray-800 border-gray-600 terminal-text"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium terminal-text mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-600 terminal-text"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium terminal-text mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Create a password"
                className="bg-gray-800 border-gray-600 terminal-text"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium terminal-text mb-2">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm your password"
                className="bg-gray-800 border-gray-600 terminal-text"
                required
              />
            </div>
            {error && (
              <div className="text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className={`w-full ${accountInfo.buttonColor} text-white`}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : `Create ${accountType} Account`}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm terminal-muted">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300">
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Onboarding Progress Component
const OnboardingProgress = ({ currentStep, totalSteps, accountType }) => {
  const steps = {
    'Citizen': ['Address Collection', 'Topic Selection'],
    'Business': ['Business Profile', 'Address Collection', 'Topic Selection'],
    'Representative': ['Verification', 'Address Collection', 'Topic Selection']
  };

  const accountSteps = steps[accountType] || steps['Citizen'];
  const progress = ((currentStep + 1) / accountSteps.length) * 100;

  const getProgressColor = () => {
    switch (accountType) {
      case 'Business': return 'bg-green-600';
      case 'Representative': return 'bg-purple-600';
      default: return 'bg-blue-600';
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm terminal-muted">Step {currentStep + 1} of {accountSteps.length}</span>
        <span className="text-sm terminal-text">{accountSteps[currentStep]}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className={`${getProgressColor()} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState('role-selection'); // 'role-selection', 'signup-form', 'onboarding', 'dashboard'
  const [selectedAccountType, setSelectedAccountType] = useState(null);
  const [user, setUser] = useState(null);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Remove auto-check for existing user/session on mount
  // Only start signup flow for the selected account type

  const handleRoleSelect = (accountType) => {
    setSelectedAccountType(accountType);
    setCurrentStep('signup-form');
  };

  const handleBackToRoleSelection = () => {
    setSelectedAccountType(null);
    setCurrentStep('role-selection');
  };

  const handleSignup = async (userData) => {
    setUser(userData);
    setCurrentStep('onboarding');
    setOnboardingStep(0);
  };

  const handleOnboardingComplete = async (data) => {
    const onboardingFlows = {
      'Citizen': ['address', 'topics'],
      'Business': ['business', 'address', 'topics'],
      'Representative': ['verification', 'address', 'topics']
    };

    const currentFlow = onboardingFlows[user.account_type] || onboardingFlows['Citizen'];
    const nextStep = onboardingStep + 1;
    
    if (nextStep < currentFlow.length) {
      setOnboardingStep(nextStep);
    } else {
      // Complete onboarding
      await User.update({ onboarding_completed: true });
      setCurrentStep('dashboard');
    }
  };

  const renderOnboardingStep = () => {
    if (!user || !user.account_type) return null;

    const onboardingFlows = {
      'Citizen': ['address', 'topics'],
      'Business': ['business', 'address', 'topics'],
      'Representative': ['verification', 'address', 'topics']
    };

    const currentFlow = onboardingFlows[user.account_type] || onboardingFlows['Citizen'];
    const currentStepType = currentFlow[onboardingStep];

    switch (currentStepType) {
      case 'business':
        return <BusinessOnboarding onComplete={handleOnboardingComplete} />;
      case 'verification':
        return <RepresentativeSetup onComplete={handleOnboardingComplete} />;
      case 'address':
        return <AddressCollection onComplete={handleOnboardingComplete} />;
      case 'topics':
        return <TopicSelection onComplete={handleOnboardingComplete} user={user} />;
      default:
        return <AddressCollection onComplete={handleOnboardingComplete} />;
    }
  };

  // Show dashboard for completed users
  if (currentStep === 'dashboard' && user) {
    return (
      <AppLayout user={user}>
        <div className="px-8 py-8">
          {(() => {
            switch (user.account_type) {
              case 'Citizen':
                return <CitizenDashboard user={user} />;
              case 'Business':
                return <OrganizationDashboard user={user} />;
              case 'Representative':
                return <RepresentativeDashboard user={user} />;
              default:
                return <CitizenDashboard user={user} />;
            }
          })()}
        </div>
      </AppLayout>
    );
  }

  // Show onboarding
  if (currentStep === 'onboarding') {
    return (
      <Layout currentPage="signup">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <OnboardingProgress 
              currentStep={onboardingStep} 
              totalSteps={3} 
              accountType={user.account_type}
            />
            {renderOnboardingStep()}
          </div>
        </div>
      </Layout>
    );
  }

  // Show signup form
  if (currentStep === 'signup-form') {
    return (
      <Layout currentPage="signup">
        <SignupForm 
          onSignup={handleSignup} 
          accountType={selectedAccountType}
          onBack={handleBackToRoleSelection}
        />
      </Layout>
    );
  }

  // Show role selection (default)
  return (
    <Layout currentPage="signup">
      <RoleSelection onSelect={handleRoleSelect} />
    </Layout>
  );
} 