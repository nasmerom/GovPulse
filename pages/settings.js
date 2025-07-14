import React, { useState, useEffect } from 'react';
import { User } from '../entities/User';
import AppLayout from '../components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Settings, 
  User as UserIcon, 
  Bell, 
  Shield, 
  Palette,
  Building, 
  TrendingUp, 
  Globe, 
  Shield as ShieldIcon, 
  Users, 
  DollarSign, 
  Heart,
  Leaf,
  GraduationCap,
  Car,
  Wifi,
  Briefcase,
  Vote,
  BarChart3,
  MapPin,
  FileText,
  CheckCircle,
  Save,
  Edit3
} from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      console.log('[Settings] Loading user data...');
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );
      
      const userPromise = User.me();
      const currentUser = await Promise.race([userPromise, timeoutPromise]);
      
      console.log('[Settings] User loaded:', currentUser);
      setUser(currentUser);
      
      setSelectedTopics([]);
      
      setEditData({
        name: currentUser.name,
        email: currentUser.email,
        state: currentUser.state
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      // Provide fallback user data
      const fallbackUser = {
        id: 1,
        name: 'Demo User',
        email: 'demo@example.com',
        account_type: 'Citizen',
        state: 'CA'
      };
      setUser(fallbackUser);
      setSelectedTopics([]);
      setEditData({
        name: fallbackUser.name,
        email: fallbackUser.email,
        state: fallbackUser.state
      });
    } finally {
      console.log('[Settings] Setting loading to false');
      setIsLoading(false);
    }
  };

  const handleTopicToggle = (topicId) => {
    setSelectedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleSaveTopics = async () => {
    try {
      await User.updateTopicPreferences(selectedTopics);
      // Show success message or update UI
      console.log('Topic preferences saved successfully');
    } catch (error) {
      console.error('Error saving topic preferences:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await User.update(editData);
      setUser(prev => ({ ...prev, ...editData }));
      setIsEditing(false);
      // Show success message
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const topicCategories = [
    {
      id: 'legislation',
      name: 'Legislation & Policy',
      icon: FileText,
      topics: [
        { id: 'congress', name: 'Congress', icon: Building },
        { id: 'state_legislation', name: 'State Legislation', icon: MapPin },
        { id: 'regulations', name: 'Regulations', icon: ShieldIcon },
        { id: 'executive_orders', name: 'Executive Orders', icon: Vote }
      ]
    },
    {
      id: 'economics',
      name: 'Economics & Business',
      icon: TrendingUp,
      topics: [
        { id: 'economic_indicators', name: 'Economic Indicators', icon: BarChart3 },
        { id: 'business_impact', name: 'Business Impact', icon: Briefcase },
        { id: 'trade', name: 'Trade & Commerce', icon: Globe },
        { id: 'taxes', name: 'Tax Policy', icon: DollarSign }
      ]
    },
    {
      id: 'social_issues',
      name: 'Social Issues',
      icon: Users,
      topics: [
        { id: 'healthcare', name: 'Healthcare', icon: Heart },
        { id: 'education', name: 'Education', icon: GraduationCap },
        { id: 'immigration', name: 'Immigration', icon: Globe },
        { id: 'civil_rights', name: 'Civil Rights', icon: ShieldIcon }
      ]
    },
    {
      id: 'environment',
      name: 'Environment & Energy',
      icon: Leaf,
      topics: [
        { id: 'climate_change', name: 'Climate Change', icon: Leaf },
        { id: 'energy', name: 'Energy Policy', icon: TrendingUp },
        { id: 'infrastructure', name: 'Infrastructure', icon: Building },
        { id: 'transportation', name: 'Transportation', icon: Car }
      ]
    },
    {
      id: 'technology',
      name: 'Technology & Innovation',
      icon: Wifi,
      topics: [
        { id: 'tech_policy', name: 'Tech Policy', icon: Wifi },
        { id: 'privacy', name: 'Privacy & Data', icon: ShieldIcon },
        { id: 'ai_regulation', name: 'AI Regulation', icon: TrendingUp },
        { id: 'digital_rights', name: 'Digital Rights', icon: Users }
      ]
    },
    {
      id: 'foreign_policy',
      name: 'Foreign Policy & Defense',
      icon: Globe,
      topics: [
        { id: 'foreign_relations', name: 'Foreign Relations', icon: Globe },
        { id: 'defense', name: 'Defense & Military', icon: ShieldIcon },
        { id: 'national_security', name: 'National Security', icon: ShieldIcon },
        { id: 'trade_policy', name: 'Trade Policy', icon: DollarSign }
      ]
    }
  ];

  if (isLoading) {
    console.log('[Settings] Rendering loading state');
    return (
      <AppLayout user={user}>
        <div className="px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-1/4"></div>
            <div className="h-64 bg-gray-700 rounded"></div>
          </div>
          <div className="text-white mt-4">
            <p>Loading state - user: {user ? 'exists' : 'null'}</p>
            <p>isLoading: {isLoading.toString()}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout user={user}>
        <div className="px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold terminal-text">User not found</h1>
            <p className="text-gray-400 mt-2">Please log in again</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  console.log('[Settings] Rendering main content, user:', user);
  return (
    <AppLayout user={user}>
      <div className="px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold terminal-text">Settings</h1>
              <p className="text-gray-400 mt-2">Manage your account and preferences</p>
              {user && (
                <p className="text-xs text-gray-500 mt-1">Account: {user.account_type}</p>
              )}
            </div>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border-gray-700">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="topics">Topics</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card className="terminal-surface border-gray-700">
                <CardHeader>
                  <CardTitle className="terminal-text flex items-center">
                    <UserIcon className="w-5 h-5 mr-2 text-blue-400" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Name</Label>
                      {isEditing ? (
                        <Input
                          value={editData.name}
                          onChange={(e) => setEditData({...editData, name: e.target.value})}
                          className="terminal-input border-gray-600 bg-gray-800 text-white"
                        />
                      ) : (
                        <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-600">
                          {user.name}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-gray-300">Email</Label>
                      {isEditing ? (
                        <Input
                          value={editData.email}
                          onChange={(e) => setEditData({...editData, email: e.target.value})}
                          className="terminal-input border-gray-600 bg-gray-800 text-white"
                        />
                      ) : (
                        <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-600">
                          {user.email}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-gray-300">Account Type</Label>
                      <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-600">
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {user.account_type}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-300">State</Label>
                      {isEditing ? (
                        <Input
                          value={editData.state}
                          onChange={(e) => setEditData({...editData, state: e.target.value})}
                          className="terminal-input border-gray-600 bg-gray-800 text-white"
                        />
                      ) : (
                        <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-600">
                          {user.state || 'Not set'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    {isEditing ? (
                      <>
                        <Button 
                          onClick={handleSaveProfile}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button 
                          onClick={() => setIsEditing(false)}
                          variant="outline" 
                          className="border-gray-600 text-gray-300"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button 
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="topics" className="mt-6">
              <Card className="terminal-surface border-gray-700">
                <CardHeader>
                  <CardTitle className="terminal-text flex items-center">
                    <Palette className="w-5 h-5 mr-2 text-green-400" />
                    Topic Preferences
                  </CardTitle>
                  <p className="text-gray-400 text-sm">
                    Select topics that interest you to personalize your dashboard and recommendations
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {topicCategories.map((category) => (
                    <div key={category.id} className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <category.icon className="w-5 h-5 text-blue-400" />
                        <h3 className="font-medium terminal-text">{category.name}</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {category.topics.map((topic) => {
                          const isSelected = selectedTopics.includes(topic.id);
                          const TopicIcon = topic.icon;
                          
                          return (
                            <div
                              key={topic.id}
                              className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                                isSelected
                                  ? 'bg-blue-600/20 border-blue-500'
                                  : 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50'
                              }`}
                              onClick={() => handleTopicToggle(topic.id)}
                            >
                              <div className="flex items-center space-x-2">
                                <TopicIcon className={`w-4 h-4 ${
                                  isSelected ? 'text-blue-400' : 'text-gray-400'
                                }`} />
                                <span className={`text-sm ${
                                  isSelected ? 'terminal-text' : 'text-gray-300'
                                }`}>
                                  {topic.name}
                                </span>
                                {isSelected && (
                                  <CheckCircle className="w-4 h-4 text-blue-400 ml-auto" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-600">
                    <div className="text-sm text-gray-400">
                      {selectedTopics.length} topics selected
                    </div>
                    <Button 
                      onClick={handleSaveTopics}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <Card className="terminal-surface border-gray-700">
                <CardHeader>
                  <CardTitle className="terminal-text flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-yellow-400" />
                    Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h4 className="font-medium terminal-text mb-2">Email Notifications</h4>
                      <p className="text-sm text-gray-400">Manage your email notification preferences</p>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Weekly Digest</span>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Enabled
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Breaking News</span>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Enabled
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Policy Updates</span>
                          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                            Disabled
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="mt-6">
              <Card className="terminal-surface border-gray-700">
                <CardHeader>
                  <CardTitle className="terminal-text flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-purple-400" />
                    Privacy & Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h4 className="font-medium terminal-text mb-2">Data Privacy</h4>
                      <p className="text-sm text-gray-400 mb-3">
                        Control how your data is used and shared
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Analytics & Personalization</span>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Enabled
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Third-party Data Sharing</span>
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                            Disabled
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
} 