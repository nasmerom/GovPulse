import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Politician } from '../entities/Politician';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { User, Landmark, TrendingUp, Briefcase, Handshake, Gem, Rss, ArrowLeft } from "lucide-react";
import AppLayout from '../components/AppLayout';
import { User as UserEntity } from '../entities/User';
import { formatFullName } from '../utils/formatName';

// Placeholder components - these would be created separately
const PoliticianHeader = ({ politician }) => (
  <Card className="terminal-surface border-gray-700 mb-6">
    <CardContent className="p-6">
      <div className="flex items-start gap-6">
        <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center">
          <User className="w-12 h-12 text-gray-300" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold terminal-text mb-2">{formatFullName(politician)}</h1>
          <p className="text-lg terminal-muted mb-2">{politician.position}</p>
          <div className="flex items-center gap-4 text-sm terminal-muted">
            <span>{politician.party}</span>
            <span>•</span>
            <span>{politician.state}</span>
            {politician.district && (
              <>
                <span>•</span>
                <span>District {politician.district}</span>
              </>
            )}
          </div>
          {politician.approval_rating && (
            <div className="mt-3">
              <span className="text-sm terminal-muted">Approval Rating: </span>
              <span className={`font-mono font-bold ${
                politician.approval_rating >= 60 ? 'text-green-400' :
                politician.approval_rating >= 40 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {politician.approval_rating}%
              </span>
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

const TransparencyData = ({ politicianId, politicianName }) => (
  <div className="space-y-6">
    <Card className="terminal-surface border-gray-700">
      <CardHeader>
        <CardTitle className="terminal-text">Campaign Finance</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="terminal-text">Transparency data for {formatFullName(politicianName)} coming soon...</p>
      </CardContent>
    </Card>
    
    <Card className="terminal-surface border-gray-700">
      <CardHeader>
        <CardTitle className="terminal-text">Voting Record</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="terminal-text">Detailed voting record analysis coming soon...</p>
      </CardContent>
    </Card>
    
    <Card className="terminal-surface border-gray-700">
      <CardHeader>
        <CardTitle className="terminal-text">Committee Memberships</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="terminal-text">Committee activity and influence metrics coming soon...</p>
      </CardContent>
    </Card>
  </div>
);

const LocalPulse = ({ politician }) => (
  <div className="space-y-6">
    <Card className="terminal-surface border-gray-700">
      <CardHeader>
        <CardTitle className="terminal-text">Local News & Sentiment</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="terminal-text">Local news coverage and public sentiment for {formatFullName(politician)} coming soon...</p>
      </CardContent>
    </Card>
    
    <Card className="terminal-surface border-gray-700">
      <CardHeader>
        <CardTitle className="terminal-text">Constituent Engagement</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="terminal-text">Social media activity and constituent feedback analysis coming soon...</p>
      </CardContent>
    </Card>
  </div>
);

export default function PoliticianProfile() {
    const [politician, setPolitician] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await UserEntity.me();
                setUser(currentUser);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchPolitician = async () => {
            const { id } = router.query;
            console.log('[PoliticianProfile] Fetching politician with ID:', id);
            if (id) {
                setIsLoading(true);
                setError(null);
                try {
                    const data = await Politician.get(id);
                    console.log('[PoliticianProfile] Found politician:', data);
                    if (data) {
                        setPolitician(data);
                    } else {
                        // If specific politician not found, try to get a sample politician
                        console.log('[PoliticianProfile] Politician not found, getting sample data');
                        const allPoliticians = await Politician.list();
                        if (allPoliticians && allPoliticians.length > 0) {
                            setPolitician(allPoliticians[0]);
                        } else {
                            setError('No politician data available');
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch politician:", error);
                    setError('Failed to load politician data');
                }
                setIsLoading(false);
            }
        };
        if (router.isReady) {
            fetchPolitician();
        }
    }, [router.isReady, router.query]);

    if (!user) {
        return <div>Loading...</div>;
    }

    if (isLoading) {
        return (
            <AppLayout user={user}>
                <div className="p-6 space-y-6 min-h-screen" style={{ background: 'var(--terminal-bg)' }}>
                    <div className="w-full">
                        <Skeleton className="h-48 w-full bg-gray-800/50 mb-6" />
                        <Skeleton className="h-96 w-full bg-gray-800/50" />
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (error || !politician) {
        return (
            <AppLayout user={user}>
                <div className="p-6 min-h-screen flex items-center justify-center" style={{ background: 'var(--terminal-bg)' }}>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold terminal-text mb-4">Politician Profile</h2>
                        <p className="terminal-muted mb-6">
                            {error || 'The requested profile could not be loaded.'}
                        </p>
                        <button
                            onClick={() => router.push('/politicians')}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Politicians
                        </button>
                    </div>
                </div>
            </AppLayout>
        );
    }
    
    return (
        <AppLayout user={user}>
            <div className="p-6 space-y-6 min-h-screen" style={{ background: 'var(--terminal-bg)' }}>
                <div className="w-full">
                    <div className="mb-4">
                        <button
                            onClick={() => router.push('/politicians')}
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Politicians
                        </button>
                    </div>
                    
                    <PoliticianHeader politician={politician} />
                    
                    <Tabs defaultValue="transparency" className="w-full">
                      <TabsList className="grid w-full grid-cols-5 bg-gray-800/50 border-gray-700">
                        <TabsTrigger value="overview"><User className="w-4 h-4 mr-2" />Overview</TabsTrigger>
                        <TabsTrigger value="bio"><Landmark className="w-4 h-4 mr-2" />Bio & Voting</TabsTrigger>
                        <TabsTrigger value="performance"><TrendingUp className="w-4 h-4 mr-2" />Performance</TabsTrigger>
                        <TabsTrigger value="local_pulse"><Rss className="w-4 h-4 mr-2" />Local Pulse</TabsTrigger>
                        <TabsTrigger value="transparency"><Gem className="w-4 h-4 mr-2" />Transparency</TabsTrigger>
                      </TabsList>
                      <TabsContent value="overview" className="mt-4">
                         <Card className="terminal-surface"><CardContent className="p-6"><p className="terminal-text">Overview content coming soon.</p></CardContent></Card>
                      </TabsContent>
                      <TabsContent value="bio" className="mt-4">
                         <Card className="terminal-surface"><CardContent className="p-6"><p className="terminal-text">Bio & Voting record content coming soon.</p></CardContent></Card>
                      </TabsContent>
                       <TabsContent value="performance" className="mt-4">
                         <Card className="terminal-surface"><CardContent className="p-6"><p className="terminal-text">Performance analytics content coming soon.</p></CardContent></Card>
                      </TabsContent>
                      <TabsContent value="local_pulse" className="mt-4">
                        <LocalPulse politician={politician} />
                      </TabsContent>
                      <TabsContent value="transparency" className="mt-4">
                        <TransparencyData politicianId={politician.id} politicianName={politician} />
                      </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
} 