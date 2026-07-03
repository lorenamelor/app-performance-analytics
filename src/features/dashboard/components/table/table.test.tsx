import { render, screen } from "@testing-library/react";
import Table from "./table";
import type { AppData } from "../../types";
import { filterByDateRange } from "../../utils/filterData/filterData";

function filterAppData(
  data: AppData[],
  startDate: string,
  endDate: string,
): AppData[] {
  return data.map((app) => ({
    ...app,
    data: filterByDateRange(app.data, startDate, endDate),
  }));
}

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

function renderTable(
  data: AppData[],
  props: Partial<typeof defaultDateProps> = {},
) {
  const { startDate, endDate, isLoading } = { ...defaultDateProps, ...props };
  return render(
    <Table
      data={filterAppData(data, startDate, endDate)}
      isLoading={isLoading}
      startDate={startDate}
      endDate={endDate}
    />,
  );
}

describe("Table", () => {
  it("renders the table title and subtitle", () => {
    renderTable(mockData);

    expect(
      screen.getByRole("heading", { name: "Application Performance Breakdown" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Dynamic cumulative performance metrics between Jan 01, 23' and Jan 02, 23'",
      ),
    ).toBeInTheDocument();
  });

  it("renders all column headers", () => {
    renderTable(mockData);

    expect(screen.getByText("App Name")).toBeInTheDocument();
    expect(screen.getByText("Downloads")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("RPD")).toBeInTheDocument();
  });

  it("aggregates metrics within the selected date range", () => {
    renderTable(mockData);

    expect(screen.getByText("300")).toBeInTheDocument();
    expect(screen.getByText("400")).toBeInTheDocument();
    expect(screen.getByText("$5.00")).toBeInTheDocument();
    expect(screen.getByText("$6.00")).toBeInTheDocument();
  });

  it("excludes data outside the selected date range", () => {
    renderTable(mockData);

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

    renderTable(dataWithLargeDownloads, {
      startDate: "2023-01-01",
      endDate: "2023-01-01",
    });

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

    renderTable(dataWithNoDownloads);

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders app icons next to app names", () => {
    const { container } = renderTable(mockData);

    const icons = container.querySelectorAll(".iconLabel__icon");
    expect(icons).toHaveLength(2);
    expect(icons[0]).toHaveAttribute("src", "https://example.com/icon.png");
    expect(screen.getByText("App 1")).toBeInTheDocument();
    expect(screen.getByText("App 2")).toBeInTheDocument();
  });

  it("shows a loading indicator while data is loading", () => {
    renderTable([], { isLoading: true });

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("shows an empty state when data is empty and not loading", () => {
    renderTable([]);

    expect(screen.getByText("No data available")).toBeInTheDocument();
    expect(screen.getByText("App Name")).toBeInTheDocument();
    expect(screen.getByText("Downloads")).toBeInTheDocument();
  });
});
