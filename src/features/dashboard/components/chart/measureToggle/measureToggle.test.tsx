import { fireEvent, render, screen } from "@testing-library/react";
import MeasureToggle from "./measureToggle";

describe("MeasureToggle", () => {
  it("marks the selected measure with aria-pressed", () => {
    render(<MeasureToggle value="downloads" onChange={jest.fn()} />);

    expect(screen.getByRole("button", { name: "Downloads" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Revenue" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("calls onChange with the clicked measure", () => {
    const onChange = jest.fn();
    render(<MeasureToggle value="downloads" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Revenue" }));

    expect(onChange).toHaveBeenCalledWith("revenue");
  });
});
