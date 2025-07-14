import React, { useState, useEffect } from "react";
import { Bill, Committee, CongressionalRecord } from "../entities/all";
import { User } from "../entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Skeleton } from "../components/ui/skeleton";
import { FileText, Users, Gavel, Search, Filter, Mic, Quote, Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import AppLayout from "../components/AppLayout";

const CommitteeQuotes = ({ isLoading }) => {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    // Simulate committee quotes from transcripts
    setQuotes([
      {
        member: "Sen. Elizabeth Warren",
        committee: "Banking Committee",
        quote: "We need stronger oversight of cryptocurrency markets to protect American consumers.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        importance: "high"
      },
      {
        member: "Rep. Kevin McCarthy",
        committee: "House Rules",
        quote: "This amendment process needs to be transparent and allow for proper debate.",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        importance: "medium"
      },
      {
        member: "Sen. Ted Cruz",
        committee: "Judiciary Committee",
        quote: "The First Amendment protections must extend to digital platforms.",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        importance: "high"
      }
    ]);
  }, []);

  return (
    <Card className="terminal-surface border-gray-700 terminal-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 terminal-text">
          <Quote className="w-5 h-5 text-purple-400" />
          Live Committee Clips
          <Badge variant="outline" className="ml-2 bg-red-500/10 text-red-400 border-red-500/30">
            LIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full bg-gray-800/50" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4 bg-gray-800/50" />
                  <Skeleton className="h-3 w-full bg-gray-800/50" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {quotes.map((quote, idx) => (
              <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                quote.importance === 'high' ? 'bg-red-500/10 border-red-500' : 'bg-blue-500/10 border-blue-500'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium terminal-text">{quote.member}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-gray-800 text-gray-300">
                      {quote.committee}
                    </Badge>
                    <span className="text-xs terminal-muted">
                      {formatDistanceToNow(quote.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <p className="text-sm terminal-text italic leading-relaxed">"{quote.quote}"</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ActiveSessions = ({ isLoading }) => {
  const [activeSessions, setActiveSessions] = useState([]);

  useEffect(() => {
    // Simulate active committee sessions
    setActiveSessions([
      {
        committee: "Senate Banking Committee",
        topic: "Cryptocurrency Regulation Hearing",
        status: "live",
        viewers: 1247
      },
      {
        committee: "House Judiciary",
        topic: "Tech Platform Oversight",
        status: "scheduled",
        startTime: "2:00 PM EST"
      }
    ]);
  }, []);

  return (
    <Card className="terminal-surface border-gray-700 terminal-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 terminal-text">
          <Activity className="w-5 h-5 text-green-400" />
          Active Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array(2).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full bg-gray-800/50" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4 bg-gray-800/50" />
                  <Skeleton className="h-3 w-1/2 bg-gray-800/50" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {activeSessions.map((session, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium terminal-text">{session.committee}</h4>
                  {session.status === 'live' ? (
                    <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30 flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                      LIVE
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                      {session.startTime}
                    </Badge>
                  )}
                </div>
                <p className="text-sm terminal-muted mb-2">{session.topic}</p>
                {session.viewers && (
                  <p className="text-xs terminal-muted">{session.viewers} watching</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function Congress() {
  const [bills, setBills] = useState([]);
  const [committees, setCommittees] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [billsLoading, setBillsLoading] = useState(true);
  const [committeesLoading, setCommitteesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("legislation");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [chamberFilter, setChamberFilter] = useState("all");
  const [committeeFilter, setCommitteeFilter] = useState("all");

  // Load user data first (fast)
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await User.me().catch(() => null);
        setUser(userData);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  // Load bills and committees in parallel with individual loading states
  useEffect(() => {
    const loadData = async () => {
      setError(null);
      
      // Load bills and committees in parallel (reduced limits for faster loading)
      const billsPromise = Bill.list('-last_action_date', 25)
        .then(data => {
          console.log('📋 Bills data loaded:', {
            count: data.length,
            sample: data.slice(0, 3).map(b => ({ 
              id: b.id, 
              bill_number: b.bill_number, 
              title: b.title?.substring(0, 30) + '...' 
            }))
          });
          setBills(data);
          setBillsLoading(false);
        })
        .catch(error => {
          console.error('❌ Error loading bills:', error);
          setBillsLoading(false);
        });

      const committeesPromise = Committee.list('name', 25)
        .then(data => {
          console.log('🏛️ Committees data loaded:', {
            count: data.length,
            sample: data.slice(0, 3).map(c => ({ 
              id: c.id, 
              name: c.name, 
              chamber: c.chamber 
            }))
          });
          setCommittees(data);
          setCommitteesLoading(false);
        })
        .catch(error => {
          console.error('❌ Error loading committees:', error);
          setCommitteesLoading(false);
        });

      // Wait for both to complete or timeout
      try {
        await Promise.allSettled([billsPromise, committeesPromise]);
      } catch (error) {
        console.error('❌ Error loading Congress data:', error);
        setError('Failed to load some congressional data. Please try again later.');
      }
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Show loading state only if both bills and committees are still loading
  const isFullyLoading = billsLoading && committeesLoading;

  const filteredBills = bills.filter(bill => {
    const sanitizedTerm = searchTerm.replace(/[<>]/g, '').toLowerCase();
    const matchesSearch = !searchTerm || 
      bill.title?.toLowerCase().includes(sanitizedTerm) ||
      bill.bill_number?.toLowerCase().includes(sanitizedTerm) ||
      bill.sponsor?.toLowerCase().includes(sanitizedTerm);
    const matchesStatus = statusFilter === "all" || bill.status === statusFilter;
    const matchesChamber = chamberFilter === "all" || bill.chamber === chamberFilter;
    return matchesSearch && matchesStatus && matchesChamber;
  });

  const filteredCommittees = committees.filter(committee => {
    const sanitizedTerm = searchTerm.replace(/[<>]/g, '').toLowerCase();
    const matchesSearch = !searchTerm || 
      committee.name?.toLowerCase().includes(sanitizedTerm) ||
      committee.jurisdiction?.toLowerCase().includes(sanitizedTerm);
    const matchesChamber = chamberFilter === "all" || committee.chamber === chamberFilter;
    return matchesSearch && matchesChamber;
  });

  const handleTagClick = (filterType, value) => {
    switch (filterType) {
      case 'status':
        setStatusFilter(value);
        break;
      case 'chamber':
        setChamberFilter(value);
        break;
      case 'committee':
        setCommitteeFilter(value);
        break;
      default:
        console.warn(`Unknown filter type: ${filterType}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'floor_vote':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'committee':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <AppLayout user={user}>
      <div className="p-4 md:p-6 space-y-6 min-h-screen" style={{ background: 'var(--terminal-bg)' }}>
        <div className="w-full">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold terminal-text mb-2 flex items-center gap-3">
              <Gavel className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
              Congressional Intelligence
            </h1>
            <p className="terminal-muted text-sm md:text-base">Legislation, committees, and live congressional activity</p>
          </div>

          {error && (
            <Card className="terminal-surface border-red-500/30 bg-red-500/10 mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-400">
                  <span className="text-sm">⚠️ {error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading Progress Indicator */}
          {(billsLoading || committeesLoading) && (
            <Card className="terminal-surface border-blue-500/30 bg-blue-500/10 mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="spinner"></div>
                  <div className="flex-1">
                    <p className="text-sm terminal-text">Loading congressional data...</p>
                    <div className="flex gap-4 mt-2 text-xs terminal-muted">
                      <span className={billsLoading ? 'text-blue-400' : 'text-green-400'}>
                        {billsLoading ? '⏳ Bills' : '✅ Bills'}
                      </span>
                      <span className={committeesLoading ? 'text-blue-400' : 'text-green-400'}>
                        {committeesLoading ? '⏳ Committees' : '✅ Committees'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <CommitteeQuotes isLoading={isFullyLoading} />
            </div>
            <div>
              <ActiveSessions isLoading={isFullyLoading} />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 border-gray-700">
              <TabsTrigger value="legislation" className="text-sm">
                Legislation {!billsLoading && `(${bills.length})`}
              </TabsTrigger>
              <TabsTrigger value="committees" className="text-sm">
                Committees {!committeesLoading && `(${committees.length})`}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="legislation" className="mt-5">
              <Card className="terminal-surface border-gray-700 mb-6">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 terminal-muted" />
                      <Input
                        placeholder="Search bills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-600 terminal-text"
                      />
                    </div>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 terminal-text">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="introduced">Introduced</SelectItem>
                        <SelectItem value="committee">In Committee</SelectItem>
                        <SelectItem value="floor_vote">Floor Vote</SelectItem>
                        <SelectItem value="passed">Passed</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={chamberFilter} onValueChange={setChamberFilter}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 terminal-text">
                        <SelectValue placeholder="All Chambers" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="all">All Chambers</SelectItem>
                        <SelectItem value="House">House</SelectItem>
                        <SelectItem value="Senate">Senate</SelectItem>
                        <SelectItem value="Both">Both</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2 text-sm terminal-muted">
                      <Filter className="w-4 h-4" />
                      <span>{filteredBills.length} results</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Filters */}
              {(statusFilter !== "all" || chamberFilter !== "all") && (
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-sm terminal-muted">Active filters:</span>
                  {statusFilter !== "all" && (
                    <Badge 
                      variant="secondary" 
                      className="cursor-pointer bg-blue-900/50 text-blue-300 hover:bg-blue-900"
                      onClick={() => setStatusFilter("all")}
                    >
                      Status: {statusFilter}
                    </Badge>
                  )}
                  {chamberFilter !== "all" && (
                    <Badge 
                      variant="secondary" 
                      className="cursor-pointer bg-blue-900/50 text-blue-300 hover:bg-blue-900"
                      onClick={() => setChamberFilter("all")}
                    >
                      Chamber: {chamberFilter}
                    </Badge>
                  )}
                </div>
              )}

              {/* Bills Grid */}
              <div className="grid grid-cols-1 gap-4">
                {billsLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <Card key={i} className="terminal-surface border-gray-700">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <Skeleton className="h-6 w-1/2 bg-gray-700" />
                          <Skeleton className="h-4 w-full bg-gray-700" />
                          <div className="flex gap-2">
                            <Skeleton className="h-5 w-16 bg-gray-700" />
                            <Skeleton className="h-5 w-20 bg-gray-700" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : filteredBills.length === 0 ? (
                  <Card className="terminal-surface border-gray-700">
                    <CardContent className="p-8 text-center">
                      <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium terminal-text mb-2">No bills found</h3>
                      <p className="terminal-muted">Try adjusting your search terms or filters.</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredBills.map((bill) => (
                    <Card key={bill.id} className="terminal-surface border-gray-700 hover:bg-gray-800/30 transition-all duration-300 terminal-glow">
                      <CardContent className="pt-6 pb-4 px-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                              <FileText className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold terminal-text">{bill.bill_number}</h3>
                              <Badge variant="outline" className={`text-xs ${getStatusColor(bill.status)}`}>
                                {bill.status.replace('_', ' ')}
                              </Badge>
                              <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-400 border-purple-500/30">
                                {bill.chamber}
                              </Badge>
                            </div>
                            <h4 className="font-medium terminal-text mb-2 line-clamp-2">{bill.title}</h4>
                            <p className="text-sm terminal-muted mb-3 line-clamp-2">{bill.summary}</p>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-4">
                                <span className="terminal-muted">Sponsor: {bill.sponsor}</span>
                                {bill.cosponsors > 0 && (
                                  <span className="terminal-muted">{bill.cosponsors} cosponsors</span>
                                )}
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="terminal-muted text-xs">
                                  {bill.last_action_date && formatDate(bill.last_action_date)}
                                </div>
                                <div className="terminal-muted text-xs max-w-xs truncate">
                                  {bill.last_action}
                                </div>
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

            <TabsContent value="committees" className="mt-5">
              <Card className="terminal-surface border-gray-700 mb-6">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 terminal-muted" />
                      <Input
                        placeholder="Search committees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-600 terminal-text"
                      />
                    </div>
                    
                    <Select value={chamberFilter} onValueChange={setChamberFilter}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 terminal-text">
                        <SelectValue placeholder="All Chambers" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="all">All Chambers</SelectItem>
                        <SelectItem value="House">House</SelectItem>
                        <SelectItem value="Senate">Senate</SelectItem>
                        <SelectItem value="Joint">Joint</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2 text-sm terminal-muted">
                      <Filter className="w-4 h-4" />
                      <span>{filteredCommittees.length} results</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {committeesLoading ? (
                  Array(6).fill(0).map((_, i) => (
                    <Card key={i} className="terminal-surface border-gray-700">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <Skeleton className="h-6 w-3/4 bg-gray-700" />
                          <Skeleton className="h-4 w-full bg-gray-700" />
                          <div className="flex gap-2">
                            <Skeleton className="h-5 w-20 bg-gray-700" />
                            <Skeleton className="h-5 w-16 bg-gray-700" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : filteredCommittees.length === 0 ? (
                  <Card className="terminal-surface border-gray-700 md:col-span-2">
                    <CardContent className="p-8 text-center">
                      <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium terminal-text mb-2">No committees found</h3>
                      <p className="terminal-muted">Try adjusting your search terms or filters.</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredCommittees.map((committee) => (
                    <Card key={committee.id} className="terminal-surface border-gray-700 hover:bg-gray-800/30 transition-all duration-300 terminal-glow">
                      <CardContent className="pt-6 pb-4 px-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                              <Users className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold terminal-text">{committee.name}</h3>
                              <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">
                                {committee.chamber}
                              </Badge>
                            </div>
                            <p className="text-sm terminal-muted mb-3 line-clamp-2">{committee.jurisdiction}</p>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="terminal-muted">Chair:</span>
                                <span className="terminal-text text-right">{committee.chair}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="terminal-muted">Ranking Member:</span>
                                <span className="terminal-text text-right">{committee.ranking_member}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="terminal-muted">Active Bills:</span>
                                <span className="terminal-text">{committee.active_bills}</span>
                              </div>
                            </div>
                            {committee.recent_hearings && committee.recent_hearings.length > 0 && (
                              <div className="mt-3 p-2 rounded bg-gray-800/30">
                                <p className="text-xs terminal-muted mb-1">Recent Hearing:</p>
                                <p className="text-xs terminal-text line-clamp-1">{committee.recent_hearings[0].title}</p>
                                <p className="text-xs terminal-muted">{formatDate(committee.recent_hearings[0].date)}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
} 