import { fireEvent, render, screen } from "@testing-library/react";
import DateField from "./dateField";

describe("DateField", () => {
  it("renders a labelled date input with the given value", () => {
    render(
      <DateField
        id="start-date"
        label="Start Date"
        value="2020-01-01"
        onChange={jest.fn()}
      />,
    );

    const input = screen.getByLabelText(/start date/i);
    expect(input).toHaveAttribute("type", "date");
    expect(input).toHaveValue("2020-01-01");
  });

  it("calls onChange with the new value", () => {
    const onChange = jest.fn();
    render(
      <DateField
        id="start-date"
        label="Start Date"
        value="2020-01-01"
        onChange={onChange}
      />,
    );

    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: "2020-01-05" },
    });

    expect(onChange).toHaveBeenCalledWith("2020-01-05");
  });

  it("shows an error message when provided", () => {
    render(
      <DateField
        id="start-date"
        label="Start Date"
        value="2020-01-10"
        error="End date must be on or after start date."
        onChange={jest.fn()}
      />,
    );

    expect(
      screen.getByText("End date must be on or after start date."),
    ).toBeInTheDocument();
  });
});
