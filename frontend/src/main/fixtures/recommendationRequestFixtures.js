const recommendationRequestFixtures = {
  oneRecommendationRequest: {
    id: 1,
    requesterEmail: "student@ucsb.edu",
    professorEmail: "professor@ucsb.edu",
    explanation:
      "I am applying for a summer internship and need a recommendation letter.",
    dateRequested: "2026-05-05T14:00:00",
    dateNeeded: "2026-06-01T17:00:00",
    done: false,
  },
  threeRecommendationRequests: [
    {
      id: 1,
      requesterEmail: "student1@ucsb.edu",
      professorEmail: "professor1@ucsb.edu",
      explanation: "I am applying for graduate school.",
      dateRequested: "2026-05-01T09:00:00",
      dateNeeded: "2026-06-01T17:00:00",
      done: false,
    },
    {
      id: 2,
      requesterEmail: "student2@ucsb.edu",
      professorEmail: "professor2@ucsb.edu",
      explanation: "I need a letter for a scholarship application.",
      dateRequested: "2026-05-02T10:30:00",
      dateNeeded: "2026-05-20T23:59:00",
      done: true,
    },
    {
      id: 3,
      requesterEmail: "student3@ucsb.edu",
      professorEmail: "professor3@ucsb.edu",
      explanation: "I am requesting a recommendation for a research position.",
      dateRequested: "2026-05-03T13:15:00",
      dateNeeded: "2026-06-15T12:00:00",
      done: false,
    },
  ],
};

export { recommendationRequestFixtures };
