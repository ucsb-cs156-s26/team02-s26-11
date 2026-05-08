import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UCSBOrganizationCreatePage from "main/pages/UCSBOrganization/UCSBOrganizationCreatePage";
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

describe("UCSBOrganizationCreatePage tests", () => {
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
          <UCSBOrganizationCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Org Code")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /ucsborganization", async () => {
    const queryClient = new QueryClient();
    const ucsbOrganization = {
      orgCode: "OSLI",
      orgTranslationShort: "STUDENT LIFE",
      orgTranslation: "OFFICE OF STUDENT LIFE",
      inactive: true,
    };

    axiosMock.onPost("/api/ucsborganization/post").reply(202, ucsbOrganization);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Org Code")).toBeInTheDocument();
    });

    const orgCodeInput = screen.getByLabelText("Org Code");
    expect(orgCodeInput).toBeInTheDocument();

    const orgTranslationShortInput = screen.getByLabelText(
      "Org Translation Short",
    );
    expect(orgTranslationShortInput).toBeInTheDocument();

    const orgTranslationInput = screen.getByLabelText("Org Translation");
    expect(orgTranslationInput).toBeInTheDocument();

    const inactiveCheckbox = screen.getByLabelText("Inactive");
    expect(inactiveCheckbox).toBeInTheDocument();

    fireEvent.click(inactiveCheckbox);

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(orgCodeInput, { target: { value: "OSLI" } });
    fireEvent.change(orgTranslationShortInput, {
      target: { value: "STUDENT LIFE" },
    });
    fireEvent.change(orgTranslationInput, {
      target: { value: "OFFICE OF STUDENT LIFE" },
    });
    fireEvent.change(inactiveCheckbox, { target: { checked: true } });

    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      orgCode: "OSLI",
      orgTranslationShort: "STUDENT LIFE",
      orgTranslation: "OFFICE OF STUDENT LIFE",
      inactive: true,
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toBeCalledWith(
      "New ucsborganization Created - orgCode: OSLI orgTranslation: OFFICE OF STUDENT LIFE",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/ucsborganizations" });
  });
});
