import { dayjsUtc } from "../../config/dayjs";
import { formatChartAxisDate, formatDateRange } from "./formatDate";

describe("formatDateRange", () => {
  it("formats start and end dates for chart subtitle", () => {
    expect(formatDateRange("2020-01-01", "2020-01-07")).toBe(
      "Jan 01, 2020 - Jan 07, 2020",
    );
  });
});

describe("formatChartAxisDate", () => {
  it("formats timestamp for chart x-axis", () => {
    const timestampMs = dayjsUtc("2020-01-01").valueOf();

    expect(formatChartAxisDate(timestampMs)).toBe("Jan 01, 20'");
  });
});
