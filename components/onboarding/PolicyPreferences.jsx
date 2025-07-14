import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Heart, 
  Shield, 
  DollarSign, 
  GraduationCap, 
  Leaf, 
  Car, 
  Home, 
  Users, 
  Globe, 
  Zap,
  Check
} from 'lucide-react';

const POLICY_OPTIONS = [
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Medical care, insurance, pharmaceuticals, public health',
    icon: Heart,
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    selectedColor: 'bg-red-500 text-white border-red-500'
  },
  {
    id: 'defense',
    name: 'Defense & Security',
    description: 'Military, national security, defense spending, veterans',
    icon: Shield,
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    selectedColor: 'bg-blue-500 text-white border-blue-500'
  },
  {
    id: 'economy',
    name: 'Economy & Finance',
    description: 'Taxes, banking, trade, economic policy, jobs',
    icon: DollarSign,
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    selectedColor: 'bg-green-500 text-white border-green-500'
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Schools, universities, student loans, research funding',
    icon: GraduationCap,
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    selectedColor: 'bg-purple-500 text-white border-purple-500'
  },
  {
    id: 'environment',
    name: 'Environment & Energy',
    description: 'Climate change, renewable energy, conservation, pollution',
    icon: Leaf,
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    selectedColor: 'bg-emerald-500 text-white border-emerald-500'
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    description: 'Transportation, roads, bridges, broadband, utilities',
    icon: Car,
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    selectedColor: 'bg-orange-500 text-white border-orange-500'
  },
  {
    id: 'housing',
    name: 'Housing & Urban',
    description: 'Affordable housing, urban development, zoning',
    icon: Home,
    color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    selectedColor: 'bg-indigo-500 text-white border-indigo-500'
  },
  {
    id: 'immigration',
    name: 'Immigration',
    description: 'Border security, visas, citizenship, refugee policy',
    icon: Users,
    color: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    selectedColor: 'bg-pink-500 text-white border-pink-500'
  },
  {
    id: 'foreign',
    name: 'Foreign Affairs',
    description: 'International relations, diplomacy, foreign aid',
    icon: Globe,
    color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    selectedColor: 'bg-cyan-500 text-white border-cyan-500'
  },
  {
    id: 'technology',
    name: 'Technology',
    description: 'AI, cybersecurity, digital privacy, tech regulation',
    icon: Zap,
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    selectedColor: 'bg-yellow-500 text-white border-yellow-500'
  }
];

export default function PolicyPreferences({ onComplete, onBack }) {
  const [selectedPolicies, setSelectedPolicies] = useState([]);

  const togglePolicy = (policyId) => {
    setSelectedPolicies(prev => 
      prev.includes(policyId)
        ? prev.filter(id => id !== policyId)
        : [...prev, policyId]
    );
  };

  const handleContinue = () => {
    onComplete(selectedPolicies);
  };

  const handleSkip = () => {
    onComplete([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold terminal-text">What policy areas interest you?</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Select the policy areas you'd like to focus on. This will help us highlight relevant 
          congressional activity, lobbying disclosures, and policy developments throughout the app.
        </p>
        <p className="text-sm text-gray-500">
          You can change these preferences anytime in your settings.
        </p>
      </div>

      <Card className="terminal-surface border-gray-700">
        <CardHeader>
          <CardTitle className="terminal-text">Select Your Policy Interests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {POLICY_OPTIONS.map((policy) => {
              const isSelected = selectedPolicies.includes(policy.id);
              const IconComponent = policy.icon;
              
              return (
                <div
                  key={policy.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    isSelected 
                      ? policy.selectedColor 
                      : policy.color
                  }`}
                  onClick={() => togglePolicy(policy.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-6 h-6" />
                      <h3 className="font-semibold">{policy.name}</h3>
                    </div>
                    {isSelected && <Check className="w-5 h-5" />}
                  </div>
                  <p className="text-sm opacity-80">{policy.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          Back
        </Button>
        
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Skip for now
          </Button>
          
          <Button
            onClick={handleContinue}
            disabled={selectedPolicies.length === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Continue
            {selectedPolicies.length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-blue-500/20 text-blue-300">
                {selectedPolicies.length} selected
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {selectedPolicies.length > 0 && (
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Selected: {selectedPolicies.map(id => 
              POLICY_OPTIONS.find(p => p.id === id)?.name
            ).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
} 