import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AppLayout from '../components/AppLayout';
import { Search, Filter, FileText, Calendar, Building2, AlertTriangle } from 'lucide-react';

export default function Regulations() {
  const router = useRouter();
  const [regulations, setRegulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgency, setSelectedAgency] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [agencies, setAgencies] = useState([]);
  const [types, setTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data for AppLayout
    const fetchUser = async () => {
      try {
        const { User } = await import('../entities/User');
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
    fetchRegulations();
  }, []);

  const fetchRegulations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/federal-register/documents');
      const data = await response.json();
      
      if (data.success) {
        setRegulations(data.documents);
        
        // Extract unique agencies, types, and statuses for filters
        const uniqueAgencies = [...new Set(data.documents.flatMap(doc => doc.agency_names || []))].sort();
        const uniqueTypes = [...new Set(data.documents.map(doc => doc.document_type))].sort();
        const uniqueStatuses = ['Recent', 'Has Comments', 'Effective Soon'];
        
        setAgencies(uniqueAgencies);
        setTypes(uniqueTypes);
        setStatuses(uniqueStatuses);
      }
    } catch (error) {
      console.error('Error fetching regulations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRegulations = regulations.filter(regulation => {
    const matchesSearch = regulation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         regulation.abstract?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         regulation.agency_names?.some(agency => agency.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesAgency = selectedAgency === 'all' || regulation.agency_names?.includes(selectedAgency);
    const matchesType = selectedType === 'all' || regulation.document_type === selectedType;
    
    let matchesStatus = true;
    if (selectedStatus === 'Recent') matchesStatus = regulation.is_recent;
    else if (selectedStatus === 'Has Comments') matchesStatus = regulation.has_comments;
    else if (selectedStatus === 'Effective Soon') matchesStatus = regulation.days_until_effective && regulation.days_until_effective <= 30;
    
    return matchesSearch && matchesAgency && matchesType && matchesStatus;
  });

  const getStatusColor = (regulation) => {
    if (regulation.is_recent) return 'bg-blue-900/20 text-blue-400 border-blue-700/50';
    if (regulation.has_comments) return 'bg-yellow-900/20 text-yellow-400 border-yellow-700/50';
    if (regulation.days_until_effective && regulation.days_until_effective <= 30) return 'bg-red-900/20 text-red-400 border-red-700/50';
    return 'bg-gray-700/50 text-gray-300 border-gray-600/50';
  };

  const getStatusText = (regulation) => {
    if (regulation.is_recent) return 'Recent';
    if (regulation.has_comments) return 'Has Comments';
    if (regulation.days_until_effective && regulation.days_until_effective <= 30) return 'Effective Soon';
    return 'Standard';
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'rule':
        return <FileText className="w-5 h-5" />;
      case 'notice':
        return <AlertTriangle className="w-5 h-5" />;
      case 'proposed rule':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <AppLayout user={user}>
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Regulations</h1>
                <p className="mt-2 text-gray-300">
                  Track federal regulations, compliance requirements, and regulatory changes
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-900/50 rounded-lg p-3">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Search Regulations
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by title, agency, or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Agency Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Agency
                </label>
                <select
                  value={selectedAgency}
                  onChange={(e) => setSelectedAgency(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Agencies</option>
                  {agencies.map(agency => (
                    <option key={agency} value={agency}>{agency}</option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Additional Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Statuses</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-300">
              Showing {filteredRegulations.length} of {regulations.length} regulations
            </div>
            <div className="text-sm text-gray-400">
              Data from FederalRegister.gov
            </div>
          </div>

          {/* Regulations List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg border border-gray-700 p-6 animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredRegulations.length === 0 ? (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
              <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No regulations found</h3>
              <p className="text-gray-400">
                Try adjusting your search terms or filters to find relevant regulations.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRegulations.map((regulation, index) => (
                <div key={regulation.id || index} className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:bg-gray-750 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center text-blue-400">
                        {getTypeIcon(regulation.document_type)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                            {regulation.title}
                          </h3>
                          <p className="text-gray-300 mb-3 line-clamp-3">
                            {regulation.abstract}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Building2 className="w-4 h-4" />
                          <span>{regulation.agency_names?.join(', ') || 'Multiple Agencies'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(regulation.publication_date).toLocaleDateString()}</span>
                        </div>
                        {regulation.effective_date && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Effective: {new Date(regulation.effective_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(regulation)}`}>
                          {getStatusText(regulation)}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300 border border-gray-600/50">
                          {regulation.document_type}
                        </span>
                        {regulation.days_until_effective && regulation.days_until_effective > 0 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-700/50 text-orange-300 border border-orange-600/50">
                            {regulation.days_until_effective} days until effective
                          </span>
                        )}
                        {regulation.days_until_comment && regulation.days_until_comment > 0 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-700/50 text-yellow-300 border border-yellow-600/50">
                            {regulation.days_until_comment} days to comment
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
} 