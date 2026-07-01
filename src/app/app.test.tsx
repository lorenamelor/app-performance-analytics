import { render, screen } from "@testing-library/react";
import App from "./app";

describe("App", () => {
  it("renders the dashboard controls", () => {
    render(<App />);

    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
  });
});
