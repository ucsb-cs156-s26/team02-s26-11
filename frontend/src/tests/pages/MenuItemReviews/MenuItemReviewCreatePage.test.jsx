import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReviews/MenuItemReviewCreatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = vi.fn();
vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast(x)),
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

describe("MenuItemReviewCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    vi.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("MenuItemReviewForm-itemId"),
      ).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /menuitemreviews", async () => {
    const queryClient = new QueryClient();
    const menuItemReview = {
      id: 3,
      itemId: 1,
      reviewerEmail: "test@example.com",
      stars: 5,
      dateReviewed: "2023-01-01T00:00:00",
      comments: "Great menu item!",
    };

    axiosMock.onPost("/api/menuitemreviews/post").reply(202, menuItemReview);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("MenuItemReviewForm-itemId"),
      ).toBeInTheDocument();
    });

    const itemIdInput = screen.getByTestId("MenuItemReviewForm-itemId");
    expect(itemIdInput).toBeInTheDocument();

    const reviewerEmailInput = screen.getByTestId(
      "MenuItemReviewForm-reviewerEmail",
    );
    expect(reviewerEmailInput).toBeInTheDocument();

    const starsInput = screen.getByTestId("MenuItemReviewForm-stars");
    expect(starsInput).toBeInTheDocument();

    const dateReviewedInput = screen.getByTestId(
      "MenuItemReviewForm-dateReviewed",
    );
    expect(dateReviewedInput).toBeInTheDocument();

    const commentsInput = screen.getByTestId("MenuItemReviewForm-comments");
    expect(commentsInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(itemIdInput, { target: { value: 1 } });
    fireEvent.change(reviewerEmailInput, {
      target: { value: "test@example.com" },
    });
    fireEvent.change(starsInput, { target: { value: 5 } });
    fireEvent.change(dateReviewedInput, {
      target: { value: "2023-01-01T00:00:00" },
    });
    fireEvent.change(commentsInput, { target: { value: "Great menu item!" } });
    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      itemId: "1",
      reviewerEmail: "test@example.com",
      stars: "5",
      dateReviewed: "2023-01-01T00:00",
      comments: "Great menu item!",
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toBeCalledWith(
      "New menu item review Created - id: 3 itemId: 1",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/menuitemreviews" });
  });
});
