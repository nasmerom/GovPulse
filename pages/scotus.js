import React, { useState, useEffect } from "react";
import { SCOTUSCase } from "../entities/SCOTUSCase";
import { User as UserEntity } from "../entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Gavel, Calendar, Scale, AlertTriangle, Users, User, Quote, BookOpen } from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";
import { format, isFuture } from "date-fns";
import AppLayout from "../components/AppLayout";

const justices = [
  {
    name: "John G. Roberts Jr.",
    position: "Chief Justice",
    appointed: "2005",
    appointedBy: "George W. Bush",
    philosophy: "Conservative institutionalist who values court legitimacy and incremental change over sweeping decisions.",
    keyFactions: "Often serves as a swing vote, bridging conservative and liberal wings on contentious issues.",
    recentQuote: "The judiciary's role is to interpret the law, not to make policy. We must maintain the Court's integrity above partisan politics.",
    frequentlyCitedCases: ["Marbury v. Madison", "Brown v. Board", "Miranda v. Arizona"],
    notablePosition: "Authored the majority opinion in NFIB v. Sebelius, upholding the Affordable Care Act's individual mandate as a constitutional tax."
  },
  {
    name: "Clarence Thomas",
    position: "Associate Justice",
    appointed: "1991",
    appointedBy: "George H.W. Bush",
    philosophy: "Originalist and textualist who interprets the Constitution based on its original public meaning.",
    keyFactions: "Leader of the court's most conservative wing, often writing separate concurring opinions.",
    recentQuote: "We should interpret the Constitution according to its text and original meaning, not according to our own policy preferences.",
    frequentlyCitedCases: ["Heller v. DC", "McDonald v. Chicago", "Printz v. United States"],
    notablePosition: "Strong advocate for Second Amendment rights and federalism; frequently questions stare decisis in constitutional interpretation."
  },
  {
    name: "Samuel A. Alito Jr.",
    position: "Associate Justice",
    appointed: "2006",
    appointedBy: "George W. Bush",
    philosophy: "Conservative originalist with strong views on executive power and religious liberty.",
    keyFactions: "Part of the reliable conservative bloc, often aligning with Thomas on major decisions.",
    recentQuote: "Religious liberty is not a second-class right. The Constitution protects the free exercise of religion.",
    frequentlyCitedCases: ["Employment Division v. Smith", "Sherbert v. Verner", "Wisconsin v. Yoder"],
    notablePosition: "Authored the majority opinion in Dobbs v. Jackson, overturning Roe v. Wade and returning abortion regulation to the states."
  },
  {
    name: "Sonia Sotomayor",
    position: "Associate Justice",
    appointed: "2009",
    appointedBy: "Barack Obama",
    philosophy: "Liberal justice who emphasizes practical consequences and social justice in constitutional interpretation.",
    keyFactions: "Leader of the court's liberal wing, frequently writing passionate dissents in conservative majority decisions.",
    recentQuote: "The law must work for all people, not just the privileged few. We cannot ignore the real-world impact of our decisions.",
    frequentlyCitedCases: ["Brown v. Board", "Gideon v. Wainwright", "Terry v. Ohio"],
    notablePosition: "Strong advocate for criminal justice reform and immigrant rights; often highlights disparate racial impacts in her opinions."
  },
  {
    name: "Elena Kagan",
    position: "Associate Justice",
    appointed: "2010",
    appointedBy: "Barack Obama",
    philosophy: "Pragmatic liberal who focuses on statutory interpretation and administrative law expertise.",
    keyFactions: "Part of the liberal bloc but occasionally finds common ground with conservative justices on technical legal issues.",
    recentQuote: "Courts should be extremely careful about substituting their judgment for that of democratically elected officials.",
    frequentlyCitedCases: ["Chevron v. NRDC", "Youngstown Steel", "McCulloch v. Maryland"],
    notablePosition: "Former Solicitor General who brings executive branch perspective; known for detailed questioning during oral arguments."
  },
  {
    name: "Neil M. Gorsuch",
    position: "Associate Justice",
    appointed: "2017",
    appointedBy: "Donald Trump",
    philosophy: "Textualist and originalist who emphasizes clear legal rules and separation of powers.",
    keyFactions: "Conservative justice who sometimes breaks from the majority on criminal justice and Native American rights.",
    recentQuote: "A judge who likes every result he reaches is very likely a bad judge, reaching for results he prefers rather than those the law compels.",
    frequentlyCitedCases: ["Scalia's opinions", "Bostock v. Clayton County", "McGirt v. Oklahoma"],
    notablePosition: "Authored the majority opinion in Bostock, extending workplace discrimination protections to LGBTQ+ individuals."
  },
  {
    name: "Brett M. Kavanaugh",
    position: "Associate Justice",
    appointed: "2018",
    appointedBy: "Donald Trump",
    philosophy: "Conservative justice with extensive experience in executive branch and federal appellate work.",
    keyFactions: "Part of the conservative majority but occasionally more moderate on certain regulatory and administrative issues.",
    recentQuote: "The Constitution is not a living document that changes meaning over time. It has a fixed meaning that we must faithfully apply.",
    frequentlyCitedCases: ["Chevron doctrine cases", "Administrative law precedents", "Separation of powers cases"],
    notablePosition: "Former White House counsel who brings insider knowledge of executive operations; focuses heavily on administrative law."
  },
  {
    name: "Amy Coney Barrett",
    position: "Associate Justice",
    appointed: "2020",
    appointedBy: "Donald Trump",
    philosophy: "Originalist in the mold of Antonin Scalia, with strong conservative views on constitutional interpretation.",
    keyFactions: "Solidified the 6-3 conservative majority, though early tenure shows some independent streak on select issues.",
    recentQuote: "I interpret the Constitution as a law, and I interpret statutes as laws. I believe in the rule of law.",
    frequentlyCitedCases: ["Scalia's originalist opinions", "Heller v. DC", "Crawford v. Washington"],
    notablePosition: "Former Scalia law clerk who explicitly follows his originalist methodology; youngest current justice at time of appointment."
  },
  {
    name: "Ketanji Brown Jackson",
    position: "Associate Justice",
    appointed: "2022",
    appointedBy: "Joe Biden",
    philosophy: "Liberal justice with extensive criminal defense and sentencing expertise, emphasizing equal justice.",
    keyFactions: "Newest member of the liberal minority, bringing fresh perspective on criminal justice and civil rights issues.",
    recentQuote: "Equal justice under law is not just a motto carved in stone, it is an aspiration that we must continue to strive to achieve.",
    frequentlyCitedCases: ["Gideon v. Wainwright", "Miranda v. Arizona", "Terry v. Ohio"],
    notablePosition: "First Black woman on the Supreme Court; brings unique perspective from extensive public defender experience."
  }
];

