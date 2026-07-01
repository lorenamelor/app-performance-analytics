import { formatNumber } from "./formatNumber";

describe("formatNumber", () => {
  it("formats integers with thousands separators", () => {
    expect(formatNumber(80000)).toBe("80,000");
  });

  it("formats zero", () => {
    expect(formatNumber(0)).toBe("0");
  });
});
