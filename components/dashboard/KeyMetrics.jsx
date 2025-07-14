import React from 'react';
import { Card, CardContent } from "../ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  Activity,
  AlertTriangle,
  BarChart3,
  Target
} from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function KeyMetrics({ events, politicians, bills, polls, isLoading }) {
  const getMetrics = () => {
    const highImpactEvents = events.filter(e => e.impact_level === 'high' || e.impact_level === 'critical').length;
    const activeBills = bills.filter(b => b.status === 'committee' || b.status === 'floor_vote').length;
    const recentPolls = polls.filter(p => new Date(p.date_conducted) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
    const avgMarketImpact = events.reduce((sum, e) => sum + (e.market_impact || 0), 0) / (events.length || 1);

    return { highImpactEvents, activeBills, recentPolls, avgMarketImpact };
  };

  const metrics = getMetrics();

  const metricCards = [
    {
      title: "High Impact Events",
      value: metrics.highImpactEvents,
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      trend: "+12%"
    },
    {
      title: "Active Bills",
      value: metrics.activeBills,
      icon: FileText,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      trend: "-3%"
    },
    {
      title: "Recent Polls",
      value: metrics.recentPolls,
      icon: BarChart3,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      trend: "+8%"
    },
    {
      title: "Market Impact",
      value: metrics.avgMarketImpact.toFixed(1),
      icon: Target,
      color: metrics.avgMarketImpact >= 0 ? "text-green-400" : "text-red-400",
      bgColor: metrics.avgMarketImpact >= 0 ? "bg-green-500/10" : "bg-red-500/10",
      borderColor: metrics.avgMarketImpact >= 0 ? "border-green-500/30" : "border-red-500/30",
      trend: metrics.avgMarketImpact >= 0 ? "+5.2%" : "-2.1%"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metricCards.map((metric, index) => (
        <Card key={index} className={`terminal-surface border-gray-700 ${metric.bgColor} ${metric.borderColor} hover:shadow-lg transition-all duration-300`}>
          <CardContent className="p-6 pt-4">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-24 bg-gray-700" />
                <Skeleton className="h-10 w-20 bg-gray-700" />
                <Skeleton className="h-4 w-16 bg-gray-700" />
              </div>
            ) : (
              <div className="flex items-center justify-between h-full">
                <div className="flex-1">
                  <p className="text-sm terminal-muted mb-3 font-medium">{metric.title}</p>
                  <p className={`text-3xl font-bold ${metric.color} mb-3`}>
                    {metric.value}
                  </p>
                  <div className="flex items-center">
                    {metric.trend.startsWith('+') ? (
                      <TrendingUp className="w-4 h-4 text-green-400 mr-2" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400 mr-2" />
                    )}
                    <span className={`text-sm font-medium ${metric.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {metric.trend}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <metric.icon className={`w-10 h-10 ${metric.color} opacity-70`} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 