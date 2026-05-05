const helpRequestFixtures = {
  oneHelpRequest: 
    {
      id: 1,
      requesterEmail: "student@ucsb.edu",
      teamId: "Team 13",
      tableOrBreakoutRoom: "Table 1",
      requestTime: "2025-02-19T15:09:42.15",
      explanation: "Need General Assistance",
      solved: true
    },
  threeHelpRequests: [
    {
      id: 2,
      requesterEmail: "george@ucsb.edu",
      teamId: "Team 3",
      tableOrBreakoutRoom: "Table 3",
      requestTime: "2026-05-26T15:09:48.20",
      explanation: "commits are not working properly",
      solved: false
    },
    {
      id: 3,
      requesterEmail: "brian@ucsb.edu",
      teamId: "Team 14",
      tableOrBreakoutRoom: "Breakout Room 14",
      requestTime: "2025-03-21T15:09:48.32",
      explanation: "Missing SSH Key requests",
      solved: true
    },    
    {
      id: 4,
      requesterEmail: "beca@ucsb.edu",
      teamId: "Team 11",
      tableOrBreakoutRoom: "Table 11",
      requestTime: "2025-01-29T15:10:19.20",
      explanation: "Error with compilation",
      solved: false
    },
  ],
};

export { helpRequestFixtures };