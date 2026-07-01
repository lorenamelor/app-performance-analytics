import { fireEvent, render, screen } from "@testing-library/react";
import Controls from "./controls";

const defaultProps = {
  startDate: "2020-01-01",
  endDate: "2020-01-07",
  measure: "downloads" as const,
  onStartDateChange: jest.fn(),
  onEndDateChange: jest.fn(),
  onMeasureChange: jest.fn(),
};

describe("Controls", () => {
  it("renders both date fields and the measure toggle", () => {
    render(<Controls {...defaultProps} />);

    expect(screen.getByLabelText(/start date/i)).toHaveValue("2020-01-01");
    expect(screen.getByLabelText(/end date/i)).toHaveValue("2020-01-07");
    expect(screen.getByRole("button", { name: "Downloads" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Revenue" })).toBeInTheDocument();
  });

  it("forwards date and measure changes", () => {
    const onEndDateChange = jest.fn();
    const onMeasureChange = jest.fn();
    render(
      <Controls
        {...defaultProps}
        onEndDateChange={onEndDateChange}
        onMeasureChange={onMeasureChange}
      />,
    );

    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: "2020-01-05" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Revenue" }));

    expect(onEndDateChange).toHaveBeenCalledWith("2020-01-05");
    expect(onMeasureChange).toHaveBeenCalledWith("revenue");
  });
});
