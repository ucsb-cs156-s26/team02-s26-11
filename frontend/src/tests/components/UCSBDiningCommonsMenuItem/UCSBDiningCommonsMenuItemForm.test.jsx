import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";

import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { ucsbDiningCommonsMenuItemFixtures } from "main/fixtures/ucsbDiningCommonsMenuItemFixtures";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("UCSBDiningCommonsMenuItemForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = ["Dining Commons Code", "Name", "Station"];
  const testId = "UCSBDiningCommonsMenuItemForm";

  const renderForm = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBDiningCommonsMenuItemForm {...props} />
        </Router>
      </QueryClientProvider>,
    );
  };

  test("renders correctly with no initialContents", () => {
    renderForm();

    expect(screen.getByTestId(`${testId}-submit`)).toHaveTextContent("Create");
    expect(screen.getByTestId(`${testId}-cancel`)).toHaveTextContent("Cancel");
    expect(screen.queryByTestId(`${testId}-id`)).not.toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });
  });

  test("renders correctly when passing in initialContents", () => {
    renderForm({
      initialContents:
        ucsbDiningCommonsMenuItemFixtures.oneUCSBDiningCommonsMenuItem,
      buttonLabel: "Update",
    });

    expect(screen.getByTestId(`${testId}-submit`)).toHaveTextContent("Update");
    expect(screen.getByTestId(`${testId}-cancel`)).toHaveTextContent("Cancel");

    expectedHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-id`)).toHaveValue("1");
    expect(screen.getByTestId(`${testId}-id`)).toBeDisabled();
    expect(screen.getByText("Id")).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-diningCommonsCode`)).toHaveValue(
      "dlg",
    );
    expect(screen.getByTestId(`${testId}-name`)).toHaveValue("Spaghetti");
    expect(screen.getByTestId(`${testId}-station`)).toHaveValue("Entree");
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    renderForm();

    fireEvent.click(screen.getByTestId(`${testId}-cancel`));

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("submitAction is called with form data when valid data is submitted", async () => {
    const mockSubmitAction = vi.fn();
    renderForm({ submitAction: mockSubmitAction });

    fireEvent.change(screen.getByTestId(`${testId}-diningCommonsCode`), {
      target: { value: "ortega" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-name`), {
      target: { value: "Chicken Tacos" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-station`), {
      target: { value: "Grill" },
    });
    fireEvent.click(screen.getByTestId(`${testId}-submit`));

    await waitFor(() =>
      expect(mockSubmitAction).toHaveBeenCalledWith(
        {
          diningCommonsCode: "ortega",
          name: "Chicken Tacos",
          station: "Grill",
        },
        expect.anything(),
      ),
    );
  });

  test("that the correct validations are performed", async () => {
    renderForm();

    fireEvent.click(screen.getByTestId(`${testId}-submit`));

    await screen.findByText(/Dining Commons Code is required/);
    expect(screen.getByText(/Name is required/)).toBeInTheDocument();
    expect(screen.getByText(/Station is required/)).toBeInTheDocument();

    fireEvent.change(screen.getByTestId(`${testId}-diningCommonsCode`), {
      target: { value: "   " },
    });
    fireEvent.change(screen.getByTestId(`${testId}-name`), {
      target: { value: "   " },
    });
    fireEvent.change(screen.getByTestId(`${testId}-station`), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByTestId(`${testId}-submit`));

    await screen.findByText(/Dining Commons Code cannot be blank/);
    expect(screen.getByText(/Name cannot be blank/)).toBeInTheDocument();
    expect(screen.getByText(/Station cannot be blank/)).toBeInTheDocument();
  });
});
