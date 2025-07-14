import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Search, Loader2, MessageSquare, Lightbulb, FileText, Users } from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";
import AppLayout from "../components/AppLayout";
import { User } from "../entities/User";

export default function AISearch() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [user, setUser] = useState(null);

  React.useEffect(() => {
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

  const suggestedQueries = [
    "What is the current status of the Infrastructure Investment Act?",
    "How do Senators from Texas typically vote on healthcare bills?",
    "What are the key differences between the House and Senate versions of the climate bill?",
    "Which committees oversee cryptocurrency regulation?",
    "What was the vote breakdown on the recent defense spending bill?",
    "How has Senator Warren's voting record changed over the past year?",
    "What amendments were added to the latest education funding bill?",
    "Which representatives have the highest approval ratings in swing states?"
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const sanitizedQuery = query.replace(/[<>]/g, '');
      
      // For now, we'll use a mock response since we don't have the InvokeLLM integration
      // In a real implementation, you would call your AI service here
      const mockResponse = `Based on my analysis of the current political landscape, here's what I found regarding "${sanitizedQuery}":

**Current Status**: The legislation is currently under review in the Senate Judiciary Committee.

**Key Stakeholders**: 
- Senator Smith (D-CA) is the primary sponsor
- Representative Johnson (R-TX) has expressed concerns about funding
- The White House has indicated support for the measure

**Recent Developments**: 
- The bill passed the House with bipartisan support (245-180)
- Committee hearings are scheduled for next week
- Industry groups have submitted testimony both for and against

**Potential Implications**: 
- If passed, this could impact federal spending by approximately $50 billion over 10 years
- Several states have already begun preparing implementation plans
- Opposition groups are planning legal challenges

**Next Steps**: 
- Senate committee vote expected within 2 weeks
- Floor debate likely to begin in early next month
- Final passage could occur before the August recess

This analysis is based on current congressional records, voting patterns, and recent political developments.`;

      setResponse(mockResponse);
      setSearchHistory(prev => [{
        query: sanitizedQuery,
        response: mockResponse,
        timestamp: new Date()
      }, ...prev.slice(0, 4)]); // Keep last 5 searches
    } catch (error) {
      console.error('Error searching:', error);
      setResponse("I apologize, but I'm currently unable to process your request. Please try again later or rephrase your question.");
    }
    setIsLoading(false);
  };

  const handleSuggestedQuery = (suggestedQuery) => {
    setQuery(suggestedQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <AppLayout user={user}>
      <div className="p-4 md:p-6 space-y-6 min-h-screen" style={{ background: 'var(--terminal-bg)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold terminal-text mb-2 flex items-center gap-3">
              <Search className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
              AI Political Intelligence
            </h1>
            <p className="terminal-muted text-sm md:text-base">Ask specific questions about policy, legislation, and political developments</p>
          </div>

          {/* Search Interface */}
          <Card className="terminal-surface border-gray-700 terminal-glow mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 terminal-text">
                <MessageSquare className="w-5 h-5 text-green-400" />
                Ask GovPulse AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Ask about legislation, voting records, committee activities, or any political topic..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="min-h-24 bg-gray-800 border-gray-600 terminal-text resize-none"
                  disabled={isLoading}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs terminal-muted">
                    Press Enter to search or Shift+Enter for new line
                  </span>
                  <Button 
                    onClick={handleSearch}
                    disabled={isLoading || !query.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Response */}
          {response && (
            <Card className="terminal-surface border-gray-700 terminal-glow mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 terminal-text">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  AI Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <div className="terminal-text leading-relaxed whitespace-pre-wrap">
                    {response}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isLoading && (
            <Card className="terminal-surface border-gray-700">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-4 bg-gray-700 w-3/4" />
                  <Skeleton className="h-4 bg-gray-700 w-full" />
                  <Skeleton className="h-4 bg-gray-700 w-5/6" />
                  <Skeleton className="h-4 bg-gray-700 w-2/3" />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Suggested Queries */}
            <Card className="terminal-surface border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 terminal-text">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Suggested Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {suggestedQueries.map((suggestedQuery, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 cursor-pointer transition-colors border border-gray-700"
                      onClick={() => handleSuggestedQuery(suggestedQuery)}
                    >
                      <p className="text-sm terminal-text">{suggestedQuery}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Searches */}
            <Card className="terminal-surface border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 terminal-text">
                  <Users className="w-5 h-5 text-green-400" />
                  Recent Searches
                </CardTitle>
              </CardHeader>
              <CardContent>
                {searchHistory.length > 0 ? (
                  <div className="space-y-3">
                    {searchHistory.map((search, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-gray-800/30 border border-gray-700">
                        <p className="text-sm font-medium terminal-text mb-1">{search.query}</p>
                        <p className="text-xs terminal-muted line-clamp-2">{search.response}</p>
                        <div className="flex justify-between items-center mt-2">
                          <Badge variant="outline" className="text-xs bg-gray-700/50 text-gray-300">
                            {search.timestamp.toLocaleDateString()}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setQuery(search.query)}
                            className="text-xs text-blue-400 hover:text-blue-300"
                          >
                            Ask again
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 terminal-muted">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent searches</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 