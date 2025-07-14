import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Politician } from "../entities/Politician";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Users, Search, Filter, TrendingUp, TrendingDown, MapPin, Calendar, ArrowRight, Phone, Eye, MessageSquare, Heart, User } from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";
import AppLayout from "../components/AppLayout";
import { formatFullName } from '../utils/formatName';

export default function Politicians() {
  const [user, setUser] = useState(null);
  const [politicians, setPoliticians] = useState([]);
  const [filteredPoliticians, setFilteredPoliticians] = useState([]);
  const [followedPoliticians, setFollowedPoliticians] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [partyFilter, setPartyFilter] = useState("all");
  const [officeFilter, setOfficeFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (user) {
      loadPoliticians();
      loadFollowedPoliticians();
    }
  }, [user]);

  useEffect(() => {
    filterPoliticians();
  }, [politicians, searchTerm, partyFilter, officeFilter, stateFilter, followedPoliticians]);

  const loadUserData = async () => {
    try {
      const userData = await import("../entities/User").then(m => m.User.me());
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
  };

  const loadPoliticians = async () => {
    setIsLoading(true);
    try {
      const data = await Politician.list('-approval_rating', 100);
      setPoliticians(data);
      setFilteredPoliticians(data);
    } catch (error) {
      setPoliticians([]);
      setFilteredPoliticians([]);
    }
    setIsLoading(false);
  };

  const loadFollowedPoliticians = async () => {
    try {
      const followedIds = await import("../entities/User").then(m => m.User.getFollowedPoliticians());
      setFollowedPoliticians(followedIds || []);
    } catch (error) {
      setFollowedPoliticians([]);
    }
  };

  const filterPoliticians = () => {
    let filtered = politicians;
    if (searchTerm) {
      const sanitizedTerm = searchTerm.replace(/[<>]/g, '').toLowerCase();
      filtered = filtered.filter(p => 
        formatFullName(p).toLowerCase().includes(sanitizedTerm) ||
        p.state?.toLowerCase().includes(sanitizedTerm)
      );
    }
    if (partyFilter !== "all") {
      filtered = filtered.filter(p => p.party === partyFilter);
    }
    if (officeFilter !== "all") {
      if (officeFilter === "House") {
        filtered = filtered.filter(p => p.office_type === 'House' || p.office_type === 'House of Representatives');
      } else {
        filtered = filtered.filter(p => p.office_type === officeFilter);
      }
    }
    if (stateFilter !== "all") {
      filtered = filtered.filter(p => p.state === stateFilter);
    }

    // Sort: followed politicians first, then by approval rating
    filtered.sort((a, b) => {
      const aFollowed = followedPoliticians.includes(a.id);
      const bFollowed = followedPoliticians.includes(b.id);
      
      if (aFollowed && !bFollowed) return -1;
      if (!aFollowed && bFollowed) return 1;
      
      return (b.approval_rating || 0) - (a.approval_rating || 0);
    });

    setFilteredPoliticians(filtered);
  };

  const toggleFollow = async (politicianId) => {
    try {
      if (followedPoliticians.includes(politicianId)) {
        await import("../entities/User").then(m => m.User.unfollowPolitician(politicianId));
        setFollowedPoliticians(prev => prev.filter(id => id !== politicianId));
      } else {
        await import("../entities/User").then(m => m.User.followPolitician(politicianId));
        setFollowedPoliticians(prev => [...prev, politicianId]);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const getPartyColor = (party) => {
    switch (party) {
      case 'Democrat':
      case 'Democratic': return 'from-blue-500 to-blue-600';
      case 'Republican': return 'from-red-500 to-red-600';
      case 'Independent': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getApprovalColor = (rating) => {
    if (rating >= 60) return 'text-green-400';
    if (rating >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const cleanPoliticianName = (name) => {
    return name?.replace(/^(Rep\.|Sen\.|Gov\.)\s+/, '') || '';
  };

  const handleTagClick = (filterType, value) => {
    switch (filterType) {
      case 'party':
        setPartyFilter(value);
        break;
      case 'office':
        setOfficeFilter(value);
        break;
      case 'state':
        setStateFilter(value);
        break;
    }
  };

  const uniqueStates = [...new Set(politicians.map(p => p.state).filter(Boolean))].sort();

  // --- Recent Activity Section ---
  const getRecentActivity = (politician) => {
    // Placeholder: In real app, fetch or compute recent activity
    return [
      {
        icon: MessageSquare,
        title: 'Spoke on the House floor',
        time: '2h ago',
        color: 'text-blue-400'
      },
      {
        icon: Eye,
        title: 'Attended committee meeting',
        time: '1d ago',
        color: 'text-green-400'
      }
    ];
  };

  if (!user) {
    return (
      <AppLayout user={user}>
        <div className="px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold terminal-text">Loading...</h1>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user}>
      <div className="p-4 md:p-6 space-y-6 min-h-screen" style={{ background: 'var(--terminal-bg)' }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 md:mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold terminal-text mb-2">Political Profiles</h1>
              <p className="terminal-muted text-sm md:text-base">Comprehensive politician analytics and intelligence</p>
            </div>
            <div className="text-xl md:text-2xl font-mono terminal-text">
              {filteredPoliticians.length} profiles
            </div>
          </div>

          {/* Filters */}
          <Card className="terminal-surface border-gray-700 mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 terminal-muted" />
                  <Input
                    placeholder="Search politicians..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-600 terminal-text"
                  />
                </div>
                <Select value={partyFilter} onValueChange={setPartyFilter}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 terminal-text">
                    <SelectValue placeholder="All Parties" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all">All Parties</SelectItem>
                    <SelectItem value="Democrat">Democrat</SelectItem>
                    <SelectItem value="Republican">Republican</SelectItem>
                    <SelectItem value="Independent">Independent</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={officeFilter} onValueChange={setOfficeFilter}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 terminal-text">
                    <SelectValue placeholder="All Offices" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all">All Offices</SelectItem>
                    <SelectItem value="House">House</SelectItem>
                    <SelectItem value="House of Representatives">House of Representatives</SelectItem>
                    <SelectItem value="Senate">Senate</SelectItem>
                    <SelectItem value="Governor">Governor</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={stateFilter} onValueChange={setStateFilter}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 terminal-text">
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all">All States</SelectItem>
                    {uniqueStates.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Active Filters */}
          {(partyFilter !== "all" || officeFilter !== "all" || stateFilter !== "all") && (
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-sm terminal-muted">Active filters:</span>
              {partyFilter !== "all" && (
                <Badge 
                  variant="secondary" 
                  className="cursor-pointer bg-blue-900/50 text-blue-300 hover:bg-blue-900"
                  onClick={() => setPartyFilter("all")}
                >
                  {partyFilter} ×
                </Badge>
              )}
              {officeFilter !== "all" && (
                <Badge 
                  variant="secondary" 
                  className="cursor-pointer bg-green-900/50 text-green-300 hover:bg-green-900"
                  onClick={() => setOfficeFilter("all")}
                >
                  {officeFilter} ×
                </Badge>
              )}
              {stateFilter !== "all" && (
                <Badge 
                  variant="secondary" 
                  className="cursor-pointer bg-purple-900/50 text-purple-300 hover:bg-purple-900"
                  onClick={() => setStateFilter("all")}
                >
                  {stateFilter} ×
                </Badge>
              )}
            </div>
          )}

          {/* Politicians Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {isLoading ? (
              Array(9).fill(0).map((_, i) => (
                <Card key={i} className="terminal-surface border-gray-700">
                  <CardContent className="p-4 md:p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-12 w-12 rounded-full bg-gray-700" />
                      <Skeleton className="h-6 w-3/4 bg-gray-700" />
                      <Skeleton className="h-4 w-1/2 bg-gray-700" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full bg-gray-700" />
                        <Skeleton className="h-4 w-2/3 bg-gray-700" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              filteredPoliticians.map((politician) => (
                <Card key={politician.id} className="terminal-surface border-gray-700 hover:bg-gray-800/30 transition-all duration-300 terminal-glow flex flex-col relative">
                  {followedPoliticians.includes(politician.id) && (
                    <div className="absolute top-2 left-2 z-10">
                      <Badge className="bg-blue-500/80 text-white text-xs">
                        Following
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-4 md:p-6 flex-grow">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r ${getPartyColor(politician.party)}`}>
                        <span className="text-white font-bold text-lg">
                          {cleanPoliticianName(formatFullName(politician))?.charAt(0) || 'P'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold terminal-text truncate">{formatFullName(politician)}</h3>
                        <p className="text-sm terminal-muted">{politician.position}</p>
                        {(politician.office_type === 'House' || politician.office_type === 'House of Representatives') && politician.district && (
                          <p className="text-xs terminal-muted mt-1">District {politician.district}</p>
                        )}
                      </div>
                    </div>

                    {/* Years in office above approval rating */}
                    {politician.years_in_office && (
                      <div className="flex items-center gap-2 text-sm terminal-muted mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>{politician.years_in_office} years in office</span>
                      </div>
                    )}

                    {politician.approval_rating && (
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm terminal-muted">Approval Rating</span>
                        <div className="flex items-center gap-1">
                          <span className={`font-mono font-bold ${getApprovalColor(politician.approval_rating)}`}>
                            {politician.approval_rating}%
                          </span>
                          {politician.approval_rating >= 50 ? (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                      </div>
                    )}

                    {politician.campaign_funds && (
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm terminal-muted">Campaign Funds</span>
                        <span className="font-mono text-green-400">
                          ${(politician.campaign_funds / 1000000).toFixed(1)}M
                        </span>
                      </div>
                    )}

                    {/* Contact Information */}
                    <div className="space-y-1 mb-2">
                      {politician.dc_phone && (
                        <div className="flex items-center gap-2 text-xs terminal-muted">
                          <Phone className="w-3 h-3" />
                          <span>DC: {politician.dc_phone}</span>
                        </div>
                      )}
                      {politician.district_phone && (
                        <div className="flex items-center gap-2 text-xs terminal-muted">
                          <Phone className="w-3 h-3" />
                          <span>District: {politician.district_phone}</span>
                        </div>
                      )}
                    </div>

                    {politician.key_issues && politician.key_issues.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs terminal-muted mb-2">Key Issues:</p>
                        <div className="flex flex-wrap gap-1">
                          {politician.key_issues.slice(0, 3).map((issue, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-gray-800/50 text-gray-300 border-gray-600">
                              {issue}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* --- Recent Activity Section at the bottom --- */}
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold terminal-text mb-2">Recent Activity</h4>
                      <div className="space-y-2">
                        {getRecentActivity(politician).map((update, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-sm">
                            <update.icon className={`w-4 h-4 ${update.color}`} />
                            <span className="text-gray-300">{update.title}</span>
                            <span className="text-gray-500 text-xs">{update.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <div className="p-4 border-t border-gray-700 bg-gray-800/20 flex items-center justify-between">
                    <button
                      className="flex items-center justify-between text-sm text-blue-400 hover:text-blue-300 font-medium"
                      onClick={() => router.push(`/politician-profile?id=${politician.id}`)}
                    >
                      <span>View Full Profile & Transparency</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      className={`p-2 rounded-full transition-colors ${
                        followedPoliticians.includes(politician.id)
                          ? 'text-red-400 hover:text-red-300'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                      onClick={() => toggleFollow(politician.id)}
                    >
                      <Heart className={`w-5 h-5 ${followedPoliticians.includes(politician.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>

          {filteredPoliticians.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 terminal-muted opacity-50" />
              <h3 className="text-xl font-medium terminal-text mb-2">No politicians found</h3>
              <p className="terminal-muted">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}