import { fireEvent, render, screen } from "@testing-library/react";
import Controls from "./controls";

const defaultProps = {
  startDate: "2020-01-01",
  endDate: "2020-01-07",
  isInvalidRange: false,
  onStartDateChange: jest.fn(),
  onEndDateChange: jest.fn(),
};

describe("Controls", () => {
  it("renders both date fields", () => {
    render(<Controls {...defaultProps} />);

    expect(screen.getByLabelText(/start date/i)).toHaveValue("2020-01-01");
    expect(screen.getByLabelText(/end date/i)).toHaveValue("2020-01-07");
  });

  it("forwards date changes", () => {
    const onEndDateChange = jest.fn();
    render(
      <Controls
        {...defaultProps}
        onEndDateChange={onEndDateChange}
      />,
    );

    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: "2020-01-05" },
    });

    expect(onEndDateChange).toHaveBeenCalledWith("2020-01-05");
  });

  it("shows validation message when the date range is invalid", () => {
    render(<Controls {...defaultProps} isInvalidRange />);

    expect(
      screen.getAllByText("End date must be on or after start date."),
    ).toHaveLength(2);
  });
});
