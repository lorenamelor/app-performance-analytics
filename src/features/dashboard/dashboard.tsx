import { useMemo } from "react";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import Controls from "./components/controls/controls";
import Chart from "./components/chart/chart";
import Table from "./components/table/table";
import ErrorState from "./components/errorState/errorState";
import useData from "./hooks/useData/useData";
import useDateRangeFromUrl from "./hooks/useDateRangeFromUrl/useDateRangeFromUrl";
import { filterByDateRange } from "./utils/filterData/filterData";
import "./dashboard.css";

const DATE_FILTER_DEBOUNCE_MS = 300;

const Dashboard = () => {
  const { data, isLoading, error, refetch } = useData();
  const { startDate, endDate, isInvalidRange, setStartDate, setEndDate } =
    useDateRangeFromUrl();

  const debouncedStartDate = useDebouncedValue(startDate, DATE_FILTER_DEBOUNCE_MS);
  const debouncedEndDate = useDebouncedValue(endDate, DATE_FILTER_DEBOUNCE_MS);

  const filteredData = useMemo(
    () =>
      data.map((app) => ({
        ...app,
        data: filterByDateRange(
          app.data,
          debouncedStartDate,
          debouncedEndDate,
        ),
      })),
    [data, debouncedStartDate, debouncedEndDate],
  );

  return (
    <div className="dashboard">
      <h1 className="dashboard__title">App Performance Analytics</h1>
      <p className="dashboard__subtitle">
        Real-time monitoring of application downloads, revenues, and key
        performance indicators.
      </p>

      <Controls
        startDate={startDate}
        endDate={endDate}
        isInvalidRange={isInvalidRange}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <>
          <Chart
            data={filteredData}
            isLoading={isLoading}
            startDate={debouncedStartDate}
            endDate={debouncedEndDate}
          />
          <Table
            data={filteredData}
            isLoading={isLoading}
            startDate={debouncedStartDate}
            endDate={debouncedEndDate}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
