import React, { useState, useEffect } from "react";
import { EconomicIndicator } from "../entities/EconomicIndicator";
import { User } from "../entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { DollarSign, TrendingUp, TrendingDown, Calendar, Target, Activity } from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, subMonths } from "date-fns";
import AppLayout from "../components/AppLayout";

export default function Economics() {
  const [indicators, setIndicators] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [indicatorData, userData] = await Promise.all([
          EconomicIndicator.list('-measurement_date', 20), // Reduced for faster loading
          User.me().catch(() => null)
        ]);
        setIndicators(indicatorData);
        setUser(userData);
      } catch (error) {
        console.error('Error loading economic data:', error);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  const getIndicatorsByType = (type) => {
    return indicators.filter(ind => ind.indicator_type === type);
  };

  const getSectorSpecificData = () => {
    if (!user?.business_sector) return [];
    return indicators.filter(ind => 
      ind.sector === user.business_sector || 
      ind.sector === 'general'
    );
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  const keyIndicators = [
    ...getIndicatorsByType('inflation').slice(0, 2),
    ...getIndicatorsByType('employment').slice(0, 2),
    ...getIndicatorsByType('interest_rates').slice(0, 1),
    ...getIndicatorsByType('gdp').slice(0, 1)
  ];

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <AppLayout user={user}>
      <div className="p-6 space-y-6 min-h-screen" style={{ background: 'var(--terminal-bg)' }}>
        <div className="w-full">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold terminal-text mb-2 flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-400" />
                Economic Intelligence
              </h1>
              <p className="terminal-muted">Real-time economic indicators and sector analysis</p>
            </div>
            {user?.business_sector && (
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                Sector Focus: {user.business_sector}
              </Badge>
            )}
          </div>

          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <Card key={i} className="terminal-surface border-gray-700">
                  <CardContent className="p-4">
                    <Skeleton className="h-16 bg-gray-700" />
                  </CardContent>
                </Card>
              ))
            ) : (
              keyIndicators.slice(0, 4).map((indicator) => (
                <Card key={indicator.id} className="terminal-surface border-gray-700 terminal-glow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm terminal-muted mb-1">{indicator.indicator_name}</p>
                        <p className="text-2xl font-bold terminal-text">
                          {indicator.value}{indicator.unit}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          {getTrendIcon(indicator.trend)}
                          <span className={`text-xs ${getTrendColor(indicator.trend)}`}>
                            {indicator.previous_value && (
                              `${indicator.trend === 'up' ? '+' : ''}${(indicator.value - indicator.previous_value).toFixed(2)}${indicator.unit}`
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-green-500/10">
                        <DollarSign className="w-5 h-5 text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-gray-800/50 border-gray-700">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="inflation">Inflation</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="fed">Fed Policy</TabsTrigger>
              <TabsTrigger value="sector">Sector Data</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="terminal-surface border-gray-700 terminal-glow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 terminal-text">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      Economic Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-4">
                        {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-16 bg-gray-800/50" />)}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {indicators.filter(ind => ind.next_release_date).slice(0, 5).map((indicator) => (
                          <div key={indicator.id} className="p-3 rounded-lg bg-gray-800/30 flex items-center justify-between">
                            <div>
                              <h4 className="font-medium terminal-text">{indicator.indicator_name}</h4>
                              <p className="text-sm terminal-muted">{indicator.source}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm terminal-text">{format(new Date(indicator.next_release_date), 'MMM d')}</p>
                              <Badge variant="outline" className={`text-xs ${
                                indicator.significance === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                                indicator.significance === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                                'bg-blue-500/10 text-blue-400 border-blue-500/30'
                              }`}>
                                {indicator.significance}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="terminal-surface border-gray-700 terminal-glow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 terminal-text">
                      <Target className="w-5 h-5 text-purple-400" />
                      Market Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-red-500/10 border-l-4 border-red-500">
                        <h4 className="font-medium text-red-400 mb-1">Fed Meeting This Week</h4>
                        <p className="text-sm terminal-muted">FOMC decision expected Wednesday</p>
                      </div>
                      <div className="p-3 rounded-lg bg-yellow-500/10 border-l-4 border-yellow-500">
                        <h4 className="font-medium text-yellow-400 mb-1">Jobs Report Friday</h4>
                        <p className="text-sm terminal-muted">Unemployment data release</p>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-500/10 border-l-4 border-blue-500">
                        <h4 className="font-medium text-blue-400 mb-1">CPI Data Next Week</h4>
                        <p className="text-sm terminal-muted">Inflation report due Tuesday</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="inflation" className="mt-6">
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="terminal-text">Inflation Indicators</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {getIndicatorsByType('inflation').map((indicator) => (
                        <div key={indicator.id} className="p-4 rounded-lg bg-gray-800/30">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium terminal-text">{indicator.indicator_name}</h4>
                            <div className="flex items-center gap-2">
                              {getTrendIcon(indicator.trend)}
                              <span className="font-mono terminal-text">{indicator.value}{indicator.unit}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="terminal-muted">Previous: {indicator.previous_value}{indicator.unit}</span>
                            <span className="terminal-muted">{format(new Date(indicator.measurement_date), 'MMM yyyy')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      {/* Chart would go here */}
                      <div className="h-64 bg-gray-800/30 rounded-lg flex items-center justify-center">
                        <p className="terminal-muted">Inflation Trend Chart</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="employment" className="mt-6">
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="terminal-text">Employment Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {getIndicatorsByType('employment').map((indicator) => (
                      <div key={indicator.id} className="p-4 rounded-lg bg-gray-800/30">
                        <div className="flex items-center gap-2 mb-2">
                          {getTrendIcon(indicator.trend)}
                          <h4 className="font-medium terminal-text">{indicator.indicator_name}</h4>
                        </div>
                        <p className="text-2xl font-bold terminal-text mb-1">{indicator.value}{indicator.unit}</p>
                        <p className="text-sm terminal-muted">
                          Previous: {indicator.previous_value}{indicator.unit}
                        </p>
                        <p className="text-xs terminal-muted mt-2">
                          {format(new Date(indicator.measurement_date), 'MMMM yyyy')}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fed" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="terminal-surface border-gray-700 terminal-glow">
                  <CardHeader>
                    <CardTitle className="terminal-text">Federal Reserve Policy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {getIndicatorsByType('interest_rates').map((indicator) => (
                        <div key={indicator.id} className="p-4 rounded-lg bg-gray-800/30">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium terminal-text">{indicator.indicator_name}</h4>
                            <span className="text-xl font-bold terminal-text">{indicator.value}{indicator.unit}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm terminal-muted">Last Change: {indicator.previous_value}{indicator.unit}</span>
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                              {indicator.trend}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="terminal-surface border-gray-700 terminal-glow">
                  <CardHeader>
                    <CardTitle className="terminal-text">FOMC Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-gray-800/30 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium terminal-text">Next FOMC Meeting</h4>
                            <p className="text-sm terminal-muted">December 17-18, 2024</p>
                          </div>
                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
                            Upcoming
                          </Badge>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-800/30">
                        <h4 className="font-medium terminal-text mb-1">Market Expectations</h4>
                        <p className="text-sm terminal-muted">75% probability of 0.25% cut</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="sector" className="mt-6">
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 terminal-text">
                    <Target className="w-5 h-5 text-green-400" />
                    {user?.business_sector ? `${user.business_sector} Sector Data` : 'Sector-Specific Indicators'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24 bg-gray-800/50" />)}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getSectorSpecificData().slice(0, 6).map((indicator) => (
                        <div key={indicator.id} className="p-4 rounded-lg bg-gray-800/30">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium terminal-text">{indicator.indicator_name}</h4>
                            {getTrendIcon(indicator.trend)}
                          </div>
                          <p className="text-lg font-bold terminal-text">{indicator.value}{indicator.unit}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs terminal-muted">{indicator.source}</span>
                            <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                              {indicator.sector}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
} 