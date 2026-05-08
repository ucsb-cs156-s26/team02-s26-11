import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { recommendationRequestFixtures } from "main/fixtures/recommendationRequestFixtures";

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

describe("RecommendationRequestEditPage tests", () => {
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

  test("renders header but form is not present when backend unavailable", async () => {
    const queryClient = new QueryClient();

    axiosMock
      .onGet("/api/recommendationrequest", { params: { id: "1" } })
      .timeout();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/recommendationrequest/edit/1"]}>
          <Routes>
            <Route
              path="/recommendationrequest/edit/:id"
              element={<RecommendationRequestEditPage />}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByText("Edit RecommendationRequest");

    expect(
      screen.queryByTestId("RecommendationRequestForm-requesterEmail"),
    ).not.toBeInTheDocument();
  });

  test("Is populated with the data provided", async () => {
    const queryClient = new QueryClient();

    axiosMock
      .onGet("/api/recommendationrequest", { params: { id: "1" } })
      .reply(200, recommendationRequestFixtures.oneRecommendationRequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/recommendationrequest/edit/1"]}>
          <Routes>
            <Route
              path="/recommendationrequest/edit/:id"
              element={<RecommendationRequestEditPage />}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByTestId("RecommendationRequestForm-id");

    expect(screen.getByText("Edit RecommendationRequest")).toBeInTheDocument();
    expect(screen.getByTestId("RecommendationRequestForm-id")).toHaveValue("1");
    expect(
      screen.getByTestId("RecommendationRequestForm-requesterEmail"),
    ).toHaveValue("student@ucsb.edu");
    expect(
      screen.getByTestId("RecommendationRequestForm-professorEmail"),
    ).toHaveValue("professor@ucsb.edu");
    expect(
      screen.getByTestId("RecommendationRequestForm-explanation"),
    ).toHaveValue(
      "I am applying for a summer internship and need a recommendation letter.",
    );
    expect(
      screen.getByTestId("RecommendationRequestForm-dateRequested"),
    ).toHaveValue("2026-05-05T14:00");
    expect(
      screen.getByTestId("RecommendationRequestForm-dateNeeded"),
    ).toHaveValue("2026-06-01T17:00");
    expect(
      screen.getByTestId("RecommendationRequestForm-done"),
    ).not.toBeChecked();
  });

  test("Changes when you click Update", async () => {
    const queryClient = new QueryClient();

    axiosMock
      .onGet("/api/recommendationrequest", { params: { id: "1" } })
      .reply(200, recommendationRequestFixtures.oneRecommendationRequest);

    const updatedRecommendationRequest = {
      id: 1,
      requesterEmail: "updatedstudent@ucsb.edu",
      professorEmail: "updatedprofessor@ucsb.edu",
      explanation: "Updated explanation for a recommendation request.",
      dateRequested: "2026-05-11T09:30",
      dateNeeded: "2026-06-11T17:30",
      done: true,
    };

    axiosMock
      .onPut("/api/recommendationrequest")
      .reply(200, updatedRecommendationRequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/recommendationrequest/edit/1"]}>
          <Routes>
            <Route
              path="/recommendationrequest/edit/:id"
              element={<RecommendationRequestEditPage />}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByTestId("RecommendationRequestForm-id");

    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-requesterEmail"),
      {
        target: { value: "updatedstudent@ucsb.edu" },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-professorEmail"),
      {
        target: { value: "updatedprofessor@ucsb.edu" },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-explanation"),
      {
        target: { value: "Updated explanation for a recommendation request." },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-dateRequested"),
      {
        target: { value: "2026-05-11T09:30" },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-dateNeeded"),
      {
        target: { value: "2026-06-11T17:30" },
      },
    );
    fireEvent.click(screen.getByTestId("RecommendationRequestForm-done"));

    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => expect(axiosMock.history.put.length).toBe(1));

    expect(axiosMock.history.put[0].params).toEqual({ id: "1" });
    expect(JSON.parse(axiosMock.history.put[0].data)).toEqual({
      requesterEmail: "updatedstudent@ucsb.edu",
      professorEmail: "updatedprofessor@ucsb.edu",
      explanation: "Updated explanation for a recommendation request.",
      dateRequested: "2026-05-11T09:30",
      dateNeeded: "2026-06-11T17:30",
      done: true,
    });

    expect(mockToast).toBeCalledWith(
      "RecommendationRequest Updated - id: 1 requesterEmail: updatedstudent@ucsb.edu",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/recommendationrequest" });
  });

  test("validation errors prevent backend request", async () => {
    const queryClient = new QueryClient();

    axiosMock
      .onGet("/api/recommendationrequest", { params: { id: "1" } })
      .reply(200, recommendationRequestFixtures.oneRecommendationRequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/recommendationrequest/edit/1"]}>
          <Routes>
            <Route
              path="/recommendationrequest/edit/:id"
              element={<RecommendationRequestEditPage />}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByTestId("RecommendationRequestForm-id");

    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-requesterEmail"),
      {
        target: { value: "" },
      },
    );

    fireEvent.click(screen.getByText("Update"));

    await screen.findByText(/Requester Email is required/);

    expect(axiosMock.history.put.length).toBe(0);
  });
});
