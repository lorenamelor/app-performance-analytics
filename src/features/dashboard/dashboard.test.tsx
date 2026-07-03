import { fireEvent, render, screen } from "@testing-library/react";
import Dashboard from "./dashboard";
import type { AppData } from "../../types";

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

jest.mock("../../hooks/useData", () => ({
  __esModule: true,
  default: () => ({
    data: mockData,
    isLoading: false,
  }),
}));

describe("Dashboard", () => {
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
});
