import { fireEvent, render, screen } from "@testing-library/react";
import Dashboard from "./dashboard";

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
