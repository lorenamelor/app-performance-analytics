import Controls from "./components/controls/controls";
import Chart from "./components/chart/chart";
import Table from "./components/table/table";
import ErrorState from "./components/errorState/errorState";
import useData from "../../hooks/useData";
import useDateRangeFromUrl from "./hooks/useDateRangeFromUrl";

const Dashboard = () => {
  const { data, isLoading, error, refetch } = useData();
  const { startDate, endDate, isInvalidRange, setStartDate, setEndDate } =
    useDateRangeFromUrl();

  return (
    <>
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
    </>
  );
};

export default Dashboard;
