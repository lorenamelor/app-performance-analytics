import { fireEvent, render, screen } from "@testing-library/react";
import Button from "./button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);

    fireEvent.click(screen.getByRole("button", { name: "Click me" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies the selected modifier class", () => {
    render(<Button selected>Selected</Button>);

    expect(screen.getByRole("button", { name: "Selected" })).toHaveClass(
      "button--selected",
    );
  });
});
