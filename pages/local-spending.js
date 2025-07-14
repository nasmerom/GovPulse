import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { User } from "../entities/User";
import AppLayout from "../components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { 
  MapPin, 
  Search, 
  Filter, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Building, 
  Award,
  CheckCircle,
  Clock,
  HelpCircle,
  ArrowRight,
  Activity
} from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";

export default function LocalSpending() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [awards, setAwards] = useState([]);
  const [filteredAwards, setFilteredAwards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [agencyFilter, setAgencyFilter] = useState("all");
  const [supportFilter, setSupportFilter] = useState("all");
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user?.state && user?.district) {
      loadLocalSpending();
    }
  }, [user]);

  useEffect(() => {
    filterAwards();
  }, [awards, searchTerm, categoryFilter, agencyFilter, supportFilter]);

  const loadLocalSpending = async () => {
    setIsLoading(true);
    try {
      console.log('[LocalSpending] Loading data for:', user.state, user.district);
      
      const response = await fetch('/api/usaspending/local-spending', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state: user.state,
          district: user.district,
          limit: 50,
          page: 1
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('[LocalSpending] Received data:', data);
      
      setAwards(data.awards || []);
      setFilteredAwards(data.awards || []);
      setSummary(data.summary);
    } catch (error) {
      console.error('Error loading local spending:', error);
      // Use fallback data
      setAwards([]);
      setFilteredAwards([]);
    }
    setIsLoading(false);
  };

  const filterAwards = () => {
    let filtered = awards;

    if (searchTerm) {
      const sanitizedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(award => 
        award.recipient_name?.toLowerCase().includes(sanitizedTerm) ||
        award.description?.toLowerCase().includes(sanitizedTerm) ||
        award.awarding_agency?.toLowerCase().includes(sanitizedTerm)
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(award => award.category === categoryFilter);
    }

    if (agencyFilter !== "all") {
      filtered = filtered.filter(award => award.awarding_agency === agencyFilter);
    }

    if (supportFilter !== "all") {
      filtered = filtered.filter(award => award.representative_support === supportFilter);
    }

    setFilteredAwards(filtered);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Infrastructure': 'bg-blue-500/20 text-blue-400',
      'Healthcare': 'bg-green-500/20 text-green-400',
      'Education': 'bg-purple-500/20 text-purple-400',
      'Transportation': 'bg-orange-500/20 text-orange-400',
      'Research & Development': 'bg-indigo-500/20 text-indigo-400',
      'Defense': 'bg-red-500/20 text-red-400',
      'Other': 'bg-gray-500/20 text-gray-400'
    };
    return colors[category] || colors['Other'];
  };

  const getSupportColor = (support) => {
    const colors = {
      'Supported': 'bg-green-500/20 text-green-400',
      'Likely Supported': 'bg-yellow-500/20 text-yellow-400',
      'Unknown': 'bg-gray-500/20 text-gray-400'
    };
    return colors[support] || colors['Unknown'];
  };

  const getSupportIcon = (support) => {
    switch (support) {
      case 'Supported':
        return <CheckCircle className="w-4 h-4" />;
      case 'Likely Supported':
        return <Clock className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  const formatAmount = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const uniqueCategories = [...new Set(awards.map(a => a.category).filter(Boolean))];
  const uniqueAgencies = [...new Set(awards.map(a => a.awarding_agency).filter(Boolean))];

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <AppLayout user={user}>
      <div className="p-6 space-y-6 min-h-screen political-terminal">
        <div className="w-full">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 md:mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold terminal-text mb-2">Local Federal Spending</h1>
              <p className="terminal-muted text-sm md:text-base">
                Federal funds and projects in {user.state} District {user.district}
              </p>
            </div>
            <div className="text-xl md:text-2xl font-mono terminal-text">
              {filteredAwards.length} projects
            </div>
          </div>

          {/* Summary Cards */}
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="terminal-surface border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-8 h-8 text-green-400" />
                    <div>
                      <p className="text-sm terminal-muted">Total Funding</p>
                      <p className="text-2xl font-bold text-green-400">
                        {formatAmount(summary.total_amount)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="terminal-surface border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Award className="w-8 h-8 text-blue-400" />
                    <div>
                      <p className="text-sm terminal-muted">Total Projects</p>
                      <p className="text-2xl font-bold text-blue-400">
                        {summary.award_count}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="terminal-surface border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Building className="w-8 h-8 text-purple-400" />
                    <div>
                      <p className="text-sm terminal-muted">Top Agency</p>
                      <p className="text-lg font-bold text-purple-400">
                        {summary.top_agencies?.[0]?.agency?.split(' ').slice(0, 2).join(' ') || 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="terminal-surface border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-8 h-8 text-orange-400" />
                    <div>
                      <p className="text-sm terminal-muted">Top Category</p>
                      <p className="text-lg font-bold text-orange-400">
                        {summary.top_categories?.[0]?.category || 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters */}
          <Card className="terminal-surface border-gray-700 mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 terminal-muted" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-600 terminal-text"
                  />
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 terminal-text">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all">All Categories</SelectItem>
                    {uniqueCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={agencyFilter} onValueChange={setAgencyFilter}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 terminal-text">
                    <SelectValue placeholder="All Agencies" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all">All Agencies</SelectItem>
                    {uniqueAgencies.map(agency => (
                      <SelectItem key={agency} value={agency}>{agency}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={supportFilter} onValueChange={setSupportFilter}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 terminal-text">
                    <SelectValue placeholder="All Support" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all">All Support</SelectItem>
                    <SelectItem value="Supported">Supported</SelectItem>
                    <SelectItem value="Likely Supported">Likely Supported</SelectItem>
                    <SelectItem value="Unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Active Filters */}
          {(categoryFilter !== "all" || agencyFilter !== "all" || supportFilter !== "all") && (
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-sm terminal-muted">Active filters:</span>
              {categoryFilter !== "all" && (
                <Badge 
                  variant="secondary" 
                  className="cursor-pointer bg-blue-900/50 text-blue-300 hover:bg-blue-900"
                  onClick={() => setCategoryFilter("all")}
                >
                  {categoryFilter} ×
                </Badge>
              )}
              {agencyFilter !== "all" && (
                <Badge 
                  variant="secondary" 
                  className="cursor-pointer bg-green-900/50 text-green-300 hover:bg-green-900"
                  onClick={() => setAgencyFilter("all")}
                >
                  {agencyFilter} ×
                </Badge>
              )}
              {supportFilter !== "all" && (
                <Badge 
                  variant="secondary" 
                  className="cursor-pointer bg-purple-900/50 text-purple-300 hover:bg-purple-900"
                  onClick={() => setSupportFilter("all")}
                >
                  {supportFilter} ×
                </Badge>
              )}
            </div>
          )}

          {/* Awards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <Card key={i} className="terminal-surface border-gray-700">
                  <CardContent className="p-6">
                    <div className="space-y-4">
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
              filteredAwards.map((award) => (
                <Card key={award.id} className="terminal-surface border-gray-700 hover:bg-gray-800/30 transition-all duration-300 terminal-glow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold terminal-text text-lg mb-1 line-clamp-2">
                            {award.recipient_name}
                          </h3>
                          <p className="text-sm terminal-muted line-clamp-2">
                            {award.description}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-2xl font-bold text-green-400">
                            {formatAmount(award.amount)}
                          </p>
                          <p className="text-xs terminal-muted">{award.award_type}</p>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className={getCategoryColor(award.category)}>
                          {award.category}
                        </Badge>
                        <Badge variant="secondary" className={getSupportColor(award.representative_support)}>
                          <div className="flex items-center gap-1">
                            {getSupportIcon(award.representative_support)}
                            {award.representative_support}
                          </div>
                        </Badge>
                        {award.impact_score && (
                          <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
                            Impact: {award.impact_score}/10
                          </Badge>
                        )}
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="terminal-muted">Agency</p>
                          <p className="terminal-text font-medium">{award.awarding_agency}</p>
                        </div>
                        <div>
                          <p className="terminal-muted">Location</p>
                          <p className="terminal-text font-medium">
                            {award.city}, {award.state}
                          </p>
                        </div>
                        <div>
                          <p className="terminal-muted">Start Date</p>
                          <p className="terminal-text font-medium">{formatDate(award.start_date)}</p>
                        </div>
                        <div>
                          <p className="terminal-muted">End Date</p>
                          <p className="terminal-text font-medium">{formatDate(award.end_date)}</p>
                        </div>
                      </div>

                      {/* NAICS Info */}
                      {award.naics_description && (
                        <div className="pt-2 border-t border-gray-700">
                          <p className="text-xs terminal-muted">Industry: {award.naics_description}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {filteredAwards.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Award className="w-16 h-16 mx-auto mb-4 terminal-muted opacity-50" />
              <h3 className="text-xl font-medium terminal-text mb-2">No projects found</h3>
              <p className="terminal-muted">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
} 