import React, { useState, useEffect } from 'react';
import { User } from '../entities/User';
import CitizenDashboard from '../components/dashboards/CitizenDashboard';
import OrganizationDashboard from '../components/dashboards/OrganizationDashboard';
import RepresentativeDashboard from '../components/dashboards/RepresentativeDashboard';
import { Skeleton } from '../components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { User as UserIcon, Building, Briefcase, Lock } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import Layout from '../Layout';
import Link from 'next/link';

const ADMIN_EMAIL = 'anoah4049@gmail.com';

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Admin login flow
      if (formData.email === ADMIN_EMAIL) {
        const res = await fetch('/api/admin-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        const data = await res.json();
        if (data.success && data.isAdmin) {
          // Clear all user/session/view_as data
          localStorage.removeItem('govpulse_user');
          localStorage.removeItem('govpulse_admin_view_as');
          localStorage.removeItem('govpulse_session');
          // Set user as admin in localStorage
          localStorage.setItem('govpulse_user', JSON.stringify({
            email: formData.email,
            name: 'Admin User',
            account_type: 'Admin',
            onboarding_completed: true
          }));
          window.location.reload();
          return;
        } else {
          setError('Invalid admin credentials.');
          setIsLoading(false);
          return;
        }
      }
      // Regular user login flow
      const user = await User.authenticate(formData.email, formData.password);
      onLogin(user);
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center political-terminal">
      <Card className="terminal-surface border-gray-700 terminal-glow w-full max-w-md mx-4 p-8">
        <CardHeader className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl terminal-text mb-2">Welcome Back</CardTitle>
          <p className="terminal-muted">Sign in to your GovPulse account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Enter your password"
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm terminal-muted">
              Don't have an account?{' '}
              <Link href="/signup" className="text-blue-400 hover:text-blue-300">
                Create one here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function LoginPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      
      // If user is already authenticated and has completed onboarding, show dashboard
      if (currentUser && currentUser.account_type && await User.isOnboardingCompleted()) {
        setUser(currentUser);
      } else if (currentUser && currentUser.account_type) {
        // User exists but needs onboarding - redirect to signup flow
        window.location.href = '/signup';
        return;
      } else {
        // No user or no account type - show login form
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

  const handleLogin = async (userData) => {
    setUser(userData);
    
    // Check if user needs onboarding
    const onboardingCompleted = await User.isOnboardingCompleted();
    if (!onboardingCompleted) {
      // Redirect to signup flow for onboarding
      window.location.href = '/signup';
      return;
    }
  };

  if (isLoading) {
    return (
      <Layout currentPage="signin">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="space-y-4">
            <Skeleton className="h-12 w-48 bg-gray-700" />
            <Skeleton className="h-8 w-32 bg-gray-700" />
          </div>
        </div>
      </Layout>
    );
  }

  // Show login form if user is not authenticated
  if (!user) {
    return (
      <Layout currentPage="signin">
        <div className="flex items-center justify-center min-h-screen">
          <LoginForm onLogin={handleLogin} />
        </div>
      </Layout>
    );
  }

  // Show dashboard for authenticated users
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