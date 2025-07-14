import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import BusinessLogin from '../components/auth/BusinessLogin';
import BusinessOnboarding from '../components/onboarding/BusinessOnboarding';
import { User } from '../entities/User';
import AppLayout from '../components/AppLayout';
import OrganizationDashboard from '../components/dashboards/OrganizationDashboard';

export default function BusinessLoginPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      if (currentUser.account_type === 'Business') {
        const onboardingCompleted = await User.isOnboardingCompleted();
        setNeedsOnboarding(!onboardingCompleted);
      }
    } catch (error) {
      console.error('Error checking user status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = async (userData) => {
    setUser(userData);
    
    // Check if user needs onboarding
    if (userData.account_type === 'Business') {
      const onboardingCompleted = await User.isOnboardingCompleted();
      setNeedsOnboarding(!onboardingCompleted);
    }
  };

  const handleOnboardingComplete = async (data) => {
    setNeedsOnboarding(false);
    
    // Re-fetch user data after onboarding
    try {
      const updatedUser = await User.me();
      setUser(updatedUser);
    } catch (error) {
      console.error('Error fetching updated user:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-blue-200">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is already logged in and has completed onboarding, show dashboard
  if (user?.account_type === 'Business' && !needsOnboarding) {
    return (
      <AppLayout user={user}>
        <div className="px-8 py-8">
          <OrganizationDashboard user={user} />
        </div>
      </AppLayout>
    );
  }

  // If user needs onboarding, show business onboarding
  if (user?.account_type === 'Business' && needsOnboarding) {
    return <BusinessOnboarding onComplete={handleOnboardingComplete} />;
  }

  // Show business login
  return <BusinessLogin onLoginSuccess={handleLoginSuccess} />;
} 