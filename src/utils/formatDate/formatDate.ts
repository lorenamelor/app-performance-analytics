import { dayjsUtc } from "../../config/dayjs";

const DATE_FORMATS = {
  subtitle: "MMM DD, YYYY",
  chartAxis: "MMM DD, YY'",
} as const;

export function formatDateRange(startDate: string, endDate: string): string {
  const start = dayjsUtc(startDate).format(DATE_FORMATS.subtitle);
  const end = dayjsUtc(endDate).format(DATE_FORMATS.subtitle);

  return `${start} - ${end}`;
}

export function formatChartAxisDate(timestampMs: number): string {
  return dayjsUtc(timestampMs).format(DATE_FORMATS.chartAxis);
}
