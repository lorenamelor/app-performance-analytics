import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { dayjsUtc } from "../../../config/dayjs";

dayjs.extend(customParseFormat);

export const DEFAULT_START_DATE = "2020-01-01";
export const DEFAULT_END_DATE = "2020-01-07";

const PARAMS = { start: "start", end: "end" } as const;

function parseDateParam(value: string | null, fallback: string): string {
  if (!value || !dayjsUtc(value, "YYYY-MM-DD", true).isValid()) return fallback;
  return value;
}

function readDateRangeFromUrl(): { startDate: string; endDate: string } {
  const params = new URLSearchParams(window.location.search);
  return {
    startDate: parseDateParam(params.get(PARAMS.start), DEFAULT_START_DATE),
    endDate: parseDateParam(params.get(PARAMS.end), DEFAULT_END_DATE),
  };
}

function updateUrl(start: string, end: string): void {
  const params = new URLSearchParams(window.location.search);
  params.set(PARAMS.start, start);
  params.set(PARAMS.end, end);
  const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
  window.history.replaceState(null, "", newUrl);
}

const useDateRangeFromUrl = () => {
  const [dateRange, setDateRange] = useState(readDateRangeFromUrl);

  useEffect(function syncDateRangeFromUrl() {
    const handlePopState = () => {
      setDateRange(readDateRangeFromUrl());
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const setStartDate = useCallback((start: string) => {
    setDateRange((prev) => {
      const next = { startDate: start, endDate: prev.endDate };
      updateUrl(next.startDate, next.endDate);
      return next;
    });
  }, []);

  const setEndDate = useCallback((end: string) => {
    setDateRange((prev) => {
      const next = { startDate: prev.startDate, endDate: end };
      updateUrl(next.startDate, next.endDate);
      return next;
    });
  }, []);

  return {
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    setStartDate,
    setEndDate,
  };
};

export default useDateRangeFromUrl;
