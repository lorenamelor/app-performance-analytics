import Controls from "./components/controls/controls";
import Chart from "./components/chart/chart";
import Table from "./components/table/table";
import ErrorState from "./components/errorState/errorState";
import useData from "../../hooks/useData";
import useDateRangeFromUrl from "./hooks/useDateRangeFromUrl";
import "./dashboard.css";

const Dashboard = () => {
  const { data, isLoading, error, refetch } = useData();
  const { startDate, endDate, isInvalidRange, setStartDate, setEndDate } =
    useDateRangeFromUrl();

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
            data={data}
            isLoading={isLoading}
            startDate={startDate}
            endDate={endDate}
          />
          <Table
            data={data}
            isLoading={isLoading}
            startDate={startDate}
            endDate={endDate}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
