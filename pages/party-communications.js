import { useState, useEffect } from 'react';
import { User } from '../entities/User';
import AppLayout from '../components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  Users, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Star,
  Filter,
  Search,
  Eye,
  Reply,
  Archive,
  Flag,
  Send,
  Bell,
  Shield,
  Target,
  TrendingUp,
  Calendar,
  UserPlus,
  Settings,
  FileText,
  Download
} from 'lucide-react';

export default function PartyCommunications() {
  const [user, setUser] = useState(null);
  const [communications, setCommunications] = useState([]);
  const [filteredCommunications, setFilteredCommunications] = useState([]);
  const [selectedCommunication, setSelectedCommunication] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

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
    loadPartyCommunications();
  }, []);

  useEffect(() => {
    filterCommunications();
  }, [communications, searchTerm, priorityFilter, statusFilter]);

  const loadPartyCommunications = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockCommunications = [
        {
          id: 1,
          from: "Party Leadership",
          fromRole: "Majority Leader",
          subject: "Vote Whip Alert - Infrastructure Bill H.R. 1234",
          priority: "High",
          date: "2024-01-15",
          time: "10:30 AM",
          status: "unread",
          action: "Vote YES required",
          deadline: "2024-01-20",
          category: "whip_alert",
          content: "Leadership strongly supports this infrastructure bill. Please confirm your YES vote by Friday. This is a priority for the party and the administration.",
          attachments: ["bill_summary.pdf", "talking_points.docx"],
          recipients: ["All House Democrats"],
          responseRequired: true
        },
        {
          id: 2,
          from: "Committee Chair",
          fromRole: "Transportation Committee",
          subject: "Hearing Preparation - Healthcare Reform",
          priority: "Medium",
          date: "2024-01-14",
          time: "2:15 PM",
          status: "read",
          action: "Review materials",
          deadline: "2024-01-18",
          category: "committee",
          content: "Please review the attached materials for next week's healthcare reform hearing. Key witnesses will include industry leaders and policy experts.",
          attachments: ["hearing_materials.pdf", "witness_list.xlsx"],
          recipients: ["Committee Members"],
          responseRequired: false
        },
        {
          id: 3,
          from: "Whip Team",
          fromRole: "Deputy Whip",
          subject: "Constituent Services Update",
          priority: "Low",
          date: "2024-01-13",
          time: "9:45 AM",
          status: "read",
          action: "Information only",
          deadline: null,
          category: "information",
          content: "Weekly update on constituent services best practices and new resources available to members.",
          attachments: ["best_practices.pdf"],
          recipients: ["All Members"],
          responseRequired: false
        },
        {
          id: 4,
          from: "Policy Team",
          fromRole: "Policy Director",
          subject: "Climate Policy Briefing",
          priority: "High",
          date: "2024-01-12",
          time: "11:20 AM",
          status: "unread",
          action: "Attend briefing",
          deadline: "2024-01-16",
          category: "briefing",
          content: "Important briefing on upcoming climate policy legislation. Your attendance is requested.",
          attachments: ["climate_briefing.pdf", "policy_analysis.docx"],
          recipients: ["Environmental Committee Members"],
          responseRequired: true
        }
      ];

      setCommunications(mockCommunications);
    } catch (error) {
      console.error('Error loading party communications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCommunications = () => {
    let filtered = communications;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(comm => 
        comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comm.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

    setFilteredCommunications(filtered);
  };

  const markAsRead = (communicationId) => {
    setCommunications(prev => 
      prev.map(comm => 
        comm.id === communicationId 
          ? { ...comm, status: 'read' }
          : comm
      )
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'Low': return 'bg-green-500/10 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'whip_alert': return AlertTriangle;
      case 'committee': return Users;
      case 'briefing': return MessageSquare;
      case 'information': return Info;
      default: return MessageSquare;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'whip_alert': return 'text-red-400';
      case 'committee': return 'text-blue-400';
      case 'briefing': return 'text-purple-400';
      case 'information': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  if (!user) {
    return (
      <div className="w-full min-h-screen political-terminal p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  return (
    <AppLayout user={user}>
      <div className="px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold terminal-text">Party Communications</h1>
              <p className="text-gray-400 mt-2">Manage party communications, whip alerts, and leadership messages</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                <Settings className="w-4 h-4 mr-2" />
                Settings
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
                      placeholder="Search communications..."
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
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
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

          {/* Communications List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Communications List */}
            <div className="lg:col-span-2">
              <Card className="terminal-surface border-gray-700">
                <CardHeader>
                  <CardTitle className="terminal-text flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
                    Communications ({filteredCommunications.length})
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
                    ) : filteredCommunications.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">No communications found</p>
                      </div>
                    ) : (
                      filteredCommunications.map((communication) => {
                        const CategoryIcon = getCategoryIcon(communication.category);
                        return (
                          <div 
                            key={communication.id} 
                            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                              selectedCommunication?.id === communication.id
                                ? 'bg-blue-600/20 border-blue-500'
                                : communication.status === 'unread'
                                ? 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50'
                                : 'bg-gray-800/30 border-gray-600 hover:bg-gray-700/30'
                            }`}
                            onClick={() => {
                              setSelectedCommunication(communication);
                              markAsRead(communication.id);
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <div className={`w-2 h-2 rounded-full mt-2 ${
                                  communication.status === 'unread' ? 'bg-blue-400' : 'bg-gray-500'
                                }`} />
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <CategoryIcon className={`w-4 h-4 ${getCategoryColor(communication.category)}`} />
                                    <span className="font-medium terminal-text">{communication.from}</span>
                                    <span className="text-sm text-gray-500">({communication.fromRole})</span>
                                  </div>
                                  <h4 className="font-semibold terminal-text mb-1">{communication.subject}</h4>
                                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">{communication.content}</p>
                                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    <span>{communication.date} at {communication.time}</span>
                                    {communication.deadline && (
                                      <span className="text-orange-400">Deadline: {communication.deadline}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                <Badge className={getPriorityColor(communication.priority)}>
                                  {communication.priority}
                                </Badge>
                                {communication.responseRequired && (
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

            {/* Communication Detail */}
            <div className="lg:col-span-1">
              <Card className="terminal-surface border-gray-700">
                <CardHeader>
                  <CardTitle className="terminal-text flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-green-400" />
                    Communication Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedCommunication ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold terminal-text mb-2">{selectedCommunication.subject}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-3">
                          <span>From: {selectedCommunication.from}</span>
                          <span>•</span>
                          <span>{selectedCommunication.fromRole}</span>
                        </div>
                        <div className="flex items-center space-x-4 mb-4">
                          <Badge className={getPriorityColor(selectedCommunication.priority)}>
                            {selectedCommunication.priority}
                          </Badge>
                          <Badge className={getCategoryColor(selectedCommunication.category)}>
                            {selectedCommunication.category.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-800/50 rounded-lg">
                        <h4 className="font-medium terminal-text mb-2">Content:</h4>
                        <p className="text-sm text-gray-300">{selectedCommunication.content}</p>
                      </div>

                      {selectedCommunication.attachments && selectedCommunication.attachments.length > 0 && (
                        <div>
                          <h4 className="font-medium terminal-text mb-2">Attachments:</h4>
                          <div className="space-y-2">
                            {selectedCommunication.attachments.map((attachment, index) => (
                              <div key={index} className="flex items-center space-x-2 p-2 bg-gray-800/30 rounded">
                                <FileText className="w-4 h-4 text-blue-400" />
                                <span className="text-sm text-gray-300">{attachment}</span>
                                <Button size="sm" variant="outline" className="ml-auto border-gray-600 text-gray-300">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-400">Action Required:</span>
                          <p className="text-sm terminal-text">{selectedCommunication.action}</p>
                        </div>
                        {selectedCommunication.deadline && (
                          <div>
                            <span className="text-sm text-gray-400">Deadline:</span>
                            <p className="text-sm text-orange-400">{selectedCommunication.deadline}</p>
                          </div>
                        )}
                        <div>
                          <span className="text-sm text-gray-400">Recipients:</span>
                          <p className="text-sm terminal-text">{selectedCommunication.recipients.join(', ')}</p>
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-4 border-t border-gray-600">
                        {selectedCommunication.responseRequired && (
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
                      <p className="text-gray-400">Select a communication to view details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 