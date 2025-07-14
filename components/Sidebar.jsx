import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { User } from '../entities/User';
import { 
  LogOut, 
  BarChart3, 
  FileText, 
  TrendingUp, 
  Building,
  Users,
  Home,
  UserCheck,
  Briefcase,
  Calendar,
  BarChart,
  Users2,
  DollarSign,
  Scale,
  Globe,
  Settings,
  ChevronDown,
  ChevronRight,
  Target,
  Shield,
  Activity,
  PieChart,
  Award,
  Zap,
  Brain,
  Network,
  Database,
  Cpu,
  Wifi,
  Lock,
  Unlock,
  Key,
  Calculator,
  Gauge,
  AlertTriangle,
  CheckCircle,
  Clock,
  Bell,
  ChartLine,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  Filter,
  Search,
  Eye,
  Download,
  Share2,
  MessageCircle,
  ClipboardList,
  GitBranch,
  HardDrive
} from 'lucide-react';

const getNavLinks = (accountType) => {
  const baseLinks = [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Politicians', href: '/politicians', icon: UserCheck },
    { label: 'Congress', href: '/congress', icon: Building },
    { label: 'Campaign Finance', href: '/campaign-finance', icon: DollarSign },
    { label: 'K Street', href: '/kstreet', icon: Briefcase },
    { label: 'Events', href: '/events', icon: Calendar },
    { label: 'Polling', href: '/polling', icon: BarChart },
    { label: 'Committees', href: '/committees', icon: Users2 },
    { label: 'SCOTUS', href: '/scotus', icon: Scale },
    { label: 'Economics', href: '/economics', icon: TrendingUp },
    { label: 'Regulations', href: '/regulations', icon: Shield },
    { label: 'Foreign Affairs', href: '/foreign-affairs', icon: Globe },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  // Add Local Spending only for Citizen accounts
  if (accountType === 'Citizen') {
    baseLinks.splice(7, 0, { label: 'Local Spending', href: '/local-spending', icon: DollarSign });
  }

  // Add Federal Awards for Business and Representatives only
  if (accountType === 'Business' || accountType === 'Representative') {
    baseLinks.splice(10, 0, { label: 'Federal Awards', href: '/federal-awards', icon: Award });
  }

  // Add Business Intelligence features for Business only
  if (accountType === 'Business') {
    // Insert Business Intelligence section after Federal Awards
    const federalAwardsIndex = baseLinks.findIndex(link => link.label === 'Federal Awards');
    const insertIndex = federalAwardsIndex !== -1 ? federalAwardsIndex + 1 : 10;
    
    baseLinks.splice(insertIndex, 0, 
      { 
        label: 'Business Intelligence', 
        href: '/business-intelligence', 
        icon: Brain, 
        isHeader: true,
        children: [
          { label: 'Business Dashboard', href: '/business-dashboard', icon: BarChart3 },
          { label: 'Compliance Dashboard', href: '/compliance-dashboard', icon: Shield },
          { label: 'Business Reports', href: '/business-reports', icon: FileText },
          { label: 'Market Intelligence', href: '/market-intelligence', icon: TrendingUp }
        ]
      }
    );
  }

  if (accountType === 'Representative') {
    // Insert Representative-specific features
    return [
      ...baseLinks.slice(0, 7),
      { label: 'Correspondence', href: '/correspondence', icon: MessageCircle },
      { label: 'Case Management', href: '/case-management', icon: ClipboardList },
      { label: 'Committee Collaboration', href: '/committee-collaboration', icon: GitBranch },
      ...baseLinks.slice(7, 13),
      { label: 'Party Communications', href: '/party-communications', icon: Users },
      { label: 'Legislative Scorecard', href: '/legislative-scorecard', icon: BarChart3 },
      ...baseLinks.slice(13)
    ];
  }
  return baseLinks;
};

export default function Sidebar({ user }) {
  const router = useRouter();
  const navLinks = getNavLinks(user?.account_type);
  const [expandedSections, setExpandedSections] = useState(new Set(['Business Intelligence']));

  // Admin role toggle
  const [roleToggle, setRoleToggle] = useState(user?.account_type);

  const handleRoleChange = async (e) => {
    const newType = e.target.value;
    await User.setAccountType(newType);
    setRoleToggle(newType);
    window.location.reload();
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
      // Still redirect even if logout fails
      router.push('/');
    }
  };

  const toggleSection = (sectionLabel) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionLabel)) {
      newExpanded.delete(sectionLabel);
    } else {
      newExpanded.add(sectionLabel);
    }
    setExpandedSections(newExpanded);
  };
  
  return (
    <aside className="sidebar flex flex-col py-6 flex-shrink-0">
      <div className="mb-8 px-6">
        <span className="text-2xl font-bold text-blue-400">GovPulse</span>
      </div>
      {/* Admin role toggle */}
      {User.isAdmin() && (
        <div className="mb-6 px-6">
          <label className="block text-xs text-gray-400 mb-1">Admin: Switch Account Type</label>
          <select
            value={roleToggle}
            onChange={handleRoleChange}
            className="w-full px-2 py-1 rounded bg-gray-800 border border-blue-500 text-blue-300 text-sm"
          >
            <option value="Admin">Admin</option>
            <option value="Citizen">Citizen</option>
            <option value="Business">Business</option>
            <option value="Representative">Representative</option>
          </select>
        </div>
      )}
      
      <nav className="flex-1 space-y-1 px-2">
        {navLinks.map(link => {
          const isActive = router.pathname === link.href;
          
          if (link.isHeader) {
            const isExpanded = expandedSections.has(link.label);
            const IconComponent = link.icon;
            return (
              <div key={link.label}>
                <button
                  onClick={() => toggleSection(link.label)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded transition-all duration-200 ease-in-out text-blue-400 hover:bg-blue-700 hover:text-white hover:shadow-md"
                >
                  <div className="flex items-center space-x-2">
                    {IconComponent && <IconComponent className="w-4 h-4" />}
                    <span className="font-semibold text-sm uppercase tracking-wider">{link.label}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                
                {isExpanded && link.children && (
                  <div className="ml-4 mt-1 space-y-1">
                    {link.children.map(childLink => {
                      const isChildActive = router.pathname === childLink.href;
                      const ChildIconComponent = childLink.icon;
                      return (
                        <Link
                          key={childLink.label}
                          href={childLink.href}
                          className={`block px-3 py-2 rounded transition-all duration-200 ease-in-out ${
                            isChildActive 
                              ? 'bg-blue-700 text-white shadow-lg' 
                              : 'text-gray-200 hover:bg-blue-700 hover:text-white hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            {ChildIconComponent && <ChildIconComponent className="w-4 h-4" />}
                            <span className="text-sm">{childLink.label}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
          
          const IconComponent = link.icon;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`block px-3 py-2 rounded transition-all duration-200 ease-in-out ${
                isActive 
                  ? 'bg-blue-700 text-white shadow-lg' 
                  : 'text-gray-200 hover:bg-blue-700 hover:text-white hover:shadow-md'
              }`}
            >
              <div className="flex items-center space-x-2">
                {IconComponent && <IconComponent className="w-4 h-4" />}
                <span>{link.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="px-2 mt-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 rounded transition-all duration-200 ease-in-out text-gray-200 hover:bg-red-700 hover:text-white hover:shadow-md"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </aside>
  );
} 