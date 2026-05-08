import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ArticleCreatePage from "main/pages/Article/ArticleCreatePage";
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

describe("ArticleCreatePage tests", () => {
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
          <ArticleCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /articles", async () => {
    const queryClient = new QueryClient();
    const article = {
      id: 1,
      title: "Term in Review: A.S. EVPSA Leiya Kadah",
      url: "https://dailynexus.com/2026-05-01/term-in-review-evpsa-leiya-kadah/",
      explanation: "Leiya Kadah reflected on her term",
      email: "wilsonzlee@ucsb.edu",
      dateAdded: "2026-05-01T12:00",
    };

    axiosMock.onPost("/api/articles/post").reply(202, article);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticleCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText("Title");
    expect(titleInput).toBeInTheDocument();

    const urlInput = screen.getByLabelText("Url");
    expect(urlInput).toBeInTheDocument();

    const explanationInput = screen.getByLabelText("Explanation");
    expect(explanationInput).toBeInTheDocument();

    const emailInput = screen.getByLabelText("Email");
    expect(emailInput).toBeInTheDocument();

    const dateAddedInput = screen.getByLabelText("Date Added (iso format)");
    expect(dateAddedInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(titleInput, {
      target: { value: "Term in Review: A.S. EVPSA Leiya Kadah" },
    });
    fireEvent.change(urlInput, {
      target: {
        value:
          "https://dailynexus.com/2026-05-01/term-in-review-evpsa-leiya-kadah/",
      },
    });
    fireEvent.change(explanationInput, {
      target: { value: "Leiya Kadah reflected on her term" },
    });
    fireEvent.change(emailInput, { target: { value: "wilsonzlee@ucsb.edu" } });
    fireEvent.change(dateAddedInput, { target: { value: "2026-05-01T12:00" } });

    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      title: "Term in Review: A.S. EVPSA Leiya Kadah",
      url: "https://dailynexus.com/2026-05-01/term-in-review-evpsa-leiya-kadah/",
      explanation: "Leiya Kadah reflected on her term",
      email: "wilsonzlee@ucsb.edu",
      dateAdded: "2026-05-01T12:00",
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toBeCalledWith(
      "New article Created - id: 1 title: Term in Review: A.S. EVPSA Leiya Kadah",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/articles" });
  });
});
