import React, { useState, useEffect } from 'react';
import { User } from '../entities/User';
import AppLayout from '../components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  Mail, 
  Plus, 
  Eye, 
  Reply, 
  Archive, 
  Flag, 
  Search, 
  Filter,
  Clock,
  User as UserIcon,
  MessageSquare,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function CorrespondencePage() {
  const [user, setUser] = useState(null);
  const [correspondence, setCorrespondence] = useState([]);
  const [filteredCorrespondence, setFilteredCorrespondence] = useState([]);
  const [selectedCorrespondence, setSelectedCorrespondence] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateCase, setShowCreateCase] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [cases, setCases] = useState([]);

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
    loadCorrespondence();
    loadCases();
  }, []);

  useEffect(() => {
    filterCorrespondence();
  }, [correspondence, searchTerm, priorityFilter, statusFilter]);

  const loadCorrespondence = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockCorrespondence = [
        {
          id: 1,
          constituent: "Sarah Johnson",
          email: "sarah.johnson@email.com",
          subject: "Healthcare Reform Support",
          category: "Healthcare",
          priority: "High",
          sentiment: "positive",
          received: "2024-01-15",
          status: "pending",
          aiSummary: "Constituent strongly supports healthcare reform legislation and shares personal story about insurance costs.",
          content: "Dear Representative, I am writing to express my strong support for the healthcare reform bill currently under consideration. As someone who has struggled with high insurance premiums, I believe this legislation will make a real difference in people's lives...",
          responseRequired: true,
          caseId: 1
        },
        {
          id: 2,
          constituent: "Mike Chen",
          email: "mike.chen@email.com",
          subject: "Climate Change Concerns",
          category: "Environment",
          priority: "Medium",
          sentiment: "negative",
          received: "2024-01-14",
          status: "in_progress",
          aiSummary: "Constituent expresses concerns about climate policy and requests stronger environmental protections.",
          content: "I am concerned about the current climate policy direction and believe we need stronger environmental protections...",
          responseRequired: true,
          caseId: 2
        },
        {
          id: 3,
          constituent: "Lisa Rodriguez",
          email: "lisa.rodriguez@email.com",
          subject: "Education Funding",
          category: "Education",
          priority: "High",
          sentiment: "neutral",
          received: "2024-01-13",
          status: "completed",
          aiSummary: "Constituent asks about education funding allocation and local school district support.",
          content: "I would like to know more about how education funding is being allocated in our district...",
          responseRequired: false
        }
      ];

      setCorrespondence(mockCorrespondence);
    } catch (error) {
      console.error('Error loading correspondence:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCases = async () => {
    try {
      const response = await fetch('/api/correspondence/case-management');
      const data = await response.json();
      setCases(data);
    } catch (error) {
      console.error('Error loading cases:', error);
    }
  };

  const createCaseFromCorrespondence = async (correspondence) => {
    try {
      const response = await fetch('/api/correspondence/case-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_case',
          correspondenceId: correspondence.id,
          constituent: correspondence.constituent,
          email: correspondence.email,
          subject: correspondence.subject,
          category: correspondence.category,
          priority: correspondence.priority,
          estimatedResolution: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
        }),
      });

      if (response.ok) {
        const newCase = await response.json();
        setCases([...cases, newCase]);
        // Update correspondence with case ID
        setCorrespondence(correspondence.map(c => 
          c.id === correspondence.id ? { ...c, caseId: newCase.id } : c
        ));
        setShowCreateCase(false);
      }
    } catch (error) {
      console.error('Error creating case:', error);
    }
  };

  const filterCorrespondence = () => {
    let filtered = correspondence;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(comm => 
        comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comm.constituent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comm.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(comm => comm.priority === priorityFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(comm => comm.status === statusFilter);
    }

    setFilteredCorrespondence(filtered);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'Low': return 'bg-green-500/10 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'in_progress': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'completed': return 'bg-green-500/10 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return CheckCircle;
      case 'negative': return AlertTriangle;
      case 'neutral': return MessageSquare;
      default: return MessageSquare;
    }
  };

  const getCaseForCorrespondence = (correspondenceId) => {
    return cases.find(c => c.correspondenceId === correspondenceId);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <AppLayout user={user}>
      <div className="px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold terminal-text">Constituent Correspondence</h1>
              <p className="text-gray-400 mt-2">Manage constituent communications and responses</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowCreateCase(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Case
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Response
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="terminal-surface border-gray-700">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-gray-300">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search correspondence..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 terminal-input border-gray-600 bg-gray-800 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">Priority</Label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full terminal-input border-gray-600 bg-gray-800 text-white px-3 py-2 rounded-md"
                  >
                    <option value="all">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <Label className="text-gray-300">Status</Label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full terminal-input border-gray-600 bg-gray-800 text-white px-3 py-2 rounded-md"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={() => {
                      setSearchTerm('');
                      setPriorityFilter('all');
                      setStatusFilter('all');
                    }}
                    variant="outline" 
                    className="w-full border-gray-600 text-gray-300"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Correspondence List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Correspondence List */}
            <div className="lg:col-span-2">
              <Card className="terminal-surface border-gray-700">
                <CardHeader>
                  <CardTitle className="terminal-text flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-blue-400" />
                    Correspondence ({filteredCorrespondence.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="animate-pulse">
                            <div className="h-24 bg-gray-800 rounded-lg"></div>
                          </div>
                        ))}
                      </div>
                    ) : filteredCorrespondence.length === 0 ? (
                      <div className="text-center py-8">
                        <Mail className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">No correspondence found</p>
                      </div>
                    ) : (
                      filteredCorrespondence.map((correspondence) => {
                        const SentimentIcon = getSentimentIcon(correspondence.sentiment);
                        return (
                          <div 
                            key={correspondence.id} 
                            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                              selectedCorrespondence?.id === correspondence.id
                                ? 'bg-blue-600/20 border-blue-500'
                                : 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50'
                            }`}
                            onClick={() => setSelectedCorrespondence(correspondence)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <SentimentIcon className="w-4 h-4 text-blue-400" />
                                    <span className="font-medium terminal-text">{correspondence.constituent}</span>
                                    <span className="text-sm text-gray-500">({correspondence.email})</span>
                                  </div>
                                  <h4 className="font-semibold terminal-text mb-1">{correspondence.subject}</h4>
                                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">{correspondence.aiSummary}</p>
                                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    <span>{correspondence.received}</span>
                                    <span>Category: {correspondence.category}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                <Badge className={getPriorityColor(correspondence.priority)}>
                                  {correspondence.priority}
                                </Badge>
                                <Badge className={getStatusColor(correspondence.status)}>
                                  {correspondence.status.replace('_', ' ')}
                                </Badge>
                                {correspondence.caseId && (
                                  <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                                    Case #{correspondence.caseId}
                                  </Badge>
                                )}
                                {correspondence.responseRequired && (
                                  <Badge className="bg-red-500/10 text-red-400 border-red-500/30">
                                    Response Required
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Correspondence Detail */}
            <div className="lg:col-span-1">
              <Card className="terminal-surface border-gray-700">
                <CardHeader>
                  <CardTitle className="terminal-text flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-green-400" />
                    Correspondence Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedCorrespondence ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold terminal-text mb-2">{selectedCorrespondence.subject}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-3">
                          <span>From: {selectedCorrespondence.constituent}</span>
                          <span>•</span>
                          <span>{selectedCorrespondence.email}</span>
                        </div>
                        <div className="flex items-center space-x-4 mb-4">
                          <Badge className={getPriorityColor(selectedCorrespondence.priority)}>
                            {selectedCorrespondence.priority}
                          </Badge>
                          <Badge className={getStatusColor(selectedCorrespondence.status)}>
                            {selectedCorrespondence.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-800/50 rounded-lg">
                        <h4 className="font-medium terminal-text mb-2">AI Summary:</h4>
                        <p className="text-sm text-gray-300">{selectedCorrespondence.aiSummary}</p>
                      </div>

                      <div className="p-4 bg-gray-800/50 rounded-lg">
                        <h4 className="font-medium terminal-text mb-2">Full Message:</h4>
                        <p className="text-sm text-gray-300">{selectedCorrespondence.content}</p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-400">Category:</span>
                          <p className="text-sm terminal-text">{selectedCorrespondence.category}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-400">Received:</span>
                          <p className="text-sm terminal-text">{selectedCorrespondence.received}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-400">Sentiment:</span>
                          <p className="text-sm terminal-text capitalize">{selectedCorrespondence.sentiment}</p>
                        </div>
                        {selectedCorrespondence.caseId && (
                          <div>
                            <span className="text-sm text-gray-400">Case Status:</span>
                            <div className="mt-2">
                              {(() => {
                                const caseData = getCaseForCorrespondence(selectedCorrespondence.id);
                                return caseData ? (
                                  <div className="space-y-2">
                                    <Badge className={getStatusColor(caseData.status)}>
                                      {caseData.stage}
                                    </Badge>
                                    <div className="text-xs text-gray-500">
                                      Assigned to: {caseData.assignedTo}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Est. Resolution: {caseData.estimatedResolution}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-sm text-gray-500">No case created yet</span>
                                );
                              })()}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2 pt-4 border-t border-gray-600">
                        {!selectedCorrespondence.caseId && (
                          <Button 
                            onClick={() => createCaseFromCorrespondence(selectedCorrespondence)}
                            className="bg-green-600 hover:bg-green-700 text-white flex-1"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Case
                          </Button>
                        )}
                        {selectedCorrespondence.responseRequired && (
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
                            <Reply className="w-4 h-4 mr-2" />
                            Respond
                          </Button>
                        )}
                        <Button variant="outline" className="border-gray-600 text-gray-300">
                          <Archive className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" className="border-gray-600 text-gray-300">
                          <Flag className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Eye className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">Select a correspondence to view details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Create Case Modal */}
        {showCreateCase && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="terminal-surface border-gray-700 w-full max-w-md">
              <CardHeader>
                <CardTitle className="terminal-text">Create Case from Correspondence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-400 text-sm">
                  Select correspondence to create a case with automated status updates.
                </p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {correspondence.filter(c => !c.caseId).map((corr) => (
                    <div 
                      key={corr.id}
                      className="p-3 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700/50"
                      onClick={() => {
                        createCaseFromCorrespondence(corr);
                        setShowCreateCase(false);
                      }}
                    >
                      <div className="font-medium terminal-text">{corr.subject}</div>
                      <div className="text-sm text-gray-400">{corr.constituent}</div>
                      <div className="text-xs text-gray-500">{corr.received}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-600">
                  <Button 
                    onClick={() => setShowCreateCase(false)}
                    variant="outline" 
                    className="border-gray-600 text-gray-300"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
} 