import { recommendationRequestFixtures } from "main/fixtures/recommendationRequestFixtures";

describe("recommendationRequestFixtures", () => {
  test("has oneRecommendationRequest", () => {
    expect(recommendationRequestFixtures.oneRecommendationRequest).toEqual({
      id: 1,
      requesterEmail: "student@ucsb.edu",
      professorEmail: "professor@ucsb.edu",
      explanation:
        "I am applying for a summer internship and need a recommendation letter.",
      dateRequested: "2026-05-05T14:00:00",
      dateNeeded: "2026-06-01T17:00:00",
      done: false,
    });
  });

  test("has threeRecommendationRequests", () => {
    expect(recommendationRequestFixtures.threeRecommendationRequests.length).toBe(3);
  });
});