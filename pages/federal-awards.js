import React, { useState, useEffect } from "react";
import { GovernmentContract } from "../entities/GovernmentContract";
import { User } from "../entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Award, Search, Filter, Calendar, DollarSign, Building, ExternalLink } from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";
import { format } from "date-fns";
import AppLayout from "../components/AppLayout";

export default function FederalAwards() {
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [contractsData, userData] = await Promise.all([
          GovernmentContract.list('-posted_date', 100), // Reduced from 200 to 100
          User.me().catch(() => null)
        ]);
        setContracts(contractsData);
        setUser(userData);
      } catch (error) {
        console.error('Error loading federal awards:', error);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    filterContracts();
  }, [contracts, searchTerm, sectorFilter, typeFilter, user]);

  const filterContracts = () => {
    let filtered = contracts;

    // Filter by user's business sector if available
    if (user?.business_sector && user.business_sector !== 'other') {
      filtered = filtered.filter(contract => 
        contract.relevant_sectors?.includes(user.business_sector)
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(contract =>
        contract.contract_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.agency?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sectorFilter !== "all") {
      filtered = filtered.filter(contract =>
        contract.relevant_sectors?.includes(sectorFilter)
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(contract => contract.set_aside === typeFilter);
    }

    setFilteredContracts(filtered);
  };

  const getSetAsideColor = (setAside) => {
    switch (setAside) {
      case 'small_business': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'woman_owned': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'veteran_owned': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'hubzone': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case '8a': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount?.toLocaleString()}`;
  };

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
                <Award className="w-8 h-8 text-green-400" />
                Federal Awards & Contracts
              </h1>
              <p className="terminal-muted">Government contracting and grant opportunities</p>
              {user?.business_sector && (
                <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-400 border-green-500/30">
                  Filtered for {user.business_sector} sector
                </Badge>
              )}
            </div>
            <div className="text-2xl font-mono terminal-text">
              {filteredContracts.length} opportunities
            </div>
          </div>

          {/* Filters */}
          <Card className="terminal-surface border-gray-700 mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 terminal-muted" />
                  <Input
                    placeholder="Search opportunities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-600 terminal-text"
                  />
                </div>
                
                <Select value={sectorFilter} onValueChange={setSectorFilter}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 terminal-text">
                    <SelectValue placeholder="All Sectors" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all">All Sectors</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="transportation">Transportation</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 terminal-text">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="small_business">Small Business</SelectItem>
                    <SelectItem value="woman_owned">Woman-Owned</SelectItem>
                    <SelectItem value="veteran_owned">Veteran-Owned</SelectItem>
                    <SelectItem value="hubzone">HUBZone</SelectItem>
                    <SelectItem value="8a">8(a)</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2 text-sm terminal-muted">
                  <Filter className="w-4 h-4" />
                  <span>{filteredContracts.length} results</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contracts Grid */}
          <div className="grid grid-cols-1 gap-6">
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <Card key={i} className="terminal-surface border-gray-700">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-3/4 bg-gray-700" />
                      <Skeleton className="h-4 w-full bg-gray-700" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-20 bg-gray-700" />
                        <Skeleton className="h-6 w-24 bg-gray-700" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              filteredContracts.map((contract) => (
                <Card key={contract.id} className="terminal-surface border-gray-700 hover:bg-gray-800/30 transition-all duration-300 terminal-glow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                              <Award className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold terminal-text text-lg mb-2">{contract.contract_title}</h3>
                            <div className="flex items-center gap-3 mb-3">
                              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                                {contract.agency}
                              </Badge>
                              {contract.set_aside && contract.set_aside !== 'none' && (
                                <Badge variant="outline" className={getSetAsideColor(contract.set_aside)}>
                                  {contract.set_aside.replace('_', ' ')}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm terminal-muted mb-4 leading-relaxed">{contract.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-green-400" />
                                <span className="terminal-muted">Value:</span>
                                <span className="terminal-text font-mono">{formatCurrency(contract.contract_value)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-400" />
                                <span className="terminal-muted">Posted:</span>
                                <span className="terminal-text">{format(new Date(contract.posted_date), 'MMM d, yyyy')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-red-400" />
                                <span className="terminal-muted">Deadline:</span>
                                <span className="terminal-text">{format(new Date(contract.response_deadline), 'MMM d, yyyy')}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {contract.eligibility_requirements && contract.eligibility_requirements.length > 0 && (
                          <div className="p-3 rounded-lg bg-gray-800/50 border-l-4 border-amber-500">
                            <h5 className="font-medium terminal-text mb-2">Eligibility Requirements</h5>
                            <ul className="text-sm terminal-muted space-y-1">
                              {contract.eligibility_requirements.map((req, idx) => (
                                <li key={idx}>• {req}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="lg:w-64 space-y-4">
                        <div className="p-4 rounded-lg bg-gray-800/30">
                          <h5 className="font-medium terminal-text mb-2">Contract Details</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="terminal-muted">Type:</span>
                              <span className="terminal-text">{contract.contract_type?.replace('_', ' ')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="terminal-muted">NAICS:</span>
                              <span className="terminal-text">{contract.naics_code}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="terminal-muted">Office:</span>
                              <span className="terminal-text text-xs">{contract.office}</span>
                            </div>
                          </div>
                        </div>

                        {contract.link && (
                          <a
                            href={contract.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-center text-white font-medium"
                          >
                            <ExternalLink className="w-4 h-4 inline mr-2" />
                            View Full Solicitation
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {filteredContracts.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Award className="w-16 h-16 mx-auto mb-4 terminal-muted opacity-50" />
              <h3 className="text-xl font-medium terminal-text mb-2">No opportunities found</h3>
              <p className="terminal-muted">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
} 