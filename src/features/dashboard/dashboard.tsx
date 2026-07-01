import { useState } from "react";
import Controls from "./components/controls/controls";
import Chart from "./components/chart/chart";
import Table from "./components/table/table";
import useData from "../../hooks/useData";
import type { Measure } from "../../types";
import {
  DEFAULT_MEASURE,
  getDefaultEndDate,
  getDefaultStartDate,
} from "./defaults";

const Dashboard = () => {
  const { data } = useData();
  const [measure, setMeasure] = useState<Measure>(DEFAULT_MEASURE);
  const [startDate, setStartDate] = useState(getDefaultStartDate);
  const [endDate, setEndDate] = useState(getDefaultEndDate);

  return (
    <>
      <Controls
        startDate={startDate}
        endDate={endDate}
        measure={measure}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onMeasureChange={setMeasure}
      />
      <Chart
        data={data}
        measure={measure}
        startDate={startDate}
        endDate={endDate}
      />
      <Table data={data} startDate={startDate} endDate={endDate} />
    </>
  );
};

export default Dashboard;
