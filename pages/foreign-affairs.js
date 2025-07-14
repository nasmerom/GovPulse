import React, { useState, useEffect } from "react";
import { User } from "../entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Globe, TrendingUp, AlertTriangle, DollarSign, MapPin, Calendar } from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import AppLayout from "../components/AppLayout";

export default function ForeignAffairs() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [foreignUpdates, setForeignUpdates] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const userData = await User.me().catch(() => null);
        setUser(userData);
        
        // Simulate foreign affairs data tailored to user type
        const updates = getForeignUpdatesForUser(userData);
        setForeignUpdates(updates);
      } catch (error) {
        console.error('Error loading foreign affairs data:', error);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  const getForeignUpdatesForUser = (user) => {
    const baseUpdates = [
      {
        title: "US-China Trade Tariffs Adjusted",
        summary: "New tariff rates announced affecting technology and manufacturing sectors",
        category: "trade",
        impact_level: "high",
        regions: ["China", "US"],
        sectors: ["technology", "manufacturing"],
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        relevance: "national"
      },
      {
        title: "NATO Summit Concludes with Defense Spending Commitments",
        summary: "Allied nations commit to increased defense spending through 2030",
        category: "diplomatic",
        impact_level: "medium",
        regions: ["Europe", "US"],
        sectors: ["defense"],
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        relevance: "national"
      },
      {
        title: "Middle East Ceasefire Agreement Reached",
        summary: "Regional stability may affect energy markets and supply chains",
        category: "conflict",
        impact_level: "high",
        regions: ["Middle East"],
        sectors: ["energy", "transportation"],
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        relevance: "national"
      },
      {
        title: "European Carbon Border Tax Implementation",
        summary: "New regulations affecting US exports to EU market",
        category: "regulatory",
        impact_level: "medium",
        regions: ["Europe"],
        sectors: ["manufacturing", "energy"],
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
        relevance: "national"
      },
      {
        title: "Pacific Trade Agreement Negotiations",
        summary: "New trade bloc formation could reshape global supply chains",
        category: "trade",
        impact_level: "high",
        regions: ["Asia-Pacific", "US"],
        sectors: ["technology", "agriculture", "manufacturing"],
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        relevance: "national"
      },
      {
        title: "African Union Economic Integration",
        summary: "Regional economic cooperation expands trade opportunities",
        category: "diplomatic",
        impact_level: "medium",
        regions: ["Africa"],
        sectors: ["agriculture", "mining", "infrastructure"],
        timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000),
        relevance: "national"
      },
      {
        title: "Arctic Resource Development Dispute",
        summary: "International tensions over Arctic oil and gas reserves",
        category: "conflict",
        impact_level: "medium",
        regions: ["Arctic", "Russia", "Canada", "US"],
        sectors: ["energy", "shipping"],
        timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000),
        relevance: "national"
      },
      {
        title: "Global Digital Tax Framework",
        summary: "OECD agreement on multinational tech company taxation",
        category: "regulatory",
        impact_level: "high",
        regions: ["Global"],
        sectors: ["technology", "finance"],
        timestamp: new Date(Date.now() - 42 * 60 * 60 * 1000),
        relevance: "national"
      }
    ];

    if (user?.account_type === 'Organizations') {
      // Filter by business sector
      return baseUpdates.filter(update => 
        !user.business_sector || update.sectors.includes(user.business_sector)
      );
    } else if (user?.account_type === 'Politician/Staff') {
      // Filter for national news or district-specific
      return baseUpdates.filter(update => 
        update.relevance === 'national' || update.relevance === user.state
      );
    } else {
      // Citizen account - show overview of all relevant topics
      return baseUpdates;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'trade': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'diplomatic': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'conflict': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'regulatory': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getImpactColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const tradeUpdates = foreignUpdates.filter(u => u.category === 'trade');
  const diplomaticUpdates = foreignUpdates.filter(u => u.category === 'diplomatic');
  const conflictUpdates = foreignUpdates.filter(u => u.category === 'conflict');

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <AppLayout user={user}>
      <div className="p-4 md:p-6 space-y-6 min-h-screen" style={{ background: 'var(--terminal-bg)' }}>
        <div className="w-full">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 md:mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold terminal-text mb-2 flex items-center gap-3">
                <Globe className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
                Foreign Affairs Intelligence
              </h1>
              <p className="terminal-muted text-sm md:text-base">
                {user?.account_type === 'Organizations' ? 
                  `Global developments affecting ${user.business_sector || 'your business'}` :
                  'International developments impacting US interests'
                }
              </p>
            </div>
            {user?.account_type && (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                {user.account_type === 'Organizations' ? 'Business Focus' :
                 user.account_type === 'Politician/Staff' ? 'Policy Focus' : 'Citizen Overview'}
              </Badge>
            )}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="terminal-surface border-gray-700 terminal-glow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm terminal-muted">Trade Impact</p>
                    <p className="text-2xl font-bold text-green-400">
                      {tradeUpdates.filter(u => u.impact_level === 'high').length}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-400 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="terminal-surface border-gray-700 terminal-glow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm terminal-muted">Diplomatic Events</p>
                    <p className="text-2xl font-bold text-blue-400">{diplomaticUpdates.length}</p>
                  </div>
                  <MapPin className="w-8 h-8 text-blue-400 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="terminal-surface border-gray-700 terminal-glow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm terminal-muted">Conflict Zones</p>
                    <p className="text-2xl font-bold text-red-400">{conflictUpdates.length}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-400 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="terminal-surface border-gray-700 terminal-glow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm terminal-muted">Active Regions</p>
                    <p className="text-2xl font-bold text-purple-400">
                      {[...new Set(foreignUpdates.flatMap(u => u.regions))].length}
                    </p>
                  </div>
                  <Globe className="w-8 h-8 text-purple-400 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border-gray-700">
              <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
              <TabsTrigger value="trade" className="text-sm">Trade & Tariffs</TabsTrigger>
              <TabsTrigger value="diplomatic" className="text-sm">Diplomatic</TabsTrigger>
              <TabsTrigger value="conflicts" className="text-sm">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-32 bg-gray-800/50" />)
                ) : (
                  foreignUpdates.map((update, idx) => (
                    <Card key={idx} className="terminal-surface border-gray-700 hover:bg-gray-800/30 transition-colors">
                      <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4 mb-3">
                              <h3 className="font-bold terminal-text text-lg">{update.title}</h3>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className={getCategoryColor(update.category)}>
                                  {update.category}
                                </Badge>
                                <Badge variant="outline" className={getImpactColor(update.impact_level)}>
                                  {update.impact_level} impact
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm terminal-muted mb-3">{update.summary}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                              <div>
                                <span className="terminal-muted">Regions: </span>
                                <span className="terminal-text">{update.regions.join(', ')}</span>
                              </div>
                              <div>
                                <span className="terminal-muted">Sectors: </span>
                                <span className="terminal-text">{update.sectors.join(', ')}</span>
                              </div>
                              <div>
                                <span className="terminal-muted">Updated: </span>
                                <span className="terminal-text">
                                  {formatDistanceToNow(update.timestamp, { addSuffix: true })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="trade" className="mt-6">
              <div className="grid grid-cols-1 gap-4">
                {tradeUpdates.map((update, idx) => (
                  <Card key={idx} className="terminal-surface border-gray-700 hover:bg-gray-800/30 transition-colors">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold terminal-text text-lg">{update.title}</h3>
                        <Badge variant="outline" className={getImpactColor(update.impact_level)}>
                          {update.impact_level} impact
                        </Badge>
                      </div>
                      <p className="text-sm terminal-muted mb-3">{update.summary}</p>
                      <div className="flex flex-wrap gap-2">
                        {update.sectors.map((sector, i) => (
                          <Badge key={i} variant="secondary" className="text-xs bg-green-900/50 text-green-300">
                            {sector}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="diplomatic" className="mt-6">
              <div className="grid grid-cols-1 gap-4">
                {diplomaticUpdates.map((update, idx) => (
                  <Card key={idx} className="terminal-surface border-gray-700 hover:bg-gray-800/30 transition-colors">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold terminal-text text-lg">{update.title}</h3>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                          diplomatic
                        </Badge>
                      </div>
                      <p className="text-sm terminal-muted mb-3">{update.summary}</p>
                      <div className="flex flex-wrap gap-2">
                        {update.regions.map((region, i) => (
                          <Badge key={i} variant="outline" className="text-xs bg-blue-900/50 text-blue-300 border-blue-600">
                            {region}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="conflicts" className="mt-6">
              <div className="grid grid-cols-1 gap-4">
                {conflictUpdates.map((update, idx) => (
                  <Card key={idx} className="terminal-surface border-gray-700 hover:bg-gray-800/30 transition-colors">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold terminal-text text-lg">{update.title}</h3>
                        <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
                          security
                        </Badge>
                      </div>
                      <p className="text-sm terminal-muted mb-3">{update.summary}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="terminal-muted">Affected Regions: </span>
                          <span className="terminal-text">{update.regions.join(', ')}</span>
                        </div>
                        <div>
                          <span className="terminal-muted">Economic Impact: </span>
                          <span className="terminal-text">{update.sectors.join(', ')}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
} 