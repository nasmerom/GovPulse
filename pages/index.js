import React, { useState, useEffect } from 'react';
import { User } from '../entities/User';
import CitizenDashboard from '../components/dashboards/CitizenDashboard';
import OrganizationDashboard from '../components/dashboards/OrganizationDashboard';
import RepresentativeDashboard from '../components/dashboards/RepresentativeDashboard';
import { Skeleton } from '../components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  User as UserIcon, 
  Building, 
  Briefcase, 
  Lock, 
  UserPlus, 
  BarChart3, 
  FileText, 
  TrendingUp,
  Shield,
  Globe,
  Zap
} from 'lucide-react';
import AppLayout from '../components/AppLayout';
import Layout from '../Layout';
import Link from 'next/link';

const LandingHero = () => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-6xl font-bold terminal-text mb-6">
        GovPulse
      </h1>
      <p className="text-xl terminal-muted mb-8 max-w-2xl mx-auto">
        Your comprehensive political intelligence platform. Stay informed on government activities, 
        legislation, and political events that matter to you.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/signup">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
            <UserPlus className="w-5 h-5 mr-2" />
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, color = "blue" }) => {
  const colorClasses = {
    blue: "text-blue-400",
    green: "text-green-400", 
    purple: "text-purple-400",
    orange: "text-orange-400"
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
      <Icon className={`w-12 h-12 ${colorClasses[color]} mb-4`} />
      <h3 className="text-xl font-semibold terminal-text mb-2">{title}</h3>
      <p className="terminal-muted">{description}</p>
    </div>
  );
};

const UserTypeCard = ({ icon: Icon, title, description, features, color = "blue", href }) => {
  const colorClasses = {
    blue: "border-blue-500 hover:border-blue-400 bg-blue-900/20",
    green: "border-green-500 hover:border-green-400 bg-green-900/20",
    purple: "border-purple-500 hover:border-purple-400 bg-purple-900/20"
  };

  return (
    <Link href={href}>
      <div className={`border rounded-lg p-6 hover:bg-gray-800/30 transition-all cursor-pointer ${colorClasses[color]}`}>
        <Icon className={`w-16 h-16 ${colorClasses[color].replace('border-', 'text-').replace('/20', '')} mb-4`} />
        <h3 className="text-2xl font-bold terminal-text mb-2">{title}</h3>
        <p className="terminal-muted mb-4">{description}</p>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm terminal-muted">
              <Zap className="w-4 h-4 mr-2 text-blue-400" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
};

const LandingPage = () => {
  return (
    <div className="min-h-screen political-terminal">
      <div className="container mx-auto px-4 py-12">
        <LandingHero />
        
        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold terminal-text text-center mb-8">
            Powerful Features for Every User
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={BarChart3}
              title="Real-time Analytics"
              description="Track legislation, votes, and political events as they happen"
              color="blue"
            />
            <FeatureCard
              icon={FileText}
              title="Comprehensive Data"
              description="Access detailed information on bills, committees, and representatives"
              color="green"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Market Intelligence"
              description="Monitor regulatory changes and their impact on your business"
              color="purple"
            />
            <FeatureCard
              icon={Shield}
              title="Enterprise Security"
              description="Bank-grade security for sensitive political intelligence data"
              color="orange"
            />
            <FeatureCard
              icon={Globe}
              title="Global Coverage"
              description="Track federal, state, and local government activities"
              color="blue"
            />
            <FeatureCard
              icon={Zap}
              title="AI-Powered Insights"
              description="Get intelligent recommendations and predictive analytics"
              color="green"
            />
          </div>
        </div>

        {/* User Types Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold terminal-text text-center mb-8">
            Ready to Go(v), Choose Your Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <UserTypeCard
              icon={UserIcon}
              title="Citizen"
              description="Stay informed on issues and representatives that matter to you"
              features={[
                "Personalized political news",
                "Representative tracking",
                "Local issue monitoring",
                "Community updates"
              ]}
              color="blue"
              href="/signup"
            />
            <UserTypeCard
              icon={Building}
              title="Business"
              description="Enterprise political intelligence with AI-powered compliance monitoring"
              features={[
                "Regulatory tracking",
                "Market impact analysis",
                "Compliance monitoring",
                "24/7 support"
              ]}
              color="green"
              href="/signup"
            />
            <UserTypeCard
              icon={Briefcase}
              title="Representative"
              description="Access advanced analytics, correspondence, and strategic insights"
              features={[
                "Constituent correspondence",
                "Voting analytics",
                "Strategic insights",
                "Performance tracking"
              ]}
              color="purple"
              href="/signup"
            />
          </div>
        </div>

        {/* Remove CTA Section */}
      </div>
    </div>
  );
};

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      
      // If user is already authenticated and has completed onboarding, show dashboard
      if (currentUser && currentUser.account_type && await User.isOnboardingCompleted()) {
        setUser(currentUser);
      } else {
        // Show landing page for new users or incomplete onboarding
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <Layout currentPage="home">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="space-y-4">
            <Skeleton className="h-12 w-48 bg-gray-700" />
            <Skeleton className="h-8 w-32 bg-gray-700" />
          </div>
        </div>
      </Layout>
    );
  }

  // Show dashboard for authenticated users with completed onboarding
  if (user) {
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

  // Show landing page for new users or incomplete onboarding
  return (
    <Layout currentPage="home">
      <LandingPage />
    </Layout>
  );
} 