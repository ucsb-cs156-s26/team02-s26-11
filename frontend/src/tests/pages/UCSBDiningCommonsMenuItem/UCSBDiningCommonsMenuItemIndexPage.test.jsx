import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import UCSBDiningCommonsMenuItemIndexPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemIndexPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import mockConsole from "tests/testutils/mockConsole";
import { ucsbDiningCommonsMenuItemFixtures } from "main/fixtures/ucsbDiningCommonsMenuItemFixtures";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

describe("UCSBDiningCommonsMenuItemIndexPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const testId = "UCSBDiningCommonsMenuItemTable";

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

  const renderPage = () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  test("Renders with Create Button for admin user", async () => {
    setupAdminUser();
    axiosMock.onGet("/api/UCSBDiningCommonsMenuItem/all").reply(200, []);

    renderPage();

    await waitFor(() => {
      expect(
        screen.getByText(/Create UCSBDiningCommonsMenuItem/),
      ).toBeInTheDocument();
    });
    const button = screen.getByText(/Create UCSBDiningCommonsMenuItem/);
    expect(button).toHaveAttribute("href", "/diningcommonsmenuitem/create");
    expect(button).toHaveAttribute("style", "float: right;");
  });

  test("renders three menu items correctly for regular user", async () => {
    setupUserOnly();
    axiosMock
      .onGet("/api/UCSBDiningCommonsMenuItem/all")
      .reply(
        200,
        ucsbDiningCommonsMenuItemFixtures.threeUCSBDiningCommonsMenuItems,
      );

    renderPage();

    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-id`),
      ).toHaveTextContent("1");
    });
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "2",
    );
    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent(
      "3",
    );

    expect(
      screen.queryByText(/Create UCSBDiningCommonsMenuItem/),
    ).not.toBeInTheDocument();

    expect(screen.getByText("Spaghetti")).toBeInTheDocument();
    expect(screen.getByText("Chicken Tacos")).toBeInTheDocument();
    expect(screen.getByText("Caesar Salad")).toBeInTheDocument();
    expect(screen.getByText("dlg")).toBeInTheDocument();
    expect(screen.getByText("ortega")).toBeInTheDocument();
    expect(screen.getByText("carrillo")).toBeInTheDocument();
    expect(screen.getByText("Entree")).toBeInTheDocument();
    expect(screen.getByText("Grill")).toBeInTheDocument();
    expect(screen.getByText("Salad Bar")).toBeInTheDocument();

    expect(
      screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(`${testId}-cell-row-0-col-Edit-button`),
    ).not.toBeInTheDocument();
  });

  test("renders empty table when backend unavailable, user only", async () => {
    setupUserOnly();
    axiosMock.onGet("/api/UCSBDiningCommonsMenuItem/all").timeout();
    const restoreConsole = mockConsole();

    renderPage();

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    const errorMessage = console.error.mock.calls[0][0];
    expect(errorMessage).toMatch(
      "Error communicating with backend via GET on /api/UCSBDiningCommonsMenuItem/all",
    );
    restoreConsole();

    expect(
      screen.queryByTestId(`${testId}-cell-row-0-col-id`),
    ).not.toBeInTheDocument();
  });

  test("what happens when you click delete, admin", async () => {
    setupAdminUser();
    axiosMock
      .onGet("/api/UCSBDiningCommonsMenuItem/all")
      .replyOnce(
        200,
        ucsbDiningCommonsMenuItemFixtures.threeUCSBDiningCommonsMenuItems,
      );
    axiosMock
      .onGet("/api/UCSBDiningCommonsMenuItem/all")
      .reply(200, [
        ucsbDiningCommonsMenuItemFixtures.threeUCSBDiningCommonsMenuItems[1],
        ucsbDiningCommonsMenuItemFixtures.threeUCSBDiningCommonsMenuItems[2],
      ]);
    axiosMock
      .onDelete("/api/UCSBDiningCommonsMenuItem")
      .reply(200, { message: "UCSBDiningCommonsMenuItem with id 1 deleted" });
    const restoreConsole = mockConsole();

    renderPage();

    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-id`),
      ).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "1",
    );

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(axiosMock.history.delete.length).toBe(1);
    });
    expect(axiosMock.history.delete[0].url).toBe(
      "/api/UCSBDiningCommonsMenuItem",
    );
    expect(axiosMock.history.delete[0].params).toEqual({ id: 1 });
    expect(console.log).toHaveBeenCalledWith({
      message: "UCSBDiningCommonsMenuItem with id 1 deleted",
    });
    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-id`),
      ).toHaveTextContent("2");
    });
    expect(screen.queryByText("Spaghetti")).not.toBeInTheDocument();
    restoreConsole();
  });
});
