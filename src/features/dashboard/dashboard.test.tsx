import { fireEvent, render, screen } from "@testing-library/react";
import Dashboard from "./dashboard";
import type { AppData } from "../../types";
import { FETCH_ERROR_MESSAGE } from "../../hooks/useData";

const mockData: AppData[] = [
  {
    id: 1,
    name: "App 1",
    icon: "https://example.com/icon.png",
    data: [
      ["2020-01-01", 100, 200],
      ["2020-01-02", 200, 300],
    ],
  },
];

const mockUseData = jest.fn();

jest.mock("../../hooks/useData", () => ({
  __esModule: true,
  default: () => mockUseData(),
  FETCH_ERROR_MESSAGE: "Failed to load data. Please try again.",
}));

describe("Dashboard", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
    mockUseData.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  it("renders the controls", () => {
    render(<Dashboard />);

    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Downloads" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Revenue" })).toBeInTheDocument();
  });

  it("updates the selected measure when a toggle button is clicked", () => {
    render(<Dashboard />);

    const revenueButton = screen.getByRole("button", { name: "Revenue" });
    fireEvent.click(revenueButton);

    expect(revenueButton).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Downloads" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("reads the date range from the URL", () => {
    window.history.replaceState({}, "", "/?start=2020-01-02&end=2020-01-03");

    render(<Dashboard />);

    expect(screen.getByLabelText(/start date/i)).toHaveValue("2020-01-02");
    expect(screen.getByLabelText(/end date/i)).toHaveValue("2020-01-03");
  });

  it("updates the URL when the end date changes", () => {
    render(<Dashboard />);

    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: "2020-01-10" },
    });

    const params = new URLSearchParams(window.location.search);
    expect(params.get("start")).toBe("2020-01-01");
    expect(params.get("end")).toBe("2020-01-10");
  });

  it("shows an error state with retry when data fails to load", () => {
    const refetch = jest.fn();
    mockUseData.mockReturnValue({
      data: [],
      isLoading: false,
      error: FETCH_ERROR_MESSAGE,
      refetch,
    });

    render(<Dashboard />);

    expect(screen.getByRole("alert")).toHaveTextContent(FETCH_ERROR_MESSAGE);
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Downloads" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("shows validation message when start date is after end date", () => {
    render(<Dashboard />);

    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: "2020-01-10" },
    });

    expect(
      screen.getAllByText("End date must be on or after start date."),
    ).toHaveLength(2);
  });
});
