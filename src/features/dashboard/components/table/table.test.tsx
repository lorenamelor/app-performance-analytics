import { render, screen } from "@testing-library/react";
import Table from "./table";
import type { AppData } from "../../../../types";

const mockData: AppData[] = [
  {
    id: 1,
    name: "App 1",
    icon: "https://example.com/icon.png",
    data: [
      ["2023-01-01", 100, 200],
      ["2023-01-02", 200, 300],
      ["2023-01-10", 999, 999],
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

const defaultDateProps = {
  isLoading: false,
  startDate: "2023-01-01",
  endDate: "2023-01-02",
};

describe("Table", () => {
  it("renders all column headers", () => {
    render(<Table data={mockData} {...defaultDateProps} />);

    expect(screen.getByText("App Name")).toBeInTheDocument();
    expect(screen.getByText("Downloads")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("RPD")).toBeInTheDocument();
  });

  it("aggregates metrics within the selected date range", () => {
    render(<Table data={mockData} {...defaultDateProps} />);

    expect(screen.getByText("300")).toBeInTheDocument();
    expect(screen.getByText("400")).toBeInTheDocument();
    expect(screen.getByText("$5.00")).toBeInTheDocument();
    expect(screen.getByText("$6.00")).toBeInTheDocument();
  });

  it("excludes data outside the selected date range", () => {
    render(<Table data={mockData} {...defaultDateProps} />);

    expect(screen.queryByText("999")).not.toBeInTheDocument();
  });

  it("formats downloads with thousands separators", () => {
    const dataWithLargeDownloads: AppData[] = [
      {
        id: 1,
        name: "Big App",
        icon: "https://example.com/icon.png",
        data: [["2023-01-01", 80000, 1_000_000]],
      },
    ];

    render(
      <Table
        data={dataWithLargeDownloads}
        startDate="2023-01-01"
        endDate="2023-01-01"
        isLoading={false}
      />,
    );

    expect(screen.getByText("80,000")).toBeInTheDocument();
  });

  it("shows a dash for RPD when downloads are zero", () => {
    const dataWithNoDownloads: AppData[] = [
      {
        id: 1,
        name: "App 1",
        icon: "https://example.com/icon.png",
        data: [["2023-01-01", 0, 1_000]],
      },
    ];

    render(<Table data={dataWithNoDownloads} {...defaultDateProps} />);

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders app icons next to app names", () => {
    render(<Table data={mockData} {...defaultDateProps} />);

    expect(screen.getByRole("img", { name: "App 1" })).toHaveAttribute(
      "src",
      "https://example.com/icon.png",
    );
    expect(screen.getByRole("img", { name: "App 2" })).toBeInTheDocument();
  });

  it("shows a loading indicator while data is loading", () => {
    render(<Table data={[]} {...defaultDateProps} isLoading />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("does not render a table when data is empty and not loading", () => {
    render(<Table data={[]} {...defaultDateProps} />);

    expect(screen.queryByText("App Name")).not.toBeInTheDocument();
    expect(screen.queryByText("Downloads")).not.toBeInTheDocument();
  });
});
