import React, { useState, useEffect } from 'react';
import { User } from '../entities/User';
import AppLayout from '../components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
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
  AlertTriangle,
  Send,
  Bell,
  Workflow,
  Calendar,
  Users,
  FileText,
  ArrowRight,
  CheckCircle2,
  Circle,
  AlertCircle,
  ClipboardList
} from 'lucide-react';

export default function CaseManagementPage() {
  const [user, setUser] = useState(null);
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateCase, setShowCreateCase] = useState(false);
  const [newCaseData, setNewCaseData] = useState({});
  const [showNotificationTemplates, setShowNotificationTemplates] = useState(false);

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
    loadCases();
  }, []);

  useEffect(() => {
    filterCases();
  }, [cases, searchTerm, statusFilter, priorityFilter]);

  const loadCases = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/correspondence/case-management');
      const data = await response.json();
      setCases(data);
    } catch (error) {
      console.error('Error loading cases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCases = () => {
    let filtered = cases;

    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.constituent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(c => c.priority === priorityFilter);
    }

    setFilteredCases(filtered);
  };

  const createCase = async () => {
    try {
      const response = await fetch('/api/correspondence/case-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_case',
          ...newCaseData
        }),
      });

      if (response.ok) {
        const newCase = await response.json();
        setCases([...cases, newCase]);
        setShowCreateCase(false);
        setNewCaseData({});
      }
    } catch (error) {
      console.error('Error creating case:', error);
    }
  };

  const updateCaseStatus = async (caseId, status, stage, notes) => {
    try {
      const response = await fetch('/api/correspondence/case-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_status',
          caseId,
          status,
          stage,
          notes,
          author: user?.name || 'System'
        }),
      });

      if (response.ok) {
        await loadCases(); // Reload cases to get updated data
      }
    } catch (error) {
      console.error('Error updating case:', error);
    }
  };

  const advanceStage = async (caseId, nextStage) => {
    try {
      const response = await fetch('/api/correspondence/case-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'advance_stage',
          caseId,
          nextStage
        }),
      });

      if (response.ok) {
        await loadCases(); // Reload cases to get updated data
      }
    } catch (error) {
      console.error('Error advancing stage:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'under_review': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'research': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'drafting': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'pending_approval': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'completed': return 'bg-green-500/10 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'Low': return 'bg-green-500/10 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getWorkflowStages = () => [
    { id: 1, name: "Received", icon: Mail },
    { id: 2, name: "Under Review", icon: Eye },
    { id: 3, name: "Research", icon: Search },
    { id: 4, name: "Draft Response", icon: FileText },
    { id: 5, name: "Approval", icon: CheckCircle },
    { id: 6, name: "Sent", icon: Send }
  ];

  const notificationTemplates = [
    {
      id: 'case_created',
      name: 'Case Created',
      subject: 'Your Case Has Been Received',
      description: 'Sent when a new case is created from correspondence'
    },
    {
      id: 'case_assigned',
      name: 'Case Assigned',
      subject: 'Your Case is Under Review',
      description: 'Sent when case is assigned to staff member'
    },
    {
      id: 'research_started',
      name: 'Research Started',
      subject: 'Research Underway on Your Case',
      description: 'Sent when research phase begins'
    },
    {
      id: 'status_updated',
      name: 'Status Update',
      subject: 'Update on Your Case',
      description: 'Sent when case status changes'
    },
    {
      id: 'stage_advanced',
      name: 'Stage Advanced',
      subject: 'Progress Update on Your Case',
      description: 'Sent when case advances to next workflow stage'
    }
  ];

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
              <h1 className="text-3xl font-bold terminal-text">Case Management</h1>
              <p className="text-gray-400 mt-2">Track constituent cases and automated status updates</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowNotificationTemplates(true)}
                variant="outline" 
                className="border-gray-600 text-gray-300"
              >
                <Bell className="w-4 h-4 mr-2" />
                Notification Templates
              </Button>
              <Button 
                onClick={() => setShowCreateCase(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Case
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="terminal-surface border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <ClipboardList className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Active Cases</p>
                    <p className="text-xl font-semibold terminal-text">
                      {cases.filter(c => c.status !== 'completed').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="terminal-surface border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Under Review</p>
                    <p className="text-xl font-semibold terminal-text">
                      {cases.filter(c => c.status === 'under_review').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="terminal-surface border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Completed</p>
                    <p className="text-xl font-semibold terminal-text">
                      {cases.filter(c => c.status === 'completed').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="terminal-surface border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Bell className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Notifications Sent</p>
                    <p className="text-xl font-semibold terminal-text">
                      {cases.reduce((total, c) => total + (c.notifications?.length || 0), 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                      placeholder="Search cases..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 terminal-input border-gray-600 bg-gray-800 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">Status</Label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full terminal-input border-gray-600 bg-gray-800 text-white px-3 py-2 rounded-md"
                  >
                    <option value="all">All Status</option>
                    <option value="under_review">Under Review</option>
                    <option value="research">Research</option>
                    <option value="drafting">Drafting</option>
                    <option value="pending_approval">Pending Approval</option>
                    <option value="completed">Completed</option>
                  </select>
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
                <div className="flex items-end">
                  <Button 
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setPriorityFilter('all');
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

          {/* Cases List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cases List */}
            <div className="lg:col-span-2">
              <Card className="terminal-surface border-gray-700">
                <CardHeader>
                  <CardTitle className="terminal-text flex items-center">
                    <ClipboardList className="w-5 h-5 mr-2 text-blue-400" />
                    Active Cases ({filteredCases.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="animate-pulse">
                            <div className="h-32 bg-gray-800 rounded-lg"></div>
                          </div>
                        ))}
                      </div>
                    ) : filteredCases.length === 0 ? (
                      <div className="text-center py-8">
                        <ClipboardList className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">No cases found</p>
                      </div>
                    ) : (
                      filteredCases.map((caseItem) => (
                        <div 
                          key={caseItem.id} 
                          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                            selectedCase?.id === caseItem.id
                              ? 'bg-blue-600/20 border-blue-500'
                              : 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50'
                          }`}
                          onClick={() => setSelectedCase(caseItem)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-sm font-mono text-blue-400">#{caseItem.id}</span>
                                <Badge className={getPriorityColor(caseItem.priority)}>
                                  {caseItem.priority}
                                </Badge>
                                <Badge className={getStatusColor(caseItem.status)}>
                                  {caseItem.stage}
                                </Badge>
                              </div>
                              <h4 className="font-semibold terminal-text mb-1">{caseItem.subject}</h4>
                              <p className="text-sm text-gray-400 mb-2">{caseItem.constituent} • {caseItem.email}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>Assigned: {caseItem.assignedTo}</span>
                                <span>Est. Resolution: {caseItem.estimatedResolution}</span>
                                <span>Updated: {new Date(caseItem.updatedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <div className="text-xs text-gray-500">
                                {caseItem.notifications?.length || 0} notifications sent
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Case Detail */}
            <div className="lg:col-span-1">
              <Card className="terminal-surface border-gray-700">
                <CardHeader>
                  <CardTitle className="terminal-text flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-green-400" />
                    Case Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedCase ? (
                    <div className="space-y-4">
                      {/* Case Info */}
                      <div>
                        <h3 className="font-semibold terminal-text mb-2">{selectedCase.subject}</h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-400">Case #:</span>
                            <span className="ml-2 font-mono text-blue-400">#{selectedCase.id}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Constituent:</span>
                            <span className="ml-2 terminal-text">{selectedCase.constituent}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Email:</span>
                            <span className="ml-2 terminal-text">{selectedCase.email}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Assigned To:</span>
                            <span className="ml-2 terminal-text">{selectedCase.assignedTo}</span>
                          </div>
                        </div>
                      </div>

                      {/* Workflow Progress */}
                      <div>
                        <h4 className="font-medium terminal-text mb-3">Workflow Progress</h4>
                        <div className="space-y-2">
                          {getWorkflowStages().map((stage, index) => {
                            const caseStage = selectedCase.workflow.stages.find(s => s.id === stage.id);
                            const isCompleted = caseStage?.completed;
                            const isCurrent = selectedCase.workflow.currentStage === stage.id;
                            const StageIcon = stage.icon;
                            
                            return (
                              <div key={stage.id} className="flex items-center space-x-3">
                                <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                                  isCompleted 
                                    ? 'bg-green-500 text-white' 
                                    : isCurrent 
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-600 text-gray-400'
                                }`}>
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                  ) : isCurrent ? (
                                    <AlertCircle className="w-4 h-4" />
                                  ) : (
                                    <Circle className="w-4 h-4" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <span className={`text-sm ${isCompleted ? 'text-green-400' : isCurrent ? 'text-blue-400' : 'text-gray-400'}`}>
                                    {stage.name}
                                  </span>
                                  {caseStage?.date && (
                                    <div className="text-xs text-gray-500">
                                      {new Date(caseStage.date).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Recent Notes */}
                      {selectedCase.notes && selectedCase.notes.length > 0 && (
                        <div>
                          <h4 className="font-medium terminal-text mb-3">Recent Notes</h4>
                          <div className="space-y-2">
                            {selectedCase.notes.slice(-3).map((note) => (
                              <div key={note.id} className="p-3 bg-gray-800/50 rounded-lg">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-medium text-blue-400">{note.author}</span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(note.timestamp).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-300">{note.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="space-y-2 pt-4 border-t border-gray-600">
                        <Button 
                          onClick={() => advanceStage(selectedCase.id, 'Research')}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={selectedCase.status === 'completed'}
                        >
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Advance Stage
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full border-gray-600 text-gray-300"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Add Note
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full border-gray-600 text-gray-300"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Update
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Eye className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">Select a case to view details</p>
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
                <CardTitle className="terminal-text">Create New Case</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Constituent Name</Label>
                  <Input
                    value={newCaseData.constituent || ''}
                    onChange={(e) => setNewCaseData({...newCaseData, constituent: e.target.value})}
                    className="terminal-input border-gray-600 bg-gray-800 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Email</Label>
                  <Input
                    value={newCaseData.email || ''}
                    onChange={(e) => setNewCaseData({...newCaseData, email: e.target.value})}
                    className="terminal-input border-gray-600 bg-gray-800 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Subject</Label>
                  <Input
                    value={newCaseData.subject || ''}
                    onChange={(e) => setNewCaseData({...newCaseData, subject: e.target.value})}
                    className="terminal-input border-gray-600 bg-gray-800 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Category</Label>
                  <select
                    value={newCaseData.category || ''}
                    onChange={(e) => setNewCaseData({...newCaseData, category: e.target.value})}
                    className="w-full terminal-input border-gray-600 bg-gray-800 text-white px-3 py-2 rounded-md"
                  >
                    <option value="">Select Category</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Environment">Environment</option>
                    <option value="Education">Education</option>
                    <option value="Economy">Economy</option>
                    <option value="Immigration">Immigration</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <Label className="text-gray-300">Priority</Label>
                  <select
                    value={newCaseData.priority || ''}
                    onChange={(e) => setNewCaseData({...newCaseData, priority: e.target.value})}
                    className="w-full terminal-input border-gray-600 bg-gray-800 text-white px-3 py-2 rounded-md"
                  >
                    <option value="">Select Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <Label className="text-gray-300">Estimated Resolution Date</Label>
                  <Input
                    type="date"
                    value={newCaseData.estimatedResolution || ''}
                    onChange={(e) => setNewCaseData({...newCaseData, estimatedResolution: e.target.value})}
                    className="terminal-input border-gray-600 bg-gray-800 text-white"
                  />
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button 
                    onClick={createCase}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Create Case
                  </Button>
                  <Button 
                    onClick={() => setShowCreateCase(false)}
                    variant="outline" 
                    className="flex-1 border-gray-600 text-gray-300"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notification Templates Modal */}
        {showNotificationTemplates && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="terminal-surface border-gray-700 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="terminal-text flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-purple-400" />
                  Notification Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-400 text-sm">
                  These templates are automatically sent to constituents when their case status changes.
                </p>
                <div className="grid grid-cols-1 gap-4">
                  {notificationTemplates.map((template) => (
                    <div key={template.id} className="p-4 border border-gray-600 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium terminal-text">{template.name}</h4>
                        <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                          Auto-sent
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{template.description}</p>
                      <div className="text-sm">
                        <span className="text-gray-500">Subject:</span>
                        <span className="ml-2 text-gray-300">{template.subject}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-600">
                  <Button 
                    onClick={() => setShowNotificationTemplates(false)}
                    variant="outline" 
                    className="border-gray-600 text-gray-300"
                  >
                    Close
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