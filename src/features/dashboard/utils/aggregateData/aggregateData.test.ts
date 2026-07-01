import { aggregateAppMetrics } from "./aggregateData";
import type { AppDataTuple } from "../../../../types";

describe("aggregateAppMetrics", () => {
  it("sums downloads and revenue in cents", () => {
    const tuples: AppDataTuple[] = [
      ["2020-01-01", 100, 5000],
      ["2020-01-02", 200, 7500],
    ];

    const result = aggregateAppMetrics(tuples);

    expect(result.downloads).toBe(300);
    expect(result.revenueCents).toBe(12500);
    expect(result.rpd).toBeCloseTo(125 / 300);
  });

  it("returns rpd null when there are no downloads", () => {
    const tuples: AppDataTuple[] = [["2020-01-01", 0, 5000]];

    const result = aggregateAppMetrics(tuples);

    expect(result.downloads).toBe(0);
    expect(result.rpd).toBeNull();
  });

  it("returns zeros for an empty range", () => {
    const result = aggregateAppMetrics([]);

    expect(result).toEqual({ downloads: 0, revenueCents: 0, rpd: null });
  });
});
