import { useCallback, useEffect, useState } from "react";
import type { AppData } from "../types";

export const FETCH_ERROR_MESSAGE = "Failed to load data. Please try again.";

const LOAD_DELAY_MS = 2000;

async function fetchDashboardData(): Promise<AppData[]> {
  const response = await fetch("/data.json");

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

const useData = () => {
  const [data, setData] = useState<AppData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const jsonData = await fetchDashboardData();
      setData(jsonData);
    } catch (fetchError) {
      console.error("Error fetching data:", fetchError);
      setData([]);
      setError(FETCH_ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(function loadDashboardDataOnMount() {
    // Simulates network latency to demonstrate the bonus loading state.
    const timer = setTimeout(loadData, LOAD_DELAY_MS);
    return () => clearTimeout(timer);
  }, [loadData]);

  const refetch = useCallback(() => {
    loadData();
  }, [loadData]);

  return { data, isLoading, error, refetch };
};

export default useData;
