const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatCurrencyFromCents(cents: number): string {
  return currencyFormatter.format(cents / 100);
}

export function formatRpd(rpd: number | null): string {
  if (rpd === null) {
    return "-";
  }

  return formatCurrency(rpd);
}
