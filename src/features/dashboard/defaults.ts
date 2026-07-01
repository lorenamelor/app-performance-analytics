import { dayjsUtc } from "../../config/dayjs";
import type { Measure } from "../../types";

const INPUT_DATE_FORMAT = "YYYY-MM-DD";

export const DEFAULT_MEASURE: Measure = "downloads";

export function getDefaultStartDate(): string {
  return dayjsUtc().subtract(7, "day").format(INPUT_DATE_FORMAT);
}

export function getDefaultEndDate(): string {
  return dayjsUtc().format(INPUT_DATE_FORMAT);
}
