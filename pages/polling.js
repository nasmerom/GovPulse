import React, { useState, useEffect } from "react";
import { PollData } from "../entities/PollData";
import { User } from "../entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { BarChart3, TrendingUp, TrendingDown, Users, MapPin, Calendar } from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, subDays } from "date-fns";
import AppLayout from "../components/AppLayout";

export default function Polling() {
  const [polls, setPolls] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPollType, setSelectedPollType] = useState("presidential");
  const [selectedState, setSelectedState] = useState("national");
  const [selectedSource, setSelectedSource] = useState("all");
  const [pollMetadata, setPollMetadata] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [pollsData, userData] = await Promise.all([
        fetch('/api/polling/combined?pollType=presidential&limit=100').then(res => res.json()),
        User.me().catch(() => null)
      ]);
      
      // Extract polls from the combined API response
      const combinedPolls = pollsData.polls || [];
      setPolls(combinedPolls);
      setUser(userData);
      if (userData?.state) {
        setSelectedState(userData.state);
      }
      
      // Store metadata for display
      setPollMetadata(pollsData.metadata);
      console.log('Polling metadata:', pollsData.metadata);
    } catch (error) {
      console.error('Error loading polling data:', error);
      // Fallback to local data if API fails
      try {
        const fallbackData = await PollData.list('-date_conducted', 100);
        setPolls(fallbackData);
      } catch (fallbackError) {
        console.error('Fallback data also failed:', fallbackError);
      }
    }
    setIsLoading(false);
  };

  const getRunningAverage = (pollType, daysBack = 30, state = null) => {
    const cutoffDate = subDays(new Date(), daysBack);
    let filteredPolls = polls.filter(poll => 
      poll.poll_type === pollType && 
      new Date(poll.date_conducted) >= cutoffDate
    );

    if (state && state !== 'national') {
      filteredPolls = filteredPolls.filter(poll => poll.state === state);
    } else if (state === 'national') {
      filteredPolls = filteredPolls.filter(poll => !poll.state);
    }

    // Filter by source if specified
    if (selectedSource !== 'all') {
      filteredPolls = filteredPolls.filter(poll => 
        poll.source?.toLowerCase().includes(selectedSource.toLowerCase())
      );
    }

    if (filteredPolls.length === 0) return null;

    // Group by candidate and calculate weighted averages
    const candidateData = {};
    filteredPolls.forEach(poll => {
      poll.results?.forEach(result => {
        if (!candidateData[result.candidate]) {
          candidateData[result.candidate] = {
            totalWeightedPercentage: 0,
            totalWeight: 0,
            party: result.party,
            polls: []
          };
        }
        const weight = poll.sample_size || 1000; // Use sample size as weight
        candidateData[result.candidate].totalWeightedPercentage += result.percentage * weight;
        candidateData[result.candidate].totalWeight += weight;
        candidateData[result.candidate].polls.push({
          date: poll.date_conducted,
          percentage: result.percentage,
          pollster: poll.pollster
        });
      });
    });

    // Calculate averages and trends
    Object.keys(candidateData).forEach(candidate => {
      const data = candidateData[candidate];
      data.average = data.totalWeightedPercentage / data.totalWeight;
      
      // Calculate trend (last 7 days vs previous 7 days)
      const recent = data.polls.filter(p => new Date(p.date) >= subDays(new Date(), 7));
      const previous = data.polls.filter(p => {
        const date = new Date(p.date);
        return date >= subDays(new Date(), 14) && date < subDays(new Date(), 7);
      });

      if (recent.length > 0 && previous.length > 0) {
        const recentAvg = recent.reduce((sum, p) => sum + p.percentage, 0) / recent.length;
        const previousAvg = previous.reduce((sum, p) => sum + p.percentage, 0) / previous.length;
        data.trend = recentAvg - previousAvg;
      } else {
        data.trend = 0;
      }
    });

    return candidateData;
  };

  const getChartData = (pollType, state = null) => {
    let filteredPolls = polls.filter(poll => poll.poll_type === pollType);
    
    if (state && state !== 'national') {
      filteredPolls = filteredPolls.filter(poll => poll.state === state);
    } else if (state === 'national') {
      filteredPolls = filteredPolls.filter(poll => !poll.state);
    }

    // Filter by source if specified
    if (selectedSource !== 'all') {
      filteredPolls = filteredPolls.filter(poll => 
        poll.source?.toLowerCase().includes(selectedSource.toLowerCase())
      );
    }

    // Sort by date and take last 20 polls
    filteredPolls = filteredPolls
      .sort((a, b) => new Date(a.date_conducted) - new Date(b.date_conducted))
      .slice(-20);

    const chartData = [];
    filteredPolls.forEach(poll => {
      const dataPoint = {
        date: format(new Date(poll.date_conducted), 'MMM dd'),
        pollster: poll.pollster
      };
      
      poll.results?.forEach(result => {
        dataPoint[result.candidate] = result.percentage;
      });
      
      chartData.push(dataPoint);
    });

    return chartData;
  };

  const getPartyColor = (party) => {
    switch (party?.toLowerCase()) {
      case 'democrat': return '#2563eb';
      case 'republican': return '#dc2626';
      case 'independent': return '#7c3aed';
      default: return '#6b7280';
    }
  };

  const presidentialAverage = getRunningAverage('presidential', 30, selectedState);
  const congressionalAverage = getRunningAverage('generic_ballot', 30, 'national');
  const presidentialChart = getChartData('presidential', selectedState);
  const congressionalChart = getChartData('generic_ballot', 'national');

  // Get unique candidates for chart legend
  const getCandidates = (data) => {
    if (!data) return [];
    return Object.keys(data).sort((a, b) => data[b].average - data[a].average);
  };

  const states = [
    'national', 'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 
    'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 
    'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 
    'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
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
                <BarChart3 className="w-8 h-8 text-blue-400" />
                Polling Analytics
              </h1>
              <p className="terminal-muted">Real-time polling averages and trend analysis</p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-48 bg-gray-800 border-gray-600 terminal-text">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {states.map(state => (
                    <SelectItem key={state} value={state}>
                      {state === 'national' ? 'National' : state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="w-40 bg-gray-800 border-gray-600 terminal-text">
                  <SelectValue placeholder="Data Source" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="pollster">Pollster (HuffPost)</SelectItem>
                  <SelectItem value="votehub">VoteHub</SelectItem>
                </SelectContent>
              </Select>
              {user?.state && (
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                  Your State: {user.state}
                </Badge>
              )}
            </div>
          </div>

          {/* Data Source Information */}
          {pollMetadata && (
            <Card className="terminal-surface border-gray-700 mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-400">
                      <span className="font-medium">Total Polls:</span> {pollMetadata.total_polls}
                    </div>
                    <div className="text-sm text-gray-400">
                      <span className="font-medium">Pollsters:</span> {pollMetadata.pollsters?.length || 0}
                    </div>
                    {pollMetadata.date_range && (
                      <div className="text-sm text-gray-400">
                        <span className="font-medium">Date Range:</span> {pollMetadata.date_range.earliest} to {pollMetadata.date_range.latest}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {pollMetadata.sources && Object.entries(pollMetadata.sources).map(([source, data]) => (
                      <Badge 
                        key={source} 
                        variant="outline" 
                        className={`text-xs ${
                          data.error ? 'bg-red-500/10 text-red-400 border-red-500/30' : 
                          'bg-green-500/10 text-green-400 border-green-500/30'
                        }`}
                      >
                        {source}: {data.total || 0} polls
                        {data.note && <span className="ml-1">({data.note})</span>}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="presidential" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border-gray-700">
              <TabsTrigger value="presidential">Presidential</TabsTrigger>
              <TabsTrigger value="congressional">Congressional</TabsTrigger>
              <TabsTrigger value="primaries">Primaries</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>

            <TabsContent value="presidential" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Presidential Averages */}
                <Card className="lg:col-span-1 terminal-surface border-gray-700 terminal-glow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 terminal-text">
                      <Users className="w-5 h-5 text-blue-400" />
                      Running Average (30 days)
                      {selectedState !== 'national' && (
                        <Badge variant="outline" className="ml-2 bg-blue-500/10 text-blue-400 border-blue-500/30">
                          {selectedState}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-4">
                        {Array(3).fill(0).map((_, i) => (
                          <Skeleton key={i} className="h-16 bg-gray-700" />
                        ))}
                      </div>
                    ) : presidentialAverage ? (
                      <div className="space-y-4">
                        {getCandidates(presidentialAverage).map(candidate => {
                          const data = presidentialAverage[candidate];
                          return (
                            <div key={candidate} className="p-3 rounded-lg bg-gray-800/30">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: getPartyColor(data.party) }}
                                  />
                                  <span className="font-medium terminal-text">{candidate}</span>
                                  <Badge variant="outline" className="text-xs bg-gray-700/50 text-gray-300">
                                    {data.party}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-lg font-bold terminal-text">
                                    {data.average.toFixed(1)}%
                                  </span>
                                  {Math.abs(data.trend) > 0.5 && (
                                    <div className="flex items-center gap-1">
                                      {data.trend > 0 ? (
                                        <TrendingUp className="w-4 h-4 text-green-400" />
                                      ) : (
                                        <TrendingDown className="w-4 h-4 text-red-400" />
                                      )}
                                      <span className={`text-xs ${data.trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {Math.abs(data.trend).toFixed(1)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="text-xs terminal-muted">
                                Based on {data.polls.length} polls
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 terminal-muted">
                        <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No polling data available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Presidential Trend Chart */}
                <Card className="lg:col-span-2 terminal-surface border-gray-700 terminal-glow">
                  <CardHeader>
                    <CardTitle className="terminal-text">Polling Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton className="h-80 bg-gray-700" />
                    ) : presidentialChart.length > 0 ? (
                      <ResponsiveContainer width="100%" height={320}>
                        <LineChart data={presidentialChart}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                          <YAxis stroke="#9ca3af" fontSize={12} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1f2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px'
                            }} 
                          />
                          <Legend />
                          {presidentialAverage && getCandidates(presidentialAverage).map(candidate => (
                            <Line 
                              key={candidate}
                              type="monotone" 
                              dataKey={candidate} 
                              stroke={getPartyColor(presidentialAverage[candidate].party)}
                              strokeWidth={2}
                              dot={{ r: 3 }}
                            />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-80 terminal-muted">
                        <div className="text-center">
                          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No chart data available</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="congressional" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Congressional Generic Ballot */}
                <Card className="terminal-surface border-gray-700 terminal-glow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 terminal-text">
                      <Users className="w-5 h-5 text-purple-400" />
                      Generic Ballot (National)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-4">
                        {Array(2).fill(0).map((_, i) => (
                          <Skeleton key={i} className="h-16 bg-gray-700" />
                        ))}
                      </div>
                    ) : congressionalAverage ? (
                      <div className="space-y-4">
                        {getCandidates(congressionalAverage).map(party => {
                          const data = congressionalAverage[party];
                          return (
                            <div key={party} className="p-3 rounded-lg bg-gray-800/30">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: getPartyColor(data.party || party) }}
                                  />
                                  <span className="font-medium terminal-text">{party}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-lg font-bold terminal-text">
                                    {data.average.toFixed(1)}%
                                  </span>
                                  {Math.abs(data.trend) > 0.5 && (
                                    <div className="flex items-center gap-1">
                                      {data.trend > 0 ? (
                                        <TrendingUp className="w-4 h-4 text-green-400" />
                                      ) : (
                                        <TrendingDown className="w-4 h-4 text-red-400" />
                                      )}
                                      <span className={`text-xs ${data.trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {Math.abs(data.trend).toFixed(1)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="text-xs terminal-muted">
                                Based on {data.polls.length} polls
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 terminal-muted">
                        <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No congressional polling data available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Congressional Trend Chart */}
                <Card className="terminal-surface border-gray-700 terminal-glow">
                  <CardHeader>
                    <CardTitle className="terminal-text">Congressional Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton className="h-80 bg-gray-700" />
                    ) : congressionalChart.length > 0 ? (
                      <ResponsiveContainer width="100%" height={320}>
                        <LineChart data={congressionalChart}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                          <YAxis stroke="#9ca3af" fontSize={12} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1f2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px'
                            }} 
                          />
                          <Legend />
                          {congressionalAverage && getCandidates(congressionalAverage).map(party => (
                            <Line 
                              key={party}
                              type="monotone" 
                              dataKey={party} 
                              stroke={getPartyColor(congressionalAverage[party].party || party)}
                              strokeWidth={2}
                              dot={{ r: 3 }}
                            />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-80 terminal-muted">
                        <div className="text-center">
                          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No chart data available</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="primaries" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="terminal-surface border-gray-700 terminal-glow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 terminal-text">
                      <MapPin className="w-5 h-5 text-green-400" />
                      {user?.state || selectedState} Primaries
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 terminal-muted">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium terminal-text mb-2">Primary Season Concluded</h3>
                      <p>Primary elections have concluded for the 2024 cycle.</p>
                      <p className="text-sm mt-2">Check back during primary season for detailed polling data.</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="terminal-surface border-gray-700 terminal-glow">
                  <CardHeader>
                    <CardTitle className="terminal-text">Primary Results Archive</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-gray-800/30">
                        <h4 className="font-medium terminal-text">Republican Primary</h4>
                        <p className="text-sm terminal-muted">Concluded March 2024</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-800/30">
                        <h4 className="font-medium terminal-text">Democratic Primary</h4>
                        <p className="text-sm terminal-muted">Concluded March 2024</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="custom" className="mt-6">
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="terminal-text">Custom Poll Selection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <Select value={selectedPollType} onValueChange={setSelectedPollType}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 terminal-text">
                        <SelectValue placeholder="Poll Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="presidential">Presidential</SelectItem>
                        <SelectItem value="congressional">Congressional</SelectItem>
                        <SelectItem value="gubernatorial">Gubernatorial</SelectItem>
                        <SelectItem value="approval">Approval Rating</SelectItem>
                        <SelectItem value="issue">Issue Polling</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Custom Poll Results */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium terminal-text">Recent {selectedPollType.replace('_', ' ')} Polls</h3>
                      {polls.filter(poll => poll.poll_type === selectedPollType)
                        .slice(0, 5)
                        .map(poll => (
                          <div key={poll.id} className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium terminal-text">{poll.poll_name}</h4>
                              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                                {poll.pollster}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              {poll.results?.slice(0, 3).map((result, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                  <span className="text-sm terminal-text">{result.candidate}</span>
                                  <span className="font-mono terminal-text">{result.percentage}%</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center justify-between mt-3 text-xs terminal-muted">
                              <span>{format(new Date(poll.date_conducted), 'MMM d, yyyy')}</span>
                              <span>±{poll.margin_of_error || 3}% MoE</span>
                            </div>
                          </div>
                        ))}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium terminal-text mb-4">Poll Quality Metrics</h3>
                      <div className="space-y-3">
                        {polls.filter(poll => poll.poll_type === selectedPollType && poll.reliability_score)
                          .slice(0, 5)
                          .map(poll => (
                            <div key={poll.id} className="p-3 rounded-lg bg-gray-800/30">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium terminal-text">{poll.pollster}</span>
                                <Badge variant="outline" className={`text-xs ${
                                  poll.reliability_score >= 8 ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                                  poll.reliability_score >= 6 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                                  'bg-red-500/10 text-red-400 border-red-500/30'
                                }`}>
                                  {poll.reliability_score}/10
                                </Badge>
                              </div>
                              <div className="text-xs terminal-muted">
                                Sample: {poll.sample_size || 'N/A'} • 
                                {poll.likely_voters ? ' Likely Voters' : ' Registered Voters'}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
} 