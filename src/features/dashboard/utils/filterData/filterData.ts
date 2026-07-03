import { dayjsUtc } from "../../../../config/dayjs";
import type { AppDataTuple } from "../../types";

export function filterByDateRange(
  tuples: AppDataTuple[],
  startDate: string,
  endDate: string,
): AppDataTuple[] {
  const start = dayjsUtc(startDate).startOf("day");
  const end = dayjsUtc(endDate).endOf("day");

  return tuples.filter(([date]) => {
    const current = dayjsUtc(date);
    return !current.isBefore(start) && !current.isAfter(end);
  });
}
