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
    const { container } = render(<Chart data={mockData} {...defaultFilterProps} />);

    expect(container.querySelector(".highcharts-title")).toHaveTextContent(
      "Downloads by App",
    );
    expect(container.querySelector(".highcharts-subtitle")).toHaveTextContent(
      "Jan 01, 2023 - Jan 02, 2023",
    );
  });

  it("renders revenue title and y-axis when revenue is selected", () => {
    const { container } = render(<Chart data={mockData} {...defaultFilterProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Revenue" }));

    expect(container.querySelector(".highcharts-title")).toHaveTextContent(
      "Revenue by App",
    );
    expect(container.querySelector(".highcharts-axis-title")).toHaveTextContent(
      "Revenue ($)",
    );
  });

  it("updates the subtitle when the date range changes", () => {
    const { container } = render(
      <Chart
        data={mockData}
        {...defaultFilterProps}
        startDate="2023-01-02"
        endDate="2023-01-02"
      />,
    );

    expect(container.querySelector(".highcharts-subtitle")).toHaveTextContent(
      "Jan 02, 2023 - Jan 02, 2023",
    );
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

  it("shows an empty state when data is empty and not loading", () => {
    const { container } = render(<Chart data={[]} {...defaultFilterProps} />);

    expect(container.querySelector(".highcharts-no-data")).toHaveTextContent(
      "No data available",
    );
    expect(screen.queryByRole("button", { name: "Downloads" })).not.toBeInTheDocument();
  });

  it("shows an empty state when no points fall within the selected date range", () => {
    const { container } = render(
      <Chart
        data={mockData}
        {...defaultFilterProps}
        startDate="2025-01-01"
        endDate="2025-01-07"
      />,
    );

    expect(container.querySelector(".highcharts-no-data")).toHaveTextContent(
      "No data for the selected date range",
    );
    expect(screen.getByRole("button", { name: "Downloads" })).toBeInTheDocument();
    expect(container.querySelector(".highcharts-title")).toHaveTextContent(
      "Downloads by App",
    );
  });
});
