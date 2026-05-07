import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import ArticleEditPage from "main/pages/Article/ArticleEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "tests/testutils/mockConsole";

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
    useParams: vi.fn(() => ({
      id: 17,
    })),
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

let axiosMock;
describe("ArticleEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/articles", { params: { id: 17 } }).timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticleEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Article");
      expect(screen.queryByTestId("Article-title")).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/articles", { params: { id: 17 } }).reply(200, {
        id: 17,
        title: "Term in Review: A.S. EVPSA Leiya Kadah",
        url: "https://dailynexus.com/2026-05-01/term-in-review-evpsa-leiya-kadah/",
        explanation: "Leiya Kadah reflected on her term",
        email: "wilsonzlee@ucsb.edu",
        dateAdded: "2026-05-01T12:00",
      });
      axiosMock.onPut("/api/articles").reply(200, {
        id: "17",
        title: "Exploring ENGL 106CW, the Catalyst",
        url: "https://dailynexus.com/2026-05-01/exploring-engl-106cw-the-catalyst/",
        explanation: "The Catalyst is a contemporary literary arts magazine",
        email: "maliaguy@ucsb.edu",
        dateAdded: "2026-05-01T13:00",
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided, and changes when changed", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticleEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("ArticleForm-id");

      const idField = screen.getByTestId("ArticleForm-id");
      const titleField = screen.getByTestId("ArticleForm-title");
      const urlField = screen.getByLabelText("Url");
      const explanationField = screen.getByLabelText("Explanation");
      const emailField = screen.getByLabelText("Email");
      const dateAddedField = screen.getByLabelText("Date Added (iso format)");
      const submitButton = screen.getByText("Update");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");

      expect(titleField).toBeInTheDocument();
      expect(titleField).toHaveValue("Term in Review: A.S. EVPSA Leiya Kadah");

      expect(urlField).toBeInTheDocument();
      expect(urlField).toHaveValue(
        "https://dailynexus.com/2026-05-01/term-in-review-evpsa-leiya-kadah/",
      );

      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("Leiya Kadah reflected on her term");

      expect(emailField).toBeInTheDocument();
      expect(emailField).toHaveValue("wilsonzlee@ucsb.edu");

      expect(dateAddedField).toBeInTheDocument();
      expect(dateAddedField).toHaveValue("2026-05-01T12:00");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(titleField, {
        target: { value: "Exploring ENGL 106CW, the Catalyst" },
      });
      fireEvent.change(urlField, {
        target: {
          value:
            "https://dailynexus.com/2026-05-01/exploring-engl-106cw-the-catalyst/",
        },
      });
      fireEvent.change(explanationField, {
        target: {
          value: "The Catalyst is a contemporary literary arts magazine",
        },
      });
      fireEvent.change(emailField, {
        target: { value: "maliaguy@ucsb.edu" },
      });
      fireEvent.change(dateAddedField, {
        target: { value: "2026-05-01T13:00" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Article Updated - id: 17 title: Exploring ENGL 106CW, the Catalyst",
      );

      expect(mockNavigate).toBeCalledWith({ to: "/articles" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          title: "Exploring ENGL 106CW, the Catalyst",
          url: "https://dailynexus.com/2026-05-01/exploring-engl-106cw-the-catalyst/",
          explanation: "The Catalyst is a contemporary literary arts magazine",
          email: "maliaguy@ucsb.edu",
          dateAdded: "2026-05-01T13:00",
        }),
      ); // posted object
      expect(mockNavigate).toBeCalledWith({ to: "/articles" });
    });
  });
});
