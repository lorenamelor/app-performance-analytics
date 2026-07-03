import { useState } from "react";
import Controls from "./components/controls/controls";
import Chart from "./components/chart/chart";
import Table from "./components/table/table";
import useData from "../../hooks/useData";

const Dashboard = () => {
  const { data, isLoading } = useData();
  const [startDate, setStartDate] = useState("2020-01-01");
  const [endDate, setEndDate] = useState("2020-01-07");

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
