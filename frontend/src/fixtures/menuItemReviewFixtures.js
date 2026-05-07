const menuItemReviewFixtures = {
  oneMenuItemReview: {
    id: 1,
    itemId: 6,
    reviewerEmail: "anishjaiswal@ucsb.edu",
    stars: 3,
    dateReviewed: "2026-03-10T10:10:10",
    comments: "it was good",
  },
  threeMenuItemReviews: [
    {
      id: 1,
      itemId: 6,
      reviewerEmail: "anishjaiswal@ucsb.edu",
      stars: 3,
      dateReviewed: "2026-03-10T10:10:10",
      comments: "it was good",
    },
    {
      id: 2,
      itemId: 7,
      reviewerEmail: "aj@ucsb.edu",
      stars: 3,
      dateReviewed: "2026-04-10T10:10:10",
      comments: "it was good",
    },
    {
      id: 3,
      itemId: 2,
      reviewerEmail: "temp@ucsb.edu",
      stars: 3,
      dateReviewed: "2025-03-10T10:10:10",
      comments: "it was ok",
    },
  ],
};

export { menuItemReviewFixtures };
