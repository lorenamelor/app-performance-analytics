import { fireEvent, render, screen } from "@testing-library/react";
import ErrorState from "./errorState";

describe("ErrorState", () => {
  it("renders the error message and retry button", () => {
    render(
      <ErrorState
        message="Failed to load data. Please try again."
        onRetry={jest.fn()}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Failed to load data. Please try again.",
    );
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });

  it("calls onRetry when the button is clicked", () => {
    const onRetry = jest.fn();
    render(
      <ErrorState message="Something went wrong." onRetry={onRetry} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
