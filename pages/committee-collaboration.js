import React, { useState, useEffect, useRef } from 'react';
import { User } from '../entities/User';
import AppLayout from '../components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { 
  FileText, 
  Users, 
  GitBranch, 
  GitCommit, 
  GitMerge, 
  GitPullRequest,
  Save,
  Share2,
  Eye,
  Edit3,
  History,
  MessageSquare,
  UserCheck,
  Clock,
  AlertCircle,
  CheckCircle,
  X,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Lock,
  Unlock,
  Copy,
  Trash2,
  Archive,
  Star,
  Bookmark,
  Tag,
  Hash,
  Calendar,
  Building,
  Briefcase
} from 'lucide-react';

export default function CommitteeCollaborationPage() {
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [activeCollaborators, setActiveCollaborators] = useState([]);
  const [documentHistory, setDocumentHistory] = useState([]);
  const [comments, setComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [committeeFilter, setCommitteeFilter] = useState('all');
  const [showCreateDocument, setShowCreateDocument] = useState(false);
  const [newDocument, setNewDocument] = useState({});
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [realTimeChanges, setRealTimeChanges] = useState([]);
  const editorRef = useRef(null);

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
    loadDocuments();
    loadActiveCollaborators();
  }, []);

  const loadDocuments = async () => {
    // Mock data - replace with actual API call
    const mockDocuments = [
      {
        id: 1,
        title: "H.R. 1234 - Infrastructure Investment Act",
        committee: "Transportation and Infrastructure",
        status: "draft",
        version: "2.1.3",
        lastModified: "2024-01-17T14:30:00Z",
        modifiedBy: "Sarah Chen",
        collaborators: [
          { name: "Sarah Chen", role: "Lead Staffer", office: "Rep. Johnson", status: "online" },
          { name: "Mike Rodriguez", role: "Policy Analyst", office: "Rep. Smith", status: "editing" },
          { name: "Lisa Wang", role: "Legal Counsel", office: "Sen. Davis", status: "online" }
        ],
        content: `SECTION 1. SHORT TITLE.

This Act may be cited as the "Infrastructure Investment and Jobs Act".

SEC. 2. FINDINGS.

Congress finds that—

(1) the Nation's infrastructure is in critical need of modernization and repair;

(2) investment in infrastructure creates jobs and strengthens the economy;

(3) climate-resilient infrastructure is essential for long-term sustainability;

(4) broadband access is critical for economic opportunity and education;

(5) the Federal Government should partner with State and local governments to address infrastructure needs.

SEC. 3. AUTHORIZATION OF APPROPRIATIONS.

(a) IN GENERAL.—There are authorized to be appropriated to carry out this Act—

(1) $110,000,000,000 for fiscal year 2024;

(2) $120,000,000,000 for fiscal year 2025;

(3) $130,000,000,000 for fiscal year 2026.

(b) ALLOCATION.—Of the amounts authorized under subsection (a)—

(1) 40 percent shall be for highway and bridge projects;

(2) 25 percent shall be for public transportation;

(3) 20 percent shall be for broadband infrastructure;

(4) 10 percent shall be for water infrastructure;

(5) 5 percent shall be for electric vehicle charging infrastructure.`,
        tags: ["infrastructure", "transportation", "climate", "jobs"],
        changeTracking: [
          {
            id: 1,
            version: "2.1.3",
            author: "Mike Rodriguez",
            timestamp: "2024-01-17T14:30:00Z",
            changes: "Updated funding allocation percentages and added climate resilience language",
            type: "edit"
          },
          {
            id: 2,
            version: "2.1.2",
            author: "Sarah Chen",
            timestamp: "2024-01-17T12:15:00Z",
            changes: "Added broadband infrastructure section",
            type: "addition"
          },
          {
            id: 3,
            version: "2.1.1",
            author: "Lisa Wang",
            timestamp: "2024-01-17T10:45:00Z",
            changes: "Legal review and compliance updates",
            type: "review"
          }
        ]
      },
      {
        id: 2,
        title: "S. 5678 - Healthcare Access and Affordability Act",
        committee: "Health, Education, Labor, and Pensions",
        status: "review",
        version: "1.4.2",
        lastModified: "2024-01-16T16:20:00Z",
        modifiedBy: "David Kim",
        collaborators: [
          { name: "David Kim", role: "Committee Staff", office: "Sen. Wilson", status: "online" },
          { name: "Emily Johnson", role: "Policy Director", office: "Rep. Brown", status: "offline" }
        ],
        content: `SECTION 1. SHORT TITLE.

This Act may be cited as the "Healthcare Access and Affordability Act of 2024".

SEC. 2. PURPOSE.

The purpose of this Act is to—

(1) expand access to affordable healthcare coverage;

(2) reduce prescription drug costs;

(3) strengthen the healthcare workforce;

(4) improve health outcomes for all Americans;

(5) address health disparities in underserved communities.

SEC. 3. PRESCRIPTION DRUG PRICE NEGOTIATION.

(a) IN GENERAL.—The Secretary of Health and Human Services shall negotiate with manufacturers of prescription drugs to achieve lower prices for Medicare beneficiaries.

(b) SELECTION OF DRUGS.—The Secretary shall select drugs for negotiation based on—

(1) total spending under Medicare part D;

(2) lack of generic or biosimilar competition;

(3) clinical benefit and value;

(4) unmet medical need.`,
        tags: ["healthcare", "prescription drugs", "medicare", "access"],
        changeTracking: [
          {
            id: 4,
            version: "1.4.2",
            author: "David Kim",
            timestamp: "2024-01-16T16:20:00Z",
            changes: "Updated prescription drug negotiation criteria",
            type: "edit"
          }
        ]
      }
    ];

    setDocuments(mockDocuments);
  };

  const loadActiveCollaborators = async () => {
    // Mock active collaborators
    setActiveCollaborators([
      {
        id: 1,
        name: "Sarah Chen",
        role: "Lead Staffer",
        office: "Rep. Johnson",
        committee: "Transportation and Infrastructure",
        status: "online",
        lastActivity: "2 minutes ago",
        currentDocument: "H.R. 1234 - Infrastructure Investment Act"
      },
      {
        id: 2,
        name: "Mike Rodriguez",
        role: "Policy Analyst",
        office: "Rep. Smith",
        committee: "Transportation and Infrastructure",
        status: "editing",
        lastActivity: "Just now",
        currentDocument: "H.R. 1234 - Infrastructure Investment Act"
      },
      {
        id: 3,
        name: "David Kim",
        role: "Committee Staff",
        office: "Sen. Wilson",
        committee: "Health, Education, Labor, and Pensions",
        status: "online",
        lastActivity: "5 minutes ago",
        currentDocument: "S. 5678 - Healthcare Access and Affordability Act"
      }
    ]);
  };

  const createDocument = async () => {
    const newDoc = {
      id: Date.now(),
      title: newDocument.title,
      committee: newDocument.committee,
      status: 'draft',
      version: '1.0.0',
      lastModified: new Date().toISOString(),
      modifiedBy: user?.name || 'Unknown',
      collaborators: [{ name: user?.name || 'Unknown', role: 'Creator', office: user?.office || 'Committee Staff', status: 'online' }],
      content: newDocument.content || '',
      tags: newDocument.tags?.split(',').map(tag => tag.trim()) || [],
      changeTracking: []
    };

    setDocuments([...documents, newDoc]);
    setShowCreateDocument(false);
    setNewDocument({});
  };

  const saveDocument = async (documentId, content) => {
    // Mock save operation
    const updatedDocuments = documents.map(doc => {
      if (doc.id === documentId) {
        return {
          ...doc,
          content,
          version: incrementVersion(doc.version),
          lastModified: new Date().toISOString(),
          modifiedBy: user?.name || 'Unknown',
          changeTracking: [
            ...doc.changeTracking,
            {
              id: Date.now(),
              version: incrementVersion(doc.version),
              author: user?.name || 'Unknown',
              timestamp: new Date().toISOString(),
              changes: "Document updated",
              type: "edit"
            }
          ]
        };
      }
      return doc;
    });

    setDocuments(updatedDocuments);
    setIsEditing(false);
  };

  const incrementVersion = (version) => {
    const parts = version.split('.');
    parts[2] = (parseInt(parts[2]) + 1).toString();
    return parts.join('.');
  };

  const addComment = async (documentId, comment) => {
    const newCommentObj = {
      id: Date.now(),
      documentId,
      author: user?.name || 'Unknown',
      content: comment,
      timestamp: new Date().toISOString(),
      replies: []
    };

    setComments([...comments, newCommentObj]);
    setNewComment('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'review': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'approved': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'final': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getCollaboratorStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'editing': return 'bg-blue-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const committees = [
    "Transportation and Infrastructure",
    "Health, Education, Labor, and Pensions",
    "Energy and Commerce",
    "Ways and Means",
    "Judiciary",
    "Foreign Affairs",
    "Armed Services",
    "Agriculture",
    "Financial Services",
    "Homeland Security"
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
              <h1 className="text-3xl font-bold terminal-text">Committee Collaboration</h1>
              <p className="text-gray-400 mt-2">Real-time legislative language editing and version control</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowCreateDocument(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Document
              </Button>
            </div>
          </div>

          {/* Active Collaborators */}
          <Card className="terminal-surface border-gray-700">
            <CardHeader>
              <CardTitle className="terminal-text flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-400" />
                Active Collaborators ({activeCollaborators.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeCollaborators.map((collaborator) => (
                  <div key={collaborator.id} className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${getCollaboratorStatusColor(collaborator.status)}`} />
                    <div className="flex-1">
                      <div className="font-medium terminal-text">{collaborator.name}</div>
                      <div className="text-sm text-gray-400">{collaborator.role} • {collaborator.office}</div>
                      <div className="text-xs text-gray-500">{collaborator.lastActivity}</div>
                    </div>
                    <div className="text-xs text-blue-400 truncate max-w-32">
                      {collaborator.currentDocument}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card className="terminal-surface border-gray-700">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-gray-300">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search documents..."
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
                    <option value="draft">Draft</option>
                    <option value="review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="final">Final</option>
                  </select>
                </div>
                <div>
                  <Label className="text-gray-300">Committee</Label>
                  <select
                    value={committeeFilter}
                    onChange={(e) => setCommitteeFilter(e.target.value)}
                    className="w-full terminal-input border-gray-600 bg-gray-800 text-white px-3 py-2 rounded-md"
                  >
                    <option value="all">All Committees</option>
                    {committees.map(committee => (
                      <option key={committee} value={committee}>{committee}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setCommitteeFilter('all');
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

          {/* Documents and Editor */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Documents List */}
            <div className="lg:col-span-1">
              <Card className="terminal-surface border-gray-700">
                <CardHeader>
                  <CardTitle className="terminal-text flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-400" />
                    Documents ({documents.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {documents.map((document) => (
                      <div 
                        key={document.id} 
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                          selectedDocument?.id === document.id
                            ? 'bg-blue-600/20 border-blue-500'
                            : 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50'
                        }`}
                        onClick={() => setSelectedDocument(document)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold terminal-text text-sm">{document.title}</h4>
                          <Badge className={getStatusColor(document.status)}>
                            {document.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-400 mb-2">{document.committee}</div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>v{document.version}</span>
                          <span>{document.collaborators.length} collaborators</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Modified by {document.modifiedBy} • {new Date(document.lastModified).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Document Editor */}
            <div className="lg:col-span-2">
              <Card className="terminal-surface border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="terminal-text flex items-center">
                      <Edit3 className="w-5 h-5 mr-2 text-green-400" />
                      {selectedDocument ? selectedDocument.title : 'Document Editor'}
                    </CardTitle>
                    <div className="flex gap-2">
                      {selectedDocument && (
                        <>
                          <Button 
                            onClick={() => setShowVersionHistory(true)}
                            variant="outline" 
                            className="border-gray-600 text-gray-300"
                          >
                            <History className="w-4 h-4 mr-2" />
                            History
                          </Button>
                          <Button 
                            onClick={() => setShowComments(true)}
                            variant="outline" 
                            className="border-gray-600 text-gray-300"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Comments
                          </Button>
                          {isEditing ? (
                            <Button 
                              onClick={() => saveDocument(selectedDocument.id, editorRef.current?.value || selectedDocument.content)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => setIsEditing(true)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Edit3 className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedDocument ? (
                    <div className="space-y-4">
                      {/* Document Info */}
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div>
                            <span className="text-sm text-gray-400">Committee:</span>
                            <span className="ml-2 text-sm terminal-text">{selectedDocument.committee}</span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-400">Version:</span>
                            <span className="ml-2 text-sm terminal-text">v{selectedDocument.version}</span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-400">Status:</span>
                            <Badge className={getStatusColor(selectedDocument.status)}>
                              {selectedDocument.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {selectedDocument.tags.map((tag, index) => (
                            <Badge key={index} className="bg-gray-600/50 text-gray-300 border-gray-500">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Collaborators */}
                      <div>
                        <h4 className="font-medium terminal-text mb-2">Active Collaborators</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedDocument.collaborators.map((collaborator, index) => (
                            <div key={index} className="flex items-center space-x-2 p-2 bg-gray-800/50 rounded-lg">
                              <div className={`w-2 h-2 rounded-full ${getCollaboratorStatusColor(collaborator.status)}`} />
                              <span className="text-sm terminal-text">{collaborator.name}</span>
                              <span className="text-xs text-gray-400">({collaborator.role})</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Document Content */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium terminal-text">Content</h4>
                          {isEditing && (
                            <div className="text-xs text-yellow-400 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Editing Mode
                            </div>
                          )}
                        </div>
                        {isEditing ? (
                          <Textarea
                            ref={editorRef}
                            defaultValue={selectedDocument.content}
                            className="terminal-input border-gray-600 bg-gray-800 text-white min-h-[400px] font-mono text-sm"
                            placeholder="Enter legislative language..."
                          />
                        ) : (
                          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600 min-h-[400px] font-mono text-sm text-gray-300 whitespace-pre-wrap">
                            {selectedDocument.content}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">Select a document to view and edit</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Create Document Modal */}
        {showCreateDocument && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="terminal-surface border-gray-700 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="terminal-text">Create New Document</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Document Title</Label>
                  <Input
                    value={newDocument.title || ''}
                    onChange={(e) => setNewDocument({...newDocument, title: e.target.value})}
                    className="terminal-input border-gray-600 bg-gray-800 text-white"
                    placeholder="e.g., H.R. 1234 - Infrastructure Investment Act"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Committee</Label>
                  <select
                    value={newDocument.committee || ''}
                    onChange={(e) => setNewDocument({...newDocument, committee: e.target.value})}
                    className="w-full terminal-input border-gray-600 bg-gray-800 text-white px-3 py-2 rounded-md"
                  >
                    <option value="">Select Committee</option>
                    {committees.map(committee => (
                      <option key={committee} value={committee}>{committee}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-gray-300">Tags (comma-separated)</Label>
                  <Input
                    value={newDocument.tags || ''}
                    onChange={(e) => setNewDocument({...newDocument, tags: e.target.value})}
                    className="terminal-input border-gray-600 bg-gray-800 text-white"
                    placeholder="e.g., infrastructure, transportation, jobs"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Initial Content</Label>
                  <Textarea
                    value={newDocument.content || ''}
                    onChange={(e) => setNewDocument({...newDocument, content: e.target.value})}
                    className="terminal-input border-gray-600 bg-gray-800 text-white min-h-[200px] font-mono text-sm"
                    placeholder="Enter initial legislative language..."
                  />
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button 
                    onClick={createDocument}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Create Document
                  </Button>
                  <Button 
                    onClick={() => setShowCreateDocument(false)}
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

        {/* Version History Modal */}
        {showVersionHistory && selectedDocument && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="terminal-surface border-gray-700 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="terminal-text flex items-center">
                  <History className="w-5 h-5 mr-2 text-blue-400" />
                  Version History - {selectedDocument.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {selectedDocument.changeTracking.map((change) => (
                    <div key={change.id} className="p-4 border border-gray-600 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <GitCommit className="w-4 h-4 text-blue-400" />
                          <span className="font-mono text-sm text-blue-400">v{change.version}</span>
                          <Badge className="bg-gray-600/50 text-gray-300 border-gray-500">
                            {change.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(change.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm terminal-text mb-2">By: {change.author}</div>
                      <div className="text-sm text-gray-300">{change.changes}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-600">
                  <Button 
                    onClick={() => setShowVersionHistory(false)}
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

        {/* Comments Modal */}
        {showComments && selectedDocument && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="terminal-surface border-gray-700 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="terminal-text flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-green-400" />
                  Comments - {selectedDocument.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {comments.filter(c => c.documentId === selectedDocument.id).map((comment) => (
                    <div key={comment.id} className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium terminal-text">{comment.author}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">{comment.content}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 pt-4 border-t border-gray-600">
                  <Label className="text-gray-300">Add Comment</Label>
                  <div className="flex space-x-2">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 terminal-input border-gray-600 bg-gray-800 text-white"
                      placeholder="Add a comment..."
                    />
                    <Button 
                      onClick={() => addComment(selectedDocument.id, newComment)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={() => setShowComments(false)}
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