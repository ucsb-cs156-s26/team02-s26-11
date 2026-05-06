import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecommendationRequestIndexPage from "main/pages/RecommendationRequest/RecommendationRequestIndexPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { recommendationRequestFixtures } from "main/fixtures/recommendationRequestFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("RecommendationRequestIndexPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const setupAdminUser = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  test("Renders with Create Button for admin user", async () => {
    setupAdminUser();
    axiosMock
      .onGet("/api/recommendationrequests/all")
      .reply(200, recommendationRequestFixtures.threeRecommendationRequests);

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByText("student1@ucsb.edu");

    const button = screen.getByText(/Create RecommendationRequest/);
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "/recommendationrequest/create");
  });

  test("renders three recommendation requests correctly for regular user", async () => {
    setupUserOnly();
    axiosMock
      .onGet("/api/recommendationrequests/all")
      .reply(200, recommendationRequestFixtures.threeRecommendationRequests);

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByText("student1@ucsb.edu");

    expect(screen.getByText("professor1@ucsb.edu")).toBeInTheDocument();
    expect(screen.getByText("student2@ucsb.edu")).toBeInTheDocument();
    expect(screen.getByText("student3@ucsb.edu")).toBeInTheDocument();

    expect(
      screen.queryByText("Create RecommendationRequest"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });

  test("renders empty table when backend unavailable, user only", async () => {
    setupUserOnly();
    axiosMock.onGet("/api/recommendationrequests/all").timeout();

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByText("RecommendationRequests");

    expect(
      screen.queryByTestId("RecommendationRequestTable-cell-row-0-col-id"),
    ).not.toBeInTheDocument();
  });

  test("what happens when you click edit, admin", async () => {
    setupAdminUser();
    axiosMock
      .onGet("/api/recommendationrequests/all")
      .reply(200, recommendationRequestFixtures.threeRecommendationRequests);

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByText("student1@ucsb.edu");

    const editButton = screen.getByTestId(
      "RecommendationRequestTable-cell-row-0-col-Edit-button",
    );
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith(
        "/recommendationrequest/edit/1",
      );
    });
  });

  test("what happens when you click delete, admin", async () => {
    setupAdminUser();
    axiosMock
      .onGet("/api/recommendationrequests/all")
      .reply(200, recommendationRequestFixtures.threeRecommendationRequests);
    axiosMock
      .onDelete("/api/recommendationrequests")
      .reply(200, { message: "RecommendationRequest with id 1 deleted" });

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByText("student1@ucsb.edu");

    const deleteButton = screen.getByTestId(
      "RecommendationRequestTable-cell-row-0-col-Delete-button",
    );
    fireEvent.click(deleteButton);

    await waitFor(() => expect(axiosMock.history.delete.length).toBe(1));
    expect(axiosMock.history.delete[0].params).toEqual({ id: 1 });
  });
});
