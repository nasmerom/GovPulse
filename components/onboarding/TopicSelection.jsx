import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Building, 
  Scale, 
  TrendingUp, 
  Globe, 
  Shield, 
  Users, 
  DollarSign, 
  Heart,
  Leaf,
  GraduationCap,
  Car,
  Home,
  Wifi,
  Briefcase,
  Vote,
  MessageSquare,
  BarChart3,
  MapPin,
  Calendar,
  FileText,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const TopicSelection = ({ onComplete, user }) => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const topicCategories = [
    {
      id: 'legislation',
      name: 'Legislation & Policy',
      description: 'Track bills, laws, and policy changes',
      icon: FileText,
      topics: [
        { id: 'congress', name: 'Congress', icon: Building, description: 'Federal legislation and congressional activity' },
        { id: 'state_legislation', name: 'State Legislation', icon: MapPin, description: 'State-level bills and policies' },
        { id: 'regulations', name: 'Regulations', icon: Shield, description: 'Federal and state regulations' },
        { id: 'executive_orders', name: 'Executive Orders', icon: Vote, description: 'Presidential executive orders' }
      ]
    },
    {
      id: 'economics',
      name: 'Economics & Business',
      description: 'Economic indicators and business impact',
      icon: TrendingUp,
      topics: [
        { id: 'economic_indicators', name: 'Economic Indicators', icon: BarChart3, description: 'GDP, employment, inflation data' },
        { id: 'business_impact', name: 'Business Impact', icon: Briefcase, description: 'How policies affect businesses' },
        { id: 'trade', name: 'Trade & Commerce', icon: Globe, description: 'International trade and commerce' },
        { id: 'taxes', name: 'Tax Policy', icon: DollarSign, description: 'Tax legislation and policy changes' }
      ]
    },
    {
      id: 'social_issues',
      name: 'Social Issues',
      description: 'Healthcare, education, and social policy',
      icon: Users,
      topics: [
        { id: 'healthcare', name: 'Healthcare', icon: Heart, description: 'Healthcare policy and reform' },
        { id: 'education', name: 'Education', icon: GraduationCap, description: 'Education policy and funding' },
        { id: 'immigration', name: 'Immigration', icon: Globe, description: 'Immigration policy and reform' },
        { id: 'civil_rights', name: 'Civil Rights', icon: Shield, description: 'Civil rights and social justice' }
      ]
    },
    {
      id: 'environment',
      name: 'Environment & Energy',
      description: 'Environmental policy and energy issues',
      icon: Leaf,
      topics: [
        { id: 'climate_change', name: 'Climate Change', icon: Leaf, description: 'Climate policy and environmental protection' },
        { id: 'energy', name: 'Energy Policy', icon: TrendingUp, description: 'Energy production and policy' },
        { id: 'infrastructure', name: 'Infrastructure', icon: Building, description: 'Infrastructure development and funding' },
        { id: 'transportation', name: 'Transportation', icon: Car, description: 'Transportation policy and funding' }
      ]
    },
    {
      id: 'technology',
      name: 'Technology & Innovation',
      description: 'Tech policy and digital issues',
      icon: Wifi,
      topics: [
        { id: 'tech_policy', name: 'Tech Policy', icon: Wifi, description: 'Technology regulation and policy' },
        { id: 'privacy', name: 'Privacy & Data', icon: Shield, description: 'Data privacy and cybersecurity' },
        { id: 'ai_regulation', name: 'AI Regulation', icon: TrendingUp, description: 'Artificial intelligence policy' },
        { id: 'digital_rights', name: 'Digital Rights', icon: Users, description: 'Digital rights and internet policy' }
      ]
    },
    {
      id: 'foreign_policy',
      name: 'Foreign Policy & Defense',
      description: 'International relations and defense',
      icon: Globe,
      topics: [
        { id: 'foreign_relations', name: 'Foreign Relations', icon: Globe, description: 'International diplomacy and relations' },
        { id: 'defense', name: 'Defense & Military', icon: Shield, description: 'Defense policy and military affairs' },
        { id: 'national_security', name: 'National Security', icon: Shield, description: 'National security and intelligence' },
        { id: 'trade_policy', name: 'Trade Policy', icon: DollarSign, description: 'International trade agreements' }
      ]
    }
  ];

  const handleTopicToggle = (topicId) => {
    setSelectedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleCategoryToggle = (categoryId) => {
    const category = topicCategories.find(cat => cat.id === categoryId);
    const categoryTopicIds = category.topics.map(topic => topic.id);
    
    const allSelected = categoryTopicIds.every(id => selectedTopics.includes(id));
    
    if (allSelected) {
      // Remove all topics from this category
      setSelectedTopics(prev => prev.filter(id => !categoryTopicIds.includes(id)));
    } else {
      // Add all topics from this category
      setSelectedTopics(prev => [...new Set([...prev, ...categoryTopicIds])]);
    }
  };

  const getSelectedTopicsForCategory = (categoryId) => {
    const category = topicCategories.find(cat => cat.id === categoryId);
    return category.topics.filter(topic => selectedTopics.includes(topic.id));
  };

  const handleNext = () => {
    if (currentStep < topicCategories.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      onComplete({ topics: selectedTopics });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete({ topics: [] });
  };

  const currentCategory = topicCategories[currentStep];

  return (
    <Card className="terminal-surface border-gray-700 terminal-glow w-full max-w-4xl mx-auto">
      <CardHeader className="text-center mb-8">
        <CardTitle className="text-3xl terminal-text mb-2">
          Personalize Your Experience
        </CardTitle>
        <p className="terminal-muted text-lg mb-4">
          Select topics that interest you to customize your dashboard and recommendations
        </p>
        <div className="flex items-center justify-center space-x-2 mb-4">
          {topicCategories.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index <= currentStep ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
        <div className="text-sm terminal-muted">
          Step {currentStep + 1} of {topicCategories.length}: {currentCategory.name}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Category */}
        <div className="text-center mb-6">
          <currentCategory.icon className="w-12 h-12 mx-auto mb-3 text-blue-400" />
          <h2 className="text-2xl font-bold terminal-text mb-2">{currentCategory.name}</h2>
          <p className="terminal-muted mb-4">{currentCategory.description}</p>
          
          {/* Category Toggle */}
          <Button
            variant="outline"
            onClick={() => handleCategoryToggle(currentCategory.id)}
            className="mb-4 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            {getSelectedTopicsForCategory(currentCategory.id).length === currentCategory.topics.length ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Deselect All
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Select All
              </>
            )}
          </Button>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentCategory.topics.map((topic) => {
            const isSelected = selectedTopics.includes(topic.id);
            const IconComponent = topic.icon;
            
            return (
              <div
                key={topic.id}
                onClick={() => handleTopicToggle(topic.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected ? 'bg-blue-600' : 'bg-gray-700'
                  }`}>
                    <IconComponent className={`w-5 h-5 ${
                      isSelected ? 'text-white' : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${
                      isSelected ? 'text-blue-300' : 'terminal-text'
                    }`}>
                      {topic.name}
                    </h3>
                    <p className="text-sm terminal-muted">
                      {topic.description}
                    </p>
                  </div>
                  {isSelected && (
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
            >
              Back
            </Button>
            <Button
              variant="outline"
              onClick={handleSkip}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Skip
            </Button>
          </div>
          
          <Button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {currentStep === topicCategories.length - 1 ? (
              <div className="flex items-center">
                Complete Setup
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            ) : (
              <div className="flex items-center">
                Next Category
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            )}
          </Button>
        </div>

        {/* Selected Topics Summary */}
        {selectedTopics.length > 0 && (
          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
            <h3 className="text-sm font-semibold terminal-text mb-2">
              Selected Topics ({selectedTopics.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedTopics.map((topicId) => {
                const topic = topicCategories
                  .flatMap(cat => cat.topics)
                  .find(t => t.id === topicId);
                return topic ? (
                  <Badge key={topicId} variant="secondary" className="bg-blue-900/50 text-blue-300">
                    {topic.name}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopicSelection; 