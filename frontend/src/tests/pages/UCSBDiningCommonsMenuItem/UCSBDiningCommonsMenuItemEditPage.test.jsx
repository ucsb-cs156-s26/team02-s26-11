import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import UCSBDiningCommonsMenuItemEditPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage";

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
describe("UCSBDiningCommonsMenuItemEditPage tests", () => {
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
      axiosMock
        .onGet("/api/UCSBDiningCommonsMenuItem", { params: { id: 17 } })
        .timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    test("renders header but form is not present", async () => {
      const queryClient = new QueryClient();
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByText("Edit UCSBDiningCommonsMenuItem");
      expect(
        screen.queryByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode"),
      ).not.toBeInTheDocument();
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
      axiosMock
        .onGet("/api/UCSBDiningCommonsMenuItem", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          diningCommonsCode: "dlg",
          name: "Spaghetti",
          station: "Entree",
        });
      axiosMock.onPut("/api/UCSBDiningCommonsMenuItem").reply(200, {
        id: "17",
        diningCommonsCode: "ortega",
        name: "Chicken Tacos",
        station: "Grill",
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const renderPage = () => {
      const queryClient = new QueryClient();
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
    };

    test("renders without crashing", async () => {
      renderPage();

      await screen.findByTestId(
        "UCSBDiningCommonsMenuItemForm-diningCommonsCode",
      );
      expect(
        screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode"),
      ).toBeInTheDocument();
    });

    test("Is populated with the data provided", async () => {
      renderPage();

      await screen.findByTestId(
        "UCSBDiningCommonsMenuItemForm-diningCommonsCode",
      );

      const idField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-id");
      const diningCommonsCodeField = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-diningCommonsCode",
      );
      const nameField = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-name",
      );
      const stationField = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-station",
      );
      const submitButton = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-submit",
      );

      expect(idField).toHaveValue("17");
      expect(diningCommonsCodeField).toHaveValue("dlg");
      expect(nameField).toHaveValue("Spaghetti");
      expect(stationField).toHaveValue("Entree");
      expect(submitButton).toHaveTextContent("Update");
    });

    test("Changes when you click Update", async () => {
      renderPage();

      await screen.findByTestId(
        "UCSBDiningCommonsMenuItemForm-diningCommonsCode",
      );

      const idField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-id");
      const diningCommonsCodeField = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-diningCommonsCode",
      );
      const nameField = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-name",
      );
      const stationField = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-station",
      );
      const submitButton = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-submit",
      );

      expect(idField).toHaveValue("17");
      expect(diningCommonsCodeField).toHaveValue("dlg");
      expect(nameField).toHaveValue("Spaghetti");
      expect(stationField).toHaveValue("Entree");

      fireEvent.change(diningCommonsCodeField, {
        target: { value: "ortega" },
      });
      fireEvent.change(nameField, {
        target: { value: "Chicken Tacos" },
      });
      fireEvent.change(stationField, {
        target: { value: "Grill" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "UCSBDiningCommonsMenuItem Updated - id: 17 name: Chicken Tacos",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/diningcommonsmenuitem" });

      expect(axiosMock.history.put.length).toBe(1);
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          diningCommonsCode: "ortega",
          name: "Chicken Tacos",
          station: "Grill",
        }),
      );
    });

    test("validation errors prevent backend request", async () => {
      renderPage();

      await screen.findByTestId(
        "UCSBDiningCommonsMenuItemForm-diningCommonsCode",
      );

      fireEvent.change(
        screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode"),
        {
          target: { value: "   " },
        },
      );
      fireEvent.change(
        screen.getByTestId("UCSBDiningCommonsMenuItemForm-name"),
        {
          target: { value: "   " },
        },
      );
      fireEvent.change(
        screen.getByTestId("UCSBDiningCommonsMenuItemForm-station"),
        {
          target: { value: "   " },
        },
      );

      fireEvent.click(
        screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit"),
      );

      await screen.findByText("Dining Commons Code cannot be blank.");
      expect(screen.getByText("Name cannot be blank.")).toBeInTheDocument();
      expect(screen.getByText("Station cannot be blank.")).toBeInTheDocument();
      expect(axiosMock.history.put.length).toBe(0);
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
