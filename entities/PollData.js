// TODO: This file uses mock data. Replace with real API integration.
// Mock PollData entity for now - replace with actual API calls
export class PollData {
  static async list(sortBy = '-date_conducted', limit = 100) {
    // Mock data - replace with actual API call
    return [
      {
        id: 1,
        poll_name: "2024 Presidential Election Poll",
        pollster: "Gallup",
        poll_type: "presidential",
        date_conducted: "2024-01-15",
        sample_size: 1200,
        margin_of_error: 3.2,
        reliability_score: 8.5,
        likely_voters: true,
        state: null, // National poll
        results: [
          { candidate: "Joe Biden", party: "Democrat", percentage: 42 },
          { candidate: "Donald Trump", party: "Republican", percentage: 38 },
          { candidate: "Robert F. Kennedy Jr.", party: "Independent", percentage: 8 },
          { candidate: "Other/Undecided", party: "Other", percentage: 12 }
        ]
      },
      {
        id: 2,
        poll_name: "California Presidential Poll",
        pollster: "Field Poll",
        poll_type: "presidential",
        date_conducted: "2024-01-14",
        sample_size: 800,
        margin_of_error: 3.8,
        reliability_score: 7.8,
        likely_voters: true,
        state: "CA",
        results: [
          { candidate: "Joe Biden", party: "Democrat", percentage: 48 },
          { candidate: "Donald Trump", party: "Republican", percentage: 32 },
          { candidate: "Robert F. Kennedy Jr.", party: "Independent", percentage: 6 },
          { candidate: "Other/Undecided", party: "Other", percentage: 14 }
        ]
      },
      {
        id: 3,
        poll_name: "Texas Presidential Poll",
        pollster: "Texas Tribune",
        poll_type: "presidential",
        date_conducted: "2024-01-13",
        sample_size: 1000,
        margin_of_error: 3.1,
        reliability_score: 8.2,
        likely_voters: true,
        state: "TX",
        results: [
          { candidate: "Donald Trump", party: "Republican", percentage: 45 },
          { candidate: "Joe Biden", party: "Democrat", percentage: 41 },
          { candidate: "Robert F. Kennedy Jr.", party: "Independent", percentage: 7 },
          { candidate: "Other/Undecided", party: "Other", percentage: 7 }
        ]
      },
      {
        id: 4,
        poll_name: "Generic Congressional Ballot",
        pollster: "Quinnipiac",
        poll_type: "generic_ballot",
        date_conducted: "2024-01-12",
        sample_size: 1500,
        margin_of_error: 2.5,
        reliability_score: 8.8,
        likely_voters: true,
        state: null, // National poll
        results: [
          { candidate: "Democratic Candidate", party: "Democrat", percentage: 44 },
          { candidate: "Republican Candidate", party: "Republican", percentage: 42 },
          { candidate: "Other/Undecided", party: "Other", percentage: 14 }
        ]
      },
      {
        id: 5,
        poll_name: "Florida Presidential Poll",
        pollster: "Mason-Dixon",
        poll_type: "presidential",
        date_conducted: "2024-01-11",
        sample_size: 900,
        margin_of_error: 3.3,
        reliability_score: 8.0,
        likely_voters: true,
        state: "FL",
        results: [
          { candidate: "Donald Trump", party: "Republican", percentage: 47 },
          { candidate: "Joe Biden", party: "Democrat", percentage: 43 },
          { candidate: "Robert F. Kennedy Jr.", party: "Independent", percentage: 5 },
          { candidate: "Other/Undecided", party: "Other", percentage: 5 }
        ]
      },
      {
        id: 6,
        poll_name: "New York Presidential Poll",
        pollster: "Siena College",
        poll_type: "presidential",
        date_conducted: "2024-01-10",
        sample_size: 700,
        margin_of_error: 3.7,
        reliability_score: 7.5,
        likely_voters: true,
        state: "NY",
        results: [
          { candidate: "Joe Biden", party: "Democrat", percentage: 52 },
          { candidate: "Donald Trump", party: "Republican", percentage: 35 },
          { candidate: "Robert F. Kennedy Jr.", party: "Independent", percentage: 8 },
          { candidate: "Other/Undecided", party: "Other", percentage: 5 }
        ]
      },
      {
        id: 7,
        poll_name: "Pennsylvania Presidential Poll",
        pollster: "Franklin & Marshall",
        poll_type: "presidential",
        date_conducted: "2024-01-09",
        sample_size: 850,
        margin_of_error: 3.4,
        reliability_score: 8.1,
        likely_voters: true,
        state: "PA",
        results: [
          { candidate: "Joe Biden", party: "Democrat", percentage: 45 },
          { candidate: "Donald Trump", party: "Republican", percentage: 44 },
          { candidate: "Robert F. Kennedy Jr.", party: "Independent", percentage: 6 },
          { candidate: "Other/Undecided", party: "Other", percentage: 5 }
        ]
      },
      {
        id: 8,
        poll_name: "Ohio Presidential Poll",
        pollster: "Baldwin Wallace",
        poll_type: "presidential",
        date_conducted: "2024-01-08",
        sample_size: 950,
        margin_of_error: 3.2,
        reliability_score: 7.9,
        likely_voters: true,
        state: "OH",
        results: [
          { candidate: "Donald Trump", party: "Republican", percentage: 46 },
          { candidate: "Joe Biden", party: "Democrat", percentage: 42 },
          { candidate: "Robert F. Kennedy Jr.", party: "Independent", percentage: 7 },
          { candidate: "Other/Undecided", party: "Other", percentage: 5 }
        ]
      },
      {
        id: 9,
        poll_name: "Michigan Presidential Poll",
        pollster: "EPIC-MRA",
        poll_type: "presidential",
        date_conducted: "2024-01-07",
        sample_size: 800,
        margin_of_error: 3.5,
        reliability_score: 8.3,
        likely_voters: true,
        state: "MI",
        results: [
          { candidate: "Joe Biden", party: "Democrat", percentage: 44 },
          { candidate: "Donald Trump", party: "Republican", percentage: 43 },
          { candidate: "Robert F. Kennedy Jr.", party: "Independent", percentage: 8 },
          { candidate: "Other/Undecided", party: "Other", percentage: 5 }
        ]
      },
      {
        id: 10,
        poll_name: "Wisconsin Presidential Poll",
        pollster: "Marquette Law School",
        poll_type: "presidential",
        date_conducted: "2024-01-06",
        sample_size: 1000,
        margin_of_error: 3.1,
        reliability_score: 8.6,
        likely_voters: true,
        state: "WI",
        results: [
          { candidate: "Joe Biden", party: "Democrat", percentage: 45 },
          { candidate: "Donald Trump", party: "Republican", percentage: 44 },
          { candidate: "Robert F. Kennedy Jr.", party: "Independent", percentage: 6 },
          { candidate: "Other/Undecided", party: "Other", percentage: 5 }
        ]
      },
      {
        id: 11,
        poll_name: "Arizona Presidential Poll",
        pollster: "OH Predictive Insights",
        poll_type: "presidential",
        date_conducted: "2024-01-05",
        sample_size: 750,
        margin_of_error: 3.6,
        reliability_score: 7.7,
        likely_voters: true,
        state: "AZ",
        results: [
          { candidate: "Joe Biden", party: "Democrat", percentage: 43 },
          { candidate: "Donald Trump", party: "Republican", percentage: 45 },
          { candidate: "Robert F. Kennedy Jr.", party: "Independent", percentage: 7 },
          { candidate: "Other/Undecided", party: "Other", percentage: 5 }
        ]
      },
      {
        id: 12,
        poll_name: "Georgia Presidential Poll",
        pollster: "Landmark Communications",
        poll_type: "presidential",
        date_conducted: "2024-01-04",
        sample_size: 900,
        margin_of_error: 3.3,
        reliability_score: 8.0,
        likely_voters: true,
        state: "GA",
        results: [
          { candidate: "Donald Trump", party: "Republican", percentage: 46 },
          { candidate: "Joe Biden", party: "Democrat", percentage: 44 },
          { candidate: "Robert F. Kennedy Jr.", party: "Independent", percentage: 6 },
          { candidate: "Other/Undecided", party: "Other", percentage: 4 }
        ]
      },
      {
        id: 13,
        poll_name: "Nevada Presidential Poll",
        pollster: "Nevada Independent",
        poll_type: "presidential",
        date_conducted: "2024-01-03",
        sample_size: 650,
        margin_of_error: 3.8,
        reliability_score: 7.4,
        likely_voters: true,
        state: "NV",
        results: [
          { candidate: "Joe Biden", party: "Democrat", percentage: 44 },
          { candidate: "Donald Trump", party: "Republican", percentage: 45 },
          { candidate: "Robert F. Kennedy Jr.", party: "Independent", percentage: 6 },
          { candidate: "Other/Undecided", party: "Other", percentage: 5 }
        ]
      },
      {
        id: 14,
        poll_name: "North Carolina Presidential Poll",
        pollster: "High Point University",
        poll_type: "presidential",
        date_conducted: "2024-01-02",
        sample_size: 850,
        margin_of_error: 3.4,
        reliability_score: 8.2,
        likely_voters: true,
        state: "NC",
        results: [
          { candidate: "Donald Trump", party: "Republican", percentage: 47 },
          { candidate: "Joe Biden", party: "Democrat", percentage: 43 },
          { candidate: "Robert F. Kennedy Jr.", party: "Independent", percentage: 6 },
          { candidate: "Other/Undecided", party: "Other", percentage: 4 }
        ]
      },
      {
        id: 15,
        poll_name: "Iowa Presidential Poll",
        pollster: "Des Moines Register",
        poll_type: "presidential",
        date_conducted: "2024-01-01",
        sample_size: 800,
        margin_of_error: 3.5,
        reliability_score: 8.4,
        likely_voters: true,
        state: "IA",
        results: [
          { candidate: "Donald Trump", party: "Republican", percentage: 48 },
          { candidate: "Joe Biden", party: "Democrat", percentage: 41 },
          { candidate: "Robert F. Kennedy Jr.", party: "Independent", percentage: 7 },
          { candidate: "Other/Undecided", party: "Other", percentage: 4 }
        ]
      }
    ];
  }

  static async get(id) {
    const polls = await this.list();
    const poll = polls.find(p => p.id === parseInt(id));
    if (!poll) {
      throw new Error('Poll not found');
    }
    return poll;
  }
} 