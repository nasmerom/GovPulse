// TODO: This file uses mock data. Replace with real API integration.
// Mock CongressionalRecord entity for now - replace with actual API calls
export class CongressionalRecord {
  static async list(sortBy = '-date', limit = 50) {
    // Mock data - replace with actual API call
    return [
      {
        id: 1,
        date: "2024-02-01",
        chamber: "Senate",
        session_type: "floor_speech",
        member: "Sen. Elizabeth Warren (D-MA)",
        committee: "Banking Committee",
        content: "We need stronger oversight of cryptocurrency markets to protect American consumers. The current regulatory framework is insufficient to address the risks posed by digital assets.",
        topic: "Cryptocurrency Regulation",
        importance: "high",
        duration: "15 minutes",
        video_url: "https://example.com/video/1"
      },
      {
        id: 2,
        date: "2024-02-01",
        chamber: "House",
        session_type: "committee_hearing",
        member: "Rep. Kevin McCarthy (R-CA)",
        committee: "House Rules",
        content: "This amendment process needs to be transparent and allow for proper debate. We must ensure that all members have the opportunity to participate in the legislative process.",
        topic: "Legislative Process",
        importance: "medium",
        duration: "8 minutes",
        video_url: "https://example.com/video/2"
      },
      {
        id: 3,
        date: "2024-01-31",
        chamber: "Senate",
        session_type: "floor_speech",
        member: "Sen. Ted Cruz (R-TX)",
        committee: "Judiciary Committee",
        content: "The First Amendment protections must extend to digital platforms. We cannot allow big tech companies to censor political speech and control the flow of information.",
        topic: "First Amendment Rights",
        importance: "high",
        duration: "12 minutes",
        video_url: "https://example.com/video/3"
      },
      {
        id: 4,
        date: "2024-01-31",
        chamber: "House",
        session_type: "committee_hearing",
        member: "Rep. Alexandria Ocasio-Cortez (D-NY)",
        committee: "Oversight and Reform",
        content: "Climate change is the existential threat of our time. We must take bold action to transition to a clean energy economy and create millions of good-paying jobs.",
        topic: "Climate Change",
        importance: "high",
        duration: "10 minutes",
        video_url: "https://example.com/video/4"
      },
      {
        id: 5,
        date: "2024-01-30",
        chamber: "Senate",
        session_type: "floor_speech",
        member: "Sen. Mitch McConnell (R-KY)",
        committee: "Leadership",
        content: "The American people deserve a government that works for them, not against them. We must focus on policies that create jobs and grow our economy.",
        topic: "Economic Policy",
        importance: "medium",
        duration: "6 minutes",
        video_url: "https://example.com/video/5"
      },
      {
        id: 6,
        date: "2024-01-30",
        chamber: "House",
        session_type: "committee_hearing",
        member: "Rep. Jim Jordan (R-OH)",
        committee: "Judiciary Committee",
        content: "We need to hold big tech accountable for their actions. These companies have too much power and are not being transparent with the American people.",
        topic: "Tech Regulation",
        importance: "medium",
        duration: "9 minutes",
        video_url: "https://example.com/video/6"
      },
      {
        id: 7,
        date: "2024-01-29",
        chamber: "Senate",
        session_type: "floor_speech",
        member: "Sen. Chuck Schumer (D-NY)",
        committee: "Leadership",
        content: "Healthcare is a right, not a privilege. We must expand access to affordable healthcare for all Americans and lower prescription drug costs.",
        topic: "Healthcare",
        importance: "high",
        duration: "11 minutes",
        video_url: "https://example.com/video/7"
      },
      {
        id: 8,
        date: "2024-01-29",
        chamber: "House",
        session_type: "committee_hearing",
        member: "Rep. Nancy Pelosi (D-CA)",
        committee: "Leadership",
        content: "Our democracy is under attack. We must protect the right to vote and ensure that every American's voice is heard in our elections.",
        topic: "Voting Rights",
        importance: "high",
        duration: "7 minutes",
        video_url: "https://example.com/video/8"
      }
    ];
  }

  static async get(id) {
    const records = await this.list();
    const record = records.find(r => r.id === parseInt(id));
    if (!record) {
      throw new Error('Congressional record not found');
    }
    return record;
  }
} 