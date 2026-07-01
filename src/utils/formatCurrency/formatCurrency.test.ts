import { formatCurrency, formatCurrencyFromCents } from "./formatCurrency";

describe("formatCurrency", () => {
  it("formats dollars with currency symbol", () => {
    expect(formatCurrency(1.3)).toBe("$1.30");
  });
});

describe("formatCurrencyFromCents", () => {
  it("converts cents to dollars with formatting", () => {
    expect(formatCurrencyFromCents(14004351)).toBe("$140,043.51");
  });
});
