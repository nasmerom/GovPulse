// TODO: This page uses fallback/mock data for events. Replace with real API integration.
import React, { useState, useEffect } from "react";
import { User } from "../entities/User";
import AppLayout from "../components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, MapPin, Clock, Gavel, Vote, DollarSign, Plus, Edit, Eye, Users, Settings, AlertTriangle, Plane, Car, Train, RefreshCw, CheckCircle, XCircle, Info, Phone, Building } from "lucide-react";

// Real PoliticalEvent entity using government APIs
class PoliticalEvent {
  static async list(sortBy = '-date', limit = 100) {
    try {
      console.log('📅 PoliticalEvent.list() - Fetching real government events...');
      
      const response = await fetch(`/api/events?limit=${limit}`);
      if (!response.ok) {
        throw new Error(`Events API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('✅ PoliticalEvent.list() - Real events loaded:', {
        count: data.events?.length || 0,
        source: data.source,
        sample: data.events?.slice(0, 3).map(e => ({
          title: e.title,
          date: e.date,
          type: e.event_type
        }))
      });
      
      return data.events || [];
      
    } catch (error) {
      console.warn('⚠️ PoliticalEvent.list() - Using fallback data:', error.message);
      return this.getFallbackData();
    }
  }

  static getFallbackData() {
    return [
      {
        id: 1,
        title: "Senate Vote on Infrastructure Bill",
        date: "2024-01-15",
        event_type: "congressional",
        impact_level: "high",
        location: "U.S. Senate",
        description: "Critical vote on the $1.2 trillion infrastructure package",
        source: "Congress.gov - Fallback"
      },
      {
        id: 2,
        title: "Federal Reserve Interest Rate Decision",
        date: "2024-01-31",
        event_type: "economic",
        impact_level: "critical",
        location: "Federal Reserve",
        description: "FOMC meeting to decide on interest rate changes",
        source: "Federal Reserve - Fallback"
      },
      {
        id: 3,
        title: "Supreme Court Hearing on Tech Regulation",
        date: "2024-01-22",
        event_type: "judicial",
        impact_level: "high",
        location: "U.S. Supreme Court",
        description: "Oral arguments on social media regulation case",
        source: "Supreme Court - Fallback"
      },
      {
        id: 4,
        title: "CPI Data Release",
        date: "2024-02-13",
        event_type: "economic",
        impact_level: "high",
        location: "Bureau of Labor Statistics",
        description: "Consumer Price Index data release",
        source: "BLS - Fallback"
      },
      {
        id: 5,
        title: "House Committee Hearing on Climate Policy",
        date: "2024-01-28",
        event_type: "legislation",
        impact_level: "medium",
        location: "U.S. House of Representatives",
        description: "Energy and Commerce Committee hearing",
        market_impact: 12
      },
      {
        id: 6,
        title: "Treasury Department Policy Announcement",
        date: "2024-01-30",
        event_type: "economic",
        impact_level: "high",
        location: "U.S. Treasury",
        description: "New financial regulations announcement",
        market_impact: 20
      }
    ];
  }
}

// Date utility functions (simplified version of date-fns)
const format = (date, formatStr) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  if (formatStr === 'MMMM yyyy') {
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }
  if (formatStr === 'd') {
    return date.getDate().toString();
  }
  return date.toLocaleDateString();
};

const startOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const endOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const eachDayOfInterval = ({ start, end }) => {
  const days = [];
  const current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
};

const isSameMonth = (date1, date2) => {
  return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
};

const isSameDay = (date1, date2) => {
  return date1.getDate() === date2.getDate() && 
         date1.getMonth() === date2.getMonth() && 
         date1.getFullYear() === date2.getFullYear();
};

const addMonths = (date, months) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

const subMonths = (date, months) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() - months);
  return newDate;
};

export default function Events() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [publicEvents, setPublicEvents] = useState([]);
  const [dcCalendar, setDcCalendar] = useState([]);
  const [districtCalendar, setDistrictCalendar] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [showPublicEvents, setShowPublicEvents] = useState(false);
  const [showInternalCalendars, setShowInternalCalendars] = useState(false);
  const [conflicts, setConflicts] = useState([]);
  const [travelTime, setTravelTime] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);

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
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const data = await PoliticalEvent.list('-date', 100);
      setEvents(data);
      
      // Load public events for Representatives
      if (user?.account_type === 'Representative') {
        const publicEventsData = [
          {
            id: 1,
            title: "Town Hall Meeting",
            date: "2024-01-25",
            time: "7:00 PM",
            location: "Community Center",
            type: "town_hall",
            status: "published",
            rsvpCount: 45,
            maxCapacity: 100,
            description: "Open forum for constituents to discuss local issues"
          },
          {
            id: 2,
            title: "Infrastructure Site Visit",
            date: "2024-01-28",
            time: "10:00 AM",
            location: "Bridge Construction Site",
            type: "site_visit",
            status: "draft",
            rsvpCount: 12,
            maxCapacity: 25,
            description: "Tour of ongoing infrastructure projects"
          },
          {
            id: 3,
            title: "Small Business Roundtable",
            date: "2024-02-01",
            time: "2:00 PM",
            location: "Chamber of Commerce",
            type: "business_meeting",
            status: "published",
            rsvpCount: 28,
            maxCapacity: 50,
            description: "Discussion with local business leaders"
          }
        ];
        setPublicEvents(publicEventsData);
        
        // Load internal calendars
        await loadInternalCalendars();
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
    setIsLoading(false);
  };

  const loadInternalCalendars = async () => {
    try {
      // Mock DC Office Calendar
      const dcEvents = [
        {
          id: 'dc1',
          title: "House Floor Vote - Infrastructure Bill",
          date: "2024-01-15",
          time: "2:00 PM",
          location: "U.S. Capitol",
          type: "vote",
          priority: "high",
          duration: 60,
          office: "dc"
        },
        {
          id: 'dc2',
          title: "Committee Hearing - Transportation",
          date: "2024-01-16",
          time: "10:00 AM",
          location: "Rayburn House Office Building",
          type: "hearing",
          priority: "medium",
          duration: 120,
          office: "dc"
        },
        {
          id: 'dc3',
          title: "Staff Meeting",
          date: "2024-01-17",
          time: "9:00 AM",
          location: "DC Office",
          type: "meeting",
          priority: "low",
          duration: 60,
          office: "dc"
        }
      ];

      // Mock District Office Calendar
      const districtEvents = [
        {
          id: 'dist1',
          title: "Constituent Meeting - Healthcare",
          date: "2024-01-15",
          time: "11:00 AM",
          location: "District Office",
          type: "constituent",
          priority: "high",
          duration: 45,
          office: "district"
        },
        {
          id: 'dist2',
          title: "Local Business Tour",
          date: "2024-01-18",
          time: "1:00 PM",
          location: "Downtown Business District",
          type: "tour",
          priority: "medium",
          duration: 90,
          office: "district"
        },
        {
          id: 'dist3',
          title: "Phone Call with Mayor",
          date: "2024-01-19",
          time: "3:00 PM",
          location: "District Office",
          type: "call",
          priority: "medium",
          duration: 30,
          office: "district"
        }
      ];

      setDcCalendar(dcEvents);
      setDistrictCalendar(districtEvents);
      
      // Detect conflicts and calculate travel time
      detectConflicts([...dcEvents, ...districtEvents]);
      calculateTravelTime([...dcEvents, ...districtEvents]);
    } catch (error) {
      console.error('Error loading internal calendars:', error);
    }
  };

  const detectConflicts = (allEvents) => {
    const conflicts = [];
    const sortedEvents = allEvents.sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
    
    for (let i = 0; i < sortedEvents.length - 1; i++) {
      const current = sortedEvents[i];
      const next = sortedEvents[i + 1];
      
      if (current.date === next.date) {
        const currentStart = new Date(current.date + ' ' + current.time);
        const currentEnd = new Date(currentStart.getTime() + (current.duration || 60) * 60000);
        const nextStart = new Date(next.date + ' ' + next.time);
        
        // Check for time overlap
        if (currentEnd > nextStart) {
          conflicts.push({
            id: `conflict-${i}`,
            type: 'time_conflict',
            events: [current, next],
            severity: 'high',
            description: `Time conflict between "${current.title}" and "${next.title}"`
          });
        }
        
        // Check for location conflicts (DC vs District)
        if (current.office !== next.office && 
            Math.abs(currentStart - nextStart) < 4 * 60 * 60000) { // Within 4 hours
          conflicts.push({
            id: `travel-${i}`,
            type: 'travel_conflict',
            events: [current, next],
            severity: 'medium',
            description: `Travel required between "${current.title}" (${current.office.toUpperCase()}) and "${next.title}" (${next.office.toUpperCase()})`
          });
        }
      }
    }
    
    setConflicts(conflicts);
  };

  const calculateTravelTime = (allEvents) => {
    const travelTimes = {};
    const sortedEvents = allEvents.sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
    
    for (let i = 0; i < sortedEvents.length - 1; i++) {
      const current = sortedEvents[i];
      const next = sortedEvents[i + 1];
      
      if (current.date === next.date && current.office !== next.office) {
        const currentEnd = new Date(current.date + ' ' + current.time);
        currentEnd.setMinutes(currentEnd.getMinutes() + (current.duration || 60));
        const nextStart = new Date(next.date + ' ' + next.time);
        
        const timeDiff = nextStart - currentEnd;
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        if (hoursDiff > 0 && hoursDiff < 6) { // Within same day, reasonable travel time
          const travelTime = {
            from: current,
            to: next,
            duration: hoursDiff,
            mode: hoursDiff < 2 ? 'plane' : 'car',
            required: hoursDiff < 1.5
          };
          
          travelTimes[`${current.id}-${next.id}`] = travelTime;
        }
      }
    }
    
    setTravelTime(travelTimes);
  };

  const syncCalendars = async () => {
    setIsSyncing(true);
    try {
      // Simulate calendar sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reload calendars after sync
      await loadInternalCalendars();
      
      console.log('Calendars synchronized successfully');
    } catch (error) {
      console.error('Error syncing calendars:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'election': return Vote;
      case 'judicial': return Gavel;
      case 'economic': return DollarSign;
      default: return Calendar;
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'election': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'judicial': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'economic': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'legislation': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getImpactColor = (level) => {
    switch (level) {
      case 'critical': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'draft': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'pending': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getPublicEventTypeIcon = (type) => {
    switch (type) {
      case 'town_hall': return Users;
      case 'site_visit': return MapPin;
      case 'business_meeting': return DollarSign;
      default: return Calendar;
    }
  };

  const getInternalEventTypeIcon = (type) => {
    switch (type) {
      case 'vote': return Vote;
      case 'hearing': return Gavel;
      case 'meeting': return Users;
      case 'constituent': return UserIcon;
      case 'tour': return MapPin;
      case 'call': return Phone;
      default: return Calendar;
    }
  };

  const getConflictSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getTravelModeIcon = (mode) => {
    switch (mode) {
      case 'plane': return Plane;
      case 'car': return Car;
      case 'train': return Train;
      default: return Car;
    }
  };

  const getOfficeColor = (office) => {
    switch (office) {
      case 'dc': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'district': return 'bg-green-500/10 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <AppLayout user={user}>
      <div className="p-6 space-y-6 min-h-screen political-terminal">
        <div className="w-full">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold terminal-text mb-2 flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-blue-400" />
                  Political Calendar
                </h1>
                <p className="terminal-muted">Track major political events, decisions, and deadlines</p>
              </div>
              {user?.account_type === 'Representative' && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="border-gray-600 text-gray-300"
                    onClick={() => setShowPublicEvents(!showPublicEvents)}
                  >
                    {showPublicEvents ? 'Hide' : 'Show'} Public Events
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-600 text-gray-300"
                    onClick={() => setShowInternalCalendars(!showInternalCalendars)}
                  >
                    {showInternalCalendars ? 'Hide' : 'Show'} Internal Calendars
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-600 text-gray-300"
                    onClick={syncCalendars}
                    disabled={isSyncing}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Syncing...' : 'Sync Calendars'}
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="lg:col-span-2 terminal-surface border-gray-700 terminal-glow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="terminal-text">
                    {format(currentMonth, 'MMMM yyyy')}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                      className="bg-gray-800 border-gray-600 hover:bg-gray-700"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                      className="bg-gray-800 border-gray-600 hover:bg-gray-700"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium terminal-muted">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map(day => {
                    const dayEvents = getEventsForDate(day);
                    const isSelected = isSameDay(day, selectedDate);
                    const isToday = isSameDay(day, new Date());
                    
                    return (
                      <div
                        key={day.toISOString()}
                        className={`p-2 min-h-[80px] border border-gray-700 rounded cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-900/50 border-blue-500' :
                          isToday ? 'bg-gray-700/50' :
                          'hover:bg-gray-800/50'
                        } ${!isSameMonth(day, currentMonth) ? 'opacity-30' : ''}`}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className={`text-sm ${isToday ? 'font-bold text-blue-400' : 'terminal-text'}`}>
                          {format(day, 'd')}
                        </div>
                        <div className="mt-1 space-y-1">
                          {dayEvents.slice(0, 2).map((event, idx) => (
                            <div
                              key={idx}
                              className={`text-xs px-1 py-0.5 rounded truncate ${getEventColor(event.event_type)}`}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-400">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Events for Selected Date */}
            <Card className="terminal-surface border-gray-700 terminal-glow">
              <CardHeader>
                <CardTitle className="terminal-text">
                  {format(selectedDate, 'MMMM d, yyyy')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedDateEvents.length === 0 ? (
                  <div className="text-center py-8 terminal-muted">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No events scheduled</p>
                  </div>
                ) : (
                  selectedDateEvents.map(event => {
                    const EventIcon = getEventTypeIcon(event.event_type);
                    return (
                      <div key={event.id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-800/30 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-gray-800">
                            <EventIcon className="w-4 h-4 text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold terminal-text mb-2">{event.title}</h3>
                            <p className="text-sm terminal-muted mb-3">{event.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge className={getEventColor(event.event_type)}>
                                {event.event_type}
                              </Badge>
                              <Badge className={getImpactColor(event.impact_level)}>
                                {event.impact_level} impact
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs terminal-muted">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{format(new Date(event.date), 'MMM d')}</span>
                              </div>
                            </div>
                            
                            {event.market_impact && (
                              <div className="mt-3 pt-3 border-t border-gray-700">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="terminal-muted">Market Impact</span>
                                  <span className="font-mono text-green-400">
                                    {event.market_impact > 0 ? '+' : ''}{event.market_impact}%
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          {/* Public Events for Representatives */}
          {user?.account_type === 'Representative' && showPublicEvents && (
            <Card className="terminal-surface border-gray-700 terminal-glow">
              <CardHeader>
                <CardTitle className="terminal-text flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-400" />
                  Public Calendar Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {publicEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 bg-green-400 rounded-full" />
                        <div>
                          <div className="font-medium terminal-text">{event.title}</div>
                          <div className="text-sm text-gray-400">
                            {event.date} at {event.time} • {event.location}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {event.rsvpCount} RSVPs / {event.maxCapacity} capacity
                          </div>
                          <div className="text-xs text-gray-400 mt-1">{event.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Internal Calendars for Representatives */}
          {user?.account_type === 'Representative' && showInternalCalendars && (
            <div className="space-y-6">
              {/* DC Office Calendar */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="terminal-text flex items-center">
                    <Building className="w-5 h-5 mr-2 text-blue-400" />
                    DC Office Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dcCalendar.map((event) => {
                      const EventIcon = getInternalEventTypeIcon(event.type);
                      return (
                        <div key={event.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-3 h-3 bg-blue-400 rounded-full" />
                            <div>
                              <div className="font-medium terminal-text">{event.title}</div>
                              <div className="text-sm text-gray-400">
                                {event.date} at {event.time} • {event.location}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Duration: {event.duration} minutes
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge className={getOfficeColor(event.office)}>
                              {event.office.toUpperCase()}
                            </Badge>
                            <Badge className={getPriorityColor(event.priority)}>
                              {event.priority}
                            </Badge>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* District Office Calendar */}
              <Card className="terminal-surface border-gray-700 terminal-glow">
                <CardHeader>
                  <CardTitle className="terminal-text flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-green-400" />
                    District Office Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {districtCalendar.map((event) => {
                      const EventIcon = getInternalEventTypeIcon(event.type);
                      return (
                        <div key={event.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-3 h-3 bg-green-400 rounded-full" />
                            <div>
                              <div className="font-medium terminal-text">{event.title}</div>
                              <div className="text-sm text-gray-400">
                                {event.date} at {event.time} • {event.location}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Duration: {event.duration} minutes
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge className={getOfficeColor(event.office)}>
                              {event.office.toUpperCase()}
                            </Badge>
                            <Badge className={getPriorityColor(event.priority)}>
                              {event.priority}
                            </Badge>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Conflicts and Travel Alerts */}
              {(conflicts.length > 0 || Object.keys(travelTime).length > 0) && (
                <Card className="terminal-surface border-gray-700 terminal-glow">
                  <CardHeader>
                    <CardTitle className="terminal-text flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-orange-400" />
                      Schedule Conflicts & Travel Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Conflicts */}
                      {conflicts.map((conflict) => (
                        <div key={conflict.id} className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                            <div className="flex-1">
                              <div className="font-medium terminal-text text-red-400 mb-2">
                                {conflict.description}
                              </div>
                              <div className="space-y-2">
                                {conflict.events.map((event, index) => (
                                  <div key={index} className="text-sm text-gray-300">
                                    • {event.title} - {event.date} at {event.time} ({event.office.toUpperCase()})
                                  </div>
                                ))}
                              </div>
                            </div>
                            <Badge className={getConflictSeverityColor(conflict.severity)}>
                              {conflict.severity}
                            </Badge>
                          </div>
                        </div>
                      ))}

                      {/* Travel Time */}
                      {Object.entries(travelTime).map(([key, travel]) => {
                        const TravelIcon = getTravelModeIcon(travel.mode);
                        return (
                          <div key={key} className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <div className="flex items-start space-x-3">
                              <TravelIcon className="w-5 h-5 text-blue-400 mt-0.5" />
                              <div className="flex-1">
                                <div className="font-medium terminal-text text-blue-400 mb-2">
                                  Travel Required: {travel.from.office.toUpperCase()} → {travel.to.office.toUpperCase()}
                                </div>
                                <div className="text-sm text-gray-300 space-y-1">
                                  <div>From: {travel.from.title} ({travel.from.time})</div>
                                  <div>To: {travel.to.title} ({travel.to.time})</div>
                                  <div>Travel Time: {travel.duration.toFixed(1)} hours</div>
                                  <div>Recommended Mode: {travel.mode}</div>
                                  {travel.required && (
                                    <div className="text-orange-400 font-medium">
                                      ⚠️ Travel time may be insufficient
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                                Travel
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
} 