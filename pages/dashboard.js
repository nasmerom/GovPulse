import React, { useState, useEffect } from 'react';
import { User } from '../entities/User';
import AppLayout from '../components/AppLayout';
import CitizenDashboard from '../components/dashboards/CitizenDashboard';
import OrganizationDashboard from '../components/dashboards/OrganizationDashboard';
import RepresentativeDashboard from '../components/dashboards/RepresentativeDashboard';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <AppLayout user={user}>
      <div className="px-8 py-8">
        {(() => {
          switch (user.account_type) {
            case 'Citizen':
              return <CitizenDashboard user={user} />;
            case 'Organizations':
              return <OrganizationDashboard user={user} />;
            case 'Representative':
              return <RepresentativeDashboard user={user} />;
            default:
              return <div>Please select a role</div>;
          }
        })()}
      </div>
    </AppLayout>
  );
} 