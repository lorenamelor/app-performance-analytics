import Controls from "./components/controls/controls";
import Chart from "./components/chart/chart";
import Table from "./components/table/table";
import useData from "../../hooks/useData";
import useDateRangeFromUrl from "./hooks/useDateRangeFromUrl";

const Dashboard = () => {
  const { data, isLoading } = useData();
  const { startDate, endDate, setStartDate, setEndDate } = useDateRangeFromUrl();

  return (
    <>
      <Controls
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />
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
  );
};

export default Dashboard;
