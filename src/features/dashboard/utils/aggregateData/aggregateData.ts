import type { AppDataTuple } from "../../../../types";

export type AggregatedMetrics = {
  downloads: number;
  revenueCents: number;
  rpd: number | null;
};

// Revenue in tuples is stored in cents; sum as integers before converting to dollars.
export function aggregateAppMetrics(
  tuples: AppDataTuple[],
): AggregatedMetrics {
  const downloads = tuples.reduce((sum, [, value]) => sum + value, 0);
  const revenueCents = tuples.reduce((sum, [, , value]) => sum + value, 0);
  const rpd = downloads > 0 ? revenueCents / 100 / downloads : null;

  return { downloads, revenueCents, rpd };
}
