import { fireEvent, render, screen } from "@testing-library/react";
import Chart from "./chart";
import type { AppData } from "../../../../types";

const mockData: AppData[] = [
  {
    id: 1,
    name: "App 1",
    icon: "https://example.com/icon.png",
    data: [
      ["2023-01-01", 100, 200],
      ["2023-01-02", 200, 300],
    ],
  },
  {
    id: 2,
    name: "App 2",
    icon: "https://example.com/icon.png",
    data: [
      ["2023-01-01", 150, 250],
      ["2023-01-02", 250, 350],
    ],
  },
];

const defaultFilterProps = {
  isLoading: false,
  startDate: "2023-01-01",
  endDate: "2023-01-02",
};

describe("Chart", () => {
  it("renders the measure toggle", () => {
    render(<Chart data={mockData} {...defaultFilterProps} />);

    expect(screen.getByRole("button", { name: "Downloads" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Revenue" })).toBeInTheDocument();
  });

  it("renders downloads y-axis label when measure is downloads", () => {
    const { container } = render(<Chart data={mockData} {...defaultFilterProps} />);

    expect(container.querySelector(".highcharts-axis-title")).toHaveTextContent(
      "Downloads",
    );
  });

  it("renders the downloads title and date range subtitle", () => {
    render(<Chart data={mockData} {...defaultFilterProps} />);

    expect(screen.getByText("Downloads by App")).toBeInTheDocument();
    expect(screen.getByText("Jan 01, 2023 - Jan 02, 2023")).toBeInTheDocument();
  });

  it("renders revenue title and y-axis when revenue is selected", () => {
    render(<Chart data={mockData} {...defaultFilterProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Revenue" }));

    expect(screen.getByText("Revenue by App")).toBeInTheDocument();
    expect(screen.getByText("Revenue ($)")).toBeInTheDocument();
  });

  it("updates the subtitle when the date range changes", () => {
    render(
      <Chart
        data={mockData}
        {...defaultFilterProps}
        startDate="2020-01-01"
        endDate="2020-01-07"
      />,
    );

    expect(screen.getByText("Jan 01, 2020 - Jan 07, 2020")).toBeInTheDocument();
  });

  it("formats x-axis dates", () => {
    render(<Chart data={mockData} {...defaultFilterProps} />);

    expect(screen.getByText("Jan 01, 23'")).toBeInTheDocument();
  });

  it("filters chart points by the selected date range", () => {
    render(
      <Chart
        data={mockData}
        {...defaultFilterProps}
        startDate="2023-01-02"
        endDate="2023-01-02"
      />,
    );

    expect(screen.getByText("Jan 02, 23'")).toBeInTheDocument();
    expect(screen.queryByText("Jan 01, 23'")).not.toBeInTheDocument();
  });

  it("shows a loading indicator while data is loading", () => {
    render(<Chart data={[]} {...defaultFilterProps} isLoading />);

    expect(screen.getByRole("status", { name: "Loading chart" })).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.queryByText("Downloads by App")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Downloads" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Revenue" })).not.toBeInTheDocument();
  });

  it("does not render a chart when data is empty and not loading", () => {
    render(<Chart data={[]} {...defaultFilterProps} />);

    expect(screen.queryByText("Downloads by App")).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Downloads" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Revenue" })).not.toBeInTheDocument();
  });
});
