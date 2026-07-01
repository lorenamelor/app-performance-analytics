import { render, screen } from "@testing-library/react";
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
  measure: "downloads" as const,
  startDate: "2023-01-01",
  endDate: "2023-01-02",
};

describe("Chart", () => {
  it("renders a chart", () => {
    render(<Chart data={mockData} {...defaultFilterProps} />);
    expect(screen.getByText("Downloads")).toBeInTheDocument();
  });

  it("renders the title and subtitle", () => {
    render(<Chart data={mockData} {...defaultFilterProps} />);
    expect(screen.getByText("Downloads by App")).toBeInTheDocument();
    expect(screen.getByText("TODO")).toBeInTheDocument();
  });

  it("does not render a chart if data is empty", () => {
    render(<Chart data={[]} {...defaultFilterProps} />);
    expect(screen.queryByText("Downloads")).not.toBeInTheDocument();
  });
});