export default function SCOTUS() {
  const [cases, setCases] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [casesData, userData] = await Promise.all([
          SCOTUSCase.list('-date_filed', 100),
          UserEntity.me().catch(() => null)
        ]);
        setCases(casesData);
        setUser(userData);
      } catch (error) {
        console.error('Error loading SCOTUS data:', error);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'decided': return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'argued': return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'dismissed': return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
      default: return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
    }
  };

  const getImpactColor = (level) => {
    switch (level) {
      case 'landmark': return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      default: return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
    }
  };

  const upcomingDecisions = cases.filter(c => c.expected_decision_date && isFuture(new Date(c.expected_decision_date)));
  const recentDecisions = cases.filter(c => c.case_status === 'decided').slice(0, 5);
  const pendingCases = cases.filter(c => c.case_status === 'pending' || c.case_status === 'argued');

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <AppLayout user={user}>
      <div className="p-4 md:p-6 space-y-6 min-h-screen" style={{ background: 'var(--terminal-bg)' }}>
        <div className="w-full">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold terminal-text mb-2 flex items-center gap-3">
              <Gavel className="w-6 h-6 md:w-8 md:h-8 text-amber-400" />
              Supreme Court Intelligence
            </h1>
            <p className="terminal-muted text-sm md:text-base">Track SCOTUS decisions, pending cases, and constitutional developments</p>
          </div>

          <Tabs defaultValue="recent" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-gray-800/50 border-gray-700">
              <TabsTrigger value="recent" className="text-sm">Recent Decisions</TabsTrigger>
              <TabsTrigger value="pending" className="text-sm">Pending Cases</TabsTrigger>
              <TabsTrigger value="upcoming" className="text-sm">Upcoming Decisions</TabsTrigger>
              <TabsTrigger value="justices" className="text-sm">The Nine Justices</TabsTrigger>
              <TabsTrigger value="analysis" className="text-sm">Impact Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="mt-6">
              <div className="grid grid-cols-1 gap-6">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-48 bg-gray-800/50" />)
                ) : (
                  recentDecisions.map((case_item) => (
                    <Card key={case_item.id} className="terminal-surface border-gray-700 terminal-glow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="terminal-text text-lg">{case_item.case_name}</CardTitle>
                            <p className="text-sm terminal-muted mt-1">Docket No. {case_item.docket_number}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline" className={getStatusColor(case_item.case_status)}>
                              {case_item.case_status}
                            </Badge>
                            <Badge variant="outline" className={getImpactColor(case_item.impact_level)}>
                              {case_item.impact_level}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="terminal-text mb-4">{case_item.case_description}</p>
                        
                        {case_item.legal_issues && (
                          <div className="mb-4">
                            <h4 className="font-medium terminal-text mb-2">Key Legal Issues:</h4>
                            <div className="flex flex-wrap gap-2">
                              {case_item.legal_issues.map((issue, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs bg-gray-800/70 text-gray-300">
                                  {issue}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {case_item.decision_date && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-400" />
                              <span className="terminal-muted">Decided:</span>
                              <span className="terminal-text">{format(new Date(case_item.decision_date), 'MMM d, yyyy')}</span>
                            </div>
                          )}
                          {case_item.majority_opinion_author && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-green-400" />
                              <span className="terminal-muted">Majority:</span>
                              <span className="terminal-text">{case_item.majority_opinion_author}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Scale className="w-4 h-4 text-purple-400" />
                            <span className="terminal-muted">Vote:</span>
                            <span className="terminal-text">{case_item.majority_vote}-{case_item.minority_vote}</span>
                          </div>
                        </div>

                        {case_item.key_holdings && case_item.key_holdings.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-medium terminal-text mb-2">Key Holdings:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm terminal-text">
                              {case_item.key_holdings.map((holding, idx) => (
                                <li key={idx}>{holding}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <div className="grid grid-cols-1 gap-6">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-48 bg-gray-800/50" />)
                ) : (
                  pendingCases.map((case_item) => (
                    <Card key={case_item.id} className="terminal-surface border-gray-700 terminal-glow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="terminal-text text-lg">{case_item.case_name}</CardTitle>
                            <p className="text-sm terminal-muted mt-1">Docket No. {case_item.docket_number}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline" className={getStatusColor(case_item.case_status)}>
                              {case_item.case_status}
                            </Badge>
                            <Badge variant="outline" className={getImpactColor(case_item.impact_level)}>
                              {case_item.impact_level}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="terminal-text mb-4">{case_item.case_description}</p>
                        
                        {case_item.legal_issues && (
                          <div className="mb-4">
                            <h4 className="font-medium terminal-text mb-2">Key Legal Issues:</h4>
                            <div className="flex flex-wrap gap-2">
                              {case_item.legal_issues.map((issue, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs bg-gray-800/70 text-gray-300">
                                  {issue}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            <span className="terminal-muted">Filed:</span>
                            <span className="terminal-text">{format(new Date(case_item.date_filed), 'MMM d, yyyy')}</span>
                          </div>
                          {case_item.expected_decision_date && (
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-yellow-400" />
                              <span className="terminal-muted">Expected:</span>
                              <span className="terminal-text">{format(new Date(case_item.expected_decision_date), 'MMM d, yyyy')}</span>
                            </div>
                          )}
                        </div>

                        {case_item.constitutional_implications && (
                          <div className="mt-4">
                            <h4 className="font-medium terminal-text mb-2">Constitutional Implications:</h4>
                            <p className="text-sm terminal-text">{case_item.constitutional_implications}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="upcoming" className="mt-6">
              <div className="grid grid-cols-1 gap-6">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-48 bg-gray-800/50" />)
                ) : upcomingDecisions.length > 0 ? (
                  upcomingDecisions.map((case_item) => (
                    <Card key={case_item.id} className="terminal-surface border-gray-700 terminal-glow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="terminal-text text-lg">{case_item.case_name}</CardTitle>
                            <p className="text-sm terminal-muted mt-1">Docket No. {case_item.docket_number}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
                              Expected Soon
                            </Badge>
                            <Badge variant="outline" className={getImpactColor(case_item.impact_level)}>
                              {case_item.impact_level}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="terminal-text mb-4">{case_item.case_description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-red-400" />
                            <span className="terminal-muted">Expected Decision:</span>
                            <span className="terminal-text font-medium">{format(new Date(case_item.expected_decision_date), 'MMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-400" />
                            <span className="terminal-muted">Status:</span>
                            <span className="terminal-text">{case_item.case_status}</span>
                          </div>
                        </div>

                        {case_item.constitutional_implications && (
                          <div className="mt-4">
                            <h4 className="font-medium terminal-text mb-2">Potential Impact:</h4>
                            <p className="text-sm terminal-text">{case_item.constitutional_implications}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="terminal-surface border-gray-700">
                    <CardContent className="text-center py-12">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium terminal-text mb-2">No Upcoming Decisions</h3>
                      <p className="terminal-muted">All pending cases are still under review.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="justices" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {justices.map((justice) => (
                  <Card key={justice.name} className="terminal-surface border-gray-700 terminal-glow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="terminal-text text-lg">{justice.name}</CardTitle>
                          <p className="text-sm terminal-muted">{justice.position}</p>
                          <p className="text-xs terminal-muted">Appointed {justice.appointed} by {justice.appointedBy}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium terminal-text text-sm mb-1">Philosophy</h4>
                        <p className="text-xs terminal-muted">{justice.philosophy}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium terminal-text text-sm mb-1">Key Role</h4>
                        <p className="text-xs terminal-muted">{justice.keyFactions}</p>
                      </div>

                      <div>
                        <h4 className="font-medium terminal-text text-sm mb-1 flex items-center gap-1">
                          <Quote className="w-3 h-3" />
                          Recent Quote
                        </h4>
                        <p className="text-xs terminal-muted italic">"{justice.recentQuote}"</p>
                      </div>

                      <div>
                        <h4 className="font-medium terminal-text text-sm mb-1 flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          Notable Position
                        </h4>
                        <p className="text-xs terminal-muted">{justice.notablePosition}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="terminal-surface border-gray-700 terminal-glow">
                  <CardHeader>
                    <CardTitle className="terminal-text">Court Composition Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                        <span className="terminal-text">Conservative Majority</span>
                        <Badge variant="outline" className="bg-red-500/20 text-red-300 border-red-500/50">
                          6-3
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                        <span className="terminal-text">Average Tenure</span>
                        <span className="terminal-text font-mono">8.2 years</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                        <span className="terminal-text">Landmark Cases (2022-2023)</span>
                        <span className="terminal-text font-mono">4</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="terminal-surface border-gray-700 terminal-glow">
                  <CardHeader>
                    <CardTitle className="terminal-text">Recent Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 rounded-lg bg-gray-800/30">
                        <h4 className="font-medium terminal-text text-sm mb-2">Major Questions Doctrine</h4>
                        <p className="text-xs terminal-muted">Strengthened in West Virginia v. EPA, limiting executive agency authority</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-800/30">
                        <h4 className="font-medium terminal-text text-sm mb-2">Religious Liberty</h4>
                        <p className="text-xs terminal-muted">Expanded protection in Kennedy v. Bremerton and 303 Creative</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-800/30">
                        <h4 className="font-medium terminal-text text-sm mb-2">Second Amendment</h4>
                        <p className="text-xs terminal-muted">Extended to public carry in NYSRPA v. Bruen</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
} 