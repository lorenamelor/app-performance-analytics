import { filterByDateRange } from "./filterData";
import type { AppDataTuple } from "../../types";

const tuples: AppDataTuple[] = [
  ["2020-01-01", 10, 100],
  ["2020-01-02", 20, 200],
  ["2020-01-03", 30, 300],
];

describe("filterByDateRange", () => {
  it("includes tuples on the boundary dates (inclusive)", () => {
    const result = filterByDateRange(tuples, "2020-01-01", "2020-01-03");

    expect(result).toHaveLength(3);
  });

  it("filters out tuples outside the range", () => {
    const result = filterByDateRange(tuples, "2020-01-02", "2020-01-02");

    expect(result).toEqual([["2020-01-02", 20, 200]]);
  });

  it("returns empty when the range is fully outside the data", () => {
    const result = filterByDateRange(tuples, "2021-01-01", "2021-01-31");

    expect(result).toEqual([]);
  });

  it("returns empty when startDate is after endDate", () => {
    const result = filterByDateRange(tuples, "2020-01-03", "2020-01-01");

    expect(result).toEqual([]);
  });
});
